import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/shared/node-match.ts
/** Normalizes human node names into stable lookup keys for fuzzy CLI/API matching. */
function normalizeNodeKey(value) {
	return normalizeLowercaseStringOrEmpty(value.normalize("NFC")).replace(/(?=\p{M})\p{Emoji_Component}/gu, "").replace(/(?<![\p{L}\p{M}\p{N}])\p{M}+/gu, "").replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+/, "").replace(/-+$/, "");
}
function listKnownNodes(nodes) {
	return nodes.map((n) => n.displayName || n.remoteIp || n.nodeId).filter(Boolean).join(", ");
}
function formatNodeCandidateLabel(node) {
	const label = node.displayName || node.remoteIp || node.nodeId;
	const details = [`node=${node.nodeId}`];
	const clientId = normalizeOptionalString(node.clientId);
	if (clientId) details.push(`client=${clientId}`);
	return `${label} [${details.join(", ")}]`;
}
function isCurrentOpenClawClient(clientId) {
	return (normalizeOptionalLowercaseString(clientId) ?? "").startsWith("openclaw-");
}
function isLegacyClawdbotClient(clientId) {
	const normalized = normalizeOptionalLowercaseString(clientId) ?? "";
	return normalized.startsWith("clawdbot-") || normalized.startsWith("moldbot-");
}
function pickPreferredLegacyMigrationMatch(matches) {
	const current = matches.filter((match) => isCurrentOpenClawClient(match.clientId));
	if (current.length !== 1) return;
	const legacyCount = matches.filter((match) => isLegacyClawdbotClient(match.clientId)).length;
	if (legacyCount === 0 || current.length + legacyCount !== matches.length) return;
	return current[0];
}
function resolveMatchScore(node, query, queryNormalized, queryCompact) {
	const name = typeof node.displayName === "string" ? node.displayName : "";
	const nameNormalized = name ? normalizeNodeKey(name) : "";
	if (nameNormalized && nameNormalized === queryNormalized) return 2e3;
	if (queryCompact !== void 0 && nameNormalized && nameNormalized.replace(/-/g, "") === queryCompact) return 1900;
	if (query.length >= 6 && node.nodeId.startsWith(query)) return 1e3;
	return 0;
}
/** Resolves a single node id or throws an operator-readable unknown/ambiguous-node error. */
function resolveNodeIdFromCandidates(nodes, query, allowCompactDisplayName = false) {
	const q = query.trim();
	if (!q) throw new Error("node required");
	let strongestMatches = nodes.filter((node) => node.nodeId === q);
	if (strongestMatches.length === 0) strongestMatches = nodes.filter((node) => node.remoteIp === q);
	if (strongestMatches.length === 0) {
		const normalized = normalizeNodeKey(q);
		const compact = allowCompactDisplayName ? normalized.replace(/-/g, "") : void 0;
		let topMatchScore = 0;
		nodes.forEach((node) => {
			const score = resolveMatchScore(node, q, normalized, compact);
			if (score > topMatchScore) {
				topMatchScore = score;
				strongestMatches.length = 0;
			}
			if (score > 0 && score === topMatchScore) strongestMatches.push(node);
		});
	}
	if (strongestMatches.length === 0) {
		const known = listKnownNodes(nodes);
		throw new Error(`unknown node: ${q}${known ? ` (known: ${known})` : ""}`);
	}
	const connectedMatches = strongestMatches.filter((match) => match.connected === true);
	const matches = connectedMatches.length > 0 ? connectedMatches : strongestMatches;
	if (matches.length === 1) return matches[0]?.nodeId ?? "";
	const preferred = pickPreferredLegacyMigrationMatch(matches);
	if (preferred) return preferred.nodeId;
	throw new Error(`ambiguous node: ${q} (matches: ${matches.map(formatNodeCandidateLabel).join(", ")})`);
}
//#endregion
//#region src/shared/node-resolve.ts
/** Resolves a user query to a node id, optionally using a caller-defined blank-query default. */
function resolveNodeIdFromNodeList(nodes, query, options = {}) {
	const q = normalizeOptionalString(query) ?? "";
	if (!q) {
		if (options.allowDefault === true && options.pickDefaultNode) {
			const picked = options.pickDefaultNode(nodes);
			if (picked) return picked.nodeId;
		}
		throw new Error("node required");
	}
	return resolveNodeIdFromCandidates(nodes, q, options.allowCompactDisplayName);
}
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
function resolveNodeFromNodeList(nodes, query, options = {}) {
	const nodeId = resolveNodeIdFromNodeList(nodes, query, options);
	return nodes.find((node) => node.nodeId === nodeId) ?? { nodeId };
}
function formatNodeIdList(nodes) {
	return nodes.length > 0 ? nodes.map((node) => node.nodeId).toSorted().join(", ") : "none";
}
/**
* Resolves a capability-gated node from the full node list. Exact ids are
* checked before eligible-name resolution so an ineligible id cannot redirect
* to an eligible node that shares its display name.
*/
function resolveEligibleNodeFromList(nodes, query, isEligible, messages) {
	const eligible = nodes.filter(isEligible);
	const trimmed = query?.trim();
	if (trimmed) {
		const lowerTrimmed = trimmed.toLowerCase();
		const exactNode = nodes.find((node) => node.nodeId === trimmed) ?? nodes.find((node) => node.nodeId.toLowerCase() === lowerTrimmed);
		if (exactNode) {
			if (!isEligible(exactNode)) throw new Error(messages.ineligibleExact(trimmed, formatNodeIdList(eligible)));
			return exactNode;
		}
		try {
			const nodeId = resolveNodeIdFromNodeList(eligible, trimmed);
			const match = eligible.find((node) => node.nodeId === nodeId);
			if (match) return match;
		} catch (error) {
			throw new Error(messages.nameResolveFailed(formatErrorMessage(error), formatNodeIdList(eligible)), { cause: error });
		}
		throw new Error(`node not found: ${trimmed}`);
	}
	const only = eligible.length === 1 ? eligible.at(0) : void 0;
	if (only) return only;
	if (eligible.length === 0) throw new Error(messages.noneEligible());
	throw new Error(messages.multipleEligible(eligible));
}
//#endregion
export { resolveNodeFromNodeList as n, resolveNodeIdFromNodeList as r, resolveEligibleNodeFromList as t };
