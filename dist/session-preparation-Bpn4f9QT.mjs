import { o as nativePluginBindings } from "./loader-runtime-load-C3He8u8Z.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-DqtdGn7y.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/harness/session-preparation.ts
/** Admit native session setup through the same host authority owner, without a prompt, transcript or model attempt. */
async function prepareAgentHarnessSessionRuntime(params) {
	params.assertCurrent();
	const operationId = "session-prepare:" + randomUUID();
	const admission = prepareSystemAgentRunAdmission(params.input.config, operationId, params.input.agentId, "native-session-preparation", params.assertCurrent, params.sourceAuthority);
	let host;
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
			dispose: () => {
				owner.close();
				admission.close();
			}
		};
	} catch (error) {
		host?.close();
		admission.close();
		throw error;
	}
}
//#endregion
export { prepareAgentHarnessSessionRuntime };
