import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, Notice, NoticeAttachment } from "./types";
import {
  parseAnalysisState,
  type AnalysisState,
  type Source,
  type SUMMARY_SECTIONS,
} from "./analysis-state";

const ERRORS: Record<string, [string, string]> = {
  notice_truncated: [
    "通告正文不完整，未進行分析。",
    "Notice text is truncated; analysis was not started.",
  ],
  no_content: [
    "通告沒有可分析的內容。",
    "No notice content is available to analyze.",
  ],
  download_failed: [
    "附件下載失敗，請重試。",
    "Attachment download failed. Try again.",
  ],
  invalid_source: ["附件來源不受支援。", "Unsupported attachment source."],
  empty_file: [
    "HKTE 回傳空白附件，請稍後重試。",
    "HKTE returned an empty file. Try later.",
  ],
  invalid_file: ["附件不是有效檔案。", "The attachment is not a valid file."],
  attachment_not_found: [
    "找不到附件，請更新通告。",
    "Attachment not found. Refresh the notice.",
  ],
  invalid_session: ["HKTE 下載連線失效。", "HKTE download session expired."],
  file_too_large: ["附件超過 20 MiB 限制。", "Attachment exceeds 20 MiB."],
  too_many_attachments: [
    "每次最多分析 10 個附件。",
    "At most 10 attachments per analysis.",
  ],
  too_many_pages: [
    "附件總頁數超過 20 頁限制。",
    "Attachments exceed the 20-page limit.",
  ],
  analysis_too_large: [
    "附件總大小超過 40 MiB 限制。",
    "Attachments exceed 40 MiB in total.",
  ],
  image_too_large: ["圖片尺寸過大。", "Image dimensions are too large."],
  unsupported_file: [
    "此格式不支援 AI 分析。",
    "This format cannot be analyzed.",
  ],
  unreadable_file: [
    "檔案損壞、加密或無法讀取。",
    "File is damaged, encrypted or unreadable.",
  ],
  all_attachments_failed: [
    "所有附件均無法分析，請檢查附件後重試。",
    "No attachments could be analyzed. Check the files and retry.",
  ],
  ai_auth: [
    "AI 金鑰或存取權限無效，請檢查整合設定。",
    "Check the AI key and provider permissions.",
  ],
  ai_rate_limit: [
    "AI 服務用量受限，請稍後重試。",
    "AI rate limit reached. Try later.",
  ],
  ai_unsupported_input: [
    "AI 服務不接受此輸入，請確認模型支援圖片。",
    "AI rejected the input. Check vision model support.",
  ],
  ai_not_configured: [
    "請先在整合選項設定 AI 服務。",
    "Configure AI in the integration options first.",
  ],
  ai_timeout: ["AI 分析逾時，請重試。", "AI request timed out. Try again."],
  ai_connection: ["無法連接 AI 服務。", "Cannot connect to the AI provider."],
  ai_failed: ["AI 服務發生錯誤，請重試。", "AI provider error. Try again."],
  invalid_ai_response: [
    "AI 回應格式或來源引用無效，請重試。",
    "Invalid AI response or source references. Try again.",
  ],
  ai_incomplete_response: [
    "AI 回應被截斷或拒絕處理，未產生新摘要。請重試或更換模型。",
    "AI response was truncated or refused. No new summary was saved. Retry or change model.",
  ],
  account_busy: [
    "正在分析另一份通告，請稍後重試。",
    "Another notice is being analyzed. Try later.",
  ],
  analysis_timeout: ["分析逾時，請重試。", "Analysis timed out. Try again."],
  cancelled: ["分析已中止，請重試。", "Analysis was interrupted. Try again."],
  unavailable: ["暫時無法連接通告服務。", "Notice service is unavailable."],
};

