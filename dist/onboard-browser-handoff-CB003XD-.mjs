import "./utils-gjJ-tD2q.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { i as GATEWAY_CLIENT_NAMES, n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { t as detectBrowserOpenSupport } from "./browser-open-C7wb2rVh.mjs";
import { r as callGateway } from "./call-b1jzw5fz.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-B1O-0cQW.mjs";
import { r as t } from "./i18n-CwUnB3fI.mjs";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-ZxucSM6y.mjs";
import { i as formatControlUiSshHint } from "./onboard-helpers-m0Fx_yHI.mjs";
import { t as openUrlPrivately } from "./browser-handoff-Lb6DU2Il.mjs";
import { i as waitForControlUiDocument, n as issueControlUiBrowserHandoff, r as resolveControlUiHandoffTarget, t as hasVerifiedControlUiLoopbackAlias } from "./control-ui-handoff-CtxrMx9i.mjs";
//#region src/commands/onboard-browser-handoff.ts
const GUI_HANDOFF_TIMEOUT_MS = 6e4;
const HEADLESS_HANDOFF_TIMEOUT_MS = 3e5;
const HANDOFF_POLL_INTERVAL_MS = 1e3;
const HANDOFF_PROBE_TIMEOUT_MS = 5e3;
async function resolveBrowserHatchTarget(config, env) {
	const shared = await resolveControlUiHandoffTarget({
		config,
		env
	});
	const credentials = await resolveGatewayCredentialsWithSecretInputs({
		config,
		env,
		modeOverride: "local"
	});
	const authMode = !config.gateway?.auth?.mode && credentials.password ? "password" : shared.authMode;
	const token = authMode === "token" ? credentials.token : void 0;
	const setupAuthValue = authMode === "password" ? credentials.password : void 0;
	const target = {
		config,
		links: shared.links,
		documentUrl: shared.documentUrl,
		port: shared.port,
		...shared.loopbackAliasHost ? { loopbackAliasHost: shared.loopbackAliasHost } : {},
		...shared.tlsConfig ? { tlsConfig: shared.tlsConfig } : {},
		...shared.bind === "loopback" || shared.tlsConfig?.enabled !== true ? { sshHint: formatControlUiSshHint({
			port: shared.port,
			...shared.basePath ? { basePath: shared.basePath } : {},
			tlsEnabled: shared.tlsConfig?.enabled === true
		}) } : {},
		...token ? { token } : {}
	};
	if (setupAuthValue) target["password"] = setupAuthValue;
	return target;
}
function isConnectedControlUi(entry) {
	return entry.host === GATEWAY_CLIENT_IDS.CONTROL_UI && entry.mode === GATEWAY_CLIENT_MODES.WEBCHAT && entry.reason !== "disconnect";
}
function retargetBrowserHandoffUrl(browserUrl, links) {
	const issued = new URL(browserUrl);
	const visible = new URL(links.httpUrl);
	const fragment = new URLSearchParams(issued.hash.slice(1));
	fragment.set("gatewayUrl", links.wsUrl);
	visible.pathname = issued.pathname;
	visible.search = issued.search;
	visible.hash = fragment.toString();
	return visible.toString();
}
function resolveConnectedControlUiPresenceKeys(entries) {
	return entries.filter(isConnectedControlUi).map((entry) => [
		entry.deviceId,
		entry.instanceId,
		entry.host,
		entry.mode
	].join("\0"));
}
async function probeDashboardPresence(target, timeoutMs) {
	try {
		return {
			reachable: true,
			clientKeys: resolveConnectedControlUiPresenceKeys(await callGateway({
				config: target.config,
				method: "system-presence",
				timeoutMs,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI,
				...target.token ? { token: target.token } : {},
				...target.password ? { password: target.password } : {},
				expectFinal: false,
				ignoreEnvUrlOverride: true
			}) ?? [])
		};
	} catch {
		return { reachable: false };
	}
}
async function waitForDashboardClient(params) {
	const deadline = Date.now() + params.timeoutMs;
	while (true) {
		const beforeProbeMs = deadline - Date.now();
		if (beforeProbeMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		const result = await probeDashboardPresence(params.target, Math.min(HANDOFF_PROBE_TIMEOUT_MS, beforeProbeMs));
		if (!result.reachable) return {
			connected: false,
			reason: "gateway-unreachable"
		};
		if (result.clientKeys.some((key) => !params.baselineClientKeys.has(key))) return { connected: true };
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		await sleep(Math.min(HANDOFF_POLL_INTERVAL_MS, remainingMs));
	}
}
async function resolveOnboardingDashboardTarget(dashboardUrl, config, agentId) {
	const url = new URL(dashboardUrl);
	const [{ resolveConfiguredSetupModelForAgent }, { resolveSystemAgentOnboardingTarget }] = await Promise.all([import("./utility-model-BTZGScO4.mjs"), import("./onboard-agent-target-CTLkRUDJ.mjs")]);
	const setupOnly = resolveConfiguredSetupModelForAgent({
		cfg: config,
		agentId: agentId ?? resolveSystemAgentOnboardingTarget(config).agentId
	})?.modelTarget === "utility";
	if (setupOnly) {
		url.pathname = `${url.pathname.replace(/\/$/, "")}/custodian`;
		url.searchParams.set("onboarding", "1");
	} else if (agentId) url.searchParams.set("session", `agent:${agentId}:main`);
	return {
		url,
		setupOnly
	};
}
/** Opens or prints the dashboard and waits for its Control UI client connection. */
async function runBrowserHatchHandoff(params) {
	const env = process.env;
	if (params.suppressTokenOutput === true || params.config.gateway?.controlUi?.enabled === false) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	const canOpenBrowser = (await detectBrowserOpenSupport()).ok;
	let target;
	try {
		target = await resolveBrowserHatchTarget(params.config, env);
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	if (!await hasVerifiedControlUiLoopbackAlias(target)) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	let progress;
	try {
		if (!(await waitForControlUiDocument({
			url: target.documentUrl,
			tlsConfig: target.tlsConfig,
			onPending: () => {
				progress = params.prompter.progress(t("wizard.guided.controlUiPreparing"));
			}
		})).ready) return {
			handedOff: false,
			reason: "target-unavailable"
		};
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	} finally {
		progress?.stop();
	}
	const baseline = await probeDashboardPresence(target, HANDOFF_PROBE_TIMEOUT_MS);
	if (!baseline.reachable) return {
		handedOff: false,
		reason: "gateway-unreachable"
	};
	let browserUrl;
	try {
		const { url } = await resolveOnboardingDashboardTarget((await issueControlUiBrowserHandoff(target.links)).browserUrl, params.config, params.agentId);
		browserUrl = url.toString();
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	let opened = false;
	if (canOpenBrowser) try {
		opened = await openUrlPrivately(browserUrl);
	} catch {
		opened = false;
	}
	if (opened) await params.prompter.note(t("wizard.guided.browserHandoffOpening"), t("wizard.guided.browserHandoffTitle"));
	else {
		const bind = target.config.gateway?.bind;
		const remoteBind = bind === "lan" || bind === "tailnet" || bind === "custom";
		const remoteSession = Boolean(env.SSH_CLIENT || env.SSH_TTY || env.SSH_CONNECTION || env.REMOTE_CONTAINERS || env.CODESPACES);
		const directRemoteDisplay = remoteBind && target.tlsConfig?.enabled === true;
		const tunnelHint = !directRemoteDisplay && (!canOpenBrowser || remoteSession) ? target.sshHint ?? (remoteBind ? formatControlUiSshHint({
			port: target.port,
			...target.config.gateway?.controlUi?.basePath ? { basePath: target.config.gateway.controlUi.basePath } : {},
			tlsEnabled: target.tlsConfig?.enabled === true
		}) : void 0) : void 0;
		const sshHint = tunnelHint ? `\n\n${tunnelHint}` : "";
		const visibleLinks = directRemoteDisplay ? await resolveAdvertisedControlUiLinks({
			bind,
			port: target.port,
			customBindHost: target.config.gateway?.customBindHost,
			basePath: target.config.gateway?.controlUi?.basePath,
			tlsEnabled: target.tlsConfig?.enabled === true
		}) : target.links;
		const visibleUrl = retargetBrowserHandoffUrl(browserUrl, visibleLinks);
		await params.prompter.note(`${t("wizard.guided.browserHandoffCopy", { url: visibleUrl })}${sshHint}`, t("wizard.guided.browserHandoffTitle"));
	}
	const wait = await waitForDashboardClient({
		target,
		baselineClientKeys: new Set(baseline.clientKeys),
		timeoutMs: opened ? GUI_HANDOFF_TIMEOUT_MS : HEADLESS_HANDOFF_TIMEOUT_MS
	});
	if (!wait.connected) return {
		handedOff: false,
		reason: wait.reason
	};
	await params.prompter.note(t("wizard.guided.browserHandoffContinuing"), t("wizard.guided.browserHandoffTitle"));
	return { handedOff: true };
}
//#endregion
export { runBrowserHatchHandoff as n, resolveOnboardingDashboardTarget as t };
