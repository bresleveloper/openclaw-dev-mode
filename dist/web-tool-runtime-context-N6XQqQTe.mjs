import { S as getActiveRuntimeWebToolsMetadataFromState, a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-BDlJJbko.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
//#region src/agents/tools/web-tool-runtime-context.ts
function resolveWebToolRuntimeContext(params) {
	const runtimeMetadata = (params.lateBindRuntimeConfig === true ? getActiveRuntimeWebToolsMetadataFromState() : null)?.[params.kind] ?? params.runtimeMetadata;
	const config = params.lateBindRuntimeConfig === true ? getActiveSecretsRuntimeConfigSnapshot()?.config ?? params.config : params.config;
	let providerSelectionId = (runtimeMetadata?.selectedProvider ?? runtimeMetadata?.providerConfigured) || "";
	if (!providerSelectionId) {
		const configuredProvider = config?.tools?.web?.[params.kind]?.provider;
		providerSelectionId = typeof configuredProvider === "string" ? configuredProvider.trim().toLowerCase() : "";
	}
	return {
		config,
		preferRuntimeProviders: !providerSelectionId || params.kind === "search" || !resolveManifestContractOwnerPluginId({
			contract: "webFetchProviders",
			value: providerSelectionId,
			origin: "bundled",
			config
		}),
		providerSelectionId,
		runtimeMetadata
	};
}
//#endregion
export { resolveWebToolRuntimeContext as t };
