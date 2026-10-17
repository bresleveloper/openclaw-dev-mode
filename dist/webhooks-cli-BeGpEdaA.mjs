import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { a as displayPath } from "./utils-DgZn2dLu.mjs";
import { b as resolveGatewayPort, t as CONFIG_PATH } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-BYbkpAYn.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { i as formatCommandResult } from "./command-error-CFVNEvkJ.mjs";
import { r as validateConfigObjectWithPlugins } from "./validation-BeAnc62d.mjs";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { r as replaceConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { _ as parseTopicPath, a as DEFAULT_GMAIL_SERVE_PORT, b as resolveGogExecutable, c as buildDefaultHookUrl, d as buildGogWatchStartArgs, f as buildTopicPath, g as normalizeServePath, h as normalizeHooksPath, i as DEFAULT_GMAIL_SERVE_PATH, m as mergeHookPresets, n as DEFAULT_GMAIL_MAX_BYTES, o as DEFAULT_GMAIL_SUBSCRIPTION, p as generateHookToken, r as DEFAULT_GMAIL_SERVE_BIND, s as DEFAULT_GMAIL_TOPIC, t as DEFAULT_GMAIL_LABEL, y as resolveGmailHookRuntimeConfig } from "./gmail-BG9VhL2Z.mjs";
import { a as ensureGcloudAuth, c as ensureTopic, i as ensureDependency, l as resolveProjectIdFromGogCredentials, n as startGmailWatcherService, o as ensureSubscription, r as stopGmailWatcher, s as ensureTailscaleEndpoint, u as runGcloud } from "./gmail-watcher-mJl3FU5n.mjs";
//#region src/hooks/gmail-ops.ts
const DEFAULT_GMAIL_TOPIC_IAM_MEMBER = "serviceAccount:gmail-api-push@system.gserviceaccount.com";
async function runGmailSetup(opts) {
	await ensureDependency("gcloud", ["--cask", "gcloud-cli"]);
	await ensureDependency("gog", ["gogcli"]);
	if (opts.tailscale !== "off" && !opts.pushEndpoint) await ensureDependency("tailscale", ["tailscale"]);
	await ensureGcloudAuth();
	const configSnapshot = await readConfigFileSnapshot();
	if (!configSnapshot.valid) throw new Error(`Config invalid: ${CONFIG_PATH}`);
	const baseConfig = configSnapshot.config;
	const hooksPath = normalizeHooksPath(baseConfig.hooks?.path);
	const hookToken = opts.hookToken ?? baseConfig.hooks?.token ?? generateHookToken();
	const pushToken = opts.pushToken ?? baseConfig.hooks?.gmail?.pushToken ?? generateHookToken();
	const topicInput = opts.topic ?? baseConfig.hooks?.gmail?.topic ?? "gog-gmail-watch";
	const parsedTopic = parseTopicPath(topicInput);
	const topicName = parsedTopic?.topicName ?? topicInput;
	const projectId = opts.project ?? parsedTopic?.projectId ?? await resolveProjectIdFromGogCredentials();
	if (!projectId) throw new Error("GCP project id required (use --project or ensure gog credentials are available)");
	const topicPath = buildTopicPath(projectId, topicName);
	const subscription = opts.subscription ?? "gog-gmail-watch-push";
	const label = opts.label ?? "INBOX";
	const hookUrl = opts.hookUrl ?? baseConfig.hooks?.gmail?.hookUrl ?? buildDefaultHookUrl(hooksPath, resolveGatewayPort(baseConfig));
	const serveBind = opts.bind ?? "127.0.0.1";
	const servePort = opts.port ?? 8788;
	const normalizedServePath = normalizeServePath(normalizeOptionalString(opts.path ?? baseConfig.hooks?.gmail?.serve?.path));
	const normalizedTailscaleTarget = normalizeOptionalString(opts.tailscaleTarget ?? baseConfig.hooks?.gmail?.tailscale?.target);
	const includeBody = opts.includeBody ?? true;
	const maxBytes = opts.maxBytes ?? 2e4;
	const renewEveryMinutes = opts.renewEveryMinutes ?? 720;
	const tailscaleMode = opts.tailscale ?? "funnel";
	const servePath = normalizeServePath(tailscaleMode !== "off" && !normalizedTailscaleTarget ? "/" : normalizedServePath);
	const tailscalePath = normalizeServePath(opts.tailscalePath ?? baseConfig.hooks?.gmail?.tailscale?.path ?? (tailscaleMode !== "off" ? normalizedServePath : servePath));
	await runGcloud([
		"config",
		"set",
		"project",
		projectId,
		"--quiet"
	]);
	await runGcloud([
		"services",
		"enable",
		"gmail.googleapis.com",
		"pubsub.googleapis.com",
		"--project",
		projectId,
		"--quiet"
	]);
	await ensureTopic(projectId, topicName);
	await runGcloud([
		"pubsub",
		"topics",
		"add-iam-policy-binding",
		topicName,
		"--project",
		projectId,
		"--member",
		DEFAULT_GMAIL_TOPIC_IAM_MEMBER,
		"--role",
		"roles/pubsub.publisher",
		"--quiet"
	]);
	const pushEndpoint = opts.pushEndpoint ? opts.pushEndpoint : await ensureTailscaleEndpoint({
		mode: tailscaleMode,
		path: tailscalePath,
		port: servePort,
		target: normalizedTailscaleTarget,
		token: pushToken
	});
	if (!pushEndpoint) throw new Error("push endpoint required (set --push-endpoint)");
	await ensureSubscription(projectId, subscription, topicName, pushEndpoint);
	await startGmailWatch({
		account: opts.account,
		label,
		topic: topicPath
	});
	const nextConfig = {
		...baseConfig,
		hooks: {
			...baseConfig.hooks,
			enabled: true,
			path: hooksPath,
			token: hookToken,
			presets: mergeHookPresets(baseConfig.hooks?.presets, "gmail"),
			gmail: {
				...baseConfig.hooks?.gmail,
				account: opts.account,
				label,
				topic: topicPath,
				subscription,
				pushToken,
				hookUrl,
				includeBody,
				maxBytes,
				renewEveryMinutes,
				serve: {
					...baseConfig.hooks?.gmail?.serve,
					bind: serveBind,
					port: servePort,
					path: servePath
				},
				tailscale: {
					...baseConfig.hooks?.gmail?.tailscale,
					mode: tailscaleMode,
					path: tailscalePath,
					target: normalizedTailscaleTarget
				}
			}
		}
	};
	const validated = validateConfigObjectWithPlugins(nextConfig);
	if (!validated.ok) throw new Error(`Config validation failed: ${validated.issues[0]?.message ?? "invalid"}`);
	await replaceConfigFile({
		nextConfig: validated.config,
		afterWrite: { mode: "auto" }
	});
	const summary = {
		projectId,
		topic: topicPath,
		subscription,
		pushEndpoint,
		hookUrl,
		hookToken,
		pushToken,
		serve: {
			bind: serveBind,
			port: servePort,
			path: servePath
		}
	};
	if (opts.json) {
		defaultRuntime.writeJson(summary);
		return;
	}
	defaultRuntime.log("Gmail hooks configured:");
	defaultRuntime.log(`- project: ${projectId}`);
	defaultRuntime.log(`- topic: ${topicPath}`);
	defaultRuntime.log(`- subscription: ${subscription}`);
	defaultRuntime.log(`- push endpoint: ${pushEndpoint}`);
	defaultRuntime.log(`- hook url: ${hookUrl}`);
	defaultRuntime.log(`- config: ${displayPath(CONFIG_PATH)}`);
	defaultRuntime.log(`Next: ${formatCliCommand("openclaw webhooks gmail run")}`);
}
async function runGmailService(opts) {
	await ensureDependency("gog", ["gogcli"]);
	const config = getRuntimeConfig();
	const overrides = {
		account: opts.account,
		topic: opts.topic,
		subscription: opts.subscription,
		label: opts.label,
		hookToken: opts.hookToken,
		pushToken: opts.pushToken,
		hookUrl: opts.hookUrl,
		serveBind: opts.bind,
		servePort: opts.port,
		servePath: opts.path,
		includeBody: opts.includeBody,
		maxBytes: opts.maxBytes,
		renewEveryMinutes: opts.renewEveryMinutes,
		tailscaleMode: opts.tailscale,
		tailscalePath: opts.tailscalePath,
		tailscaleTarget: opts.tailscaleTarget
	};
	const resolved = resolveGmailHookRuntimeConfig(config, overrides);
	if (!resolved.ok) throw new Error(resolved.error);
	const runtimeConfig = resolved.value;
	const scheduler = new GatewayScheduler();
	const controller = new AbortController();
	let shutdownTask;
	const detachSignals = () => {
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
	};
	const shutdown = () => {
		if (controller.signal.aborted) return;
		controller.abort();
		scheduler.beginClose();
		shutdownTask = (async () => {
			try {
				await stopGmailWatcher();
			} finally {
				await scheduler.stop();
			}
		})().catch((err) => {
			defaultRuntime.error(`gmail watcher shutdown failed: ${String(err)}`);
		}).finally(detachSignals);
	};
	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
	try {
		if (runtimeConfig.tailscale.mode !== "off") await ensureDependency("tailscale", ["tailscale"]);
		const result = await startGmailWatcherService(runtimeConfig, {
			scheduler,
			signal: controller.signal
		});
		if (!result.started && !controller.signal.aborted) throw new Error(result.reason ?? "gmail watcher failed to start");
	} catch (err) {
		shutdown();
		throw err;
	} finally {
		if (controller.signal.aborted) await shutdownTask;
	}
}
async function startGmailWatch(cfg) {
	const args = [resolveGogExecutable(), ...buildGogWatchStartArgs(cfg)];
	const result = await runCommandWithTimeout(args, { timeoutMs: 12e4 });
	if (result.code !== 0) throw new Error(formatCommandResult("gog gmail watch start", result));
}
//#endregion
//#region src/cli/webhooks-cli.ts
function addGmailDeliveryOptions(command, defaults = false) {
	return command.option("--subscription <name>", "Pub/Sub subscription name", defaults ? DEFAULT_GMAIL_SUBSCRIPTION : void 0).option("--label <label>", "Gmail label to watch", defaults ? DEFAULT_GMAIL_LABEL : void 0).option("--hook-url <url>", "OpenClaw hook URL").option("--hook-token <token>", "OpenClaw hook token").option("--push-token <token>", "Push token for gog watch serve").option("--bind <host>", "gog watch serve bind host", defaults ? DEFAULT_GMAIL_SERVE_BIND : void 0).option("--port <port>", "gog watch serve port", defaults ? String(DEFAULT_GMAIL_SERVE_PORT) : void 0).option("--path <path>", "gog watch serve path", defaults ? DEFAULT_GMAIL_SERVE_PATH : void 0).option("--include-body", "Include email body snippets", defaults ? true : void 0).option("--max-bytes <n>", "Max bytes for body snippets", defaults ? String(DEFAULT_GMAIL_MAX_BYTES) : void 0).option("--renew-minutes <n>", "Renew watch every N minutes", defaults ? String(720) : void 0).option("--tailscale <mode>", "Expose push endpoint via tailscale (funnel|serve|off)", defaults ? "funnel" : void 0).option("--tailscale-path <path>", "Path for tailscale serve/funnel").option("--tailscale-target <target>", "Tailscale serve/funnel target (port, host:port, or URL)");
}
function registerWebhooksCli(program) {
	const gmail = program.command("webhooks").description("Webhook helpers and integrations").addHelpText("after", () => formatDocsHelp("/cli/webhooks")).command("gmail").description("Gmail Pub/Sub hooks (via gogcli)");
	addGmailDeliveryOptions(gmail.command("setup").description("Configure Gmail watch + Pub/Sub + OpenClaw hooks").requiredOption("--account <email>", "Gmail account to watch").option("--project <id>", "GCP project id (OAuth client owner)").option("--topic <name>", "Pub/Sub topic name", DEFAULT_GMAIL_TOPIC), true).option("--push-endpoint <url>", "Explicit Pub/Sub push endpoint").option("--json", "Output JSON summary", false).action(async (opts) => {
		try {
			await runGmailSetup(parseGmailSetupOptions(opts));
		} catch (err) {
			if (opts.json) throw new Error(formatErrorMessage(err), { cause: err });
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	});
	addGmailDeliveryOptions(gmail.command("run").description("Run gog watch serve + auto-renew loop").option("--account <email>", "Gmail account to watch").option("--topic <topic>", "Pub/Sub topic path (projects/.../topics/..)")).action(async (opts) => {
		try {
			await runGmailService(parseGmailRunOptions(opts));
		} catch (err) {
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	});
}
function parseGmailSetupOptions(raw) {
	const account = normalizeOptionalString(raw.account) ?? "";
	if (!account) throw new Error(`--account is required. Example: ${formatCliCommand("openclaw webhooks gmail setup --account default")}.`);
	const common = parseGmailCommonOptions(raw);
	return {
		account,
		project: normalizeOptionalString(raw.project),
		...common,
		pushEndpoint: normalizeOptionalString(raw.pushEndpoint),
		json: Boolean(raw.json)
	};
}
function parseGmailRunOptions(raw) {
	const common = parseGmailCommonOptions(raw);
	return {
		account: normalizeOptionalString(raw.account),
		...common
	};
}
function parseGmailCommonOptions(raw) {
	return {
		topic: normalizeOptionalString(raw.topic),
		subscription: normalizeOptionalString(raw.subscription),
		label: normalizeOptionalString(raw.label),
		hookUrl: normalizeOptionalString(raw.hookUrl),
		hookToken: normalizeOptionalString(raw.hookToken),
		pushToken: normalizeOptionalString(raw.pushToken),
		bind: normalizeOptionalString(raw.bind),
		port: numberOption(raw.port, "--port"),
		path: normalizeOptionalString(raw.path),
		includeBody: raw.includeBody == null ? void 0 : Boolean(raw.includeBody),
		maxBytes: numberOption(raw.maxBytes, "--max-bytes"),
		renewEveryMinutes: numberOption(raw.renewMinutes, "--renew-minutes"),
		tailscale: tailscaleModeOption(raw.tailscale),
		tailscalePath: normalizeOptionalString(raw.tailscalePath),
		tailscaleTarget: normalizeOptionalString(raw.tailscaleTarget)
	};
}
function tailscaleModeOption(value) {
	if (value === void 0 || value === null) return;
	const mode = normalizeOptionalString(value);
	if (mode === "funnel" || mode === "serve" || mode === "off") return mode;
	throw new Error("Invalid --tailscale (must be funnel, serve, or off).");
}
function numberOption(value, label) {
	if (value === void 0 || value === null) return;
	const n = parseStrictPositiveInteger(value);
	if (n === void 0) throw new Error(`${label} must be a positive integer.`);
	return n;
}
//#endregion
export { registerWebhooksCli };
