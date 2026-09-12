import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { HomeAssistant, Notice } from "./types";
import { systemDeadline, deadlineStyles } from "./deadline";
import {
  activeQuestions,
  answerText,
  parseForm,
  parseOperation,
  selectedAnswers,
  validAnswers,
  type Answer,
  type Answers,
  type Operation,
  type Question,
  type ReplyForm,
} from "./reply-form";

export class HkteSignNotice extends LitElement {
  static properties = {
    hass: { attribute: false },
    entityId: { attribute: false },
    notice: { attribute: false },
    form: { state: true },
    operation: { state: true },
    answers: { state: true },
    comment: { state: true },
    reviewing: { state: true },
    busy: { state: true },
    error: { state: true },
  };
  static styles = [
    deadlineStyles,
    css`
      :host {
        display: block;
        margin: 0 0 14px;
      }
      button {
        font: inherit;
        cursor: pointer;
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        min-height: 40px;
        padding: 8px 12px;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .sign {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        color: var(--primary-color);
      }
      .sign svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
      }
      dialog {
        box-sizing: border-box;
        width: min(560px, calc(100vw - 24px));
        max-height: 85dvh;
        overflow: auto;
        padding: 22px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        color: var(--primary-text-color);
        background: var(--card-background-color, #fff);
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.55);
      }
      h3 {
        margin: 0 0 10px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
      p,
      .label,
      dd {
        white-space: normal;
        overflow-wrap: anywhere;
        line-height: 1.6;
      }
      .answer {
        white-space: pre-wrap;
      }
      p,
      .hint {
        font-size: 0.85rem;
      }
      .hint {
        color: var(--secondary-text-color);
      }
      .error {
        color: var(--error-color, #db4437);
      }
      fieldset {
        border: 0;
        padding: 0;
        margin: 20px 0;
        min-width: 0;
      }
      legend {
        font-weight: 600;
        margin-bottom: 10px;
        padding: 0;
      }
      label.option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
      }
      input,
      textarea {
        box-sizing: border-box;
        font: inherit;
        color: inherit;
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      input[type="radio"],
      input[type="checkbox"] {
        accent-color: var(--primary-color);
        width: 20px;
        height: 20px;
        flex: none;
      }
      input[type="number"] {
        width: 95px;
        padding: 8px;
      }
      textarea {
        width: 100%;
        padding: 10px;
        min-height: 80px;
      }
      .footer {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 22px;
      }
      .primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      dt {
        font-weight: 600;
        margin-top: 15px;
      }
      dd {
        margin: 5px 0 0;
      }
    `,
  ];
  declare hass?: HomeAssistant;
  declare entityId: string;
  declare notice: Notice;
  declare private form?: ReplyForm;
  declare private operation?: Operation;
  declare private answers: Answers;
  declare private comment: string;
  declare private reviewing: boolean;
  declare private busy: boolean;
  declare private error: string;
  private signature = "";
  private generation = 0;

  constructor() {
    super();
    this.answers = {};
    this.comment = "";
    this.reviewing = false;
    this.busy = false;
    this.error = "";
  }

