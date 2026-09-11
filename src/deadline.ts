import { css, html } from "lit";
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

export function systemDeadline(deadline: string | null, hass?: HomeAssistant) {
  const language = hass?.locale?.language ?? hass?.config?.language ?? "en";
  const zh = language.startsWith("zh");
  const label = zh ? "HKTE 系統回覆限期" : "HKTE reply deadline";
  let value = zh ? "HKTE 未提供回覆限期" : "No HKTE reply deadline provided";
  if (deadline) {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
    const instant = new Date(dateOnly ? `${deadline}T00:00:00Z` : deadline);
    if (Number.isFinite(instant.getTime())) {
      value = new Intl.DateTimeFormat(language, {
        dateStyle: "medium",
        ...(dateOnly ? {} : { timeStyle: "short" as const }),
        timeZone: dateOnly ? "UTC" : "Asia/Hong_Kong",
      }).format(instant);
    }
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
