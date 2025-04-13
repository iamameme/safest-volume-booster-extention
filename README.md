# 📢 Safest Volume Booster Chrome Extension

**Safest Volume Booster** is a lightweight Chrome extension that allows you to **boost the volume of HTML5 video elements beyond the default 100%**, using the Web Audio API.

Most importantly, this has **as little permissions as possible**.

## Why I Made This

I had a volume booster extention for years via the Chrome App Store. There is a large issue with extentions getting hijacked and malicious code being uploaded. Due to extentions auto-updating, a malicious actor uploaded an update to it and got access to all my sessions. **My bank session, my work sessions, etc.**

## ⚠️ Why Extension Permissions Matter

Most Chrome extensions request **broad or excessive permissions** like:

- `tabs` – lets them read every page you visit
- `storage` – lets them persist data across sessions
- `host permissions` (e.g., `https://*/*`) – grants access to all sites

**This opens the door to privacy risks**, data leaks, and abuse. Once installed, an extension can silently read or inject code into anything you browse — including emails, passwords, or bank sites.

---

## ✅ Why This Extension is Safe

This extension was built with **minimal permissions**:

| Permission   | Why it’s needed |
|--------------|-----------------|
| `activeTab`  | To modify video elements on the current page when you use the popup |
| `scripting`  | To inject volume boost logic |
| `storage`   | To persist currently selected volume. ONLY has access to it's own storage, NOTHING else |

> It does **not** request access to all tabs, all websites, or long-term storage.

No background scripts, no trackers, no persistent storage — just a single-purpose tool that respects your browser and your privacy.

---

## Why you have to click the extention for it to apply

I didn't want to run anything in the background. It only has the ability to run any code when it is clicked on.

## 📁 Installation (for Developers)

1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **“Load Unpacked”** and select the project folder
5. Use the popup to boost video volume!

---

## 👀 Notes

- Works on most video players using `<video>` tags
- Some sites (like Netflix or YouTube) may restrict audio routing due to strict CSP (Content Security Policy)
- You may need to press **Play** once for the volume boost to take effect

---

## 🛡️ Chrome App Store

At some point
