import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { d as recordChannelIngressResolution } from "./admission-evidence-aqOMZf0e.mjs";
import { r as prepareCommandOwnerAuthority } from "./command-auth-2PSSAYYJ.mjs";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.mjs";
import { r as resolveInboundMentionDecision, t as allowedImplicitMentionKindsFromConfig } from "./mention-gating-Cqy7URJJ.mjs";
import { a as parseAccessGroupAllowFromEntry } from "./allow-from-Dq2DvsNl.mjs";
import { t as resolveChannelIngressEffectiveAllowFromLists } from "./effective-allow-from-BZwOd0Lu.mjs";
import { t as readChannelIngressStoreAllowFrom } from "./store-allow-from-CInyZmjP.mjs";
//#region src/channels/message-access/identifier-authentication.ts
const IDENTIFIER_AUTHENTICATION_RANK = {
	verified: 3,
	asserted: 2,
	unverified: 1,
	mutable: 0
};
function meetsIdentifierAuthentication(actual, minimum) {
	return IDENTIFIER_AUTHENTICATION_RANK[actual] >= IDENTIFIER_AUTHENTICATION_RANK[minimum];
}
/** Entry and subject claims combine by taking the weaker exact-pair claim. */
function weakestIdentifierAuthentication(entry, subject) {
	return IDENTIFIER_AUTHENTICATION_RANK[entry] <= IDENTIFIER_AUTHENTICATION_RANK[subject] ? entry : subject;
}
function identifierAuthenticationFrom(params) {
	return params.authentication ?? (params.dangerous ? "mutable" : "asserted");
}
function minimumIdentifierAuthenticationFrom(params) {
	return params.minIdentifierAuthentication ?? (params.mutableIdentifierMatching === "enabled" ? "mutable" : "asserted");
}
//#endregion
//#region src/channels/message-access/allowlist.ts
/**
* Channel ingress allowlist diagnostics.
*
* Merges allowlists, applies identifier authentication policy, and redacts access-graph facts.
*/
/**
* Returns the first access-group related failure reason for an allowlist.
*/
function allowlistFailureReason(allowlist) {
	if (allowlist.accessGroups.failed.length > 0) return "access_group_failed";
	if (allowlist.accessGroups.unsupported.length > 0) return "access_group_unsupported";
	if (allowlist.accessGroups.missing.length > 0) return "access_group_missing";
	return null;
}
/**
* Projects an allowlist into redacted diagnostics safe for ingress access graphs.
*/
function redactedAllowlistDiagnostics(allowlist, reasonCode) {
	return {
		configured: allowlist.hasConfiguredEntries,
		matched: allowlist.match.matched,
		reasonCode,
		matchedEntryIds: allowlist.matchedEntryIds,
		invalidEntryCount: allowlist.invalidEntries.length,
		disabledEntryCount: allowlist.disabledEntries.length,
		accessGroups: allowlist.accessGroups
	};
}
function mergeResolvedAllowlists(allowlists) {
	const scopedAllowlists = [];
	for (const [index, allowlist] of allowlists.entries()) {
		const prefix = `source-${index + 1}:`;
		const normalizedEntries = [];
		for (const entry of allowlist.normalizedEntries) normalizedEntries.push({
			...entry,
			opaqueEntryId: `${prefix}${entry.opaqueEntryId}`
		});
		const matchedPairs = [];
		for (const pair of allowlist.match.matchedPairs ?? []) matchedPairs.push({
			...pair,
			opaqueEntryId: `${prefix}${pair.opaqueEntryId}`
		});
		const matchedEntryIds = allowlist.matchedEntryIds.map((id) => `${prefix}${id}`);
		scopedAllowlists.push({
			...allowlist,
			normalizedEntries,
			matchedEntryIds,
			match: {
				...allowlist.match,
				matchedEntryIds,
				...matchedPairs.length > 0 ? { matchedPairs } : {}
			}
		});
	}
	const matches = scopedAllowlists.map((allowlist) => allowlist.match);
	const matchedEntryIds = uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.matchedEntryIds));
	const matchedPairs = scopedAllowlists.flatMap((allowlist) => allowlist.match.matchedPairs ?? []);
	return {
		rawEntryCount: scopedAllowlists.reduce((sum, allowlist) => sum + allowlist.rawEntryCount, 0),
		normalizedEntries: scopedAllowlists.flatMap((allowlist) => allowlist.normalizedEntries),
		invalidEntries: scopedAllowlists.flatMap((allowlist) => allowlist.invalidEntries),
		disabledEntries: scopedAllowlists.flatMap((allowlist) => allowlist.disabledEntries),
		matchedEntryIds,
		hasConfiguredEntries: scopedAllowlists.some((allowlist) => allowlist.hasConfiguredEntries),
		hasMatchableEntries: scopedAllowlists.some((allowlist) => allowlist.hasMatchableEntries),
		hasWildcard: scopedAllowlists.some((allowlist) => allowlist.hasWildcard),
		accessGroups: {
			referenced: uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.accessGroups.referenced)),
			matched: uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.accessGroups.matched)),
			missing: uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.accessGroups.missing)),
			unsupported: uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.accessGroups.unsupported)),
			failed: uniqueStrings(scopedAllowlists.flatMap((allowlist) => allowlist.accessGroups.failed))
		},
		match: {
			matched: matches.some((match) => match.matched) || matchedEntryIds.length > 0,
			matchedEntryIds,
			...matchedPairs.length > 0 ? { matchedPairs } : {}
		}
	};
}
/**
* Applies identifier authentication to exact matched entry/subject pairs.
*/
function applyIdentifierAuthenticationPolicy(allowlist, policy) {
	const minimum = minimumIdentifierAuthenticationFrom(policy);
	const pairsByEntry = /* @__PURE__ */ new Map();
	for (const pair of allowlist.match.matchedPairs ?? []) {
		const pairs = pairsByEntry.get(pair.opaqueEntryId) ?? [];
		pairs.push(pair);
		pairsByEntry.set(pair.opaqueEntryId, pairs);
	}
	const rejectedEntryIds = /* @__PURE__ */ new Set();
	for (const entry of allowlist.normalizedEntries) {
		const pairStrengths = pairsByEntry.get(entry.opaqueEntryId)?.map((pair) => weakestIdentifierAuthentication(entry.authentication, pair.subjectAuthentication));
		if (!(pairStrengths && pairStrengths.length > 0 ? pairStrengths.some((strength) => meetsIdentifierAuthentication(strength, minimum)) : meetsIdentifierAuthentication(entry.authentication, minimum))) rejectedEntryIds.add(entry.opaqueEntryId);
	}
	const matchedEntryIds = allowlist.matchedEntryIds.filter((id) => !rejectedEntryIds.has(id));
	const matchedPairs = allowlist.match.matchedPairs?.filter((pair) => !rejectedEntryIds.has(pair.opaqueEntryId));
	const disabledEntries = [...allowlist.disabledEntries, ...allowlist.normalizedEntries.filter((entry) => rejectedEntryIds.has(entry.opaqueEntryId)).map((entry) => ({
		opaqueEntryId: entry.opaqueEntryId,
		reasonCode: entry.authentication === "mutable" ? "mutable_identifier_disabled" : "identifier_authentication_too_weak"
	}))];
	const affectedMatch = matchedEntryIds.length !== allowlist.matchedEntryIds.length;
	return {
		...allowlist,
		disabledEntries,
		matchedEntryIds,
		hasMatchableEntries: allowlist.normalizedEntries.some((entry) => !rejectedEntryIds.has(entry.opaqueEntryId)),
		match: {
			matched: matchedEntryIds.length > 0,
			matchedEntryIds,
			...matchedPairs ? { matchedPairs } : {}
		},
		authentication: {
			evaluated: policy.minIdentifierAuthentication !== void 0 || policy.mutableIdentifierMatching !== void 0 || Boolean(allowlist.match.matchedPairs?.length),
			threshold: minimum,
			affectedMatch,
			rejectedEntryIds: [...rejectedEntryIds]
		}
	};
}
/**
* Resolves the sender allowlist used for group/channel ingress after route overrides.
*/
function effectiveGroupSenderAllowlist(params) {
	let effective = params.policy.groupAllowFromFallbackToAllowFrom && !params.state.allowlists.group.hasConfiguredEntries ? params.state.allowlists.dm : params.state.allowlists.group;
	for (const route of params.state.routeFacts) {
		if (route.gate !== "matched" || !route.senderAllowlist) continue;
		if (route.senderPolicy === "inherit") {
			effective = mergeResolvedAllowlists([effective, route.senderAllowlist]);
			continue;
		}
		effective = route.senderAllowlist;
	}
	return applyIdentifierAuthenticationPolicy(effective, params.policy);
}
//#endregion
//#region src/channels/message-access/sender-gates.ts
/**
* Channel ingress sender gate helpers.
*
* Evaluates DM and group sender policies against normalized allowlists.
*/
function senderGate(params) {
	return {
		id: params.id,
		phase: "sender",
		kind: params.kind,
		effect: params.effect,
		allowed: params.allowed,
		reasonCode: params.reasonCode,
		match: params.match,
		sender: { policy: params.policy },
		allowlist: redactedAllowlistDiagnostics(params.allowlistSource, params.reasonCode),
		...params.allowlistSource.authentication ? { identifierAuthentication: {
			evaluated: params.allowlistSource.authentication.evaluated,
			affectedMatch: params.allowlistSource.authentication.affectedMatch
		} } : {}
	};
}
/**
* Evaluates direct-message sender policy against DM and pairing-store allowlists.
*/
function senderGateForDirect(params) {
	const dm = applyIdentifierAuthenticationPolicy(params.state.allowlists.dm, params.policy);
	const pairingStore = applyIdentifierAuthenticationPolicy(params.state.allowlists.pairingStore, params.policy);
	const base = {
		policy: params.policy.dmPolicy,
		allowlistSource: dm,
		match: dm.match
	};
	const allow = (reasonCode) => senderGate({
		id: "sender:dm",
		kind: "dmSender",
		...base,
		effect: "allow",
		allowed: true,
		reasonCode
	});
	const block = (reasonCode) => senderGate({
		id: "sender:dm",
		kind: "dmSender",
		...base,
		effect: "block-dispatch",
		allowed: false,
		reasonCode
	});
	if (params.policy.dmPolicy === "disabled") return block("dm_policy_disabled");
	if (params.policy.dmPolicy === "open") {
		if (dm.hasWildcard) return allow("dm_policy_open");
		if (dm.match.matched) return allow("dm_policy_allowlisted");
		return block("dm_policy_not_allowlisted");
	}
	if (dm.match.matched) return allow("dm_policy_allowlisted");
	if (params.policy.dmPolicy === "pairing" && pairingStore.match.matched) return senderGate({
		id: "sender:dm",
		kind: "dmSender",
		effect: "allow",
		allowed: true,
		reasonCode: "dm_policy_allowlisted",
		match: pairingStore.match,
		policy: params.policy.dmPolicy,
		allowlistSource: pairingStore
	});
	if (params.policy.dmPolicy === "pairing" && params.state.event.mayPair) return block("dm_policy_pairing_required");
	return block(params.policy.dmPolicy === "pairing" ? "event_pairing_not_allowed" : allowlistFailureReason(dm) ?? "dm_policy_not_allowlisted");
}
/**
* Evaluates group/channel sender policy after route sender allowlist overrides are applied.
*/
function senderGateForGroup(params) {
	const group = effectiveGroupSenderAllowlist(params);
	const base = {
		policy: params.policy.groupPolicy,
		allowlistSource: group,
		match: group.match
	};
	const allow = (reasonCode) => senderGate({
		id: "sender:group",
		kind: "groupSender",
		...base,
		effect: "allow",
		allowed: true,
		reasonCode
	});
	const block = (reasonCode) => senderGate({
		id: "sender:group",
		kind: "groupSender",
		...base,
		effect: "block-dispatch",
		allowed: false,
		reasonCode
	});
	if (params.policy.groupPolicy === "disabled") return block("group_policy_disabled");
	if (params.policy.groupPolicy === "open") return allow("group_policy_open");
	if (!group.hasConfiguredEntries) return block("group_policy_empty_allowlist");
	if (group.match.matched) return allow("group_policy_allowed");
	return block(allowlistFailureReason(group) ?? "group_policy_not_allowlisted");
}
/**
* Applies event auth mode to sender gates for non-message callbacks.
*/
function applyEventAuthModeToSenderGate(params) {
	if (params.state.event.authMode === "inbound" || params.senderGate.allowed) return params.senderGate;
	const reasonCode = "sender_not_required";
	return {
		...params.senderGate,
		effect: "ignore",
		allowed: true,
		reasonCode,
		allowlist: params.senderGate.allowlist ? {
			...params.senderGate.allowlist,
			reasonCode
		} : void 0
	};
}
//#endregion
//#region src/channels/message-access/decision.ts
/**
* Channel ingress decision graph builder.
*
* Evaluates route, sender, command, and mention gates into one admission decision.
*/
function decisiveDecision(params) {
	return {
		admission: params.admission,
		decision: params.decision,
		decisiveGateId: params.gate.id,
		reasonCode: params.gate.reasonCode,
		graph: { gates: params.gates }
	};
}
function routeGates(state) {
	return state.routeFacts.map((route) => ({
		id: route.id,
		phase: "route",
		kind: route.kind,
		effect: route.effect,
		allowed: route.effect !== "block-dispatch",
		reasonCode: route.effect === "block-dispatch" ? "route_blocked" : "allowed",
		match: route.match
	}));
}
function routeSenderEmptyGate(state) {
	const route = state.routeFacts.find((fact) => fact.senderPolicy === "deny-when-empty" && fact.gate === "matched" && fact.senderAllowlist?.hasConfiguredEntries !== true);
	if (!route) return null;
	const reasonCode = "route_sender_empty";
	return {
		id: `${route.id}:sender`,
		phase: "route",
		kind: "routeSender",
		effect: "block-dispatch",
		allowed: false,
		reasonCode,
		match: route.match,
		allowlist: route.senderAllowlist ? redactedAllowlistDiagnostics(route.senderAllowlist, reasonCode) : void 0
	};
}
function commandGate(params) {
	const command = params.policy.command;
	if (!command) return {
		id: "command",
		phase: "command",
		kind: "command",
		effect: "allow",
		allowed: true,
		reasonCode: "command_authorized"
	};
	const useAccessGroups = command.useAccessGroups ?? true;
	const owner = applyIdentifierAuthenticationPolicy(params.state.allowlists.commandOwner, params.policy);
	const group = applyIdentifierAuthenticationPolicy(params.state.allowlists.commandGroup, params.policy);
	const authorized = resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups,
		modeWhenAccessGroupsOff: command.modeWhenAccessGroupsOff,
		authorizers: [{
			configured: owner.hasConfiguredEntries,
			allowed: owner.match.matched
		}, {
			configured: group.hasConfiguredEntries,
			allowed: group.match.matched
		}]
	});
	const shouldBlock = command.allowTextCommands && command.hasControlCommand && !authorized;
	return {
		id: "command",
		phase: "command",
		kind: "command",
		effect: shouldBlock ? "block-command" : "allow",
		allowed: authorized,
		reasonCode: shouldBlock ? "control_command_unauthorized" : "command_authorized",
		match: mergeCommandMatch(owner.match, group.match),
		identifierAuthentication: {
			evaluated: Boolean(owner.authentication?.evaluated || group.authentication?.evaluated),
			affectedMatch: Boolean(owner.authentication?.affectedMatch || group.authentication?.affectedMatch)
		},
		command: {
			useAccessGroups,
			allowTextCommands: command.allowTextCommands,
			modeWhenAccessGroupsOff: command.modeWhenAccessGroupsOff,
			shouldBlockControlCommand: shouldBlock
		}
	};
}
function mergeCommandMatch(owner, group) {
	const matchedEntryIds = uniqueStrings([...owner.matchedEntryIds, ...group.matchedEntryIds]);
	return {
		matched: owner.matched || group.matched || matchedEntryIds.length > 0,
		matchedEntryIds
	};
}
function eventGate(params) {
	const authMode = params.state.event.authMode;
	const event = params.state.event;
	const eventResult = (allowed, reasonCode) => ({
		id: "event",
		phase: "event",
		kind: "event",
		effect: allowed ? "allow" : "block-dispatch",
		allowed,
		reasonCode,
		event
	});
	if (authMode === "none" || authMode === "route-only") return eventResult(true, "event_authorized");
	if (authMode === "command") return eventResult(params.commandGate.allowed, params.commandGate.allowed ? "event_authorized" : "event_unauthorized");
	if (authMode === "origin-subject") {
		if (!params.state.event.hasOriginSubject) return eventResult(false, "origin_subject_missing");
		const matched = params.state.event.originSubjectMatched && meetsIdentifierAuthentication(params.state.event.originSubjectAuthentication ?? "asserted", minimumIdentifierAuthenticationFrom(params.policy));
		return {
			...eventResult(matched, matched ? "event_authorized" : "origin_subject_not_matched"),
			identifierAuthentication: {
				evaluated: params.policy.minIdentifierAuthentication !== void 0 || params.policy.mutableIdentifierMatching !== void 0 || params.state.event.originSubjectAuthentication !== void 0,
				affectedMatch: params.state.event.originSubjectMatched && !matched
			}
		};
	}
	return eventResult(params.senderGate.allowed, params.senderGate.allowed ? "event_authorized" : "event_unauthorized");
}
function activationMetadata(params) {
	const mentionFacts = params.mentionFacts;
	const allowedImplicitMentionKinds = resolveAllowedImplicitMentionKinds(params.activation);
	return {
		hasMentionFacts: mentionFacts != null,
		requireMention: params.activation?.requireMention ?? false,
		allowTextCommands: params.activation?.allowTextCommands ?? false,
		...allowedImplicitMentionKinds !== void 0 ? { allowedImplicitMentionKinds } : {},
		...params.activation?.order ? { order: params.activation.order } : {},
		shouldSkip: params.shouldSkip,
		...mentionFacts?.canDetectMention !== void 0 ? { canDetectMention: mentionFacts.canDetectMention } : {},
		...mentionFacts?.wasMentioned !== void 0 ? { wasMentioned: mentionFacts.wasMentioned } : {},
		...mentionFacts?.hasAnyMention !== void 0 ? { hasAnyMention: mentionFacts.hasAnyMention } : {},
		...mentionFacts?.implicitMentionKinds !== void 0 ? { implicitMentionKinds: mentionFacts.implicitMentionKinds } : {},
		...params.effectiveWasMentioned !== void 0 ? { effectiveWasMentioned: params.effectiveWasMentioned } : {},
		...params.shouldBypassMention !== void 0 ? { shouldBypassMention: params.shouldBypassMention } : {}
	};
}
function resolveAllowedImplicitMentionKinds(activation) {
	return activation?.allowedImplicitMentionKinds ?? (activation?.implicitMentions ? allowedImplicitMentionKindsFromConfig(activation.implicitMentions) : void 0);
}
function activationGate(params) {
	const activation = params.policy.activation;
	const mentionFacts = params.state.mentionFacts;
	const allowedImplicitMentionKinds = resolveAllowedImplicitMentionKinds(activation);
	const activationResult = (input) => ({
		id: "activation",
		phase: "activation",
		kind: "mention",
		effect: input.shouldSkip ? "skip" : "allow",
		allowed: !input.shouldSkip,
		reasonCode: input.shouldSkip ? "activation_skipped" : "activation_allowed",
		activation: activationMetadata({
			activation,
			mentionFacts,
			shouldSkip: input.shouldSkip,
			effectiveWasMentioned: input.effectiveWasMentioned,
			shouldBypassMention: input.shouldBypassMention
		})
	});
	if (!activation || !mentionFacts) return activationResult({
		shouldSkip: false,
		effectiveWasMentioned: mentionFacts && (mentionFacts.wasMentioned || Boolean(mentionFacts.implicitMentionKinds?.length))
	});
	const result = resolveInboundMentionDecision({
		facts: mentionFacts,
		policy: {
			isGroup: params.state.conversationKind !== "direct",
			requireMention: activation.requireMention,
			allowedImplicitMentionKinds,
			allowTextCommands: activation.allowTextCommands,
			hasControlCommand: params.policy.command?.hasControlCommand ?? false,
			commandAuthorized: params.commandGate.allowed
		}
	});
	return activationResult({
		shouldSkip: result.shouldSkip,
		effectiveWasMentioned: result.effectiveWasMentioned,
		shouldBypassMention: result.shouldBypassMention
	});
}
function decideChannelIngress(state, policy) {
	const gates = routeGates(state);
	const emptyRouteSenderGate = routeSenderEmptyGate(state);
	if (emptyRouteSenderGate) gates.push(emptyRouteSenderGate);
	const routeBlock = gates.find((entry) => entry.effect === "block-dispatch");
	if (routeBlock) return decisiveDecision({
		admission: "drop",
		decision: "block",
		gate: routeBlock,
		gates
	});
	const activationBeforeSender = policy.activation?.order === "before-sender" && !policy.activation.allowTextCommands ? activationGate({
		state,
		policy,
		commandGate: commandGate({
			state,
			policy: {
				...policy,
				command: void 0
			}
		})
	}) : null;
	if (activationBeforeSender) {
		gates.push(activationBeforeSender);
		if (activationBeforeSender.effect === "skip") return decisiveDecision({
			admission: "skip",
			decision: "allow",
			gate: activationBeforeSender,
			gates
		});
	}
	const eventModeSender = applyEventAuthModeToSenderGate({
		state,
		senderGate: state.conversationKind === "direct" ? senderGateForDirect({
			state,
			policy
		}) : senderGateForGroup({
			state,
			policy
		})
	});
	gates.push(eventModeSender);
	if (!eventModeSender.allowed) return decisiveDecision({
		admission: eventModeSender.reasonCode === "dm_policy_pairing_required" ? "pairing-required" : "drop",
		decision: eventModeSender.reasonCode === "dm_policy_pairing_required" ? "pairing" : "block",
		gate: eventModeSender,
		gates
	});
	const command = commandGate({
		state,
		policy
	});
	gates.push(command);
	if (command.effect === "block-command") return decisiveDecision({
		admission: "drop",
		decision: "block",
		gate: command,
		gates
	});
	const event = eventGate({
		state,
		policy,
		senderGate: eventModeSender,
		commandGate: command
	});
	gates.push(event);
	if (!event.allowed) return decisiveDecision({
		admission: "drop",
		decision: "block",
		gate: event,
		gates
	});
	const activation = activationBeforeSender ?? activationGate({
		state,
		policy,
		commandGate: command
	});
	if (!activationBeforeSender) gates.push(activation);
	if (activation.effect === "skip") return decisiveDecision({
		admission: "skip",
		decision: "allow",
		gate: activation,
		gates
	});
	if (activation.effect === "observe") return decisiveDecision({
		admission: "observe",
		decision: "allow",
		gate: activation,
		gates
	});
	return decisiveDecision({
		admission: "dispatch",
		decision: "allow",
		gate: activation,
		gates
	});
}
//#endregion
//#region src/channels/message-access/runtime-access-groups.ts
/**
* Runtime access-group resolution for channel ingress.
*
* Preserves symbolic access-group entries until dynamic membership facts are available.
*/
function accessGroupNames(entries) {
	return uniqueStrings(entries.map((entry) => parseAccessGroupAllowFromEntry(String(entry))).filter((entry) => entry != null));
}
/**
* Lists every access-group name referenced by grouped allowFrom entry arrays.
*/
function allReferencedAccessGroupNames(entries) {
	return uniqueStrings(entries.flatMap((entryGroup) => accessGroupNames(entryGroup)));
}
/**
* Normalizes direct sender entries while preserving access-group references for runtime lookup.
*/
async function normalizeEffectiveEntries(params) {
	const rawEntries = normalizeStringEntries(params.entries);
	const accessGroupEntries = rawEntries.filter((entry) => parseAccessGroupAllowFromEntry(entry) != null);
	const directEntries = rawEntries.filter((entry) => parseAccessGroupAllowFromEntry(entry) == null);
	if (directEntries.length === 0) return accessGroupEntries;
	const normalized = await params.adapter.normalizeEntries({
		entries: directEntries,
		context: params.context,
		accountId: params.accountId
	});
	return uniqueStrings([...accessGroupEntries, ...normalized.matchable.map((entry) => entry.value)]);
}
/**
* Resolves dynamic access-group membership facts for referenced runtime access groups.
*/
async function resolveRuntimeAccessGroupMembershipFacts(params) {
	if (!params.input.resolveAccessGroupMembership || params.names.length === 0) return [];
	const facts = [];
	for (const name of params.names) {
		const group = params.input.accessGroups?.[name];
		if (!group || group.type === "message.senders") continue;
		try {
			const matched = await params.input.resolveAccessGroupMembership({
				name,
				group,
				channelId: params.channelId,
				accountId: params.input.accountId,
				subject: params.input.subject
			});
			facts.push(matched ? {
				kind: "matched",
				groupName: name,
				source: "dynamic",
				matchedEntryIds: [`access-group:${name}`]
			} : {
				kind: "not-matched",
				groupName: name,
				source: "dynamic"
			});
		} catch {
			facts.push({
				kind: "failed",
				groupName: name,
				source: "dynamic",
				reasonCode: "access_group_failed",
				diagnosticId: `access-group:${name}`
			});
		}
	}
	return facts;
}
//#endregion
//#region src/channels/message-access/runtime-identity.ts
/** Build an identity descriptor for channels with one stable id and optional aliases. */
function defineStableChannelIngressIdentity(params = {}) {
	const { entryIdPrefix, resolveEntryId, aliases, isWildcardEntry, matchEntry, resolveParticipant, ...primary } = params;
	return {
		primary,
		aliases,
		isWildcardEntry,
		matchEntry,
		resolveParticipant,
		resolveEntryId: resolveEntryId ?? (entryIdPrefix ? ({ entryIndex }) => `${entryIdPrefix}-${entryIndex + 1}` : void 0)
	};
}
/** Classify configured entries without needing a sender or granting admission. */
function identityEntryAuthenticationClassifier(identity) {
	const descriptor = "primary" in identity ? identity : defineStableChannelIngressIdentity(identity);
	const fields = identityFields(descriptor);
	const isWildcardEntry = descriptor.isWildcardEntry ?? ((value) => value === "*");
	return (raw) => {
		if (isWildcardEntry(raw)) return;
		let strongest;
		for (const field of fields) {
			if (!normalizeFieldValue(field, raw, "entry")) continue;
			const authentication = fieldAuthentication(field, raw, fieldDangerous(field, raw));
			if (strongest === void 0 || meetsIdentifierAuthentication(authentication, strongest)) strongest = authentication;
		}
		return strongest;
	};
}
function defaultNormalize(value) {
	return value;
}
function normalizeFieldValue(field, value, mode) {
	const normalized = (mode === "entry" ? field.normalizeEntry ?? field.normalize ?? defaultNormalize : field.normalizeSubject ?? field.normalize ?? defaultNormalize)(value);
	return normalized == null ? null : normalized.trim() || null;
}
function fieldDangerous(field, value) {
	return typeof field.dangerous === "function" ? field.dangerous(value) : field.dangerous;
}
function fieldAuthentication(field, value, dangerous) {
	return identifierAuthenticationFrom({
		authentication: typeof field.authentication === "function" ? field.authentication(value) : field.authentication,
		dangerous
	});
}
function identityFields(identity) {
	const fields = [{
		...identity.primary,
		key: identity.primary.key ?? "stableId",
		kind: identity.primary.kind ?? "stable-id"
	}];
	for (const alias of identity.aliases ?? []) fields.push({
		...alias,
		kind: alias.kind ?? `plugin:${alias.key}`
	});
	return fields;
}
function identityMatchKey(entry) {
	return `${entry.kind}:${entry.value}`;
}
function adapterEntry(params) {
	const dangerous = fieldDangerous(params.field, params.entry);
	return {
		opaqueEntryId: params.identity.resolveEntryId?.({
			entry: params.entry,
			entryIndex: params.entryIndex,
			fieldKey: params.field.key,
			fieldIndex: params.fieldIndex
		}) ?? `entry-${params.entryIndex + 1}:${params.fallbackSuffix ?? params.field.key}`,
		kind: params.field.kind,
		value: params.value,
		identityFieldKey: params.field.key,
		...params.wildcard ? { wildcard: true } : {},
		authentication: fieldAuthentication(params.field, params.entry, dangerous),
		dangerous,
		sensitivity: params.field.sensitivity
	};
}
function createIdentityAdapter(identity) {
	const fields = identityFields(identity);
	const isWildcardEntry = identity.isWildcardEntry ?? ((value) => value === "*");
	return {
		normalizeEntries({ entries }) {
			return {
				matchable: entries.flatMap((entry, entryIndex) => {
					if (isWildcardEntry(entry)) return [adapterEntry({
						identity,
						field: expectDefined(fields[0], "fields entry at 0"),
						fieldIndex: 0,
						entry,
						entryIndex,
						value: "*",
						fallbackSuffix: "wildcard",
						wildcard: true
					})];
					return fields.flatMap((field, fieldIndex) => {
						const value = normalizeFieldValue(field, entry, "entry");
						if (!value) return [];
						return [adapterEntry({
							identity,
							field,
							fieldIndex,
							entry,
							entryIndex,
							value
						})];
					});
				}),
				invalid: [],
				disabled: []
			};
		},
		matchSubject({ subject, entries, context }) {
			const normalizedSubjects = subject.identifiers.flatMap((identifier) => {
				const field = fields.find((candidate) => candidate.key === identifier.opaqueId && candidate.kind === identifier.kind);
				if (!field) return [];
				const value = normalizeFieldValue(field, identifier.value, "subject");
				return value ? [{
					identifier,
					value
				}] : [];
			});
			const matchedPairs = entries.flatMap((entry) => {
				const legacyMatch = identity.matchEntry?.({
					subject,
					entry,
					context
				});
				if (legacyMatch === false) return [];
				const candidates = entry.wildcard ? normalizedSubjects.filter(({ identifier }) => identifier.kind === fields[0]?.kind) : normalizedSubjects.filter(({ identifier, value }) => identifier.opaqueId === entry.identityFieldKey && identifier.kind === entry.kind && identityMatchKey({
					kind: identifier.kind,
					value
				}) === identityMatchKey(entry));
				if (candidates.length === 0) return legacyMatch === true ? [{
					opaqueEntryId: entry.opaqueEntryId,
					opaqueSubjectId: "legacy-subject-match",
					subjectAuthentication: "asserted"
				}] : entry.wildcard ? [{
					opaqueEntryId: entry.opaqueEntryId,
					opaqueSubjectId: "wildcard-subject",
					subjectAuthentication: "asserted"
				}] : [];
				return candidates.map(({ identifier }) => ({
					opaqueEntryId: entry.opaqueEntryId,
					opaqueSubjectId: identifier.opaqueId,
					subjectAuthentication: identifier.authentication
				}));
			});
			const matchedEntryIds = [...new Set(matchedPairs.map((pair) => pair.opaqueEntryId))];
			return {
				matched: matchedEntryIds.length > 0,
				matchedEntryIds,
				matchedPairs
			};
		}
	};
}
function createIdentitySubject(identity, input) {
	return { identifiers: identityFields(identity).flatMap((field, index) => {
		const rawValue = index === 0 ? input.stableId : input.aliases?.[field.key];
		if (rawValue == null) return [];
		const value = String(rawValue);
		const dangerous = fieldDangerous(field, value);
		const authentication = input.authentication !== void 0 ? input.authentication[field.key] ?? "unverified" : fieldAuthentication(field, value, dangerous);
		return [{
			opaqueId: field.key,
			kind: field.kind,
			value,
			authentication,
			dangerous,
			sensitivity: field.sensitivity
		}];
	}) };
}
//#endregion
//#region src/channels/message-access/runtime-routes.ts
function routeDescriptors(route) {
	if (!route) return [];
	return [route].flat();
}
/**
* Collect optional route descriptors while dropping false, null, and undefined
* entries.
*/
function channelIngressRoutes(...routes) {
	return routes.filter((route) => Boolean(route));
}
function routeFactsFromDescriptors(route) {
	return routeDescriptors(route).flatMap((descriptor) => {
		if (descriptor.configured === false) return [];
		let kind = descriptor.kind ?? "route";
		let gate = "matched";
		let effect = "allow";
		if (descriptor.enabled === false) {
			gate = "disabled";
			effect = "block-dispatch";
		} else if (descriptor.allowed !== void 0) {
			gate = descriptor.allowed ? "matched" : "not-matched";
			effect = descriptor.allowed ? "allow" : "block-dispatch";
		} else if (descriptor.senderPolicy !== "deny-when-empty" && descriptor.senderAllowFrom == null && descriptor.senderAllowFromSource == null) return [];
		else if (descriptor.senderPolicy !== "deny-when-empty") kind = "routeSender";
		const matched = descriptor.matched ?? descriptor.allowed ?? descriptor.enabled !== false;
		return [{
			id: descriptor.id,
			kind,
			gate,
			effect,
			precedence: descriptor.precedence ?? 0,
			senderPolicy: descriptor.senderPolicy ?? "inherit",
			senderAllowFrom: descriptor.senderAllowFrom == null ? void 0 : [...descriptor.senderAllowFrom],
			senderAllowFromSource: descriptor.senderAllowFromSource,
			match: {
				matched,
				matchedEntryIds: matched && descriptor.matchId ? [descriptor.matchId] : []
			}
		}];
	});
}
function routeDescriptorForGate(params) {
	const baseGateId = params.gate.id.endsWith(":sender") ? params.gate.id.slice(0, -7) : params.gate.id;
	return params.descriptors.find((descriptor) => descriptor.id === params.gate.id || descriptor.id === baseGateId);
}
function projectRouteAccess(params) {
	const descriptors = routeDescriptors(params.route);
	const routeBlock = params.ingress.graph.gates.find((entry) => entry.phase === "route" && entry.effect === "block-dispatch");
	if (routeBlock) {
		const descriptor = routeDescriptorForGate({
			descriptors,
			gate: routeBlock
		});
		return {
			allowed: routeBlock.allowed,
			reasonCode: routeBlock.reasonCode,
			...descriptor?.blockReason ? { reason: descriptor.blockReason } : {},
			gate: routeBlock
		};
	}
	const routeSenderReplacement = descriptors.find((descriptor) => descriptor.senderPolicy === "replace" && descriptor.blockReason);
	const senderBlock = params.ingress.graph.gates.find((entry) => entry.phase === "sender" && entry.effect === "block-dispatch");
	if (routeSenderReplacement && senderBlock) return {
		allowed: false,
		reasonCode: senderBlock.reasonCode,
		reason: routeSenderReplacement.blockReason,
		gate: senderBlock
	};
	const gate = params.ingress.graph.gates.find((entry) => entry.phase === "route");
	if (gate) return {
		allowed: gate.allowed,
		reasonCode: gate.reasonCode,
		gate
	};
	return { allowed: true };
}
//#endregion
//#region src/channels/message-access/state.ts
/**
* Channel ingress state resolver.
*
* Normalizes and matches route, sender, command, and access-group allowlists.
*/
function normalizeSubjectAuthentication(subject) {
	return { identifiers: subject.identifiers.map((identifier) => ({
		...identifier,
		authentication: identifierAuthenticationFrom(identifier)
	})) };
}
function redactedEntries(entries) {
	return entries.map(({ value: _value, identityFieldKey: _identityFieldKey, ...entry }) => entry);
}
function emptyMatch() {
	return {
		matched: false,
		matchedEntryIds: []
	};
}
function mergeMatches(matches) {
	const matchedEntryIds = uniqueStrings(matches.flatMap((match) => match.matchedEntryIds));
	const matchedPairs = matches.flatMap((match) => match.matchedPairs ?? []);
	const seenPairs = /* @__PURE__ */ new Set();
	const uniquePairs = matchedPairs.filter((pair) => {
		const key = JSON.stringify([
			pair.opaqueEntryId,
			pair.opaqueSubjectId,
			pair.subjectAuthentication
		]);
		if (seenPairs.has(key)) return false;
		seenPairs.add(key);
		return true;
	});
	return {
		matched: matches.some((match) => match.matched) || matchedEntryIds.length > 0,
		matchedEntryIds,
		...uniquePairs.length > 0 ? { matchedPairs: uniquePairs } : {}
	};
}
function mergeDiagnostics(...groups) {
	const diagnostics = [];
	for (const group of groups) if (group) diagnostics.push(...group);
	return diagnostics;
}
function accessGroupFactByName(facts) {
	return new Map((facts ?? []).map((fact) => [fact.groupName, fact]));
}
async function normalizeAndMatch(params) {
	if (params.entries.length === 0) return {
		normalizedEntries: [],
		invalidEntries: [],
		disabledEntries: [],
		match: emptyMatch()
	};
	const normalized = await params.adapter.normalizeEntries({
		entries: params.entries,
		context: params.context,
		accountId: params.accountId
	});
	const matchable = normalized.matchable.map((entry) => ({
		...entry,
		authentication: identifierAuthenticationFrom(entry)
	}));
	const match = matchable.length > 0 ? await params.adapter.matchSubject({
		subject: params.subject,
		entries: matchable,
		context: params.context
	}) : emptyMatch();
	return {
		normalizedEntries: redactedEntries(matchable),
		invalidEntries: normalized.invalid,
		disabledEntries: normalized.disabled,
		match
	};
}
function referencedAccessGroups(entries) {
	return Array.from(new Set(entries.map((entry) => parseAccessGroupAllowFromEntry(entry)).filter((entry) => entry != null)));
}
function directAllowlistEntries(entries) {
	return entries.filter((entry) => parseAccessGroupAllowFromEntry(entry) == null);
}
function groupSenderEntries(params) {
	const group = params.input.accessGroups?.[params.groupName];
	if (!group || group.type !== "message.senders") return [];
	return normalizeStringEntries([...group.members["*"] ?? [], ...group.members[params.input.channelId] ?? []]);
}
function eventSubjectMatchContext(input) {
	return input.conversation.kind === "direct" ? "dm" : "group";
}
async function normalizeSubjectIdentifiersForMatch(params) {
	return (await Promise.all(params.subject.identifiers.map(async (identifier, identifierIndex) => {
		return (await params.input.adapter.normalizeEntries({
			entries: [identifier.value],
			context: params.context,
			accountId: params.input.accountId
		})).matchable.filter((entry) => entry.kind === identifier.kind && (entry.identityFieldKey === void 0 || entry.identityFieldKey === identifier.opaqueId) && entry.value !== "*").map((entry, entryIndex) => ({
			opaqueEntryId: `${params.opaquePrefix}-${identifierIndex + 1}:${entryIndex + 1}`,
			kind: entry.kind,
			value: entry.value,
			identityFieldKey: entry.identityFieldKey,
			authentication: identifier.authentication,
			dangerous: entry.dangerous,
			sensitivity: entry.sensitivity
		}));
	}))).flat();
}
function strongerAuthentication(left, right) {
	if (!left) return right;
	return weakestIdentifierAuthentication(left, right) === left ? right : left;
}
function matchedAuthentication(params) {
	const entries = new Map(params.entries.map((entry) => [entry.opaqueEntryId, entry]));
	let strongest;
	for (const pair of params.match.matchedPairs ?? []) {
		const entry = entries.get(pair.opaqueEntryId);
		if (!entry) continue;
		const strength = weakestIdentifierAuthentication(entry.authentication, pair.subjectAuthentication);
		strongest = strongerAuthentication(strongest, strength);
	}
	if (!strongest) for (const entryId of params.match.matchedEntryIds) {
		const entry = entries.get(entryId);
		if (entry) strongest = strongerAuthentication(strongest, entry.authentication);
	}
	return strongest;
}
async function originSubjectAuthentication(input) {
	const origin = input.event.originSubject;
	if (!origin) return;
	let strongest;
	for (const originIdentifier of origin.identifiers) for (const current of input.subject.identifiers) {
		if (current.opaqueId !== originIdentifier.opaqueId || current.kind !== originIdentifier.kind || current.value !== originIdentifier.value) continue;
		strongest = strongerAuthentication(strongest, weakestIdentifierAuthentication(originIdentifier.authentication, current.authentication));
	}
	const context = eventSubjectMatchContext(input);
	const originEntries = await normalizeSubjectIdentifiersForMatch({
		input,
		subject: origin,
		context,
		opaquePrefix: "origin"
	});
	if (originEntries.length > 0) {
		const currentMatch = await input.adapter.matchSubject({
			subject: input.subject,
			entries: originEntries,
			context
		});
		if (currentMatch.matched) {
			const authentication = matchedAuthentication({
				entries: originEntries,
				match: currentMatch
			});
			if (authentication) strongest = strongerAuthentication(strongest, authentication);
		}
	}
	const currentEntries = await normalizeSubjectIdentifiersForMatch({
		input,
		subject: input.subject,
		context,
		opaquePrefix: "current"
	});
	if (currentEntries.length > 0) {
		const authentication = matchedAuthentication({
			entries: currentEntries,
			match: await input.adapter.matchSubject({
				subject: origin,
				entries: currentEntries,
				context
			})
		});
		if (authentication) strongest = strongerAuthentication(strongest, authentication);
	}
	return strongest;
}
async function resolveAccessGroupEntries(params) {
	const factByName = accessGroupFactByName(params.input.accessGroupMembership);
	const accessGroups = {
		referenced: [...params.referenced],
		matched: [],
		missing: [],
		unsupported: [],
		failed: []
	};
	const normalizedEntries = [];
	const invalidEntries = [];
	const disabledEntries = [];
	const matches = [];
	for (const groupName of params.referenced) {
		const fact = factByName.get(groupName);
		if (fact?.kind === "matched") {
			accessGroups.matched.push(groupName);
			for (const opaqueEntryId of fact.matchedEntryIds) normalizedEntries.push({
				opaqueEntryId,
				kind: "plugin:access-group-membership",
				authentication: "asserted"
			});
			matches.push({
				matched: true,
				matchedEntryIds: fact.matchedEntryIds
			});
			continue;
		}
		if (fact?.kind === "missing" || fact?.kind === "unsupported" || fact?.kind === "failed") {
			accessGroups[fact.kind].push(groupName);
			continue;
		}
		if (fact?.kind === "not-matched") continue;
		const group = params.input.accessGroups?.[groupName];
		if (!group) {
			accessGroups.missing.push(groupName);
			continue;
		}
		if (group.type !== "message.senders") {
			accessGroups.unsupported.push(groupName);
			continue;
		}
		const groupEntries = groupSenderEntries({
			groupName,
			input: params.input
		});
		const resolved = await normalizeAndMatch({
			adapter: params.input.adapter,
			subject: params.input.subject,
			accountId: params.input.accountId,
			entries: groupEntries,
			context: params.context
		});
		normalizedEntries.push(...resolved.normalizedEntries);
		invalidEntries.push(...resolved.invalidEntries);
		disabledEntries.push(...resolved.disabledEntries);
		if (resolved.match.matched) {
			accessGroups.matched.push(groupName);
			matches.push(resolved.match);
		}
	}
	return {
		normalizedEntries,
		invalidEntries,
		disabledEntries,
		matches,
		accessGroups
	};
}
async function resolveIngressAllowlist(params) {
	const entries = normalizeStringEntries(params.rawEntries ?? []);
	const referenced = referencedAccessGroups(entries);
	const directEntries = directAllowlistEntries(entries);
	const direct = await normalizeAndMatch({
		adapter: params.input.adapter,
		subject: params.input.subject,
		accountId: params.input.accountId,
		entries: directEntries,
		context: params.context
	});
	const groups = await resolveAccessGroupEntries({
		input: params.input,
		context: params.context,
		referenced
	});
	const match = mergeMatches([direct.match, ...groups.matches]);
	return {
		rawEntryCount: entries.length,
		normalizedEntries: [...direct.normalizedEntries, ...groups.normalizedEntries],
		invalidEntries: mergeDiagnostics(direct.invalidEntries, groups.invalidEntries),
		disabledEntries: mergeDiagnostics(direct.disabledEntries, groups.disabledEntries),
		matchedEntryIds: match.matchedEntryIds,
		hasConfiguredEntries: entries.length > 0,
		hasMatchableEntries: direct.normalizedEntries.length > 0 || groups.normalizedEntries.length > 0,
		hasWildcard: directEntries.includes("*"),
		accessGroups: groups.accessGroups,
		match
	};
}
async function resolveRouteFacts(input) {
	const routeFacts = [...input.routeFacts ?? []].toSorted((left, right) => left.precedence - right.precedence || left.id.localeCompare(right.id));
	const resolved = [];
	for (const route of routeFacts) {
		const senderAllowFrom = route.senderAllowFrom ?? (route.senderAllowFromSource === "effective-dm" ? input.allowlists.dm : route.senderAllowFromSource === "effective-group" ? input.allowlists.group : void 0);
		resolved.push({
			id: route.id,
			kind: route.kind,
			gate: route.gate,
			effect: route.effect,
			precedence: route.precedence,
			senderPolicy: route.senderPolicy,
			match: route.match,
			senderAllowlist: senderAllowFrom != null ? await resolveIngressAllowlist({
				input,
				rawEntries: senderAllowFrom,
				context: "route"
			}) : void 0
		});
	}
	return resolved;
}
async function resolveChannelIngressState(rawInput) {
	const input = {
		...rawInput,
		subject: normalizeSubjectAuthentication(rawInput.subject),
		event: {
			...rawInput.event,
			originSubject: rawInput.event.originSubject ? normalizeSubjectAuthentication(rawInput.event.originSubject) : void 0
		}
	};
	const [dm, pairingStore, group, commandOwner, commandGroup, routeFacts, eventOriginMatched] = await Promise.all([
		resolveIngressAllowlist({
			input,
			rawEntries: input.allowlists.dm,
			context: "dm"
		}),
		resolveIngressAllowlist({
			input,
			rawEntries: input.allowlists.pairingStore,
			context: "dm"
		}),
		resolveIngressAllowlist({
			input,
			rawEntries: input.allowlists.group,
			context: "group"
		}),
		resolveIngressAllowlist({
			input,
			rawEntries: input.allowlists.commandOwner,
			context: "command"
		}),
		resolveIngressAllowlist({
			input,
			rawEntries: input.allowlists.commandGroup,
			context: "command"
		}),
		resolveRouteFacts(input),
		originSubjectAuthentication(input)
	]);
	return {
		channelId: input.channelId,
		accountId: input.accountId,
		conversationKind: input.conversation.kind,
		event: {
			kind: input.event.kind,
			authMode: input.event.authMode,
			mayPair: input.event.mayPair,
			hasOriginSubject: input.event.originSubject != null,
			originSubjectMatched: eventOriginMatched !== void 0,
			...eventOriginMatched ? { originSubjectAuthentication: eventOriginMatched } : {}
		},
		mentionFacts: input.mentionFacts,
		routeFacts,
		allowlists: {
			dm,
			pairingStore,
			group,
			commandOwner,
			commandGroup
		}
	};
}
//#endregion
//#region src/channels/message-access/runtime.ts
/**
* Channel ingress runtime resolver.
*
* Merges route, sender, command, access-group, and pairing-store facts before decision evaluation.
*/
function commandRequested(policy) {
	return policy.command != null;
}
function normalizeChannelId(id) {
	const trimmed = id.trim();
	if (!trimmed) throw new Error("Channel ingress channel id must be non-empty.");
	return trimmed;
}
function findIngressGate(params) {
	return params.ingress.graph.gates.find((gate) => gate.phase === params.phase && gate.kind === params.kind);
}
function findSenderGate(ingress, isGroup) {
	return findIngressGate({
		ingress,
		phase: "sender",
		kind: isGroup ? "groupSender" : "dmSender"
	});
}
function useAccessGroupsFromConfig(params) {
	return params.useAccessGroups ?? true;
}
function channelIngressCommand(params = {}) {
	if (params.requested === false) return;
	const { requested: _requested, cfg, ...command } = params;
	return {
		...command,
		useAccessGroups: useAccessGroupsFromConfig({
			useAccessGroups: params.useAccessGroups,
			cfg
		}),
		allowTextCommands: params.allowTextCommands ?? false,
		hasControlCommand: params.hasControlCommand ?? true
	};
}
function channelIngressEvent(params = {}) {
	const isGroup = params.isGroup ?? false;
	return {
		kind: params.kind ?? "message",
		authMode: params.authMode ?? "inbound",
		mayPair: params.mayPair ?? !isGroup,
		...params.originSubject ? { originSubject: params.originSubject } : {}
	};
}
function resolveCommandInput(params) {
	if (params.command === false || params.command == null) return;
	return channelIngressCommand({
		...params.command,
		useAccessGroups: params.command.useAccessGroups ?? params.useAccessGroups
	});
}
function resolveResolverPolicy(params) {
	return {
		dmPolicy: params.input.dmPolicy ?? params.base.defaultDmPolicy ?? "pairing",
		groupPolicy: params.input.groupPolicy ?? params.base.defaultGroupPolicy ?? "disabled",
		groupAllowFromFallbackToAllowFrom: params.input.policy?.groupAllowFromFallbackToAllowFrom ?? params.base.groupAllowFromFallbackToAllowFrom,
		minIdentifierAuthentication: params.input.policy?.minIdentifierAuthentication ?? params.base.minIdentifierAuthentication,
		mutableIdentifierMatching: params.input.policy?.mutableIdentifierMatching ?? params.base.mutableIdentifierMatching,
		...params.input.policy?.activation ? { activation: params.input.policy.activation } : {}
	};
}
/**
* Create a reusable ingress resolver for one channel account and identity
* descriptor.
*/
function createChannelIngressResolverForOwner(base, owner) {
	const resolve = async (input, eventDefaults) => {
		const isGroup = input.conversation.kind !== "direct";
		const useAccessGroups = useAccessGroupsFromConfig({
			useAccessGroups: base.useAccessGroups,
			cfg: base.cfg
		});
		return await resolveChannelMessageIngressForOwner({
			channelId: base.channelId,
			accountId: base.accountId,
			identity: base.identity,
			subject: input.subject,
			conversation: input.conversation,
			contextBinding: input.contextBinding,
			event: channelIngressEvent({
				isGroup,
				...eventDefaults,
				...input.event
			}),
			policy: resolveResolverPolicy({
				base,
				input
			}),
			allowFrom: input.allowFrom,
			groupAllowFrom: input.groupAllowFrom,
			route: input.route,
			routeFacts: input.routeFacts,
			accessGroups: base.accessGroups ?? base.cfg?.accessGroups,
			accessGroupMembership: [...base.accessGroupMembership ?? [], ...input.accessGroupMembership ?? []],
			resolveAccessGroupMembership: base.resolveAccessGroupMembership,
			accessGroupMatchedAllowFromEntry: base.accessGroupMatchedAllowFromEntry,
			providerMissingFallbackApplied: input.providerMissingFallbackApplied,
			mentionFacts: input.mentionFacts,
			readStoreAllowFrom: base.readStoreAllowFrom,
			useDefaultPairingStore: base.useDefaultPairingStore,
			command: resolveCommandInput({
				command: input.command,
				useAccessGroups
			})
		}, owner);
	};
	return {
		message: async (input) => await resolve(input),
		command: async (input) => await resolve(input, {
			authMode: "command",
			mayPair: false
		}),
		event: async (input) => await resolve(input, { mayPair: false })
	};
}
/** Evaluate policy without admitting a host participant. */
function createChannelIngressPolicyResolver(base) {
	return createChannelIngressResolverForOwner(base);
}
/** One trusted registry generation supplies the private owner to all ingress operations. */
function createHostChannelIngressRuntime(owner) {
	return Object.freeze({
		createResolver: (base) => createChannelIngressResolverForOwner(base, owner),
		resolve: (params) => resolveChannelMessageIngressForOwner(params, owner),
		resolveStable: (params) => createChannelIngressResolverForOwner({
			...params,
			identity: defineStableChannelIngressIdentity(params.identity)
		}, owner).message(params)
	});
}
/**
* Resolve one inbound event using a simple stable subject identity descriptor.
*/
async function resolveStableChannelIngressPolicy(params) {
	return await createChannelIngressPolicyResolver({
		...params,
		identity: defineStableChannelIngressIdentity(params.identity)
	}).message(params);
}
function projectSenderAccess(params) {
	const gate = findSenderGate(params.ingress, params.isGroup);
	const reasonCode = !gate && params.isGroup && params.ingress.reasonCode === "route_sender_empty" && params.effectiveGroupAllowFrom.length === 0 ? "group_policy_empty_allowlist" : gate?.reasonCode ?? params.ingress.reasonCode;
	const decision = reasonCode === "dm_policy_pairing_required" ? "pairing" : gate?.allowed === true ? "allow" : "block";
	return {
		allowed: decision === "allow",
		decision,
		reasonCode,
		...gate ? { gate } : {},
		effectiveAllowFrom: params.effectiveAllowFrom,
		effectiveGroupAllowFrom: params.effectiveGroupAllowFrom,
		providerMissingFallbackApplied: params.providerMissingFallbackApplied ?? false
	};
}
function projectCommandAccess(params) {
	const gate = findIngressGate({
		ingress: params.ingress,
		phase: "command",
		kind: "command"
	});
	return {
		requested: commandRequested(params.policy),
		authorized: commandRequested(params.policy) ? gate?.allowed === true : false,
		shouldBlockControlCommand: gate?.command?.shouldBlockControlCommand === true,
		reasonCode: gate?.reasonCode ?? params.ingress.reasonCode,
		...gate ? { gate } : {}
	};
}
function projectActivationAccess(params) {
	const gate = findIngressGate({
		ingress: params.ingress,
		phase: "activation",
		kind: "mention"
	});
	return {
		ran: gate != null,
		allowed: gate?.allowed === true,
		shouldSkip: gate?.activation?.shouldSkip === true,
		reasonCode: gate?.reasonCode ?? params.ingress.reasonCode,
		...gate?.activation?.effectiveWasMentioned !== void 0 ? { effectiveWasMentioned: gate.activation.effectiveWasMentioned } : {},
		...gate?.activation?.shouldBypassMention !== void 0 ? { shouldBypassMention: gate.activation.shouldBypassMention } : {},
		...gate ? { gate } : {}
	};
}
function commandOwnerAllowFrom(params) {
	if (params.command?.commandOwnerAllowFrom != null) return params.command.commandOwnerAllowFrom;
	if (!params.isGroup) return params.effectiveAllowFrom;
	return params.command?.groupOwnerAllowFrom === "none" ? [] : params.configuredAllowFrom;
}
function commandGroupAllowFrom(params) {
	if (params.isGroup) return params.effectiveCommandGroupAllowFrom;
	return params.command?.directGroupAllowFrom === "effective" ? params.effectiveCommandGroupAllowFrom : [];
}
function accessGroupMatchedEntry(params) {
	const entry = params.accessGroupMatchedAllowFromEntry ?? params.subject.stableId;
	return entry == null ? null : String(entry);
}
function appendAccessGroupMatchedEntry(params) {
	return params.matchedEntry && params.allowlist.accessGroups.matched.length > 0 ? uniqueStrings([...params.entries, params.matchedEntry]) : params.entries;
}
/**
* Resolve sender, route, command, event, and activation gates for one inbound
* channel event.
*/
async function resolveChannelIngressPolicy(params) {
	return resolveChannelMessageIngressForOwner(params);
}
async function resolveChannelMessageIngressForOwner(params, owner) {
	const channelId = normalizeChannelId(params.channelId);
	const promptedAt = Date.now();
	const participantOwner = owner?.channelId === channelId && owner.isLive() ? owner : void 0;
	const participantGatewayContext = participantOwner?.resolveGatewayContext?.();
	const ownerIsCurrent = () => participantOwner?.isLive() === true && participantOwner.resolveGatewayContext?.() === participantGatewayContext;
	const participant = params.identity.resolveParticipant?.(params.subject);
	const senderId = params.subject.stableId == null ? void 0 : String(params.subject.stableId);
	const participantBinding = params.contextBinding && { ...params.contextBinding };
	const adapter = createIdentityAdapter(params.identity);
	const subject = createIdentitySubject(params.identity, params.subject);
	const routeFacts = [...routeFactsFromDescriptors(params.route), ...params.routeFacts ?? []];
	const storeAllowFrom = await readChannelIngressStoreAllowFrom({
		...params,
		channelId
	});
	const rawAllowFrom = normalizeStringEntries(params.allowFrom ?? []);
	const rawStoreAllowFrom = normalizeStringEntries(storeAllowFrom);
	const rawGroupAllowFrom = normalizeStringEntries(params.groupAllowFrom ?? []);
	const normalizeEffective = (entries, context) => normalizeEffectiveEntries({
		adapter,
		accountId: params.accountId,
		entries,
		context
	});
	const [normalizedAllowFrom, normalizedStoreAllowFrom, normalizedGroupAllowFrom] = await Promise.all([
		normalizeEffective(rawAllowFrom, "dm"),
		normalizeEffective(rawStoreAllowFrom, "dm"),
		normalizeEffective(rawGroupAllowFrom, "group")
	]);
	const accessGroupMembership = [...await resolveRuntimeAccessGroupMembershipFacts({
		input: params,
		channelId,
		names: allReferencedAccessGroupNames([
			rawAllowFrom,
			rawGroupAllowFrom,
			rawStoreAllowFrom,
			params.command?.commandOwnerAllowFrom ?? [],
			...routeFacts.map((route) => route.senderAllowFrom ?? [])
		])
	}), ...params.accessGroupMembership ?? []];
	const baseEffective = resolveChannelIngressEffectiveAllowFromLists({
		allowFrom: normalizedAllowFrom,
		groupAllowFrom: normalizedGroupAllowFrom,
		storeAllowFrom: normalizedStoreAllowFrom,
		dmPolicy: params.policy.dmPolicy,
		groupAllowFromFallbackToAllowFrom: params.policy.groupAllowFromFallbackToAllowFrom
	});
	const rawEffective = resolveChannelIngressEffectiveAllowFromLists({
		allowFrom: rawAllowFrom,
		groupAllowFrom: rawGroupAllowFrom,
		storeAllowFrom: rawStoreAllowFrom,
		dmPolicy: params.policy.dmPolicy,
		groupAllowFromFallbackToAllowFrom: params.policy.groupAllowFromFallbackToAllowFrom
	});
	const rawCommandGroup = resolveChannelIngressEffectiveAllowFromLists({
		allowFrom: rawAllowFrom,
		groupAllowFrom: rawGroupAllowFrom,
		dmPolicy: params.policy.dmPolicy,
		groupAllowFromFallbackToAllowFrom: params.command?.commandGroupAllowFromFallbackToAllowFrom ?? params.policy.groupAllowFromFallbackToAllowFrom
	});
	const isGroup = params.conversation.kind !== "direct";
	const policy = {
		...params.policy,
		...params.command !== void 0 ? { command: params.command } : {}
	};
	const state = await resolveChannelIngressState({
		channelId,
		accountId: params.accountId,
		subject,
		conversation: params.conversation,
		adapter,
		accessGroups: params.accessGroups,
		accessGroupMembership,
		routeFacts,
		mentionFacts: params.mentionFacts,
		event: params.event,
		allowlists: {
			dm: rawAllowFrom,
			group: rawEffective.effectiveGroupAllowFrom,
			pairingStore: rawStoreAllowFrom,
			commandOwner: commandOwnerAllowFrom({
				command: params.command,
				isGroup,
				configuredAllowFrom: rawAllowFrom,
				effectiveAllowFrom: rawEffective.effectiveAllowFrom
			}),
			commandGroup: commandGroupAllowFrom({
				command: params.command,
				isGroup,
				effectiveCommandGroupAllowFrom: rawCommandGroup.effectiveGroupAllowFrom
			})
		}
	});
	const ingress = decideChannelIngress(state, policy);
	const matchedAccessGroupEntry = accessGroupMatchedEntry(params);
	const senderAccess = projectSenderAccess({
		ingress,
		isGroup,
		effectiveAllowFrom: appendAccessGroupMatchedEntry({
			entries: baseEffective.effectiveAllowFrom,
			allowlist: state.allowlists.dm,
			matchedEntry: matchedAccessGroupEntry
		}),
		effectiveGroupAllowFrom: appendAccessGroupMatchedEntry({
			entries: baseEffective.effectiveGroupAllowFrom,
			allowlist: state.allowlists.group,
			matchedEntry: matchedAccessGroupEntry
		}),
		providerMissingFallbackApplied: params.providerMissingFallbackApplied
	});
	const result = {
		state,
		ingress,
		senderAccess,
		routeAccess: projectRouteAccess({
			ingress,
			route: params.route
		}),
		commandAccess: projectCommandAccess({
			ingress,
			policy
		}),
		activationAccess: projectActivationAccess({ ingress })
	};
	let participantInput;
	if ((participant || senderId) && participantBinding && participantOwner && ownerIsCurrent() && ingress.admission === "dispatch") {
		const verifiedPrincipal = subject.identifiers[0]?.authentication === "verified" && subject.identifiers[0]?.kind === "stable-id" && subject.identifiers[0]?.value ? {
			channelId,
			accountId: params.accountId ?? "default",
			senderId: subject.identifiers[0].value
		} : void 0;
		const commandOwnerAuthority = verifiedPrincipal && participantGatewayContext ? await prepareCommandOwnerAuthority(participantGatewayContext.getRuntimeConfig(), {
			channel: verifiedPrincipal.channelId,
			accountId: verifiedPrincipal.accountId,
			senderId: verifiedPrincipal.senderId
		}) : void 0;
		participantInput = {
			identity: participant ? {
				type: "remote",
				pluginId: channelId,
				domain: participant.domain,
				idKind: participant.idKind,
				id: participant.id
			} : {
				type: "observation",
				pluginId: channelId,
				accountId: params.accountId ?? null,
				senderKind: "unknown",
				id: senderId
			},
			binding: participantBinding,
			verifiedPrincipal,
			commandOwnerAuthority: ownerIsCurrent() ? commandOwnerAuthority : void 0,
			promptedAt,
			owner: participantOwner,
			gatewayContext: participantGatewayContext
		};
	}
	return recordChannelIngressResolution({
		result,
		owner: ownerIsCurrent() ? participantOwner : void 0,
		participantInput,
		channelId,
		accountId: params.accountId,
		rawPrincipalRef: params.subject.stableId,
		scope: {
			conversation: {
				kind: params.conversation.kind,
				id: params.conversation.id,
				parentId: params.conversation.parentId,
				threadId: params.conversation.threadId
			},
			contextBinding: params.contextBinding
		},
		participantOutcomeAffecting: senderAccess.gate?.match?.matched === true && (senderAccess.reasonCode === "dm_policy_allowlisted" || senderAccess.reasonCode === "group_policy_allowed") && !(isGroup ? state.allowlists.group.hasWildcard : state.allowlists.dm.hasWildcard || state.allowlists.pairingStore.hasWildcard),
		identifierAuthentication: ingress.graph.gates.some((gate) => gate.identifierAuthentication?.affectedMatch) ? "affected" : ingress.graph.gates.some((gate) => gate.identifierAuthentication?.evaluated) ? "evaluated" : "not-evaluated"
	});
}
//#endregion
export { channelIngressRoutes as a, meetsIdentifierAuthentication as c, resolveStableChannelIngressPolicy as i, createHostChannelIngressRuntime as n, defineStableChannelIngressIdentity as o, resolveChannelIngressPolicy as r, identityEntryAuthenticationClassifier as s, createChannelIngressPolicyResolver as t };
