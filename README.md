# HKTE Smart School Notices Card

Lovelace card for the [HKTE Smart School Home Assistant integration](https://github.com/wfchan/hass-hkte-smart-school), with optional confirmed notice signing.

## 繁體中文說明

這是一張 Home Assistant Lovelace 卡片，用於顯示 HKTE Smart School 子女通告。下載、AI 分析及可選的通告簽署均透過受 HA 權限保護的整合端點，卡片不會直接呼叫 HKTE。閱讀或展開通告不會改變 HKTE 狀態。

### 簽署通告

需要整合 v0.5.0 或更新版本，並在整合選項啟用 Message Hub 簽署、填寫 HTTPS 網址及專用 HKTE API key。卡片設定不儲存金鑰。

只有 API 允許簽署時才顯示按鈕。親自選擇答案後，按「檢查回覆」，再按「確認並簽署」。支援知悉、選擇題、文字、數量及條件題，不預設同意、不由 AI 代答。過期或不支援的表格會顯示原因，請在官方 App 處理。簽署無法在此撤銷或修改；若結果不明，至少等候五分鐘後按「檢查結果」，不要建立另一筆簽署。

### Sign notices

Requires integration v0.5.0 or later with Message Hub signing enabled and its HTTPS URL/dedicated HKTE key configured in integration options. Keys are never stored in the card.

The button appears only when the API permits signing. Choose answers yourself, select **Review reply**, then **Confirm and sign**. Acknowledgement, choice, text, quantities and conditional questions are supported without default consent or AI answers. Blocked forms show a reason and must be handled in the official app. Replies cannot be undone or edited here. For uncertain results, wait at least five minutes and use **Check result** instead of signing again.

### HACS 安裝

上方的 HACS 按鈕可直接開啟卡片安裝頁。也可在 HACS 加入 `https://github.com/wfchan/hass-hkte-smart-school-card` 作為 **Plugin**，安裝 **HKTE Smart School Notices Card**，並在 Home Assistant 資源提示出現時加入產生的 JavaScript resource。建議與 HKTE Smart School 整合一起使用。

### 顯示及設定

不設定 `entities` 時，卡片會自動尋找所有 `notice_content` 感測器；亦可指定一個或多個實體。支援全部/未讀篩選、顯示數量（預設 5）、日期範圍、最新/全部/不展開、子女名稱及附件 metadata。

每份通告會顯示標題、發出日期、已讀/已回覆狀態、截止日期及正文。附件會顯示檔名、MIME 類型及大小，下載按鈕使用整合的驗證端點。正文及 AI 結果會以安全純文字顯示，不載入內嵌連結或媒體。

### AI 摘要

卡片的回覆限期以 HKTE 系統設定為準，不受 AI 分析狀態影響；系統未提供時會明確顯示未提供。搭配整合 v0.4.9 或更新版本，AI 會提示 PDF 與系統日期的差異，並以系統回覆限期為準，活動及交件日期則另外列出。請重新分析舊摘要以套用此規則。

The card uses the HKTE system's configured reply deadline, regardless of AI analysis status; missing system deadlines are shown as not provided. With integration v0.4.9 or later, AI summaries flag PDF discrepancies and give precedence to the system reply deadline. Event and submission dates remain separate. Analyze older summaries again to apply this rule.

按「AI 整理重點」才會開始分析；「重新分析」會明確取代現有結果。摘要包含內容重點、重要日期、費用、家長待辦及需確認事項，不顯示附件檔名或頁碼引用。處理進度、部分完成、錯誤重試及未提供欄目都會清楚顯示。

目前只測試及支援 **MiniMax-M3**，其他 OpenAI-compatible model 尚未測試。每次分析最多 10 個附件、40 MiB 及 20 頁；摘要保留 30 天，來源改變時會標示需要重新分析。AI 設定在整合選項中完成，卡片設定不會儲存 API key。

### 私隱

只有在你按下分析按鈕（或在整合中啟用新增通告自動分析）時，通告正文及支援的附件頁面才會傳送到你設定的 AI 服務。下載檔案及 API key 不會寫入卡片設定或實體狀態。請在使用前確認 AI 服務的私隱及資料保留政策。

## Card preview

![HKTE notices card layout using synthetic sample data](screenshots/card-layout.png)

The preview shows the current deadline and attachment controls with synthetic sample content and no real student data.

## HACS installation

[![Open your Home Assistant instance and show the HACS plugins dashboard](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=wfchan&repository=hass-hkte-smart-school-card&category=plugin)

In HACS, add `https://github.com/wfchan/hass-hkte-smart-school-card` as a custom repository with category **Plugin**, install **HKTE Smart School Notices Card**, then add the generated resource when Home Assistant prompts you. The recommended pairing is card **0.2.6** with integration **0.4.5**. Downloads and manual AI summaries require integration **0.4.0** or newer; optional automatic new-notice analysis requires **0.4.3** or newer.

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

The card reads Home Assistant entity state and uses authenticated integration endpoints for downloads, analysis and explicitly confirmed signing. It never calls HKTE directly or marks notices read merely by opening them. Attachments show filename, MIME type, size and a download icon. Notice bodies and AI results are escaped text; embedded links and media are never loaded.

## Downloads and AI

Download buttons work without AI configuration. Files are fetched with your HA login and saved by the browser; HKTE URLs and session tokens are never exposed. Configure AI in the integration options, not the card: enable AI and enter a Base URL, API key and image-capable model. Press **AI 整理重點** to analyze the entire notice and PDF/JPEG/PNG attachments. This transmits private school documents to your chosen provider only when you request it.

The card shows progress, safe errors, partial results and missing filenames. Traditional Chinese highlights, dates, costs, parent actions and questions are shown without attachment filenames or page-number references. Existing summaries are loaded without a new AI call, retained locally for 30 days, and marked stale after source changes. **重新分析** explicitly replaces a result. Each analysis permits 10 attachments, 40 MiB total and 20 pages; each download is limited to 20 MiB. Check summaries against original documents before acting.

The card validates all five AI summary sections, bounds displayed text and source
references, shows empty sections as **未提供 / Not provided**, and keeps an existing
valid summary visible when a new response is malformed. It supports MiniMax-M3 with
the integration's schema negotiation, bounded retry, incomplete-response detection
and optional FIFO analysis queue. OpenAI-compatible models still need image-input
support; consistent display is not a guarantee of factual accuracy.

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
