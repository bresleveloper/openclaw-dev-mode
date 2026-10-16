import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-CtZdPPcK.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { c as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import crypto from "node:crypto";
//#region src/gateway/mcp-grant-store.ts
const clientGrantRevocationListeners = /* @__PURE__ */ new Set();
function notifyMcpLoopbackClientGrantRevoked(event) {
	for (const listener of clientGrantRevocationListeners) listener(event);
}
const DEFAULT_TTL_MS = 36e5;
const MAX_TTL_MS = 432e5;
const grantsByToken = resolveGlobalMap(Symbol.for("openclaw.mcpAttachGrants"), "close-and-restart");
const clientGrantsByToken = resolveGlobalMap(Symbol.for("openclaw.mcpLoopbackClientGrants"), "close-and-restart");
function clampTtlMs(ttlMs) {
	if (ttlMs === void 0 || !Number.isFinite(ttlMs) || ttlMs <= 0) return DEFAULT_TTL_MS;
	return Math.min(ttlMs, MAX_TTL_MS);
}
function mintAttachGrant(params) {
	const sessionKey = params.sessionKey?.trim() ?? "";
	if (!sessionKey) throw new Error("mintAttachGrant: sessionKey is required");
	const agentId = sessionKey === "global" ? params.agentId?.trim() || void 0 : void 0;
	const nowMs = params.nowMs ?? Date.now();
	sweepExpiredAttachGrants(nowMs);
	const grant = {
		token: crypto.randomBytes(32).toString("hex"),
		sessionKey,
		...agentId ? { agentId } : {},
		issuedAtMs: nowMs,
		expiresAtMs: nowMs + clampTtlMs(params.ttlMs)
	};
	grantsByToken.set(grant.token, grant);
	return grant;
}
function resolveAttachGrant(token, nowMs = Date.now()) {
	const grant = grantsByToken.get(token);
	if (!grant) return;
	if (nowMs >= grant.expiresAtMs) {
		grantsByToken.delete(token);
		return;
	}
	return grant;
}
function revokeAttachGrant(token) {
	return grantsByToken.delete(token);
}
/** Revokes every attach grant minted for one session. Returns the count removed. */
function revokeAttachGrantsForSession(sessionKey) {
	const key = sessionKey.trim();
	let removed = 0;
	for (const [token, grant] of grantsByToken) if (grant.sessionKey === key) {
		grantsByToken.delete(token);
		removed += 1;
	}
	return removed;
}
function sweepExpiredAttachGrants(nowMs = Date.now()) {
	for (const [token, grant] of grantsByToken) if (nowMs >= grant.expiresAtMs) grantsByToken.delete(token);
}
function mintMcpLoopbackClientGrant(params) {
	const sessionKey = params.context.sessionKey.trim();
	if (!sessionKey) throw new Error("mintMcpLoopbackClientGrant: context.sessionKey is required");
	const runtimeOwnerToken = params.runtimeOwnerToken.trim();
	if (!runtimeOwnerToken) throw new Error("mintMcpLoopbackClientGrant: runtimeOwnerToken is required");
	const grant = {
		token: crypto.randomBytes(32).toString("hex"),
		context: structuredClone({
			...params.context,
			sessionKey
		}),
		runtimeOwnerToken,
		admittedRunContext: params.admittedRunContext,
		personalToolParticipants: params.personalToolParticipants,
		requestScope: getPluginRuntimeGatewayRequestScope(),
		messageActionTurnCapability: params.messageActionTurnCapability || void 0,
		cronRequesterGrantIssuer: params.cronRequesterGrantIssuer,
		cronAuthorityCheck: params.cronAuthorityCheck,
		abortSignal: params.abortSignal,
		assertCurrent: params.assertCurrent,
		bindQuestionAnswerAuthority: params.bindQuestionAnswerAuthority,
		skillLibraryAuthoring: params.skillLibraryAuthoring,
		rootedExecution: params.rootedExecution,
		...params.toolAuth ? { toolAuth: structuredClone(params.toolAuth) } : {}
	};
	clientGrantsByToken.set(grant.token, grant);
	return structuredClone({
		token: grant.token,
		context: grant.context
	});
}
function replaceMcpLoopbackClientGrant(grant) {
	clientGrantsByToken.set(grant.token, grant);
	notifyMcpLoopbackClientGrantRevoked({
		token: grant.token,
		runtimeOwnerToken: grant.runtimeOwnerToken
	});
}
function isMcpLoopbackClientGrantCurrent(grant, authority) {
	if (!grant.admittedRunContext || !authority || grant.abortSignal?.aborted) return false;
	try {
		grant.assertCurrent?.();
		grant.assertCaptureCurrent?.();
	} catch {
		return false;
	}
	return getAdmittedRunDelegatedAuthority(grant.admittedRunContext) === authority && !grant.abortSignal?.aborted && clientGrantsByToken.get(grant.token) === grant;
}
/** Attaches the exact late CLI admission before the grant can execute tools. */
function bindMcpLoopbackClientGrantAdmission(params) {
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken || grant.admittedRunContext && grant.admittedRunContext !== params.admittedRunContext) return false;
	replaceMcpLoopbackClientGrant({
		...grant,
		admittedRunContext: params.admittedRunContext
	});
	return true;
}
/** Bind the active execution attempt's capture before its child process starts. */
function activateMcpLoopbackClientGrantCapture(params) {
	const captureKey = params.captureKey.trim();
	if (!captureKey) throw new Error("activateMcpLoopbackClientGrantCapture: captureKey is required");
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken) return false;
	let activeGrant = {
		...grant,
		activeCaptureKey: captureKey,
		assertCaptureCurrent: params.assertCurrent,
		context: {
			...grant.context,
			...grant.context.nativeCronCreatorToolAllowlist !== void 0 ? { nativeCronCreatorToolAllowlist: null } : {}
		}
	};
	replaceMcpLoopbackClientGrant(activeGrant);
	const admission = grant.admittedRunContext;
	const authority = admission && getAdmittedRunDelegatedAuthority(admission);
	return { captureNativeToolAuthority: (toolNames) => {
		if (!authority || !admission || !isMcpLoopbackClientGrantCurrent(activeGrant, authority) || activeGrant.context.nativeCronCreatorToolAllowlist === void 0) return false;
		activeGrant = {
			...activeGrant,
			context: {
				...activeGrant.context,
				nativeCronCreatorToolAllowlist: toolNames === null ? null : [...toolNames]
			}
		};
		replaceMcpLoopbackClientGrant(activeGrant);
		return true;
	} };
}
/** Release only the attempt that still owns this grant's active capture. */
function deactivateMcpLoopbackClientGrantCapture(params) {
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken || grant.activeCaptureKey !== params.captureKey) return false;
	const { activeCaptureKey: _activeCaptureKey, assertCaptureCurrent: _assertCaptureCurrent, ...inactiveGrant } = grant;
	replaceMcpLoopbackClientGrant(inactiveGrant);
	return true;
}
/** Move one prepared turn onto the bearer already held by a warm CLI child. */
function transferMcpLoopbackClientGrant(params) {
	const source = clientGrantsByToken.get(params.sourceToken);
	const target = clientGrantsByToken.get(params.targetToken);
	if (!source || source.runtimeOwnerToken !== params.runtimeOwnerToken || target && target.runtimeOwnerToken !== params.runtimeOwnerToken) return false;
	if (params.sourceToken === params.targetToken) return true;
	const { activeCaptureKey: _activeCaptureKey, assertCaptureCurrent: _assertCaptureCurrent, ...inactiveSource } = source;
	clientGrantsByToken.set(params.targetToken, {
		...inactiveSource,
		token: params.targetToken
	});
	clientGrantsByToken.delete(params.sourceToken);
	notifyMcpLoopbackClientGrantRevoked({
		token: params.targetToken,
		runtimeOwnerToken: params.runtimeOwnerToken
	});
	notifyMcpLoopbackClientGrantRevoked({
		token: params.sourceToken,
		runtimeOwnerToken: params.runtimeOwnerToken
	});
	return true;
}
function resolveMcpLoopbackClientGrant(params) {
	const { token, runtimeOwnerToken, captureKey } = params;
	const grant = clientGrantsByToken.get(token);
	const admittedRunContext = grant?.admittedRunContext;
	const delegatedAuthority = admittedRunContext && getAdmittedRunDelegatedAuthority(admittedRunContext);
	if (!grant || grant.runtimeOwnerToken !== runtimeOwnerToken || !admittedRunContext || !delegatedAuthority || !grant.activeCaptureKey || grant.activeCaptureKey !== captureKey) return;
	const isCurrent = () => isMcpLoopbackClientGrantCurrent(grant, delegatedAuthority);
	if (!isCurrent()) return;
	const questionAnswerAuthority = grant.bindQuestionAnswerAuthority?.(() => {
		if (!isCurrent()) throw new Error("question creator MCP grant is no longer active");
	});
	const issueCronRequesterGrant = grant.cronRequesterGrantIssuer;
	return {
		context: structuredClone(grant.context),
		captureKey: grant.activeCaptureKey,
		admittedRunContext,
		personalToolParticipants: grant.personalToolParticipants,
		requestScope: grant.requestScope,
		messageActionTurnCapability: grant.messageActionTurnCapability || void 0,
		cronAuthorityCheck: grant.cronAuthorityCheck,
		mintCronRequesterGrant: issueCronRequesterGrant ? (signal) => {
			if (!isCurrent()) throw new Error("cron requester MCP grant is no longer active");
			return issueCronRequesterGrant(delegatedAuthority, signal, isCurrent);
		} : void 0,
		questionAnswerAuthority,
		skillLibraryAuthoring: grant.skillLibraryAuthoring,
		isCurrent,
		rootedExecution: grant.rootedExecution,
		...grant.toolAuth ? { toolAuth: grant.toolAuth } : {}
	};
}
/** Registers cleanup tied to the exact lifetime of loopback client grants. */
function registerMcpLoopbackClientGrantRevocationListener(listener) {
	clientGrantRevocationListeners.add(listener);
	return () => clientGrantRevocationListeners.delete(listener);
}
function revokeMcpLoopbackClientGrant(token) {
	const grant = clientGrantsByToken.get(token);
	if (!grant || !clientGrantsByToken.delete(token)) return false;
	notifyMcpLoopbackClientGrantRevoked({
		token,
		runtimeOwnerToken: grant.runtimeOwnerToken
	});
	return true;
}
function revokeMcpLoopbackClientGrantsForRuntime(runtimeOwnerToken) {
	let removed = 0;
	for (const [token, grant] of clientGrantsByToken) if (grant.runtimeOwnerToken === runtimeOwnerToken) removed += revokeMcpLoopbackClientGrant(token) ? 1 : 0;
	return removed;
}
//#endregion
//#region src/gateway/server-connection-work.ts
/** Owns received work and connection cleanup until this Gateway generation settles. */
var GatewayConnectionWork = class extends AsyncWorkScope {
	constructor(..._args) {
		super(..._args);
		this.spawnBroker = getSpawnBroker();
		this.runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
		this.connections = /* @__PURE__ */ new Set();
	}
	track(run) {
		return runWithSpawnBroker(this.spawnBroker, () => super.track(() => this.runWithReadOnlyWorkers(run)));
	}
	trackCleanup(run) {
		return this.track(async () => {
			try {
				await run();
			} catch (error) {
				this.failure ??= { error };
				throw error;
			}
		});
	}
	registerConnection(close) {
		const closed = createDeferredCore();
		this.connections.add(close);
		this.track(() => closed.promise);
		return () => {
			this.connections.delete(close);
			closed.resolve();
		};
	}
	async drain() {
		this.beginClose();
		for (const close of this.connections) {
			this.connections.delete(close);
			try {
				close();
			} catch (error) {
				this.failure ??= { error };
			}
		}
		await super.drain();
		if (this.failure) throw new Error("Gateway connection work failed to close cleanly", { cause: this.failure.error });
	}
};
//#endregion
export { mintAttachGrant as a, resolveAttachGrant as c, revokeAttachGrantsForSession as d, revokeMcpLoopbackClientGrant as f, deactivateMcpLoopbackClientGrantCapture as i, resolveMcpLoopbackClientGrant as l, transferMcpLoopbackClientGrant as m, activateMcpLoopbackClientGrantCapture as n, mintMcpLoopbackClientGrant as o, revokeMcpLoopbackClientGrantsForRuntime as p, bindMcpLoopbackClientGrantAdmission as r, registerMcpLoopbackClientGrantRevocationListener as s, GatewayConnectionWork as t, revokeAttachGrant as u };
