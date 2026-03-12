import "./paths-BJV7vkaX.js";
import "./globals-BozXJ-QJ.js";
import { h as pathExists, y as resolveUserPath } from "./utils-BzWe_IKB.js";
import "./model-selection-BRhJAUKb.js";
import "./reply-CCXYDkRB.js";
import { y as DEFAULT_BOOTSTRAP_FILENAME } from "./agent-scope-Dx6t10xJ.js";
import { m as restoreTerminalState } from "./subsystem-NSiOA8hi.js";
import "./openclaw-root-BgG4cyU3.js";
import "./logger-CX3t1bKz.js";
import "./exec-B1lVds_y.js";
import "./github-copilot-token-BD0SJwml.js";
import { r as resolveCliName, t as formatCliCommand } from "./command-format-Dl98Vqkn.js";
import "./boolean-B6zcAynR.js";
import "./env-ChlBW8C4.js";
import "./env-overrides-C_5dHP8H.js";
import "./runtime-overrides-BlDGW6c7.js";
import "./registry-Bwq7RDwU.js";
import "./skills-B5bzQ_n_.js";
import "./frontmatter-CNhVfaKz.js";
import "./plugins-7t5A5YJP.js";
import "./windows-spawn-BAKAvVI9.js";
import "./redact-DWSz2XT_.js";
import "./path-alias-guards-CbtFbGMl.js";
import "./errors-Cvi_W98b.js";
import "./send-DSM74Le3.js";
import "./send-CHdjCxfM.js";
import "./paths-B3fM69Ic.js";
import "./chat-envelope-DUjyuML-.js";
import "./audio-transcription-runner-Co3IGX6I.js";
import "./image-DQrHnMco.js";
import "./models-config-SmFayixR.js";
import "./tool-display-sVkRN5IQ.js";
import "./fetch-guard-Sa6WT-j-.js";
import "./api-key-rotation-CxGeWKo4.js";
import "./local-roots-Dx-W2ctQ.js";
import "./model-catalog-R9lrAX5y.js";
import "./proxy-fetch-DHPfZjfB.js";
import "./tokens-DNNmyytE.js";
import "./deliver-CBpHrKCR.js";
import "./commands-DJcqkLzs.js";
import "./commands-registry-C6-Sw-9S.js";
import "./call-CGmUC45G.js";
import "./read-only-account-inspect-BYTbLmn-.js";
import "./send-plgDSxi2.js";
import "./pi-model-discovery-DqLk9GdO.js";
import "./ir-C3NVthTb.js";
import "./render-BN-UbX-m.js";
import "./target-errors-ktTxpmqA.js";
import "./with-timeout-ojFtnVc9.js";
import "./diagnostic-rsbggqQM.js";
import "./exec-approvals-allowlist-DIMuKva2.js";
import "./exec-safe-bin-runtime-policy-oIkOeHmm.js";
import "./exec-approvals-Dmpxx9a7.js";
import "./nodes-screen-CSX42i3Y.js";
import "./restart-Dd1X7N_e.js";
import "./system-run-command-DM5s0YZ1.js";
import "./runtime-web-tools-BEc15rYi.js";
import "./runtime-DfihcdQF.js";
import "./stagger-BL_zy07S.js";
import "./channel-selection-BAU5AQsK.js";
import "./plugin-auto-enable-BBFWfBBL.js";
import "./send-DWczDrkX.js";
import "./outbound-attachment-DXEN6iTE.js";
import "./fetch-C28BvV1J.js";
import "./delivery-queue-DCGoWKK2.js";
import "./send-DvXqtbBS.js";
import "./pairing-store-CREONAb_.js";
import "./session-cost-usage-Cz5kozNM.js";
import "./sqlite-Ch5fX2EB.js";
import "./channel-activity-BIpicHYd.js";
import "./tables-BmkACGX-.js";
import "./fetch-CVHFK0bN.js";
import "./timeouts-DZvg6Pwq.js";
import "./skill-commands-CLdu5Xk9.js";
import "./workspace-dirs-DO6iNo4t.js";
import "./pairing-token-DvXTp71G.js";
import "./command-secret-targets-CGUoVJF5.js";
import "./connection-auth-DI-T0p2K.js";
import { b as waitForGatewayReachable, f as openUrl, g as resolveControlUiLinks, i as detectBrowserOpenSupport, m as probeGatewayReachable, o as formatControlUiSshHint } from "./onboard-helpers-JN2sbVho.js";
import "./prompt-style-fqsyersP.js";
import "./pairing-labels-Tl9X9H-7.js";
import "./memory-cli-BfPK9jaN.js";
import "./manager-9n5vXmpA.js";
import "./links-Kt0rFq9G.js";
import "./cli-utils-B9eWuDii.js";
import "./help-format-Cj82FtTx.js";
import "./progress-DFpY5mr6.js";
import "./runtime-guard-NUIBQgL8.js";
import "./program-context-D9oychJa.js";
import "./note-DUZmkXUD.js";
import { r as installCompletion } from "./completion-cli-BfiFUSR0.js";
import "./daemon-install-plan.shared-CYN5AepX.js";
import { n as buildGatewayInstallPlan, r as gatewayInstallErrorHint, t as resolveGatewayInstallToken } from "./gateway-install-token-CG9nu18_.js";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-PDKGe0fy.js";
import { i as isSystemdUserServiceAvailable } from "./systemd-DTFIsPDY.js";
import { n as resolveGatewayService, t as describeGatewayServiceRestart } from "./service-CjQa65BD.js";
import { r as healthCommand } from "./health-CnIrModd.js";
import { t as ensureControlUiAssetsBuilt } from "./control-ui-assets-2PrTOjBU.js";
import { t as resolveOnboardingSecretInputString } from "./onboarding.secret-input-BJWxbbY0.js";
import { t as formatHealthCheckFailure } from "./health-format-DsQgcMCK.js";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-BZFDFcjY.js";
import { t as runTui } from "./tui-D1piHteH.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/wizard/onboarding.completion.ts
async function resolveProfileHint(shell) {
	const home = process.env.HOME || os.homedir();
	if (shell === "zsh") return "~/.zshrc";
	if (shell === "bash") return await pathExists(path.join(home, ".bashrc")) ? "~/.bashrc" : "~/.bash_profile";
	if (shell === "fish") return "~/.config/fish/config.fish";
	return "$PROFILE";
}
function formatReloadHint(shell, profileHint) {
	if (shell === "powershell") return "Restart your shell (or reload your PowerShell profile).";
	return `Restart your shell or run: source ${profileHint}`;
}
async function setupOnboardingShellCompletion(params) {
	const deps = {
		resolveCliName,
		checkShellCompletionStatus,
		ensureCompletionCacheExists,
		installCompletion,
		...params.deps
	};
	const cliName = deps.resolveCliName();
	const completionStatus = await deps.checkShellCompletionStatus(cliName);
	if (completionStatus.usesSlowPattern) {
		if (await deps.ensureCompletionCacheExists(cliName)) await deps.installCompletion(completionStatus.shell, true, cliName);
		return;
	}
	if (completionStatus.profileInstalled && !completionStatus.cacheExists) {
		await deps.ensureCompletionCacheExists(cliName);
		return;
	}
	if (!completionStatus.profileInstalled) {
		if (!(params.flow === "quickstart" ? true : await params.prompter.confirm({
			message: `Enable ${completionStatus.shell} shell completion for ${cliName}?`,
			initialValue: true
		}))) return;
		if (!await deps.ensureCompletionCacheExists(cliName)) {
			await params.prompter.note(`Failed to generate completion cache. Run \`${cliName} completion --install\` later.`, "Shell completion");
			return;
		}
		await deps.installCompletion(completionStatus.shell, true, cliName);
		const profileHint = await resolveProfileHint(completionStatus.shell);
		await params.prompter.note(`Shell completion installed. ${formatReloadHint(completionStatus.shell, profileHint)}`, "Shell completion");
	}
}
//#endregion
//#region src/wizard/onboarding.finalize.ts
async function finalizeOnboardingWizard(options) {
	const { flow, opts, baseConfig, nextConfig, settings, prompter, runtime } = options;
	const withWizardProgress = async (label, options, work) => {
		const progress = prompter.progress(label);
		try {
			return await work(progress);
		} finally {
			progress.stop(typeof options.doneMessage === "function" ? options.doneMessage() : options.doneMessage);
		}
	};
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	if (process.platform === "linux" && !systemdAvailable) await prompter.note("Systemd user services are unavailable. Skipping lingering checks and service install.", "Systemd");
	if (process.platform === "linux" && systemdAvailable) {
		const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-CZIQX4g4.js").then((n) => n.r);
		await ensureSystemdUserLingerInteractive({
			runtime,
			prompter: {
				confirm: prompter.confirm,
				note: prompter.note
			},
			reason: "Linux installs use a systemd user service by default. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
			requireConfirm: false
		});
	}
	const explicitInstallDaemon = typeof opts.installDaemon === "boolean" ? opts.installDaemon : void 0;
	let installDaemon;
	if (explicitInstallDaemon !== void 0) installDaemon = explicitInstallDaemon;
	else if (process.platform === "linux" && !systemdAvailable) installDaemon = false;
	else if (flow === "quickstart") installDaemon = true;
	else installDaemon = await prompter.confirm({
		message: "Install Gateway service (recommended)",
		initialValue: true
	});
	if (process.platform === "linux" && !systemdAvailable && installDaemon) {
		await prompter.note("Systemd user services are unavailable; skipping service install. Use your container supervisor or `docker compose up -d`.", "Gateway service");
		installDaemon = false;
	}
	if (installDaemon) {
		const daemonRuntime = flow === "quickstart" ? DEFAULT_GATEWAY_DAEMON_RUNTIME : await prompter.select({
			message: "Gateway service runtime",
			options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
			initialValue: opts.daemonRuntime ?? "node"
		});
		if (flow === "quickstart") await prompter.note("QuickStart uses Node for the Gateway service (stable + supported).", "Gateway service runtime");
		const service = resolveGatewayService();
		const loaded = await service.isLoaded({ env: process.env });
		let restartWasScheduled = false;
		if (loaded) {
			const action = await prompter.select({
				message: "Gateway service already installed",
				options: [
					{
						value: "restart",
						label: "Restart"
					},
					{
						value: "reinstall",
						label: "Reinstall"
					},
					{
						value: "skip",
						label: "Skip"
					}
				]
			});
			if (action === "restart") {
				let restartDoneMessage = "Gateway service restarted.";
				await withWizardProgress("Gateway service", { doneMessage: () => restartDoneMessage }, async (progress) => {
					progress.update("Restarting Gateway service…");
					const restartStatus = describeGatewayServiceRestart("Gateway", await service.restart({
						env: process.env,
						stdout: process.stdout
					}));
					restartDoneMessage = restartStatus.progressMessage;
					restartWasScheduled = restartStatus.scheduled;
				});
			} else if (action === "reinstall") await withWizardProgress("Gateway service", { doneMessage: "Gateway service uninstalled." }, async (progress) => {
				progress.update("Uninstalling Gateway service…");
				await service.uninstall({
					env: process.env,
					stdout: process.stdout
				});
			});
		}
		if (!loaded || !restartWasScheduled && loaded && !await service.isLoaded({ env: process.env })) {
			const progress = prompter.progress("Gateway service");
			let installError = null;
			try {
				progress.update("Preparing Gateway service…");
				const tokenResolution = await resolveGatewayInstallToken({
					config: nextConfig,
					env: process.env
				});
				for (const warning of tokenResolution.warnings) await prompter.note(warning, "Gateway service");
				if (tokenResolution.unavailableReason) installError = [
					"Gateway install blocked:",
					tokenResolution.unavailableReason,
					"Fix gateway auth config/token input and rerun onboarding."
				].join(" ");
				else {
					const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
						env: process.env,
						port: settings.port,
						runtime: daemonRuntime,
						warn: (message, title) => prompter.note(message, title),
						config: nextConfig
					});
					progress.update("Installing Gateway service…");
					await service.install({
						env: process.env,
						stdout: process.stdout,
						programArguments,
						workingDirectory,
						environment
					});
				}
			} catch (err) {
				installError = err instanceof Error ? err.message : String(err);
			} finally {
				progress.stop(installError ? "Gateway service install failed." : "Gateway service installed.");
			}
			if (installError) {
				await prompter.note(`Gateway service install failed: ${installError}`, "Gateway");
				await prompter.note(gatewayInstallErrorHint(), "Gateway");
			}
		}
	}
	if (!opts.skipHealth) {
		await waitForGatewayReachable({
			url: resolveControlUiLinks({
				bind: nextConfig.gateway?.bind ?? "loopback",
				port: settings.port,
				customBindHost: nextConfig.gateway?.customBindHost,
				basePath: void 0
			}).wsUrl,
			token: settings.gatewayToken,
			deadlineMs: 15e3
		});
		try {
			await healthCommand({
				json: false,
				timeoutMs: 1e4
			}, runtime);
		} catch (err) {
			runtime.error(formatHealthCheckFailure(err));
			await prompter.note([
				"Docs:",
				"https://docs.openclaw.ai/gateway/health",
				"https://docs.openclaw.ai/gateway/troubleshooting"
			].join("\n"), "Health check help");
		}
	}
	const controlUiEnabled = nextConfig.gateway?.controlUi?.enabled ?? baseConfig.gateway?.controlUi?.enabled ?? true;
	if (!opts.skipUi && controlUiEnabled) {
		const controlUiAssets = await ensureControlUiAssetsBuilt(runtime);
		if (!controlUiAssets.ok && controlUiAssets.message) runtime.error(controlUiAssets.message);
	}
	await prompter.note([
		"Add nodes for extra features:",
		"- macOS app (system + notifications)",
		"- iOS app (camera/canvas)",
		"- Android app (camera/canvas)"
	].join("\n"), "Optional apps");
	const controlUiBasePath = nextConfig.gateway?.controlUi?.basePath ?? baseConfig.gateway?.controlUi?.basePath;
	const links = resolveControlUiLinks({
		bind: settings.bind,
		port: settings.port,
		customBindHost: settings.customBindHost,
		basePath: controlUiBasePath
	});
	const authedUrl = settings.authMode === "token" && settings.gatewayToken ? `${links.httpUrl}#token=${encodeURIComponent(settings.gatewayToken)}` : links.httpUrl;
	let resolvedGatewayPassword = "";
	if (settings.authMode === "password") try {
		resolvedGatewayPassword = await resolveOnboardingSecretInputString({
			config: nextConfig,
			value: nextConfig.gateway?.auth?.password,
			path: "gateway.auth.password",
			env: process.env
		}) ?? "";
	} catch (error) {
		await prompter.note(["Could not resolve gateway.auth.password SecretRef for onboarding auth.", error instanceof Error ? error.message : String(error)].join("\n"), "Gateway auth");
	}
	const gatewayProbe = await probeGatewayReachable({
		url: links.wsUrl,
		token: settings.authMode === "token" ? settings.gatewayToken : void 0,
		password: settings.authMode === "password" ? resolvedGatewayPassword : ""
	});
	const gatewayStatusLine = gatewayProbe.ok ? "Gateway: reachable" : `Gateway: not detected${gatewayProbe.detail ? ` (${gatewayProbe.detail})` : ""}`;
	const bootstrapPath = path.join(resolveUserPath(options.workspaceDir), DEFAULT_BOOTSTRAP_FILENAME);
	const hasBootstrap = await fs.access(bootstrapPath).then(() => true).catch(() => false);
	await prompter.note([
		`Web UI: ${links.httpUrl}`,
		settings.authMode === "token" && settings.gatewayToken ? `Web UI (with token): ${authedUrl}` : void 0,
		`Gateway WS: ${links.wsUrl}`,
		gatewayStatusLine,
		"Docs: https://docs.openclaw.ai/web/control-ui"
	].filter(Boolean).join("\n"), "Control UI");
	let controlUiOpened = false;
	let controlUiOpenHint;
	let hatchChoice = null;
	let launchedTui = false;
	if (!opts.skipUi && gatewayProbe.ok) {
		if (hasBootstrap) await prompter.note([
			"This is the defining action that makes your agent you.",
			"Please take your time.",
			"The more you tell it, the better the experience will be.",
			"We will send: \"Wake up, my friend!\""
		].join("\n"), "Start TUI (best option!)");
		await prompter.note([
			"Gateway token: shared auth for the Gateway + Control UI.",
			"Stored in: ~/.openclaw/openclaw.json (gateway.auth.token) or OPENCLAW_GATEWAY_TOKEN.",
			`View token: ${formatCliCommand("openclaw config get gateway.auth.token")}`,
			`Generate token: ${formatCliCommand("openclaw doctor --generate-gateway-token")}`,
			"Web UI keeps dashboard URL tokens in memory for the current tab and strips them from the URL after load.",
			`Open the dashboard anytime: ${formatCliCommand("openclaw dashboard --no-open")}`,
			"If prompted: paste the token into Control UI settings (or use the tokenized dashboard URL)."
		].join("\n"), "Token");
		hatchChoice = await prompter.select({
			message: "How do you want to hatch your bot?",
			options: [
				{
					value: "tui",
					label: "Hatch in TUI (recommended)"
				},
				{
					value: "web",
					label: "Open the Web UI"
				},
				{
					value: "later",
					label: "Do this later"
				}
			],
			initialValue: "tui"
		});
		if (hatchChoice === "tui") {
			restoreTerminalState("pre-onboarding tui", { resumeStdinIfPaused: true });
			await runTui({
				url: links.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				password: settings.authMode === "password" ? resolvedGatewayPassword : "",
				deliver: false,
				message: hasBootstrap ? "Wake up, my friend!" : void 0
			});
			launchedTui = true;
		} else if (hatchChoice === "web") {
			if ((await detectBrowserOpenSupport()).ok) {
				controlUiOpened = await openUrl(authedUrl);
				if (!controlUiOpened) controlUiOpenHint = formatControlUiSshHint({
					port: settings.port,
					basePath: controlUiBasePath,
					token: settings.authMode === "token" ? settings.gatewayToken : void 0
				});
			} else controlUiOpenHint = formatControlUiSshHint({
				port: settings.port,
				basePath: controlUiBasePath,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0
			});
			await prompter.note([
				`Dashboard link (with token): ${authedUrl}`,
				controlUiOpened ? "Opened in your browser. Keep that tab to control OpenClaw." : "Copy/paste this URL in a browser on this machine to control OpenClaw.",
				controlUiOpenHint
			].filter(Boolean).join("\n"), "Dashboard ready");
		} else await prompter.note(`When you're ready: ${formatCliCommand("openclaw dashboard --no-open")}`, "Later");
	} else if (opts.skipUi) await prompter.note("Skipping Control UI/TUI prompts.", "Control UI");
	await prompter.note(["Back up your agent workspace.", "Docs: https://docs.openclaw.ai/concepts/agent-workspace"].join("\n"), "Workspace backup");
	await prompter.note("Running agents on your computer is risky — harden your setup: https://docs.openclaw.ai/security", "Security");
	await setupOnboardingShellCompletion({
		flow,
		prompter
	});
	if (!opts.skipUi && settings.authMode === "token" && Boolean(settings.gatewayToken) && hatchChoice === null) {
		if ((await detectBrowserOpenSupport()).ok) {
			controlUiOpened = await openUrl(authedUrl);
			if (!controlUiOpened) controlUiOpenHint = formatControlUiSshHint({
				port: settings.port,
				basePath: controlUiBasePath,
				token: settings.gatewayToken
			});
		} else controlUiOpenHint = formatControlUiSshHint({
			port: settings.port,
			basePath: controlUiBasePath,
			token: settings.gatewayToken
		});
		await prompter.note([
			`Dashboard link (with token): ${authedUrl}`,
			controlUiOpened ? "Opened in your browser. Keep that tab to control OpenClaw." : "Copy/paste this URL in a browser on this machine to control OpenClaw.",
			controlUiOpenHint
		].filter(Boolean).join("\n"), "Dashboard ready");
	}
	const webSearchProvider = nextConfig.tools?.web?.search?.provider;
	const webSearchEnabled = nextConfig.tools?.web?.search?.enabled;
	if (webSearchProvider) {
		const { SEARCH_PROVIDER_OPTIONS, resolveExistingKey, hasExistingKey, hasKeyInEnv } = await import("./onboard-search-CclrSJ9Y.js");
		const entry = SEARCH_PROVIDER_OPTIONS.find((e) => e.value === webSearchProvider);
		const label = entry?.label ?? webSearchProvider;
		const storedKey = resolveExistingKey(nextConfig, webSearchProvider);
		const keyConfigured = hasExistingKey(nextConfig, webSearchProvider);
		const envAvailable = entry ? hasKeyInEnv(entry) : false;
		const hasKey = keyConfigured || envAvailable;
		const keySource = storedKey ? "API key: stored in config." : keyConfigured ? "API key: configured via secret reference." : envAvailable ? `API key: provided via ${entry?.envKeys.join(" / ")} env var.` : void 0;
		if (webSearchEnabled !== false && hasKey) await prompter.note([
			"Web search is enabled, so your agent can look things up online when needed.",
			"",
			`Provider: ${label}`,
			...keySource ? [keySource] : [],
			"Docs: https://docs.openclaw.ai/tools/web"
		].join("\n"), "Web search");
		else if (!hasKey) await prompter.note([
			`Provider ${label} is selected but no API key was found.`,
			"web_search will not work until a key is added.",
			`  ${formatCliCommand("openclaw configure --section web")}`,
			"",
			`Get your key at: ${entry?.signupUrl ?? "https://docs.openclaw.ai/tools/web"}`,
			"Docs: https://docs.openclaw.ai/tools/web"
		].join("\n"), "Web search");
		else await prompter.note([
			`Web search (${label}) is configured but disabled.`,
			`Re-enable: ${formatCliCommand("openclaw configure --section web")}`,
			"",
			"Docs: https://docs.openclaw.ai/tools/web"
		].join("\n"), "Web search");
	} else {
		const { SEARCH_PROVIDER_OPTIONS, hasExistingKey, hasKeyInEnv } = await import("./onboard-search-CclrSJ9Y.js");
		const legacyDetected = SEARCH_PROVIDER_OPTIONS.find((e) => hasExistingKey(nextConfig, e.value) || hasKeyInEnv(e));
		if (legacyDetected) await prompter.note([`Web search is available via ${legacyDetected.label} (auto-detected).`, "Docs: https://docs.openclaw.ai/tools/web"].join("\n"), "Web search");
		else await prompter.note([
			"Web search was skipped. You can enable it later:",
			`  ${formatCliCommand("openclaw configure --section web")}`,
			"",
			"Docs: https://docs.openclaw.ai/tools/web"
		].join("\n"), "Web search");
	}
	await prompter.note("What now: https://openclaw.ai/showcase (\"What People Are Building\").", "What now");
	await prompter.outro(controlUiOpened ? "Onboarding complete. Dashboard opened; keep that tab to control OpenClaw." : "Onboarding complete. Use the dashboard link above to control OpenClaw.");
	return { launchedTui };
}
//#endregion
export { finalizeOnboardingWizard };
