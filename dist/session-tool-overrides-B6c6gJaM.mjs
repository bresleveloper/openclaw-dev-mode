import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
//#region src/config/sessions/session-tool-overrides.ts
function normalizeMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function normalizeSessionToolOverrides(raw) {
	if (!raw) return;
	const normalizeBooleanMap = (value) => {
		const entries = Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
		return entries.length > 0 ? Object.fromEntries(entries) : void 0;
	};
	const mcpToolsDeny = normalizeMcpToolDenials(raw.mcpToolsDeny);
	const mcpServers = normalizeBooleanMap(raw.mcpServers);
	const skills = normalizeBooleanMap(raw.skills);
	const normalized = {
		...mcpServers ? { mcpServers } : {},
		...mcpToolsDeny ? { mcpToolsDeny } : {},
		...skills ? { skills } : {},
		...raw.webSearch === false ? { webSearch: false } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Compare sparse tool policy overlays by their canonical stored meaning. */
function sessionToolOverridesEqual(left, right) {
	return stableStringify(normalizeSessionToolOverrides(left)) === stableStringify(normalizeSessionToolOverrides(right));
}
/** Retained enables require both owners; either owner can deny a capability. */
function intersectSessionToolOverrides(retained, current) {
	const intersectMap = (left = {}, right = {}) => Object.fromEntries([.../* @__PURE__ */ new Set([...Object.keys(left), ...Object.keys(right)])].flatMap((key) => left[key] === false || right[key] === false ? [[key, false]] : left[key] === true && right[key] === true ? [[key, true]] : []));
	const deniedServers = /* @__PURE__ */ new Set([...Object.keys(retained?.mcpToolsDeny ?? {}), ...Object.keys(current?.mcpToolsDeny ?? {})]);
	return normalizeSessionToolOverrides({
		mcpServers: intersectMap(retained?.mcpServers, current?.mcpServers),
		skills: intersectMap(retained?.skills, current?.skills),
		mcpToolsDeny: Object.fromEntries([...deniedServers].map((server) => [server, [...retained?.mcpToolsDeny?.[server] ?? [], ...current?.mcpToolsDeny?.[server] ?? []]])),
		webSearch: retained?.webSearch === false || current?.webSearch === false ? false : void 0
	});
}
//#endregion
export { sessionToolOverridesEqual as i, normalizeMcpToolDenials as n, normalizeSessionToolOverrides as r, intersectSessionToolOverrides as t };
