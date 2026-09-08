import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { clampLimit, discoverFeeds, visibleNotices } from "./data";
import type {
  ExpandedMode,
  HkteNoticesCardConfig,
  HomeAssistant,
  Notice,
  NoticeFilter,
  NoticeFeed,
} from "./types";

const LABELS = {
  zh: {
    all: "全部",
    unread: "未讀",
    read: "已讀",
    issued: "發出",
    deadline: "截止",
    replied: "已回覆",
    noReply: "未回覆",
    noBody: "此通告未提供文字正文。",
    truncated: "正文超過顯示上限。",
    noNotices: "暫無通告。",
    unavailable: "通告資料暫時無法載入。",
    noEntities: "找不到 HKTE 通告 sensor。",
    more: "尚有其他通告",
    attachments: "附件",
    noDate: "未提供",
  },
  en: {
    all: "All",
    unread: "Unread",
    read: "Read",
    issued: "Issued",
    deadline: "Deadline",
    replied: "Replied",
    noReply: "Not replied",
    noBody: "This notice has no text content.",
    truncated: "The notice body is truncated.",
    noNotices: "No notices.",
    unavailable: "Notice data is temporarily unavailable.",
    noEntities: "No HKTE notice sensors found.",
    more: "More notices are available",
    attachments: "Attachments",
    noDate: "Not provided",
  },
} as const;
type Labels = { [Key in keyof (typeof LABELS)["zh"]]: string };

function labels(hass?: HomeAssistant): Labels {
  const language = (
    hass?.locale?.language ??
    hass?.config?.language ??
    "en"
  ).toLowerCase();
  return language.startsWith("zh") ? LABELS.zh : LABELS.en;
}
function studentName(name: string, entityId: string): string {
  return (
    name.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || entityId
  );
}
function formatDate(value: string | null, hass?: HomeAssistant): string {
  const text = labels(hass);
  if (!value) return text.noDate;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return new Intl.DateTimeFormat(hass?.locale?.language || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return value;
  }
}
function formatSize(size: number | null): string {
  if (size === null) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1048576) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1048576).toFixed(1)} MB`;
}

export class HkteNoticesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    _filter: { state: true },
  };
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    ha-card {
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 20px 12px;
    }
    h1 {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.3;
      font-weight: 600;
    }
    .count {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .toolbar {
      display: flex;
      gap: 6px;
      padding: 0 20px 14px;
      border-bottom: 1px solid var(--divider-color);
    }
    button {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 12px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    button:hover {
      background: var(--secondary-background-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[aria-pressed="true"] {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .content {
      padding: 4px 20px 18px;
    }
    .student {
      padding-top: 14px;
    }
    .student + .student {
      border-top: 1px solid var(--divider-color);
      margin-top: 10px;
    }
    .student-title {
      margin: 0 0 8px;
      font-size: 0.98rem;
      font-weight: 600;
    }
    details {
      border-bottom: 1px solid var(--divider-color);
    }
    details:last-child {
      border-bottom: 0;
    }
    summary {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
      padding: 13px 0;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary::before {
      content: "›";
      flex: none;
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      line-height: 1;
      transform: rotate(0deg);
    }
    details[open] summary::before {
      transform: rotate(90deg);
    }
    .title {
      min-width: 0;
      overflow-wrap: anywhere;
      font-weight: 550;
    }
    .unread {
      flex: none;
      border-radius: 4px;
      padding: 2px 6px;
      color: var(--text-primary-color, var(--primary-text-color));
      background: var(--warning-color, #d89b00);
      font-size: 0.72rem;
      font-weight: 650;
    }
    .read-status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex: none;
      border: 1px solid var(--success-color, #2e9d68);
      border-radius: 4px;
      padding: 2px 6px;
      color: var(--success-color, #2e9d68);
      background: color-mix(
        in srgb,
        var(--success-color, #2e9d68) 12%,
        transparent
      );
      font-size: 0.72rem;
      font-weight: 650;
    }
    .status-icon {
      display: inline-grid;
      width: 0.95em;
      height: 0.95em;
      place-items: center;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 0.78em;
      line-height: 1;
    }
    .body {
      padding: 0 0 14px 20px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.55;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      padding: 0 0 10px 20px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .status {
      color: var(--primary-color);
    }
    .attachment {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      padding: 4px 0 4px 20px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .attachment-name {
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .hint,
    .empty {
      padding: 18px 0 4px;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    @media (max-width: 480px) {
      .header,
      .toolbar,
      .content {
        padding-left: 14px;
        padding-right: 14px;
      }
      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
      }
      button {
        flex: 1;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      summary::before {
        transition: transform 120ms ease;
      }
      details[open] .body,
      details[open] .meta {
        animation: reveal 120ms ease-out;
      }
      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(-2px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  `;
  declare hass?: HomeAssistant;
  declare config?: HkteNoticesCardConfig;
  declare private _filter: NoticeFilter;
  constructor() {
    super();
    this._filter = "all";
  }
  static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("hkte-notices-card-editor");
  }
  static getStubConfig(): HkteNoticesCardConfig {
    return {
      type: "custom:hkte-notices-card",
      title: "HKTE Notices",
      filter: "all",
      limit: 20,
      initially_expanded: "latest",
      show_attachments: true,
    };
  }
  setConfig(config: HkteNoticesCardConfig): void {
    if (!config || config.type !== "custom:hkte-notices-card")
      throw new Error("Invalid HKTE notices card configuration");
    const expanded = ["latest", "none", "all"].includes(
      config.initially_expanded ?? "latest",
    )
      ? (config.initially_expanded ?? "latest")
      : "latest";
    this.config = {
      ...config,
      entities: Array.isArray(config.entities)
        ? config.entities.filter(
            (entity): entity is string => typeof entity === "string",
          )
        : undefined,
      filter: config.filter === "unread" ? "unread" : "all",
      limit: clampLimit(config.limit),
      initially_expanded: expanded,
      show_attachments: config.show_attachments !== false,
    };
    this._filter = this.config.filter ?? "all";
  }
  getCardSize(): number {
    return 4;
  }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("config") && this.config?.filter)
      this._filter = this.config.filter;
  }
  private _feeds(): NoticeFeed[] {
    return discoverFeeds(this.hass ?? { states: {} }, this.config?.entities);
  }
  private _notice(notice: Notice, index: number, mode: ExpandedMode) {
    const text = labels(this.hass);
    const expanded = mode === "all" || (mode === "latest" && index === 0);
    return html`<details ?open=${expanded}>
      <summary>
        <span class="title">${notice.title}</span>${
          notice.unread === true
            ? html`<span class="unread">${text.unread}</span>`
            : notice.unread === false
              ? html`<span class="read-status" aria-label=${text.read}
                  ><span class="status-icon" aria-hidden="true">✓</span
                  >${text.read}</span
                >`
              : nothing
        }
      </summary>
      <div class="meta">
        <span>${text.issued}: ${formatDate(notice.issued_at, this.hass)}</span
        ><span>${text.deadline}: ${formatDate(notice.deadline, this.hass)}</span
        >${notice.replied === true ? html`<span class="status">${text.replied}</span>` : notice.replied === false ? html`<span>${text.noReply}</span>` : nothing}
      </div>
      <div class="body">${notice.content || text.noBody}</div>
      ${notice.content_truncated ? html`<div class="hint">${text.truncated}</div>` : nothing}${
        this.config?.show_attachments && notice.attachments.length
          ? html`<div class="attachment-label meta">
                <span>${text.attachments}</span>
              </div>
              ${notice.attachments.map((file) => html`<div class="attachment"><span class="attachment-name">${file.filename}</span><span>${file.mime_type}</span>${file.size !== null ? html`<span>${formatSize(file.size)}</span>` : nothing}</div>`)}`
          : nothing
      }
    </details>`;
  }
  protected render() {
    const text = labels(this.hass);
    const feeds = this._feeds();
    const mode = this.config?.initially_expanded ?? "latest";
    const limit = this.config?.limit ?? 20;
    const total = feeds.reduce(
      (sum, feed) => sum + visibleNotices(feed, this._filter, limit).length,
      0,
    );
    return html`<ha-card
      ><div class="header">
        <h1>${this.config?.title ?? "HKTE Notices"}</h1>
        <span class="count">${total}</span>
      </div>
      <div class="toolbar" role="group" aria-label="Notice filter">
        <button
          aria-pressed=${this._filter === "all"}
          @click=${() => (this._filter = "all")}
        >
          ${text.all}</button
        ><button
          aria-pressed=${this._filter === "unread"}
          @click=${() => (this._filter = "unread")}
        >
          ${text.unread}
        </button>
      </div>
      <div class="content">
        ${
          !this.hass
            ? html`<div class="hint">${text.unavailable}</div>`
            : feeds.length === 0
              ? html`<div class="empty">${text.noEntities}</div>`
              : feeds.map((feed) => {
                  const notices = visibleNotices(feed, this._filter, limit);
                  const unavailable =
                    feed.state === "unavailable" || feed.state === "unknown";
                  return html`<section class="student">
                    <h2 class="student-title">
                      ${studentName(feed.name, feed.entityId)}
                    </h2>
                    ${unavailable ? html`<div class="hint error">${text.unavailable}</div>` : notices.length ? notices.map((item, index) => this._notice(item, index, mode)) : html`<div class="empty">${text.noNotices}</div>`}${feed.hasMore && notices.length ? html`<div class="hint">${text.more}</div>` : nothing}
                  </section>`;
                })
        }
      </div></ha-card
    >`;
  }
}

