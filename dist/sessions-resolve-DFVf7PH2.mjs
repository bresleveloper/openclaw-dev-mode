import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as SHORT_SESSION_ID_RE, o as controlUiSessionSlug, t as SESSION_UUID_SUFFIX_RE } from "./src-D0qIyKKg.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { c as invalidSessionRequest, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as resolveSessionStoreKey } from "./session-store-key-Ci099tm9.mjs";
import { o as resolveLegacyFreeAcpSessionKey } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { r as readAcpSessionMetaBatch } from "./session-meta-DUw-8Na0.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution--80nkk68.mjs";
import { V as resolveGatewaySessionDisplayName, i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { c as resolveDeletedAgentIdFromSessionKey } from "./session-utils-store-DrLraxiU.mjs";
import { n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-BVt5saXn.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-BYWh0eAO.mjs";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.mjs";
import { i as prepareSessionRowSelection, t as filterAndSortSessionEntries } from "./session-utils-list-DnMUHvjc.mjs";
//#region src/gateway/sessions-resolve.ts
function resolveSessionVisibilityFilterOptions(p) {
	return {
		includeGlobal: p.includeGlobal === true,
		includeUnknown: p.includeUnknown === true,
		spawnedBy: p.spawnedBy,
		agentId: p.agentId
	};
}
function noSessionFoundResult(params) {
	if (params.p.allowMissing) return {
		ok: true,
		missing: true
	};
	return invalidSessionRequest(params.message);
}
/** Rejects sessions whose owning agent no longer exists in config (#65524). */
function validateSessionAgentExists(cfg, key, entry, acpMeta) {
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, key, entry, { acpMeta });
	if (deletedAgentId === null) return null;
	return invalidSessionRequest(`Agent "${deletedAgentId}" no longer exists in configuration`);
}
function normalizeShortSessionId(shortId) {
	return SHORT_SESSION_ID_RE.test(shortId) ? shortId.toLowerCase() : null;
}
function sessionResolveCandidate(key, entry, agentId) {
	const displayName = resolveGatewaySessionDisplayName(key, entry);
	return {
		key,
		agentId: normalizeAgentId(agentId),
		...displayName ? { displayName } : {},
		...entry.boardFace ? { boardFace: entry.boardFace } : {},
		...entry.boardPresentation ? { boardPresentation: entry.boardPresentation } : {}
	};
}
/** Prepare durable facts, then resolve and consume against current caller state without a yield. */
async function withPreparedSessionResolve(params, consume) {
	const { projection, p } = params;
	const key = normalizeOptionalString(p.key);
	const assertCurrent = () => {
		if (params.isCurrent?.() === false) throw new Error("Session projection changed while resolving the session; retry the request");
	};
	if (key) return withReadySessionRows(projection, (cfg) => {
		const agent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		return agent.ok ? [{
			key,
			agentId: agent.agentId
		}] : [];
	}, () => {
		assertCurrent();
		return consume(resolveSessionKeyFromResolveParams(params));
	});
	do {
		await projection.ensureMaterialized();
		assertCurrent();
	} while (projection.needsMaterialization);
	return consume(resolveSessionKeyFromResolveParams(params));
}
function resolveSessionKeyFromResolveParams(params) {
	const { client, p, projection } = params;
	const { cfg, policyConfig } = projection.state;
	const { sharing } = prepareProjectedSessionPresentation(projection, client);
	const { entryFilter } = sharing;
	const prepare = (agentId = p.agentId, configuredAgentsOnly = false, selector) => prepareSessionRowSelection(projection, {
		...resolveSessionVisibilityFilterOptions(p),
		agentId,
		configuredAgentsOnly
	}, selector);
	const configuredAgentIds = new Set(listAgentIds(cfg));
	const prepareAgentChecks = (entries, getTarget) => {
		const facts = /* @__PURE__ */ new Map();
		const unresolved = [];
		for (const [candidateKey, entry] of entries) {
			const agentId = parseAgentSessionKey(candidateKey)?.agentId;
			if (!agentId || configuredAgentIds.has(agentId) || !resolveLegacyFreeAcpSessionKey(candidateKey)) continue;
			const target = getTarget(candidateKey);
			const current = target && projection.capture({
				agentId: target.agentId,
				key: target.key,
				storePath: target.storeTarget.storePath
			});
			const source = current?.materialized?.source;
			if (entry.acp || source && source.entry === current?.entry) facts.set(entry, entry.acp ?? source?.thinkingProjection.acpMeta);
			else unresolved.push({
				sessionKey: candidateKey,
				agentId,
				entry
			});
		}
		if (unresolved.length) for (const [entry, meta] of readAcpSessionMetaBatch({
			cfg,
			entries: unresolved
		})) facts.set(entry, meta);
		return (candidateKey, entry) => validateSessionAgentExists(cfg, candidateKey, entry, (entry && facts.get(entry)) ?? entry?.acp ?? null);
	};
	const sessionIdMatches = (agentId) => {
		const prepared = prepare(agentId, false, { sessionIdOrKey: sessionId });
		return {
			matches: filterAndSortSessionEntries({
				...prepared,
				entryFilter
			}).filter(([candidateKey, entry]) => entry.sessionId === sessionId || candidateKey === sessionId),
			getTarget: prepared.getTarget
		};
	};
	const key = normalizeOptionalString(p.key) ?? "";
	const hasKey = key.length > 0;
	const sessionId = normalizeOptionalString(p.sessionId) ?? "";
	const hasSessionId = sessionId.length > 0;
	const hasLabel = (normalizeOptionalString(p.label) ?? "").length > 0;
	const rawShortId = normalizeOptionalString(p.shortId) ?? "";
	const hasShortId = rawShortId.length > 0;
	const hasReference = p.reference !== void 0;
	if (p.slugHint !== void 0 && !hasShortId) return invalidSessionRequest("slugHint requires shortId");
	const selectionCount = [
		hasKey,
		hasSessionId,
		hasLabel,
		hasShortId,
		hasReference
	].filter(Boolean).length;
	if (selectionCount > 1) return invalidSessionRequest("Provide either key, sessionId, label, shortId, or reference (not multiple)");
	if (selectionCount === 0) return invalidSessionRequest("Either key, sessionId, label, shortId, or reference is required");
	if (p.reference) {
		const referenceKey = normalizeSessionKeyPreservingOpaquePeerIds(p.reference.key);
		const parsed = parseAgentSessionKey(referenceKey);
		const exactKey = !p.agentId || !parsed || parsed.agentId === normalizeAgentId(p.agentId) ? resolveSessionStoreKey({
			cfg,
			sessionKey: referenceKey,
			storeAgentId: p.agentId
		}) : referenceKey;
		const slug = normalizeOptionalString(p.reference.slug);
		const candidates = (lookupKey) => {
			const prepared = prepare(p.agentId, true, { key: lookupKey });
			const visibleEntries = filterAndSortSessionEntries({
				...prepared,
				entryFilter,
				opts: {
					...resolveSessionVisibilityFilterOptions(p),
					archived: "all"
				}
			});
			const checkAgent = prepareAgentChecks(visibleEntries, prepared.getTarget);
			return visibleEntries.filter(([candidateKey, entry]) => checkAgent(candidateKey, entry) === null && (lookupKey !== void 0 ? normalizeSessionKeyPreservingOpaquePeerIds(candidateKey) === lookupKey : SESSION_UUID_SUFFIX_RE.test(parseAgentSessionKey(candidateKey)?.rest ?? "") && controlUiSessionSlug(resolveGatewaySessionDisplayName(candidateKey, entry)) === slug)).slice(0, lookupKey !== void 0 ? 1 : 10).map(([candidateKey, entry]) => sessionResolveCandidate(candidateKey, entry, expectDefined(prepared.getTarget(candidateKey), "reference session agent").agentId));
		};
		const exact = candidates(exactKey)[0];
		if (exact) return {
			ok: true,
			...exact
		};
		const matches = slug ? candidates() : [];
		if (matches.length > 1) return {
			ok: true,
			ambiguous: true,
			candidates: matches
		};
		const selected = matches[0];
		return selected ? {
			ok: true,
			...selected
		} : noSessionFoundResult({
			p,
			message: `No session found: ${p.reference.key}`
		});
	}
	if (hasKey) {
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) return requestedAgent;
		if (authorizeIncognitoSessionTarget({
			client,
			sessionKey: key,
			target: null
		})) return noSessionFoundResult({
			p,
			message: `No session found: ${key}`
		});
		const target = projection.describe({
			agentId: requestedAgent.agentId,
			key
		});
		if (target?.entry) {
			const { entry } = target;
			const spawnedBy = typeof p.spawnedBy === "string" && p.spawnedBy.trim().length > 0;
			if (hasOperatorBoundary(client, policyConfig) && entryFilter?.(target.key, entry) === false || spawnedBy && !filterAndSortSessionEntries({ ...prepare(requestedAgent.agentId) }).some(([candidate]) => candidate === target.key)) return noSessionFoundResult({
				p,
				message: `No session found: ${key}`
			});
			return prepareAgentChecks([[target.key, entry]], () => target)(target.key, entry) ?? {
				ok: true,
				key: target.key,
				agentId: requestedAgent.agentId
			};
		}
		return noSessionFoundResult({
			p,
			message: `No session found: ${key}`
		});
	}
	if (hasSessionId) {
		if (!p.agentId) {
			const ownerTaggedMatches = /* @__PURE__ */ new Map();
			for (const agentId of listAgentIds(cfg)) {
				const { matches: agentMatches, getTarget } = sessionIdMatches(agentId);
				const agentSelection = resolveSessionIdMatchSelection(agentMatches, sessionId);
				if (agentSelection.kind === "ambiguous") return invalidSessionRequest(`Multiple sessions found for sessionId: ${sessionId} (${agentSelection.sessionKeys.join(", ")})`);
				if (agentSelection.kind === "selected") {
					const entry = agentMatches.find(([matchKey]) => matchKey === agentSelection.sessionKey)?.[1];
					const owner = resolveRequestedSessionAgentId(cfg, agentSelection.sessionKey, agentId);
					if (entry && owner.ok) ownerTaggedMatches.set(`${owner.agentId}\0${agentSelection.sessionKey}`, {
						agentId: owner.agentId,
						entry,
						key: agentSelection.sessionKey,
						getTarget
					});
				}
			}
			if (ownerTaggedMatches.size > 1) return invalidSessionRequest(`Multiple sessions found for sessionId: ${sessionId} (${[...ownerTaggedMatches.values()].map((match) => `${match.agentId}:${match.key}`).join(", ")})`);
			const ownerTaggedMatch = ownerTaggedMatches.values().next().value;
			if (ownerTaggedMatch) return prepareAgentChecks([[ownerTaggedMatch.key, ownerTaggedMatch.entry]], ownerTaggedMatch.getTarget)(ownerTaggedMatch.key, ownerTaggedMatch.entry) ?? {
				ok: true,
				key: ownerTaggedMatch.key,
				agentId: ownerTaggedMatch.agentId
			};
		}
		const { matches, getTarget } = sessionIdMatches(p.agentId);
		const selection = resolveSessionIdMatchSelection(matches, sessionId);
		if (selection.kind === "none") return noSessionFoundResult({
			p,
			message: `No session found: ${sessionId}`
		});
		if (selection.kind === "ambiguous") return invalidSessionRequest(`Multiple sessions found for sessionId: ${sessionId} (${selection.sessionKeys.join(", ")})`);
		const selectedEntry = matches.find(([matchKey]) => matchKey === selection.sessionKey)?.[1];
		let selectedAgentId = parseAgentSessionKey(selection.sessionKey)?.agentId ?? p.agentId;
		if (!selectedAgentId) {
			const resolvedOwner = resolveRequestedSessionAgentId(cfg, selection.sessionKey);
			if (!resolvedOwner.ok) return resolvedOwner;
			selectedAgentId = resolvedOwner.agentId;
		}
		const agentCheckSessionId = prepareAgentChecks(matches, getTarget)(selection.sessionKey, selectedEntry);
		if (agentCheckSessionId) return agentCheckSessionId;
		return {
			ok: true,
			key: selection.sessionKey,
			agentId: selectedAgentId
		};
	}
	if (hasShortId) {
		const shortId = normalizeShortSessionId(rawShortId);
		if (!shortId) return invalidSessionRequest("shortId must be 8-32 hexadecimal characters");
		const prepared = prepare();
		const matchingEntries = filterAndSortSessionEntries({
			...prepared,
			opts: {
				...prepared.opts,
				archived: "all"
			},
			entryFilter: (candidateKey, entry) => {
				const uuid = parseAgentSessionKey(candidateKey)?.rest.match(SESSION_UUID_SUFFIX_RE)?.[1];
				return Boolean(uuid?.toLowerCase().replaceAll("-", "").startsWith(shortId) && (entryFilter?.(candidateKey, entry) ?? true));
			}
		});
		const checkAgent = prepareAgentChecks(matchingEntries, prepared.getTarget);
		const matches = matchingEntries.flatMap(([candidateKey, entry]) => {
			const target = prepared.getTarget(candidateKey);
			return target && !checkAgent(candidateKey, entry) ? [sessionResolveCandidate(candidateKey, entry, target.agentId)] : [];
		});
		const slugHint = normalizeOptionalString(p.slugHint);
		const slugMatches = slugHint ? matches.filter((candidate) => controlUiSessionSlug(candidate.displayName) === slugHint) : [];
		const narrowed = slugMatches.length > 0 ? slugMatches : matches;
		if (narrowed.length === 0) return noSessionFoundResult({
			p,
			message: `No session found: ${shortId}`
		});
		if (narrowed.length > 1) return {
			ok: true,
			ambiguous: true,
			candidates: narrowed.slice(0, 10)
		};
		return {
			ok: true,
			...expectDefined(narrowed[0], "short session match at 0")
		};
	}
	const parsedLabel = parseSessionLabel(p.label);
	if (!parsedLabel.ok) return invalidSessionRequest(parsedLabel.error);
	const prepared = prepare();
	const matches = filterAndSortSessionEntries({
		...prepared,
		entryFilter,
		opts: {
			...resolveSessionVisibilityFilterOptions(p),
			label: parsedLabel.label,
			limit: 2
		}
	});
	if (matches.length === 0) return noSessionFoundResult({
		p,
		message: `No session found with label: ${parsedLabel.label}`
	});
	if (matches.length > 1) {
		const keys = matches.map(([matchKey]) => matchKey).join(", ");
		return invalidSessionRequest(`Multiple sessions found with label: ${parsedLabel.label} (${keys})`);
	}
	const [labelKey, labelEntry] = expectDefined(matches[0], "label session match at 0");
	const agentCheckLabel = prepareAgentChecks(matches, prepared.getTarget)(labelKey, labelEntry);
	if (agentCheckLabel) return agentCheckLabel;
	return {
		ok: true,
		key: labelKey,
		agentId: expectDefined(prepared.getTarget(labelKey), "label session agent").agentId
	};
}
//#endregion
export { withPreparedSessionResolve as t };
