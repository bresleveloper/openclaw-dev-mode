//#region src/config/sessions/session-involvement.ts
function isNewerSessionMention(source, previous) {
	return source.generation === previous.generation ? source.sequence > previous.sequence : source.timestamp > previous.timestamp;
}
/** Profile merges combine mention evidence independently of the latest personal choice. */
function mergeSessionProfileInvolvement(states) {
	let latest;
	let lastMention;
	for (const state of states) {
		if (!state) continue;
		if (!latest || state.updatedAt > latest.updatedAt || state.updatedAt === latest.updatedAt && state.hidden) latest = state;
		if (state.lastMention && (!lastMention || isNewerSessionMention(state.lastMention, lastMention))) lastMention = state.lastMention;
	}
	return latest ? {
		...latest,
		...lastMention ? { lastMention } : {}
	} : void 0;
}
//#endregion
export { mergeSessionProfileInvolvement as n, isNewerSessionMention as t };
