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
  it.each([
    { date: "2026-02-30" },
    { time: "24:00" },
    { kind: "event" },
    { sources: [] },
    { sources: [{ attachment_id: "wrong", page: 1 }] },
  ])("rejects malformed AI deadlines: %j", (change) => {
    expect(() =>
      parseAnalysisState({
        ...valid(),
        primary_deadline: {
          date: "2026-09-11",
          time: null,
          kind: "reply",
          sources: [{ attachment_id: "a1", page: 1 }],
          ...change,
        },
      }),
    ).toThrow("invalid_ai_response");
  });
  it("rejects a deadline without a summary", () => {
    expect(() =>
      parseAnalysisState({
        enabled: true,
        status: "idle",
        primary_deadline: { date: "2026-09-11" },
      }),
    ).toThrow("invalid_ai_response");
  });
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
    { ...valid(), stage: "provider_secret" },
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