export class HkteNoticeActions extends LitElement {
  static properties = {
    hass: { attribute: false },
    entityId: { attribute: false },
    notice: { attribute: false },
    showAttachments: { attribute: false },
    state: { state: true },
    error: { state: true },
    downloads: { state: true },
    submitting: { state: true },
  };
  static styles = css`
    :host {
      display: block;
      margin: 0 14px 14px;
      padding-top: 12px;
      font-size: 14px;
    }
    .files {
      margin: 0 0 12px;
      padding: 10px 12px;
      border: 1px solid
        color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 6px;
      background: color-mix(
        in srgb,
        var(--secondary-background-color, transparent) 70%,
        transparent
      );
    }
    .body-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
      gap: 12px;
      padding: 2px 0 16px;
    }
    slot[name="body"] {
      min-width: 0;
      align-self: center;
    }
    .action-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
    }
    .file-actions {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
    }
    .file {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }
    .name {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .metadata,
    .progress {
      color: var(--secondary-text-color);
      font-size: 12px;
      overflow-wrap: anywhere;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 40px;
      font: inherit;
      color: var(--primary-color);
      background: transparent;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
      padding: 6px 10px;
    }
    button.icon {
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      padding: 8px;
    }
    button:disabled {
      opacity: 0.55;
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    ha-icon {
      --mdc-icon-size: 20px;
    }
    .error {
      color: var(--error-color);
    }
    .summary {
      margin-top: 12px;
      padding: 12px;
      border: 1px solid
        color-mix(in srgb, var(--primary-color) 22%, var(--divider-color));
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }
    h4 {
      margin: 12px 0 5px;
      font-size: 14px;
      font-weight: 700;
    }
    ul {
      margin: 0;
      padding-inline-start: 20px;
    }
    li {
      margin: 6px 0;
      overflow-wrap: anywhere;
    }
    .summary-text {
      white-space: pre-wrap;
    }
    .warning {
      color: var(--warning-color, #a66800);
    }
  `;
  declare hass?: HomeAssistant;
  declare entityId: string;
  declare notice: Notice;
  declare showAttachments: boolean;
  declare private state?: AnalysisState;
  declare private error: string;
  declare private downloads: Set<string>;
  declare private submitting: boolean;
  private signature = "";
  private timer?: ReturnType<typeof setTimeout>;
  private generation = 0;

  constructor() {
    super();
    this.error = "";
    this.downloads = new Set();
    this.submitting = false;
  }

