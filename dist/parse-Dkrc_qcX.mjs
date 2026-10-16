import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as normalizeControlUiBasePath, l as parseShortSessionRef, s as isReservedSessionRest } from "./src-D0qIyKKg.mjs";
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
		if (restSegments.length === 0 || !restSegments.every((segment) => segment !== null)) return null;
		const sessionKey = `agent:${agentId}:${restSegments.join(":")}`;
		if (forceLiteral || restSegments.length !== 1) return {
			namespace,
			kind: "literal",
			agentId,
			sessionKey
		};
		const segment = restSegments[0] ?? "";
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
