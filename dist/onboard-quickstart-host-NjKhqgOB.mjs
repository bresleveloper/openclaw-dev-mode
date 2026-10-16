import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-DxDUO_P2.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-CvxEAkDu.mjs";
import { p as waitForGatewayReachable } from "./onboard-helpers-Bsi2Iqsv.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-B1Bq2xRF.mjs";
import { t as resolveGatewayRunOptions } from "./run-options-BBN9NBEz.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { n as resolveOnboardingDashboardTarget, r as runBrowserHatchHandoff } from "./onboard-browser-handoff-D5g8Wj8y.mjs";
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
		const gateway = (deps.runGateway ?? (await import("./run-DFCMbAt4.mjs")).runGatewayCommand)(resolveGatewayRunOptions({}), getGatewayRunRuntimeHooks());
		const stopped = gateway.then(() => null);
		const reachable = await Promise.race([stopped, (deps.waitForGateway ?? waitForGatewayReachable)({
			url: links.wsUrl,
			token: authMode === "token" ? credentials.token : void 0,
			password: authMode === "password" || authMode === "trusted-proxy" ? credentials.password : void 0,
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
