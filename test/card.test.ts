import { describe, expect, it } from "vitest";
import { HkteNoticesCard, HkteNoticesCardEditor } from "../src/index";

describe("card", () => {
  it("defaults the configured notice limit to five", () => {
    const card = new HkteNoticesCard();
    card.setConfig({ type: "custom:hkte-notices-card" });
    expect(card.config?.limit).toBe(5);
  });

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
    expect(
      card.shadowRoot
        ?.querySelector("details")
        ?.classList.contains("unread-notice"),
    ).toBe(true);
  });

  it("marks read notices with a green check status", async () => {
    const card = new HkteNoticesCard();
    card.setConfig({
      type: "custom:hkte-notices-card",
      entity_names: { "sensor.student": "Hayhay" },
    });
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
                issued_at: "2026-09-04T09:30:00+08:00",
                unread: false,
                replied: true,
              },
            ],
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    const badge = card.shadowRoot?.querySelector(".read-status");
    expect(badge?.getAttribute("aria-label")).toBe("Read");
    expect(badge?.querySelector("svg")).not.toBeNull();
    const replied = card.shadowRoot?.querySelector(".replied-status");
    expect(replied?.getAttribute("aria-label")).toBe("Replied");
    expect(replied?.querySelector("svg")).not.toBeNull();
    expect(badge?.textContent?.trim()).toBe("");
    expect(
      card.shadowRoot?.querySelector(".issued-title")?.textContent,
    ).toContain("2026");
    expect(
      card.shadowRoot?.querySelector(".issued-title")?.textContent,
    ).not.toContain("Issued");
    expect(card.shadowRoot?.querySelector(".meta")?.textContent).not.toContain(
      "Issued",
    );
    expect(card.shadowRoot?.querySelector(".meta")?.textContent).not.toContain(
      "Replied",
    );
    expect(
      card.shadowRoot?.querySelector(".student-title")?.textContent?.trim(),
    ).toBe("Hayhay");

    const withoutStudentName = new HkteNoticesCard();
    withoutStudentName.setConfig({
      type: "custom:hkte-notices-card",
      show_student_name: false,
    });
    withoutStudentName.hass = card.hass;
    document.body.append(withoutStudentName);
    await withoutStudentName.updateComplete;
    expect(
      withoutStudentName.shadowRoot?.querySelector(".student-title"),
    ).toBeNull();
  });

  it("applies the configured filter without rendering filter controls", async () => {
    const card = new HkteNoticesCard();
    card.setConfig({ type: "custom:hkte-notices-card", filter: "unread" });
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
    expect(card.shadowRoot?.textContent).toContain("Unread notice");
    expect(card.shadowRoot?.textContent).not.toContain("Archived notice");
    expect(card.shadowRoot?.querySelector(".count")?.textContent).toBe("1");
    expect(card.shadowRoot?.querySelectorAll("button")).toHaveLength(0);
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
      entities: ["sensor.student"],
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & {
          schema?: Array<{
            name: string;
            selector?: { number?: { min: number; max: number; mode: string } };
          }>;
        })
      | null;
    expect(
      form?.schema?.find((field) => field.name === "days")?.selector,
    ).toEqual({ number: { min: 0, max: 30, mode: "box" } });
    expect(
      form?.schema?.find((field) => field.name === "show_student_name")
        ?.selector,
    ).toEqual({ boolean: {} });
    const nameField = editor.shadowRoot?.querySelector(
      ".entity-name-input",
    ) as HTMLInputElement | null;
    expect(
      editor.shadowRoot?.querySelector(".entity-name-label")?.textContent,
    ).toBe("sensor.student");

    let detail: unknown;
    editor.addEventListener("config-changed", (event) => {
      detail = (event as CustomEvent).detail;
    });
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { filter: "unread", days: 30 } },
      }),
    );
    expect(detail).toEqual({
      config: {
        type: "custom:hkte-notices-card",
        title: "School",
        entities: ["sensor.student"],
        filter: "unread",
        days: 30,
      },
    });
    nameField!.value = "Hayhay";
    nameField!.dispatchEvent(
      new Event("change", { bubbles: true, composed: true }),
    );
    expect(detail).toEqual({
      config: {
        type: "custom:hkte-notices-card",
        title: "School",
        entities: ["sensor.student"],
        entity_names: { "sensor.student": "Hayhay" },
      },
    });
  });
});
