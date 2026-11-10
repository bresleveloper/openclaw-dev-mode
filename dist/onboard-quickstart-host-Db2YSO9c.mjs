import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-BxFUj82Q.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-B1O-0cQW.mjs";
import { r as t } from "./i18n-CwUnB3fI.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-ZxucSM6y.mjs";
import { p as waitForGatewayReachable } from "./onboard-helpers-m0Fx_yHI.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-DWhOAATA.mjs";
import { t as resolveGatewayRunOptions } from "./run-options-BBN9NBEz.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { n as runBrowserHatchHandoff, t as resolveOnboardingDashboardTarget } from "./onboard-browser-handoff-CB003XD-.mjs";
//#region src/commands/onboard-quickstart-host.ts
/** Start the foreground Gateway with fresh plugin facts after onboarding installs. */
async function runQuickstartForegroundGateway(params) {
	return await withPluginCache(createPluginCache(), async () => {
		const { runtime } = params;
		const { config } = await readConfigFileSnapshot();
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
		const { runGatewayCommand } = await import("./run-DMO4ouZ5.mjs");
		const gateway = runGatewayCommand(resolveGatewayRunOptions({}), getGatewayRunRuntimeHooks());
		const stopped = gateway.then(() => null);
		const reachable = await Promise.race([stopped, waitForGatewayReachable({
			url: links.wsUrl,
			token: authMode === "token" ? credentials.token : void 0,
			password: authMode === "password" || authMode === "trusted-proxy" ? credentials.password : void 0,
			...resolveGatewayStartupTiming()
		})]);
		if (!reachable) return;
		if (reachable.ok) {
			const handoff = await Promise.race([stopped, runBrowserHatchHandoff({
				config,
				prompter: createQuickstartNotePrompter(runtime),
				suppressTokenOutput: params.suppressTokenOutput,
				...params.agentId ? { agentId: params.agentId } : {}
			}).catch(() => ({ handedOff: false }))]);
			if (!handoff) return;
			if (!handoff.handedOff) runtime.log(t("wizard.guided.quickstartBrowserUnavailable"));
		} else runtime.log(t("wizard.guided.quickstartGatewayPending"));
		const { url: dashboardUrl, setupOnly } = await resolveOnboardingDashboardTarget(links.httpUrl, config, params.agentId);
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
