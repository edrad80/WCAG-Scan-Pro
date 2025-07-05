# WCAG Scan Pro – Chrome Extension for Accessibility Auditing

**WCAG Scan Pro** is a lightweight Chrome extension that scans any webpage for accessibility issues based on **WCAG 2.2 AA standards**. It produces a clear, structured report highlighting violations, severity, element location, and direct links to relevant fixes.

## 🚀 Features

- Click the extension icon to trigger a full-page WCAG 2.2 AA scan
- New tab displays a full report:
  - Issue description
  - Severity level (Critical, Moderate, Low)
  - Line number or DOM path
  - Direct link to relevant WCAG guideline or suggested fix
- Export report as **PDF** or **JSON**
- Modular rule engine for extending checks
- Fast, client-side scanning using injected content scripts

## 🧰 Tech Stack

- **JavaScript** (ES6+)
- **Chrome Extension APIs** (`tabs`, `scripting`, `storage`, `runtime`)
- **axe-core** (optional) or custom scanning engine
- **HTML/CSS** for report display and popup UI

## 📦 Installation (Dev Mode)

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/wcag-scan-pro.git
