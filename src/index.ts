import { LitElement, css, html, nothing } from "lit";
import "./actions";
import { clampDays, clampLimit, discoverFeeds, visibleNotices } from "./data";
import type {
  ExpandedMode,
  HkteNoticesCardConfig,
  HomeAssistant,
  Notice,
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
function entityNames(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined;
  const names = Object.entries(value as Record<string, unknown>).reduce<
    Record<string, string>
  >((result, [entityId, name]) => {
    if (typeof name === "string" && name.trim()) result[entityId] = name.trim();
    return result;
  }, {});
  return Object.keys(names).length ? names : undefined;
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

function eyeIcon() {
  return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}

function repliedIcon() {
  return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}

export class HkteNoticesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
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
      padding: 18px 20px 16px;
      border-bottom: 1px solid var(--divider-color);
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
    .content {
      padding: 8px 16px 20px;
    }
    .student {
      padding-top: 10px;
    }
    .student + .student {
      border-top: 1px solid
        color-mix(in srgb, var(--divider-color) 70%, transparent);
      margin-top: 18px;
      padding-top: 18px;
    }
    .student-title {
      margin: 0 4px 10px;
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    details {
      margin: 10px 0;
      overflow: hidden;
      border: 1px solid
        color-mix(in srgb, var(--divider-color) 85%, transparent);
      border-radius: 8px;
      background: color-mix(
        in srgb,
        var(--card-background-color, var(--ha-card-background, transparent)) 92%,
        var(--primary-color) 8%
      );
      box-shadow: 0 1px 2px
        color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    details[open] {
      border-color: color-mix(
        in srgb,
        var(--primary-color) 28%,
        var(--divider-color)
      );
    }
    summary {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      min-width: 0;
      padding: 15px 14px;
      cursor: pointer;
      list-style: none;
    }
    .unread-notice summary {
      border-inline-start: 3px solid var(--warning-color, #d89b00);
      padding-inline-start: 11px;
      background: color-mix(
        in srgb,
        var(--warning-color, #d89b00) 8%,
        transparent
      );
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
      display: block;
      min-width: 0;
      overflow-wrap: anywhere;
      font-size: 1rem;
      font-weight: 650;
      line-height: 1.35;
    }
    .title-content {
      display: block;
      flex: 1 1 auto;
      min-width: 0;
    }
    .issued-title {
      display: block;
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 400;
      line-height: 1.35;
    }
    .status-icons {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
      margin-left: auto;
    }
    .unread {
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
      flex: none;
      color: var(--success-color, #2e9d68);
    }
    .replied-status {
      display: inline-flex;
      align-items: center;
      color: var(--primary-color);
    }
    .status-icon svg {
      display: block;
      width: 1.35rem;
      height: 1.35rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
    }
    .body {
      margin: 0 14px;
      padding: 14px 0 16px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.55;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin: 0 14px;
      padding: 12px 0 0;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .deadline {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      align-items: center;
      gap: 3px 10px;
      width: 100%;
      margin: 2px 0 4px;
      color: var(--primary-text-color);
    }
    .deadline-icon {
      grid-row: span 2;
      width: 24px;
      height: 24px;
      --mdc-icon-size: 24px;
      color: var(--primary-color);
    }
    .deadline-label {
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0;
    }
    .deadline-value {
      min-width: 0;
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .status {
      color: var(--primary-color);
    }
    .attachment {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      margin: 0 14px;
      padding: 4px 0;
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
      .content {
        padding-left: 14px;
        padding-right: 14px;
      }
      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
      }
      .content {
        padding-left: 10px;
        padding-right: 10px;
      }
      summary {
        padding: 13px 11px;
      }
      .title {
        font-size: 0.94rem;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      .unread-notice .unread {
        animation: unread-pulse 2.2s ease-in-out 3;
      }
      summary::before {
        transition: transform 120ms ease;
      }
      @keyframes unread-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 transparent;
        }
        45% {
          box-shadow: 0 0 0 5px
            color-mix(in srgb, var(--warning-color, #d89b00) 18%, transparent);
        }
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
  static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("hkte-notices-card-editor");
  }
  static getStubConfig(): HkteNoticesCardConfig {
    return {
      type: "custom:hkte-notices-card",
      title: "HKTE Notices",
      filter: "all",
      limit: 5,
      days: 0,
      initially_expanded: "latest",
      show_student_name: true,
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
      entity_names: entityNames(config.entity_names),
      filter: config.filter === "unread" ? "unread" : "all",
      limit: clampLimit(config.limit),
      days: clampDays(config.days),
      initially_expanded: expanded,
      show_student_name: config.show_student_name !== false,
      show_attachments: config.show_attachments !== false,
    };
  }
  getCardSize(): number {
    return 4;
  }
  private _feeds(): NoticeFeed[] {
    return discoverFeeds(this.hass ?? { states: {} }, this.config?.entities);
  }
  private _notice(
    notice: Notice,
    index: number,
    mode: ExpandedMode,
    entityId: string,
  ) {
    const text = labels(this.hass);
    const expanded = mode === "all" || (mode === "latest" && index === 0);
    return html`<details
      class=${notice.unread === true ? "unread-notice" : ""}
      ?open=${expanded}
    >
      <summary>
        <span class="title-content">
          <span class="title">${notice.title}</span>
          <span class="issued-title"
            >${formatDate(notice.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${
            notice.unread === true
              ? html`<span class="unread">${text.unread}</span>`
              : nothing
          }
          ${
            notice.unread === false
              ? html`<span
                  class="status-icon read-status"
                  title=${text.read}
                  aria-label=${text.read}
                  role="img"
                  >${eyeIcon()}</span
                >`
              : nothing
          }
          ${
            notice.replied === true
              ? html`<span
                  class="status-icon replied-status"
                  title=${text.replied}
                  aria-label=${text.replied}
                  role="img"
                  >${repliedIcon()}</span
                >`
              : nothing
          }
        </span>
      </summary>
      <div class="meta">
        <span class="deadline">
          <ha-icon
            class="deadline-icon"
            icon="mdi:calendar-clock"
            aria-hidden="true"
          ></ha-icon>
          <span class="deadline-label">${text.deadline}</span>
          <span class="deadline-value"
            >${formatDate(notice.deadline, this.hass)}</span
          >
        </span>
      </div>
      <div class="body">${notice.content || text.noBody}</div>
      ${this.hass?.fetchWithAuth ? html`<hkte-notice-actions .hass=${this.hass} .entityId=${entityId} .notice=${notice} .showAttachments=${this.config?.show_attachments !== false}></hkte-notice-actions>` : nothing}
      ${notice.content_truncated ? html`<div class="hint">${text.truncated}</div>` : nothing}${
        !this.hass?.fetchWithAuth &&
        this.config?.show_attachments &&
        notice.attachments.length
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
    const limit = this.config?.limit ?? 5;
    const days = this.config?.days ?? 0;
    const filter = this.config?.filter ?? "all";
    const showStudentName = this.config?.show_student_name !== false;
    const total = feeds.reduce(
      (sum, feed) => sum + visibleNotices(feed, filter, limit, days).length,
      0,
    );
    return html`<ha-card
      ><div class="header">
        <h1>${this.config?.title ?? "HKTE Notices"}</h1>
        <span class="count">${total}</span>
      </div>
      <div class="content">
        ${
          !this.hass
            ? html`<div class="hint">${text.unavailable}</div>`
            : feeds.length === 0
              ? html`<div class="empty">${text.noEntities}</div>`
              : feeds.map((feed) => {
                  const notices = visibleNotices(feed, filter, limit, days);
                  const unavailable =
                    feed.state === "unavailable" || feed.state === "unknown";
                  return html`<section class="student">
                    ${
                      showStudentName
                        ? html`<h2 class="student-title">
                            ${
                              this.config?.entity_names?.[feed.entityId] ??
                              studentName(feed.name, feed.entityId)
                            }
                          </h2>`
                        : nothing
                    }
                    ${unavailable ? html`<div class="hint error">${text.unavailable}</div>` : notices.length ? notices.map((item, index) => this._notice(item, index, mode, feed.entityId)) : html`<div class="empty">${text.noNotices}</div>`}${feed.hasMore && notices.length ? html`<div class="hint">${text.more}</div>` : nothing}
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
    .entity-names {
      margin-top: 20px;
    }
    .entity-names h3 {
      margin: 0 0 12px;
      font-size: 1rem;
      font-weight: 500;
    }
    .entity-name-field {
      display: grid;
      gap: 6px;
      margin-bottom: 12px;
    }
    .entity-name-label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      overflow-wrap: anywhere;
    }
    .entity-name-input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      outline: 0;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--ha-card-background));
      font: inherit;
    }
    .entity-name-input:focus-visible {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
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
            name: "days",
            selector: {
              number: { min: 0, max: 30, mode: "box" },
            },
          },
          {
            name: "initially_expanded",
            selector: {
              select: {
                options: [
                  { value: "latest", label: "Latest" },
                  { value: "none", label: "Collapse latest" },
                  { value: "all", label: "Expand all" },
                ],
              },
            },
          },
          { name: "show_student_name", selector: { boolean: {} } },
          { name: "show_attachments", selector: { boolean: {} } },
        ]}
        @value-changed=${this._valueChanged}
      ></ha-form
      >${this._entityNameFields()}`;
  }
  private _entityNameFields() {
    const entities = this.config.entities ?? [];
    if (entities.length === 0) return nothing;
    return html`<section class="entity-names">
      <h3>Entity display names</h3>
      ${entities.map(
        (entityId, index) =>
          html`<label class="entity-name-field" for=${`entity-name-${index}`}>
            <span class="entity-name-label">${entityId}</span>
            <input
              id=${`entity-name-${index}`}
              class="entity-name-input"
              type="text"
              .value=${this.config.entity_names?.[entityId] ?? ""}
              @change=${(event: Event) =>
                this._entityNameChanged(entityId, event)}
            />
          </label>`,
      )}
    </section>`;
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
  private _entityNameChanged(entityId: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    const names = { ...(this.config.entity_names ?? {}) };
    if (value) names[entityId] = value;
    else delete names[entityId];
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: {
          config: {
            ...this.config,
            entity_names: Object.keys(names).length ? names : undefined,
          },
        },
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
