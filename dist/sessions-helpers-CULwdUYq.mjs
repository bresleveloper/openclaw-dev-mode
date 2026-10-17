import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { E as parseRawSessionConversationRef, M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { l as SessionRowSchema, r as SessionCreatedActorSchema } from "./sessions-row-DAFw32gg.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-DrfSAS1s.mjs";
import { l as isGatewayClientRequestError } from "./call-DnqhP17M.mjs";
import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import "./lifecycle-DdaXH8bC.mjs";
import { i as recordExecutionDecisionWork } from "./execution-decision-work-CnVx5C7h.mjs";
import { c as sessionOwnershipLookupDenied, o as renderSessionVisibilityDenial, r as logSessionOwnershipLookupFailure, t as createSessionVisibilityDecisionChecker } from "./session-visibility-internal-D2EfOhU9.mjs";
import { n as createSessionVisibilityChecker, o as resolveEffectiveSessionToolsVisibility, s as resolveSandboxSessionToolsVisibility, t as createAgentToAgentPolicy } from "./session-visibility-BA6GpxqH.mjs";
import { l as stringEnum } from "./typebox-X-jU33BZ.mjs";
import { n as callAgentToolGatewayRequest } from "./in-process-gateway-5-3wumVL.mjs";
import { a as resolveInternalSessionKey, n as lookupRequesterSessionOwnership, o as resolveMainSessionAlias } from "./sessions-resolution-xzpaoE7C.mjs";
import { randomUUID } from "node:crypto";
import { Type } from "typebox";
//#region src/agents/tools/sessions-access.ts
function readDescribedSessionVisibilityRow(value) {
	if (!isRecord(value)) return null;
	const key = normalizeOptionalString(value.key);
	if (!key) return null;
	return {
		key,
		agentId: normalizeOptionalString(value.agentId),
		ownerSessionKey: normalizeOptionalString(value.ownerSessionKey),
		spawnedBy: normalizeOptionalString(value.spawnedBy),
		parentSessionKey: normalizeOptionalString(value.parentSessionKey),
		sessionId: normalizeOptionalString(value.sessionId)
	};
}
/** Render operator guidance only when a tool presents a private access decision. */
const formatSessionToolAccessDenial = renderSessionVisibilityDenial;
function recordAdmittedSessionDecision(params) {
	const caller = getGatewayToolCallerIdentity();
	if (!caller?.executionIdentityToken || !caller.receiptAuthority) return false;
	try {
		if (caller.receiptAuthority() === false) return false;
	} catch {
		return false;
	}
	const receiptId = `${params.owner}:${randomUUID()}`;
	return recordExecutionDecisionWork({
		workVersion: 1,
		token: caller.executionIdentityToken,
		receipt: {
			schemaVersion: 1,
			receiptId,
			occurredAt: Date.now(),
			action: {
				family: "session",
				operation: params.action
			},
			decision: {
				outcome: params.outcome,
				reasonCode: params.reasonCode
			},
			enforcement: {
				coverageState: params.coverageState,
				policyRefs: params.policyRefs ?? [],
				grantRefs: [],
				contextFieldsUsed: params.contextFieldsUsed
			},
			source: {
				owner: params.owner,
				recordRef: receiptId,
				decisionBoundary: params.decisionBoundary
			},
			missingEvidence: params.missingEvidence ?? [],
			remediation: []
		},
		refs: { target: {
			namespace: "session",
			value: JSON.stringify([params.targetAgentId, params.targetSessionKey])
		} }
	});
}
/** Queue an owner-native model-mediated session result after its final await. */
function recordSessionToolActionFact(params) {
	const reasonCode = `session_${params.operation.replaceAll("-", "_")}_${params.fact.replaceAll("-", "_")}`;
	return recordAdmittedSessionDecision({
		action: params.operation,
		targetAgentId: params.targetAgentId,
		targetSessionKey: params.targetSessionKey,
		outcome: params.fact === "conflict" ? "denied" : params.fact === "no-op" ? "not-applicable" : "allowed",
		reasonCode,
		coverageState: "attribution-only",
		contextFieldsUsed: ["targetAgentId", "sessionActionResult"],
		owner: "session-action",
		decisionBoundary: "session-tool.result"
	});
}
/** Record owner-native lifecycle conflicts without classifying presentation text. */
async function runSessionToolActionWithConflictReceipt(params) {
	try {
		return await params.run();
	} catch (error) {
		if (isGatewayClientRequestError(error) && isRecord(error.details) && error.details.reason === "session-changed") recordSessionToolActionFact({
			operation: params.operation,
			fact: "conflict",
			targetAgentId: params.targetAgentId,
			targetSessionKey: params.targetSessionKey
		});
		throw error;
	}
}
/** Check one prepared target without re-listing the requester's spawned sessions. */
async function resolveSessionToolAccess(params) {
	const authorizationTargetSessionKey = params.authorizationTargetSessionKey ?? params.targetSessionKey;
	const deny = (denial) => {
		recordAdmittedSessionDecision({
			action: params.displayAction ?? params.action,
			targetAgentId: params.targetAgentId,
			targetSessionKey: authorizationTargetSessionKey,
			outcome: "denied",
			reasonCode: denial.reasonCode,
			coverageState: denial.missingEvidence.length > 0 ? "unknown" : "enforced",
			policyRefs: denial.policyRefs,
			contextFieldsUsed: denial.contextFieldsUsed,
			missingEvidence: denial.missingEvidence,
			owner: "session-access",
			decisionBoundary: "session-tool.access"
		});
		return denial;
	};
	if (params.sessionReadScopeKey) {
		const capped = createSessionVisibilityDecisionChecker({
			action: params.action,
			defaultAgentId: params.targetAgentId,
			requesterAgentId: params.requesterAgentId,
			requesterSessionKey: params.sessionReadScopeKey,
			visibility: "self",
			a2aPolicy: params.a2aPolicy
		}).check({
			key: authorizationTargetSessionKey,
			agentId: params.targetAgentId
		});
		if (!capped.allowed) return deny(capped);
	}
	const scoped = await createSessionVisibilityChecker.resolveScopedAccessAsync({
		action: params.action,
		requesterSessionKey: params.requesterSessionKey,
		targetSessionKey: authorizationTargetSessionKey
	});
	if (scoped) return {
		allowed: true,
		expectedSessionId: scoped.expectedSessionId
	};
	const decisionChecker = createSessionVisibilityDecisionChecker({
		action: params.action,
		defaultAgentId: params.targetAgentId,
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		mainSessionKey: params.mainSessionKey,
		explicitTargetAgentOwnership: !parseAgentSessionKey(authorizationTargetSessionKey),
		visibility: params.visibility,
		a2aPolicy: params.a2aPolicy
	});
	const check = (requesterOwned) => decisionChecker.check({
		key: authorizationTargetSessionKey,
		agentId: params.targetAgentId,
		...requesterOwned ? { spawnedBy: params.requesterSessionKey } : {}
	});
	const initial = check(false);
	if (initial.allowed) return initial;
	const requesterOwnedAccess = check(true);
	if (params.requesterOwned) return requesterOwnedAccess.allowed ? requesterOwnedAccess : deny(requesterOwnedAccess);
	if (!requesterOwnedAccess.allowed) return deny(initial);
	if (params.action === "history" && params.displayAction !== "search" && authorizationTargetSessionKey === params.targetSessionKey) try {
		const row = readDescribedSessionVisibilityRow((await (params.callGateway ?? callAgentToolGatewayRequest)({
			method: "sessions.describe",
			params: { key: params.targetSessionKey }
		}))?.session);
		if (row?.key === params.targetSessionKey) {
			const access = decisionChecker.check(row);
			if (!access.allowed) return deny(access);
			if (row.sessionId) return {
				allowed: true,
				expectedSessionId: row.sessionId
			};
		}
	} catch {}
	const ownership = await lookupRequesterSessionOwnership({
		requesterSessionKey: params.requesterSessionKey,
		requesterAgentId: params.requesterAgentId,
		targetSessionKey: params.targetSessionKey,
		targetAgentId: params.targetAgentId,
		callGateway: params.callGateway
	});
	if (!ownership.ok) {
		logSessionOwnershipLookupFailure({
			requesterSessionKey: params.requesterSessionKey,
			failure: ownership.error
		});
		return deny(sessionOwnershipLookupDenied(ownership.error.kind));
	}
	if (ownership.value) return requesterOwnedAccess;
	return deny(initial);
}
/** Resolves the requester context used to filter sandboxed session-tool access. */
function resolveSandboxedSessionToolContext(params) {
	const { mainKey, alias, scope } = resolveMainSessionAlias(params.cfg);
	const visibility = resolveSandboxSessionToolsVisibility(params.cfg);
	const requesterSessionKey = normalizeOptionalString(params.agentSessionKey);
	const requesterInternalKey = requesterSessionKey ? resolveInternalSessionKey({
		key: requesterSessionKey,
		alias
	}) : void 0;
	const effectiveRequesterKey = requesterInternalKey ?? alias;
	const restrictToSpawned = params.sandboxed === true && visibility === "spawned" && Boolean(requesterInternalKey) && !isSubagentSessionKey(requesterInternalKey);
	const requesterAgentId = parseAgentSessionKey(requesterInternalKey)?.agentId ?? (!restrictToSpawned && requesterInternalKey === alias ? resolveSessionAgentId({
		config: params.cfg,
		sessionKey: requesterInternalKey,
		agentId: params.requesterAgentId
	}) : void 0);
	return {
		mainKey,
		alias,
		visibility,
		requesterInternalKey,
		mainSessionKey: !restrictToSpawned && requesterAgentId ? resolveCanonicalMainSessionKey({
			agentId: requesterAgentId,
			mainKey,
			sessionScope: scope
		}) : void 0,
		effectiveRequesterKey,
		restrictToSpawned
	};
}
//#endregion
//#region src/agents/tools/sessions-helpers.ts
const SESSION_LIST_KINDS = [
	"main",
	"group",
	"cron",
	"hook",
	"node",
	"other"
];
const SESSION_KIND_BY_CLASSIFICATION = {
	main: "main",
	global: "main",
	group: "group",
	channel: "group",
	cron: "cron",
	hook: "hook",
	node: "node"
};
const SessionInventoryActorSchema = Type.Omit(SessionCreatedActorSchema, ["avatarUrl"]);
const SessionListRowSchema = Type.Object({
	...Type.Pick(SessionRowSchema, [
		"key",
		"sessionId",
		"label",
		"worktree",
		"repositoryWorkspaceId",
		"repository",
		"execCwd",
		"spawnedCwd",
		"spawnedWorkspaceDir",
		"projectId",
		"workspaceDir",
		"displayName",
		"derivedTitle",
		"lastMessagePreview",
		"parentSessionKey",
		"model",
		"contextTokens",
		"totalTokens",
		"status",
		"childSessions"
	]).properties,
	agentId: Type.String(),
	kind: stringEnum(SESSION_LIST_KINDS),
	channel: Type.String(),
	archived: Type.Boolean(),
	pinned: Type.Boolean(),
	createdActor: Type.Optional(SessionInventoryActorSchema),
	owner: Type.Optional(Type.Object({ actor: SessionInventoryActorSchema }, { additionalProperties: false })),
	group: Type.Optional(Type.String({ description: "Custom sidebar group membership; unrelated to kind \"group\" (group chats)." })),
	updatedAt: Type.Optional(Type.Number()),
	stateVersion: Type.Optional(Type.Number()),
	abortedLastRun: Type.Optional(Type.Boolean()),
	messages: Type.Optional(Type.Array(Type.Unknown()))
}, { additionalProperties: false });
function resolveSessionToolContext(opts) {
	const cfg = opts?.config ?? getRuntimeConfig();
	return {
		cfg,
		a2aPolicy: createAgentToAgentPolicy(cfg),
		sessionVisibility: opts?.sessionReadScopeKey ? "self" : resolveEffectiveSessionToolsVisibility({
			cfg,
			sandboxed: opts?.sandboxed === true
		}),
		...resolveSandboxedSessionToolContext({
			cfg,
			agentSessionKey: opts?.sessionReadScopeKey ?? opts?.agentSessionKey,
			requesterAgentId: opts?.requesterAgentIdOverride ?? opts?.agentId,
			sandboxed: opts?.sandboxed
		})
	};
}
function classifySessionListKind(params) {
	if (params.classification === "thread") return params.peerKind === "group" || params.peerKind === "channel" ? "group" : "other";
	return SESSION_KIND_BY_CLASSIFICATION[params.classification] ?? "other";
}
function deriveChannel(params) {
	if (params.kind === "cron" || params.kind === "hook" || params.kind === "node") return "internal";
	return normalizeOptionalString(params.channel) ?? normalizeOptionalString(params.lastChannel) ?? parseRawSessionConversationRef(params.key)?.channel ?? "unknown";
}
//#endregion
export { resolveSessionToolContext as a, resolveSandboxedSessionToolContext as c, deriveChannel as i, resolveSessionToolAccess as l, SessionListRowSchema as n, formatSessionToolAccessDenial as o, classifySessionListKind as r, recordSessionToolActionFact as s, SESSION_LIST_KINDS as t, runSessionToolActionWithConflictReceipt as u };
