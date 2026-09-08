export type NoticeFilter = "all" | "unread";
export type ExpandedMode = "latest" | "none" | "all";

export interface HkteNoticesCardConfig {
  type: "custom:hkte-notices-card";
  entities?: string[];
  entity_names?: Record<string, string>;
  title?: string;
  filter?: NoticeFilter;
  limit?: number;
  days?: number;
  initially_expanded?: ExpandedMode;
  show_attachments?: boolean;
}

export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language?: string };
  config?: { time_zone?: string; language?: string };
}

export interface NoticeAttachment {
  filename: string;
  mime_type: string;
  size: number | null;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  issued_at: string | null;
  deadline: string | null;
  unread: boolean | null;
  replied: boolean | null;
  content_truncated: boolean;
  attachments: NoticeAttachment[];
}

export interface NoticeFeed {
  entityId: string;
  name: string;
  state: string;
  notices: Notice[];
  hasMore: boolean;
}
