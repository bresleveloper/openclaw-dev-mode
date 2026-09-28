//#region src/channels/message-access/admission-decision-receipt.ts
/** Project one owner-native channel decision into the shared receipt contract. */
function createChannelAdmissionDecisionReceipt(params) {
	const missingEvidence = params.coverageState === "unknown" ? ["channel.admission_evidence"] : params.coverageState === "unsupported" ? ["channel.adapter_identity"] : params.coverageState === "attribution-only" ? ["decision.participant_effect"] : [];
	const identifierPolicyEvaluated = params.identifierAuthentication === "affected" || params.identifierAuthentication === "evaluated";
	return {
		schemaVersion: 1,
		receiptId: `${params.contextId}:channel-admission`,
		contextId: params.contextId,
		executionId: params.executionId,
		runId: params.runId,
		occurredAt: params.occurredAt,
		action: {
			family: "channel",
			operation: "admission",
			summary: "Channel ingress admitted this agent execution."
		},
		decision: {
			outcome: params.coverageState === "unknown" || params.coverageState === "unsupported" ? "unknown" : "allowed",
			reasonCode: params.identifierAuthentication === "affected" ? "channel_ingress_identifier_authentication_applied" : params.coverageState === "enforced" ? "channel_ingress_participant_enforced" : params.coverageState === "attribution-only" ? "channel_ingress_attribution_only" : params.coverageState === "unsupported" ? "channel_ingress_identity_unsupported" : "channel_ingress_identity_unknown"
		},
		enforcement: {
			coverageState: params.coverageState,
			evaluatorRef: "channel-ingress",
			policyRefs: identifierPolicyEvaluated ? ["channel.identifier-authentication"] : [],
			grantRefs: [],
			contextFieldsUsed: [...params.coverageState === "enforced" ? ["invoker.principal"] : [], ...params.identifierAuthentication === "affected" ? ["channel.identifier-authentication"] : []]
		},
		source: {
			owner: "channel-ingress",
			recordRef: `${params.contextId}:channel-admission`,
			decisionBoundary: "channel-ingress.run-admission"
		},
		missingEvidence,
		remediation: params.coverageState === "enforced" ? [] : [{
			code: "treat_as_diagnostic_provenance",
			text: "Treat this receipt as diagnostic provenance, not authorization."
		}]
	};
}
//#endregion
//#region src/channels/message-access/admission-evidence-scope-key.ts
const MAX_CHANNEL_ADMISSION_SCOPE_BYTES = 32768;
const MAX_CHANNEL_ADMISSION_SCOPE_NODES = 256;
const INVALID_SCOPE_VALUE = Symbol("invalid-channel-admission-scope-value");
function snapshotOwnedData(value, budget = { nodes: 0 }, depth = 0) {
	budget.nodes += 1;
	if (budget.nodes > MAX_CHANNEL_ADMISSION_SCOPE_NODES || depth > 6) return INVALID_SCOPE_VALUE;
	if (value === void 0 || value === null || typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") return Number.isFinite(value) ? value : INVALID_SCOPE_VALUE;
	if (typeof value !== "object") return INVALID_SCOPE_VALUE;
	let descriptors;
	try {
		descriptors = Object.getOwnPropertyDescriptors(value);
		if (Object.getOwnPropertySymbols(value).some((key) => Object.getOwnPropertyDescriptor(value, key)?.enumerable)) return INVALID_SCOPE_VALUE;
	} catch {
		return INVALID_SCOPE_VALUE;
	}
	const keys = Object.keys(descriptors).filter((key) => descriptors[key]?.enumerable).toSorted();
	const entries = [];
	for (const key of keys) {
		const descriptor = descriptors[key];
		if (!descriptor || !("value" in descriptor)) return INVALID_SCOPE_VALUE;
		const captured = snapshotOwnedData(descriptor.value, budget, depth + 1);
		if (captured === INVALID_SCOPE_VALUE) return INVALID_SCOPE_VALUE;
		entries.push([key, captured]);
	}
	return Array.isArray(value) ? ["array", entries] : ["record", entries];
}
function stableOwnedScopeKey(value) {
	const snapshot = snapshotOwnedData(value);
	if (snapshot === INVALID_SCOPE_VALUE) return;
	try {
		const key = JSON.stringify(snapshot);
		return key.length <= MAX_CHANNEL_ADMISSION_SCOPE_BYTES ? key : void 0;
	} catch {
		return;
	}
}
function safeOwnPropertyDescriptor(value, key) {
	try {
		return Object.getOwnPropertyDescriptor(value, key);
	} catch {
		return INVALID_SCOPE_VALUE;
	}
}
function ownDataValue(value, key) {
	const descriptor = safeOwnPropertyDescriptor(value, key);
	if (descriptor === INVALID_SCOPE_VALUE) return INVALID_SCOPE_VALUE;
	if (!descriptor) return;
	return "value" in descriptor ? descriptor.value : INVALID_SCOPE_VALUE;
}
function publicResultScopeKey(result) {
	const stateValue = ownDataValue(result, "state");
	if (!stateValue || typeof stateValue !== "object") return;
	const routeFacts = ownDataValue(stateValue, "routeFacts");
	if (!Array.isArray(routeFacts)) return;
	const routeCount = ownDataValue(routeFacts, "length");
	if (typeof routeCount !== "number" || routeCount > MAX_CHANNEL_ADMISSION_SCOPE_NODES) return;
	const routes = [];
	for (let index = 0; index < routeCount; index += 1) {
		const descriptor = safeOwnPropertyDescriptor(routeFacts, String(index));
		if (descriptor === INVALID_SCOPE_VALUE) return;
		const route = descriptor && "value" in descriptor ? descriptor.value : void 0;
		if (!route || typeof route !== "object") return;
		routes.push({
			id: ownDataValue(route, "id"),
			kind: ownDataValue(route, "kind"),
			gate: ownDataValue(route, "gate"),
			effect: ownDataValue(route, "effect"),
			precedence: ownDataValue(route, "precedence"),
			senderPolicy: ownDataValue(route, "senderPolicy")
		});
	}
	return stableOwnedScopeKey({
		accountId: ownDataValue(stateValue, "accountId"),
		channelId: ownDataValue(stateValue, "channelId"),
		conversationKind: ownDataValue(stateValue, "conversationKind"),
		event: ownDataValue(stateValue, "event"),
		routeFacts: routes
	});
}
const FINALIZED_CONTEXT_SCOPE_FIELDS = [
	"OriginatingChannel",
	"AccountId",
	"SenderId",
	"ChatType",
	"ChatId",
	"SessionKey",
	"AgentId",
	"DmScope",
	"ParentSessionKey",
	"ModelParentSessionKey",
	"MessageSid",
	"MessageSidFull",
	"ReplyToId",
	"ReplyToIdFull",
	"To",
	"From",
	"OriginatingTo",
	"MessageThreadId",
	"NativeChannelId",
	"ThreadParentId",
	"InboundEventKind",
	"Provider",
	"Surface",
	"NativeDirectUserId"
];
function finalizedContextScopeKey(context) {
	const entries = [];
	for (const key of FINALIZED_CONTEXT_SCOPE_FIELDS) {
		const descriptor = safeOwnPropertyDescriptor(context, key);
		if (descriptor === INVALID_SCOPE_VALUE) return;
		if (!descriptor) {
			entries.push([key, "absent"]);
			continue;
		}
		if (!("value" in descriptor)) return;
		const value = descriptor.value;
		if (value !== void 0 && value !== null && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return;
		entries.push([
			key,
			"present",
			value
		]);
	}
	return stableOwnedScopeKey(entries);
}
function scopedParticipantRef(params) {
	const channelId = params.channelId;
	const accountId = params.accountId || "default";
	const rawPrincipalRef = params.rawPrincipalRef == null ? "" : String(params.rawPrincipalRef);
	if (!channelId || !rawPrincipalRef) return;
	const scoped = JSON.stringify([
		channelId,
		accountId,
		rawPrincipalRef
	]);
	return scoped.length <= 4096 ? scoped : void 0;
}
/** Brand an exact resolver object with its non-authoritative input binding. */
function snapshotContextBinding(value) {
	if (!value || typeof value !== "object") return;
	const agentId = ownDataValue(value, "agentId");
	const sessionKey = ownDataValue(value, "sessionKey");
	const messageId = ownDataValue(value, "messageId");
	const nativeChannelId = ownDataValue(value, "nativeChannelId");
	const inboundEventKind = ownDataValue(value, "inboundEventKind");
	if (typeof agentId !== "string" || typeof sessionKey !== "string" || messageId !== void 0 && typeof messageId !== "string" || nativeChannelId !== void 0 && typeof nativeChannelId !== "string" || inboundEventKind !== "user_request" && inboundEventKind !== "room_event") return;
	return Object.freeze({
		agentId,
		sessionKey,
		messageId,
		nativeChannelId,
		inboundEventKind
	});
}
function normalizeScopeId(value) {
	if (value === void 0 || value === null) return;
	return typeof value === "string" || typeof value === "number" ? String(value) : INVALID_SCOPE_VALUE;
}
function contextHandoffMatches(params) {
	const conversation = ownDataValue(params.contextParams, "conversation");
	const route = ownDataValue(params.contextParams, "route");
	const reply = ownDataValue(params.contextParams, "reply");
	const message = ownDataValue(params.contextParams, "message");
	if (!conversation || typeof conversation !== "object" || !route || typeof route !== "object" || !reply || typeof reply !== "object" || !message || typeof message !== "object") return false;
	const expected = params.binding.scope?.conversation;
	const expectedContext = params.binding.contextBinding;
	if (!expected || !expectedContext) return false;
	const routeAccountId = ownDataValue(route, "accountId");
	const effectiveAccountId = routeAccountId === void 0 ? params.accountId : normalizeScopeId(routeAccountId);
	if (effectiveAccountId === INVALID_SCOPE_VALUE) return false;
	const conversationKind = ownDataValue(conversation, "kind");
	const conversationId = normalizeScopeId(ownDataValue(conversation, "id"));
	const conversationParentId = normalizeScopeId(ownDataValue(conversation, "parentId"));
	const conversationThreadId = normalizeScopeId(ownDataValue(conversation, "threadId"));
	const replyThreadId = normalizeScopeId(ownDataValue(reply, "messageThreadId"));
	const replyParentId = normalizeScopeId(ownDataValue(reply, "threadParentId"));
	const nativeConversationId = normalizeScopeId(ownDataValue(conversation, "nativeChannelId"));
	const nativeReplyId = normalizeScopeId(ownDataValue(reply, "nativeChannelId"));
	const routeAgentId = normalizeScopeId(ownDataValue(route, "agentId"));
	const dispatchSessionKey = normalizeScopeId(ownDataValue(route, "dispatchSessionKey"));
	const routeSessionKey = normalizeScopeId(ownDataValue(route, "routeSessionKey"));
	const inboundEventKindValue = ownDataValue(message, "inboundEventKind");
	const inboundEventKind = inboundEventKindValue === void 0 || inboundEventKindValue === null ? "user_request" : normalizeScopeId(inboundEventKindValue);
	if ([
		conversationId,
		conversationParentId,
		conversationThreadId,
		replyThreadId,
		replyParentId,
		nativeConversationId,
		nativeReplyId,
		routeAgentId,
		dispatchSessionKey,
		routeSessionKey,
		inboundEventKind
	].includes(INVALID_SCOPE_VALUE)) return false;
	const nativeId = nativeReplyId ?? nativeConversationId;
	if (expectedContext.nativeChannelId !== void 0 && nativeId !== expectedContext.nativeChannelId || expectedContext.nativeChannelId === void 0 && typeof nativeId === "string" && ![
		expected.id,
		expected.parentId,
		expected.threadId
	].includes(nativeId)) return false;
	if (replyThreadId !== void 0 && conversationThreadId !== void 0 && replyThreadId !== conversationThreadId || replyParentId !== void 0 && conversationParentId !== void 0 && replyParentId !== conversationParentId || nativeReplyId !== void 0 && nativeConversationId !== void 0 && nativeReplyId !== nativeConversationId) return false;
	return scopedParticipantRef(params.binding) === scopedParticipantRef({
		channelId: params.channelId,
		accountId: effectiveAccountId,
		rawPrincipalRef: params.rawPrincipalRef
	}) && conversationKind === expected.kind && conversationId === expected.id && (replyParentId ?? conversationParentId) === expected.parentId && (replyThreadId ?? conversationThreadId) === expected.threadId && routeAgentId === expectedContext.agentId && (dispatchSessionKey ?? routeSessionKey) === expectedContext.sessionKey && inboundEventKind === expectedContext.inboundEventKind;
}
//#endregion
//#region src/channels/message-access/admission-evidence.ts
const CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS = 16;
const CHANNEL_ADMISSION_EVIDENCE_MAX_AGE_MS = 2592e6;
const CONTEXT_ADMISSION = Symbol("openclaw.channelContextAdmission");
var ChannelAdmissionAudit = class {
	#enabled;
	#closed = false;
	#revision = {};
	#sink;
	constructor(params) {
		this.#enabled = params.enabled;
		this.#sink = params.decisionSink;
	}
	get enabled() {
		return this.#enabled;
	}
	configure(enabled) {
		if (this.#closed || enabled === this.#enabled) return;
		this.#enabled = enabled;
		this.#revision = {};
	}
	captureCurrent() {
		const revision = this.#revision;
		return () => this.#enabled && this.#revision === revision;
	}
	recordDecision(receipt) {
		return this.#enabled ? this.#sink?.(receipt) ?? false : false;
	}
	close() {
		this.#closed = true;
		this.#enabled = false;
		this.#revision = {};
		this.#sink = void 0;
	}
};
function createChannelAdmissionAudit(params) {
	return new ChannelAdmissionAudit(params);
}
var AdmissionEvidence = class {
	#payload;
	#audit;
	#isCurrent;
	#consumed;
	constructor(payload, audit) {
		this.kind = "channel-admission-evidence";
		this.#consumed = false;
		this.#payload = payload;
		this.#audit = audit;
		this.#isCurrent = audit?.captureCurrent();
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value) {
		return value !== void 0 && value !== null && typeof value === "object" && #payload in value && (value.#isCurrent?.() ?? true) ? {
			payload: value.#payload,
			audit: value.#audit,
			consumed: value.#consumed
		} : void 0;
	}
	static consume(value) {
		if (value !== null && typeof value === "object" && #payload in value) value.#consumed = true;
	}
};
var PreparedChannelAdmissionEvidence = class {
	#consumed = false;
	#evidence;
	#resolver;
	#owner;
	#gatewayContext;
	constructor(evidence, resolver, owner) {
		this.#evidence = evidence;
		this.#resolver = resolver;
		this.#owner = owner;
		this.#gatewayContext = owner?.resolveGatewayContext?.();
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static take(value) {
		if (!value || typeof value !== "object" || !(#consumed in value) || value.#consumed) return;
		value.#consumed = true;
		const current = !value.#owner || value.#owner.isLive() && value.#owner.resolveGatewayContext?.() === value.#gatewayContext;
		return {
			evidence: current ? value.#evidence : unknownChannelAdmissionEvidence(AdmissionEvidence.read(value.#evidence)?.audit),
			resolver: current ? value.#resolver : void 0
		};
	}
};
var ContextAdmission = class {
	#context;
	#value;
	constructor(context, value) {
		this.#context = context;
		this.#value = Object.freeze(value);
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, context) {
		return value !== null && typeof value === "object" && #context in value && value.#context === context ? value.#value : void 0;
	}
};
function readContextAdmission(context) {
	return ContextAdmission.read(ownDataValue(context, CONTEXT_ADMISSION), context);
}
function writeContextAdmission(context, value) {
	Object.defineProperty(context, CONTEXT_ADMISSION, {
		value: new ContextAdmission(context, value),
		configurable: true
	});
}
var HostIngressResolution = class {
	#binding;
	#participant;
	constructor(binding, participant) {
		this.#binding = binding;
		this.#participant = participant;
		Object.setPrototypeOf(this, null);
	}
	static read(value) {
		return value !== null && typeof value === "object" && #binding in value ? value.#binding : void 0;
	}
	static takeParticipant(value) {
		if (value === null || typeof value !== "object" || !(#binding in value)) return;
		const participant = value.#binding.handoff.accepted ? value.#participant : void 0;
		value.#participant = void 0;
		return participant;
	}
};
function takeChannelParticipantInput(result) {
	return HostIngressResolution.takeParticipant(result);
}
function mintChannelAdmissionEvidence(audit, payload) {
	if (!audit?.enabled) return;
	return new AdmissionEvidence(Object.freeze({
		...payload,
		createdAt: Date.now()
	}), audit);
}
function unsupportedChannelAdmissionEvidence(audit) {
	const payload = {
		kind: "leaf",
		contribution: Object.freeze({ participant: { state: "unsupported" } })
	};
	return audit ? mintChannelAdmissionEvidence(audit, payload) : new AdmissionEvidence(Object.freeze({
		...payload,
		createdAt: Date.now()
	}), void 0);
}
function participantContribution(params) {
	const rawPrincipalRef = scopedParticipantRef(params);
	return Object.freeze(rawPrincipalRef ? { participant: Object.freeze({
		state: "present",
		rawPrincipalRef
	}) } : { participant: Object.freeze({ state: "unknown" }) });
}
function recordChannelIngressResolution(params) {
	const owner = params.owner;
	if (!owner || owner.channelId !== params.channelId || !owner.isLive()) return params.result;
	const activeOwner = owner;
	const binding = Object.freeze({
		channelId: params.channelId,
		accountId: params.accountId,
		rawPrincipalRef: params.rawPrincipalRef,
		participantOutcomeAffecting: params.participantOutcomeAffecting,
		identifierAuthentication: params.identifierAuthentication,
		owner: activeOwner,
		gatewayContext: activeOwner.resolveGatewayContext?.(),
		scope: Object.freeze({ conversation: Object.freeze({ ...params.scope.conversation }) }),
		contextBinding: snapshotContextBinding(params.scope.contextBinding),
		publicScopeKey: publicResultScopeKey(params.result),
		handoff: { consumed: false }
	});
	return Object.assign(new HostIngressResolution(binding, params.participantInput), params.result);
}
function unknownChannelAdmissionEvidence(audit) {
	return mintChannelAdmissionEvidence(audit, {
		kind: "leaf",
		contribution: Object.freeze({ participant: { state: "unknown" } })
	});
}
/** Consume and validate the exact resolver-to-context handoff before context construction. */
function prepareHostChannelContextAdmissionEvidence(params) {
	const audit = params.owner?.resolveGatewayContext?.()?.channelAdmissionAudit;
	if (params.ingress === "unsupported") return new PreparedChannelAdmissionEvidence(unsupportedChannelAdmissionEvidence(audit), void 0, params.owner);
	const results = params.ingress === void 0 ? [] : Array.isArray(params.ingress) ? params.ingress : [params.ingress];
	const seen = /* @__PURE__ */ new Set();
	const validBindings = [];
	let valid = results.length > 0 && results.length <= CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS;
	for (const [index, result] of results.entries()) {
		const binding = HostIngressResolution.read(result);
		const firstUse = binding !== void 0 && !binding.handoff.consumed && !seen.has(result);
		if (binding && !binding.handoff.consumed) binding.handoff.consumed = true;
		seen.add(result);
		const ownerMatches = params.owner !== void 0 && binding?.owner === params.owner && binding.gatewayContext === params.owner.resolveGatewayContext?.() && params.owner.isLive();
		const resultIngress = ownDataValue(result, "ingress");
		const resultMatches = binding?.publicScopeKey !== void 0 && publicResultScopeKey(result) === binding.publicScopeKey && resultIngress !== null && typeof resultIngress === "object" && ownDataValue(resultIngress, "admission") === "dispatch";
		const contextMatches = binding !== void 0 && contextHandoffMatches({
			...params,
			binding,
			rawPrincipalRef: index === results.length - 1 ? params.rawPrincipalRef : binding.rawPrincipalRef
		});
		if (!firstUse || !ownerMatches || !resultMatches || !contextMatches || !binding) valid = false;
		else validBindings.push(binding);
	}
	const contextMessageId = normalizeScopeId(ownDataValue(params.contextParams, "messageId"));
	const finalMessageId = validBindings.at(-1)?.contextBinding?.messageId;
	if (contextMessageId === INVALID_SCOPE_VALUE || finalMessageId !== void 0 && contextMessageId !== finalMessageId) valid = false;
	if (valid) for (const binding of validBindings) binding.handoff.accepted = true;
	const sources = valid ? validBindings.map((binding) => {
		const contribution = participantContribution(binding);
		return mintChannelAdmissionEvidence(audit, {
			kind: "leaf",
			contribution: Object.freeze({
				...contribution,
				decision: Object.freeze({
					participantAware: contribution.participant.state === "present",
					outcomeAffecting: binding.participantOutcomeAffecting,
					identifierAuthentication: binding.identifierAuthentication
				})
			})
		});
	}) : [];
	return new PreparedChannelAdmissionEvidence(valid ? combineChannelAdmissionEvidence(sources) : unknownChannelAdmissionEvidence(audit), valid ? params.owner?.resolveGatewayContext : void 0, params.owner);
}
/** Attach one prepared private carrier to the exact finalized context scope. */
function bindHostChannelContextAdmissionEvidence(params) {
	const prepared = PreparedChannelAdmissionEvidence.take(params.preparation);
	const scope = finalizedContextScopeKey(params.context);
	const audit = AdmissionEvidence.read(prepared?.evidence)?.audit;
	writeContextAdmission(params.context, {
		scope,
		evidence: scope !== void 0 ? prepared?.evidence : unknownChannelAdmissionEvidence(audit),
		resolver: scope !== void 0 ? prepared?.resolver : void 0
	});
}
function readChannelContextAdmissionEvidence(context) {
	return readContextAdmission(context)?.evidence;
}
function readChannelContextGatewayContextResolver(context) {
	return readContextAdmission(context)?.resolver;
}
/** Preserve private evidence only when its owner explicitly replaces an unchanged context. */
function copyChannelParticipantAdmissionEvidence(source, target) {
	const original = readContextAdmission(source);
	if (!original) return;
	const targetScope = finalizedContextScopeKey(target);
	const sameScope = original.scope !== void 0 && targetScope === original.scope;
	const safeEvidence = sameScope && activePayload(original.evidence, Date.now()) !== void 0 ? original.evidence : unknownChannelAdmissionEvidence(AdmissionEvidence.read(original.evidence)?.audit);
	const current = readContextAdmission(target);
	const resolverConflict = current?.resolverConflict === true || Boolean(current?.resolver && original.resolver && current.resolver !== original.resolver);
	writeContextAdmission(target, {
		scope: targetScope,
		evidence: safeEvidence,
		resolver: sameScope && !resolverConflict ? original.resolver : void 0,
		resolverConflict
	});
}
function activePayload(evidence, now) {
	const stored = AdmissionEvidence.read(evidence);
	if (!stored || stored.consumed) return;
	const { payload, audit } = stored;
	return (!audit || audit.enabled) && now - payload.createdAt <= CHANNEL_ADMISSION_EVIDENCE_MAX_AGE_MS ? payload : void 0;
}
/** Preserve one source exactly; collected sources get one new bounded opaque aggregate. */
function combineChannelAdmissionEvidence(evidence) {
	if (evidence.length === 1) return evidence[0];
	const audit = evidence.map((entry) => AdmissionEvidence.read(entry)?.audit).find((entry) => entry !== void 0);
	if (!audit?.enabled) return;
	if (evidence.length > CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS || evidence.some((entry) => AdmissionEvidence.read(entry)?.audit !== audit)) return unknownChannelAdmissionEvidence(audit);
	return mintChannelAdmissionEvidence(audit, {
		kind: "aggregate",
		sources: Object.freeze([...evidence])
	});
}
function inspectContributions(params) {
	const payload = activePayload(params.evidence, params.now);
	if (!payload || !params.evidence || params.seen.has(params.evidence)) return [{ participant: { state: "unknown" } }];
	params.seen.add(params.evidence);
	return payload.kind === "leaf" ? [payload.contribution] : payload.sources.flatMap((source) => inspectContributions({
		...params,
		evidence: source
	}));
}
/** Compare opaque participants without exposing or consuming their raw references. */
function compareChannelAdmissionParticipants(evidence) {
	const contributions = evidence.flatMap((candidate) => inspectContributions({
		evidence: candidate,
		now: Date.now(),
		seen: /* @__PURE__ */ new Set()
	}));
	if (contributions.length === 0 || contributions.length > CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS) return "mixed-or-unknown";
	const participants = contributions.map((item) => item.participant);
	const first = participants[0];
	return first?.state === "present" && participants.every((item) => item.state === "present" && item.rawPrincipalRef === first.rawPrincipalRef) ? "same" : "mixed-or-unknown";
}
function consumeContributions(params) {
	const payload = activePayload(params.evidence, params.now);
	if (!payload || !params.evidence || params.seen.has(params.evidence)) return [{ participant: { state: "unknown" } }];
	params.seen.add(params.evidence);
	AdmissionEvidence.consume(params.evidence);
	if (payload.kind === "leaf") return [payload.contribution];
	const contributions = payload.sources.flatMap((source) => consumeContributions({
		...params,
		evidence: source
	}));
	return contributions.length <= CHANNEL_ADMISSION_EVIDENCE_MAX_CONTRIBUTIONS ? contributions : [{ participant: { state: "unknown" } }];
}
function freezeConsumed(value) {
	return Object.freeze({
		...value,
		invoker: Object.freeze(value.invoker)
	});
}
/** Consume one aggregate at run admission. Missing, forged, stale, or reused carriers are unknown. */
function consumeChannelAdmissionEvidence(evidence) {
	const contributions = consumeContributions({
		evidence,
		now: Date.now(),
		seen: /* @__PURE__ */ new Set()
	});
	const participants = contributions.map((item) => item.participant);
	if (participants.length > 0 && participants.every((item) => item.state === "unsupported")) return freezeConsumed({
		ingressState: "unsupported",
		invoker: { state: "unknown" },
		decisionCoverage: "unsupported",
		identifierAuthentication: "unknown"
	});
	const present = participants.filter((item) => item.state === "present");
	if (!(present.length === participants.length && present.every((item) => item.rawPrincipalRef === present[0]?.rawPrincipalRef)) || !present[0]) return freezeConsumed({
		ingressState: "unknown",
		invoker: { state: "unknown" },
		decisionCoverage: "unknown",
		identifierAuthentication: "unknown"
	});
	const everyDecisionEnforced = contributions.every((item) => item.decision?.participantAware && item.decision.outcomeAffecting);
	const identifierAuthentication = contributions.some((item) => item.decision?.identifierAuthentication === "affected") ? "affected" : contributions.some((item) => item.decision?.identifierAuthentication === "evaluated") ? "evaluated" : contributions.every((item) => item.decision?.identifierAuthentication === "not-evaluated") ? "not-evaluated" : "unknown";
	return freezeConsumed({
		ingressState: "present",
		invoker: {
			state: "present",
			kind: "person",
			rawPrincipalRef: present[0].rawPrincipalRef
		},
		assuranceRef: "channel-admission",
		decisionCoverage: everyDecisionEnforced ? "enforced" : "attribution-only",
		identifierAuthentication
	});
}
/** Queue the channel decision after its exact identity tuple on the shared audit FIFO. */
function recordChannelAdmissionDecision(evidence, params) {
	const stored = AdmissionEvidence.read(evidence);
	return stored?.audit ? stored.audit.recordDecision(createChannelAdmissionDecisionReceipt(params)) : false;
}
//#endregion
export { copyChannelParticipantAdmissionEvidence as a, readChannelContextAdmissionEvidence as c, recordChannelIngressResolution as d, takeChannelParticipantInput as f, consumeChannelAdmissionEvidence as i, readChannelContextGatewayContextResolver as l, combineChannelAdmissionEvidence as n, createChannelAdmissionAudit as o, compareChannelAdmissionParticipants as r, prepareHostChannelContextAdmissionEvidence as s, bindHostChannelContextAdmissionEvidence as t, recordChannelAdmissionDecision as u };
