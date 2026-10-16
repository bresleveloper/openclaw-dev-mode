import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance, h as normalizeInputProvenance, u as isCompletionReportInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as getTranscriptMessageRole } from "./message-visibility-D9way_Lv.mjs";
import { t as hasReplaySafeCodeModeCheckpointInCurrentTurn } from "./main-session-restart-recovery-resume-policy-iIN7m6NS.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-checkpoint.ts
function selectMainSessionRecoveryCheckpoint(visit) {
	let replaySafe = false;
	let source;
	visit((message) => {
		if (getTranscriptMessageRole(message) === "user") {
			const provenance = normalizeInputProvenance(asOptionalRecord(message)?.provenance);
			if (!isMainSessionRestartRecoveryInputProvenance(provenance)) {
				replaySafe = false;
				switch (provenance?.kind) {
					case "internal_system":
						source = "internal_system";
						break;
					case "inter_session":
						source = provenance.sourceTool?.toLowerCase() === "agent_harness_task" ? "harness_completion" : isCompletionReportInputProvenance(provenance) ? "completion" : "inter_session";
						break;
					case "external_user":
						source = "external_user";
						break;
					default: source = void 0;
				}
			}
		} else if (hasReplaySafeCodeModeCheckpointInCurrentTurn([message])) replaySafe = true;
	});
	return {
		replaySafe,
		source
	};
}
//#endregion
export { selectMainSessionRecoveryCheckpoint };
