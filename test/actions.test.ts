import { afterEach, describe, expect, it, vi } from "vitest";
import { HkteNoticeActions } from "../src/actions";
import type { Notice } from "../src/types";

const notice: Notice = {
  id: "n1",
  title: "Sample",
  content: "Body",
  issued_at: null,
  deadline: null,
  unread: true,
  replied: false,
  content_truncated: false,
  attachments: [
    { id: "a1", filename: "sample.pdf", mime_type: "FILE", size: 1024 },
  ],
};
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });
const settle = async () => {
  for (let i = 0; i < 15; i++) await Promise.resolve();
};
async function mount(fetchWithAuth: ReturnType<typeof vi.fn>) {
  const element = new HkteNoticeActions();
  element.notice = notice;
  element.entityId = "sensor.child_notice_content";
  element.showAttachments = true;
  element.hass = { states: {}, locale: { language: "zh-Hant" }, fetchWithAuth };
  document.body.append(element);
  await settle();
  return element;
}
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("notice actions", () => {
  it("only reads cached status until explicitly started and polls progress", async () => {
    vi.useFakeTimers();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ enabled: true, status: "idle" }))
      .mockResolvedValueOnce(
        response({
          enabled: true,
          status: "running",
          stage: "rendering",
          processed: 0,
        }),
      )
      .mockResolvedValueOnce(
        response({
          enabled: true,
          status: "completed",
          summary: {
            dates: [],
            costs: [],
            actions: [],
            questions: [],
            highlights: [
              {
                text: "<script>untrusted</script>",
                sources: [{ attachment_id: "a1", page: 1 }],
              },
            ],
          },
          sources: [{ attachment_id: "a1", filename: "sample.pdf", page: 1 }],
        }),
      );
    const element = await mount(fetch);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1]).toBeUndefined();
    element.shadowRoot!.querySelectorAll("button")[1].click();
    await settle();
    expect(fetch.mock.calls[1][1].method).toBe("POST");
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ force: false });
    expect(element.shadowRoot!.textContent).toContain("處理附件頁面");
    await vi.advanceTimersByTimeAsync(2000);
    await settle();
    expect(element.shadowRoot!.textContent).not.toContain("sample.pdf · 第1頁");
    expect(
      element.shadowRoot!.querySelector(".summary")!.textContent,
    ).not.toContain("sample.pdf");
    expect(element.shadowRoot!.textContent).toContain(
      "<script>untrusted</script>",
    );
    expect(element.shadowRoot!.querySelector("script")).toBeNull();
    expect(
      element.shadowRoot!.querySelector('button[aria-label="重新分析"]'),
    ).not.toBeNull();
    expect(element.shadowRoot!.querySelectorAll("h4")).toHaveLength(5);
    expect(element.shadowRoot!.textContent).toContain("未提供");
    fetch.mockResolvedValue(response({ enabled: true, status: "running" }));
    element.shadowRoot!.querySelectorAll("button")[1].click();
    await settle();
    expect(JSON.parse(fetch.mock.calls[3][1].body)).toEqual({ force: true });
    element.remove();
    await vi.advanceTimersByTimeAsync(4000);
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it("downloads through HA auth without exposing provider URLs", async () => {
    vi.useFakeTimers();
    const create = vi.fn().mockReturnValue("blob:fixture");
    const revoke = vi.fn();
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = create;
        static revokeObjectURL = revoke;
      },
    );
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ enabled: false, status: "idle" }))
      .mockResolvedValueOnce(new Response("%PDF-fixture"));
    const element = await mount(fetch);
    expect(element.shadowRoot!.querySelectorAll("button")[1].disabled).toBe(
      true,
    );
    element
      .shadowRoot!.querySelector<HTMLButtonElement>("button.icon")!
      .click();
    await settle();
    expect(fetch.mock.calls[1][0]).toBe(
      "/api/hkte_smart_school/notice/sensor.child_notice_content/n1/attachment/a1",
    );
    expect(click).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1000);
    expect(revoke).toHaveBeenCalledWith("blob:fixture");
    vi.unstubAllGlobals();
  });

  it("shows errors and allows explicit connection retry", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(
        response({
          enabled: true,
          status: "partial",
          stale: true,
          missing: [{ filename: "broken.pdf", error: "unreadable_file" }],
          summary: {
            highlights: [{ text: "Example", sources: [] }],
            dates: [],
            costs: [],
            actions: [],
            questions: [],
          },
          sources: [],
        }),
      );
    const element = await mount(fetch);
    expect(element.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();
    Array.from(element.shadowRoot!.querySelectorAll("button"))
      .find((b) => b.textContent?.includes("重試連線"))!
      .click();
    await settle();
    expect(element.shadowRoot!.textContent).toContain("部分完成");
    expect(element.shadowRoot!.textContent).toContain("broken.pdf");
    expect(element.shadowRoot!.textContent).toContain("請重新分析");
  });

  it("rejects malformed API data without breaking rendering and can retry", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        response({
          enabled: true,
          status: "completed",
          summary: { highlights: "broken" },
        }),
      )
      .mockResolvedValueOnce(response({ enabled: true, status: "idle" }));
    const element = await mount(fetch);
    expect(
      element.shadowRoot!.querySelector('[role="alert"]')?.textContent,
    ).toContain("AI 回應格式");
    expect(element.shadowRoot!.querySelector(".summary")).toBeNull();
    Array.from(element.shadowRoot!.querySelectorAll("button"))
      .find((b) => b.textContent?.includes("重試連線"))!
      .click();
    await settle();
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
  });
});
