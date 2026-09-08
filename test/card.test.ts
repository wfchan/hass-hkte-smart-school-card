import { describe, expect, it } from "vitest";
import { HkteNoticesCard, HkteNoticesCardEditor } from "../src/index";

describe("card", () => {
  it("renders provider content as text and never creates links", async () => {
    const card = new HkteNoticesCard();
    card.setConfig({
      type: "custom:hkte-notices-card",
      entities: ["sensor.student"],
    });
    card.hass = {
      states: {
        "sensor.student": {
          state: "1",
          attributes: {
            friendly_name: "Student Notice content",
            notices: [
              {
                id: "1",
                title: "<img>",
                content: "<script>bad</script>",
                issued_at: null,
                deadline: null,
                unread: true,
                replied: false,
                attachments: [
                  {
                    filename: "notice.pdf",
                    mime_type: "application/pdf",
                    size: 10,
                  },
                ],
              },
            ],
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll("a")).toHaveLength(0);
    expect(card.shadowRoot?.textContent).toContain("<img>");
    expect(card.shadowRoot?.textContent).toContain("notice.pdf");
  });

  it("marks read notices with a green check status", async () => {
    const card = new HkteNoticesCard();
    card.setConfig({ type: "custom:hkte-notices-card" });
    card.hass = {
      states: {
        "sensor.student": {
          state: "1",
          attributes: {
            notices: [
              {
                id: "read-1",
                title: "Read notice",
                content: "Already reviewed",
                unread: false,
              },
            ],
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    const badge = card.shadowRoot?.querySelector(".read-status");
    expect(badge?.textContent).toContain("Read");
    expect(badge?.querySelector(".status-icon")?.textContent).toBe("✓");
  });

  it("filters notices through the visible controls", async () => {
    const card = new HkteNoticesCard();
    card.setConfig({ type: "custom:hkte-notices-card" });
    card.hass = {
      states: {
        "sensor.student": {
          state: "2",
          attributes: {
            notices: [
              { id: "1", title: "Unread notice", unread: true },
              { id: "2", title: "Archived notice", unread: false },
            ],
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    const buttons = card.shadowRoot?.querySelectorAll("button");
    (buttons?.[1] as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("Unread notice");
    expect(card.shadowRoot?.textContent).not.toContain("Archived notice");
    expect(card.shadowRoot?.querySelector(".count")?.textContent).toBe("1");
  });

  it("renders unavailable and missing-feed states", async () => {
    const unavailable = new HkteNoticesCard();
    unavailable.setConfig({ type: "custom:hkte-notices-card" });
    unavailable.hass = {
      states: {
        "sensor.student": {
          state: "unavailable",
          attributes: { notices: [] },
        },
      },
    };
    document.body.append(unavailable);
    await unavailable.updateComplete;
    expect(unavailable.shadowRoot?.querySelector(".error")).not.toBeNull();

    const empty = new HkteNoticesCard();
    empty.setConfig({ type: "custom:hkte-notices-card" });
    empty.hass = { states: {} };
    document.body.append(empty);
    await empty.updateComplete;
    expect(empty.shadowRoot?.textContent).toContain(
      "No HKTE notice sensors found",
    );
  });

  it("loads and emits visual editor configuration", async () => {
    const editor = new HkteNoticesCardEditor();
    editor.setConfig({
      type: "custom:hkte-notices-card",
      title: "School",
    });
    document.body.append(editor);
    await editor.updateComplete;

    let detail: unknown;
    editor.addEventListener("config-changed", (event) => {
      detail = (event as CustomEvent).detail;
    });
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { filter: "unread" } },
      }),
    );
    expect(detail).toEqual({
      config: {
        type: "custom:hkte-notices-card",
        title: "School",
        filter: "unread",
      },
    });
  });
});
