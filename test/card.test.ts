import { describe, expect, it } from "vitest";
import { HkteNoticesCard } from "../src/index";

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
});
