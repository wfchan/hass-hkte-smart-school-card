import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HkteSignNotice } from "../src/sign-notice";
import type { Notice } from "../src/types";
import { fixtureForm } from "./fixtures/reply-form";

const notice: Notice = {
  id: "notice-1",
  title: "Synthetic school notice",
  content: "",
  issued_at: null,
  deadline: null,
  unread: true,
  replied: false,
  content_truncated: false,
  attachments: [],
};
const settle = async () => {
  for (let i = 0; i < 30; i++) await Promise.resolve();
};
const response = (v: unknown) => new Response(JSON.stringify(v));
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
async function mount(
  fetch = vi
    .fn()
    .mockImplementation(() => Promise.resolve(response(fixtureForm()))),
) {
  const e = new HkteSignNotice();
  e.notice = notice;
  e.entityId = "sensor.fixture_notice_content";
  e.hass = { states: {}, fetchWithAuth: fetch };
  document.body.append(e);
  await settle();
  return { e, fetch };
}
const button = (e: HkteSignNotice, text: string) =>
  [...e.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")].find(
    (b) => b.textContent?.trim() === text,
  )!;
async function chooseNoAndReview(e: HkteSignNotice) {
  button(e, "Sign notice").click();
  await settle();
  const options = e.shadowRoot!.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]',
  );
  expect([...options].some((o) => o.checked)).toBe(false);
  options[1].checked = true;
  options[1].dispatchEvent(new Event("change"));
  await settle();
  button(e, "Review reply").click();
  await settle();
}
it("opening and choosing never signs; explicit reviewed confirmation submits exact answers", async () => {
  const { e, fetch } = await mount();
  await chooseNoAndReview(e);
  expect(fetch.mock.calls.every((c) => c[1] === undefined)).toBe(true);
  expect(e.shadowRoot!.querySelector("dl")!.textContent).toContain("No");
  expect(e.shadowRoot!.querySelector("dl")!.textContent).not.toContain(
    "Number of guests",
  );
  fetch.mockResolvedValue(
    response({ status: "succeeded", replied: true, retry_after: 0 }),
  );
  button(e, "Confirm and sign").click();
  button(e, "Confirm and sign")?.click();
  await settle();
  const posts = fetch.mock.calls.filter((c) => c[1]?.method === "POST");
  expect(posts).toHaveLength(1);
  expect(JSON.parse(posts[0][1].body)).toEqual({
    form_version: "a".repeat(64),
    answers: { main: [1] },
    comment: "",
    confirmed: true,
  });
  expect(e.shadowRoot!.textContent).toContain("Signature confirmed by HKTE");
});
it("blocks missing required answers and cancelled signing", async () => {
  const { e, fetch } = await mount();
  button(e, "Sign notice").click();
  await settle();
  expect(button(e, "Review reply").disabled).toBe(true);
  button(e, "Close").click();
  await settle();
  expect(fetch.mock.calls.every((c) => c[1] === undefined)).toBe(true);
});
it("uncertain response permits status reconciliation only", async () => {
  const { e, fetch } = await mount();
  await chooseNoAndReview(e);
  fetch.mockRejectedValue(new Error("network"));
  button(e, "Confirm and sign").click();
  await settle();
  expect(button(e, "Confirm and sign")).toBeUndefined();
  fetch.mockResolvedValue(
    response({ status: "unknown", replied: false, retry_after: 200 }),
  );
  button(e, "Check result").click();
  await settle();
  expect(fetch.mock.calls.at(-1)![0]).toMatch(/sign-status$/);
  expect(e.shadowRoot!.textContent).toContain("Do not sign again");
});
it("hides signing when API reports unavailable", async () => {
  const { e } = await mount(
    vi.fn().mockImplementation(() =>
      Promise.resolve(
        response({
          ...fixtureForm(),
          can_sign: false,
          blocked_reasons: ["Expired"],
        }),
      ),
    ),
  );
  expect(button(e, "Sign notice")).toBeUndefined();
  expect(e.shadowRoot!.textContent).toContain("Expired");
});
it("does not execute HTML from a reply form", async () => {
  const f = fixtureForm();
  f.title = "<img onerror=alert(1)>";
  const { e } = await mount(
    vi.fn().mockImplementation(() => Promise.resolve(response(f))),
  );
  expect(e.shadowRoot!.querySelector("img")).toBeNull();
  expect(e.shadowRoot!.textContent).toContain(f.title);
});
