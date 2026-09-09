import { describe, expect, it } from "vitest";
import { parseAnalysisState } from "../src/analysis-state";

const valid = () => ({
  enabled: true,
  status: "completed",
  summary: {
    highlights: [
      { text: "School meeting", sources: [{ attachment_id: "a1", page: 1 }] },
    ],
    dates: [],
    costs: [],
    actions: [],
    questions: [],
  },
  sources: [{ attachment_id: "a1", filename: "meeting.pdf", page: 1 }],
});

describe("analysis response contract", () => {
  it("accepts the fixed five-section contract", () => {
    expect(parseAnalysisState(valid())).toEqual(valid());
  });
  it.each([
    null,
    [],
    {},
    { enabled: true, status: "completed" },
    { ...valid(), sources: null },
    { ...valid(), missing: [null] },
    { ...valid(), summary: { ...valid().summary, dates: "invalid" } },
    { ...valid(), summary: { ...valid().summary, extra: [] } },
    { ...valid(), processed: -1 },
    { ...valid(), error: {} },
    {
      ...valid(),
      sources: [{ attachment_id: "wrong", filename: "unknown.pdf", page: 1 }],
    },
    {
      ...valid(),
      summary: {
        ...valid().summary,
        highlights: [{ text: "x".repeat(2001), sources: [] }],
      },
    },
  ])("rejects unsafe or malformed responses: %j", (data) => {
    expect(() => parseAnalysisState(data)).toThrow("invalid_ai_response");
  });
});
