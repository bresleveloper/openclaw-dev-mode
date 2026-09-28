import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
//#region src/commands/doctor/shared/config-mutation-state.ts
/** Apply a config mutation to doctor state, writing cfg only in repair mode. */
function applyDoctorConfigMutation(params) {
	if (params.mutation.changes.length === 0) return params.state;
	const config = inheritLegacyDefaultAgentId(params.state.candidate, params.mutation.config);
	return {
		cfg: params.shouldRepair ? config : params.state.cfg,
		candidate: config,
		pendingChanges: true,
		fixHints: !params.shouldRepair && params.fixHint ? [...params.state.fixHints, params.fixHint] : params.state.fixHints
	};
}
//#endregion
export { applyDoctorConfigMutation as t };
