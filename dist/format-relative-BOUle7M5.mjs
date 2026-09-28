import "./src-CZ2wJvNB.mjs";
import { t as bucketRelativeTimeMs } from "./format-C1IjPxxo.mjs";
//#region src/infra/format-time/format-relative.ts
/**
* Centralized relative-time formatting utilities.
*
* Consolidates 7+ scattered implementations (formatAge, formatAgeShort, formatAgo,
* formatRelativeTime, formatElapsedTime) into two functions:
*
* - `formatTimeAgo(durationMs)` — format a duration as "5m ago" / "5m" (for known elapsed time)
* - `formatRelativeTimestamp(epochMs)` — format an epoch timestamp relative to now (handles future)
*/
/**
* Format a duration (in ms) as a human-readable relative time.
*
* Input: how many milliseconds ago something happened.
*
* With suffix (default):  "just now", "5m ago", "3h ago", "2d ago"
* Without suffix:         "0s", "5m", "3h", "2d"
*/
function formatTimeAgo(durationMs, options) {
	const suffix = options?.suffix !== false;
	const fallback = options?.fallback ?? "unknown";
	if (durationMs == null || !Number.isFinite(durationMs) || durationMs < 0) return fallback;
	const totalSeconds = Math.round(durationMs / 1e3);
	const minutes = Math.round(totalSeconds / 60);
	if (minutes < 1) return suffix ? "just now" : `${totalSeconds}s`;
	if (minutes < 60) return suffix ? `${minutes}m ago` : `${minutes}m`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return suffix ? `${hours}h ago` : `${hours}h`;
	const days = Math.round(hours / 24);
	return suffix ? `${days}d ago` : `${days}d`;
}
/**
* Format an epoch timestamp relative to now.
*
* Handles both past ("5m ago") and future ("in 5m") timestamps.
* Optionally falls back to a short date for timestamps older than 7 days.
*/
function formatRelativeTimestamp(timestampMs, options) {
	const fallback = options?.fallback ?? "n/a";
	if (timestampMs == null || !Number.isFinite(timestampMs)) return fallback;
	const diff = Date.now() - timestampMs;
	const absDiff = Math.abs(diff);
	const isPast = diff >= 0;
	const { value, unit } = bucketRelativeTimeMs(absDiff);
	if (unit === "second") return isPast ? "just now" : "in <1m";
	if (unit === "minute") return isPast ? `${value}m ago` : `in ${value}m`;
	if (unit === "hour") return isPast ? `${value}h ago` : `in ${value}h`;
	if (!options?.dateFallback || value <= 7) return isPast ? `${value}d ago` : `in ${value}d`;
	try {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			...options.timezone ? { timeZone: options.timezone } : {}
		}).format(new Date(timestampMs));
	} catch {
		return `${value}d ago`;
	}
}
//#endregion
export { formatTimeAgo as n, formatRelativeTimestamp as t };
