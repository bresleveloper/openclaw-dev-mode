import { n as DAY_MS, r as describePeriod } from "./limits-iMrGeJ-3.mjs";
import path, { join } from "node:path";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { TLSSocket } from "node:tls";
import { getPluginRuntimeGatewayRequestScope } from "openclaw/plugin-sdk/plugin-runtime";
import { buildControlUiSessionPath } from "openclaw/plugin-sdk/session-discussion";
import { dispatchGatewayMethod } from "openclaw/plugin-sdk/gateway-method-runtime";
import { openSqliteWorkerStore } from "openclaw/plugin-sdk/sqlite-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/team-reports/src/render/shared.ts
function escapeHtml(value) {
	return value.replace(/[&<>"']/g, (character) => {
		switch (character) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "\"": return "&quot;";
			default: return "&#39;";
		}
	});
}
function renderAvatar(login, display, size) {
	const words = (display.trim() || login).split(/\s+/);
	const initials = (words.length > 1 ? `${Array.from(words[0] ?? "")[0] ?? ""}${Array.from(words.at(-1) ?? "")[0] ?? ""}` : Array.from(words[0] ?? "").slice(0, 2).join("")).toUpperCase();
	const pixels = {
		xs: 20,
		sm: 36,
		md: 40,
		xl: 72
	}[size];
	const image = /^[A-Za-z0-9-]{1,39}$/.test(login) ? `<img src="https://avatars.githubusercontent.com/${escapeHtml(login)}?s=${pixels}" width="${pixels}" height="${pixels}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : "";
	return `<span class="oc-avatar oc-avatar-${size}" data-initials="${escapeHtml(initials)}">${image}</span>`;
}
function safeExternalUrl(value) {
	try {
		const url = new URL(value);
		if ((url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password) return url.href;
	} catch {
		return;
	}
}
const ITEM_LABELS = {
	commit: "Commit",
	pr_opened: "PR opened",
	pr_merged: "PR merged",
	pr_closed: "PR closed",
	issue_opened: "Issue opened",
	issue_closed: "Issue closed",
	issue_comment: "Issue comment",
	review_comment: "Review comment",
	security_advisory: "Security advisory"
};
function countDescription(counts) {
	return [
		[counts.commits, "commits"],
		[counts.prsOpened, "PRs opened"],
		[counts.prsMerged, "PRs merged"],
		[counts.prsClosed, "PRs closed"],
		[counts.issuesOpened, "issues opened"],
		[counts.issuesClosed, "issues closed"],
		[counts.issueComments, "issue comments"],
		[counts.reviewComments, "review comments"],
		[counts.securityAdvisories, "security advisories"]
	].filter(([count]) => count > 0).map(([count, label]) => `${count} ${label}`).join(" · ") || "No GitHub activity recorded.";
}
function memberSummary(member) {
	return member.summary?.text ?? (member.github.total + member.discord.total === 0 ? "No GitHub activity or Discord messages recorded in this period." : `${member.github.total} GitHub events and ${member.discord.total} Discord messages recorded in this period.`);
}
//#endregion
//#region extensions/team-reports/src/render/charts.ts
function sparklineSvg(values, label, large = false) {
	if (values.length < 2) return "";
	const width = large ? 600 : 120;
	const height = large ? 48 : 28;
	const minimum = Math.min(...values);
	const span = Math.max(...values) - minimum || 1;
	const y = (value) => Number((height - 3 - (value - minimum) / span * (height - 6)).toFixed(1));
	const path = values.map((value, index) => `${index ? `V${y(value)}` : `M0 ${y(value)}`} H${Number(((index + 1) * width / values.length).toFixed(1))}`).join(" ");
	const endpoint = Math.min(Math.max(y(values.at(-1) ?? 0) - 2, 0), height - 4);
	return `<svg class="oc-sparkline"${large ? " data-size=\"lg\"" : ""} viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(label)}"><path class="oc-sparkline-line" d="${path}"/><rect class="oc-sparkline-endpoint" x="${width - 3}" y="${endpoint}" width="3" height="4"/></svg>`;
}
function deltaMarkup(current, previous, label, badUp = false) {
	if (previous === void 0) return "";
	const change = current - previous;
	const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
	const arrow = change > 0 ? "&#9650;" : change < 0 ? "&#9660;" : "&#8212;";
	const body = previous === 0 ? change === 0 ? "no change" : `+${change}` : `${change > 0 ? "+" : ""}${Math.round(change / previous * 100)}%`;
	return `<span class="oc-delta" data-direction="${direction}"${badUp && change !== 0 ? ` data-tone="${change > 0 ? "negative" : "positive"}"` : ""}><span class="oc-delta-arrow" aria-hidden="true">${arrow}</span>${body} vs ${escapeHtml(label)}</span>`;
}
function splitMarkup(items) {
	const shown = items.filter((item) => item.value > 0);
	const total = shown.reduce((sum, item) => sum + item.value, 0);
	if (!total) return "";
	let x = 0;
	const rects = shown.map((item) => {
		const width = item.value / total * 100;
		const rect = `<rect class="oc-split-segment${item.tone ? ` oc-split-${escapeHtml(item.tone)}` : ""}" x="${x.toFixed(2)}" y="0" width="${width.toFixed(2)}" height="8"/>`;
		x += width;
		return rect;
	}).join("");
	return `<svg class="oc-split" viewBox="0 0 100 8" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(`Composition: ${shown.map((item) => `${item.label} ${Math.round(item.value / total * 100)}%`).join(", ")}`)}">${rects}</svg><ul class="oc-split-legend">${shown.map((item) => `<li><span class="oc-split-key${item.tone ? ` oc-split-${escapeHtml(item.tone)}` : ""}" aria-hidden="true"></span>${escapeHtml(item.label)} ${Math.round(item.value / total * 100)}%</li>`).join("")}</ul>`;
}
//#endregion
//#region extensions/team-reports/src/render/script.ts
const REPORT_SCRIPT = `(() => {
  const root = document.documentElement;
  const query = matchMedia('(prefers-color-scheme: light)');
  const storedTheme = () => {
    try { const value = localStorage.getItem('theme'); return value === 'light' || value === 'dark' ? value : ''; } catch { return ''; }
  };
  const fragmentTheme = () => {
    const value = new URLSearchParams(location.hash.slice(1)).get('theme');
    return value === 'light' || value === 'dark' ? value : '';
  };
  root.dataset.theme = fragmentTheme() || storedTheme() || (query.matches ? 'light' : 'dark');
  document.addEventListener('DOMContentLoaded', () => {
    root.dataset.js = 'true';
    const applyTheme = (theme, persist) => {
      root.dataset.theme = theme;
      if (persist) {
        try { localStorage.setItem('theme', theme); } catch {}
        history.replaceState(null, '', '#theme=' + theme);
      }
      // Opaque-origin frames cannot use storage; carry their choice through report links.
      const basePath = root.dataset.reportBasePath;
      for (const link of document.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href');
        const target = new URL(href, location.href);
        const internal = target.origin === location.origin &&
          (target.pathname === basePath || target.pathname.startsWith(basePath + '/'));
        if (internal || link.hasAttribute('data-report-open-window')) {
          link.setAttribute('href', href.split('#')[0] + '#theme=' + theme);
        }
      }
      for (const button of document.querySelectorAll('[data-theme-toggle]')) {
        button.setAttribute('aria-label', 'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme');
      }
    };
    applyTheme(root.dataset.theme, false);
    for (const link of document.querySelectorAll('[data-work-session-key]')) {
      link.addEventListener('click', event => {
        if (window.parent === window || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        // The authenticated host frame owns navigation; do not weaken its sandbox.
        window.parent.postMessage({type: 'openclaw-plugin-session-open', sessionKey: link.dataset.workSessionKey, ...(link.dataset.workSessionAgent ? {agentId: link.dataset.workSessionAgent} : {})}, location.origin);
      });
    }
    query.addEventListener('change', event => { if (!fragmentTheme() && !storedTheme()) applyTheme(event.matches ? 'light' : 'dark', false); });
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true));
    }
    const relative = new Intl.RelativeTimeFormat('en', {numeric:'auto'});
    const units = [['year',31536000000],['month',2592000000],['week',604800000],['day',86400000],['hour',3600000],['minute',60000],['second',1000]];
    const refresh = () => {
      for (const node of document.querySelectorAll('[data-relative-time]')) {
        const diff = Date.parse(node.getAttribute('datetime')) - Date.now();
        if (!Number.isFinite(diff)) continue;
        const [unit, ms] = units.find(([unit, ms]) => Math.abs(diff) >= ms || unit === 'second');
        node.textContent = relative.format(Math.round(diff / ms), unit);
      }
      for (const node of document.querySelectorAll('[data-day-countdown]')) {
        const until = Date.parse(node.dataset.until);
        if (!Number.isFinite(until)) continue;
        const minutes = Math.max(1, Math.ceil((until - Date.now()) / 60000));
        const remaining = minutes >= 60 ? Math.floor(minutes / 60) + 'h ' + minutes % 60 + 'm' : minutes + 'm';
        const close = new Date(until).toISOString().slice(11,16) + ' UTC';
        node.textContent = until <= Date.now() ? 'day closed at ' + close : 'closes in ' + remaining + ' (' + close + ')';
      }
    };
    refresh();
    setInterval(refresh, 60000);
    const nav = document.querySelector('.site-nav');
    const scrolled = () => { if (nav) nav.dataset.scrolled = window.scrollY > 0 ? 'true' : 'false'; };
    scrolled();
    window.addEventListener('scroll', scrolled, {passive:true});
    for (const button of document.querySelectorAll('[data-toggle]')) {
      const list = document.querySelector('[data-list="' + button.dataset.toggle + '"]');
      if (!list) continue;
      button.addEventListener('click', () => {
        const rows = [...list.querySelectorAll('[data-extra]')];
        const show = rows.some(row => row.hidden);
        for (const row of rows) row.hidden = !show;
        button.setAttribute('aria-expanded', String(show));
        button.textContent = show ? 'Show latest only' : 'Show all ' + list.querySelectorAll('.row').length;
      });
    }
    const filter = document.querySelector('[data-maintainer-filter]');
    const status = document.querySelector('[data-maintainer-filter-status]');
    const empty = document.querySelector('[data-maintainer-filter-empty]');
    if (filter) {
      const applyFilter = () => {
        const value = filter.value.trim().replace(/^@/, '').toLocaleLowerCase();
        const rows = [...document.querySelectorAll('[data-maintainer-search]')];
        for (const row of rows) row.hidden = !row.dataset.maintainerSearch.toLocaleLowerCase().includes(value);
        const shown = rows.filter(row => !row.hidden).length;
        if (status) status.textContent = shown + ' of ' + rows.length + ' members shown';
        if (empty) empty.hidden = shown > 0;
      };
      const params = new URLSearchParams(location.search);
      filter.value = params.get('person') || params.get('q') || '';
      filter.addEventListener('input', applyFilter);
      applyFilter();
    }
    const quiet = document.querySelector('[data-hide-inactive-toggle]');
    if (quiet) quiet.addEventListener('change', () => {
      root.dataset.peopleHideInactive = quiet.checked ? 'true' : 'false';
    });
  });
})();`;
//#endregion
//#region extensions/team-reports/src/render/styles.ts
const LIGHT_THEME = `
  color-scheme: light;
  --oc-bg-page: oklch(0.985 0 0);
  --oc-bg-surface: oklch(0.97 0 0);
  --oc-bg-elevated: oklch(1 0 0);
  --oc-bg-recessed: color-mix(in oklch, var(--oc-bg-page) 94%, var(--oc-text-primary));
  --oc-text-primary: oklch(0.205 0 0);
  --oc-text-secondary: oklch(0.269 0 0);
  --oc-text-muted: oklch(0.555 0 0);
  --oc-text-link: var(--oc-accent-primary);
  --oc-accent-primary: color-mix(in srgb, #c24028 60%, #9c3222 40%);
  --oc-accent-primary-hover: color-mix(in srgb, #c24028 30%, #9c3222 70%);
  --oc-accent-primary-deep: #9c3222;
  --oc-accent-secondary: #14806e;
  --oc-accent-secondary-deep: #0f6355;
  --oc-text-on-accent: oklch(1 0 0);
  --oc-border-accent: rgb(216 74 49 / 0.42);
  --oc-status-error-bg: rgb(239 68 68 / 0.1);
  --oc-status-error-fg: #b91c1c;
  --oc-border-subtle: oklch(0.922 0 0);
  --oc-border-strong: color-mix(in oklch, var(--oc-text-primary) 28%, transparent);
  --oc-surface-card: oklch(1 0 0);
  --oc-surface-card-strong: oklch(1 0 0);
  --oc-surface-interactive: oklch(0.97 0 0);
  --oc-surface-interactive-hover: oklch(0.922 0 0);
  --oc-surface-accent-soft: rgb(216 74 49 / 0.12);
  --oc-surface-secondary-soft: rgb(20 128 110 / 0.13);
  --oc-chart-line: oklch(0.205 0 0 / 0.12);
  --oc-focus-ring: oklch(0.15 0 0 / 0.7);
  --oc-selection-bg: rgb(216 74 49 / 0.2);
  --oc-status-success-bg: rgb(34 197 94 / 0.1);
  --oc-status-success-fg: #146c37;
  --oc-status-warning-bg: rgb(245 158 11 / 0.1);
  --oc-status-warning-fg: #8f5100;
  --oc-status-info-bg: rgb(37 99 235 / 0.1);
  --oc-status-info-fg: #1d4ed8;
`;
const REPORT_STYLES = `
.work-session { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 16px; }
body[data-report-page="sessions"] .shell > .oc-card, body[data-report-page="sessions"] .shell > .actions { margin: var(--oc-space-4); }
.work-session-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.work-session-title { font-weight: 600; overflow-wrap: anywhere; }
.work-session-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: flex-end; font-size: 12px; }
@media (max-width: 640px) { .work-session { align-items: flex-start; flex-direction: column; } .work-session-meta { justify-content: flex-start; } }

:root {
  color-scheme: dark;
  --oc-bg-page: oklch(0.135 0 0);
  --oc-bg-surface: oklch(0.178 0 0);
  --oc-bg-elevated: oklch(0.205 0 0);
  --oc-bg-recessed: color-mix(in oklch, var(--oc-bg-page) 86%, oklch(0 0 0));
  --oc-text-primary: oklch(0.985 0 0);
  --oc-text-secondary: oklch(0.87 0 0);
  --oc-text-muted: oklch(0.716 0 0);
  --oc-text-link: var(--oc-accent-primary);
  --oc-accent-primary: #f5654a;
  --oc-accent-primary-hover: #e05540;
  --oc-accent-primary-deep: #b23a28;
  --oc-accent-secondary: #4fc8ae;
  --oc-accent-secondary-deep: #2fa48d;
  --oc-text-on-accent: oklch(0.135 0 0);
  --oc-border-accent: rgb(245 101 74 / 0.4);
  --oc-status-error-bg: rgb(239 68 68 / 0.12);
  --oc-status-error-fg: #f87171;
  --oc-border-subtle: oklch(0.269 0 0);
  --oc-border-strong: color-mix(in oklch, var(--oc-text-primary) 32%, transparent);
  --oc-surface-card: oklch(0.178 0 0 / 0.82);
  --oc-surface-card-strong: oklch(0.205 0 0 / 0.96);
  --oc-surface-interactive: oklch(0.178 0 0);
  --oc-surface-interactive-hover: oklch(0.239 0 0);
  --oc-surface-accent-soft: rgb(245 101 74 / 0.14);
  --oc-surface-secondary-soft: rgb(79 200 174 / 0.14);
  --oc-chart-line: oklch(1 0 0 / 0.1);
  --oc-focus-ring: oklch(0.935 0 0 / 0.72);
  --oc-selection-bg: rgb(245 101 74 / 0.28);
  --oc-status-success-bg: rgb(34 197 94 / 0.12);
  --oc-status-success-fg: #22c55e;
  --oc-status-warning-bg: rgb(251 191 36 / 0.12);
  --oc-status-warning-fg: #fbbf24;
  --oc-status-info-bg: rgb(59 130 246 / 0.14);
  --oc-status-info-fg: #60a5fa;
  --oc-space-1: 0.25rem;
  --oc-space-2: 0.5rem;
  --oc-space-3: 0.75rem;
  --oc-space-4: 1rem;
  --oc-space-5: 1.5rem;
  --oc-space-6: 2rem;
  --oc-space-7: 3rem;
  --oc-space-8: 4rem;
  --oc-font-size-xs: 0.75rem;
  --oc-font-size-sm: 0.8125rem;
  --oc-font-size-base: 0.875rem;
  --oc-font-size-md: 0.9375rem;
  --oc-font-size-lg: 1.0625rem;
  --oc-font-size-xl: 1.25rem;
  --oc-font-size-2xl: 1.5rem;
  --oc-font-size-3xl: 2rem;
  --oc-radius-surface: 0.5rem;
  --oc-radius-control: 0.5rem;
  --oc-radius-inset: 0.25rem;
  --oc-radius-round: 999px;
  --oc-radius-full: 999px;
  --oc-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.12);
  --oc-shadow-md: 0 8px 24px -6px rgb(0 0 0 / 0.28);
  --oc-shadow-lg: 0 24px 48px -12px rgb(0 0 0 / 0.42);
  --oc-duration-fast: 160ms;
  --oc-duration-ui: 200ms;
  --oc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --oc-control-min-height: 2.75rem;
  --oc-input-bg: var(--oc-bg-elevated);
  --oc-input-border: var(--oc-border-subtle);
  --oc-font-embed-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  --oc-font-embed-mono: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --oc-font-body: var(--oc-font-embed-sans);
  --oc-font-display: var(--oc-font-embed-sans);
  --oc-font-mono: var(--oc-font-embed-mono);
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {${LIGHT_THEME}}
}
html[data-theme="light"] {${LIGHT_THEME}}



.oc-app-surface { --oc-component-surface: var(--oc-surface-card); --oc-component-surface-strong: var(--oc-surface-card-strong); --oc-component-surface-hover: var(--oc-surface-interactive); --oc-component-border: var(--oc-border-subtle); --oc-component-border-hover: color-mix( in srgb, var(--oc-text-primary) 28%, var(--oc-border-subtle) ); --oc-component-shadow: var(--oc-shadow-sm); --oc-component-shadow-hover: var(--oc-shadow-md); min-width: 0; min-height: 100%; background: var(--oc-bg-page); color: var(--oc-text-primary); font-family: var(--oc-font-body); }
.oc-section { width: 100%; color: var(--oc-text-primary); }
.oc-section-header { display: flex; align-items: end; justify-content: space-between; gap: var(--oc-space-5); }
.oc-section-header > * { min-width: 0; }
.oc-eyebrow { margin: 0; color: var(--oc-accent-primary); font-family: var(--oc-font-mono); font-size: var(--oc-font-size-xs); font-weight: 700; line-height: 1.4; letter-spacing: 0; text-transform: uppercase; }
.oc-card { border: 1px solid var(--oc-component-border); border-radius: var(--oc-radius-surface); background: var(--oc-component-surface); color: var(--oc-text-primary); box-shadow: var(--oc-component-shadow); }
.oc-card-interactive { transition: background var(--oc-duration-ui) var(--oc-ease-out), border-color var(--oc-duration-ui) var(--oc-ease-out), box-shadow var(--oc-duration-ui) var(--oc-ease-out), transform var(--oc-duration-ui) var(--oc-ease-out); }
.oc-card-interactive:hover, .oc-card-interactive:focus-visible { border-color: var(--oc-component-border-hover); background: var(--oc-component-surface-hover); box-shadow: var(--oc-component-shadow-hover); transform: translateY(-1px); }
.oc-card-interactive:focus-visible { outline: 2px solid var(--oc-focus-ring); outline-offset: 3px; }
.oc-card-interactive:active { transform: translateY(0) scale(0.995); }
.oc-action { display: inline-flex; min-height: 2.5rem; align-items: center; justify-content: center; gap: var(--oc-space-2); padding: var(--oc-space-2) var(--oc-space-4); border: 1px solid transparent; border-radius: var(--oc-radius-control); font: inherit; font-size: var(--oc-font-size-base); font-weight: 700; line-height: 1.2; text-decoration: none; touch-action: manipulation; cursor: pointer; transition: background var(--oc-duration-fast) var(--oc-ease-out), border-color var(--oc-duration-fast) var(--oc-ease-out), color var(--oc-duration-fast) var(--oc-ease-out), transform var(--oc-duration-fast) var(--oc-ease-out); }
.oc-action:hover { text-decoration: none; }
.oc-action:focus-visible { outline: 2px solid var(--oc-focus-ring); outline-offset: 3px; }
.oc-action:active:not(:disabled):not([aria-disabled="true"]) { transform: scale(0.98); }
.oc-action:disabled, .oc-action[aria-disabled="true"] { cursor: not-allowed; opacity: 0.5; }
.oc-action[aria-disabled="true"] { pointer-events: none; }
.oc-action-ghost { border-color: transparent; background: transparent; color: var(--oc-text-secondary); }
.oc-action-ghost:hover { background: var(--oc-surface-interactive); color: var(--oc-text-primary); }
.oc-action-icon { width: 2.5rem; padding: 0; }
.oc-segmented { display: inline-flex; max-width: 100%; align-items: center; gap: var(--oc-space-1); overflow-x: auto; padding: var(--oc-space-1); border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-control); background: var(--oc-surface-card); }
.oc-segmented-item { display: inline-flex; min-height: 2rem; align-items: center; justify-content: center; gap: var(--oc-space-2); padding: var(--oc-space-1) var(--oc-space-3); border: 0; border-radius: var(--oc-radius-inset); background: transparent; color: var(--oc-text-secondary); font: inherit; font-size: var(--oc-font-size-base); font-weight: 650; line-height: 1; white-space: nowrap; touch-action: manipulation; cursor: pointer; transition: background var(--oc-duration-fast) var(--oc-ease-out), color var(--oc-duration-fast) var(--oc-ease-out), transform var(--oc-duration-fast) var(--oc-ease-out); }
.oc-segmented-item:active:not(:disabled) { transform: scale(0.98); }
.oc-segmented-item:disabled { cursor: not-allowed; opacity: 0.5; }
.oc-segmented-item:hover { color: var(--oc-text-primary); }
.oc-segmented-item[aria-selected="true"], .oc-segmented-item[aria-pressed="true"], .oc-segmented-item.is-active { background: var(--oc-surface-interactive-hover); color: var(--oc-text-primary); }
.oc-segmented-item:focus-visible { outline: 2px solid var(--oc-focus-ring); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
.oc-card-interactive { transition: none; }
.oc-card-interactive:hover, .oc-card-interactive:focus-visible, .oc-card-interactive:active { transform: none; }
}
@media (max-width: 42rem) {
.oc-section-header { align-items: start; flex-direction: column; }
}
.oc-badge { display: inline-flex; box-sizing: border-box; max-width: 100%; min-width: 0; min-height: 1.5rem; align-items: center; gap: var(--oc-space-2); padding: var(--oc-space-1) var(--oc-space-2); border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-round); background: var(--oc-surface-secondary-soft); color: var(--oc-text-secondary); font-size: var(--oc-font-size-xs); font-weight: 650; font-variant-numeric: tabular-nums; line-height: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-badge::before { width: 0.375rem; height: 0.375rem; flex: 0 0 auto; border-radius: var(--oc-radius-round); background: currentColor; content: ""; }
.oc-badge-neutral::before { display: none; }
.oc-badge-success { border-color: var(--oc-status-success-fg); background: var(--oc-status-success-bg); color: var(--oc-status-success-fg); }
.oc-badge-warning { border-color: var(--oc-status-warning-fg); background: var(--oc-status-warning-bg); color: var(--oc-status-warning-fg); }
.oc-badge-info { border-color: var(--oc-status-info-fg); background: var(--oc-status-info-bg); color: var(--oc-status-info-fg); }
.oc-banner { display: grid; box-sizing: border-box; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: var(--oc-space-3); padding: var(--oc-space-4); border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-surface-card-strong); color: var(--oc-text-secondary); font-size: var(--oc-font-size-sm); line-height: 1.45; }
.oc-banner-indicator { width: 0.375rem; height: 0.375rem; margin-top: 0.45em; border-radius: var(--oc-radius-round); background: var(--oc-text-muted); }
.oc-banner-content { display: grid; min-width: 0; gap: var(--oc-space-1); }
.oc-banner-title { color: var(--oc-text-primary); font-weight: 650; }
.oc-banner p { margin: 0; overflow-wrap: anywhere; }
.oc-banner-warning .oc-banner-indicator { background: var(--oc-status-warning-fg); }
.oc-banner-info .oc-banner-indicator { background: var(--oc-status-info-fg); }
.oc-empty { display: grid; box-sizing: border-box; min-height: 12rem; place-items: center; padding: var(--oc-space-5); text-align: center; }
.oc-empty-description { max-width: 42ch; margin: 0; color: var(--oc-text-secondary); font-size: var(--oc-font-size-sm); line-height: 1.5; overflow-wrap: anywhere; text-wrap: pretty; }
@media (max-width: 42rem) {
.oc-banner, .oc-banner:has(.oc-banner-action):has(.oc-banner-dismiss) { grid-template-columns: auto minmax(0, 1fr) auto; }
.oc-banner > :is(button, a):not(.oc-banner-dismiss) { grid-column: 2 / -1; grid-row: 2; justify-self: start; margin-left: 0; }
}
.oc-sparkline { display: block; width: 100%; max-width: 8.5rem; height: 1.5rem; }
.oc-sparkline-line { fill: none; stroke: var(--oc-text-muted); stroke-width: 1.5; stroke-linecap: butt; stroke-linejoin: miter; vector-effect: non-scaling-stroke; }
.oc-sparkline[data-tone="accent"] .oc-sparkline-line { stroke: var(--oc-accent-primary); }
.oc-sparkline-endpoint { fill: var(--oc-accent-primary); stroke: none; }
.oc-delta { display: inline-flex; align-items: center; gap: 0.25rem; color: var(--oc-text-muted); font-size: var(--oc-font-size-xs); font-variant-numeric: tabular-nums; white-space: nowrap; }
.oc-delta-arrow { font-size: 0.625rem; line-height: 1; }
.oc-delta[data-tone="positive"] { color: var(--oc-status-success-fg); }
.oc-delta[data-tone="negative"] { color: var(--oc-status-error-fg); }
.oc-delta:not([data-tone])[data-direction="up"] .oc-delta-arrow { color: var(--oc-status-success-fg); }
.oc-delta:not([data-tone])[data-direction="down"] .oc-delta-arrow { color: var(--oc-status-error-fg); }
.oc-sparkline[data-size="lg"] { max-width: none; height: 3rem; }
.oc-split { display: block; overflow: hidden; width: 100%; height: 0.5rem; border-radius: 2px; }
.oc-split-segment { fill: var(--oc-chart-color, var(--oc-accent-primary)); }
.oc-split-secondary { --oc-chart-color: var(--oc-accent-secondary); }
.oc-split-error { --oc-chart-color: var(--oc-status-error-fg); }
.oc-split-muted { --oc-chart-color: var(--oc-border-strong); }
.oc-split-legend { display: flex; flex-wrap: wrap; gap: var(--oc-space-1) var(--oc-space-3); margin: 0; padding: 0; color: var(--oc-text-muted); font-size: var(--oc-font-size-xs); list-style: none; }
.oc-split-legend li { display: inline-flex; align-items: center; gap: var(--oc-space-1); }
.oc-split-key { width: 0.5rem; height: 0.5rem; border-radius: 2px; background: var(--oc-chart-color, var(--oc-accent-primary)); }
.oc-switch { position: relative; box-sizing: border-box; width: 2.25rem; height: 1.25rem; flex: 0 0 auto; appearance: none; border: 1px solid var(--oc-input-border); border-radius: var(--oc-radius-round); margin: 0; background: var(--oc-input-bg); cursor: inherit; touch-action: manipulation; transition: background var(--oc-duration-fast) var(--oc-ease-out), border-color var(--oc-duration-fast) var(--oc-ease-out); }
.oc-switch::before { position: absolute; top: 0.1875rem; left: 0.1875rem; width: 0.75rem; height: 0.75rem; border-radius: var(--oc-radius-round); background: var(--oc-text-muted); content: ""; transition: background var(--oc-duration-fast) var(--oc-ease-out), transform var(--oc-duration-fast) var(--oc-ease-out); }
.oc-switch:hover:not(:disabled) { border-color: var(--oc-border-strong); }
.oc-switch:checked { border-color: var(--oc-accent-primary); background: var(--oc-accent-primary); }
.oc-switch:checked::before { background: var(--oc-text-on-accent); transform: translateX(1rem); }
.oc-switch:focus-visible { outline: 2px solid var(--oc-focus-ring); outline-offset: 2px; }
@media (forced-colors: active) {
.oc-switch { appearance: auto; forced-color-adjust: auto; }
.oc-switch::before { display: none; }
}
.oc-summary-strip { display: grid; gap: 1px; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-border-subtle); grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); overflow: hidden; }
.oc-summary-metric { display: flex; align-items: center; gap: var(--oc-space-2); padding: var(--oc-space-2) var(--oc-space-3); background: var(--oc-bg-surface); }
.oc-summary-metric-copy { display: grid; min-width: 0; line-height: 1.3; }
.oc-summary-metric-copy strong { font-size: var(--oc-font-size-md); font-variant-numeric: tabular-nums; }
.oc-summary-metric-copy small { overflow: hidden; color: var(--oc-text-muted); font-size: var(--oc-font-size-xs); text-overflow: ellipsis; white-space: nowrap; }
.oc-brand-banner { position: relative; display: grid; min-height: 16rem; align-content: end; overflow: hidden; padding: var(--oc-space-6); border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-bg-surface); }
.oc-brand-banner-art { position: absolute; z-index: 0; inset: 0; overflow: hidden; pointer-events: none; }
.oc-brand-banner-art img { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; object-fit: cover; opacity: 0.82; }
.oc-brand-banner[data-anchor="top"] .oc-brand-banner-art img { object-position: 50% 0%; }
.oc-brand-banner[data-effect="fade"][data-anchor="top"] .oc-brand-banner-art img { -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 36%, transparent 78%); mask-image: linear-gradient(to bottom, #000 0%, #000 36%, transparent 78%); }
.oc-brand-banner-content { position: relative; z-index: 1; display: grid; max-width: 36rem; gap: var(--oc-space-2); }
.oc-brand-banner-content h3 { margin: 0; font-size: var(--oc-font-size-2xl); }
.oc-brand-banner-content p { margin: 0; color: var(--oc-text-secondary); }

* { box-sizing: border-box; }
body { margin: 0; color: var(--oc-text-secondary); background: var(--oc-bg-page); -webkit-font-smoothing: antialiased; }
main { width: 100%; margin: 0; padding: 0; }
a { color: inherit; text-decoration: none; }
a:hover { color: var(--oc-text-primary); text-decoration: underline; text-underline-offset: 3px; }

:root { --activity-0-bg: var(--oc-bg-elevated); --activity-0-border: var(--oc-border-subtle); --activity-1-bg: color-mix(in srgb, var(--oc-accent-primary) 16%, var(--oc-bg-elevated)); --activity-1-border: color-mix(in srgb, var(--oc-accent-primary) 30%, var(--oc-border-subtle)); --activity-2-bg: color-mix(in srgb, var(--oc-accent-primary) 34%, var(--oc-bg-elevated)); --activity-2-border: color-mix(in srgb, var(--oc-accent-primary) 50%, var(--oc-border-subtle)); --activity-3-bg: color-mix(in srgb, var(--oc-accent-primary) 68%, var(--oc-bg-elevated)); --activity-3-border: var(--oc-accent-primary-hover); --activity-4-bg: var(--oc-accent-primary); --activity-4-border: var(--oc-accent-primary-deep); --activity-3-text: var(--oc-text-primary); --activity-4-text: var(--oc-text-on-accent); font-family: var(--oc-font-body); }
.open-period-status { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; color: var(--oc-text-muted); font-family: var(--oc-font-mono); font-size: 0.75rem; line-height: 1.4; }
.open-period-status time { color: inherit; }
.open-period-status [data-day-countdown] { color: var(--oc-text-secondary); }
.partial-report-badge { min-height: 1.25rem; padding: 0.2rem 0.4rem; font-family: var(--oc-font-body); font-size: 0.6875rem; }

.site-nav { position: sticky; top: 0; z-index: 20; border-bottom: 1px solid var(--oc-border-subtle); background: var(--oc-bg-page); }
.site-nav[data-scrolled="true"] { box-shadow: var(--oc-shadow-md, 0 6px 16px rgb(0 0 0 / 0.28)); }
.site-nav-inner { width: 100%; min-height: 58px; margin: 0; padding: 0 var(--oc-space-4); display: flex; align-items: center; justify-content: space-between; gap: var(--oc-space-5); }
.site-brand { display: inline-flex; align-items: center; gap: var(--oc-space-3); color: var(--oc-text-primary); font: 750 15px/1 var(--oc-font-display); }
.site-brand:hover { text-decoration: none; color: var(--oc-text-primary); }
.brand-mark { display: grid; place-items: center; width: 26px; height: 26px; flex: 0 0 26px; }
.brand-mark img { display: block; width: 100%; height: 100%; object-fit: contain; }
.site-links { display: flex; align-items: center; justify-content: flex-end; gap: var(--oc-space-1); overflow-x: auto; white-space: nowrap; }
.site-links a { min-height: 32px; padding: var(--oc-space-2) var(--oc-space-3); color: var(--oc-text-muted); font: 650 13px/1 var(--oc-font-body); }
.site-links a:hover { color: var(--oc-text-primary); text-decoration: none; }
.site-links a.is-active { color: var(--oc-text-primary); background: var(--oc-surface-interactive-hover); }
.theme-toggle { flex: 0 0 auto; width: 34px; min-height: 34px; height: 34px; padding: 0; color: var(--oc-text-primary); cursor: pointer; }
.theme-toggle svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; display: block; }
@media (max-width: 760px) {
.site-nav-inner { height: auto; min-height: 58px; padding: var(--oc-space-3) var(--oc-space-4); align-items: flex-start; flex-direction: column; }
.site-links { width: 100%; justify-content: flex-start; flex-wrap: wrap; overflow-x: visible; padding-bottom: 2px; }
}


body { font: var(--oc-font-size-base)/1.5 var(--oc-font-body); }
::selection { background: var(--oc-selection-bg); }
:where(a, button, input, summary, [tabindex]):focus-visible { outline: 2px solid var(--oc-focus-ring); outline-offset: 3px; }
[hidden] { display: none !important; }
:root:not([data-js]) .js-only, :root:not([data-js]) [data-toggle], :root:not([data-js]) [data-theme-toggle] { display: none !important; }
:root:not([data-js]) [data-extra][hidden] { display: grid !important; }
:root[data-people-hide-inactive="true"] [data-inactive="true"] { display: none !important; }
.theme-toggle .theme-moon { display: none; }
:root[data-theme="light"] .theme-toggle .theme-sun { display: none; }
:root[data-theme="light"] .theme-toggle .theme-moon { display: block; }
h1, h2, h3, p { margin: 0; }
h3 { color: var(--oc-text-primary); font-size: var(--oc-font-size-lg); line-height: 1.4; }
a, li, p { overflow-wrap: anywhere; }
small, .muted { color: var(--oc-text-muted); }
.details { color: var(--oc-text-secondary); font-size: var(--oc-font-size-sm); }
.actions, .identity-line, .pills { display: flex; flex-wrap: wrap; align-items: center; gap: var(--oc-space-2); }
.person-identity { display: flex; align-items: center; gap: var(--oc-space-3); min-width: 0; }
.oc-banner-content { overflow-wrap: anywhere; }
.oc-banner-content > .oc-badge { justify-self: start; }
.oc-banner ul { margin: 0; padding-left: var(--oc-space-5); }
.oc-section { min-width: 0; }
.oc-section-header { margin-bottom: var(--oc-space-4); }
/* Pages are stacked full-width bands: seams separate them, the band inset replaces page gutters. */
main > .oc-section { padding: var(--oc-space-5) var(--oc-space-4); border-top: 1px solid var(--oc-border-subtle); }
main > .oc-section:first-child { border-top: 0; }
footer { width: 100%; margin: 0; padding: 14px var(--oc-space-4) var(--oc-space-5); color: var(--oc-text-muted); font-size: 12px; line-height: 1.5; border-top: 1px solid var(--oc-border-strong); }
.oc-action-icon svg { display: block; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
summary { width: fit-content; max-width: 100%; color: var(--oc-text-secondary); cursor: pointer; font-size: var(--oc-font-size-sm); }
details[open] > summary { margin-bottom: var(--oc-space-2); }
blockquote { border-left: 2px solid var(--oc-border-strong); padding: var(--oc-space-2) var(--oc-space-4); margin: var(--oc-space-2) 0; overflow-wrap: anywhere; }
.oc-table :is(th, td) { padding: var(--oc-space-3) var(--oc-space-4); border-bottom: 1px solid var(--oc-border-subtle); text-align: left; }
.oc-resource-list { width: 100%; margin: 0; padding: 0; overflow: hidden; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-surface-card); list-style: none; }
.oc-resource-list-item + .oc-resource-list-item { border-top: 1px solid var(--oc-border-subtle); }
.oc-resource-list-link, .resource-row { display: flex; align-items: center; justify-content: space-between; gap: var(--oc-space-3); padding: var(--oc-space-2) var(--oc-space-3); }
.oc-avatar { position: relative; display: inline-grid; flex: 0 0 auto; place-items: center; overflow: hidden; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-surface-secondary-soft); color: var(--oc-accent-secondary); font-weight: 650; line-height: 1; }
.oc-avatar::before { content: attr(data-initials); }
/* Transparent failed images leave the CSS initials beneath them visible. */
.oc-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; color: transparent; font-size: 0; }
.oc-avatar-xs { width: 20px; height: 20px; font-size: var(--oc-font-size-xs); }
.oc-avatar-md { width: 40px; height: 40px; font-size: var(--oc-font-size-sm); }
.oc-avatar-sm { width: 36px; height: 36px; font-size: var(--oc-font-size-sm); }
.oc-avatar-xl { width: 72px; height: 72px; font-size: var(--oc-font-size-2xl); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }


body[data-report-page="home"] main { width:100%; margin:0; padding:0; }
body[data-report-page="home"] header { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:var(--oc-space-6); align-items:end; border-bottom:1px solid var(--oc-border-subtle); padding-bottom:var(--oc-space-5); margin-bottom:var(--oc-space-4); }
body[data-report-page="home"] h1 { margin:0; color:var(--oc-text-primary); font:740 34px/1.05 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:0; }
body[data-report-page="home"] h2 { margin:4px 0 16px; color:var(--oc-text-primary); font:740 22px/1.2 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:0; }
body[data-report-page="home"] .subtitle, body[data-report-page="home"] .meta { color:var(--oc-text-muted); line-height:1.45; }
body[data-report-page="home"] .grid { display:grid; gap:0; }
body[data-report-page="home"] .grid > .oc-section { padding: var(--oc-space-5) var(--oc-space-4); border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="home"] .grid > .oc-section:first-child { border-top: 0; }
body[data-report-page="home"] .quick-card { display:grid; align-content:start; gap:var(--oc-space-1); min-height:104px; padding:var(--oc-space-4); }
body[data-report-page="home"] .quick-card.partial { border-color:var(--oc-border-accent); }
body[data-report-page="home"] .quick-card:hover { text-decoration:none; border-color:var(--oc-component-border-hover); background:var(--oc-surface-interactive); }
body[data-report-page="home"] .quick-title { display:block; margin-top:4px; font-size:20px; font-weight:800; line-height:1.15; }
body[data-report-page="home"] .quick-meta { display:block; margin-top:2px; text-wrap:balance; color:var(--oc-text-muted); font-size:13px; line-height:1.35; }
body[data-report-page="home"] .panel { padding:0; }
body[data-report-page="home"] .toggle { appearance:none; border-radius:var(--oc-radius-control); font-family:var(--oc-font-mono); cursor:pointer; }
body[data-report-page="home"] .toggle:hover { background:var(--oc-surface-accent-soft); }
body[data-report-page="home"] .row { display:grid; grid-template-columns:minmax(0,1fr) auto 15.5rem; gap:16px; align-items:center; padding:12px 0; border-top:1px solid var(--oc-border-subtle); }
body[data-report-page="home"] .row-trend { display:block; }
body[data-report-page="home"] .row-trend .oc-sparkline { width:6.5rem; }
body[data-report-page="home"] .row:first-child { border-top:0; }
body[data-report-page="home"] .row[hidden] { display:none; }
body[data-report-page="home"] .title { color:var(--oc-text-primary); font-size:17px; font-weight:800; }
body[data-report-page="home"] .date { color:var(--oc-text-muted); font-size:14px; line-height:1.35; }
body[data-report-page="home"] .row-title-line { display:inline-flex; flex-wrap:wrap; align-items:center; gap:var(--oc-space-2); }
body[data-report-page="home"] .stats { color:var(--oc-text-muted); font-size:13px; text-align:right; }
body[data-report-page="home"] .stats strong { color:var(--oc-text-primary); }
body[data-report-page="home"] .home-banner { margin: 0; }
body[data-report-page="home"] .home-banner .oc-brand-banner-content h1 { margin: 0; color: var(--oc-text-primary); font: 740 34px/1.05 var(--oc-font-display); }
body[data-report-page="home"] .home-banner .oc-brand-banner-content p:last-child { color: var(--oc-text-secondary); }
body[data-report-page="home"] .home-banner-stamp { position: absolute; top: var(--oc-space-4); right: var(--oc-space-4); z-index: 1; padding: var(--oc-space-1) var(--oc-space-3); border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-full, 999px); background: color-mix(in srgb, var(--oc-bg-page) 72%, transparent); backdrop-filter: blur(6px); color: var(--oc-text-muted); font-family: var(--oc-font-mono); font-size: 11px; line-height: 1.6; text-transform: lowercase; letter-spacing: 0.02em; }
body[data-report-page="home"] .home-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1px; margin: 0; overflow: hidden; border: 0; border-bottom: 1px solid var(--oc-border-subtle); border-radius: 0; background: var(--oc-border-subtle); }
body[data-report-page="home"] .home-grid > * { border: 0; border-radius: 0; background: var(--oc-bg-surface); }
body[data-report-page="home"] .home-grid > .home-banner { grid-column: 1 / -1; }
body[data-report-page="home"] .home-grid > .oc-banner { grid-column: 1 / -1; }
body[data-report-page="home"] .home-grid > .quick-card { grid-column: span 2; min-height: 0; }
body[data-report-page="home"] .home-grid > .home-card { grid-column: span 3; }
body[data-report-page="home"] .home-grid > .work-sessions-panel { grid-column: 1 / -1; }
body[data-report-page="home"] .home-grid .oc-summary-strip { background: transparent; }
body[data-report-page="home"] .home-grid .oc-summary-strip { grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr)); }
body[data-report-page="home"] .home-grid .oc-summary-strip { border: 0; border-radius: 0; margin-top: auto; }
body[data-report-page="home"] .home-grid .oc-summary-metric { padding-inline: 0; }
body[data-report-page="home"] .home-grid .oc-summary-metric-copy small:last-child { overflow: visible; white-space: normal; }
body[data-report-page="home"] .home-grid > .home-card { display: flex; flex-direction: column; gap: var(--oc-space-3); padding: var(--oc-space-4); }
body[data-report-page="home"] .panel-link { min-height: 2rem; padding: var(--oc-space-1) var(--oc-space-3); border-color: var(--oc-border-subtle); color: var(--oc-text-secondary); font-size: var(--oc-font-size-xs); font-weight: 600; }
body[data-report-page="home"] .panel-link:hover { border-color: var(--oc-border-strong); background: var(--oc-surface-interactive-hover); color: var(--oc-text-primary); text-decoration: none; }
body[data-report-page="home"] .panel-link span { transition: transform var(--oc-duration-fast, 140ms) var(--oc-ease-out, ease); }
body[data-report-page="home"] .panel-link:hover span { transform: translateX(2px); }
body[data-report-page="home"] .home-dateline { display: grid; grid-column: 1 / -1; gap: var(--oc-space-2); padding: var(--oc-space-4); }
body[data-report-page="home"] .home-dateline-scale { display: flex; justify-content: space-between; color: var(--oc-text-muted); font-family: var(--oc-font-mono); font-size: 11px; }
body[data-report-page="home"] .quick-trend { display: grid; gap: var(--oc-space-1); margin-top: var(--oc-space-2); }
body[data-report-page="home"] .quick-trend .oc-sparkline { max-width: none; }
body[data-report-page="home"] .home-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
body[data-report-page="home"] .home-card-top h2 { margin:4px 0 0; font-size:18px; }
body[data-report-page="home"] .home-card-top p { margin:4px 0 0; color:var(--oc-text-muted); font-size:13px; line-height:1.45; }
body[data-report-page="home"] .home-actions-row { flex:0 0 auto; display:flex; justify-content:flex-end; }
@media (max-width: 860px) {
body[data-report-page="home"] .home-grid { grid-template-columns: minmax(0, 1fr); }
body[data-report-page="home"] .home-grid > .quick-card, body[data-report-page="home"] .home-grid > .home-card { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
body[data-report-page="home"] h1 { font-size:30px; }
body[data-report-page="home"] header { grid-template-columns:1fr; }
body[data-report-page="home"] .quick { grid-template-columns:1fr; }
body[data-report-page="home"] .home-banner-stamp { position: static; margin-bottom: var(--oc-space-3); width: fit-content; }
body[data-report-page="home"] .home-banner .oc-brand-banner-content h1 { font-size: 28px; }
body[data-report-page="home"] .home-card-top { flex-direction:column; }
body[data-report-page="home"] .home-actions-row { justify-content:flex-start; }
body[data-report-page="home"] .row { grid-template-columns:1fr; gap:6px; }
body[data-report-page="home"] .row-trend { display:none; }
body[data-report-page="home"] .stats { text-align:left; }
}

body[data-report-page="report"] .oc-summary-strip .oc-summary-metric { align-items: flex-start; }
body[data-report-page="report"] .oc-summary-strip .oc-summary-metric-copy small { overflow: visible; white-space: normal; }
body[data-report-page="report"] .mix-split { display: grid; gap: var(--oc-space-2); margin-top: var(--oc-space-3); }
body[data-report-page="report"] .maintainer-distribution { display:grid; gap:var(--oc-space-3); margin-top:var(--oc-space-5); padding-top:var(--oc-space-5); border-top:1px solid var(--oc-border-subtle); }
body[data-report-page="report"] .distribution-heading { display:flex; align-items:end; justify-content:space-between; gap:var(--oc-space-4); }
body[data-report-page="report"] .distribution-heading h3 { margin:var(--oc-space-1) 0 0; color:var(--oc-text-primary); font:740 18px/1.2 var(--oc-font-display); }
body[data-report-page="report"] .ranked-distribution-list { display:grid; gap:var(--oc-space-1); margin:0; padding:0; list-style:none; counter-reset:distribution-rank; }
body[data-report-page="report"] .distribution-more .ranked-distribution-list { margin-top:var(--oc-space-2); }
body[data-report-page="report"] .ranked-distribution-list li { counter-increment:distribution-rank; }
body[data-report-page="report"] .ranked-distribution-list li > a, body[data-report-page="report"] .ranked-distribution-list li > span { display:grid; grid-template-columns:minmax(8rem, 14rem) minmax(5rem, 1fr) 5rem 3rem; align-items:center; gap:var(--oc-space-3); min-height:2rem; color:var(--oc-text-secondary); }
body[data-report-page="report"] .ranked-distribution-list li > a:hover { color:var(--oc-text-primary); text-decoration:none; }
body[data-report-page="report"] .distribution-label { display:grid; min-width:0; overflow:hidden; align-content:center; gap:1px; }
body[data-report-page="report"] .distribution-label-primary, body[data-report-page="report"] .distribution-label-detail { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
body[data-report-page="report"] .distribution-label-primary { color:var(--oc-text-primary); font-weight:650; }
body[data-report-page="report"] .distribution-label-detail { color:var(--oc-text-muted); font-size:var(--oc-font-size-xs); font-weight:500; line-height:1.2; }
body[data-report-page="report"] .distribution-track { height:0.55rem; overflow:hidden; border-radius:var(--oc-radius-round); background:var(--oc-surface-secondary-soft); }
body[data-report-page="report"] .distribution-segment { display:block; min-width:1px; height:100%; background:var(--oc-chart-color,var(--oc-accent-primary)); }
body[data-report-page="report"] .oc-split-tertiary { --oc-chart-color:color-mix(in srgb,var(--oc-accent-primary) 48%,var(--oc-accent-secondary)); }
body[data-report-page="report"] .oc-split-quaternary { --oc-chart-color:var(--oc-accent-secondary-deep); }
body[data-report-page="report"] .oc-split-neutral { --oc-chart-color:color-mix(in srgb,var(--oc-border-strong) 58%,var(--oc-text-muted)); }
body[data-report-page="report"] .distribution-total { color:var(--oc-text-primary); font-variant-numeric:tabular-nums; text-align:right; }
body[data-report-page="report"] .distribution-share { color:var(--oc-text-muted); font-family:var(--oc-font-mono); font-size:var(--oc-font-size-xs); text-align:right; }
body[data-report-page="report"] .distribution-breakdown { grid-column:2 / -1; display:flex; flex-wrap:wrap; gap:var(--oc-space-1) var(--oc-space-3); color:var(--oc-text-muted); font-size:var(--oc-font-size-xs); line-height:1.25; }
body[data-report-page="report"] .distribution-breakdown-item { display:inline-flex; align-items:center; gap:var(--oc-space-1); white-space:nowrap; }
body[data-report-page="report"] .distribution-breakdown-key { width:0.45rem; height:0.45rem; flex:0 0 auto; border-radius:2px; background:var(--oc-chart-color,var(--oc-accent-primary)); }
body[data-report-page="report"] .distribution-more { border-top:1px solid var(--oc-border-subtle); padding-top:var(--oc-space-2); }
body[data-report-page="report"] .distribution-more summary { width:fit-content; color:var(--oc-text-secondary); font-size:var(--oc-font-size-sm); cursor:pointer; }
body[data-report-page="report"] { margin: 0; background: var(--oc-bg-page); color: var(--oc-text-secondary); -webkit-font-smoothing: antialiased; }
body[data-report-page="report"] .shell { width: 100%; margin: 0; padding: 0; }
body[data-report-page="report"] header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--oc-space-6); align-items: end; padding: var(--oc-space-5) var(--oc-space-4); border-bottom: 1px solid var(--oc-border-subtle); }
body[data-report-page="report"] h1 { margin: 0; color: var(--oc-text-primary); font: 740 34px/1.05 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: 0; }
body[data-report-page="report"] .subtitle { margin: 12px 0 0; color: var(--oc-text-muted); font-size: 14px; line-height: 1.5; max-width: 760px; }
body[data-report-page="report"] .stamp .label, body[data-report-page="report"] .metric .label, body[data-report-page="report"] .section-kicker, body[data-report-page="report"] .person-meta, body[data-report-page="report"] .small { color: var(--oc-text-muted); font-family: var(--oc-font-mono); font-size: 12px; line-height: 1.35; text-transform: uppercase; }
body[data-report-page="report"] .panel { margin: var(--oc-space-7) 0; padding: 0; }
body[data-report-page="report"] .collection-section { padding: 0; border: 0; background: transparent; box-shadow: none; }
body[data-report-page="report"] .people-head { align-items: start; }
body[data-report-page="report"] .people-tools { width: min(390px, 100%); display: grid; gap: 8px; }
body[data-report-page="report"] .person-filter { width: 100%; min-height: 42px; padding: 9px 12px; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-control); background: var(--oc-surface-card-strong); color: var(--oc-text-primary); font: 740 14px/1.2 var(--oc-font-mono); outline: none; box-shadow: inset 0 0 0 1px rgba(24, 23, 20, 0); }
body[data-report-page="report"] .person-filter:focus { box-shadow: inset 0 0 0 1px var(--oc-accent-primary), 0 0 0 3px color-mix(in srgb, var(--oc-accent-primary) 18%, transparent); }
body[data-report-page="report"] .filter-status { min-height: 17px; color: var(--oc-text-muted); font-size: 12px; line-height: 1.35; text-transform: uppercase; }
body[data-report-page="report"] h2 { margin: 0; color: var(--oc-text-primary); font: 740 20px/1.2 var(--oc-font-display); letter-spacing: 0; }
body[data-report-page="report"] .shell > .oc-section { margin: 0; padding: var(--oc-space-5) var(--oc-space-4); border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="report"] .oc-section-header { margin-bottom: var(--oc-space-4); }
body[data-report-page="report"] .section-note { max-width: 46ch; margin: 0; color: var(--oc-text-muted); font-size: var(--oc-font-size-xs); line-height: 1.45; text-align: right; }
body[data-report-page="report"] .summary-markdown { color: var(--oc-text-primary); font-size: 15px; line-height: 1.48; }
body[data-report-page="report"] .summary-markdown p { margin: 0 0 12px; }
body[data-report-page="report"] .summary-markdown p:last-child { margin-bottom: 0; }
body[data-report-page="report"] .summary-markdown ul { display: grid; gap: 8px; margin: 14px 0 0; padding: 0; list-style: none; }
body[data-report-page="report"] .summary-markdown li { position: relative; padding-left: 18px; }
body[data-report-page="report"] .summary-markdown li::before { content: ""; position: absolute; left: 0; top: 0.72em; width: 7px; height: 7px; border-radius: 999px; background: var(--oc-status-error-fg); }
body[data-report-page="report"] .summary-markdown strong { font-weight: 800; }
body[data-report-page="report"] .summary-markdown code { padding: 1px 5px; border: 1px solid var(--oc-border-subtle); border-radius: 5px; background: color-mix(in srgb, var(--oc-surface-card) 84%, transparent); font: 0.92em ui-monospace, SFMono-Regular, Menlo, monospace; }
body[data-report-page="report"] .summary-markdown a { color: inherit; text-decoration-color: var(--oc-border-strong); text-underline-offset: 3px; }
body[data-report-page="report"] .people { display: grid; gap: 12px; }
body[data-report-page="report"] .person { display: grid; grid-template-columns: 198px minmax(0, 1fr) 150px; gap: 16px; padding: 14px; }
body[data-report-page="report"] .person:hover { border-color: color-mix(in srgb, var(--oc-accent-primary) 42%, var(--oc-border-strong)); background: color-mix(in srgb, var(--oc-surface-card) 82%, var(--oc-accent-primary) 8%); }
body[data-report-page="report"] .person[hidden] { display: none; }
body[data-report-page="report"] .quiet-maintainers { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="report"] .quiet-title { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 14px; margin-bottom: 10px; }
body[data-report-page="report"] .quiet-title h3 { margin: 0; font-size: 15px; line-height: 1.25; letter-spacing: 0; }
body[data-report-page="report"] .quiet-list { display: flex; flex-wrap: wrap; gap: 7px; margin: 0; padding: 0; list-style: none; }
body[data-report-page="report"] .quiet-list > li { max-width: 100%; padding: 4px 8px; border: 1px solid var(--oc-border-strong); border-radius: 999px; background: color-mix(in srgb, var(--oc-surface-accent-soft) 72%, transparent); color: var(--oc-text-muted); font-size: 12px; line-height: 1.25; overflow-wrap: anywhere; }
body[data-report-page="report"] .person-title { min-width: 0; }
body[data-report-page="report"] .person-heading { display: flex; align-items: center; gap: 10px; min-width: 0; }
body[data-report-page="report"] .person-heading > div { min-width: 0; }
body[data-report-page="report"] .handle { color: var(--oc-text-primary); font: 800 17px/1.15 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; overflow-wrap: anywhere; }
body[data-report-page="report"] .person-name { margin-top: 3px; color: var(--oc-text-muted); font-size: 13px; line-height: 1.35; overflow-wrap: anywhere; }
body[data-report-page="report"] .affiliation { margin-top: 7px; display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 4px 8px; border: 1px solid var(--oc-border-strong); border-radius: 999px; background: color-mix(in srgb, var(--oc-status-success-fg) 14%, var(--oc-surface-card-strong)); color: var(--oc-status-success-fg); font-size: 12px; font-weight: 700; line-height: 1.2; overflow-wrap: anywhere; }
body[data-report-page="report"] .affiliation.is-na { border-color: var(--oc-border-strong); background: color-mix(in srgb, var(--oc-bg-elevated) 82%, var(--oc-surface-card-strong)); color: var(--oc-text-muted); }
body[data-report-page="report"] .affiliation.is-readonly { border-color: color-mix(in srgb, var(--oc-status-info-fg) 46%, var(--oc-border-strong)); background: color-mix(in srgb, var(--oc-status-info-fg) 13%, var(--oc-surface-card-strong)); color: color-mix(in srgb, var(--oc-status-info-fg) 76%, var(--oc-text-primary)); }
body[data-report-page="report"] .affiliation.is-independent { border-color: color-mix(in srgb, var(--oc-status-warning-fg) 46%, var(--oc-border-strong)); background: color-mix(in srgb, var(--oc-status-warning-fg) 16%, var(--oc-surface-card-strong)); color: color-mix(in srgb, var(--oc-status-warning-fg) 88%, var(--oc-text-primary)); }
body[data-report-page="report"] .role-line { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.person-work-sessions { margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--oc-border-strong); min-width: 0; }
body[data-report-page="person"] main > .person-work-sessions { margin: 0; padding: var(--oc-space-5) var(--oc-space-4); }
.person-work-sessions h3 { margin: 0 0 6px; }
body[data-report-page="report"] .quiet-list > li:has(.person-work-sessions) { border-radius: 12px; padding: 16px; flex: 1 1 300px; }
body[data-report-page="report"] .person-body { min-width: 0; display: grid; gap: 10px; }
body[data-report-page="report"] .chips { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 7px; }
body[data-report-page="report"] .theme { margin: 0; color: var(--oc-text-primary); font-size: 13px; line-height: 1.42; }
body[data-report-page="report"] .theme + .theme { color: var(--oc-text-muted); }
body[data-report-page="report"] .focus { margin: 0; color: var(--oc-text-primary); font-size: 14px; line-height: 1.48; }
body[data-report-page="report"] .person-numbers { display: grid; gap: 8px; align-content: start; }
body[data-report-page="report"] .number-line { display: flex; justify-content: space-between; gap: 8px; color: var(--oc-text-muted); font-size: 13px; border-bottom: 1px solid var(--oc-border-subtle); padding-bottom: 5px; }
body[data-report-page="report"] .number-line strong { color: var(--oc-text-primary); }
body[data-report-page="report"] footer { margin-top: 0; color: var(--oc-text-muted); font-size: 12px; line-height: 1.5; border-top: 1px solid var(--oc-border-strong); padding-top: 14px; }
@media (max-width: 980px) {
body[data-report-page="report"] header, body[data-report-page="report"] .mix { grid-template-columns: 1fr; }
body[data-report-page="report"] .person { grid-template-columns: 1fr; }
body[data-report-page="report"] .people-head { align-items: stretch; }
}
@media (max-width: 640px) {
body[data-report-page="report"] h1 { font-size: 28px; }
body[data-report-page="report"] .distribution-heading { align-items:start; flex-direction:column; }
body[data-report-page="report"] .distribution-heading .section-note { text-align:left; }
body[data-report-page="report"] .ranked-distribution-list li > a, body[data-report-page="report"] .ranked-distribution-list li > span { grid-template-columns:minmax(7rem,1fr) 5rem 2.5rem; gap:var(--oc-space-2); }
body[data-report-page="report"] .distribution-track { grid-column:1 / -1; grid-row:2; }
body[data-report-page="report"] .distribution-breakdown { grid-column:1 / -1; grid-row:3; }
}

body[data-report-page="people"] .people-header, body[data-report-page="person"] .people-header, body[data-report-page="sessions"] .people-header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--oc-space-6); align-items: end; padding: var(--oc-space-5) var(--oc-space-4); margin: 0; border-bottom: 1px solid var(--oc-border-subtle); }
body[data-report-page="people"] h1, body[data-report-page="person"] h1 { margin: 0; color: var(--oc-text-primary); font: 740 34px/1.05 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body[data-report-page="people"] h2, body[data-report-page="person"] h2 { margin: 4px 0 0; color: var(--oc-text-primary); font: 740 22px/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
body[data-report-page="people"] p, body[data-report-page="person"] p { margin: 10px 0 0; color: var(--oc-text-muted); }
body[data-report-page="people"] .people-grid, body[data-report-page="person"] .people-grid { display: grid; padding: var(--oc-space-4); grid-template-columns: repeat(auto-fit, minmax(min(330px, 100%), 1fr)); gap: 12px; }
body[data-report-page="people"] .people-break, body[data-report-page="person"] .people-break { grid-column: 1 / -1; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 6px 0 -2px; padding: 12px 2px 2px; border-top: 1px solid var(--oc-border-subtle); color: var(--oc-text-muted); font-size: 12px; line-height: 1.35; text-transform: uppercase; }
body[data-report-page="people"] .people-break span:first-child, body[data-report-page="person"] .people-break span:first-child { color: var(--oc-text-primary); font: 800 13px/1.2 ui-sans-serif, system-ui, sans-serif; text-transform: none; }
body[data-report-page="people"] .person-card, body[data-report-page="person"] .person-card { display: grid; gap: 10px; padding: 14px; }
body[data-report-page="people"] .person-card:hover, body[data-report-page="person"] .person-card:hover { border-color: var(--oc-accent-primary); background: color-mix(in srgb, var(--oc-surface-card) 82%, var(--oc-accent-primary) 8%); }
body[data-report-page="people"] .person-card.is-inactive, body[data-report-page="person"] .person-card.is-inactive { background: color-mix(in srgb, var(--oc-surface-card) 78%, var(--oc-bg-elevated)); }
body[data-report-page="people"] .person-card-head, body[data-report-page="person"] .person-card-head, body[data-report-page="people"] .person-hero, body[data-report-page="person"] .person-hero { display: flex; align-items: center; gap: 10px; min-width: 0; }
body[data-report-page="people"] .person-card-head > span, body[data-report-page="person"] .person-card-head > span, body[data-report-page="people"] .person-hero > div, body[data-report-page="person"] .person-hero > div { min-width: 0; }
body[data-report-page="people"] .person-card-identity, body[data-report-page="person"] .person-card-identity { display: grid; gap: 2px; min-width: 0; }
body[data-report-page="people"] .person-card strong, body[data-report-page="person"] .person-card strong { display: block; color: var(--oc-text-primary); font: 760 17px/1.2 ui-sans-serif, system-ui, sans-serif; overflow-wrap: anywhere; }
body[data-report-page="people"] .person-handle, body[data-report-page="person"] .person-handle, body[data-report-page="people"] .person-card-meta, body[data-report-page="person"] .person-card-meta { color: var(--oc-text-muted); font-size: 12px; line-height: 1.35; overflow-wrap: anywhere; }
body[data-report-page="people"] .person-company, body[data-report-page="person"] .person-company, body[data-report-page="people"] .person-company-line, body[data-report-page="person"] .person-company-line { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; min-width: 0; color: var(--oc-text-secondary); font-size: 13px; line-height: 1.35; }
body[data-report-page="people"] .person-company span, body[data-report-page="person"] .person-company span, body[data-report-page="people"] .person-company-line span, body[data-report-page="person"] .person-company-line span { min-width: 0; overflow-wrap: anywhere; }
body[data-report-page="people"] .person-card-meta, body[data-report-page="person"] .person-card-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
body[data-report-page="people"] .mini-strip, body[data-report-page="person"] .mini-strip { display: grid; grid-template-columns: repeat(28, minmax(0, 1fr)); gap: 3px; align-items: center; }
body[data-report-page="people"] .legend, body[data-report-page="person"] .legend { display: flex; gap: 4px; align-items: center; }
body[data-report-page="people"] .day-dot, body[data-report-page="person"] .day-dot, body[data-report-page="people"] .legend span, body[data-report-page="person"] .legend span { min-width: 0; height: 10px; border: 1px solid var(--activity-0-border); border-radius: 3px; background: var(--activity-0-bg); }
body[data-report-page="people"] .legend span, body[data-report-page="person"] .legend span { width: 13px; height: 13px; }
body[data-report-page="people"] .archive-panel, body[data-report-page="person"] .archive-panel { padding: var(--oc-space-5) var(--oc-space-4); margin: 0; border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="people"] .month-row, body[data-report-page="person"] .month-row { display: grid; grid-template-columns: 128px minmax(0, 1fr); gap: 18px; align-items: start; padding: 14px 0; border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="people"] .month-row:first-child, body[data-report-page="person"] .month-row:first-child { border-top: 0; }
body[data-report-page="people"] .month-label, body[data-report-page="person"] .month-label { color: var(--oc-text-primary); font-weight: 760; padding-top: 26px; }
body[data-report-page="people"] .calendar, body[data-report-page="person"] .calendar { width: min(100%, 268px); --calendar-gap: 5px; }
body[data-report-page="people"] .weekday-row, body[data-report-page="person"] .weekday-row, body[data-report-page="people"] .day-grid, body[data-report-page="person"] .day-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: var(--calendar-gap); width: 100%; }
body[data-report-page="people"] .weekday-row, body[data-report-page="person"] .weekday-row { margin-bottom: 6px; color: var(--oc-text-muted); font-size: 10px; text-align: center; text-transform: uppercase; }
body[data-report-page="people"] .day-grid, body[data-report-page="person"] .day-grid { align-items: center; }
body[data-report-page="people"] .day-spacer, body[data-report-page="person"] .day-spacer, body[data-report-page="people"] .day-cell, body[data-report-page="person"] .day-cell { width: 100%; aspect-ratio: 1; min-width: 0; }
body[data-report-page="people"] .day-cell, body[data-report-page="person"] .day-cell { display: grid; place-items: center; min-height: 24px; border: 1px solid var(--activity-0-border); border-radius: 6px; color: var(--oc-text-muted); font-size: 11px; font-weight: 760; }
body[data-report-page="people"] .day-cell:hover, body[data-report-page="person"] .day-cell:hover { border-color: var(--oc-accent-primary); color: var(--oc-text-primary); outline: 2px solid color-mix(in srgb, var(--oc-accent-primary) 24%, transparent); outline-offset: 1px; }
body[data-report-page="people"] .level-0, body[data-report-page="person"] .level-0 { background: var(--activity-0-bg); border-color: var(--activity-0-border); }
body[data-report-page="people"] .level-1, body[data-report-page="person"] .level-1, body[data-report-page="person"] .legend .level-1 { background: var(--activity-1-bg); border-color: var(--activity-1-border); color: var(--oc-text-primary); }
body[data-report-page="people"] .level-2, body[data-report-page="person"] .level-2, body[data-report-page="person"] .legend .level-2 { background: var(--activity-2-bg); border-color: var(--activity-2-border); color: var(--oc-text-primary); }
body[data-report-page="people"] .level-3, body[data-report-page="person"] .level-3, body[data-report-page="person"] .legend .level-3 { background: var(--activity-3-bg); border-color: var(--activity-3-border); color: var(--activity-3-text); }
body[data-report-page="people"] .level-4, body[data-report-page="person"] .level-4, body[data-report-page="person"] .legend .level-4 { background: var(--activity-4-bg); border-color: var(--activity-4-border); color: var(--activity-4-text); }
body[data-report-page="people"] .activity-list, body[data-report-page="person"] .activity-list { display: grid; gap: 10px; }
body[data-report-page="people"] .activity-row, body[data-report-page="person"] .activity-row { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; padding: 14px; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-bg-elevated); }
body[data-report-page="people"] .activity-row:hover, body[data-report-page="person"] .activity-row:hover { border-color: var(--oc-accent-primary); }
body[data-report-page="people"] .activity-date, body[data-report-page="person"] .activity-date { color: var(--oc-text-primary); font-weight: 760; }
body[data-report-page="people"] .activity-row strong, body[data-report-page="person"] .activity-row strong, body[data-report-page="people"] .activity-row span span, body[data-report-page="person"] .activity-row span span { display: block; }
body[data-report-page="people"] .activity-row strong, body[data-report-page="person"] .activity-row strong { color: var(--oc-text-primary); }
body[data-report-page="people"] .activity-row span span, body[data-report-page="person"] .activity-row span span { color: var(--oc-text-muted); font-size: 13px; line-height: 1.45; }
body[data-report-page="people"] .activity-row p, body[data-report-page="person"] .activity-row p { margin-top: 6px; color: var(--oc-text-secondary); font-size: 13px; }
body[data-report-page="people"] .person-activity-panel, body[data-report-page="person"] .person-activity-panel { min-width: 0; }
body[data-report-page="people"] .person-activity-legend, body[data-report-page="person"] .person-activity-legend { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px 16px; margin: 4px 0 0; padding: 0; color: var(--oc-text-muted); font-size: 12px; line-height: 1.35; list-style: none; }
body[data-report-page="people"] .person-activity-legend li, body[data-report-page="person"] .person-activity-legend li { display: inline-flex; align-items: center; gap: 7px; }
body[data-report-page="people"] .person-activity-swatch, body[data-report-page="person"] .person-activity-swatch { width: 18px; height: 3px; flex: 0 0 auto; border-radius: 2px; }
body[data-report-page="people"] .person-activity-swatch.is-github, body[data-report-page="person"] .person-activity-swatch.is-github { background: var(--oc-status-success-fg); }
body[data-report-page="people"] .person-activity-swatch.is-discord, body[data-report-page="person"] .person-activity-swatch.is-discord { background: var(--oc-status-info-fg); }
body[data-report-page="people"] .person-activity-chart, body[data-report-page="person"] .person-activity-chart { min-width: 0; margin-top: 16px; border: 1px solid var(--oc-border-subtle); border-radius: var(--oc-radius-surface); background: var(--oc-bg-elevated); touch-action: pan-y; }
body[data-report-page="people"] .person-activity-chart:focus-visible, body[data-report-page="person"] .person-activity-chart:focus-visible { outline: 2px solid var(--oc-accent-primary); outline-offset: 2px; }
body[data-report-page="people"] .person-activity-svg, body[data-report-page="person"] .person-activity-svg { display: block; width: 100%; height: clamp(250px, 36vw, 390px); overflow: visible; }
body[data-report-page="people"] .person-activity-axis, body[data-report-page="person"] .person-activity-axis, body[data-report-page="people"] .person-activity-gridline, body[data-report-page="person"] .person-activity-gridline, body[data-report-page="people"] .person-activity-line, body[data-report-page="person"] .person-activity-line { vector-effect: non-scaling-stroke; }
body[data-report-page="people"] .person-activity-axis, body[data-report-page="person"] .person-activity-axis { fill: none; stroke: var(--oc-border-strong); stroke-width: 1; }
body[data-report-page="people"] .person-activity-gridline, body[data-report-page="person"] .person-activity-gridline { stroke: var(--oc-border-subtle); stroke-width: 1; }
body[data-report-page="people"] .person-activity-axis-tick, body[data-report-page="person"] .person-activity-axis-tick { fill: var(--oc-text-muted); font: 11px/1 var(--oc-font-mono); }
body[data-report-page="people"] .person-activity-axis-tick-left, body[data-report-page="person"] .person-activity-axis-tick-left { text-anchor: end; }
body[data-report-page="people"] .person-activity-axis-tick-right, body[data-report-page="person"] .person-activity-axis-tick-right { text-anchor: start; }
body[data-report-page="people"] .person-activity-axis-title, body[data-report-page="person"] .person-activity-axis-title { font: 800 12px/1 var(--oc-font-mono); }
body[data-report-page="people"] .person-activity-axis-title-github, body[data-report-page="person"] .person-activity-axis-title-github { fill: var(--oc-status-success-fg); }
body[data-report-page="people"] .person-activity-axis-title-discord, body[data-report-page="person"] .person-activity-axis-title-discord { fill: var(--oc-status-info-fg); }
body[data-report-page="people"] .person-activity-line, body[data-report-page="person"] .person-activity-line { fill: none; stroke-width: 2.25; stroke-linecap: round; stroke-linejoin: round; }
body[data-report-page="people"] .person-activity-line-github, body[data-report-page="person"] .person-activity-line-github { stroke: var(--oc-status-success-fg); }
body[data-report-page="people"] .person-activity-line-discord, body[data-report-page="person"] .person-activity-line-discord { stroke: var(--oc-status-info-fg); }
body[data-report-page="people"] .person-activity-point, body[data-report-page="person"] .person-activity-point { stroke: var(--oc-bg-elevated); stroke-width: 1; vector-effect: non-scaling-stroke; }
body[data-report-page="people"] .person-activity-point-github, body[data-report-page="person"] .person-activity-point-github { fill: var(--oc-status-success-fg); }
body[data-report-page="people"] .person-activity-point-discord, body[data-report-page="person"] .person-activity-point-discord { fill: var(--oc-status-info-fg); }
body[data-report-page="people"] .person-activity-quality-note, body[data-report-page="person"] .person-activity-quality-note { margin-top: 10px; font-size: 12px; line-height: 1.45; }
body[data-report-page="people"] .person-activity-values, body[data-report-page="person"] .person-activity-values { margin-top: 12px; border-top: 1px solid var(--oc-border-subtle); }
body[data-report-page="people"] .person-activity-values summary, body[data-report-page="person"] .person-activity-values summary { padding: 12px 0 4px; color: var(--oc-text-primary); font-weight: 760; cursor: pointer; }
body[data-report-page="people"] .person-activity-table-wrap, body[data-report-page="person"] .person-activity-table-wrap { max-width: 100%; overflow-x: auto; }
body[data-report-page="people"] .person-activity-table, body[data-report-page="person"] .person-activity-table { width: 100%; min-width: 700px; border-collapse: collapse; margin-top: 8px; }
body[data-report-page="people"] .person-activity-table th, body[data-report-page="person"] .person-activity-table th, body[data-report-page="people"] .person-activity-table td, body[data-report-page="person"] .person-activity-table td { padding: 9px 10px; border-bottom: 1px solid var(--oc-border-subtle); text-align: left; vertical-align: top; }
body[data-report-page="people"] .person-activity-table thead th, body[data-report-page="person"] .person-activity-table thead th { color: var(--oc-text-muted); font-size: 11px; text-transform: uppercase; }
body[data-report-page="people"] .person-activity-table tbody th, body[data-report-page="person"] .person-activity-table tbody th { color: var(--oc-text-primary); font: 760 12px/1.35 var(--oc-font-mono); }
body[data-report-page="people"] .person-activity-table td, body[data-report-page="person"] .person-activity-table td { color: var(--oc-text-secondary); font-size: 12px; line-height: 1.4; }
body[data-report-page="people"] .breadcrumbs, body[data-report-page="person"] .breadcrumbs { display: flex; gap: 8px; color: var(--oc-text-muted); font-size: 12px; margin-bottom: 12px; }
body[data-report-page="people"] .breadcrumbs a, body[data-report-page="person"] .breadcrumbs a { color: var(--oc-accent-primary); }
@media (max-width: 760px) {
body[data-report-page="people"] .people-header, body[data-report-page="person"] .people-header, body[data-report-page="sessions"] .people-header, body[data-report-page="people"] .month-row, body[data-report-page="person"] .month-row, body[data-report-page="people"] .activity-row, body[data-report-page="person"] .activity-row { grid-template-columns: 1fr; }
body[data-report-page="people"] .month-label, body[data-report-page="person"] .month-label { padding-top: 0; }
body[data-report-page="people"] .calendar, body[data-report-page="person"] .calendar { width: 100%; }
body[data-report-page="people"] .day-cell, body[data-report-page="person"] .day-cell { font-size: 10px; }
body[data-report-page="people"] .person-activity-legend, body[data-report-page="person"] .person-activity-legend { justify-content: flex-start; }
body[data-report-page="people"] .person-activity-svg, body[data-report-page="person"] .person-activity-svg { height: auto; aspect-ratio: 8 / 3; }
body[data-report-page="people"] .person-activity-axis-tick, body[data-report-page="person"] .person-activity-axis-tick { font-size: 24px; }
body[data-report-page="people"] .person-activity-axis-title, body[data-report-page="person"] .person-activity-axis-title { display: none; }
}
@media print {
body[data-report-page="people"] .person-activity-chart, body[data-report-page="person"] .person-activity-chart { break-inside: avoid; }
body[data-report-page="people"] .person-activity-svg, body[data-report-page="person"] .person-activity-svg { height: 300px; }
body[data-report-page="people"] .person-activity-values, body[data-report-page="person"] .person-activity-values { break-inside: avoid; }
}


body[data-report-page="home"] .home-grid > .quick-card { box-shadow: none; }
body[data-report-page="home"] .home-card h2 { margin: 4px 0 0; font-size: 18px; }
body[data-report-page="home"] .home-card > p:not(.oc-eyebrow) { color: var(--oc-text-muted); font-size: 13px; line-height: 1.45; }
body[data-report-page="home"] .home-card > .panel-link { align-self: flex-start; }
body[data-report-page="home"] .home-grid .oc-summary-metric { min-width: 0; }
body[data-report-page="home"] .home-grid .oc-summary-metric + .oc-summary-metric { padding-left: var(--oc-space-3); border-left: 1px solid var(--oc-border-subtle); }
body[data-report-page="home"] .home-grid .oc-summary-metric-copy { gap: var(--oc-space-1); }
body[data-report-page="home"] .home-grid .oc-summary-metric-copy small { overflow: visible; white-space: normal; }
body[data-report-page="report"] .distribution-track { width: 100%; }
body[data-report-page="report"] .distribution-segment { fill: var(--oc-chart-color, var(--oc-accent-primary)); }
body[data-report-page="report"] header .oc-summary-metric { max-width: 27rem; }
body[data-report-page="report"] header .oc-summary-metric-copy small { white-space: normal; }
body[data-report-page="report"] .oc-banner-title { font-size: inherit; line-height: inherit; font-weight: 650; }
/* Full-bleed bands own no top border: the band above already drew the seam; the strip also drops its bottom seam because the next section draws one. */
body[data-report-page="report"] main > .oc-banner, body[data-report-page="report"] main > .oc-summary-strip { margin: 0; border-inline: 0; border-top: 0; border-radius: 0; }
body[data-report-page="report"] main > .oc-summary-strip { border-bottom: 0; }
body[data-report-page="report"] .alias-line, body[data-report-page="report"] .theme-kind { color: var(--oc-text-muted); font-size: var(--oc-font-size-xs); }
body[data-report-page="report"] .person-body details { min-width: 0; }
body[data-report-page="people"] .people-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin: 0; padding: 10px var(--oc-space-4); border-inline: 0; border-top: 0; border-radius: 0; }
body[data-report-page="people"] .source-key { display: inline-flex; align-items: center; gap: 12px; margin-left: auto; color: var(--oc-text-muted); font-size: 12px; }
body[data-report-page="people"] .source-key span { display: inline-flex; align-items: center; gap: 5px; }
body[data-report-page="people"] .source-swatch { width: 10px; height: 10px; border-radius: 3px; border: 1px solid var(--oc-border-strong); }
body[data-report-page="people"] .source-swatch.github { background: var(--oc-status-success-fg); }
body[data-report-page="people"] .source-swatch.discord { background: var(--oc-status-info-fg); }
body[data-report-page="people"] .people-break.is-archived { margin-top: 18px; }
body[data-report-page="people"] .person-card.is-archived { border-style: dashed; opacity: .82; }
body[data-report-page="people"] .person-card-head .oc-avatar { width: 36px; height: 36px; }
body[data-report-page="people"] .person-card-days { flex-basis: 100%; }
body[data-report-page="people"] .person-card:hover { text-decoration: none; }
body[data-report-page="person"] .person-hero .oc-avatar { width: 72px; height: 72px; }
body[data-report-page="person"] .person-lifecycle, body[data-report-page="person"] .person-lifecycle-line { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; min-width: 0; color: var(--oc-status-warning-fg); font-size: 12px; font-weight: 800; line-height: 1.35; }
body[data-report-page="person"] main > .oc-summary-strip { margin: 0; border-inline: 0; border-block: 0; border-radius: 0; }
@media (max-width: 760px) {
  body[data-report-page="people"] .people-toolbar { align-items: flex-start; flex-direction: column; }
  body[data-report-page="people"] .source-key { margin-left: 0; }
}


`;
//#endregion
//#region extensions/team-reports/src/render/page.ts
function href(basePath, ...segments) {
	return `${basePath}/${segments.map(encodeURIComponent).join("/")}/`;
}
function date(value, timezone) {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: timezone
	}).format(value);
}
function relativeTime(ctx, ms) {
	const exact = escapeHtml(date(ms, ctx.displayTimezone));
	return `<time data-relative-time datetime="${new Date(ms).toISOString()}" title="${exact}">${exact}</time>`;
}
function periodTitle(entry) {
	if (entry.period === "week") return `Week ${entry.key.replace(/^\d+-W/, "")}`;
	return new Intl.DateTimeFormat("en-US", {
		month: entry.period === "month" ? "long" : "short",
		...entry.period === "day" ? { day: "numeric" } : {},
		year: "numeric",
		timeZone: "UTC"
	}).format(entry.sinceMs);
}
function formatWindow(entry) {
	const start = new Date(entry.sinceMs);
	const end = /* @__PURE__ */ new Date(entry.untilMs - 1);
	const day = (value) => new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	}).format(value);
	if (start.toISOString().slice(0, 10) === end.toISOString().slice(0, 10)) return day(start);
	if (start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()) return `${new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		timeZone: "UTC"
	}).format(start)}-${end.getUTCDate()}, ${end.getUTCFullYear()}`;
	return `${day(start)}-${day(end)}`;
}
function isOpen(ctx, entry) {
	const now = ctx.nowMs ?? Date.now();
	return now >= entry.sinceMs && now < entry.untilMs;
}
function openPeriodStatus(ctx, entry) {
	if (!isOpen(ctx, entry)) return "";
	const minutes = Math.max(1, Math.ceil((entry.untilMs - (ctx.nowMs ?? Date.now())) / 6e4));
	const remaining = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
	const until = new Date(entry.untilMs).toISOString();
	const asOf = new Date(entry.generatedAtMs).toISOString();
	return `<span class="open-period-status"><span>${entry.period === "day" ? "Today" : entry.period === "week" ? "Week to date" : "Month to date"}, as of <time datetime="${asOf}">${asOf.slice(11, 16)} UTC</time> · ${relativeTime(ctx, entry.generatedAtMs)}</span>${entry.period === "day" ? `<span aria-hidden="true">·</span><span data-day-countdown data-until="${until}">closes in ${remaining} (${until.slice(11, 16)} UTC)</span>` : ""}</span>`;
}
function banner(tone, content) {
	return `<section class="oc-banner oc-banner-${tone}"><span class="oc-banner-indicator" aria-hidden="true"></span><div class="oc-banner-content">${content}</div></section>`;
}
function sourceBanners(report, summary) {
	const banners = [];
	const source = (title, warnings) => banner("warning", `<strong class="oc-banner-title">${title}</strong><p>${warnings.length ? warnings.map(escapeHtml).join(" · ") : "Counts may be lower than actual activity."}</p>`);
	const github = report.sources.github;
	if (!github.ok || github.stale || github.warnings.length) banners.push(source(!github.ok ? "GitHub sources unavailable" : "GitHub coverage is incomplete", github.warnings));
	const discord = report.sources.discord;
	if (discord && (!discord.ok || discord.stale || discord.warnings.length)) banners.push(source("Discord coverage is incomplete", discord.warnings));
	const warnings = [...summary?.warnings ?? [], ...report.truncated ? ["Item lists were truncated; aggregate counts are preserved."] : []];
	if (warnings.length) banners.push(source("Summary and coverage notes", warnings));
	return banners.slice(0, 3).join("");
}
function sectionHeading(title, eyebrow, note) {
	return `<div class="oc-section-header"><div>${eyebrow ? `<div class="oc-eyebrow">${escapeHtml(eyebrow)}</div>` : ""}<h2>${escapeHtml(title)}</h2></div>${note ? `<span class="section-note">${escapeHtml(note)}</span>` : ""}</div>`;
}
function affiliation(person) {
	return `<span class="affiliation ${person.roleGroup === "readonly" ? "is-readonly" : person.roleGroup === "volunteer" ? "is-na" : !person.affiliation || person.affiliation === "Independent" ? "is-independent" : ""}">${escapeHtml(person.affiliation || (person.roleGroup === "readonly" ? "Read-only" : person.roleGroup === "volunteer" ? "Volunteer" : "Independent"))}</span>`;
}
function externalLink(url, label) {
	const safe = safeExternalUrl(url);
	return safe ? `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>` : escapeHtml(label);
}
function markdownBlocks(value) {
	return value.split(/\n\s*\n/).map((block) => {
		const lines = block.split("\n");
		const inline = (line) => escapeHtml(line).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
		return lines.every((line) => /^\s*[-*] /.test(line)) ? `<ul>${lines.map((line) => `<li>${inline(line.replace(/^\s*[-*] /, ""))}</li>`).join("")}</ul>` : `<p>${lines.map(inline).join("<br>")}</p>`;
	}).join("");
}
function shell(ctx, title, body, page) {
	const active = page === "sessions" ? "Work sessions" : page === "home" || page === "report" ? "Reports" : "People";
	const links = [
		["Reports", `${ctx.basePath}/`],
		["Latest", `${ctx.basePath}/latest/`],
		["People", `${ctx.basePath}/people/`],
		["Work sessions", `${ctx.basePath}/sessions/`]
	].map(([label, url]) => `<a class="oc-segmented-item${label === active ? " is-active" : ""}" href="${escapeHtml(url ?? "")}"${label === active ? " aria-current=\"page\"" : ""}>${label}</a>`).join("");
	return `<!doctype html><html lang="en" data-report-base-path="${escapeHtml(ctx.basePath)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} · Team Reports</title><script nonce="${escapeHtml(ctx.nonce)}">${REPORT_SCRIPT}<\/script><style nonce="${escapeHtml(ctx.nonce)}">${REPORT_STYLES}</style></head><body class="oc-app-surface" data-report-page="${page}"><nav class="site-nav" aria-label="Report navigation"><div class="site-nav-inner"><a class="site-brand" href="${escapeHtml(ctx.basePath)}/"><span class="brand-mark" aria-hidden="true"><img src="${escapeHtml(ctx.basePath)}/assets/icon.png" width="26" height="26" alt=""></span><span>Reports</span></a><div class="site-links oc-segmented">${links}<button class="theme-toggle oc-action oc-action-ghost oc-action-icon" type="button" data-theme-toggle aria-label="Toggle theme" title="Toggle theme"><svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2m-17-7 2 2m12 12 2 2M5 19l2-2M17 7l2-2"/></svg><svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z"/></svg></button><a class="theme-toggle oc-action oc-action-ghost oc-action-icon" href="${escapeHtml(ctx.absoluteUrl)}" target="_blank" rel="noopener" data-report-open-window aria-label="Open in a new window" title="Open in a new window"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7M21 3 10 14M10 3H3v18h18v-7"/></svg></a></div></div></nav><main class="shell">${body}</main><footer>Report windows use UTC. Generation times are shown in ${escapeHtml(ctx.displayTimezone)}. Links may not open inside the Control UI frame.</footer></body></html>`;
}
//#endregion
//#region extensions/team-reports/src/render/work-sessions.ts
function sessionRow(ctx, session) {
	const path = buildControlUiSessionPath({
		namespace: "chat",
		sessionKey: session.key,
		fallbackAgentId: session.agentId,
		basePath: ctx.controlUiBasePath,
		mainKey: ctx.mainKey,
		exactKey: true
	});
	if (!path) return "";
	const title = session.label || session.displayName || session.derivedTitle || "Untitled session";
	const actor = session.owner?.actor;
	const owner = actor?.label || (actor?.type === "agent" ? "Agent-owned" : "Unassigned");
	const status = session.status ?? "idle";
	const tone = status === "running" || status === "queued" ? "info" : status === "failed" || status === "timeout" ? "warning" : "neutral";
	return `<li class="oc-resource-list-item work-session"><div class="work-session-main"><a class="work-session-title" href="${escapeHtml(path)}" target="_top" data-work-session-key="${escapeHtml(session.key)}"${session.agentId ? ` data-work-session-agent="${escapeHtml(session.agentId)}"` : ""}>${escapeHtml(title)}</a><span class="muted">${escapeHtml(owner)}${session.projectId ? ` · ${escapeHtml(session.projectId)}` : ""}</span></div><div class="work-session-meta"><span class="oc-badge oc-badge-${tone}">${escapeHtml(status)}</span></div></li>`;
}
function workSessionList(ctx, result) {
	if (!result.available && "reason" in result) return `<p class="oc-empty">${result.reason === "unlinked" ? "No linked GitHub profile for this member." : "Multiple or unresolved linked profiles for this member; ownership cannot be determined."}</p>`;
	if (!result.available) return banner("warning", "<strong class=\"oc-banner-title\">Work sessions unavailable</strong><p>Refresh this page to retry. Stored activity reports are still available.</p>");
	const rows = result.sessions.map((session) => sessionRow(ctx, session)).join("");
	return rows ? `<ul class="oc-resource-list work-sessions">${rows}</ul>` : "<p class=\"oc-empty\">No work sessions are visible to you.</p>";
}
function renderWorkSessionsPreview(ctx, result) {
	return `<section class="home-card work-sessions-panel oc-card"><div class="home-card-top"><div><div class="oc-eyebrow">on this server</div><h2>Work sessions</h2><p>What people are working on, linked to their conversations.</p></div><a class="panel-link oc-action" href="${escapeHtml(href(ctx.basePath, "sessions"))}">All work sessions <span aria-hidden="true">→</span></a></div>${workSessionList(ctx, result)}</section>`;
}
function renderWorkSessionsPage(ctx, result, offset, login) {
	const page = href(ctx.basePath, "sessions");
	const personQuery = login ? `person=${encodeURIComponent(login)}&` : "";
	const previous = offset > 0 ? `<a class="oc-action oc-action-ghost" href="${escapeHtml(page)}?${personQuery}offset=${Math.max(0, offset - 40)}">Newer sessions</a>` : "";
	const next = result.available && result.nextOffset !== void 0 ? `<a class="oc-action" href="${escapeHtml(page)}?${personQuery}offset=${result.nextOffset}">Older sessions</a>` : "";
	return shell(ctx, "Work sessions", `<header class="people-header"><div><div class="oc-eyebrow">on this server</div><h1>${login ? `Current work / owned sessions for @${escapeHtml(login)}` : "Work sessions"}</h1><p>Open a conversation to see the work behind it. Owners and status come from the current session, not GitHub activity counts.</p><p class="muted">Most recent activity first. Archived, incognito, automated, and hidden subagent sessions are excluded. Access follows your session permissions.</p></div><a class="oc-action oc-action-ghost" href="${escapeHtml(page)}${login ? `?person=${encodeURIComponent(login)}` : ""}">Refresh</a></header><section class="oc-card" aria-label="Work sessions">${workSessionList(ctx, result)}</section><nav class="actions" aria-label="Session pages">${previous}${next}</nav>`, "sessions");
}
function renderPersonWorkSessions(ctx, login, result) {
	const all = result.available && result.nextOffset !== void 0 ? `<a class="oc-action oc-action-ghost" href="${escapeHtml(href(ctx.basePath, "sessions"))}?person=${encodeURIComponent(login)}">All owned sessions <span aria-hidden="true">→</span></a>` : "";
	return `<section class="person-work-sessions" aria-label="Current work / owned sessions"><h3>Current work / owned sessions</h3><p class="section-note">Visible to you now, not activity from this report period.</p>${workSessionList(ctx, result)}${all}</section>`;
}
//#endregion
//#region extensions/team-reports/src/render/people.ts
function activityLevel(count) {
	if (count <= 0) return 0;
	if (count < 5) return 1;
	if (count < 15) return 2;
	if (count < 40) return 3;
	return 4;
}
function total(day) {
	return day.githubTotal + day.discordMessages;
}
function dayTitle(key) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	}).format(Date.parse(`${key}T00:00:00Z`));
}
function peopleMetric(label, value) {
	return `<div class="oc-summary-metric"><span class="oc-summary-metric-copy"><small>${escapeHtml(label)}</small><strong>${escapeHtml(String(value))}</strong></span></div>`;
}
function roleBadge(person) {
	const role = person.roleLabel ?? person.roleGroup;
	return `${role ? `<span class="oc-badge oc-badge-${person.roleGroup === "readonly" ? "neutral" : "info"}">${escapeHtml(role)}</span>` : ""}${person.status === "archived" ? "<span class=\"oc-badge oc-badge-neutral\">Archived</span>" : ""}`;
}
function rankingStats(days) {
	return days.reduce((result, day) => ({
		github: result.github + day.githubTotal,
		discord: result.discord + day.discordMessages,
		active: result.active + (total(day) > 0 ? 1 : 0)
	}), {
		github: 0,
		discord: 0,
		active: 0
	});
}
function renderPeoplePage(ctx, people, days = [], endKey) {
	const last = endKey ?? days.map((day) => day.dayKey).toSorted().at(-1) ?? new Date(ctx.nowMs ?? Date.now()).toISOString().slice(0, 10);
	const end = Date.parse(`${last}T00:00:00Z`);
	const keys = Array.from({ length: 28 }, (_, index) => (/* @__PURE__ */ new Date(end - (27 - index) * DAY_MS)).toISOString().slice(0, 10));
	const first = keys[0] ?? last;
	const rankedDays = days.filter((day) => day.dayKey >= first && day.dayKey <= last);
	const dayCount = new Set(rankedDays.map((day) => day.dayKey)).size;
	const byLogin = /* @__PURE__ */ new Map();
	for (const day of rankedDays) {
		const login = day.login.toLowerCase();
		const entries = byLogin.get(login) ?? [];
		entries.push(day);
		byLogin.set(login, entries);
	}
	const ranked = people.map((person) => {
		const entries = byLogin.get((person.github[0] ?? "").toLowerCase()) ?? [];
		return {
			person,
			entries,
			stats: rankingStats(entries)
		};
	}).toSorted((a, b) => b.stats.github + b.stats.discord - a.stats.github - a.stats.discord || b.stats.active - a.stats.active || (a.person.display ?? a.person.github[0] ?? "").localeCompare(b.person.display ?? b.person.github[0] ?? ""));
	const groups = [
		{
			key: "active",
			label: "Active members",
			rows: ranked.filter(({ person, stats }) => person.status !== "archived" && person.roleGroup !== "readonly" && stats.active > 0)
		},
		{
			key: "quiet",
			label: "No visible activity in the ranking window",
			rows: ranked.filter(({ person, stats }) => person.status !== "archived" && person.roleGroup !== "readonly" && stats.active === 0)
		},
		{
			key: "readonly",
			label: "Read-only access",
			rows: ranked.filter(({ person }) => person.status !== "archived" && person.roleGroup === "readonly")
		},
		{
			key: "archived",
			label: "Former members",
			rows: ranked.filter(({ person }) => person.status === "archived")
		}
	];
	const cards = groups.filter((group) => group.rows.length).map((group) => {
		return `${`<div class="people-break${group.key === "archived" ? " is-archived" : group.key === "readonly" ? " is-readonly" : ""}" data-people-group="${group.key}"${group.key === "quiet" ? " data-inactive=\"true\"" : ""}><span>${group.label}</span><span>${group.rows.length} ${group.key === "quiet" ? "quiet" : group.key === "archived" ? "archived" : "people"}</span></div>`}${group.rows.map(({ person, entries, stats }) => {
			const login = person.github[0] ?? "";
			const display = person.display ?? login;
			const archived = person.status === "archived";
			const inactive = stats.active === 0;
			const points = new Map(entries.map((day) => [day.dayKey, day]));
			const strip = keys.map((key) => {
				const point = points.get(key);
				const count = point ? total(point) : 0;
				const title = `${key}: ${point ? `${count} events` : "No stored report"}`;
				return `<span class="day-dot level-${activityLevel(count)}" title="${escapeHtml(title)}"></span>`;
			}).join("");
			return `<a class="person-card oc-card oc-card-interactive${inactive ? " is-inactive" : ""}${archived ? " is-archived" : ""}" href="${escapeHtml(href(ctx.basePath, "people", login))}" data-inactive="${inactive && !archived}"><span class="person-card-head">${renderAvatar(login, display, "sm")}<span class="person-card-identity"><strong>${escapeHtml(display)}</strong><span class="person-handle">@${escapeHtml(login)}</span>${affiliation(person)}</span></span><span class="mini-strip mini-strip-combined" aria-label="Activity over 28 UTC days">${strip}</span><span class="person-card-meta">${roleBadge(person)}<span>${stats.github + stats.discord} events · ${stats.github} GitHub · ${stats.discord} Discord</span><span class="person-card-days">${stats.active} out of ${dayCount} days active</span></span></a>`;
		}).join("")}`;
	}).join("");
	const archived = people.filter((person) => person.status === "archived").length;
	const quiet = groups.find((group) => group.key === "quiet")?.rows.length ?? 0;
	return shell(ctx, "People", `<header class="people-header"><div><div class="oc-eyebrow">people</div><h1>Member Activity Timelines</h1><p>Current members ranked by the last 28 days, with former members retained in the archive. Darker cells mean heavier GitHub or Discord activity. Open a person to explore their daily reports.</p></div><div class="oc-card oc-summary-metric"><span class="oc-summary-metric-copy"><small>Ranking Window</small><strong>28 days</strong><small>${people.length - archived} current, ${quiet} quiet, ${archived} archived · ${dayCount} report days</small></span></div></header><section class="people-toolbar oc-card" aria-label="Timeline display"><label class="source-toggle js-only"><input class="oc-switch" type="checkbox" data-hide-inactive-toggle aria-label="Hide people with zero activity"><span>Hide quiet</span></label><div class="source-key"><span><i class="source-swatch github" aria-hidden="true"></i>GitHub</span><span><i class="source-swatch discord" aria-hidden="true"></i>Discord</span></div></section><section class="people-grid" aria-label="Member timelines">${cards || "<div class=\"oc-empty\"><p class=\"oc-empty-description\">No member activity yet.</p></div>"}</section>`, "people");
}
function personActivityChart(login, days) {
	const latest = days.at(-1);
	if (!latest) return `<section class="archive-panel person-activity-panel oc-section">${sectionHeading("Last 30 Days", "activity")}<p>No daily report data is available.</p></section>`;
	const start = Date.parse(`${latest.dayKey}T00:00:00Z`) - 29 * DAY_MS;
	const points = days.filter((day) => Date.parse(`${day.dayKey}T00:00:00Z`) >= start);
	const maximum = (field) => {
		const value = Math.max(0, ...points.map((day) => day[field]));
		if (value <= 4) return 4;
		const magnitude = 10 ** Math.floor(Math.log10(value / 4));
		const normalized = value / 4 / magnitude;
		const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
		return Math.ceil(value / step) * step;
	};
	const githubMax = maximum("githubTotal");
	const discordMax = maximum("discordMessages");
	const x = (day) => 78 + (Date.parse(`${day.dayKey}T00:00:00Z`) - start) / (29 * DAY_MS) * 782;
	const y = (value, max) => 298 - value / max * 234;
	const fixed = (value) => value.toFixed(1);
	const series = (field, source, max) => {
		return `<path class="person-activity-line person-activity-line-${source}" d="${points.map((day, index) => {
			const previous = points[index - 1];
			return previous && Date.parse(`${day.dayKey}T00:00:00Z`) - Date.parse(`${previous.dayKey}T00:00:00Z`) === 864e5 ? `H${fixed(x(day))} V${fixed(y(day[field], max))}` : `M${fixed(x(day))} ${fixed(y(day[field], max))}`;
		}).join(" ")}"/>${points.map((day) => `<circle class="person-activity-point person-activity-point-${source}" cx="${fixed(x(day))}" cy="${fixed(y(day[field], max))}" r="2.5"><title>${escapeHtml(`${day.dayKey}: ${day[field]} ${source === "github" ? "GitHub events" : "Discord messages"}`)}</title></circle>`).join("")}`;
	};
	const ticks = Array.from({ length: 5 }, (_, index) => {
		const fraction = index / 4;
		const yy = fixed(y(fraction, 1));
		return `<line class="person-activity-gridline" x1="78" y1="${yy}" x2="860" y2="${yy}"/><text class="person-activity-axis-tick person-activity-axis-tick-left" x="66" y="${fixed(Number(yy) + 4)}">${Math.round(githubMax * fraction)}</text><text class="person-activity-axis-tick person-activity-axis-tick-right" x="872" y="${fixed(Number(yy) + 4)}">${Math.round(discordMax * fraction)}</text>`;
	}).join("");
	const dateTicks = [
		0,
		7,
		14,
		21,
		29
	].map((offset) => {
		const time = start + offset * DAY_MS;
		const label = new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			timeZone: "UTC"
		}).format(time);
		return `<text class="person-activity-axis-tick" x="${fixed(78 + offset / 29 * 782)}" y="342" text-anchor="${offset === 0 ? "start" : offset === 29 ? "end" : "middle"}">${escapeHtml(label)}</text>`;
	}).join("");
	const svg = `<svg class="person-activity-svg" viewBox="0 0 960 360" role="img" aria-label="${escapeHtml(`Daily activity for @${login}: GitHub events on the left axis, Discord messages on the right axis`)}"><title>${escapeHtml(`Last 30 Days for @${login}`)}</title><desc>Only stored daily values are plotted. Gaps indicate missing reports, not zero activity.</desc>${ticks}<path class="person-activity-axis" d="M78 64V298H860V64"/><text class="person-activity-axis-title person-activity-axis-title-github" x="78" y="26">GitHub events · left axis</text><text class="person-activity-axis-title person-activity-axis-title-discord" x="860" y="26" text-anchor="end">Discord messages · right axis</text>${series("githubTotal", "github", githubMax)}${series("discordMessages", "discord", discordMax)}${dateTicks}</svg>`;
	return `<section class="archive-panel person-activity-panel oc-section">${sectionHeading("Last 30 Days", "activity", "Daily GitHub events and report-scoped Discord messages. UTC.")}<ul class="person-activity-legend" aria-label="Chart series and axes"><li><span class="person-activity-swatch is-github" aria-hidden="true"></span>GitHub events · left axis</li><li><span class="person-activity-swatch is-discord" aria-hidden="true"></span>Discord messages · right axis</li></ul><div class="person-activity-chart">${svg}</div><p class="person-activity-quality-note">Only stored days are shown. Missing days are not counted as zero activity.</p><details class="person-activity-values"><summary>Exact daily values</summary><div class="person-activity-table-wrap"><table class="person-activity-table"><thead><tr><th scope="col">UTC day</th><th scope="col">GitHub events</th><th scope="col">Discord messages</th></tr></thead><tbody>${points.map((day) => `<tr><th scope="row"><time datetime="${escapeHtml(day.dayKey)}">${escapeHtml(day.dayKey)}</time></th><td>${day.githubTotal}</td><td>${day.discordMessages}</td></tr>`).join("")}</tbody></table></div></details></section>`;
}
function reportHref(ctx, login, key) {
	return escapeHtml(`${href(ctx.basePath, "day", key)}?person=${encodeURIComponent(login)}`);
}
function archiveTimeline(ctx, login, days) {
	const months = /* @__PURE__ */ new Map();
	for (const day of days) {
		const month = day.dayKey.slice(0, 7);
		const entries = months.get(month) ?? [];
		entries.push(day);
		months.set(month, entries);
	}
	return [...months.entries()].toReversed().map(([month, entries]) => {
		const first = /* @__PURE__ */ new Date(`${month}-01T00:00:00Z`);
		const offset = (first.getUTCDay() + 6) % 7;
		const monthEnd = new Date(first);
		monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
		const length = (monthEnd.getTime() - first.getTime()) / DAY_MS;
		const points = new Map(entries.map((day) => [day.dayKey, day]));
		const cells = Array.from({ length }, (_, index) => {
			const key = `${month}-${String(index + 1).padStart(2, "0")}`;
			const point = points.get(key);
			if (!point) return `<span class="day-cell is-missing" title="${escapeHtml(`${key}: No stored report`)}">${index + 1}</span>`;
			const label = `${key}: ${total(point)} events for @${login}`;
			return `<a class="day-cell level-${activityLevel(total(point))}" href="${reportHref(ctx, login, key)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${index + 1}</a>`;
		}).join("");
		return `<div class="month-row"><div class="month-label">${escapeHtml(new Intl.DateTimeFormat("en-US", {
			month: "long",
			year: "numeric",
			timeZone: "UTC"
		}).format(first))}</div><div class="calendar"><div class="weekday-row" aria-hidden="true"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="day-grid">${Array.from({ length: offset }, () => "<span class=\"day-spacer\" aria-hidden=\"true\"></span>").join("")}${cells}</div></div></div>`;
	}).join("");
}
function renderPersonPage(ctx, person, days, workSessions) {
	const login = person.github[0] ?? "";
	const display = person.display ?? login;
	const ordered = days.toSorted((a, b) => a.dayKey.localeCompare(b.dayKey));
	const active = ordered.filter((day) => total(day) > 0);
	const latest = active.at(-1);
	const sum = (value) => days.reduce((result, day) => result + value(day), 0);
	const totals = [
		peopleMetric("GitHub", sum((day) => day.githubTotal)),
		peopleMetric("Comments", sum((day) => day.issueComments + day.reviewComments)),
		peopleMetric("Discord", sum((day) => day.discordMessages)),
		peopleMetric("Commits", sum((day) => day.commits)),
		peopleMetric("PRs", sum((day) => day.prsOpened + day.prsMerged + day.prsClosed)),
		peopleMetric("Issues", sum((day) => day.issuesOpened + day.issuesClosed))
	].join("");
	const lifecycle = person.status === "archived" ? `<p class="person-lifecycle">Archived${person.archivedAt ? ` on ${escapeHtml(person.archivedAt)}` : ""}. Historical reports remain available.</p>` : "";
	const rows = active.toReversed().map((day) => `<a class="activity-row" href="${reportHref(ctx, login, day.dayKey)}"><span class="activity-date">${escapeHtml(dayTitle(day.dayKey))}</span><span><strong>${total(day)} events</strong><span>${day.githubTotal} GitHub · ${day.issueComments + day.reviewComments} comments · ${day.discordMessages} Discord · ${day.commits} commits · ${day.prsOpened + day.prsMerged + day.prsClosed} PRs</span></span></a>`).join("");
	return shell(ctx, display, `<header class="people-header"><div class="person-hero">${renderAvatar(login, display, "xl")}<div><div class="breadcrumbs"><a href="${escapeHtml(href(ctx.basePath, "people"))}">People</a><span>/</span><span>@${escapeHtml(login)}</span></div><h1>${escapeHtml(display)}</h1><div class="person-company-line">${affiliation(person)}<span class="person-handle">@${escapeHtml(login)}</span>${roleBadge(person)}</div>${lifecycle}${person.github.length > 1 ? `<p class="alias-line">Aliases: ${person.github.slice(1).map((alias) => `@${escapeHtml(alias)}`).join(" · ")}</p>` : ""}</div></div><div class="oc-card oc-summary-metric"><span class="oc-summary-metric-copy"><small>Active Days</small><strong>${active.length}/${days.length}</strong><small>${latest ? `Latest activity ${escapeHtml(dayTitle(latest.dayKey))}` : "No active days"}</small></span></div></header><section class="oc-summary-strip" aria-label="Member totals over retained days">${totals}</section>${workSessions ? renderPersonWorkSessions(ctx, login, workSessions) : ""}${personActivityChart(login, ordered)}<section class="archive-panel oc-section">${sectionHeading("Daily Archive", "timeline")}<div class="legend" aria-label="Activity intensity, low to high"><span class="level-0"></span><span class="level-1"></span><span class="level-2"></span><span class="level-3"></span><span class="level-4"></span></div>${archiveTimeline(ctx, login, ordered) || "<div class=\"oc-empty\"><p class=\"oc-empty-description\">No stored daily reports for this person yet.</p></div>"}</section><section class="archive-panel oc-section">${sectionHeading("Active Days", "history")}<div class="activity-list">${rows || "<p class=\"muted\">No active days recorded.</p>"}</div></section>`, "person");
}
//#endregion
//#region extensions/team-reports/src/render/report.ts
function activitySegments(github, discord) {
	const prs = github.prsOpened + github.prsMerged + github.prsClosed;
	const issues = github.issuesOpened + github.issuesClosed;
	const comments = github.issueComments + github.reviewComments;
	return [
		{
			label: "Commits",
			value: github.commits,
			tone: "primary"
		},
		{
			label: "PRs",
			value: prs,
			tone: "secondary"
		},
		{
			label: "Issues",
			value: issues,
			tone: "tertiary"
		},
		{
			label: "Comments",
			value: comments,
			tone: "quaternary"
		},
		{
			label: "GHSAs",
			value: github.securityAdvisories,
			tone: "error"
		},
		{
			label: "Other GitHub",
			value: Math.max(0, github.total - github.commits - prs - issues - comments - github.securityAdvisories),
			tone: "neutral"
		},
		{
			label: "Discord",
			value: discord,
			tone: "muted"
		}
	].filter((segment) => segment.value > 0);
}
function metric(label, value, detail = "", trend = "") {
	return `<div class="oc-summary-metric"><span class="oc-summary-metric-copy"><small>${escapeHtml(label)}</small><strong>${escapeHtml(String(value))}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}${trend}</span></div>`;
}
function distribution(ctx, members) {
	const ranked = members.filter((member) => member.github.total + member.discord.total > 0).toSorted((a, b) => b.github.total + b.discord.total - a.github.total - a.discord.total || a.login.localeCompare(b.login));
	const total = ranked.reduce((sum, member) => sum + member.github.total + member.discord.total, 0);
	if (total === 0) return "<div class=\"oc-empty\"><p class=\"oc-empty-description\">No member activity recorded in this window.</p></div>";
	const row = (member) => {
		const value = member.github.total + member.discord.total;
		const segments = activitySegments(member.github, member.discord.total);
		let offset = 0;
		const rectangles = segments.map((segment) => {
			const width = segment.value / total * 100;
			const rect = `<rect class="distribution-segment oc-split-${segment.tone}" x="${offset.toFixed(3)}" y="0" width="${width.toFixed(3)}" height="8"><title>${escapeHtml(segment.label)}: ${segment.value}</title></rect>`;
			offset += width;
			return rect;
		}).join("");
		const breakdown = segments.map((segment) => `<span class="distribution-breakdown-item"><span class="distribution-breakdown-key oc-split-${segment.tone}" aria-hidden="true"></span>${escapeHtml(segment.label)} ${segment.value}</span>`).join("");
		return `<li><a href="${escapeHtml(href(ctx.basePath, "people", member.login))}" aria-label="${escapeHtml(`@${member.login}: ${value} activities, ${Math.round(value / total * 100)}%`)}"><span class="distribution-label"><span class="distribution-label-primary">@${escapeHtml(member.login)}</span><span class="distribution-label-detail">${escapeHtml(member.display)}</span></span><svg class="distribution-track" viewBox="0 0 100 8" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(`Activity types for @${member.login}`)}">${rectangles}</svg><strong class="distribution-total">${value}</strong><span class="distribution-share">${Math.round(value / total * 100)}%</span><span class="distribution-breakdown">${breakdown}</span></a></li>`;
	};
	return `<div class="ranked-distribution" aria-label="Activity by Member"><ol class="ranked-distribution-list">${ranked.slice(0, 12).map(row).join("")}</ol>${ranked.length > 12 ? `<details class="distribution-more"><summary>Show remaining ${ranked.length - 12}</summary><ol class="ranked-distribution-list" start="13">${ranked.slice(12).map(row).join("")}</ol></details>` : ""}</div>`;
}
function roleBadges(member) {
	const role = member.roleLabel ?? member.roleGroup;
	return `${role ? `<span class="oc-badge oc-badge-${member.roleGroup === "readonly" ? "neutral" : "info"}">${escapeHtml(role)}</span>` : ""}${member.access.map((access) => `<span class="oc-badge oc-badge-neutral">${escapeHtml(access)}</span>`).join("")}`;
}
function searchText(member) {
	return escapeHtml([
		member.login,
		member.display,
		...member.aliases,
		member.affiliation,
		...member.areas
	].filter(Boolean).join(" ").toLowerCase());
}
function personRow(ctx, member, workSessions) {
	const top = (values, limit) => Object.entries(values).toSorted(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b)).slice(0, limit);
	const chips = [
		...top(member.github.repos, 4).map(([repo, count]) => `${repo}: ${count}`),
		...top(member.discord.channels, 3).map(([channel, count]) => `#${channel}: ${count}`),
		...member.areas.map((area) => `owns: ${area}`)
	].map((text) => `<span class="oc-badge oc-badge-neutral">${escapeHtml(text)}</span>`).join("");
	const themes = member.github.items.slice(0, 3).map((item) => `<div class="theme"><span class="theme-kind">${ITEM_LABELS[item.kind]}</span> ${externalLink(item.url, item.title)}</div>`).join("");
	const counts = [
		["GitHub", member.github.total],
		["Commits", member.github.commits],
		["GHSAs", member.github.securityAdvisories],
		["PRs", member.github.prsOpened + member.github.prsMerged + member.github.prsClosed],
		["Issues", member.github.issuesOpened + member.github.issuesClosed],
		["Comments", member.github.issueComments + member.github.reviewComments],
		["Discord", member.discord.total]
	];
	const excerpts = member.discord.excerpts.length ? `<details><summary>Discord excerpts</summary>${member.discord.excerpts.map((excerpt) => `<blockquote><small>#${escapeHtml(excerpt.channel)} · ${escapeHtml(date(excerpt.atMs, ctx.displayTimezone))}</small><br>${escapeHtml(excerpt.excerpt)}</blockquote>`).join("")}</details>` : "";
	const items = member.github.items.length ? `<details><summary>${member.github.items.length} GitHub items</summary><ul class="oc-resource-list">${member.github.items.map((item) => `<li class="oc-resource-list-item resource-row"><span class="theme-kind">${ITEM_LABELS[item.kind]} · ${escapeHtml(item.repo)}</span>${externalLink(item.url, item.title)}</li>`).join("")}</ul></details>` : "";
	return `<article class="person oc-card" data-maintainer-card data-maintainer-search="${searchText(member)}"><div class="person-title"><div class="person-heading">${renderAvatar(member.login, member.display, "md")}<div><a class="handle" href="${escapeHtml(href(ctx.basePath, "people", member.login))}">@${escapeHtml(member.login)}</a><div class="person-name">${escapeHtml(member.display)}</div>${member.aliases.length ? `<div class="alias-line">${member.aliases.map((alias) => `@${escapeHtml(alias)}`).join(" · ")}</div>` : ""}</div></div>${affiliation(member)}<div class="role-line">${roleBadges(member)}</div></div><div class="person-body"><div class="chips">${chips}</div><p class="focus">${escapeHtml(memberSummary(member))}</p>${themes}${items}${excerpts}${workSessions ? renderPersonWorkSessions(ctx, member.login, workSessions) : ""}</div><div class="person-numbers">${counts.map(([label, count]) => `<div class="number-line"><span>${label}</span><strong>${count}</strong></div>`).join("")}</div></article>`;
}
function renderReportPage(ctx, report, summary, history = [], workSessions = /* @__PURE__ */ new Map()) {
	const entry = {
		...report.period,
		status: report.status,
		generatedAtMs: report.generatedAtMs
	};
	const open = isOpen(ctx, entry);
	const period = report.period.period;
	const path = href(ctx.basePath, period, report.period.key);
	const partialBanner = open || report.status === "partial" && report.generatedAtMs < report.period.untilMs ? banner("info", `<strong class="oc-banner-title">Partial report</strong><span class="oc-badge oc-badge-info partial-report-badge">Incomplete snapshot</span><p>${open ? `This UTC ${period} is still in progress.` : `This UTC ${period} was still in progress when this snapshot was generated.`} Totals include activity collected through ${relativeTime(ctx, report.generatedAtMs)}. ${open ? "Activity may increase before the window closes." : "The window has since closed, so these totals remain incomplete."}</p>`) : "";
	const github = report.totals.github;
	const prior = history.filter((row) => row.period === period && row.sinceMs < report.period.sinceMs).toSorted((a, b) => a.sinceMs - b.sinceMs).slice(-({
		day: 28,
		week: 12,
		month: 6
	}[period] - 1));
	const trend = (field, value, label, badUp = false) => {
		const values = [...prior.map((row) => row[field]), value];
		return `<small>${deltaMarkup(value, prior.at(-1)?.[field], `prev ${period}${open ? " (in progress)" : ""}`, badUp)}</small>${sparklineSvg(values, `${label} by ${period}`)}`;
	};
	const active = report.members.filter((member) => member.github.total + member.discord.total > 0);
	const quiet = report.members.filter((member) => member.github.total + member.discord.total === 0);
	const roleCounts = [
		"core",
		"volunteer",
		"readonly"
	].map((role) => active.filter((member) => member.roleGroup === role).length);
	const repositories = Number(report.sources.github.stats.reposScanned) || Object.keys(github.repos).length;
	const channels = Number(report.sources.discord?.stats.channelsScanned) || Object.keys(report.totals.discord.channels).length;
	const totals = [
		metric("Active", `${report.activeMembers}/${report.memberCount}`, roleCounts.some((count) => count > 0) ? `${roleCounts[0]} Core / ${roleCounts[1]} Community / ${roleCounts[2]} Read-only` : "members with activity", trend("activeMembers", report.activeMembers, "Active members")),
		metric("GitHub", github.total, "events", trend("githubTotal", github.total, "GitHub events")),
		metric("Discord", report.totals.discord.messages, "messages", trend("discordMessages", report.totals.discord.messages, "Discord messages")),
		metric("PRs Opened", github.prsOpened, `${github.prsMerged} merged`, trend("prsOpened", github.prsOpened, "PRs opened")),
		metric("Security", github.securityAdvisories, "advisories", trend("securityAdvisories", github.securityAdvisories, "Security advisories", true)),
		metric("Repos", Object.entries(github.repos).filter(([, count]) => count > 0).length, "active repositories")
	].join("");
	const mix = [
		metric("Commits", github.commits),
		metric("GHSAs", github.securityAdvisories),
		metric("Issue/PR comments", github.issueComments),
		metric("PR review comments", github.reviewComments),
		metric("Discord messages", report.totals.discord.messages)
	].join("");
	const quietBlock = quiet.length ? `<div class="quiet-maintainers"><div class="quiet-title"><h3>No visible activity</h3><span class="small">${quiet.length} members</span></div><ul class="quiet-list">${quiet.map((member) => `<li data-maintainer-quiet data-maintainer-search="${searchText(member)}"><a href="${escapeHtml(href(ctx.basePath, "people", member.login))}">@${escapeHtml(member.login)} — ${escapeHtml(member.display)}${member.affiliation ? ` — ${escapeHtml(member.affiliation)}` : ""}</a>${workSessions.has(member.login.toLowerCase()) ? renderPersonWorkSessions(ctx, member.login, workSessions.get(member.login.toLowerCase())) : ""}</li>`).join("")}</ul></div>` : "";
	const other = report.otherActors.length ? `<section class="oc-section">${sectionHeading("Other GitHub actors", "Outside the roster")}<ul class="oc-resource-list">${report.otherActors.map((actor) => `<li class="oc-resource-list-item resource-row"><span class="person-identity">${renderAvatar(actor.login, actor.login, "xs")}<span>@${escapeHtml(actor.login)}</span></span><span>${actor.github.total} GitHub events</span></li>`).join("")}</ul></section>` : "";
	const unmatched = report.unmatchedDiscord.length ? `<section class="oc-section">${sectionHeading("Unmatched Discord authors", "Coverage")}<p class="section-note">These messages count toward Discord totals. No message content is included.</p><ul class="oc-resource-list">${report.unmatchedDiscord.map((actor) => `<li class="oc-resource-list-item resource-row"><span>${escapeHtml(actor.authorId)}</span><span>${actor.messages} messages</span></li>`).join("")}</ul></section>` : "";
	const highlights = summary?.highlights.filter((highlight) => !summary.globalSummary.includes(highlight)) ?? [];
	return shell(ctx, periodTitle(report.period), `<header><div><h1>${escapeHtml(periodTitle(report.period))}</h1><p class="subtitle">Evidence report across ${repositories} GitHub repositories and ${channels} Discord channels for ${escapeHtml(report.orgs.join(", "))}. Roster: ${report.memberCount} people.</p><div class="actions"><a class="oc-action oc-action-ghost" href="${escapeHtml(path)}report.md">Markdown</a><a class="oc-action oc-action-ghost" href="${escapeHtml(path)}data.json">JSON</a></div></div><div class="oc-card oc-summary-metric"><span class="oc-summary-metric-copy"><small>Window</small><strong>${escapeHtml(formatWindow(report.period))}</strong><small>${open ? openPeriodStatus(ctx, entry) : `As of ${relativeTime(ctx, report.generatedAtMs)}`}</small></span></div></header>${partialBanner}${sourceBanners(report, summary)}<section class="oc-summary-strip" aria-label="Report totals">${totals}</section><section class="oc-section">${sectionHeading("Global Summary", "Overview", summary?.source === "model" ? "Model summary" : "Deterministic summary")}<div class="summary-markdown">${summary ? `${markdownBlocks(summary.globalSummary)}${highlights.length ? `<ul>${highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>` : ""}` : `<p>${report.activeMembers} of ${report.memberCount} members recorded ${github.total} GitHub events and ${report.totals.discord.messages} Discord messages in this window.</p>`}</div></section><section class="oc-section">${sectionHeading("Activity Mix", "Hard Numbers")}<div class="oc-summary-strip">${mix}</div><div class="mix-split">${splitMarkup(activitySegments(github, report.totals.discord.messages))}</div><div class="maintainer-distribution"><div class="distribution-heading"><div><div class="oc-eyebrow">Mapped activity</div><h3>Activity by Member</h3></div><p class="section-note">Bar length shows share; colors show activity type</p></div>${distribution(ctx, report.members)}</div></section><section class="oc-section collection-section" data-maintainer-filter-root><div class="oc-section-header people-head"><div><div class="oc-eyebrow">Members</div><h2>Members</h2></div><div class="people-tools js-only"><input class="person-filter oc-input" type="search" autocomplete="off" placeholder="Filter by name or handle" aria-label="Filter members by name, handle, or alias" data-maintainer-filter><div class="filter-status" data-maintainer-filter-status aria-live="polite">showing ${active.length} of ${active.length} active</div></div></div><div class="people">${active.map((member) => personRow(ctx, member, workSessions.get(member.login.toLowerCase()))).join("") || "<div class=\"oc-empty\"><p class=\"oc-empty-description\">No visible GitHub or Discord activity in this window.</p></div>"}</div><div class="oc-empty" hidden data-maintainer-filter-empty><p class="oc-empty-description">No matching member in this report.</p></div>${quietBlock}</section>${other}${unmatched}`, "report");
}
//#endregion
//#region extensions/team-reports/src/render/html.ts
const PERIODS = [
	"day",
	"week",
	"month"
];
const SERIES_LENGTH = {
	day: 28,
	week: 12,
	month: 6
};
const combined = (entry) => entry.githubTotal + entry.discordMessages;
const number = (value) => value.toLocaleString("en-US");
function completenessBadge(ctx, entry) {
	if (entry.status !== "partial") return "";
	if ((ctx.nowMs ?? Date.now()) >= entry.untilMs) return "<span class=\"oc-badge oc-badge-warning partial-report-badge\">Incomplete</span>";
	return entry.period === "day" && isOpen(ctx, entry) && entry.generatedAtMs < entry.untilMs ? "<span class=\"oc-badge oc-badge-info partial-report-badge\">Intraday</span>" : "";
}
function quickTrend(ctx, index, entry) {
	const ascending = index[entry.period].filter((candidate) => candidate.key <= entry.key).toSorted((a, b) => a.key.localeCompare(b.key));
	const values = ascending.slice(-SERIES_LENGTH[entry.period]).map(combined);
	const previous = ascending.at(-2);
	let comparison = previous ? combined(previous) : void 0;
	let label = `prev ${entry.period}`;
	if (previous && entry.period !== "day" && isOpen(ctx, entry) && entry.generatedAtMs < entry.untilMs) {
		const elapsedDays = Math.max(1, Math.ceil((entry.generatedAtMs - entry.sinceMs) / DAY_MS));
		const priorDays = index.day.filter((day) => day.sinceMs >= previous.sinceMs && day.sinceMs < previous.untilMs).toSorted((a, b) => a.key.localeCompare(b.key)).slice(0, elapsedDays);
		if (priorDays.length === elapsedDays) {
			comparison = priorDays.reduce((sum, day) => sum + combined(day), 0);
			label += " to date";
		}
	}
	return `<span class="quick-trend">${deltaMarkup(combined(entry), comparison, label)}${sparklineSvg(values, `Combined activity, last ${values.length} ${entry.period}s`)}</span>`;
}
function quickCard(ctx, index, period) {
	const entry = index[period][0];
	if (!entry) return `<section class="quick-card oc-card"><span class="oc-eyebrow">${period}</span><span class="quick-title">No ${period} reports yet</span><p class="oc-empty">Generate a report to see activity.</p></section>`;
	const open = isOpen(ctx, entry);
	return `<a class="quick-card oc-card oc-card-interactive${entry.status === "partial" ? " partial" : ""}" href="${escapeHtml(href(ctx.basePath, period, entry.key))}"><span class="oc-eyebrow">${open && period === "day" ? "today" : period}</span><span class="quick-title">${escapeHtml(periodTitle(entry))} ${completenessBadge(ctx, entry)}</span><span class="quick-meta">${escapeHtml(formatWindow(entry))}<br>${entry.activeMembers}/${entry.memberCount} active · ${number(entry.githubTotal)} GitHub · ${number(entry.discordMessages)} Discord</span>${openPeriodStatus(ctx, entry)}${quickTrend(ctx, index, entry)}</a>`;
}
function history(ctx, entries, period) {
	const visible = period === "day" ? 7 : 12;
	const slots = period === "month" ? 6 : 12;
	const ascending = entries.toSorted((a, b) => a.key.localeCompare(b.key));
	const rows = entries.map((entry, index) => {
		const position = ascending.findIndex((candidate) => candidate.key === entry.key);
		const window = ascending.slice(Math.max(0, position - slots + 1), position + 1);
		const values = [...Array(slots - window.length).fill(0), ...window.map(combined)];
		const trend = window.length >= 2 ? sparklineSvg(values, `Combined activity through ${entry.key}`) : "";
		const subline = period === "day" ? new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			timeZone: "UTC"
		}).format(entry.sinceMs) : formatWindow(entry);
		return `<a class="row" href="${escapeHtml(href(ctx.basePath, period, entry.key))}"${index >= visible ? " data-extra hidden" : ""}><span><span class="row-title-line"><span class="title">${escapeHtml(periodTitle(entry))}</span>${completenessBadge(ctx, entry)}</span><br><span class="date">${escapeHtml(subline)}</span></span><span class="row-trend" aria-hidden="true">${trend}</span><span class="stats"><strong>${entry.activeMembers}/${entry.memberCount}</strong> active<br>${number(entry.githubTotal)} GitHub / ${number(entry.discordMessages)} Discord</span></a>`;
	}).join("");
	return `<section class="oc-section" id="${period}"><div class="oc-section-header"><div><div class="oc-eyebrow">${period}</div><h2>${period[0]?.toUpperCase()}${period.slice(1)} History</h2></div>${entries.length > visible ? `<button class="toggle oc-action oc-action-ghost js-only" type="button" data-toggle="${period}" aria-expanded="false">Show all ${entries.length}</button>` : ""}</div><div class="list" data-list="${period}">${rows || `<p class="oc-empty">No ${period} reports yet.</p>`}</div></section>`;
}
function homeMetric(label, value) {
	return `<div class="oc-summary-metric"><div class="oc-summary-metric-copy"><small>${escapeHtml(label)}</small><strong>${value}</strong></div></div>`;
}
function renderIndexPage(ctx, index, options) {
	const days = index.day.toSorted((a, b) => a.key.localeCompare(b.key));
	const latestDay = index.day[0];
	const generated = Math.max(0, ...PERIODS.flatMap((period) => index[period].map((entry) => entry.generatedAtMs)));
	const orgs = options.orgs.join(", ");
	const dateline = days.length >= 2 ? `<section class="home-dateline" aria-label="Activity dateline"><div class="oc-eyebrow">dateline</div>${sparklineSvg(days.map(combined), `Combined GitHub and Discord activity across ${days.length} report days`, true)}<div class="home-dateline-scale"><span>${escapeHtml(days[0]?.key ?? "")}</span><span>${days.length} report days</span><span>${escapeHtml(days.at(-1)?.key ?? "")}</span></div></section>` : "";
	const open = PERIODS.filter((period) => index[period][0] && isOpen(ctx, index[period][0]));
	const openBanner = open.length ? banner("info", `<strong class="oc-banner-title">Open reporting windows</strong><p>The current UTC ${open.join(", ")} ${open.length === 1 ? "remains" : "remain"} open. ${open.length === 1 ? "Its total is a snapshot" : "Their totals are snapshots"} and update as new activity arrives.</p>`) : "";
	const health = options.health;
	const lastRun = health.lastRun ? `<span class="oc-badge oc-badge-${health.lastRun.status === "ok" ? "success" : "warning"}">${health.lastRun.status}</span> ${relativeTime(ctx, health.lastRun.finishedAtMs)}` : "—";
	return shell(ctx, "Overview", `<div class="home-grid" aria-label="Report overview"><section class="oc-brand-banner home-banner" data-asset="crab" data-anchor="top" data-effect="fade" data-size="hero"><div class="oc-brand-banner-art" aria-hidden="true"><img src="${escapeHtml(ctx.basePath)}/assets/crab.avif" alt="" draggable="false"></div><div class="oc-brand-banner-content"><p class="oc-eyebrow">${escapeHtml(orgs)} · team</p><h1>Team Reports</h1><p>Daily, weekly, and monthly GitHub and Discord activity for ${escapeHtml(orgs)}. Access is enforced by the Gateway; history is stored by the plugin.</p></div><div class="home-banner-stamp">generated ${generated ? relativeTime(ctx, generated) : "—"}</div></section>${options.workSessions ? renderWorkSessionsPreview(ctx, options.workSessions) : ""}${dateline}${openBanner}${options.latest ? sourceBanners(options.latest.report, options.latest.summary) : ""}${PERIODS.map((period) => quickCard(ctx, index, period)).join("")}<section class="home-card people-teaser oc-card"><div class="home-card-top"><div><div class="oc-eyebrow">people</div><h2>People Archive</h2><p>Activity timelines and repository history by team member.</p></div><div class="home-actions-row"><a class="panel-link oc-action" href="${escapeHtml(ctx.basePath)}/people/">Open people archive <span aria-hidden="true">→</span></a></div></div><div class="oc-summary-strip">${homeMetric("People", latestDay?.memberCount ?? 0)}${homeMetric("Active today", latestDay?.activeMembers ?? 0)}${homeMetric("Report days", days.length)}</div></section><section class="home-card generation-panel oc-card"><div class="home-card-top"><div><div class="oc-eyebrow">runs</div><h2>Generation Status</h2><p>Scheduler and source health.</p></div><div class="home-actions-row"><a class="panel-link oc-action" href="${escapeHtml(ctx.basePath)}/status">Open status JSON <span aria-hidden="true">→</span></a></div></div><div class="oc-summary-strip">${homeMetric("Last run", lastRun)}${homeMetric("Next due", health.nextDueMs === void 0 ? "—" : relativeTime(ctx, health.nextDueMs))}${homeMetric("Source warnings", health.warnings)}</div></section></div><div class="grid">${PERIODS.map((period) => history(ctx, index[period], period)).join("")}</div>`, "home");
}
//#endregion
//#region extensions/team-reports/src/work-sessions.ts
const workSessionSchema = z.object({
	key: z.string(),
	agentId: z.string().optional(),
	displayName: z.string().optional(),
	label: z.string().optional(),
	derivedTitle: z.string().optional(),
	owner: z.object({ actor: z.object({
		type: z.enum([
			"human",
			"agent",
			"system"
		]),
		label: z.string().optional()
	}) }).optional(),
	status: z.enum([
		"queued",
		"running",
		"done",
		"failed",
		"killed",
		"timeout"
	]).optional(),
	projectId: z.string().optional(),
	incognito: z.literal(true).optional()
});
const workSessionsSchema = z.object({
	sessions: z.array(workSessionSchema),
	hasMore: z.boolean().optional(),
	nextOffset: z.number().int().nonnegative().nullable().optional()
});
/** Request-local projection only: never retain one viewer's sessions in the report store. */
async function listWorkSessions(offset = 0, limit = 40, profileId) {
	try {
		const response = await dispatchGatewayMethod("sessions.list", {
			limit,
			offset,
			...profileId ? { profileRelation: {
				profileId,
				relationship: "owned"
			} } : {},
			sortBy: "activity",
			archived: false,
			excludeSubagents: true,
			excludeCron: true,
			excludeSystem: true,
			configuredAgentsOnly: true,
			includeGlobal: false,
			includeUnknown: false,
			includeDerivedTitles: true,
			includeLastMessage: false
		});
		const result = response.ok ? workSessionsSchema.safeParse(response.payload) : void 0;
		if (!result?.success) return { available: false };
		return {
			available: true,
			sessions: result.data.sessions.filter((row) => !row.incognito),
			...result.data.hasMore && result.data.nextOffset != null ? { nextOffset: result.data.nextOffset } : {}
		};
	} catch {
		return { available: false };
	}
}
const profilesSchema = z.object({ profiles: z.array(z.object({
	id: z.string(),
	mergedInto: z.string().nullable(),
	githubIdentity: z.object({ login: z.string() }).nullable()
})) });
function resolveOwner(profiles, aliases) {
	const byId = new Map(profiles.map((profile) => [profile.id, profile]));
	const logins = new Set(aliases.map((alias) => alias.toLowerCase()));
	const owners = /* @__PURE__ */ new Set();
	for (const profile of profiles) {
		if (!profile.githubIdentity || !logins.has(profile.githubIdentity.login.toLowerCase())) continue;
		let canonical = profile;
		const visited = /* @__PURE__ */ new Set();
		while (canonical?.mergedInto) {
			if (visited.has(canonical.id)) return { reason: "ambiguous" };
			visited.add(canonical.id);
			canonical = byId.get(canonical.mergedInto);
		}
		if (!canonical) return { reason: "ambiguous" };
		owners.add(canonical.id);
	}
	const [profileId] = owners;
	return !profileId ? { reason: "unlinked" } : owners.size === 1 ? { profileId } : { reason: "ambiguous" };
}
/** Instantiate once per HTTP request; identities and per-owner reads never cross viewers. */
function createPersonWorkSessions(workSessions) {
	let profiles;
	const pages = /* @__PURE__ */ new Map();
	const loadProfiles = async () => {
		try {
			const response = await dispatchGatewayMethod("users.list", {});
			const result = response.ok ? profilesSchema.safeParse(response.payload) : void 0;
			return result?.success ? result.data.profiles : void 0;
		} catch {
			return;
		}
	};
	return async (person, offset = 0, limit = 3) => {
		const identities = await (profiles ??= loadProfiles());
		if (!identities) return { available: false };
		const owner = resolveOwner(identities, person.github);
		if ("reason" in owner) return {
			available: false,
			reason: owner.reason
		};
		const key = JSON.stringify([
			owner.profileId,
			offset,
			limit
		]);
		let page = pages.get(key);
		if (!page) {
			page = workSessions(offset, limit, owner.profileId);
			pages.set(key, page);
		}
		return page;
	};
}
/** Bound concurrent per-member dispatches; each owner needs only one small preview page. */
async function listMemberWorkSessions(people, list) {
	const result = /* @__PURE__ */ new Map();
	let next = 0;
	await Promise.all(Array.from({ length: Math.min(4, people.length) }, async () => {
		for (let index = next++; index < people.length; index = next++) {
			const person = people[index];
			result.set((person.github[0] ?? "").toLowerCase(), await list(person));
		}
	}));
	return result;
}
//#endregion
//#region extensions/team-reports/src/http.ts
const assets = /* @__PURE__ */ new Map();
function readAsset(assetsDir, name) {
	let asset = assets.get(name);
	if (!asset) {
		asset = readFileSync(join(assetsDir, name));
		assets.set(name, asset);
	}
	return asset;
}
const KEY_PATTERNS = {
	day: /^\d{4}-\d{2}-\d{2}$/,
	week: /^\d{4}-W\d{2}$/,
	month: /^\d{4}-\d{2}$/
};
function pathSegments(rawUrl, basePath) {
	const path = rawUrl.split("?")[0] ?? "";
	if (path !== basePath && !path.startsWith(`${basePath}/`)) return;
	const segments = path.slice(basePath.length).split("/").slice(1);
	if (segments.at(-1) === "") segments.pop();
	if (segments.some((segment) => !/^[A-Za-z0-9._-]+$/.test(segment) || segment === "." || segment === "..")) return;
	return {
		path,
		segments
	};
}
function absolutePageUrl(req, path) {
	const host = req.headers.host;
	if (!host || !/^(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:]+\])(?::\d{1,5})?$/.test(host)) return;
	const secure = req.socket instanceof TLSSocket || req.headers["x-forwarded-proto"] === "https";
	try {
		return new URL(path, `${secure ? "https" : "http"}://${host}`).href;
	} catch {
		return;
	}
}
function personFromReport(member) {
	return {
		github: [member.login, ...member.aliases],
		display: member.display,
		affiliation: member.affiliation,
		roleGroup: member.roleGroup,
		roleLabel: member.roleLabel,
		access: member.access,
		areas: member.areas
	};
}
function visiblePeople(configured, recentReports) {
	const aliases = new Set(configured.flatMap((person) => person.github.map((login) => login.toLowerCase())));
	const result = [...configured];
	for (const member of recentReports) {
		if (aliases.has(member.login.toLowerCase())) continue;
		const person = personFromReport(member);
		result.push(person);
		for (const login of person.github) aliases.add(login.toLowerCase());
	}
	return result.toSorted((a, b) => (a.display ?? a.github[0] ?? "").localeCompare(b.display ?? b.github[0] ?? ""));
}
function createTeamReportsHttpHandler(options) {
	return async (req, res) => {
		const nonce = randomBytes(16).toString("base64url");
		const send = async (status, contentType, body, headers = {}) => {
			await getPluginRuntimeGatewayRequestScope()?.revalidate?.();
			res.writeHead(status, {
				"Content-Type": typeof body === "string" ? `${contentType}; charset=utf-8` : contentType,
				"Content-Length": Buffer.byteLength(body),
				"Cache-Control": "private, no-store",
				"Content-Security-Policy": `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; img-src 'self' https://avatars.githubusercontent.com data:; base-uri 'none'; form-action 'none'`,
				"X-Content-Type-Options": "nosniff",
				"Referrer-Policy": "no-referrer",
				...headers
			});
			res.end(req.method === "HEAD" ? void 0 : body);
			return true;
		};
		const notFound = () => send(404, "text/plain", "Not found\n");
		if (req.method !== "GET" && req.method !== "HEAD") return send(405, "text/plain", "Method not allowed\n", { Allow: "GET, HEAD" });
		if (!(getPluginRuntimeGatewayRequestScope()?.client?.connect?.scopes ?? []).some((scope) => scope === "operator.read" || scope === "operator.write" || scope === "operator.admin")) return send(403, "text/plain", "Forbidden: operator.read scope required.\n");
		const route = pathSegments(req.url ?? "", options.basePath);
		if (!route) return notFound();
		const [first, key, format] = route.segments;
		if (first === "assets") {
			if (route.segments.length !== 2 || key !== "crab.avif" && key !== "icon.png") return notFound();
			return send(200, key === "crab.avif" ? "image/avif" : "image/png", readAsset(options.assetsDir, key), { "Cache-Control": "private, max-age=86400" });
		}
		const store = options.getStore();
		if (!store) return send(503, "text/plain", "Team Reports is not running. Check plugin configuration and reload the plugin.\n");
		const json = (body) => send(200, "application/json", JSON.stringify(body));
		if (first === "status" && route.segments.length === 1) return json(await options.status());
		const index = async () => ({
			day: await store.listPeriods({
				period: "day",
				limit: 400
			}),
			week: await store.listPeriods({
				period: "week",
				limit: 60
			}),
			month: await store.listPeriods({
				period: "month",
				limit: 60
			})
		});
		if (first === "latest" && route.segments.length === 1) {
			const closed = (await store.listPeriods({
				period: "day",
				status: "closed",
				limit: 1
			}))[0];
			if (closed) return send(302, "text/plain", "Redirecting to the latest closed day.\n", { Location: `${options.basePath}/day/${closed.key}/` });
			return notFound();
		}
		if (first === "index.json" && route.segments.length === 1) {
			const periods = await index();
			return json({
				latest: {
					day: periods.day[0]?.key ?? null,
					week: periods.week[0]?.key ?? null,
					month: periods.month[0]?.key ?? null
				},
				periods
			});
		}
		const absoluteUrl = absolutePageUrl(req, route.path);
		if (!absoluteUrl) return send(400, "text/plain", "A valid Host header is required.\n");
		const ctx = {
			basePath: options.basePath,
			displayTimezone: options.displayTimezone,
			...options.sessionRouting(),
			nonce,
			absoluteUrl
		};
		const html = (body) => send(200, "text/html", body);
		const personWorkSessions = createPersonWorkSessions(options.workSessions);
		if (first === "sessions" && route.segments.length === 1) {
			const rawOffset = new URL(req.url ?? "", absoluteUrl).searchParams.get("offset") ?? "0";
			const offset = Number(rawOffset);
			if (!/^\d+$/.test(rawOffset) || !Number.isSafeInteger(offset)) return send(400, "text/plain", "Invalid session page offset.\n");
			const login = new URL(req.url ?? "", absoluteUrl).searchParams.get("person") || void 0;
			let person;
			if (login) {
				const latest = await store.latestPeople();
				person = visiblePeople(options.people(), latest?.members ?? []).find((candidate) => candidate.github.some((alias) => alias.toLowerCase() === login.toLowerCase())) ?? { github: [login] };
			}
			return html(renderWorkSessionsPage(ctx, person ? await personWorkSessions(person, offset, 40) : await options.workSessions(offset, 40), offset, person?.github[0]));
		}
		if (route.segments.length === 0) {
			const periods = await index();
			const latest = periods.day[0];
			const stored = latest ? await store.getPeriodDocument("day", latest.key) : void 0;
			return html(renderIndexPage(ctx, periods, {
				orgs: stored?.report.orgs ?? options.orgs(),
				latest: stored,
				health: await options.health(),
				workSessions: await options.workSessions(0, 8)
			}));
		}
		if (first === "people" && route.segments.length <= 2) {
			const latest = await store.latestPeople();
			const people = visiblePeople(options.people(), latest?.members ?? []);
			if (!key) {
				const endKey = latest?.key ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
				const since = (/* @__PURE__ */ new Date(Date.parse(`${endKey}T00:00:00Z`) - 27 * DAY_MS)).toISOString().slice(0, 10);
				return html(renderPeoplePage(ctx, people, await store.listPersonDaysSince(since), endKey));
			}
			const person = people.find((candidate) => candidate.github.some((login) => login.toLowerCase() === key.toLowerCase()));
			const login = person?.github[0] ?? key;
			const days = await store.listPersonDays(login, { limit: 400 });
			if (!person && days.length === 0) return notFound();
			const member = person ?? { github: [key] };
			return html(renderPersonPage(ctx, member, days, await personWorkSessions(member)));
		}
		if ((first === "day" || first === "week" || first === "month") && key && route.segments.length <= 3) {
			if (!KEY_PATTERNS[first].test(key) || format !== void 0 && format !== "report.md" && format !== "data.json") return notFound();
			try {
				describePeriod(first, key);
			} catch {
				return notFound();
			}
			if (format === "report.md") {
				const stored = await store.getPeriod(first, key);
				return stored ? send(200, "text/markdown", stored.markdown) : notFound();
			}
			const stored = await store.getPeriodDocument(first, key);
			if (!stored) return notFound();
			if (format === "data.json") return json(stored.report);
			const configured = options.people();
			const workSessions = await listMemberWorkSessions(stored.report.members.map((member) => {
				const person = personFromReport(member);
				const aliases = new Set(person.github.map((login) => login.toLowerCase()));
				const matches = configured.filter((entry) => entry.github.some((login) => aliases.has(login.toLowerCase())));
				return {
					...person,
					github: [...person.github, ...matches.flatMap((entry) => entry.github)]
				};
			}), personWorkSessions);
			return html(renderReportPage(ctx, stored.report, stored.summary, (await store.listPeriods({
				period: first,
				limit: 400
			})).filter((entry) => entry.key <= key), workSessions));
		}
		return notFound();
	};
}
//#endregion
//#region extensions/team-reports/src/store.ts
var TeamReportsStore = class {
	constructor(worker) {
		this.worker = worker;
		this.closed = false;
	}
	async execute(type, input) {
		if (this.closed) throw new Error("Team Reports store is closed.");
		return this.worker.execute({
			type,
			input
		});
	}
	upsertPeriod(value) {
		return this.execute("upsertPeriod", value);
	}
	getPeriod(period, key) {
		return this.execute("getPeriod", {
			period,
			key
		});
	}
	getPeriodDocument(period, key) {
		return this.execute("getPeriodDocument", {
			period,
			key
		});
	}
	listPeriods(options = {}) {
		return this.execute("listPeriods", options);
	}
	latestSourceWarnings() {
		return this.execute("latestSourceWarnings", void 0);
	}
	latestPeople() {
		return this.execute("latestPeople", void 0);
	}
	getDayReports(sinceMs, untilMs) {
		return this.execute("getDayReports", {
			sinceMs,
			untilMs
		});
	}
	listPersonDays(login, options = {}) {
		return this.execute("listPersonDays", {
			login,
			options
		});
	}
	listPersonDaysSince(since) {
		return this.execute("listPersonDaysSince", since);
	}
	startRun(run) {
		return this.execute("startRun", run);
	}
	finishRun(id, result) {
		return this.execute("finishRun", {
			id,
			result
		});
	}
	listRuns(limit = 20, filter = {}) {
		return this.execute("listRuns", {
			limit,
			filter
		});
	}
	prune(retentionDays, nowMs = Date.now()) {
		return this.execute("prune", {
			retentionDays,
			nowMs
		});
	}
	close() {
		this.closed = true;
		return this.worker.close();
	}
};
async function createTeamReportsStore(options) {
	const databasePath = options.dbPath ?? path.join(options.stateDir ?? resolveStateDir(), "plugins", "team-reports", "team-reports.sqlite");
	return new TeamReportsStore(await openSqliteWorkerStore({
		moduleUrl: options.workerModuleUrl,
		databasePath,
		input: void 0
	}));
}
//#endregion
export { countDescription as a, ITEM_LABELS as i, createTeamReportsHttpHandler as n, memberSummary as o, listWorkSessions as r, safeExternalUrl as s, createTeamReportsStore as t };
