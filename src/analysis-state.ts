export const SUMMARY_SECTIONS = [
  "highlights",
  "dates",
  "costs",
  "actions",
  "questions",
] as const;

export interface Source {
  attachment_id: string;
  filename: string;
  page: number;
}
interface SummaryItem {
  text: string;
  sources: Omit<Source, "filename">[];
}
export interface AiDeadline {
  date: string;
  time: string | null;
  kind: "reply" | "submission";
  sources: Omit<Source, "filename">[];
}
export interface AnalysisState {
  enabled: boolean;
  status: "idle" | "running" | "completed" | "partial" | "failed";
  stage?: string;
  processed?: number;
  error?: string;
  stale?: boolean;
  primary_deadline?: AiDeadline | null;
  summary?: Record<(typeof SUMMARY_SECTIONS)[number], SummaryItem[]>;
  sources?: Source[];
  missing?: { filename: string; error: string }[];
}

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const boundedText = (value: unknown, limit: number): value is string =>
  typeof value === "string" && value.length <= limit;

function validState(value: unknown): value is AnalysisState {
  if (
    !record(value) ||
    typeof value.enabled !== "boolean" ||
    !["idle", "running", "completed", "partial", "failed"].includes(
      String(value.status),
    )
  )
    return false;
  if (
    value.stage !== undefined &&
    !["downloading", "rendering", "analyzing"].includes(String(value.stage))
  )
    return false;
  for (const key of ["stage", "error"])
    if (value[key] !== undefined && !boundedText(value[key], 100)) return false;
  if (value.stale !== undefined && typeof value.stale !== "boolean")
    return false;
  if (
    value.processed !== undefined &&
    (!Number.isInteger(value.processed) ||
      Number(value.processed) < 0 ||
      Number(value.processed) > 10)
  )
    return false;
  if (
    value.missing !== undefined &&
    (!Array.isArray(value.missing) ||
      value.missing.length > 10 ||
      !value.missing.every(
        (item) =>
          record(item) &&
          boundedText(item.filename, 4096) &&
          boundedText(item.error, 100),
      ))
  )
    return false;
  if (
    value.sources !== undefined &&
    (!Array.isArray(value.sources) ||
      value.sources.length > 21 ||
      !value.sources.every(
        (source) =>
          record(source) &&
          boundedText(source.attachment_id, 4096) &&
          boundedText(source.filename, 4096) &&
          Number.isInteger(source.page) &&
          Number(source.page) >= 0 &&
          Number(source.page) <= 20,
      ))
  )
    return false;
  if (value.summary === undefined)
    return (
      value.primary_deadline == null &&
      !["completed", "partial"].includes(String(value.status))
    );
  if (
    !record(value.summary) ||
    Object.keys(value.summary).length !== SUMMARY_SECTIONS.length ||
    !Array.isArray(value.sources)
  )
    return false;
  const sources = value.sources;
  if (value.primary_deadline !== undefined && value.primary_deadline !== null) {
    const d = value.primary_deadline;
    if (
      !record(d) ||
      Object.keys(d).length !== 4 ||
      typeof d.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ||
      !Number.isFinite(Date.parse(d.date)) ||
      new Date(d.date).toISOString().slice(0, 10) !== d.date ||
      (d.time !== null &&
        (typeof d.time !== "string" ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(d.time))) ||
      !["reply", "submission"].includes(String(d.kind)) ||
      !Array.isArray(d.sources) ||
      d.sources.length === 0 ||
      d.sources.length > 20 ||
      !d.sources.every(
        (ref) =>
          record(ref) &&
          Object.keys(ref).length === 2 &&
          typeof ref.attachment_id === "string" &&
          Number.isInteger(ref.page) &&
          sources.some(
            (s) => s.attachment_id === ref.attachment_id && s.page === ref.page,
          ),
      )
    )
      return false;
  }
  let characters = 0;
  for (const key of SUMMARY_SECTIONS) {
    const items = value.summary[key];
    if (!Array.isArray(items) || items.length > 20) return false;
    for (const item of items) {
      if (
        !record(item) ||
        Object.keys(item).length !== 2 ||
        !boundedText(item.text, 2000) ||
        !item.text.trim() ||
        !Array.isArray(item.sources) ||
        item.sources.length > 20
      )
        return false;
      characters += item.text.length;
      if (
        !item.sources.every(
          (ref) =>
            record(ref) &&
            Object.keys(ref).length === 2 &&
            typeof ref.attachment_id === "string" &&
            Number.isInteger(ref.page) &&
            sources.some(
              (source) =>
                source.attachment_id === ref.attachment_id &&
                source.page === ref.page,
            ),
        )
      )
        return false;
    }
  }
  return characters > 0 && characters <= 16000;
}

/** API data, including older cached results, is untrusted until validated. */
export function parseAnalysisState(value: unknown): AnalysisState {
  if (!validState(value)) throw new Error("invalid_ai_response");
  return value;
}
