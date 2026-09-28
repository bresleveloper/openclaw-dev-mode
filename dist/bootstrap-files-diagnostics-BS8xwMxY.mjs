import { x as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { o as resolveBootstrapContextWithProjectedHookFiles } from "./bootstrap-files-Cueaawuk.mjs";
import { t as loadDeclaredExtraBootstrapFiles } from "./declared-files-BuPlzy3t.mjs";
import { r as resolveInternalHookSelection, t as isHookLoadable } from "./configured--rVR1Sbb.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-B2MW5yrb.mjs";
//#region src/agents/bootstrap-files-diagnostics.ts
function isBundledExtraFilesHookSelected(config) {
	if (!config) return false;
	const selection = resolveInternalHookSelection(config);
	if (!selection.configured) return false;
	const discoveryDir = tryResolveConfiguredAgentWorkspaceDir(config) ?? resolveDefaultAgentWorkspaceDir();
	const selected = loadWorkspaceHookEntries(discoveryDir, { config }).find((entry) => entry.hook.name === "bootstrap-extra-files");
	return selected?.hook.source === "openclaw-bundled" && isHookLoadable({
		entry: selected,
		config,
		names: selection.names
	});
}
/** Projects fresh-start bundled declarations without importing or invoking hook handlers. */
async function resolveBootstrapContextForDiagnostics(params) {
	if (!isBundledExtraFilesHookSelected(params.config)) return resolveBootstrapContextWithProjectedHookFiles(params, []);
	const declared = await loadDeclaredExtraBootstrapFiles({
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	return resolveBootstrapContextWithProjectedHookFiles(params, declared.files);
}
//#endregion
export { resolveBootstrapContextForDiagnostics as t };
