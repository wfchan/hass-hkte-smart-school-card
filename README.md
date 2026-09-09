# HKTE Smart School Notices Card

![HKTE Smart School integration icon](https://raw.githubusercontent.com/wfchan/hass-hkte-smart-school/main/custom_components/hkte_smart_school/brand/icon.png)

Read-only Lovelace card for the [HKTE Smart School Home Assistant integration](https://github.com/wfchan/hass-hkte-smart-school).

## Card preview

![HKTE notices card layout using synthetic sample data](screenshots/card-layout.png)

The preview uses synthetic sample content and contains no student data.

## HACS installation

In HACS, add `https://github.com/wfchan/hass-hkte-smart-school-card` as a custom repository with category **Plugin**, install **HKTE Smart School Notices Card**, then add the generated resource when Home Assistant prompts you. Card 0.2.0 requires integration **0.4.0** for downloads and AI summaries.

## Dashboard card

With no `entities`, the card discovers all HKTE notice-content sensors. Explicit entities are useful when a dashboard should show only one student:

```yaml
type: custom:hkte-notices-card
title: HKTE 通告
entities:
  - sensor.student_notice_content
entity_names:
  sensor.student_notice_content: Hayhay
filter: all
limit: 5
days: 0
initially_expanded: latest
show_student_name: true
show_attachments: true
```

The card reads Home Assistant entity state and uses authenticated integration endpoints for explicit downloads and analysis. It never calls HKTE directly, marks notices as read or sends replies. Attachments show filename, MIME type, size and a download icon. Notice bodies and AI results are escaped text; embedded links and media are never loaded.

## Downloads and AI

Download buttons work without AI configuration. Files are fetched with your HA login and saved by the browser; HKTE URLs and session tokens are never exposed. Configure AI in the integration options, not the card: enable AI and enter a Base URL, API key and image-capable model. Press **AI 整理重點** to analyze the entire notice and PDF/JPEG/PNG attachments. This transmits private school documents to your chosen provider only when you request it.

The card shows progress, safe errors, partial results and missing filenames. Traditional Chinese highlights, dates, costs, parent actions and questions are shown without attachment filenames or page-number references. Existing summaries are loaded without a new AI call, retained locally for 30 days, and marked stale after source changes. **重新分析** explicitly replaces a result. Each analysis permits 10 attachments, 40 MiB total and 20 pages; each download is limited to 20 MiB. Check summaries against original documents before acting.

Version **0.2.5** gives deadlines a calendar icon and highlighted callout, and removes redundant horizontal separators between notice sections. Version **0.2.4** places the icon-only analyze/reanalyze action in the same attachment row as download and hides the `FILE` MIME label. Version **0.2.3** hides AI source filenames/page numbers and places the icon-only analyze/reanalyze action beside attachment controls. Version **0.2.2** presents each notice as a distinct responsive panel with separated header, deadline, body, attachments and AI summary regions. Version **0.2.1** validates API results before rendering: all five sections, bounded plain text and valid source/page references are required. Empty sections show **未提供 / Not provided**. Malformed results show a retryable error, while an existing valid summary stays visible. Use integration **0.4.2** for MiniMax-M3 reasoning separation, schema negotiation, bounded format retry and incomplete-response detection. OpenAI-compatible models still need image-input support; consistent display is not a guarantee of factual accuracy.

Downloads and summaries require entity read permission. API keys, downloaded bytes and summaries are not written into card configuration or entity state. See the integration README for privacy and storage details. `show_attachments` controls both metadata and download rows; it does not exclude files from whole-notice AI analysis.

Each notice title row includes its issued date. Read notices use a green eye icon, and replied notices use a sign icon; these status icons stay aligned to the far right for quick scanning. Unread notices retain the orange `未讀` badge, a highlighted row style, and a short attention pulse (disabled when reduced motion is enabled).

## Configuration

`entities` is optional and accepts one or more `notice_content` sensor entity IDs. `entity_names` can rename each configured entity's student heading; `filter` is `all` or `unread` and is applied from card configuration without dashboard tabs; `limit` is 1-20 and defaults to 5; `days` is a numeric input from 0-30 that limits results to notices issued within the most recent number of days (`0` means no date limit); `initially_expanded` controls the default view (`latest` expands the latest notice, `none` collapses the latest notice, and `all` expands all notices); `show_student_name` controls whether the student heading is shown; and `show_attachments` controls metadata rows.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## License

MIT
