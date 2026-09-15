# HKTE Smart School Notices Card

Lovelace card for the [HKTE Smart School Home Assistant integration](https://github.com/wfchan/hass-hkte-smart-school), including optional direct HKTE signing.

> [!IMPORTANT]
> This card must be installed together with the **HKTE Smart School**
> Home Assistant integration. The card is only a dashboard view of that
> integration: on its own it has no data source and renders an installation
> warning instead of notices.

## Card preview

![HKTE notices card layout using synthetic sample data](screenshots/card-layout.png)

The preview shows the current deadline and attachment controls with synthetic sample content and no real student data.

## HACS installation

[![Open your Home Assistant instance and show the HACS plugins dashboard](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=wfchan&repository=hass-hkte-smart-school-card&category=plugin)

In HACS, add `https://github.com/wfchan/hass-hkte-smart-school-card` as a custom repository with category **Plugin**, install **HKTE Smart School Notices Card**, then add the generated resource when Home Assistant prompts you. Use card **0.4.3** with integration **0.6.2**. Downloads, AI summaries and direct HKTE signing require integration **0.6.0** or newer.

## Dashboard card

With no `entities`, the card discovers all HKTE notice-content sensors. Explicit entities are useful when a dashboard should show only one student:

```yaml
type: custom:hkte-notices-card
title: HKTE Notices
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

The card reads Home Assistant entity state and uses authenticated integration endpoints for downloads and analysis. It never calls HKTE directly or marks notices read merely by opening them. Attachments show filename, MIME type, size and a download icon. Notice bodies and AI results are escaped text; embedded links and media are never loaded.

When no notice sensor is found, the card renders an installation warning naming the required HKTE Smart School integration and linking to it, instead of an empty card.

## Downloads and AI

Download buttons work without AI configuration. Files are fetched with your HA login and saved by the browser; HKTE URLs and session tokens are never exposed. Configure AI in the integration options, not the card: enable AI and enter a Base URL, API key and image-capable model. Press **AI summary** to analyze the entire notice and PDF/JPEG/PNG attachments. This transmits private school documents to your chosen provider only when you request it.

The card shows progress, safe errors, partial results and missing filenames. Traditional Chinese highlights, dates, costs, parent actions and questions are shown without attachment filenames or page-number references. Existing summaries are loaded without a new AI call, retained locally for 30 days, and marked stale after source changes. **Analyze again** explicitly replaces a result. Each analysis permits 10 attachments, 40 MiB total and 20 pages; each download is limited to 20 MiB. Check summaries against original documents before acting.

The card uses the HKTE system's configured reply deadline, regardless of AI analysis status; missing system deadlines are shown as not provided. With integration v0.4.9 or later, AI summaries flag PDF discrepancies and give precedence to the system reply deadline. Event and submission dates remain separate. Analyze older summaries again to apply this rule.

The card validates all five AI summary sections, bounds displayed text and source
references, shows empty sections as **Not provided**, and keeps an existing
valid summary visible when a new response is malformed. It supports MiniMax-M3 with
the integration's schema negotiation, bounded retry, incomplete-response detection
and optional FIFO analysis queue. OpenAI-compatible models still need image-input
support; consistent display is not a guarantee of factual accuracy.

Downloads and summaries require entity read permission. API keys, downloaded bytes and summaries are not written into card configuration or entity state. Check your AI provider's privacy and retention policy before use. See the integration README for privacy and storage details. `show_attachments` controls both metadata and download rows; it does not exclude files from whole-notice AI analysis.

## Direct HKTE signing

When direct signing is enabled in the integration options, the card can show a
signing entry for supported notices. Review every question and option, choose
the answers yourself, select **Review reply**, and then select **Confirm and
sign**. The card never supplies defaults or AI-generated answers. Payment,
uploads, unknown question types, expired notices and already-signed notices are
blocked and should be handled in the official HKTE app.

Opening the form is read-only. A submission is saved locally before the HKTE
request, and an uncertain result is never sent again automatically. Wait at
least five minutes before using **Check result**; the check only reads the
provider's saved reply. A confirmed reply cannot be undone or edited from the
card. The signing control requires Home Assistant entity
control permission and does not mark a notice read when opened.

Each notice title row includes its issued date. Read notices use a green eye icon, and replied notices use a sign icon; these status icons stay aligned to the far right for quick scanning. Unread notices retain the orange **Unread** badge, a highlighted row style, and a short attention pulse (disabled when reduced motion is enabled).

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
