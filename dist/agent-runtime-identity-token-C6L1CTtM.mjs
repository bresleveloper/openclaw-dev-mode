import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { O as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { a as loadExecApprovalsAsync, r as ensureExecApprovalsSnapshot } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-3hhMmAVK.mjs";
import { c as hasCronCreatorGrantProvenance } from "./cron-creator-authority-grant-C15WEDjs.mjs";
import { a as resolveMessageActionTurnCapability } from "./message-action-turn-capability-CfssNzR2.mjs";
import { createHmac, randomUUID } from "node:crypto";
//#region src/gateway/agent-runtime-execution-lineage.ts
const AGENT_RUNTIME_EXECUTION_LINEAGE = Symbol("agentRuntimeExecutionLineage");
const AGENT_RUNTIME_EXECUTION_LINEAGE_REDEMPTION = Symbol("agentRuntimeExecutionLineageRedemption");
const EXECUTION_LINEAGE_HANDOFF_TTL_MS = 6e4;
const MAX_EXECUTION_LINEAGE_HANDOFFS = 256;
function hasAgentRuntimeExecutionLineageRedemption(identity) {
	return AGENT_RUNTIME_EXECUTION_LINEAGE_REDEMPTION in identity;
}
const executionLineageHandoffs = resolveGlobalMap(Symbol.for("openclaw.agentRuntimeExecutionLineageHandoffs"), (handoffs) => handoffs.clear());
function sameOperationalRunInstance(left, right) {
	return left.instanceId === right.instanceId && left.runId === right.runId;
}
function pruneExecutionLineageHandoffs(nowMs) {
	for (const [id, handoff] of executionLineageHandoffs) if (handoff.expiresAtMs <= nowMs || !validateAgentRunDelegatedAuthority(handoff.delegatedAuthority)) executionLineageHandoffs.delete(id);
	while (executionLineageHandoffs.size >= MAX_EXECUTION_LINEAGE_HANDOFFS) {
		const oldest = executionLineageHandoffs.keys().next().value;
		if (typeof oldest !== "string") break;
		executionLineageHandoffs.delete(oldest);
	}
}
/** Add process-local lineage without expanding or serializing the spawn context. */
function withAgentRuntimeExecutionLineage(context, lineage) {
	return {
		...context,
		[AGENT_RUNTIME_EXECUTION_LINEAGE]: lineage
	};
}
function readAgentRuntimeExecutionLineage(context) {
	return context?.[AGENT_RUNTIME_EXECUTION_LINEAGE];
}
/** Register a local one-shot handoff; its opaque id is correlation, never authority. */
function createAgentRuntimeExecutionLineageHandoff(params) {
	if (!readAgentRuntimeExecutionLineage(params.sessionSpawnContext) || !validateAgentRunDelegatedAuthority(params.delegatedAuthority)) return;
	if (!sameOperationalRunInstance(params.operationalRunInstance, params.delegatedAuthority.operationalRunInstance) || params.executionIdentity !== void 0 && params.executionIdentity.runId !== params.operationalRunInstance.runId) throw new Error("execution lineage handoff disagrees with its parent admission");
	const nowMs = Date.now();
	pruneExecutionLineageHandoffs(nowMs);
	const id = randomUUID();
	executionLineageHandoffs.set(id, Object.freeze({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		operationalRunInstance: params.operationalRunInstance,
		delegatedAuthority: params.delegatedAuthority,
		...params.executionIdentity ? { executionIdentity: params.executionIdentity } : {},
		sessionSpawnContext: params.sessionSpawnContext,
		expiresAtMs: nowMs + EXECUTION_LINEAGE_HANDOFF_TTL_MS
	}));
	return Object.freeze({
		id,
		revoke: () => {
			executionLineageHandoffs.delete(id);
		}
	});
}
/** Redeem the host-owned handoff while binding it to the exact signed parent owner. */
function redeemAgentRuntimeExecutionLineageHandoff(params) {
	const handoff = executionLineageHandoffs.get(params.id);
	executionLineageHandoffs.delete(params.id);
	if (!handoff || handoff.expiresAtMs <= Date.now() || handoff.agentId !== params.agentId || handoff.sessionKey !== params.sessionKey || !sameOperationalRunInstance(handoff.operationalRunInstance, params.operationalRunInstance) || handoff.delegatedAuthority.claimId !== params.delegatedAuthority.claimId || handoff.delegatedAuthority.lifecycleGeneration !== params.delegatedAuthority.lifecycleGeneration || !validateAgentRunDelegatedAuthority(handoff.delegatedAuthority)) return;
	let consumed = false;
	return Object.freeze({
		...handoff.executionIdentity ? { executionIdentity: handoff.executionIdentity } : {},
		sessionSpawnContext: handoff.sessionSpawnContext,
		redemption: Object.freeze({ consume: () => {
			if (consumed || !validateAgentRunDelegatedAuthority(handoff.delegatedAuthority)) return false;
			consumed = true;
			return true;
		} })
	});
}
function withAgentRuntimeExecutionLineageRedemption(identity, redemption) {
	return {
		...identity,
		[AGENT_RUNTIME_EXECUTION_LINEAGE_REDEMPTION]: redemption
	};
}
/** Direct in-process lineage needs no redemption; handed-off lineage is one-shot. */
function consumeAgentRuntimeExecutionLineage(identity) {
	return hasAgentRuntimeExecutionLineageRedemption(identity) ? identity[AGENT_RUNTIME_EXECUTION_LINEAGE_REDEMPTION].consume() : true;
}
//#endregion
//#region src/gateway/agent-runtime-identity-token.ts
const AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT = "openclaw:gateway-agent-runtime-identity-token:v1";
const AGENT_RUNTIME_IDENTITY_TOKEN_KIND = "agent-runtime";
const MESSAGE_ACTION_TOKEN_TTL_MS = 6e4;
const CRON_SELF_MANAGEMENT_TOKEN_TTL_MS = 6e4;
const normalizedRequiredStringSchema = string().transform(normalizeOptionalString).pipe(string());
const ignoredOptionalStringSchema = unknown().transform(normalizeOptionalString).optional();
const safeNonNegativeIntegerSchema = number().refine(Number.isSafeInteger).refine((value) => value >= 0);
const operationalRunInstanceSchema = object({
	instanceId: normalizedRequiredStringSchema,
	runId: normalizedRequiredStringSchema
});
const gatewayUiCommandTargetSchema = object({
	connId: normalizedRequiredStringSchema,
	profileId: normalizedRequiredStringSchema.optional()
});
const workerTurnClaimSchema = object({
	sessionId: normalizedRequiredStringSchema,
	claimId: normalizedRequiredStringSchema,
	runId: normalizedRequiredStringSchema,
	placementGeneration: safeNonNegativeIntegerSchema,
	owner: object({
		kind: literal("worker"),
		environmentId: normalizedRequiredStringSchema,
		ownerEpoch: safeNonNegativeIntegerSchema
	})
}).transform((claim) => ({
	sessionId: claim.sessionId,
	claimId: claim.claimId,
	runId: claim.runId,
	placementGeneration: claim.placementGeneration,
	owner: claim.owner
}));
const delegatedAuthoritySchema = discriminatedUnion("kind", [object({
	kind: literal("local"),
	lifecycleGeneration: normalizedRequiredStringSchema,
	claimId: normalizedRequiredStringSchema,
	operationalRunInstance: operationalRunInstanceSchema
}), object({
	kind: literal("worker"),
	lifecycleGeneration: normalizedRequiredStringSchema,
	claimId: normalizedRequiredStringSchema,
	operationalRunInstance: operationalRunInstanceSchema,
	turnClaim: workerTurnClaimSchema
})]);
const stringListSchema = array(string()).transform((entries) => entries.map((entry) => entry.trim()).filter(Boolean));
const spawnModelAutoSelectionSchema = object({
	model: normalizedRequiredStringSchema,
	hasFallbackOrigin: boolean()
});
const sessionSpawnContextSchema = object({
	requesterProfileId: normalizedRequiredStringSchema.optional(),
	completionOwnerSessionKey: normalizedRequiredStringSchema.optional(),
	resolvedModel: object({
		provider: normalizedRequiredStringSchema,
		model: normalizedRequiredStringSchema
	}).optional(),
	inheritedToolPolicy: object({
		version: literal(1),
		allow: stringListSchema,
		deny: stringListSchema
	}),
	spawnModelAutoSelection: spawnModelAutoSelectionSchema.optional()
}).transform((context) => ({
	...context.requesterProfileId ? { requesterProfileId: context.requesterProfileId } : {},
	...context.completionOwnerSessionKey ? { completionOwnerSessionKey: context.completionOwnerSessionKey } : {},
	inheritedToolPolicy: context.inheritedToolPolicy,
	...context.resolvedModel ? { resolvedModel: context.resolvedModel } : {},
	...context.spawnModelAutoSelection ? { spawnModelAutoSelection: context.spawnModelAutoSelection } : {}
}));
const cronCreatorAuthorityGrantSchema = object({
	runId: normalizedRequiredStringSchema,
	token: normalizedRequiredStringSchema
}).transform((grant) => grant);
const messageActionToolContextSchema = object({
	currentChannelId: ignoredOptionalStringSchema,
	currentChatType: unknown().transform((value) => normalizeChatType(typeof value === "string" ? value : void 0)).optional(),
	currentMessagingTarget: ignoredOptionalStringSchema,
	currentGraphChannelId: ignoredOptionalStringSchema,
	currentChannelProvider: ignoredOptionalStringSchema,
	currentThreadTs: ignoredOptionalStringSchema,
	currentMessageId: union([string(), number()]).optional(),
	currentSourceTurnId: ignoredOptionalStringSchema,
	replyToMode: _enum([
		"off",
		"first",
		"all",
		"batched"
	]).optional(),
	hasRepliedRef: object({ value: boolean() }).optional(),
	sameChannelThreadRequired: boolean().optional().catch(void 0),
	skipCrossContextDecoration: boolean().optional().catch(void 0)
}).transform((context) => ({
	...context,
	currentChannelProvider: context.currentChannelProvider
}));
const messageActionContextSchema = object({
	expiresAtMs: number().finite(),
	turnCapability: normalizedRequiredStringSchema.optional(),
	sourceReplyFinal: boolean().optional(),
	sourceReplyToolCallId: normalizedRequiredStringSchema.optional(),
	sessionId: ignoredOptionalStringSchema,
	sourceReplySessionKey: ignoredOptionalStringSchema,
	requesterAccountId: ignoredOptionalStringSchema,
	requesterSenderId: ignoredOptionalStringSchema,
	requesterSenderName: ignoredOptionalStringSchema,
	requesterSenderUsername: ignoredOptionalStringSchema,
	requesterSenderE164: ignoredOptionalStringSchema,
	toolContext: messageActionToolContextSchema.optional()
});
const cronSelfManagementContextSchema = object({
	jobId: normalizedRequiredStringSchema,
	expiresAtMs: number().finite()
});
const agentRuntimeIdentityTokenPayloadSchema = object({
	kind: literal(AGENT_RUNTIME_IDENTITY_TOKEN_KIND),
	agentId: string(),
	sessionKey: string(),
	operationalRunInstance: operationalRunInstanceSchema,
	delegatedAuthority: delegatedAuthoritySchema,
	approvalOwnerPluginId: string().optional().catch(void 0),
	executionIdentity: unknown().optional(),
	turnSourceChannel: string().optional().catch(void 0),
	turnSourceLocal: literal(true).optional(),
	turnSourceTo: string().optional().catch(void 0),
	turnSourceAccountId: string().optional().catch(void 0),
	turnSourceThreadId: union([string(), number()]).optional().catch(void 0),
	gatewayUiCommandTarget: gatewayUiCommandTargetSchema.optional(),
	messageActionContext: messageActionContextSchema.optional(),
	cronSelfManagementContext: cronSelfManagementContextSchema.optional(),
	cronToolsAllowCapture: literal("final-executable-surface").optional(),
	cronExecToolTarget: object({
		host: literal("gateway"),
		ask: literal("always").optional()
	}).optional(),
	cronCreatorAuthorityGrant: cronCreatorAuthorityGrantSchema.optional(),
	cronManagementGrant: cronCreatorAuthorityGrantSchema.optional(),
	sessionSpawnContext: sessionSpawnContextSchema.optional(),
	executionLineageHandoffId: normalizedRequiredStringSchema.optional()
});
function decodeDelegatedAuthority(value, operationalRunInstance) {
	const { lifecycleGeneration, claimId } = value;
	const { instanceId, runId } = value.operationalRunInstance;
	if (!lifecycleGeneration || !claimId || instanceId !== operationalRunInstance.instanceId || runId !== operationalRunInstance.runId) return;
	const owner = {
		operationalRunInstance,
		lifecycleGeneration,
		claimId
	};
	if (value.kind === "local") return {
		kind: "local",
		...owner
	};
	return value.turnClaim.runId === operationalRunInstance.runId ? {
		kind: "worker",
		...owner,
		turnClaim: value.turnClaim
	} : void 0;
}
async function readSharedAgentRuntimeIdentitySecret() {
	return (await loadExecApprovalsAsync()).socket?.token?.trim() || null;
}
async function requireSharedAgentRuntimeIdentitySecret() {
	const token = (await ensureExecApprovalsSnapshot()).file.socket?.token?.trim();
	if (!token) throw new Error("Unable to mint agent runtime identity token without local socket credentials.");
	return token;
}
function signPayload(secret, payload) {
	return createHmac("sha256", secret).update(AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT).update("\0").update(payload).digest("base64url");
}
function encodePayload(payload) {
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function decodeMessageActionContext(value, nowMs) {
	if (nowMs >= value.expiresAtMs) return;
	const context = {
		expiresAtMs: value.expiresAtMs,
		turnCapability: value.turnCapability,
		sessionId: value.sessionId,
		sourceReplySessionKey: value.sourceReplySessionKey,
		requesterAccountId: value.requesterAccountId,
		requesterSenderId: value.requesterSenderId,
		requesterSenderName: value.requesterSenderName,
		requesterSenderUsername: value.requesterSenderUsername,
		requesterSenderE164: value.requesterSenderE164,
		toolContext: value.toolContext
	};
	if (value.sourceReplyFinal === true) {
		if (!value.sourceReplyToolCallId) return;
		return {
			...context,
			sourceReplyFinal: true,
			sourceReplyToolCallId: value.sourceReplyToolCallId
		};
	}
	return {
		...context,
		...value.sourceReplyFinal === false ? { sourceReplyFinal: false } : {},
		...value.sourceReplyToolCallId ? { sourceReplyToolCallId: value.sourceReplyToolCallId } : {}
	};
}
function decodePayload(value, nowMs) {
	try {
		return parsePayload(JSON.parse(Buffer.from(value, "base64url").toString("utf8")), nowMs);
	} catch {
		return;
	}
}
function parsePayload(value, nowMs) {
	try {
		const result = agentRuntimeIdentityTokenPayloadSchema.safeParse(value);
		if (!result.success) return;
		const raw = result.data;
		const agentId = normalizeAgentId(raw.agentId);
		const sessionKey = raw.sessionKey.trim();
		const approvalOwnerPluginId = normalizeOptionalString(raw.approvalOwnerPluginId);
		const operationalInstanceId = raw.operationalRunInstance.instanceId;
		const operationalRunId = raw.operationalRunInstance.runId;
		const turnSourceAccountId = normalizeOptionalAccountId(raw.turnSourceAccountId);
		const turnSourceChannel = normalizeOptionalString(raw.turnSourceChannel);
		const turnSourceLocal = raw.turnSourceLocal;
		if (turnSourceLocal && turnSourceChannel) return;
		const turnSourceTo = normalizeOptionalString(raw.turnSourceTo);
		const turnSourceThreadId = raw.turnSourceThreadId;
		if (!agentId || !sessionKey || !operationalInstanceId || !operationalRunId) return;
		const operationalRunInstance = Object.freeze({
			instanceId: operationalInstanceId,
			runId: operationalRunId
		});
		const delegatedAuthority = decodeDelegatedAuthority(raw.delegatedAuthority, operationalRunInstance);
		if (!delegatedAuthority) return;
		const messageActionContext = raw.messageActionContext ? decodeMessageActionContext(raw.messageActionContext, nowMs) : void 0;
		if (raw.messageActionContext !== void 0 && !messageActionContext) return;
		const cronSelfManagementContext = raw.cronSelfManagementContext && nowMs < raw.cronSelfManagementContext.expiresAtMs ? raw.cronSelfManagementContext : void 0;
		if (raw.cronSelfManagementContext !== void 0 && !cronSelfManagementContext) return;
		const sessionSpawnContext = raw.sessionSpawnContext;
		const executionLineageHandoffId = raw.executionLineageHandoffId;
		const cronToolsAllowCapture = raw.cronToolsAllowCapture;
		const cronExecToolTarget = cronToolsAllowCapture ? raw.cronExecToolTarget : void 0;
		const cronCreatorAuthorityGrant = raw.cronCreatorAuthorityGrant;
		if (!hasCronCreatorGrantProvenance(raw, operationalRunId)) return;
		let executionIdentity;
		if (raw.executionIdentity !== void 0) try {
			executionIdentity = parseExecutionIdentityAdmissionToken(raw.executionIdentity);
		} catch {
			return;
		}
		if (executionIdentity?.runId !== operationalRunId) executionIdentity = void 0;
		return {
			kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
			agentId,
			sessionKey,
			operationalRunInstance,
			delegatedAuthority,
			...approvalOwnerPluginId ? { approvalOwnerPluginId } : {},
			...turnSourceChannel ? { turnSourceChannel } : {},
			...turnSourceLocal ? { turnSourceLocal } : {},
			...turnSourceTo ? { turnSourceTo } : {},
			...turnSourceAccountId ? { turnSourceAccountId } : {},
			...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {},
			...raw.gatewayUiCommandTarget ? { gatewayUiCommandTarget: Object.freeze(raw.gatewayUiCommandTarget) } : {},
			...messageActionContext ? { messageActionContext } : {},
			...cronSelfManagementContext ? { cronSelfManagementContext } : {},
			...sessionSpawnContext ? { sessionSpawnContext } : {},
			...executionLineageHandoffId ? { executionLineageHandoffId } : {},
			...cronToolsAllowCapture ? { cronToolsAllowCapture } : {},
			...cronExecToolTarget ? { cronExecToolTarget } : {},
			...cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant } : {},
			...raw.cronManagementGrant ? { cronManagementGrant: raw.cronManagementGrant } : {},
			...executionIdentity ? { executionIdentity } : {}
		};
	} catch {
		return;
	}
}
function prepareAgentRuntimeIdentityTokenPayload(params) {
	const operationalInstanceId = normalizeOptionalString(params.operationalRunInstance.instanceId);
	const operationalRunId = normalizeOptionalString(params.operationalRunInstance.runId);
	if (!operationalInstanceId || !operationalRunId) throw new Error("agent runtime identity requires an operational run instance");
	const parsedSessionSpawnContext = params.sessionSpawnContext ? sessionSpawnContextSchema.safeParse(params.sessionSpawnContext) : void 0;
	if (parsedSessionSpawnContext && !parsedSessionSpawnContext.success) throw new Error("agent runtime session spawn context violates its bounded contract");
	const sessionSpawnContext = parsedSessionSpawnContext?.data;
	const executionLineageHandoffId = normalizeOptionalString(params.executionLineageHandoffId);
	if (executionLineageHandoffId && (sessionSpawnContext || params.executionIdentityToken)) throw new Error("execution lineage handoff cannot duplicate private spawn facts");
	const activeAuthority = getActiveAgentRunDelegatedAuthority({
		instanceId: operationalInstanceId,
		runId: operationalRunId
	});
	if (!activeAuthority) throw new Error("agent runtime identity requires active delegated run authority");
	if (params.workerTurnClaim && (params.workerTurnClaim.owner.kind !== "worker" || params.workerTurnClaim.runId !== operationalRunId)) throw new Error("worker delegated authority disagrees with the operational run");
	const approvalAuthority = params.approvalAuthority ?? activeAuthority;
	if (approvalAuthority.operationalRunInstance.instanceId !== operationalInstanceId || approvalAuthority.operationalRunInstance.runId !== operationalRunId || !validateAgentRunDelegatedAuthority(approvalAuthority)) throw new Error("agent runtime approval authority is no longer active");
	const delegatedAuthority = params.workerTurnClaim ? {
		kind: "worker",
		...approvalAuthority,
		turnClaim: params.workerTurnClaim
	} : {
		kind: "local",
		...approvalAuthority
	};
	if (!hasCronCreatorGrantProvenance(params, operationalRunId)) throw new Error("cron creator authority grants require tool-surface or authenticated-requester provenance");
	if (params.messageActionContext?.sourceReplyFinal === true && !normalizeOptionalString(params.messageActionContext.sourceReplyToolCallId)) throw new Error("terminal source reply requires tool-call correlation");
	const messageActionContext = params.messageActionContext ? {
		...params.messageActionContext,
		expiresAtMs: Math.min(params.messageActionContext.expiresAtMs, Date.now() + MESSAGE_ACTION_TOKEN_TTL_MS)
	} : void 0;
	const turnSourceAccountId = normalizeOptionalAccountId(params.turnSourceAccountId);
	const turnSourceChannel = normalizeOptionalString(params.turnSourceChannel);
	if (params.turnSourceLocal === true && turnSourceChannel) throw new Error("agent runtime turn source cannot be both local and channel-bound");
	const turnSourceTo = normalizeOptionalString(params.turnSourceTo);
	const turnSourceThreadId = typeof params.turnSourceThreadId === "string" ? normalizeOptionalString(params.turnSourceThreadId) : params.turnSourceThreadId;
	const cronSelfManagementJobId = normalizeOptionalString(params.cronSelfManagementJobId);
	const cronSelfManagementContext = cronSelfManagementJobId ? {
		jobId: cronSelfManagementJobId,
		expiresAtMs: Date.now() + CRON_SELF_MANAGEMENT_TOKEN_TTL_MS
	} : void 0;
	return {
		kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
		agentId: normalizeAgentId(params.agentId),
		sessionKey: params.sessionKey.trim(),
		operationalRunInstance: {
			instanceId: operationalInstanceId,
			runId: operationalRunId
		},
		delegatedAuthority,
		...normalizeOptionalString(params.approvalOwnerPluginId) ? { approvalOwnerPluginId: normalizeOptionalString(params.approvalOwnerPluginId) } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...params.turnSourceLocal === true ? { turnSourceLocal: true } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...turnSourceAccountId ? { turnSourceAccountId } : {},
		...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {},
		...params.gatewayUiCommandTarget ? { gatewayUiCommandTarget: gatewayUiCommandTargetSchema.parse(params.gatewayUiCommandTarget) } : {},
		...messageActionContext ? { messageActionContext } : {},
		...cronSelfManagementContext ? { cronSelfManagementContext } : {},
		...params.cronToolsAllowCapture === "final-executable-surface" ? { cronToolsAllowCapture: params.cronToolsAllowCapture } : {},
		...params.cronToolsAllowCapture === "final-executable-surface" && params.cronExecToolTarget?.host === "gateway" ? { cronExecToolTarget: { ...params.cronExecToolTarget } } : {},
		...params.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: params.cronCreatorAuthorityGrant } : {},
		...params.cronManagementGrant ? { cronManagementGrant: params.cronManagementGrant } : {},
		...sessionSpawnContext ? { sessionSpawnContext } : {},
		...executionLineageHandoffId ? { executionLineageHandoffId } : {},
		...params.executionIdentityToken?.runId === operationalRunId ? { executionIdentity: params.executionIdentityToken } : {}
	};
}
/** Measure the exact ASCII token size without reading signing credentials or minting a bearer. */
function measureAgentRuntimeIdentityTokenBytes(params) {
	const payload = encodePayload(prepareAgentRuntimeIdentityTokenPayload(params));
	return Buffer.byteLength(`${payload}.${signPayload("", payload)}`, "utf8");
}
/** Mint an opaque token that lets trusted local agent-tool clients identify their agent. */
async function mintAgentRuntimeIdentityToken(params) {
	const payload = encodePayload(prepareAgentRuntimeIdentityTokenPayload(params));
	return `${payload}.${signPayload(await requireSharedAgentRuntimeIdentitySecret(), payload)}`;
}
/** Validate a presented agent runtime token and return the internal caller identity. */
async function verifyAgentRuntimeIdentityToken(value, nowMs) {
	const token = value?.trim();
	if (!token) return;
	const [payloadPart, signature, ...extra] = token.split(".");
	if (!payloadPart || !signature || extra.length > 0) return;
	const sharedSecret = await readSharedAgentRuntimeIdentitySecret();
	if (!sharedSecret || !safeEqualSecret(signature, signPayload(sharedSecret, payloadPart))) return;
	const payload = decodePayload(payloadPart, nowMs ?? Date.now());
	if (!payload) return;
	return resolveAgentRuntimeIdentityPayload(payload);
}
/** Build a host-owned caller identity without minting or reading transport credentials. */
async function createAgentRuntimeIdentity(params) {
	const payload = parsePayload(prepareAgentRuntimeIdentityTokenPayload(params), Date.now());
	return payload ? resolveAgentRuntimeIdentityPayload(payload) : void 0;
}
function resolveAgentRuntimeIdentityPayload(payload) {
	const handoff = payload.executionLineageHandoffId ? redeemAgentRuntimeExecutionLineageHandoff({
		id: payload.executionLineageHandoffId,
		agentId: payload.agentId,
		sessionKey: payload.sessionKey,
		operationalRunInstance: payload.operationalRunInstance,
		delegatedAuthority: payload.delegatedAuthority
	}) : void 0;
	if (payload.executionLineageHandoffId && !handoff) return;
	const executionIdentity = handoff?.executionIdentity ?? payload.executionIdentity;
	const sessionSpawnContext = handoff?.sessionSpawnContext ?? payload.sessionSpawnContext;
	const identity = {
		kind: "agentRuntime",
		agentId: payload.agentId,
		sessionKey: payload.sessionKey,
		operationalRunInstance: payload.operationalRunInstance,
		delegatedAuthority: payload.delegatedAuthority,
		...payload.approvalOwnerPluginId ? { approvalOwnerPluginId: payload.approvalOwnerPluginId } : {},
		...executionIdentity ? { executionIdentity } : {},
		...payload.turnSourceChannel ? { turnSourceChannel: payload.turnSourceChannel } : {},
		...payload.turnSourceLocal === true ? { turnSourceLocal: true } : {},
		...payload.turnSourceTo ? { turnSourceTo: payload.turnSourceTo } : {},
		...payload.turnSourceAccountId ? { turnSourceAccountId: payload.turnSourceAccountId } : {},
		...payload.turnSourceThreadId !== void 0 ? { turnSourceThreadId: payload.turnSourceThreadId } : {},
		...payload.gatewayUiCommandTarget ? { gatewayUiCommandTarget: payload.gatewayUiCommandTarget } : {},
		...payload.messageActionContext ? { messageActionContext: payload.messageActionContext } : {},
		...payload.cronSelfManagementContext ? { cronSelfManagementContext: payload.cronSelfManagementContext } : {},
		...payload.cronToolsAllowCapture ? { cronToolsAllowCapture: payload.cronToolsAllowCapture } : {},
		...payload.cronExecToolTarget ? { cronExecToolTarget: payload.cronExecToolTarget } : {},
		...payload.cronManagementGrant ? { cronManagementGrant: payload.cronManagementGrant } : {},
		...payload.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: payload.cronCreatorAuthorityGrant } : {},
		...sessionSpawnContext ? { sessionSpawnContext } : {}
	};
	return handoff ? withAgentRuntimeExecutionLineageRedemption(identity, handoff.redemption) : identity;
}
function validateAgentRuntimeDelegatedAuthority(authority, placements) {
	if (!validateAgentRunDelegatedAuthority(authority)) return false;
	return authority.kind === "local" ? true : placements?.validateTurnClaim?.(authority.turnClaim) === true;
}
/** Builds the use-time approval gate from the run owner and canonical worker store. */
function createAgentRuntimeApprovalAuthorityValidator(placements) {
	return (identity) => {
		if (!validateAgentRuntimeDelegatedAuthority(identity.delegatedAuthority, placements)) return false;
		const messageActionContext = identity.messageActionContext;
		if (!messageActionContext) return true;
		if (!messageActionContext.turnCapability) return false;
		return Boolean(resolveMessageActionTurnCapability({
			token: messageActionContext.turnCapability,
			agentId: identity.agentId,
			runId: identity.operationalRunInstance.runId,
			sessionKey: identity.sessionKey,
			sessionId: messageActionContext.sessionId
		}));
	};
}
//#endregion
export { verifyAgentRuntimeIdentityToken as a, readAgentRuntimeExecutionLineage as c, mintAgentRuntimeIdentityToken as i, withAgentRuntimeExecutionLineage as l, createAgentRuntimeIdentity as n, consumeAgentRuntimeExecutionLineage as o, measureAgentRuntimeIdentityTokenBytes as r, createAgentRuntimeExecutionLineageHandoff as s, createAgentRuntimeApprovalAuthorityValidator as t };
