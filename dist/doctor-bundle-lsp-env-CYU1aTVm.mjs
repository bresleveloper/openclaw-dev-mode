import { o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { n as resolveStdioMcpServerLaunchConfig } from "./mcp-stdio-CDQbiYCO.mjs";
import { n as loadEnabledBundleLspConfig } from "./bundle-lsp-CtEbI7PB.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { i as resolveLspServerEnv, n as collectWithheldLspEnvNames, r as formatWithheldLspEnvHints, t as LSP_ENV_PASSTHROUGH_DOCS_URL } from "./agent-bundle-lsp-env-DamX6NSu.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-BmU6tTrJ.mjs";
//#region src/commands/doctor-bundle-lsp-env.ts
/** Doctor note for Gateway env vars that bundle LSP servers no longer inherit. */
function collectRunnableLspServers(params) {
	const servers = /* @__PURE__ */ new Map();
	for (const workspaceDir of params.workspaceDirs) {
		const load = () => params.loadLspConfig({
			workspaceDir,
			cfg: params.cfg
		});
		const loaded = params.runWithPluginMetadataSnapshot ? params.runWithPluginMetadataSnapshot({
			config: params.cfg,
			workspaceDir
		}, load) : load();
		for (const [name, raw] of Object.entries(loaded.config.lspServers)) {
			const launch = resolveStdioMcpServerLaunchConfig(raw);
			if (launch.ok) servers.set(name, [...servers.get(name) ?? [], launch.config.env]);
		}
	}
	return servers;
}
async function resolveGatewayEnvSources(params) {
	const sources = [params.env];
	if (!isDefaultInstallIdentity(params.env) || !await shouldManageGatewayService(params.env)) return sources;
	const command = await params.service.readCommand(params.env).catch(() => null);
	if (command?.environment) sources.push(command.environment);
	return sources;
}
function mergeWithheld(entries) {
	const configurable = new Set(entries.flatMap((entry) => entry.configurable));
	const refused = new Set(entries.flatMap((entry) => entry.refused));
	return {
		configurable: [...configurable].toSorted(),
		refused: [...refused].toSorted()
	};
}
/** Notes commonly needed, non-secret Gateway env names that configured bundle LSP servers lack. */
async function noteBundleLspEnvPassthrough(params) {
	if (params.cfg.gateway?.mode === "remote") return;
	const servers = collectRunnableLspServers({
		cfg: params.cfg,
		workspaceDirs: params.workspaceDirs,
		loadLspConfig: params.loadLspConfig ?? loadEnabledBundleLspConfig,
		runWithPluginMetadataSnapshot: params.runWithPluginMetadataSnapshot
	});
	if (servers.size === 0) return;
	const sources = await resolveGatewayEnvSources({
		env: params.env ?? process.env,
		service: params.service ?? resolveGatewayService()
	});
	const lines = [];
	for (const [name, serverEnvs] of [...servers].toSorted(([a], [b]) => a.localeCompare(b))) {
		const withheld = mergeWithheld(serverEnvs.flatMap((serverEnv) => sources.map((parentEnv) => collectWithheldLspEnvNames({
			parentEnv,
			childEnv: resolveLspServerEnv(serverEnv, parentEnv)
		}))));
		for (const hint of formatWithheldLspEnvHints(withheld)) lines.push(`- "${name}": ${hint}`);
	}
	if (lines.length === 0) return;
	(params.noteFn ?? note)([
		"Bundle LSP servers start from an allowlisted environment, not the full Gateway environment. These Gateway variables are set but not passed:",
		...lines,
		`Docs: ${LSP_ENV_PASSTHROUGH_DOCS_URL}`
	].join("\n"), "Bundle LSP environment");
}
//#endregion
export { noteBundleLspEnvPassthrough };
