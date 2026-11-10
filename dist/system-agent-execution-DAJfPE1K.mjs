import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { a as getRuntimeConfigAppliedHash, j as hashRuntimeConfigValue } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./lanes-D7a4ntDu.mjs";
import { g as setCommandLaneConcurrency, i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
import { createAsyncLock } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/system-agent-execution.ts
function createSystemAgentGatewayRuntime() {
	return {
		...defaultRuntime,
		exit: (code) => {
			throw new Error(`setup step exited with code ${String(code)}`);
		}
	};
}
const withSystemAgentExecution = createAsyncLock();
async function runSystemAgentGatewayTask(task) {
	setCommandLaneConcurrency("system-agent", Number.MAX_SAFE_INTEGER);
	return await enqueueCommandInLane("system-agent", () => withSystemAgentExecution(task));
}
async function verifyGatewaySetupInference(params) {
	const [{ readConfigFileSnapshot }, { verifySetupInference }] = await Promise.all([import("./config/config.js"), import("./system-agent/setup-inference.js")]);
	const runtimeConfig = params.context.getRuntimeConfig();
	const appliedHash = getRuntimeConfigAppliedHash();
	const isCurrent = () => appliedHash !== null && params.context.isConfigReloadSettled() && params.context.getRuntimeConfig() === runtimeConfig && getRuntimeConfigAppliedHash() === appliedHash;
	const isApplied = async () => {
		if (!isCurrent()) return false;
		const snapshot = await readConfigFileSnapshot();
		return snapshot.exists && snapshot.valid && hashRuntimeConfigValue(snapshot.sourceConfig) === appliedHash && isCurrent();
	};
	const unavailable = {
		ok: false,
		status: "unavailable",
		error: "Gateway settings are saved but not active yet. Wait for application or restart to finish, then retry verification."
	};
	if (!await isApplied()) return unavailable;
	const verification = await verifySetupInference({
		runtime: params.runtime,
		...params.modelTarget ? { modelTarget: params.modelTarget } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return await isApplied() ? verification : unavailable;
}
async function activateGatewaySetupInference(params) {
	let complete;
	let restartRequired;
	let result;
	try {
		result = await runSystemAgentGatewayTask(async () => {
			const { activateSetupInference } = await import("./system-agent/setup-inference.js");
			return activateSetupInference({
				...params,
				onActivationCompletion: (completion) => {
					complete = completion;
				}
			});
		});
	} finally {
		restartRequired = await complete?.();
	}
	return result.ok && restartRequired ? {
		...result,
		gatewayRestartRequired: true
	} : result;
}
//#endregion
export { verifyGatewaySetupInference as i, createSystemAgentGatewayRuntime as n, runSystemAgentGatewayTask as r, activateGatewaySetupInference as t };
