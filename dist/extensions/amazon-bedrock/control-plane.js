import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/amazon-bedrock/control-plane.ts
const BEDROCK_CONTROL_PLANE_REQUEST_TIMEOUT_MS = 3e4;
async function loadBedrockControlPlaneSdk() {
	const { BedrockClient, GetInferenceProfileCommand, ListFoundationModelsCommand, ListInferenceProfilesCommand } = await import("@aws-sdk/client-bedrock");
	return {
		createClient: (region) => new BedrockClient(region ? { region } : {}),
		createGetInferenceProfileCommand: (input) => new GetInferenceProfileCommand(input),
		createListFoundationModelsCommand: () => new ListFoundationModelsCommand({}),
		createListInferenceProfilesCommand: (input) => new ListInferenceProfilesCommand(input)
	};
}
async function runBedrockControlPlaneRequest(params) {
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: BEDROCK_CONTROL_PLANE_REQUEST_TIMEOUT_MS,
		signal: params.signal,
		operation: params.operation
	});
	try {
		signal?.throwIfAborted();
		const response = await params.send({ abortSignal: signal });
		signal?.throwIfAborted();
		return response;
	} finally {
		cleanup();
	}
}
//#endregion
export { loadBedrockControlPlaneSdk, runBedrockControlPlaneRequest };
