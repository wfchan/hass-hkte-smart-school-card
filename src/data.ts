import type {
  HassEntity,
  HomeAssistant,
  Notice,
  NoticeAttachment,
  NoticeFeed,
} from "./types";

const MAX_NOTICES = 20;
const MAX_DAYS = 365;

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function nullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function attachment(value: unknown): NoticeAttachment | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const filename = text(item.filename);
  if (!filename) return null;
  return {
    filename,
    mime_type: text(item.mime_type, "application/octet-stream"),
    size: typeof item.size === "number" && item.size >= 0 ? item.size : null,
  };
}

function notice(value: unknown, index: number): Notice | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const title = text(item.title, "Untitled notice");
  return {
    id: text(item.id, `notice-${index}`),
    title,
    content: text(item.content),
    issued_at: nullableText(item.issued_at),
    deadline: nullableText(item.deadline),
    unread: nullableBoolean(item.unread),
    replied: nullableBoolean(item.replied),
    content_truncated: item.content_truncated === true,
    attachments: Array.isArray(item.attachments)
      ? item.attachments
          .map(attachment)
          .filter((item): item is NoticeAttachment => item !== null)
      : [],
  };
}

function noticeTime(value: string | null): number {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = Date.parse(value);
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

export function normalizeFeed(
  entityId: string,
  entity: HassEntity,
): NoticeFeed | null {
  const raw = entity.attributes.notices;
  if (!Array.isArray(raw)) return null;
  const normalized = raw
    .map(notice)
    .filter((item): item is Notice => item !== null)
    .sort((a, b) => noticeTime(b.issued_at) - noticeTime(a.issued_at));
  const notices = [
    ...normalized
      .reduce((unique, item) => {
        if (!unique.has(item.id)) unique.set(item.id, item);
        return unique;
      }, new Map<string, Notice>())
      .values(),
  ];
  return {
    entityId,
    name: text(entity.attributes.friendly_name, entityId),
    state: entity.state,
    notices,
    hasMore: entity.attributes.has_more === true,
  };
}

export function discoverFeeds(
  hass: HomeAssistant,
  configured?: string[],
): NoticeFeed[] {
  const ids = configured?.length ? configured : Object.keys(hass.states);
  return ids
    .map((entityId) => {
      const entity = hass.states[entityId];
      return entity ? normalizeFeed(entityId, entity) : null;
    })
    .filter((feed): feed is NoticeFeed => feed !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function visibleNotices(
  feed: NoticeFeed,
  filter: "all" | "unread",
  limit: number,
  days = 0,
  now = Date.now(),
): Notice[] {
  const boundedLimit = Math.min(MAX_NOTICES, Math.max(1, Math.round(limit)));
  const boundedDays = clampDays(days);
  const cutoff = now - boundedDays * 24 * 60 * 60 * 1000;
  return feed.notices
    .filter((item) => filter === "all" || item.unread === true)
    .filter((item) => {
      if (boundedDays === 0 || !item.issued_at) return true;
      const issued = Date.parse(item.issued_at);
      return Number.isNaN(issued) || issued >= cutoff;
    })
    .slice(0, boundedLimit);
}

export function clampLimit(limit: unknown): number {
  const value =
    typeof limit === "number" && Number.isFinite(limit) ? limit : MAX_NOTICES;
  return Math.min(MAX_NOTICES, Math.max(1, Math.round(value)));
}

export function clampDays(days: unknown): number {
  const value = typeof days === "number" && Number.isFinite(days) ? days : 0;
  return Math.min(MAX_DAYS, Math.max(0, Math.round(value)));
}

export const MAX_NOTICE_LIMIT = MAX_NOTICES;
export const MAX_NOTICE_DAYS = MAX_DAYS;
