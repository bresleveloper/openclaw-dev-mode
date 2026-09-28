import { t as configureRuntimeActionDecisionSink } from "./runtime-action-decision-DdRNB2jf.mjs";
import { i as hasExecutionIdentityAdmissionSink, t as configureExecutionIdentityAdmissionSink } from "./execution-identity-admission-3hhMmAVK.mjs";
import { t as configureExecutionDecisionWorkSink } from "./execution-decision-work-2rlltydX.mjs";
import { t as createAuditEventRecorder } from "./audit-recorder-C3imdVsu.mjs";
//#region src/commands/agent-local-audit.ts
/** Direct-local agent audit writer lifecycle shared by CLI entrypoints. */
/** Own one direct-process writer unless a surrounding runtime already owns it. */
function startAgentLocalAuditWriter(config, options = {}) {
	if (hasExecutionIdentityAdmissionSink()) return;
	const recorder = createAuditEventRecorder({
		getConfig: () => config,
		...options.stateDir ? { stateDir: options.stateDir } : {}
	});
	const clearAdmissionSink = configureExecutionIdentityAdmissionSink(recorder.recordExecutionIdentity);
	const clearDecisionWorkSink = configureExecutionDecisionWorkSink(recorder.recordExecutionDecisionWork);
	const clearRuntimeActionSink = configureRuntimeActionDecisionSink(recorder.recordExecutionDecision);
	return async () => {
		clearRuntimeActionSink();
		clearDecisionWorkSink();
		clearAdmissionSink();
		await recorder.stop();
	};
}
//#endregion
export { startAgentLocalAuditWriter };
