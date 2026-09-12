import { describe, expect, it } from "vitest";
import {
  activeQuestions,
  parseForm,
  parseOperation,
  selectedAnswers,
  validAnswers,
} from "../src/reply-form";

import { fixtureForm } from "./fixtures/reply-form";
describe("reply form contract", () => {
  it("never defaults consent and only submits active answers", () => {
    const f = fixtureForm();
    expect(parseForm(f)).toEqual(f);
    expect(validAnswers(f, {})).toBe(false);
    expect(validAnswers(f, { main: [0] })).toBe(false);
    expect(validAnswers(f, { main: [0], "question:123": "2" })).toBe(true);
    expect(validAnswers(f, { main: [1] })).toBe(true);
    expect(selectedAnswers(f, { main: [1], "question:123": "2" })).toEqual({
      main: [1],
    });
    expect(activeQuestions(f, { main: [1] }).length).toBe(1);
  });
  it("validates quantities and required ranges", () => {
    const f = fixtureForm();
    f.questions = [
      {
        ...f.questions[0],
        type: "quantities",
        ranges: [{ min: 0, max: 2 }, null],
      },
    ];
    expect(validAnswers(f, {})).toBe(false);
    expect(validAnswers(f, { main: [0, 0] })).toBe(false);
    expect(validAnswers(f, { main: [3, 0] })).toBe(false);
    expect(validAnswers(f, { main: [2, 0] })).toBe(true);
  });
  it.each([{ can_sign: false }, { supported: false }, { replied: true }])(
    "blocks unavailable form %j",
    (change) => {
      expect(validAnswers({ ...fixtureForm(), ...change }, { main: [1] })).toBe(
        false,
      );
    },
  );
  it.each([
    null,
    {},
    { ...fixtureForm(), form_version: "invalid" },
    {
      ...fixtureForm(),
      questions: [
        {
          ...fixtureForm().questions[0],
          when: { question_id: "missing", option_index: 0 },
        },
      ],
    },
    {
      ...fixtureForm(),
      questions: [{ ...fixtureForm().questions[0], type: "payment" }],
    },
  ])("rejects malformed forms %j", (value) => {
    expect(() => parseForm(value)).toThrow("invalid_reply_form");
  });
  it("does not accept unverified success", () => {
    expect(() =>
      parseOperation({ status: "succeeded", replied: false, retry_after: 0 }),
    ).toThrow();
  });
});
