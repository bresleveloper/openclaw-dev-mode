import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, F as SHORT_SESSION_ID_RE, M as parseAgentSessionKey, P as SESSION_UUID_SUFFIX_RE, R as controlUiSessionSlug } from "./session-key-CSDERtm3.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { l as resolveDeletedAgentIdFromSessionKey } from "./session-utils-store-lW7Wu3P0.mjs";
import { r as resolveGatewaySessionDisplayName } from "./session-utils-display-DdkO-Qt-.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-L_akTnVb.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-B3ptFjot.mjs";
import { i as prepareSessionRowSelection, t as filterAndSortSessionEntries } from "./session-utils-list-cYIWEFPs.mjs";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.mjs";
//#region src/gateway/sessions-resolve.ts
var SessionResolvePreparationRequired = class extends Error {
	constructor(queries) {
		super("Session metadata must be prepared before resolution");
		this.queries = queries;
	}
};
function resolveSessionVisibilityFilterOptions(p) {
	return {
		includeGlobal: p.includeGlobal === true,
		includeUnknown: p.includeUnknown === true,
		spawnedBy: p.spawnedBy,
		agentId: p.agentId
	};
}
function validateSessionAgentExists(cfg, key, acpMeta) {
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, key, acpMeta);
	if (deletedAgentId === null) return null;
	return invalidSessionRequest(`Agent "${deletedAgentId}" no longer exists in configuration`);
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
/** Prepare session facts, then resolve and consume against current caller state without a yield. */
async function withPreparedSessionResolve(params, consume) {
	const { projection, p } = params;
	return projection.withSelectionPreparation(async () => {
		const key = normalizeOptionalString(p.key);
		const assertCurrent = () => {
			if (params.isCurrent?.() === false) throw new Error("Session projection changed while resolving the session; retry the request");
		};
		const pending = /* @__PURE__ */ new Map();
		let candidateKeys;
		const sessionId = normalizeOptionalString(p.sessionId);
		const label = parseSessionLabel(p.label);
		let lookup;
		const topologyChanged = /* @__PURE__ */ new Error("Session lookup topology changed");
		const resolve = (preparedRead) => {
			assertCurrent();
			if (lookup && !lookup.isCurrent()) throw topologyChanged;
			return consume(resolveSessionKeyFromResolveParams({
				...params,
				candidateKeys,
				preparedRead
			}));
		};
		while (true) try {
			if (!key && !lookup && (sessionId || label.ok)) {
				await withReadySessionRows(projection, () => [], () => void 0);
				lookup = await projection.readLookup(sessionId ? {
					kind: "session-id-or-key",
					sessionIdOrKey: sessionId
				} : {
					kind: "label",
					label: label.ok ? label.label : ""
				}, p.agentId);
				candidateKeys = new Set(lookup.queries.map((query) => query.key));
				for (const query of lookup.queries) pending.set(JSON.stringify([
					query.agentId,
					query.key,
					query.storePath
				]), query);
			}
			return await withReadySessionRows(projection, (cfg) => {
				const selected = [...pending.values()];
				if (key) {
					const agent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
					if (agent.ok) selected.push({
						key,
						agentId: agent.agentId
					});
				}
				return selected;
			}, resolve, { selection: !key && candidateKeys === void 0 });
		} catch (error) {
			if (error === topologyChanged) {
				lookup = void 0;
				candidateKeys = void 0;
				pending.clear();
				continue;
			}
			if (!(error instanceof SessionResolvePreparationRequired)) throw error;
			for (const query of error.queries) pending.set(JSON.stringify([
				query.agentId,
				query.key,
				query.storePath
			]), query);
		}
	});
}
function resolveSessionKeyFromResolveParams(params) {
	const { client, p, projection } = params;
	const noSessionFoundResult = (message) => p.allowMissing ? {
		ok: true,
		missing: true
	} : invalidSessionRequest(message);
	const { cfg, policyConfig } = projection.state;
	const entryFilter = params.publicOnly ? (key, entry) => !isIncognitoSessionKey(key) && Boolean(resolveSessionPublicShare(entry)) : prepareProjectedSessionPresentation(projection, client).sharing.entryFilter;
	const prepare = (agentId = p.agentId, configuredAgentsOnly = false, selector) => prepareSessionRowSelection(projection, {
		...resolveSessionVisibilityFilterOptions(p),
		agentId,
		configuredAgentsOnly
	}, params.candidateKeys === void 0 ? selector : {
		candidateKeys: params.candidateKeys,
		metadataPrepared: true
	});
	const configuredAgentIds = new Set(listAgentIds(cfg));
	const prepareAgentChecks = (entries, getTarget) => {
		const facts = /* @__PURE__ */ new Map();
		const unresolved = [];
		for (const [candidateKey, entry] of entries) {
			const parsed = parseAgentSessionKey(candidateKey);
			if (!parsed || configuredAgentIds.has(parsed.agentId) || !parsed.rest.startsWith("acp:") || parsed.rest.startsWith("acp:binding:")) continue;
			const target = getTarget(candidateKey);
			const current = target && projection.capture({
				agentId: target.agentId,
				key: target.key,
				storePath: target.storeTarget.storePath
			});
			const source = current?.materialized?.source;
			if (source && source.entry === current?.entry) facts.set(entry, source.thinkingProjection.acpMeta);
			else if (current?.preparedAcpMeta !== void 0) facts.set(entry, current.preparedAcpMeta ?? void 0);
			else if (current) unresolved.push({
				key: current.key,
				agentId: current.agentId,
				storePath: current.storeTarget.storePath
			});
		}
		if (unresolved.length) throw new SessionResolvePreparationRequired(unresolved);
		return (candidateKey, entry) => validateSessionAgentExists(cfg, candidateKey, (entry && facts.get(entry)) ?? null);
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
		} : noSessionFoundResult(`No session found: ${p.reference.key}`);
	}
	if (hasKey) {
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) return requestedAgent;
		if (authorizeIncognitoSessionTarget({
			client,
			sessionKey: key,
			target: null
		})) return noSessionFoundResult(`No session found: ${key}`);
		const target = (params.preparedRead ?? projection).describe({
			agentId: requestedAgent.agentId,
			key
		});
		if (target?.entry) {
			const { entry } = target;
			const spawnedBy = typeof p.spawnedBy === "string" && p.spawnedBy.trim().length > 0;
			if ((hasOperatorBoundary(client, policyConfig) || params.publicOnly) && entryFilter?.(target.key, entry) === false || spawnedBy && !filterAndSortSessionEntries({ ...prepare(requestedAgent.agentId, false, { key: target.key }) }).some(([candidate]) => candidate === target.key)) return noSessionFoundResult(`No session found: ${key}`);
			return prepareAgentChecks([[target.key, entry]], () => target)(target.key, entry) ?? {
				ok: true,
				key: target.key,
				agentId: requestedAgent.agentId
			};
		}
		return noSessionFoundResult(`No session found: ${key}`);
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
		if (selection.kind === "none") return noSessionFoundResult(`No session found: ${sessionId}`);
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
		if (!SHORT_SESSION_ID_RE.test(rawShortId)) return invalidSessionRequest("shortId must be 8-32 hexadecimal characters");
		const shortId = rawShortId.toLowerCase();
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
		if (narrowed.length === 0) return noSessionFoundResult(`No session found: ${shortId}`);
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
	if (matches.length === 0) return noSessionFoundResult(`No session found with label: ${parsedLabel.label}`);
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
export { withPreparedSessionResolve as n, resolveSessionKeyFromResolveParams as t };
