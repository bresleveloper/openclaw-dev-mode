import { o as isDefaultInstallIdentity } from "./paths-DehQwyE0.mjs";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-dG8swyHC.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-C2VQLl6Z.mjs";
import { n as resolveDoctorMode } from "./doctor-health-contribution-utils-BmAjb2e7.mjs";
import { n as recordDoctorHealthWarnings } from "./doctor-health-contribution-C80Bw7XX.mjs";
import { t as runCoreContributionHealth } from "./doctor-health-contribution-core-scryf1zw.mjs";
import { a as runWriteConfigHealth } from "./doctor-health-contribution-runners.config-BjlzIsxX.mjs";
//#region src/flows/doctor-health-contribution-runners.gateway.ts
async function runCommandOwnerHealth(ctx) {
	const { noteCommandOwnerHealth } = await import("./doctor-command-owner-CbqJZgV-.mjs");
	noteCommandOwnerHealth(ctx.cfg);
}
async function runClaudeCliHealth(ctx) {
	const { noteClaudeCliHealth } = await import("./doctor-claude-cli-UX6sKlh4.mjs");
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
	const { noteMacForeignLaunchdJobs } = await import("./doctor-foreign-launchd-jobs-eUtFAT1j.mjs");
	await noteMacForeignLaunchdJobs(ctx.options, ctx.runtime, ctx.env ?? process.env);
	if (ctx.gatewayMaintenanceActive) return;
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	if (!await shouldManageGatewayService(ctx.env ?? process.env)) return;
	const { maybeRepairGatewayServiceConfig, maybeResolveDuelingSystemdGatewayScopes, maybeScanExtraGatewayServices } = await import("./doctor-gateway-services-8w4Yza_h.mjs");
	const { noteMacLaunchAgentOverrides, noteMacLaunchctlGatewayEnvOverrides, noteMacStaleOpenClawUpdateLaunchdJobs } = await import("./doctor-platform-notes-3BZ1Afe1.mjs");
	await maybeScanExtraGatewayServices(ctx.options, ctx.runtime, ctx.prompter);
	await maybeResolveDuelingSystemdGatewayScopes(ctx.runtime, ctx.prompter);
	ctx.cfg = await maybeRepairGatewayServiceConfig(ctx.cfg, resolveDoctorMode(ctx.cfg), ctx.runtime, ctx.prompter, {
		allowExecSecretRefs: ctx.options.allowExec === true,
		writeConfig: (nextConfig) => writeDoctorGatewayConfig(ctx, nextConfig)
	});
	await noteMacLaunchAgentOverrides();
	await noteMacStaleOpenClawUpdateLaunchdJobs();
	await noteMacLaunchctlGatewayEnvOverrides(ctx.cfg);
}
async function runHostDesktopHealth(ctx) {
	const { noteHostDesktopHealth } = await import("./doctor-host-desktop-DPlm1FUH.mjs");
	await noteHostDesktopHealth(ctx.cfg, { prompter: ctx.prompter });
}
async function runStartupChannelMaintenanceHealth(ctx) {
	const { maybeRunDoctorStartupChannelMaintenance } = await import("./doctor-startup-channel-maintenance-Kw2RjeKg.mjs");
	await maybeRunDoctorStartupChannelMaintenance({
		cfg: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSecurityHealth(ctx) {
	const { noteInstallPolicyHealth } = await import("./doctor-install-policy-BQsBcsXw.mjs");
	const { noteSecurityWarnings } = await import("./doctor-security-D98B-Cnj.mjs");
	const { securityAuditFindingToHealthFinding } = await import("./health-check-adapter-4QeLfjiE.mjs");
	const findings = await noteSecurityWarnings(ctx.cfg);
	recordDoctorHealthWarnings(ctx, findings.map(securityAuditFindingToHealthFinding));
	await noteInstallPolicyHealth(ctx.cfg, {
		deep: ctx.options.deep === true,
		env: ctx.env
	});
}
async function runWebFetchProxyHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	const { noteWebFetchProxyDiagnostic } = await import("./doctor-web-fetch-proxy-D92kQtmu.mjs");
	await noteWebFetchProxyDiagnostic({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env
	});
}
async function runGitHubProjectHealth(ctx) {
	const { hasConfiguredGitHubApiCredential } = await import("./github-public-api-MPmpFgIB.mjs");
	if (!hasConfiguredGitHubApiCredential(ctx.env ?? process.env, ctx.cfg)) note("Prefer gateway.controlUi.github.token for Gateway-owned GitHub project access, or set GH_TOKEN/GITHUB_TOKEN in the shared Gateway process environment. Without either, search is public-only.", "GitHub projects");
}
async function runBrowserHealth(ctx) {
	const { noteChromeMcpBrowserReadiness } = await import("./doctor-browser-BNk2LAC5.mjs");
	await runCoreContributionHealth(ctx, ["core/doctor/browser-clawd-profile-residue"]);
	await noteChromeMcpBrowserReadiness(ctx.cfg);
}
async function runOpenAIOAuthTlsHealth(ctx) {
	const { noteOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-CKm5vp2Y.mjs");
	await noteOpenAIOAuthTlsPrerequisites({
		cfg: ctx.cfg,
		deep: ctx.options.deep === true
	});
}
async function runWhatsappResponsivenessHealth(ctx) {
	const { noteWhatsappResponsivenessHealth } = await import("./doctor-whatsapp-responsiveness-CT-5c7wg.mjs");
	noteWhatsappResponsivenessHealth({
		cfg: ctx.cfg,
		status: ctx.gatewayStatus
	});
}
async function runDevicePairingHealth(ctx) {
	const { noteDevicePairingHealth } = await import("./doctor-device-pairing-6VnFeP9b.mjs");
	await noteDevicePairingHealth({
		cfg: ctx.cfg,
		healthOk: ctx.healthOk ?? false,
		env: ctx.env
	});
}
async function runGatewayDaemonHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	if (ctx.cfg.gateway?.mode !== "remote") {
		const { noteMacDisabledGatewayLaunchAgent } = await import("./doctor-platform-notes-3BZ1Afe1.mjs");
		await noteMacDisabledGatewayLaunchAgent(ctx.env ?? process.env);
	}
	if (ctx.gatewayMaintenanceActive) return;
	const { maybeRepairGatewayDaemon } = await import("./doctor-gateway-daemon-flow-BlwNFucp.mjs");
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
export { runGatewayDaemonHealth as a, runHostDesktopHealth as c, runStartupChannelMaintenanceHealth as d, runWebFetchProxyHealth as f, runDevicePairingHealth as i, runOpenAIOAuthTlsHealth as l, writeDoctorGatewayConfig as m, runClaudeCliHealth as n, runGatewayServicesHealth as o, runWhatsappResponsivenessHealth as p, runCommandOwnerHealth as r, runGitHubProjectHealth as s, runBrowserHealth as t, runSecurityHealth as u };
