import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as displayPath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as CONFIG_PATH, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { o as validateConfigObjectWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as formatCommandResult } from "./command-error-CLRWADNl.mjs";
import { _ as parseTopicPath, a as DEFAULT_GMAIL_SERVE_PORT, b as resolveGogExecutable, c as buildDefaultHookUrl, d as buildGogWatchStartArgs, f as buildTopicPath, g as normalizeServePath, h as normalizeHooksPath, i as DEFAULT_GMAIL_SERVE_PATH, m as mergeHookPresets, n as DEFAULT_GMAIL_MAX_BYTES, o as DEFAULT_GMAIL_SUBSCRIPTION, p as generateHookToken, r as DEFAULT_GMAIL_SERVE_BIND, s as DEFAULT_GMAIL_TOPIC, t as DEFAULT_GMAIL_LABEL, y as resolveGmailHookRuntimeConfig } from "./gmail-BapENs50.mjs";
import { a as ensureGcloudAuth, c as ensureTopic, i as ensureDependency, l as resolveProjectIdFromGogCredentials, n as startGmailWatcherService, o as ensureSubscription, r as stopGmailWatcher, s as ensureTailscaleEndpoint, u as runGcloud } from "./gmail-watcher-BpUhM-3W.mjs";
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
	const configuredServePath = opts.path ?? baseConfig.hooks?.gmail?.serve?.path;
	const configuredTailscaleTarget = opts.tailscaleTarget ?? baseConfig.hooks?.gmail?.tailscale?.target;
	const normalizedServePath = typeof configuredServePath === "string" && configuredServePath.trim().length > 0 ? normalizeServePath(configuredServePath) : DEFAULT_GMAIL_SERVE_PATH;
	const normalizedTailscaleTarget = typeof configuredTailscaleTarget === "string" && configuredTailscaleTarget.trim().length > 0 ? configuredTailscaleTarget.trim() : void 0;
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
	const controller = new AbortController();
	let shutdownTask;
	const detachSignals = () => {
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
	};
	const shutdown = () => {
		if (controller.signal.aborted) return;
		controller.abort();
		shutdownTask = stopGmailWatcher().catch((err) => {
			defaultRuntime.error(`gmail watcher shutdown failed: ${String(err)}`);
		}).finally(detachSignals);
	};
	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
	try {
		if (runtimeConfig.tailscale.mode !== "off") await ensureDependency("tailscale", ["tailscale"]);
		const result = await startGmailWatcherService(runtimeConfig, { signal: controller.signal });
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
/** Register webhook-related subcommands on the root Commander program. */
function registerWebhooksCli(program) {
	const gmail = program.command("webhooks").description("Webhook helpers and integrations").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/webhooks", "docs.openclaw.ai/cli/webhooks")}\n`).command("gmail").description("Gmail Pub/Sub hooks (via gogcli)");
	gmail.command("setup").description("Configure Gmail watch + Pub/Sub + OpenClaw hooks").requiredOption("--account <email>", "Gmail account to watch").option("--project <id>", "GCP project id (OAuth client owner)").option("--topic <name>", "Pub/Sub topic name", DEFAULT_GMAIL_TOPIC).option("--subscription <name>", "Pub/Sub subscription name", DEFAULT_GMAIL_SUBSCRIPTION).option("--label <label>", "Gmail label to watch", DEFAULT_GMAIL_LABEL).option("--hook-url <url>", "OpenClaw hook URL").option("--hook-token <token>", "OpenClaw hook token").option("--push-token <token>", "Push token for gog watch serve").option("--bind <host>", "gog watch serve bind host", DEFAULT_GMAIL_SERVE_BIND).option("--port <port>", "gog watch serve port", String(DEFAULT_GMAIL_SERVE_PORT)).option("--path <path>", "gog watch serve path", DEFAULT_GMAIL_SERVE_PATH).option("--include-body", "Include email body snippets", true).option("--max-bytes <n>", "Max bytes for body snippets", String(DEFAULT_GMAIL_MAX_BYTES)).option("--renew-minutes <n>", "Renew watch every N minutes", String(720)).option("--tailscale <mode>", "Expose push endpoint via tailscale (funnel|serve|off)", "funnel").option("--tailscale-path <path>", "Path for tailscale serve/funnel").option("--tailscale-target <target>", "Tailscale serve/funnel target (port, host:port, or URL)").option("--push-endpoint <url>", "Explicit Pub/Sub push endpoint").option("--json", "Output JSON summary", false).action(async (opts) => {
		try {
			await runGmailSetup(parseGmailSetupOptions(opts));
		} catch (err) {
			if (opts.json) throw new Error(formatErrorMessage(err), { cause: err });
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	});
	gmail.command("run").description("Run gog watch serve + auto-renew loop").option("--account <email>", "Gmail account to watch").option("--topic <topic>", "Pub/Sub topic path (projects/.../topics/..)").option("--subscription <name>", "Pub/Sub subscription name").option("--label <label>", "Gmail label to watch").option("--hook-url <url>", "OpenClaw hook URL").option("--hook-token <token>", "OpenClaw hook token").option("--push-token <token>", "Push token for gog watch serve").option("--bind <host>", "gog watch serve bind host").option("--port <port>", "gog watch serve port").option("--path <path>", "gog watch serve path").option("--include-body", "Include email body snippets").option("--max-bytes <n>", "Max bytes for body snippets").option("--renew-minutes <n>", "Renew watch every N minutes").option("--tailscale <mode>", "Expose push endpoint via tailscale (funnel|serve|off)").option("--tailscale-path <path>", "Path for tailscale serve/funnel").option("--tailscale-target <target>", "Tailscale serve/funnel target (port, host:port, or URL)").action(async (opts) => {
		try {
			await runGmailService(parseGmailRunOptions(opts));
		} catch (err) {
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	});
}
function parseGmailSetupOptions(raw) {
	const accountRaw = raw.account;
	const account = normalizeOptionalString(accountRaw) ?? "";
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
		includeBody: booleanOption(raw.includeBody),
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
function booleanOption(value) {
	if (value === void 0 || value === null) return;
	return Boolean(value);
}
//#endregion
export { registerWebhooksCli };
