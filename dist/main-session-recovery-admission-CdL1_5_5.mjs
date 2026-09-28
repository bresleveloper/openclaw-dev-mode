import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { n as beginSessionWorkAdmission, y as cancelSessionWorkAdmissionHandoff } from "./session-lifecycle-admission-Pys9TN37.mjs";
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
	const ownershipChanged = /* @__PURE__ */ new Error("restart recovery session ownership changed before dispatch");
	let admission;
	try {
		admission = await beginSessionWorkAdmission({
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
