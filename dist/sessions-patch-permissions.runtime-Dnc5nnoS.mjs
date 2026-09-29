import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { O as validateAgentRunDelegatedAuthority, c as getAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { i as ACTIVE_EMBEDDED_RUNS } from "./run-state-CTlPY590.mjs";
import { D as resolveEmbeddedAgentRunProgressState } from "./runs-Cjzxx3Pg.mjs";
import { U as beginSessionPermissionChange } from "./session-row-prepared-read-C3rQ5FB0.mjs";
import { n as withAuthorizedPermissionChange } from "./permission-change-JQf8TlGK.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
//#region src/agents/embedded-agent-runner/run-permissions.ts
/** Captures one exact live runtime; a later run must never inherit this update. */
function prepareEmbeddedRunPermissionChange(sessionId) {
	if (!resolveEmbeddedAgentRunProgressState(sessionId)) return { kind: "idle" };
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle?.applyPermissionMode) return { kind: "unsupported" };
	const applyPermissionMode = handle.applyPermissionMode;
	const generation = getAgentEventLifecycleGeneration();
	const owner = handle.permissionChangeOwner;
	const authority = handle.runId ? getAgentRunContext(handle.runId)?.delegatedAuthority : void 0;
	const ownsRuntime = () => {
		const current = ACTIVE_EMBEDDED_RUNS.get(sessionId);
		return isAgentEventLifecycleGenerationCurrent(generation) && (current === handle || owner !== void 0 && current?.permissionChangeOwner === owner);
	};
	return {
		kind: "active",
		stop: () => {
			if (ownsRuntime()) ACTIVE_EMBEDDED_RUNS.get(sessionId)?.abort();
		},
		apply: async (mode, revokeApprovals) => {
			if (!ownsRuntime()) return false;
			const revoke = () => {
				if (!ownsRuntime() || authority && !validateAgentRunDelegatedAuthority(authority)) throw new Error("Permission change lost its active run. Retry the request.");
				if (authority) revokeApprovals(authority);
			};
			const apply = () => applyPermissionMode(mode, revoke);
			return await (owner ? withAuthorizedPermissionChange(owner, mode, apply) : apply()) && isAgentEventLifecycleGenerationCurrent(generation) && (!ACTIVE_EMBEDDED_RUNS.has(sessionId) || ownsRuntime());
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-permissions.runtime.ts
/** Prepare before persistence; apply and finish under the same session mutation owner. */
function prepareSessionPatchPermissionChange(params) {
	const change = prepareEmbeddedRunPermissionChange(params.sessionId);
	if (change.kind === "idle") return { ok: true };
	if (change.kind === "unsupported") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "This run cannot apply permissions while active. Stop the run, then change permissions.")
	};
	const finish = beginSessionPermissionChange(params.sessionId);
	const publish = () => emitSessionsChanged(params.context, {
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		reason: "patch"
	});
	return {
		ok: true,
		change: {
			apply: async (mode) => {
				publish();
				try {
					const authorizationFailure = params.assertCurrent();
					if (authorizationFailure) throw new Error(authorizationFailure.message);
					const cancellations = [];
					const applied = await change.apply(mode, (authority) => {
						const cancellation = params.context.cancelRunBoundApprovals?.(authority);
						if (cancellation) {
							cancellation.catch(() => void 0);
							cancellations.push(cancellation);
						}
					});
					await Promise.all(cancellations);
					if (!applied) throw new Error("The active run ended or was replaced before applying permissions.");
					return;
				} catch (error) {
					try {
						change.stop();
					} catch (stopError) {
						params.context.logGateway?.warn(`Permission change stop failed: ${formatErrorMessage(stopError)}`);
					}
					params.context.logGateway?.warn(`Permission change failed: ${formatErrorMessage(error)}`);
					return errorShape(ErrorCodes.UNAVAILABLE, "Permissions were saved, but could not be applied to the active run. Stop the run and continue to use the saved permissions.");
				}
			},
			finish: () => {
				finish();
				publish();
			}
		}
	};
}
//#endregion
export { prepareSessionPatchPermissionChange };
