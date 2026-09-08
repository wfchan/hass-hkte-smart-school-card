# HKTE Smart School Notices Card

Read-only Lovelace card for the [HKTE Smart School Home Assistant integration](https://github.com/wfchan/hass-hkte-smart-school).

## HACS installation

In HACS, add `https://github.com/wfchan/hass-hkte-smart-school-card` as a custom repository with category **Plugin**, install **HKTE Smart School Notices Card**, then add the generated resource when Home Assistant prompts you. The card requires integration version 0.3.x or newer.

## Dashboard card

With no `entities`, the card discovers all HKTE notice-content sensors. Explicit entities are useful when a dashboard should show only one student:

```yaml
type: custom:hkte-notices-card
title: HKTE 通告
entities:
  - sensor.student_notice_content
filter: all
limit: 20
initially_expanded: latest
show_attachments: true
```

The card only reads Home Assistant entity state. It does not call HKTE, mark notices as read, send replies, or download attachment files. Attachments are shown as filename, MIME type and size metadata only. Notice bodies are rendered as plain text and embedded links or media are never loaded.

## Configuration

`entities` is optional and accepts one or more `notice_content` sensor entity IDs. `filter` is `all` or `unread`; `limit` is 1-20; `initially_expanded` is `latest`, `none` or `all`; and `show_attachments` controls metadata rows.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## License

MIT
