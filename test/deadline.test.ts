import { afterEach, beforeEach, expect, it } from "vitest";
import { render } from "lit";
import { systemDeadline } from "../src/deadline";

afterEach(() => document.body.replaceChildren());
let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
});

it.each([null, "invalid"])(
  "does not invent a system deadline: %s",
  (deadline) => {
    render(systemDeadline(deadline), container);
    expect(document.querySelector(".deadline-value")!.textContent).toBe(
      "No HKTE reply deadline provided",
    );
  },
);

it("preserves Hong Kong dates and supplied time", () => {
  render(systemDeadline("2026-09-17T15:59:00Z"), container);
  expect(document.querySelector(".deadline-value")!.textContent).toBe(
    "Sep 17, 2026, 11:59 PM",
  );
});

it("does not invent time for a date-only value", () => {
  render(systemDeadline("2026-09-17"), container);
  expect(document.querySelector(".deadline-value")!.textContent).toBe(
    "Sep 17, 2026",
  );
});
