import { afterEach, describe, expect, it, vi } from "vitest";
import { HkteNoticeActions } from "../src/actions";
import type { Notice } from "../src/types";

const notice: Notice = {
  id: "n1",
  title: "Sample",
  content: "Body",
  issued_at: null,
  deadline: "2026-09-17T23:59:00+08:00",
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
  it.each([
    ["completed", false, "2026年9月11日"],
    ["completed", true, "請重新分析取得截止日期"],
    ["partial", false, "分析未完整，待確認"],
    ["running", false, "AI 分析中"],
  ])(
    "renders only a trusted AI deadline: %s stale=%s",
    async (status, stale, expected) => {
      const fetch = vi.fn().mockResolvedValue(
        response({
          enabled: true,
          status,
          stale,
          primary_deadline: {
            date: "2026-09-11",
            time: null,
            kind: "reply",
            sources: [{ attachment_id: "a1", page: 1 }],
          },
          summary: {
            highlights: [{ text: "Example", sources: [] }],
            dates: [],
            costs: [],
            actions: [],
            questions: [],
          },
          sources: [{ attachment_id: "a1", filename: "sample.pdf", page: 1 }],
        }),
      );
      const element = await mount(fetch);
      const text =
        element.shadowRoot!.querySelector(".deadline-value")!.textContent;
      expect(text).toContain(expected);
      expect(text).not.toContain("23:59");
      expect(text).not.toContain("17");
    },
  );

  it.each([
    [null, "未找到明確截止日期"],
    [undefined, "請重新分析取得截止日期"],
  ])(
    "distinguishes absent legacy field from no deadline",
    async (deadline, expected) => {
      const element = await mount(
        vi.fn().mockResolvedValue(
          response({
            enabled: true,
            status: "completed",
            primary_deadline: deadline,
            summary: {
              highlights: [{ text: "Example", sources: [] }],
              dates: [],
              costs: [],
              actions: [],
              questions: [],
            },
            sources: [],
          }),
        ),
      );
      expect(
        element.shadowRoot!.querySelector(".deadline-value")!.textContent,
      ).toContain(expected);
    },
  );

  it("can refresh a stale summary with attachment rows hidden", async () => {
    const fetch = vi.fn().mockResolvedValue(
      response({
        enabled: true,
        status: "completed",
        stale: true,
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
    element.showAttachments = false;
    await settle();
    expect(element.shadowRoot!.querySelector(".file")).toBeNull();
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[aria-label="重新分析"]',
    );
    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(false);
    fetch.mockResolvedValue(
      response({
        enabled: true,
        status: "completed",
        stale: false,
        summary: {
          highlights: [{ text: "Updated", sources: [] }],
          dates: [],
          costs: [],
          actions: [],
          questions: [],
        },
        sources: [],
      }),
    );
    button!.click();
    await settle();
    expect(fetch.mock.calls[1][1].method).toBe("POST");
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ force: true });
    expect(element.shadowRoot!.querySelector(".warning")).toBeNull();
  });
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
    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        'button[aria-label="AI 整理重點"]',
      )!
      .click();
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
    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        'button[aria-label="重新分析"]',
      )!
      .click();
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
    expect(
      element.shadowRoot!.querySelector<HTMLButtonElement>(
        'button[aria-label="AI 整理重點"]',
      )!.disabled,
    ).toBe(true);
    element
      .shadowRoot!.querySelector<HTMLButtonElement>(
        'button[aria-label="下載附件"]',
      )!
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
