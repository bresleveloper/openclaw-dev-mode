import "./src-Djeo9OvP.mjs";
import { t as bucketRelativeTimeMs } from "./format-C1IjPxxo.mjs";
//#region src/infra/format-time/format-relative.ts
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
	const hours = Math.round(minutes / 60);
	const label = minutes < 60 ? `${minutes}m` : hours < 48 ? `${hours}h` : `${Math.round(hours / 24)}d`;
	return suffix ? `${label} ago` : label;
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
	const relative = isPast ? `${value}${unit[0]} ago` : `in ${value}${unit[0]}`;
	if (unit !== "day" || !options?.dateFallback || value <= 7) return relative;
	try {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			...options.timezone ? { timeZone: options.timezone } : {}
		}).format(new Date(timestampMs));
	} catch {
		return relative;
	}
}
//#endregion
export { formatTimeAgo as n, formatRelativeTimestamp as t };
