import { css, html } from "lit";
import type { AnalysisState } from "./analysis-state";
import type { HomeAssistant } from "./types";

export const deadlineStyles = css`
  .meta {
    padding: 0 0 14px;
  }
  .deadline {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    align-items: center;
    gap: 3px 10px;
    color: var(--primary-text-color);
  }
  .deadline-icon {
    grid-row: span 2;
    width: 24px;
    height: 24px;
    color: var(--primary-color);
  }
  .deadline-icon svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }
  .deadline-label {
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    font-weight: 500;
  }
  .deadline-value {
    min-width: 0;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
`;

export function aiDeadline(
  state: AnalysisState | undefined,
  hass?: HomeAssistant,
) {
  const language = hass?.locale?.language ?? hass?.config?.language ?? "en";
  const zh = language.startsWith("zh");
  let label = zh ? "AI 截止日期" : "AI deadline";
  let value = zh ? "待 AI 分析" : "Awaiting AI analysis";
  if (state?.status === "running") value = zh ? "AI 分析中" : "Analyzing";
  else if (
    state?.stale ||
    (state?.summary && state.primary_deadline === undefined)
  )
    value = zh ? "請重新分析取得截止日期" : "Analyze again to extract deadline";
  else if (state?.status === "failed")
    value = zh ? "分析失敗，請重試" : "Analysis failed; retry";
  else if (state?.status === "partial")
    value = zh ? "分析未完整，待確認" : "Partial analysis; confirmation needed";
  else if (state?.status === "completed") {
    const deadline = state.primary_deadline;
    if (deadline) {
      label =
        deadline.kind === "reply"
          ? zh
            ? "AI 回覆期限"
            : "AI reply deadline"
          : zh
            ? "AI 交件期限"
            : "AI submission deadline";
      const timed = deadline.time !== null;
      // A date-only deadline is a calendar date, never an invented end-of-day time.
      const instant = new Date(
        `${deadline.date}T${deadline.time ?? "00:00"}:00${timed ? "+08:00" : "Z"}`,
      );
      value = new Intl.DateTimeFormat(language, {
        dateStyle: "medium",
        ...(timed ? { timeStyle: "short" as const } : {}),
        timeZone: timed ? "Asia/Hong_Kong" : "UTC",
      }).format(instant);
    } else value = zh ? "未找到明確截止日期" : "No explicit deadline found";
  }
  return html`<div class="meta">
    <span class="deadline">
      <span class="deadline-icon" aria-hidden="true"
        ><svg viewBox="0 0 24 24" focusable="false">
          <rect x="3" y="4.5" width="13" height="16" rx="2" />
          <path d="M7 2.5v4M12 2.5v4M3 9h13" />
          <circle cx="17.5" cy="16.5" r="4" />
          <path d="M17.5 14.5v2.3l1.5 1" /></svg
      ></span>
      <span class="deadline-label">${label}</span
      ><span class="deadline-value">${value}</span>
    </span>
  </div>`;
}
