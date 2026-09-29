import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { i as GATEWAY_CLIENT_NAMES, n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-sFXvRs60.mjs";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { n as openUrl, t as detectBrowserOpenSupport } from "./browser-open-4uUcM1Wd.mjs";
import { i as formatControlUiSshHint } from "./onboard-helpers-0ZuVvEiw.mjs";
import { i as waitForControlUiDocument, n as issueControlUiBrowserHandoff, r as resolveControlUiHandoffTarget, t as hasVerifiedControlUiLoopbackAlias } from "./control-ui-handoff-B4iacXRw.mjs";
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
	} catch (error) {
		return {
			reachable: false,
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
async function waitForDashboardClient(params) {
	const now = params.now ?? Date.now;
	const sleepFor = params.sleep ?? sleep;
	const deadline = now() + params.timeoutMs;
	while (true) {
		const beforeProbeMs = deadline - now();
		if (beforeProbeMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		const result = await params.probe(params.target, Math.min(HANDOFF_PROBE_TIMEOUT_MS, beforeProbeMs));
		if (!result.reachable) return {
			connected: false,
			reason: "gateway-unreachable"
		};
		if (result.clientKeys.some((key) => !params.baselineClientKeys.has(key))) return { connected: true };
		const remainingMs = deadline - now();
		if (remainingMs <= 0) return {
			connected: false,
			reason: "timeout"
		};
		await sleepFor(Math.min(HANDOFF_POLL_INTERVAL_MS, remainingMs));
	}
}
/** Opens or prints the dashboard and waits for its Control UI client connection. */
async function runBrowserHatchHandoff(params, deps = {}) {
	const env = deps.env ?? process.env;
	if (params.suppressTokenOutput === true || params.config.gateway?.controlUi?.enabled === false) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	const canOpenBrowser = (await detectBrowserOpenSupport(deps)).ok;
	let target;
	try {
		target = await (deps.resolveTarget ?? resolveBrowserHatchTarget)(params.config, env);
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	if (!await (deps.verifyLoopbackAlias ?? hasVerifiedControlUiLoopbackAlias)(target)) return {
		handedOff: false,
		reason: "target-unavailable"
	};
	let progress;
	try {
		if (!(await (deps.waitForDocument ?? waitForControlUiDocument)({
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
	const probePresence = deps.probePresence ?? probeDashboardPresence;
	const baseline = await probePresence(target, HANDOFF_PROBE_TIMEOUT_MS);
	if (!baseline.reachable) return {
		handedOff: false,
		reason: "gateway-unreachable"
	};
	let browserUrl;
	try {
		const browserHandoff = await (deps.issueBrowserHandoff ?? issueControlUiBrowserHandoff)(target.links);
		const url = new URL(browserHandoff.browserUrl);
		const [{ resolveConfiguredSetupModelForAgent }, { resolveSystemAgentOnboardingTarget }] = await Promise.all([import("./utility-model-bWdwagEJ.mjs"), import("./onboard-agent-target-DefUwDFX.mjs")]);
		if (resolveConfiguredSetupModelForAgent({
			cfg: params.config,
			agentId: params.agentId ?? resolveSystemAgentOnboardingTarget(params.config).agentId
		})?.modelTarget === "utility") {
			url.pathname = `${url.pathname.replace(/\/$/, "")}/custodian`;
			url.searchParams.set("onboarding", "1");
		} else if (params.agentId) url.searchParams.set("session", `agent:${params.agentId}:main`);
		browserUrl = url.toString();
	} catch {
		return {
			handedOff: false,
			reason: "target-unavailable"
		};
	}
	let opened = false;
	if (canOpenBrowser) try {
		opened = await (deps.openBrowser ?? openUrl)(browserUrl);
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
	const wait = await (deps.pollForClient ?? waitForDashboardClient)({
		target,
		baselineClientKeys: new Set(baseline.clientKeys),
		timeoutMs: opened ? GUI_HANDOFF_TIMEOUT_MS : HEADLESS_HANDOFF_TIMEOUT_MS,
		probe: probePresence,
		...deps.now ? { now: deps.now } : {},
		...deps.sleep ? { sleep: deps.sleep } : {}
	});
	if (!wait.connected) return {
		handedOff: false,
		reason: wait.reason
	};
	await params.prompter.note(t("wizard.guided.browserHandoffContinuing"), t("wizard.guided.browserHandoffTitle"));
	return { handedOff: true };
}
//#endregion
export { runBrowserHatchHandoff as n, resolveConnectedControlUiPresenceKeys as t };