  private get zh() {
    return (
      this.hass?.locale?.language ??
      this.hass?.config?.language ??
      "en"
    ).startsWith("zh");
  }
  private text(zh: string, en: string) {
    return this.zh ? zh : en;
  }
  private message(code: string) {
    return (
      ERRORS[code]?.[this.zh ? 0 : 1] ??
      this.text("分析失敗，請重試。", "Analysis failed. Try again.")
    );
  }
  private get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }

  protected updated(_changes: PropertyValues) {
    if (!this.hass?.fetchWithAuth || !this.notice || !this.entityId) return;
    const signature = JSON.stringify([this.entityId, this.notice]);
    if (signature !== this.signature) {
      this.signature = signature;
      this.generation++;
      clearTimeout(this.timer);
      this.state = undefined;
      this.error = "";
      void this.load();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.signature = "";
    this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.generation++;
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    if (!this.hass?.fetchWithAuth) throw new Error("unavailable");
    const response = await this.hass.fetchWithAuth(path, init);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        typeof body.error === "string" ? body.error : "unavailable",
      );
    }
    return response;
  }
  private async load() {
    const generation = this.generation;
    try {
      const state = parseAnalysisState(
        await (await this.request(`${this.path}/analysis`)).json(),
      );
      if (!this.isConnected || generation !== this.generation) return;
      this.state = state;
      this.error = "";
      if (state.status === "running")
        this.timer = setTimeout(() => void this.load(), 2000);
    } catch (error) {
      if (generation === this.generation)
        this.error =
          error instanceof Error && error.message === "invalid_ai_response"
            ? error.message
            : "unavailable";
    }
  }
  private async start() {
    const generation = this.generation;
    this.submitting = true;
    this.error = "";
    clearTimeout(this.timer);
    try {
      const state = parseAnalysisState(
        await (
          await this.request(`${this.path}/analysis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ force: Boolean(this.state?.summary) }),
          })
        ).json(),
      );
      if (generation !== this.generation) return;
      this.state = state;
      if (state.status === "running")
        this.timer = setTimeout(() => void this.load(), 2000);
    } catch (error) {
      if (generation === this.generation)
        this.error = error instanceof Error ? error.message : "unavailable";
    } finally {
      this.submitting = false;
    }
  }
  private async download(file: NoticeAttachment) {
    this.downloads = new Set([...this.downloads, file.id]);
    this.error = "";
    try {
      const response = await this.request(
        `${this.path}/attachment/${encodeURIComponent(file.id)}`,
      );
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("empty_file");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename.replace(/[/\\\x00-\x1f]/g, "_");
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      this.error = error instanceof Error ? error.message : "download_failed";
    } finally {
      this.downloads = new Set(
        [...this.downloads].filter((id) => id !== file.id),
      );
    }
  }
  protected render() {
    if (!this.notice) return nothing;
    const state = this.state;
    const busy = state?.status === "running" || this.submitting;
    const sections: [(typeof SUMMARY_SECTIONS)[number], string, string][] = [
      ["highlights", "內容重點", "Highlights"],
      ["dates", "重要日期", "Important dates"],
      ["costs", "費用", "Costs"],
      ["actions", "家長待辦", "Parent actions"],
      ["questions", "需確認事項", "To confirm"],
    ];
    const stage =
      state?.stage === "analyzing"
        ? this.text("AI 分析中", "Analyzing")
        : state?.stage === "rendering"
          ? this.text("處理附件頁面", "Rendering pages")
          : this.text("取得附件", "Fetching attachments");
    return html`
      <div class="body-row">
        <slot name="body"></slot>
        ${!this.showAttachments || this.notice.attachments.length === 0 ? this.analyzeButton(state, busy) : nothing}
      </div>
      ${
        this.showAttachments
          ? html`<div class="files">
              ${this.notice.attachments.map(
                (file, index) =>
                  html`<div class="file">
                    <div class="name">
                      ${file.filename}
                      <div class="metadata">
                        ${file.size !== null ? `${Math.round(file.size / 1024)} KB` : nothing}
                      </div>
                    </div>
                    <div class="file-actions">
                      ${index === 0 ? this.analyzeButton(state, busy) : nothing}
                      <button
                        class="icon"
                        title=${this.text("下載附件", "Download attachment")}
                        aria-label=${this.text("下載附件", "Download attachment")}
                        ?disabled=${!file.id || !this.hass?.fetchWithAuth || this.downloads.has(file.id)}
                        @click=${() => this.download(file)}
                      >
                        <ha-icon icon="mdi:download"></ha-icon>
                      </button>
                    </div>
                  </div>`,
              )}
            </div>`
          : nothing
      }
      ${state && !state.enabled ? html`<p class="progress">${this.message("ai_not_configured")}</p>` : nothing}
      ${busy ? html`<p class="progress" role="status">${stage} (${state?.processed ?? 0}/${this.notice.attachments.length})</p>` : nothing}
      ${
        this.error || state?.error
          ? html`<p class="error" role="alert">
                ${this.message(this.error || state?.error || "")}
              </p>
              ${this.error ? html`<button @click=${() => this.load()}>${this.text("重試連線", "Retry connection")}</button>` : nothing}`
          : nothing
      }
      ${state?.stale ? html`<p class="warning">${this.text("通告或模型設定已更新，請重新分析。", "Notice or model settings changed. Analyze again.")}</p>` : nothing}
      ${state?.status === "partial" ? html`<p class="warning">${this.text("部分完成", "Partially completed")}</p>` : nothing}
      ${state?.missing?.map((item) => html`<p class="warning">${item.filename}: ${this.message(item.error)}</p>`)}
      ${
        state?.summary
          ? html`<div class="summary">
              ${sections.map(
                ([key, zh, en]) =>
                  html`<h4>${this.text(zh, en)}</h4>
                    <ul>
                      ${
                        state.summary?.[key]?.length
                          ? state.summary[key].map(
                              (item) =>
                                html`<li>
                                  <span class="summary-text">${item.text}</span>
                                </li>`,
                            )
                          : html`<li class="metadata">
                              ${this.text("未提供", "Not provided")}
                            </li>`
                      }
                    </ul>`,
              )}
            </div>`
          : nothing
      }
    `;
  }

  private analyzeButton(state: AnalysisState | undefined, busy: boolean) {
    const label = state?.summary
      ? this.text("重新分析", "Analyze again")
      : this.text("AI 整理重點", "AI summary");
    return html`<button
      class="icon"
      title=${label}
      aria-label=${label}
      ?disabled=${busy || !state?.enabled}
      @click=${() => this.start()}
    >
      <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
    </button>`;
  }
}

customElements.define("hkte-notice-actions", HkteNoticeActions);
