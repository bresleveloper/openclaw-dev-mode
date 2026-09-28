import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatRelativeTimestamp } from "./format-relative-BOUle7M5.mjs";
import { t as TUI_RECENT_SESSIONS_ACTIVE_MINUTES } from "./tui-session-list-policy-D_1yGPvY.mjs";
import { fuzzyFilter } from "@earendil-works/pi-tui";
//#region src/tui/tui-session-picker.ts
/** Load the same bounded recent-session window used by the TUI Ctrl+P picker. */
async function loadRecentSessions(client, options = {}) {
	return (await client.listSessions({
		limit: 50,
		activeMinutes: TUI_RECENT_SESSIONS_ACTIVE_MINUTES,
		includeGlobal: options.includeGlobal ?? false,
		includeUnknown: false,
		includeDerivedTitles: true,
		includeLastMessage: true,
		...options.agentId ? { agentId: options.agentId } : {}
	})).sessions;
}
/** Build labels and matching text for recent-session pickers. */
function buildSessionChoices(sessions) {
	return sessions.map((session) => {
		const title = session.derivedTitle ?? session.displayName;
		const formattedKey = formatSessionKey(session.key);
		const label = title && title !== formattedKey ? `${title} (${formattedKey})` : formattedKey;
		const timePart = session.updatedAt ? formatRelativeTimestamp(session.updatedAt, {
			dateFallback: true,
			fallback: ""
		}) : "";
		const preview = session.lastMessagePreview?.replace(/\s+/g, " ").trim();
		const description = timePart && preview ? `${timePart} · ${preview}` : preview ?? timePart;
		const searchableNames = [
			session.derivedTitle,
			session.displayName,
			session.label,
			session.subject,
			session.sessionId,
			session.key
		].filter((value) => Boolean(value));
		return {
			value: session.key,
			label,
			description,
			searchText: [...searchableNames, session.lastMessagePreview].filter(Boolean).join(" "),
			matchText: searchableNames.join(" ")
		};
	});
}
/** Resolve a recent session by exact key, unique substring, then TUI-style fuzzy matching. */
function resolveResumeSession(sessions, query) {
	const trimmedQuery = query.trim();
	const normalizedQuery = normalizeLowercaseStringOrEmpty(trimmedQuery);
	const choices = buildSessionChoices(sessions);
	const exact = choices.find((choice) => choice.value === trimmedQuery);
	if (exact) return {
		kind: "match",
		session: exact
	};
	const substringMatches = choices.filter((choice) => normalizeLowercaseStringOrEmpty(choice.matchText).includes(normalizedQuery));
	const matches = substringMatches.length > 0 ? substringMatches : fuzzyFilter(choices, trimmedQuery, (choice) => choice.matchText);
	const match = matches[0];
	if (matches.length === 1 && match) return {
		kind: "match",
		session: match
	};
	if (matches.length > 1) return {
		kind: "ambiguous",
		candidates: matches
	};
	return { kind: "none" };
}
function formatSessionKey(key) {
	return parseAgentSessionKey(key)?.rest ?? key;
}
//#endregion
export { loadRecentSessions as n, resolveResumeSession as r, buildSessionChoices as t };
