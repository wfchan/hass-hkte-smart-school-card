import type { ReplyForm } from "../../src/reply-form";

export const fixtureForm = (): ReplyForm => ({
  enabled: true,
  title: "Synthetic school notice",
  introduction: "Please choose your reply.",
  deadline: "2026-09-30T23:59:00+08:00",
  form_version: "a".repeat(64),
  replied: false,
  can_sign: true,
  supported: true,
  blocked_reasons: [],
  questions: [
    {
      id: "main",
      label: "Participate?",
      type: "single_choice",
      required: true,
      options: [
        { value: 0, label: "Yes" },
        { value: 1, label: "No" },
      ],
      ranges: [],
      when: null,
    },
    {
      id: "question:123",
      label: "Number of guests",
      type: "text",
      required: true,
      options: [],
      ranges: [],
      when: { question_id: "main", option_index: 0 },
    },
  ],
});
