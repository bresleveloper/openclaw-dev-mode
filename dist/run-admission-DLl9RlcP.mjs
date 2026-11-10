import { t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { n as resolvePreparedSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
//#region src/cron/run-inference.ts
function incompatibleCandidateError(cliExecution, cause) {
	return new Error("Automation candidate is incompatible with its recorded inference account and route. " + (cliExecution ? "The selected runtime uses a CLI login that cannot use this job's stored account. " : "The selected model uses a different provider from this job's stored account. ") + "Select a model compatible with the recorded account, or explicitly select a stored account with openclaw automations edit <jobId> --model <provider/model>@<profileId>.", cause === void 0 ? void 0 : { cause });
}
/** Both Cron execution paths keep the recorded account bound through turn settlement. */
async function prepareCronRunInference(params) {
	const { binding } = params;
	if (!binding) return;
	const { acquireCronInferenceAuthorization } = await import("./inference-binding.runtime.js");
	const authorization = await acquireCronInferenceAuthorization({
		...params,
		binding
	});
	return {
		runParams: {
			authProfileId: binding.profileId,
			authProfileBinding: {
				profileId: binding.profileId,
				authRequirement: binding.authRequirement,
				assertCurrent: authorization.assertCurrent,
				revalidate: authorization.revalidate
			},
			allowAuthProfileFallback: false,
			onSuccessfulAuthProfile: (profileId) => {
				if (profileId !== binding.profileId) throw new Error("Automation inference account changed during execution.");
			},
			authProfileIdSource: binding.source
		},
		assertCandidate(provider, cliExecution) {
			if (provider !== binding.provider) throw incompatibleCandidateError(cliExecution);
			authorization.assertCurrent();
		},
		async resolveCliAuthProfile(resolve) {
			let profileId;
			try {
				profileId = await resolve({
					authProfileId: binding.profileId,
					authProfileIdSource: "user"
				});
			} catch (error) {
				throw incompatibleCandidateError(true, error);
			}
			if (profileId !== binding.profileId) throw incompatibleCandidateError(true);
			authorization.assertCurrent();
			return profileId;
		},
		dispose: authorization.dispose
	};
}
//#endregion
//#region src/cron/isolated-agent/run-admission.ts
function assertCronRuntimeAuthorityCandidate(params) {
	const authority = params.authority;
	if (!authority) return;
	if (params.candidateRuntime !== authority.runtimeId || params.cliExecution) throw new AgentHarnessPreflightError(`This automation carries ${authority.namespace} authority captured for the ${authority.runtimeId} runtime, but the selected execution runtime is ${params.candidateRuntime}. Restore that runtime and auth profile, or explicitly replace the automation's toolsAllow cap from an authenticated creator turn.`);
}
function resolveCronSandboxPlacement(params) {
	const status = resolvePreparedSandboxRuntimeStatus(params);
	return {
		sessionSandboxRequired: status.sandboxRequired,
		sessionSandboxed: status.sandboxed
	};
}
function assertCronCandidateSandboxPlacement(params) {
	if (!params.cliExecution || !params.sessionSandboxed && !params.sessionSandboxRequired) return;
	throw new AgentHarnessPreflightError(`This automation belongs to a sandboxed session, but resolved execution provider ${params.executionProvider} runs on the host and cannot honor the sandbox. Override agents.entries.<id>.subagents.model, agents.defaults.subagents.model, or the automation payload model with an API-backed provider (and clear any pinned CLI runtime override), or change the agent's sandbox policy explicitly.`);
}
//#endregion
export { prepareCronRunInference as i, assertCronRuntimeAuthorityCandidate as n, resolveCronSandboxPlacement as r, assertCronCandidateSandboxPlacement as t };
