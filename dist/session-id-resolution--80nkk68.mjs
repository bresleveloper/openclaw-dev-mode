import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as toAgentRequestSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/sessions/session-id-resolution.ts
function newestFirst([, a], [, b]) {
	return (b?.updatedAt ?? 0) - (a?.updatedAt ?? 0);
}
function resolveSessionIdMatchSelection(matches, sessionId) {
	if (matches.length === 0) return { kind: "none" };
	const aliases = /* @__PURE__ */ new Map();
	for (const match of matches) {
		const key = normalizeLowercaseStringOrEmpty(toAgentRequestSessionKey(match[0]) ?? match[0]);
		const group = aliases.get(key) ?? [];
		group.push(match);
		aliases.set(key, group);
	}
	const normalizedId = normalizeLowercaseStringOrEmpty(sessionId);
	const canonical = [];
	const structural = [];
	for (const [requestKey, group] of aliases) {
		const selected = group.toSorted((a, b) => {
			const timeDiff = newestFirst(a, b);
			if (timeDiff !== 0) return timeDiff;
			const left = normalizeLowercaseStringOrEmpty(a[0]);
			const right = normalizeLowercaseStringOrEmpty(b[0]);
			const leftCanonical = a[0] === left;
			return leftCanonical !== (b[0] === right) ? leftCanonical ? -1 : 1 : left < right ? -1 : left > right ? 1 : 0;
		})[0];
		canonical.push(selected);
		if (normalizeLowercaseStringOrEmpty(selected[0]).endsWith(`:${normalizedId}`) || requestKey === normalizedId || requestKey.endsWith(`:${normalizedId}`)) structural.push(selected);
	}
	const candidates = structural.length > 0 ? structural : canonical;
	const [freshest, second] = candidates.toSorted(newestFirst);
	return candidates.length === 1 || (freshest?.[1]?.updatedAt ?? 0) > (second?.[1]?.updatedAt ?? 0) ? {
		kind: "selected",
		sessionKey: freshest[0]
	} : {
		kind: "ambiguous",
		sessionKeys: candidates.map(([key]) => key)
	};
}
function resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId) {
	const selection = resolveSessionIdMatchSelection(matches, sessionId);
	return selection.kind === "selected" ? selection.sessionKey : void 0;
}
//#endregion
export { resolveSessionIdMatchSelection as n, resolvePreferredSessionKeyForSessionIdMatches as t };
