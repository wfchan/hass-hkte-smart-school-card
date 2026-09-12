export type Answer = string | number[];
export type Answers = Record<string, Answer>;
export interface Question {
  id: string;
  label: string;
  type:
    | "acknowledgement"
    | "single_choice"
    | "multiple_choice"
    | "text"
    | "quantities"
    | "unsupported";
  required: boolean;
  options: { value: number; label: string }[];
  ranges: ({ min?: number; max?: number } | null)[];
  when: { question_id: string; option_index: number } | null;
}
export interface Operation {
  status: "pending" | "unknown" | "succeeded" | "rejected" | "not_sent";
  error?: string | null;
  retry_after: number;
  replied: boolean;
}
export interface ReplyForm {
  enabled: boolean;
  title: string;
  introduction: string;
  form_version: string;
  deadline: string | null;
  can_sign: boolean;
  supported: boolean;
  replied: boolean;
  questions: Question[];
  blocked_reasons: string[];
  operation?: Operation;
}
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown, max = 20000): v is string =>
  typeof v === "string" && v.length <= max;
const int = (v: unknown): v is number => Number.isInteger(v);
const invalid = () => {
  throw new Error("invalid_reply_form");
};

export function parseOperation(v: unknown): Operation {
  if (
    !record(v) ||
    !["pending", "unknown", "succeeded", "rejected", "not_sent"].includes(
      String(v.status),
    ) ||
    typeof v.replied !== "boolean" ||
    !int(v.retry_after) ||
    v.retry_after < 0 ||
    (v.status === "succeeded" && v.replied !== true) ||
    (v.error != null && !text(v.error, 100))
  )
    return invalid();
  return v as unknown as Operation;
}

export function parseForm(v: unknown): ReplyForm | undefined {
  if (record(v) && v.enabled === false) return undefined;
  if (
    !record(v) ||
    v.enabled !== true ||
    !text(v.title, 1000) ||
    !text(v.introduction) ||
    !text(v.form_version, 64) ||
    !/^[a-f0-9]{64}$/.test(v.form_version) ||
    (v.deadline !== null && !text(v.deadline, 100)) ||
    typeof v.can_sign !== "boolean" ||
    typeof v.supported !== "boolean" ||
    typeof v.replied !== "boolean" ||
    !Array.isArray(v.blocked_reasons) ||
    v.blocked_reasons.length > 200 ||
    !v.blocked_reasons.every((x) => text(x)) ||
    !Array.isArray(v.questions) ||
    v.questions.length > 200
  )
    return invalid();
  const known = new Map<string, Question>();
  for (const q of v.questions) {
    if (
      !record(q) ||
      !text(q.id, 200) ||
      !q.id ||
      known.has(q.id) ||
      !text(q.label) ||
      ![
        "acknowledgement",
        "single_choice",
        "multiple_choice",
        "text",
        "quantities",
        "unsupported",
      ].includes(String(q.type)) ||
      typeof q.required !== "boolean" ||
      !Array.isArray(q.options) ||
      q.options.length > 200 ||
      !q.options.every(
        (o, i) => record(o) && o.value === i && text(o.label, 4000),
      ) ||
      !Array.isArray(q.ranges) ||
      q.ranges.length > q.options.length ||
      !q.ranges.every(
        (r) =>
          r === null ||
          (record(r) &&
            Object.keys(r).every((k) => ["min", "max"].includes(k)) &&
            Object.values(r).every((n) => int(n) && n >= -1 && n <= 100000)),
      ) ||
      (["single_choice", "multiple_choice", "quantities"].includes(
        String(q.type),
      ) &&
        !q.options.length)
    )
      return invalid();
    if (q.when !== null) {
      if (
        !record(q.when) ||
        !text(q.when.question_id, 200) ||
        !int(q.when.option_index) ||
        q.when.option_index < 0
      )
        return invalid();
      const parent = known.get(q.when.question_id);
      if (
        !parent ||
        !["single_choice", "multiple_choice", "quantities", "text"].includes(
          parent.type,
        ) ||
        q.when.option_index >=
          (parent.type === "text" ? 1 : parent.options.length)
      )
        return invalid();
    }
    known.set(q.id, q as unknown as Question);
  }
  if (v.operation !== undefined) parseOperation(v.operation);
  return v as unknown as ReplyForm;
}

export function activeQuestions(form: ReplyForm, answers: Answers): Question[] {
  const active = new Map<string, Question>();
  for (const q of form.questions) {
    if (q.when) {
      const parent = active.get(q.when.question_id);
      if (!parent) continue;
      const answer = answers[parent.id];
      const i = q.when.option_index;
      const enabled =
        parent.type === "text"
          ? typeof answer === "string" && !!answer.trim()
          : Array.isArray(answer) &&
            (parent.type === "quantities" ? answer[i] > 0 : answer.includes(i));
      if (!enabled) continue;
    }
    active.set(q.id, q);
  }
  return [...active.values()];
}

export function selectedAnswers(form: ReplyForm, answers: Answers): Answers {
  return Object.fromEntries(
    activeQuestions(form, answers)
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => [q.id, answers[q.id]]),
  );
}

export function validAnswers(form: ReplyForm, answers: Answers): boolean {
  if (!form.can_sign || !form.supported || form.replied) return false;
  return activeQuestions(form, answers).every((q) => {
    const a = answers[q.id];
    if (q.type === "unsupported") return false;
    if (q.type === "acknowledgement") return a === undefined || a === "";
    if (a === undefined) return !q.required;
    if (q.type === "text")
      return (
        typeof a === "string" &&
        a.length <= 10000 &&
        (!q.required || !!a.trim())
      );
    if (
      !Array.isArray(a) ||
      !a.every((n) => Number.isInteger(n) && n >= 0 && n <= 100000)
    )
      return false;
    if (q.type === "quantities")
      return (
        a.length === q.options.length &&
        (!q.required || a.some((n) => n > 0)) &&
        a.every((n, i) => {
          const r = q.ranges[i];
          return (
            (!r || r.min == null || r.min < 0 || n >= r.min) &&
            (!r || r.max == null || r.max < 0 || n <= r.max)
          );
        })
      );
    return (
      (!q.required || a.length > 0) &&
      (q.type !== "single_choice" || a.length <= 1) &&
      new Set(a).size === a.length &&
      a.every((n) => q.options.some((o) => o.value === n))
    );
  });
}

export function answerText(q: Question, a: Answer | undefined): string {
  if (typeof a === "string") return a;
  if (!a) return "—";
  return q.type === "quantities"
    ? q.options.map((o, i) => `${o.label}: ${a[i]}`).join(" / ")
    : q.options
        .filter((o) => a.includes(o.value))
        .map((o) => o.label)
        .join(" / ");
}