export class HkteNoticesCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };
  declare hass?: HomeAssistant;
  declare config: HkteNoticesCardConfig;
  constructor() {
    super();
    this.config = { type: "custom:hkte-notices-card" };
  }
  setConfig(config: HkteNoticesCardConfig): void {
    this.config = config;
  }
  static styles = css`
    :host {
      display: block;
    }
  `;
  protected render() {
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[
        { name: "title", selector: { text: {} } },
        {
          name: "entities",
          selector: {
            entity: { multiple: true, filter: { domain: "sensor" } },
          },
        },
        {
          name: "filter",
          selector: {
            select: {
              options: [
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
              ],
            },
          },
        },
        {
          name: "limit",
          selector: { number: { min: 1, max: 20, mode: "slider" } },
        },
        {
          name: "initially_expanded",
          selector: {
            select: {
              options: [
                { value: "latest", label: "Latest" },
                { value: "none", label: "None" },
                { value: "all", label: "All" },
              ],
            },
          },
        },
        { name: "show_attachments", selector: { boolean: {} } },
      ]}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }
  private _valueChanged(
    event: CustomEvent<{ value: Partial<HkteNoticesCardConfig> }>,
  ): void {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: { ...this.config, ...event.detail.value } },
      }),
    );
  }
}

declare global {
  interface Window {
    customCards?: Array<Record<string, string>>;
  }
}
if (!customElements.get("hkte-notices-card"))
  customElements.define("hkte-notices-card", HkteNoticesCard);
if (!customElements.get("hkte-notices-card-editor"))
  customElements.define("hkte-notices-card-editor", HkteNoticesCardEditor);
window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "hkte-notices-card"))
  window.customCards.push({
    type: "hkte-notices-card",
    name: "HKTE Notices Card",
    description: "Read-only HKTE Smart School notices",
  });
