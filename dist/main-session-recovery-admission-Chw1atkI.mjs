import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { D as cancelSessionWorkAdmissionHandoff, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./lanes-D7a4ntDu.mjs";
import { i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-admission.ts
/** Process-wide identity for startup recovery before its reply operation is registered. */
const MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER = Symbol.for("openclaw.mainSessionRecoveryWorkAdmission");
/** Keeps pending dispatch visible to foreground admission until the Gateway adopts it. */
async function runWithMainSessionRecoveryAdmission(params) {
	const lifecycleGeneration = params.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	let interrupted = false;
	let dispatchStarted = false;
	const shouldContinue = () => (!interrupted || dispatchStarted) && params.shouldContinue?.() !== false && lifecycleGeneration === getAgentEventLifecycleGeneration();
	if (!shouldContinue() || !params.isCurrent()) return;
	if (params.admission) return params.admission.shouldContinue() ? await params.run(params.admission) : void 0;
	await enqueueCommandInLane("background", async () => {}, { abortSignal: params.signal ? AbortSignal.any([params.signal, getGatewayRestartDrainSignal()]) : getGatewayRestartDrainSignal() });
	if (!shouldContinue() || !params.isCurrent()) return;
	const ownershipChanged = /* @__PURE__ */ new Error("restart recovery session ownership changed before dispatch");
	let admission;
	try {
		admission = await beginSessionWorkAdmission({
			agentId: params.agentId ?? parseAgentSessionKey(params.canonicalSessionKey ?? params.sessionKey)?.agentId,
			scope: params.storePath,
			identities: [
				params.sessionKey,
				params.canonicalSessionKey,
				params.sessionId
			],
			owner: MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER,
			onInterrupt: () => {
				interrupted = true;
			},
			assertAllowed: () => {
				if (!shouldContinue() || !params.isCurrent()) throw ownershipChanged;
			}
		});
	} catch (error) {
		if (error === ownershipChanged || interrupted) return;
		throw error;
	}
	const handoffId = admission.createHandoff();
	try {
		return await admission.run(() => params.run({
			handoffId,
			shouldContinue,
			beginDispatch: () => {
				if (!shouldContinue()) return false;
				dispatchStarted = true;
				return true;
			}
		}));
	} finally {
		cancelSessionWorkAdmissionHandoff(handoffId);
	}
}
//#endregion
export { runWithMainSessionRecoveryAdmission as n, MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER as t };
