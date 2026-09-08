import { describe, expect, it } from "vitest";
import {
  clampLimit,
  discoverFeeds,
  normalizeFeed,
  visibleNotices,
} from "../src/data";

const state = (notices: unknown[], extra: Record<string, unknown> = {}) => ({
  state: "3",
  attributes: { friendly_name: "Student 通告內容", notices, ...extra },
});

describe("notice data", () => {
  it("normalizes, sorts and bounds provider records", () => {
    const feed = normalizeFeed(
      "sensor.student",
      state([
        {
          id: "old",
          title: "Old",
          issued_at: "2026-09-01T00:00:00+08:00",
          unread: false,
        },
        {
          id: "new",
          title: "New",
          issued_at: "2026-09-02T00:00:00+08:00",
          unread: true,
          attachments: [
            { filename: "a.pdf", mime_type: "application/pdf", size: 2048 },
          ],
        },
        { id: "new", title: "Duplicate" },
        "bad",
      ]),
    );
    expect(feed?.notices.map((item) => item.id)).toEqual(["new", "old"]);
    expect(feed?.notices[0].attachments[0].size).toBe(2048);
  });
  it("discovers only notice feeds and filters unread records", () => {
    const hass = {
      states: {
        "sensor.one": state([{ id: "1", title: "Unread", unread: true }]),
        "sensor.other": { state: "1", attributes: { foo: "bar" } },
      },
    };
    const feeds = discoverFeeds(hass);
    expect(feeds).toHaveLength(1);
    expect(visibleNotices(feeds[0], "unread", 20)).toHaveLength(1);
    expect(visibleNotices(feeds[0], "all", 20)).toHaveLength(1);
  });
  it("honors explicit entity selection and clamps limits", () => {
    const hass = {
      states: {
        "sensor.one": state([{ id: "1" }]),
        "sensor.two": state([{ id: "2" }]),
      },
    };
    expect(discoverFeeds(hass, ["sensor.two"])[0].entityId).toBe("sensor.two");
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(99)).toBe(20);
    expect(clampLimit("bad")).toBe(20);
  });
});