  private t(zh: string, en: string) {
    return (
      this.hass?.locale?.language ??
      this.hass?.config?.language ??
      "en"
    ).startsWith("zh")
      ? zh
      : en;
  }
  private get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }
  protected updated(_: PropertyValues) {
    const signature = JSON.stringify([
      this.entityId,
      this.notice?.id,
      this.notice?.replied,
    ]);
    if (
      this.notice &&
      this.hass?.fetchWithAuth &&
      signature !== this.signature
    ) {
      this.signature = signature;
      this.generation++;
      void this.load();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.generation++;
  }
  private async request(path: string, body?: unknown): Promise<unknown> {
    const r = await this.hass!.fetchWithAuth!(
      this.path + path,
      body === undefined
        ? undefined
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
    );
    const value = await r.json();
    if (!r.ok)
      throw new Error(
        typeof value.error === "string" ? value.error : "hub_unavailable",
      );
    return value;
  }
  private async load() {
    const gen = this.generation;
    this.busy = true;
    try {
      const form = parseForm(await this.request("/reply-form"));
      if (gen !== this.generation) return;
      this.form = form;
      this.operation = form?.operation;
      this.error = "";
    } catch {
      if (gen === this.generation)
        this.error = this.t(
          "未能取得回覆表格，請檢查 Message Hub 設定後重試。",
          "Could not load reply form. Check Message Hub settings and retry.",
        );
    } finally {
      if (gen === this.generation) this.busy = false;
    }
  }
  private async open() {
    this.answers = {};
    this.comment = "";
    this.reviewing = false;
    await this.load();
    await this.updateComplete;
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }
  private close() {
    if (!this.busy) this.shadowRoot?.querySelector("dialog")?.close();
  }
  private setAnswer(q: Question, value: Answer) {
    this.answers = { ...this.answers, [q.id]: value };
    // Drop hidden conditional answers so switching branches never submits stale consent.
    if (this.form) this.answers = selectedAnswers(this.form, this.answers);
  }
  private question(q: Question) {
    const a = this.answers[q.id];
    return html`<fieldset>
      <legend class="label">${q.label}${q.required ? " *" : nothing}</legend>
      ${
        q.type === "acknowledgement"
          ? html`<p class="hint">
              ${this.t("請閱讀後在確認步驟簽署知悉。", "Review this acknowledgement before confirming your signature.")}
            </p>`
          : q.type === "text"
            ? html`<textarea
                aria-label=${q.label}
                maxlength="10000"
                .value=${typeof a === "string" ? a : ""}
                @input=${(e: Event) => this.setAnswer(q, (e.target as HTMLTextAreaElement).value)}
              ></textarea>`
            : q.options.map(
                (o, i) =>
                  html`<label class="option">
                    ${
                      q.type === "quantities"
                        ? html`<input
                            type="number"
                            aria-label=${o.label}
                            min=${Math.max(0, q.ranges[i]?.min ?? 0)}
                            max=${q.ranges[i]?.max != null && q.ranges[i]!.max! >= 0 ? q.ranges[i]!.max! : 100000}
                            step="1"
                            .value=${Array.isArray(a) ? String(a[i] ?? "") : ""}
                            @input=${(e: Event) => {
                              const n = (e.target as HTMLInputElement)
                                .valueAsNumber;
                              const v = Array.isArray(a)
                                ? [...a]
                                : q.options.map(() => 0);
                              v[i] = n;
                              this.setAnswer(q, v);
                            }}
                          /> `
                        : html`<input
                            type=${q.type === "single_choice" ? "radio" : "checkbox"}
                            name=${q.id}
                            .checked=${Array.isArray(a) && a.includes(o.value)}
                            @change=${(e: Event) => {
                              const checked = (e.target as HTMLInputElement)
                                .checked;
                              this.setAnswer(
                                q,
                                q.type === "single_choice"
                                  ? [o.value]
                                  : checked
                                    ? [...(Array.isArray(a) ? a : []), o.value]
                                    : (Array.isArray(a) ? a : []).filter(
                                        (v) => v !== o.value,
                                      ),
                              );
                            }}
                          />`
                    }
                    <span>${o.label}</span></label
                  >`,
              )
      }
      ${q.type === "single_choice" && !q.required ? html`<button @click=${() => this.setAnswer(q, [])}>${this.t("清除選擇", "Clear selection")}</button>` : nothing}
    </fieldset>`;
  }
  private async submit() {
    if (
      this.busy ||
      !this.reviewing ||
      !this.form ||
      !validAnswers(this.form, this.answers)
    )
      return;
    this.busy = true;
    this.error = "";
    try {
      this.operation = parseOperation(
        await this.request("/sign", {
          form_version: this.form.form_version,
          answers: selectedAnswers(this.form, this.answers),
          comment: this.comment,
          confirmed: true,
        }),
      );
      this.reviewing = false;
      if (this.operation.status === "not_sent") {
        await this.load();
        this.answers = {};
        this.comment = "";
        this.error = this.t(
          "未有提交：表格或狀態可能已改變。請重新查看並確認答案。",
          "Not submitted: the form or state may have changed. Review the form and answers again.",
        );
      }
    } catch (e) {
      if (
        e instanceof Error &&
        [
          "form_changed",
          "invalid_answers",
          "cannot_sign",
          "signing_not_configured",
        ].includes(e.message)
      ) {
        await this.load();
        this.answers = {};
        this.comment = "";
        this.error = this.t(
          "未有提交，請重新查看表格及確認答案。",
          "Not submitted. Review the form and answers again.",
        );
      } else {
        // The backend owns the durable UUID. Never automatically send another body.
        this.operation = {
          status: "unknown",
          replied: false,
          retry_after: 300,
        };
      }
      this.reviewing = false;
    } finally {
      this.busy = false;
    }
  }
  private async check() {
    if (this.busy) return;
    this.busy = true;
    try {
      this.operation = parseOperation(await this.request("/sign-status", {}));
      this.error = "";
    } catch {
      this.error = this.t(
        "未能確認結果，請稍後檢查或使用官方 App。",
        "Could not confirm the result. Check later or use the official app.",
      );
    } finally {
      this.busy = false;
    }
  }
  private operationText() {
    switch (this.operation?.status) {
      case "succeeded":
        return this.t(
          "已由 HKTE 確認簽署成功。",
          "Signature confirmed by HKTE.",
        );
      case "rejected":
        return this.t(
          "HKTE 拒絕此回覆，請在官方 App 查看。",
          "HKTE rejected this reply. Check the official app.",
        );
      case "pending":
      case "unknown":
        return this.t(
          "簽署結果未確認，可能已提交。請至少等候 5 分鐘再檢查；不要重新簽署。",
          "Result unconfirmed; it may already be submitted. Wait at least 5 minutes before checking. Do not sign again.",
        );
      default:
        return "";
    }
  }
  protected render() {
    const form = this.form;
    const unresolved = ["pending", "unknown"].includes(
      this.operation?.status ?? "",
    );
    const finished = ["succeeded", "rejected"].includes(
      this.operation?.status ?? "",
    );
    const available =
      form?.can_sign &&
      form.supported &&
      !form.replied &&
      !unresolved &&
      !finished;
    return html` ${
        available
          ? html`<button
              class="sign"
              ?disabled=${this.busy}
              @click=${() => this.open()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 5H4v16h16v-9M10 14l1-4 8-8 3 3-8 8-4 1Z" /></svg
              >${this.t("簽署通告", "Sign notice")}
            </button>`
          : unresolved
            ? html`<button @click=${() => this.open()}>
                ${this.t("查看簽署結果", "Check signature")}
              </button>`
            : form && !form.replied && !finished
              ? html`<p class="hint">${form.blocked_reasons.join("；")}</p>`
              : nothing
      }
      ${this.operation?.status === "succeeded" ? html`<p role="status">${this.operationText()}</p>` : nothing}
      ${
        this.error
          ? html`<p class="error" role="alert">${this.error}</p>
              <button ?disabled=${this.busy} @click=${() => this.load()}>
                ${this.t("重新取得表格", "Reload reply form")}
              </button>`
          : nothing
      }
      <dialog
        aria-label=${this.t("簽署通告", "Sign notice")}
        @cancel=${(e: Event) => {
          if (this.busy) e.preventDefault();
        }}
      >
        <h3>${form?.title ?? this.notice?.title}</h3>
        ${form ? systemDeadline(form.deadline, this.hass) : nothing}
        ${this.operationText() ? html`<p role="status">${this.operationText()}</p>` : nothing}
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        ${
          available && form
            ? html`
                <p>${form.introduction}</p>
                ${
                  this.reviewing
                    ? html`<h4>
                          ${this.t("確認以下回覆", "Review your reply")}
                        </h4>
                        <dl>
                          ${activeQuestions(form, this.answers).map(
                            (q) =>
                              html`<dt>${q.label}</dt>
                                <dd>
                                  <span class="answer"
                                    >${q.type === "acknowledgement" ? this.t("確認知悉", "Acknowledged") : answerText(q, this.answers[q.id])}</span
                                  >
                                </dd>`,
                          )}
                        </dl>
                        ${this.comment ? html`<p>${this.comment}</p>` : nothing}
                        <p>
                          ${this.t("確認後會簽署真實 HKTE 通告，無法在此撤銷或修改回覆。", "Confirming signs the real HKTE notice. Replies cannot be undone or edited here.")}
                        </p>`
                    : html`${activeQuestions(form, this.answers).map((q) => this.question(q))}<label
                          >${this.t("備註（可留空）", "Comment (optional)")}<textarea
                            maxlength="10000"
                            .value=${this.comment}
                            @input=${(e: Event) => (this.comment = (e.target as HTMLTextAreaElement).value)}
                          ></textarea>
                        </label>`
                }
              `
            : nothing
        }
        <div class="footer">
          <button ?disabled=${this.busy} @click=${() => this.close()}>
            ${this.t("關閉", "Close")}
          </button>
          ${unresolved ? html`<button ?disabled=${this.busy} @click=${() => this.check()}>${this.t("檢查結果", "Check result")}</button>` : nothing}
          ${
            available && form
              ? this.reviewing
                ? html`<button
                      ?disabled=${this.busy}
                      @click=${() => (this.reviewing = false)}
                    >
                      ${this.t("返回修改", "Edit answers")}</button
                    ><button
                      class="primary"
                      ?disabled=${this.busy}
                      @click=${() => this.submit()}
                    >
                      ${this.busy ? this.t("提交中…", "Submitting…") : this.t("確認並簽署", "Confirm and sign")}
                    </button>`
                : html`<button
                    class="primary"
                    ?disabled=${this.busy || !validAnswers(form, this.answers)}
                    @click=${() => (this.reviewing = true)}
                  >
                    ${this.t("檢查回覆", "Review reply")}
                  </button>`
              : nothing
          }
        </div>
      </dialog>`;
  }
}
customElements.define("hkte-sign-notice", HkteSignNotice);
