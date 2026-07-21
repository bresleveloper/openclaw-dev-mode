import { d as resolveGatewayPort } from "./paths-BMBAvkNf.js";
import { _ as shortenHomePath } from "./utils-CRO4LGEB.js";
import "./config-Cc93keN1.js";
//#region src/crestodian/setup-apply.ts
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
function createQuickstartNotePrompter(runtime) {
	const unexpected = (kind) => {
		throw new Error(`crestodian setup hit an interactive ${kind} prompt; quickstart must not ask`);
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message, title) => {
			runtime.log(title ? `${title}: ${message}` : message);
		},
		select: async (params) => {
			if (params.initialValue !== void 0) return params.initialValue;
			return unexpected("select");
		},
		multiselect: async () => unexpected("multiselect"),
		text: async () => unexpected("text"),
		confirm: async (params) => params.initialValue ?? true,
		progress: (label) => {
			runtime.log(label);
			return {
				update: (message) => runtime.log(message),
				stop: (message) => {
					if (message) runtime.log(message);
				}
			};
		}
	};
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
async function applyCrestodianSetup(params) {
	const { workspace, model, surface, runtime } = params;
	const [{ readSetupConfigFileSnapshot, resolveQuickstartGatewayDefaults, writeWizardConfigFile }, onboardHelpers, { applyLocalSetupWorkspaceConfig }] = await Promise.all([
		import("./setup.shared-BQEP9sD0.js"),
		import("./onboard-helpers-C3VZoo6M.js"),
		import("./onboard-config-CtFjmjLn.js")
	]);
	const snapshot = await readSetupConfigFileSnapshot();
	const baseConfig = snapshot.valid && snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, workspace);
	if (model) {
		const { applyDefaultModelPrimaryUpdate } = await import("./shared-bL65PgfF.js");
		nextConfig = applyDefaultModelPrimaryUpdate({
			cfg: nextConfig,
			modelRaw: model,
			field: "model"
		});
	}
	nextConfig = applySecurityAcknowledgement(nextConfig);
	const prompter = createQuickstartNotePrompter(runtime);
	const { configureGatewayForSetup } = await import("./setup.gateway-config-Dby6lY2u.js");
	const gateway = await configureGatewayForSetup({
		flow: "quickstart",
		baseConfig,
		nextConfig,
		localPort: resolveGatewayPort(baseConfig),
		quickstartGateway: resolveQuickstartGatewayDefaults(baseConfig),
		prompter,
		runtime
	});
	nextConfig = gateway.nextConfig;
	const settings = gateway.settings;
	nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode: "local"
	});
	nextConfig = await writeWizardConfigFile(nextConfig, { allowConfigSizeDrop: false });
	await onboardHelpers.ensureWorkspaceAndSessions(workspace, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	});
	try {
		const { loadExecApprovals, saveExecApprovals } = await import("./exec-approvals-Dij9CVPX.js");
		const approvals = loadExecApprovals();
		if (!approvals.agents?.crestodian) saveExecApprovals({
			...approvals,
			agents: {
				...approvals.agents,
				crestodian: {
					security: "full",
					ask: "off"
				}
			}
		});
	} catch (error) {
		runtime.log(`Could not record Crestodian exec approval (${error instanceof Error ? error.message : String(error)}); local model harnesses may ask again.`);
	}
	const lines = [`Workspace: ${shortenHomePath(workspace)}`, model ? `Default model: ${model}` : void 0].filter((line) => line !== void 0);
	if (surface === "cli") {
		const { ensureGatewayServiceForOnboarding } = await import("./setup.finalize-BfyXxSN3.js");
		const { installDaemon } = await ensureGatewayServiceForOnboarding({
			flow: "quickstart",
			opts: {},
			nextConfig,
			settings,
			prompter,
			runtime,
			loadedAction: "restart"
		});
		if (installDaemon) {
			const probeLinks = onboardHelpers.resolveLocalControlUiProbeLinks({
				bind: settings.bind,
				port: settings.port,
				customBindHost: settings.customBindHost,
				basePath: void 0,
				tlsEnabled: nextConfig.gateway?.tls?.enabled === true
			});
			const probe = await onboardHelpers.waitForGatewayReachable({
				url: probeLinks.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				deadlineMs: 15e3
			});
			lines.push(probe.ok ? `Gateway: running at ${probeLinks.wsUrl}` : `Gateway: not reachable yet (${probe.detail ?? "still starting"}) — say \`gateway status\` to check`);
		} else lines.push("Gateway: service install skipped — say `start gateway` when you want it running.");
	} else lines.push("Gateway: running (managed by this app).");
	return {
		configPath: snapshot.path,
		lines
	};
}
//#endregion
export { createQuickstartNotePrompter as n, applyCrestodianSetup as t };
