import { o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-CO5zyEkR.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { r as resolveDoctorMode } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
import { r as recordDoctorHealthWarnings } from "./doctor-health-contribution-CswduPyS.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-BmU6tTrJ.mjs";
import { t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-ClHPRGuJ.mjs";
import { i as runWriteConfigHealth } from "./doctor-health-contribution-runners.config-BQl1hQqU.mjs";
//#region src/flows/doctor-health-contribution-runners.gateway.ts
async function runCommandOwnerHealth(ctx) {
	const { noteCommandOwnerHealth } = await import("./doctor-command-owner-CtGY-v1S.mjs");
	noteCommandOwnerHealth(ctx.cfg);
}
async function runClaudeCliHealth(ctx) {
	const { noteClaudeCliHealth } = await import("./doctor-claude-cli-Dv6cLdok.mjs");
	noteClaudeCliHealth(ctx.cfg);
}
async function writeDoctorGatewayConfig(ctx, nextConfig) {
	const previous = ctx.cfg;
	ctx.cfg = nextConfig;
	try {
		if (!await runWriteConfigHealth(ctx, { runPostWriteRepairs: false })) throw new Error("Doctor did not persist the gateway token; service repair was skipped.");
		return ctx.cfg;
	} catch (error) {
		ctx.cfg = previous;
		throw error;
	}
}
async function runGatewayServicesHealth(ctx) {
	const { noteMacForeignLaunchdJobs } = await import("./doctor-foreign-launchd-jobs-CPkJvy3q.mjs");
	await noteMacForeignLaunchdJobs(ctx.options, ctx.runtime, ctx.env ?? process.env);
	if (ctx.gatewayMaintenanceActive) return;
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	if (!await shouldManageGatewayService(ctx.env ?? process.env)) return;
	const { maybeRepairGatewayServiceConfig, maybeResolveDuelingSystemdGatewayScopes, maybeScanExtraGatewayServices } = await import("./doctor-gateway-services-DF0WpN8T.mjs");
	const { noteMacGatewayPlatformWarnings } = await import("./doctor-platform-notes-DCt_dOk-.mjs");
	await maybeScanExtraGatewayServices(ctx.options, ctx.runtime, ctx.prompter);
	await maybeResolveDuelingSystemdGatewayScopes(ctx.runtime, ctx.prompter);
	ctx.cfg = await maybeRepairGatewayServiceConfig(ctx.cfg, resolveDoctorMode(ctx.cfg), ctx.runtime, ctx.prompter, {
		allowExecSecretRefs: ctx.options.allowExec === true,
		writeConfig: (nextConfig) => writeDoctorGatewayConfig(ctx, nextConfig)
	});
	await noteMacGatewayPlatformWarnings(ctx.cfg);
}
async function runHostDesktopHealth(ctx) {
	const { noteHostDesktopHealth } = await import("./doctor-host-desktop-DCnkSPH-.mjs");
	await noteHostDesktopHealth(ctx.cfg, { prompter: ctx.prompter });
}
async function runStartupChannelMaintenanceHealth(ctx) {
	const { maybeRunDoctorStartupChannelMaintenance } = await import("./doctor-startup-channel-maintenance-Br4urgyM.mjs");
	await maybeRunDoctorStartupChannelMaintenance({
		cfg: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSecurityHealth(ctx) {
	const { noteInstallPolicyHealth } = await import("./doctor-install-policy-BR7OPlED.mjs");
	const { noteSecurityWarnings } = await import("./doctor-security-BEAOOogR.mjs");
	const { securityAuditFindingToHealthFinding } = await import("./health-check-adapter-CVJJLCim.mjs");
	const findings = await noteSecurityWarnings(ctx.cfg);
	recordDoctorHealthWarnings(ctx, findings.map(securityAuditFindingToHealthFinding));
	await noteInstallPolicyHealth(ctx.cfg, {
		deep: ctx.options.deep === true,
		env: ctx.env
	});
}
async function runWebFetchProxyHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	const { noteWebFetchProxyDiagnostic } = await import("./doctor-web-fetch-proxy-CBSpb31g.mjs");
	await noteWebFetchProxyDiagnostic({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env
	});
}
async function runBundleLspEnvHealth(ctx) {
	const { noteBundleLspEnvPassthrough } = await import("./doctor-bundle-lsp-env-CYU1aTVm.mjs");
	await noteBundleLspEnvPassthrough({
		cfg: ctx.cfg,
		workspaceDirs: resolveDoctorWorkspaceSuggestionScopes(ctx.cfg).map((scope) => scope.workspaceDir),
		env: ctx.env ?? process.env,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runGitHubProjectHealth(ctx) {
	const { hasConfiguredGitHubApiCredential } = await import("./github-public-api-vQT2OctZ.mjs");
	if (!hasConfiguredGitHubApiCredential(ctx.env ?? process.env, ctx.cfg)) note("Set gateway.controlUi.github.token with gateway.controlUi.github.host matching gateway.github.host for private project access. Public github.com can also use GH_TOKEN/GITHUB_TOKEN; otherwise search is public-only.", "GitHub projects");
}
async function runBrowserHealth(ctx) {
	const { noteChromeMcpBrowserReadiness } = await import("./doctor-browser-0Ucc61aW.mjs");
	await noteChromeMcpBrowserReadiness(ctx.cfg);
}
async function runOpenAIOAuthTlsHealth(ctx) {
	const { noteOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-Bc-SSs8f.mjs");
	await noteOpenAIOAuthTlsPrerequisites({
		cfg: ctx.cfg,
		deep: ctx.options.deep === true
	});
}
async function runWhatsappResponsivenessHealth(ctx) {
	const { noteWhatsappResponsivenessHealth } = await import("./doctor-whatsapp-responsiveness-D_Fybjsm.mjs");
	noteWhatsappResponsivenessHealth({
		cfg: ctx.cfg,
		status: ctx.gatewayStatus
	});
}
async function runDevicePairingHealth(ctx) {
	const { noteDevicePairingHealth } = await import("./doctor-device-pairing-CK9XIF15.mjs");
	await noteDevicePairingHealth({
		cfg: ctx.cfg,
		healthOk: ctx.healthOk ?? false,
		env: ctx.env
	});
}
async function runGatewayDaemonHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	if (ctx.cfg.gateway?.mode !== "remote") {
		const { noteMacDisabledGatewayLaunchAgent } = await import("./doctor-platform-notes-DCt_dOk-.mjs");
		await noteMacDisabledGatewayLaunchAgent(ctx.env ?? process.env);
	}
	if (ctx.gatewayMaintenanceActive) return;
	const { maybeRepairGatewayDaemon } = await import("./doctor-gateway-daemon-flow-C-lgLYy2.mjs");
	await maybeRepairGatewayDaemon({
		cfg: ctx.cfg,
		runtime: ctx.runtime,
		prompter: ctx.prompter,
		options: ctx.options,
		gatewayDetailsMessage: ctx.gatewayDetails?.message ?? "",
		healthOk: ctx.healthOk ?? false,
		healthSkipped: ctx.gatewayHealthSkipped === true
	});
}
//#endregion
export { runDevicePairingHealth as a, runGitHubProjectHealth as c, runSecurityHealth as d, runStartupChannelMaintenanceHealth as f, writeDoctorGatewayConfig as h, runCommandOwnerHealth as i, runHostDesktopHealth as l, runWhatsappResponsivenessHealth as m, runBundleLspEnvHealth as n, runGatewayDaemonHealth as o, runWebFetchProxyHealth as p, runClaudeCliHealth as r, runGatewayServicesHealth as s, runBrowserHealth as t, runOpenAIOAuthTlsHealth as u };
