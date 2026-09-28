import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-sFXvRs60.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-eOymVKB5.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { p as waitForGatewayReachable } from "./onboard-helpers-0ZuVvEiw.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-CPELiLIy.mjs";
import { t as resolveGatewayRunOptions } from "./run-options-DmrtZArA.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { n as runBrowserHatchHandoff } from "./onboard-browser-handoff-DtLZi_jc.mjs";
//#region src/commands/onboard-quickstart-host.ts
/** Start the foreground Gateway with fresh plugin facts after onboarding installs. */
async function runQuickstartForegroundGateway(params, deps = {}) {
	return await withPluginCache(createPluginCache(), async () => {
		const { runtime } = params;
		const { config } = await (deps.readConfigSnapshot ?? readConfigFileSnapshot)();
		const links = resolveLocalControlUiProbeLinks({
			bind: config.gateway?.bind,
			port: resolveGatewayPort(config),
			customBindHost: config.gateway?.customBindHost,
			basePath: config.gateway?.controlUi?.basePath,
			tlsEnabled: config.gateway?.tls?.enabled === true
		});
		const credentials = await resolveGatewayCredentialsWithSecretInputs({
			config,
			modeOverride: "local"
		});
		const authMode = config.gateway?.auth?.mode ?? (credentials.password ? "password" : "token");
		const gateway = (deps.runGateway ?? (await import("./run-q1Qh3g8S.mjs")).runGatewayCommand)(resolveGatewayRunOptions({}), getGatewayRunRuntimeHooks());
		const stopped = gateway.then(() => null);
		const reachable = await Promise.race([stopped, (deps.waitForGateway ?? waitForGatewayReachable)({
			url: links.wsUrl,
			token: authMode === "token" ? credentials.token : void 0,
			password: authMode === "password" ? credentials.password : void 0,
			...resolveGatewayStartupTiming()
		})]);
		if (!reachable) return;
		if (reachable.ok) {
			const handoff = await Promise.race([stopped, (deps.runBrowserHandoff ?? runBrowserHatchHandoff)({
				config,
				prompter: createQuickstartNotePrompter(runtime),
				suppressTokenOutput: params.suppressTokenOutput,
				...params.agentId ? { agentId: params.agentId } : {}
			}).catch(() => ({ handedOff: false }))]);
			if (!handoff) return;
			if (!handoff.handedOff) runtime.log(t("wizard.guided.quickstartBrowserUnavailable"));
		} else runtime.log(t("wizard.guided.quickstartGatewayPending"));
		const dashboardUrl = new URL(links.httpUrl);
		const [{ resolveConfiguredSetupModelForAgent }, { resolveSystemAgentOnboardingTarget }] = await Promise.all([import("./utility-model-CfzkZIO_.mjs"), import("./onboard-agent-target-DefUwDFX.mjs")]);
		const setupOnly = resolveConfiguredSetupModelForAgent({
			cfg: config,
			agentId: params.agentId ?? resolveSystemAgentOnboardingTarget(config).agentId
		})?.modelTarget === "utility";
		if (setupOnly) {
			dashboardUrl.pathname = `${dashboardUrl.pathname.replace(/\/$/, "")}/custodian`;
			dashboardUrl.searchParams.set("onboarding", "1");
		} else if (params.agentId) dashboardUrl.searchParams.set("session", `agent:${params.agentId}:main`);
		runtime.log(t("wizard.guided.quickstartDashboard", { url: dashboardUrl.toString() }));
		runtime.log(t("wizard.guided.quickstartForeground"));
		runtime.log(t("wizard.guided.quickstartBackground"));
		runtime.log(t("wizard.guided.quickstartReopen"));
		if (setupOnly) runtime.log("Use openclaw setup for the setup assistant. Choose a primary model with openclaw onboard before regular agent chat.");
		await gateway;
	});
}
//#endregion
export { runQuickstartForegroundGateway };
