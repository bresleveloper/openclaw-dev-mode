import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { i as parseShortSessionRef, n as isReservedSessionRest, r as normalizeControlUiBasePath } from "./grammar-Dp605oVy.mjs";
import "./src-Da9425In.mjs";
//#region packages/session-url-contract/src/parse.ts
function normalizePath(path) {
	const trimmed = path.trim();
	if (!trimmed) return "/";
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
function decodePathSegment(segment) {
	if (segment === "~dot") return ".";
	if (segment === "~dotdot") return "..";
	try {
		return decodeURIComponent(segment.startsWith("~~") ? segment.slice(1) : segment) || null;
	} catch {
		return null;
	}
}
function literalSessionKey(agentId, restSegments) {
	const normalizedAgentId = normalizeNullableString(agentId);
	if (!normalizedAgentId || restSegments.length === 0 || restSegments.some((segment) => !segment)) return null;
	return `agent:${normalizeAgentId(normalizedAgentId)}:${restSegments.join(":")}`;
}
function parseControlUiSessionPath(pathname, basePath = "", mainKey) {
	const normalizedPath = normalizePath(pathname);
	for (const namespace of ["chat", "dashboard"]) {
		const prefix = `${normalizeControlUiBasePath(basePath)}/${namespace}/`;
		if (!normalizedPath.startsWith(prefix)) continue;
		const rawSegments = normalizedPath.slice(prefix.length).split("/");
		const rawAgentId = decodePathSegment(rawSegments[0] ?? "");
		if (!rawAgentId) return null;
		const agentId = normalizeAgentId(rawAgentId);
		if (rawSegments.length === 1) return {
			namespace,
			kind: "main",
			agentId
		};
		const forceLiteral = rawSegments[1] === "~key";
		const restSegments = rawSegments.slice(forceLiteral ? 2 : 1).map(decodePathSegment);
		if (restSegments.some((segment) => segment === null)) return null;
		const literalRestSegments = restSegments;
		const sessionKey = literalSessionKey(agentId, literalRestSegments);
		if (!sessionKey) return null;
		if (forceLiteral) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		if (literalRestSegments.length !== 1) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		const segment = literalRestSegments[0] ?? "";
		if (isReservedSessionRest(segment, mainKey)) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		const shortRef = parseShortSessionRef(segment);
		if (!shortRef) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey,
			slugCandidate: segment
		};
		return {
			namespace,
			kind: "short",
			agentId,
			literalSessionKey: sessionKey,
			...shortRef
		};
	}
	return null;
}
//#endregion
export { parseControlUiSessionPath as t };
