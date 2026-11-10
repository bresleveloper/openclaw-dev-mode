import { p as prepareSystemAgentRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import { s as nativePluginBindings } from "./loader-runtime-load-DzFljQbT.mjs";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-CtHEkIpy.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/harness/session-preparation.ts
/** Admit native session setup through the same host authority owner, without a prompt, transcript or model attempt. */
async function prepareAgentHarnessSessionRuntime(params) {
	params.assertCurrent();
	const operationId = "session-prepare:" + randomUUID();
	const admission = prepareSystemAgentRunAdmission(params.input.config, operationId, params.input.agentId, "native-session-preparation", params.assertCurrent, params.sourceAuthority);
	let host;
	const dispose = () => {
		host?.close();
		admission.close();
	};
	try {
		const admittedRunContext = await admission.admit("plugin-harness");
		params.assertCurrent();
		const authProfileStore = await nativePluginBindings.authStore.prepareAuthProfileStoreForModelRuntime(params.input.agentDir, { config: params.input.config }, params.assertCurrent);
		if (!authProfileStore) throw new Error("Session preparation credentials are unavailable");
		params.assertCurrent();
		host = createAgentHarnessHostCapabilities({
			attempt: {
				...params.input,
				authProfileStore,
				runId: operationId,
				admittedRunContext
			},
			pluginId: params.ownerPluginId,
			nativeModelPolicySupport: params.nativeModelPolicySupport
		});
		const owner = host;
		return {
			preparation: {
				version: 1,
				purpose: "mcp-app",
				params: {
					...params.input,
					authProfileStore,
					runId: operationId,
					hostCapabilities: owner.capabilities
				},
				run: (operation) => owner.runWithScope(async () => {
					params.assertCurrent();
					owner.capabilities.assertActive();
					return await operation();
				})
			},
			dispose
		};
	} catch (error) {
		dispose();
		throw error;
	}
}
//#endregion
export { prepareAgentHarnessSessionRuntime };
