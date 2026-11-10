import { D as isModelsStatusJsonOutput } from "./argv-C7hqFLn5.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as setCommandJsonMode } from "./json-mode-BIqJ-P-D.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/models-accounts-cli.ts
function addAccountOptions(command) {
	return command.option("--url <url>", "Gateway WebSocket URL (defaults to the configured Gateway)").option("--port <port>", "Local Gateway port").option("--token-file <path>", "Read the Gateway token from a file").option("--password-file <path>", "Read the Gateway password from a file").option("--timeout <ms>", "Gateway connection and request timeout in ms", "30000").option("--json", "Output JSON", false);
}
function resolveAccountOptions(command) {
	const options = command.opts();
	const resolve = (key) => inheritOptionFromParent(command, key) ?? options[key];
	return {
		url: resolve("url"),
		port: resolve("port"),
		tokenFile: resolve("tokenFile"),
		passwordFile: resolve("passwordFile"),
		timeout: resolve("timeout"),
		json: resolve("json")
	};
}
function registerModelsAccountsCli(models) {
	const accounts = addAccountOptions(models.command("accounts").description("Manage your personal model accounts on the Gateway")).addHelpText("after", "\nPersonal accounts belong to your signed-in person, not an agent. New sessions use the selected default; existing sessions keep their account. Shared credentials remain under `models auth`.\n");
	accounts.action(() => accounts.help());
	const run = async (command, action) => {
		const runtime = await import("./models-cli.runtime.js");
		await runtime.runModelsCommand(async () => {
			if (runtime.resolveModelAgentOption(command) !== void 0) throw new Error("`models accounts` does not support --agent; it uses your signed-in Gateway person.");
			await action(await import("./accounts-jv-pGxdi.mjs"), runtime, resolveAccountOptions(command));
		});
	};
	addAccountOptions(accounts.command("list").description("List one page of your saved accounts")).option("--cursor <cursor>", "Continue from nextCursor in the previous page").action(async (opts, command) => {
		await run(command, (commands, runtime, options) => commands.modelsAccountsListCommand({
			...options,
			cursor: opts.cursor
		}, runtime.defaultRuntime));
	});
	addAccountOptions(accounts.command("login [provider]").description("Add a personal account using this Gateway's provider and sign-in methods")).option("--method <id>", "Choose a sign-in method instead of prompting").action(async (provider, opts, command) => {
		await run(command, (commands, runtime, options) => commands.modelsAccountsLoginCommand({
			...options,
			provider,
			method: opts.method
		}, runtime.defaultRuntime));
	});
	for (const [action, argument, description] of [[
		"use",
		"account-id",
		"Select one of your accounts for new sessions"
	], [
		"clear-default",
		"provider",
		"Clear a personal default without deleting credentials or changing existing sessions"
	]]) addAccountOptions(accounts.command(`${action} <${argument}>`).description(description)).action(async (value, _opts, command) => {
		await run(command, (commands, runtime, options) => commands.modelsAccountsUpdateDefaultCommand({
			...options,
			...action === "use" ? {
				action,
				authProfileId: value
			} : {
				action,
				provider: value
			}
		}, runtime.defaultRuntime));
	});
}
//#endregion
//#region src/cli/models-cli.ts
async function withModelsRuntime(action) {
	const runtime = await import("./models-cli.runtime.js");
	return runtime.runModelsCommand(() => action(runtime));
}
function runAgentModelCommand(command, options, load) {
	return withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
		const agent = resolveModelAgentOption(command);
		await (await load())(options(agent), defaultRuntime);
	});
}
function runAuthModelCommand(command, options, load) {
	return withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
		const agent = resolveModelAgentOption(command);
		const opts = options(agent);
		if (command.name() === "login" || command.name() === "login-github-copilot") {
			const loginOptions = command.opts();
			const copilot = command.name() === "login-github-copilot";
			const sessionId = randomUUID();
			const unsupported = [
				loginOptions.profileId?.trim() ? "--profile-id" : void 0,
				loginOptions.force ? "--force" : void 0,
				loginOptions.setDefault ? "--set-default" : void 0,
				loginOptions.yes ? "--yes" : void 0
			].filter(Boolean);
			let cancellationConfirmed = false;
			await runWithLocalStateOwner({
				method: "models.authLogin",
				params: async (signal) => {
					const { readGatewayLoginParams } = await import("./auth-login-gateway-DuLHl84M.mjs");
					return readGatewayLoginParams({
						provider: copilot ? "github-copilot" : loginOptions.provider,
						method: copilot ? "device" : loginOptions.deviceCode ? "device-code" : loginOptions.method,
						agent
					}, sessionId, signal);
				},
				target: "system/agent provider sign-in",
				requireLocalBackendSharedAuth: true,
				requiredCapabilities: [GATEWAY_SERVER_CAPS.MODELS_AUTH_LOGIN_OWNER],
				timeoutMs: 15e5,
				onForeignOwner: unsupported.length ? async () => {
					throw new Error(`${unsupported.join(", ")} cannot be represented by models.authLogin. Omit these options, or stop the Gateway through its service owner and rerun this command offline. No credential was changed.`);
				} : void 0,
				onGatewayResponse: async (request, signal) => {
					const { runGatewayLoginWizard } = await import("./auth-login-gateway-DuLHl84M.mjs");
					await runGatewayLoginWizard(request, sessionId, signal, defaultRuntime);
				},
				onGatewaySignalAbort: async (request) => {
					await request("wizard.cancel", {
						sessionId,
						closeInput: true
					});
					cancellationConfirmed = true;
				},
				runLocal: async () => {
					await (await load())(opts, defaultRuntime);
				}
			}).catch((error) => {
				if (!cancellationConfirmed) throw error;
				defaultRuntime.log("Login session closed. Credentials already saved were not undone.");
			});
			return;
		}
		const pasteApiKey = command.name() === "paste-api-key";
		const { provider, profileId } = command.opts();
		const result = await runWithLocalStateOwner({
			method: pasteApiKey ? "models.authSetApiKey" : "models.auth",
			params: pasteApiKey ? async (signal) => {
				const { readGatewayApiKeyParams } = await import("./auth-gateway-Da8k76-j.mjs");
				return readGatewayApiKeyParams({
					provider,
					agent
				}, signal);
			} : {},
			target: command.name() === "paste-token" ? "token credentials (models.authSetApiKey cannot store token types or --expires-in)" : "system/agent credentials",
			requireLocalBackendSharedAuth: pasteApiKey,
			requiredCapabilities: pasteApiKey ? [GATEWAY_SERVER_CAPS.MODELS_AUTH_SET_API_KEY_OWNER] : void 0,
			onForeignOwner: !pasteApiKey ? "refuse" : profileId?.trim() ? async () => {
				throw new Error("--profile-id is not supported by models.authSetApiKey. Omit --profile-id to use the Gateway's API-key profile, or stop the Gateway through its service owner and rerun this command.");
			} : void 0,
			runLocal: async () => {
				await (await load())(opts, defaultRuntime);
			}
		});
		if (result) {
			if (result.warning) defaultRuntime.error(sanitizeTerminalText(result.warning));
			defaultRuntime.log(`Auth profile: ${sanitizeTerminalText(result.profileId)} (${sanitizeTerminalText(result.provider)}/api_key)`);
		}
	});
}
/** Run a command that edits global defaults, rejecting the inherited `models --agent`. */
async function withGlobalModelsRuntime(command, commandName, action) {
	return withModelsRuntime(async (runtime) => {
		runtime.rejectAgentScopedModelCommand(command, commandName);
		await action(runtime);
	});
}
function registerModelsCli(program) {
	const models = program.command("models").description("Model discovery, scanning, and configuration").option("--json", "Output JSON (alias for `models status --json`)", false).option("--status-json", "Output JSON (alias for `models status --json`)", false).option("--status-plain", "Plain output (alias for `models status --plain`)", false).option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").addHelpText("after", () => formatDocsHelp("/cli/models"));
	const hasJsonOutput = (opts) => Boolean(opts?.json || models.opts().json);
	setCommandJsonMode(models, "output", ({ argv, command }) => isModelsStatusJsonOutput(argv, command));
	registerModelsAccountsCli(models);
	models.command("list").description("List models (configured by default)").option("--refresh", "Refresh provider discovery before listing", false).option("--all", "Show full model catalog", false).option("--local", "Filter to local models", false).option("--provider <id>", "Filter by provider id").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").option("--json", "Output JSON", false).option("--plain", "Plain line output", false).action(async (opts, command) => {
		await withModelsRuntime(async ({ defaultRuntime, resolveModelAgentOption }) => {
			const { modelsListCommand } = await import("./list.list-command-D9gf5jIE.mjs");
			await modelsListCommand({
				...opts,
				json: hasJsonOutput(opts),
				agent: resolveModelAgentOption(command)
			}, defaultRuntime);
		});
	});
	models.command("status").description("Show configured model state").option("--json", "Output JSON", false).option("--plain", "Plain output", false).option("--check", "Check auth/runtime readiness (1=missing/expired/unavailable/incompatible/indeterminate, 2=expiring)", false).option("--probe", "Check configured provider auth (live)", false).option("--probe-provider <name>", "Only check a single provider").option("--probe-profile <id>", "Only check specific auth profile ids (repeat or comma-separated)", (value, previous) => {
		const next = Array.isArray(previous) ? previous : previous ? [previous] : [];
		next.push(value);
		return next;
	}).option("--probe-timeout <ms>", "Timeout per check in ms").option("--probe-concurrency <n>", "Concurrent checks").option("--probe-max-tokens <n>", "Maximum tokens per check (best-effort)").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR)").action((opts, command) => runAgentModelCommand(command, (agent) => ({
		...opts,
		json: hasJsonOutput(opts),
		agent
	}), async () => (await import("./list.status-command-C5t-eV_7.mjs")).modelsStatusCommand));
	models.command("refresh").description("Refresh the hosted model catalog").option("--json", "Output JSON", false).action(async (opts, command) => {
		await withGlobalModelsRuntime(command, "refresh", async ({ defaultRuntime }) => {
			const { modelsRefreshCommand } = await import("./refresh-RMJ3FwjK.mjs");
			await modelsRefreshCommand({ json: hasJsonOutput(opts) }, defaultRuntime);
		});
	});
	for (const [name, description, field] of [[
		"set",
		"Set the default model",
		"model"
	], [
		"set-image",
		"Set the image model",
		"imageModel"
	]]) models.command(name).description(description).argument("<model>", "Model id or alias").action(async (model, _opts, command) => {
		await withGlobalModelsRuntime(command, name, async ({ defaultRuntime }) => {
			const { modelsSetCommand } = await import("./set-B6XjB2wu.mjs");
			await modelsSetCommand(model, defaultRuntime, field);
		});
	});
	const aliases = models.command("aliases").description("Manage model aliases");
	aliases.command("list").description("List model aliases").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts, command) => {
		await withGlobalModelsRuntime(command, "aliases list", async ({ defaultRuntime }) => {
			const { modelsAliasesListCommand } = await import("./aliases-CYL1fmB6.mjs");
			await modelsAliasesListCommand({
				...opts,
				json: hasJsonOutput(opts)
			}, defaultRuntime);
		});
	});
	aliases.command("add").description("Add or update a model alias").argument("<alias>", "Alias name").argument("<model>", "Model id or alias").action(async (alias, model, _opts, command) => {
		await withGlobalModelsRuntime(command, "aliases add", async ({ defaultRuntime }) => {
			const { modelsAliasesAddCommand } = await import("./aliases-CYL1fmB6.mjs");
			await modelsAliasesAddCommand(alias, model, defaultRuntime);
		});
	});
	aliases.command("remove").description("Remove a model alias").argument("<alias>", "Alias name").action(async (alias, _opts, command) => {
		await withGlobalModelsRuntime(command, "aliases remove", async ({ defaultRuntime }) => {
			const { modelsAliasesRemoveCommand } = await import("./aliases-CYL1fmB6.mjs");
			await modelsAliasesRemoveCommand(alias, defaultRuntime);
		});
	});
	for (const params of [{
		name: "fallbacks",
		modelType: "model",
		noun: "fallback",
		article: "a",
		key: "model",
		label: "Fallbacks",
		notFoundLabel: "Fallback",
		clearedMessage: "Fallback list cleared."
	}, {
		name: "image-fallbacks",
		modelType: "image model",
		noun: "image fallback",
		article: "an",
		key: "imageModel",
		label: "Image fallbacks",
		notFoundLabel: "Image fallback",
		clearedMessage: "Image fallback list cleared."
	}]) {
		const { name, modelType, noun, article } = params;
		const group = models.command(name).description(`Manage ${modelType} fallback list`);
		group.command("list").description(`List ${noun} models`).option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
			await withModelsRuntime(async ({ defaultRuntime }) => {
				const { listFallbacksCommand } = await import("./fallbacks-shared-DPeOK3z0.mjs");
				await listFallbacksCommand(params, {
					...opts,
					json: hasJsonOutput(opts)
				}, defaultRuntime);
			});
		});
		for (const action of ["add", "remove"]) group.command(action).description(`${action === "add" ? "Add" : "Remove"} ${article} ${noun} model`).argument("<model>", "Model id or alias").action(async (model, _opts, command) => {
			await withGlobalModelsRuntime(command, `${name} ${action}`, async ({ defaultRuntime }) => {
				const { changeFallbacksCommand } = await import("./fallbacks-shared-DPeOK3z0.mjs");
				await changeFallbacksCommand({
					...params,
					action
				}, model, defaultRuntime);
			});
		});
		group.command("clear").description(`Clear all ${noun} models`).action(async (_opts, command) => {
			await withGlobalModelsRuntime(command, `${name} clear`, async ({ defaultRuntime }) => {
				const { clearFallbacksCommand } = await import("./fallbacks-shared-DPeOK3z0.mjs");
				await clearFallbacksCommand(params, defaultRuntime);
			});
		});
	}
	models.command("scan").description("Scan OpenRouter free models for tools + images").option("--min-params <b>", "Minimum parameter size (billions)").option("--max-age-days <days>", "Skip models older than N days").option("--provider <name>", "Filter by provider prefix").option("--max-candidates <n>", "Max fallback candidates", "6").option("--timeout <ms>", "Timeout per check in ms").option("--concurrency <n>", "Check concurrency").option("--no-probe", "Skip live checks; list free candidates only (writes no config)").option("--yes", "Accept defaults without prompting", false).option("--no-input", "Disable prompts (use defaults)").option("--set-default", "Also set agents.defaults.model primary to the first selection (fallbacks are replaced either way)", false).option("--set-image", "Also set agents.defaults.imageModel primary to the first image selection", false).option("--json", "Output JSON", false).action(async (opts, command) => {
		await withGlobalModelsRuntime(command, "scan", async ({ defaultRuntime }) => {
			const { modelsScanCommand } = await import("./scan-Ce8WXrPM.mjs");
			await modelsScanCommand({
				...opts,
				json: hasJsonOutput(opts)
			}, defaultRuntime);
		});
	});
	models.action(async (opts) => {
		await withModelsRuntime(async ({ defaultRuntime }) => {
			const { modelsStatusCommand } = await import("./list.status-command-C5t-eV_7.mjs");
			await modelsStatusCommand({
				json: Boolean(opts?.json || opts?.statusJson),
				plain: Boolean(opts?.statusPlain),
				agent: opts?.agent
			}, defaultRuntime);
		});
	});
	const auth = models.command("auth").description("Manage system/agent credentials on this machine");
	auth.option("--agent <id>", "Agent id for auth commands");
	auth.action(() => {
		auth.help();
	});
	auth.command("list").description("List saved auth profiles").option("--provider <id>", "Filter by provider id").option("--agent <id>", "Agent id (default: configured system agent)").option("--json", "Output JSON", false).action((opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		agent,
		json: hasJsonOutput(opts)
	}), async () => (await import("./auth-list-oCAxOOLr.mjs")).modelsAuthListCommand));
	auth.command("add").description("Interactive auth helper (provider auth or paste token)").option("--agent <id>", "Agent id (default: configured default agent)").action((_opts, command) => runAuthModelCommand(command, (agent) => ({ agent }), async () => (await import("./auth-CwQvALbN.mjs")).modelsAuthAddCommand));
	auth.command("activate").description("Test a saved sign-in and use it for this agent").argument("<profileId>", "Saved sign-in id from models auth list").option("--agent <id>", "Agent id (default: the only configured agent)").action((profileId, _opts, command) => runAuthModelCommand(command, (agent) => ({
		profileId,
		agent
	}), async () => (await import("./auth-activate-C2arrEsJ.mjs")).modelsAuthActivateCommand));
	auth.command("logout").description("Remove a saved auth profile (see `models auth list` for ids)").argument("<profileId>", "Auth profile id (e.g. openai:manual)").option("--agent <id>", "Agent id (default: configured default agent)").option("--yes", "Skip the confirmation prompt", false).action((profileId, opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		profileId,
		agent
	}), async () => (await import("./auth-logout-BmrGrVsi.mjs")).modelsAuthLogoutCommand));
	auth.command("login").description("Sign in for system/agent use on this machine (OAuth/API key)").option("--agent <id>", "Agent id (default: configured default agent)").option("--provider <id>", "Provider id registered by a plugin").option("--method <id>", "Provider auth method id").option("--device-code", "Use the provider device-code auth method", false).option("--profile-id <id>", "Auth profile id override for single-profile login methods").option("--set-default", "Apply the provider's default model recommendation", false).option("--force", "Remove existing profiles for the provider before logging in (use when a cached OAuth profile is stuck or you want to switch accounts)", false).action(async ({ deviceCode, ...opts }, command) => {
		if (deviceCode && typeof opts.method === "string" && opts.method !== "device-code") throw new Error("--device-code cannot be combined with --method unless method is device-code.");
		await runAuthModelCommand(command, (agent) => ({
			...opts,
			method: deviceCode ? "device-code" : opts.method,
			agent
		}), async () => (await import("./auth-CwQvALbN.mjs")).modelsAuthLoginCommand);
	});
	auth.command("setup-token").description("Run a provider CLI to create/sync a token (TTY required)").option("--agent <id>", "Agent id (default: configured default agent)").option("--provider <name>", "Provider id").option("--yes", "Skip confirmation", false).action((opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		agent
	}), async () => (await import("./auth-CwQvALbN.mjs")).modelsAuthSetupTokenCommand));
	for (const [name, noun, exampleProvider, handler] of [[
		"paste-token",
		"token",
		"anthropic",
		"modelsAuthPasteTokenCommand"
	], [
		"paste-api-key",
		"API key",
		"openai",
		"modelsAuthPasteApiKeyCommand"
	]]) {
		const paste = auth.command(name).description(`Save ${name === "paste-token" ? "a" : "an"} ${noun} in an auth profile and update config`).option("--agent <id>", "Agent id (default: configured default agent)").requiredOption("--provider <name>", `Provider id (e.g. ${exampleProvider})`).option("--profile-id <id>", "Auth profile id (default: <provider>:manual)");
		if (name === "paste-token") paste.option("--expires-in <duration>", "Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.");
		paste.action((opts, command) => runAuthModelCommand(command, (agent) => ({
			...opts,
			agent
		}), async () => (await import("./auth-CwQvALbN.mjs"))[handler]));
	}
	auth.command("login-github-copilot").description("Login to GitHub Copilot via GitHub device flow (TTY required)").option("--agent <id>", "Agent id (default: configured default agent)").option("--yes", "Overwrite existing profile without prompting", false).action((opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		provider: "github-copilot",
		method: "device",
		agent
	}), async () => (await import("./auth-CwQvALbN.mjs")).modelsAuthLoginCommand));
	const order = auth.command("order").description("Manage per-agent auth profile order overrides");
	order.command("get").description("Show per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured system agent)").option("--json", "Output JSON", false).action((opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		agent,
		json: hasJsonOutput(opts)
	}), async () => (await import("./auth-order-BnBdzbhJ.mjs")).modelsAuthOrderGetCommand));
	order.command("set").description("Set per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").argument("<profileIds...>", "Auth profile ids (e.g. anthropic:default)").action((profileIds, opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		agent,
		order: profileIds
	}), async () => (await import("./auth-order-BnBdzbhJ.mjs")).modelsAuthOrderUpdateCommand));
	order.command("clear").description("Clear per-agent auth profile order override").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").action((opts, command) => runAuthModelCommand(command, (agent) => ({
		...opts,
		agent,
		order: null
	}), async () => (await import("./auth-order-BnBdzbhJ.mjs")).modelsAuthOrderUpdateCommand));
}
//#endregion
export { registerModelsCli };
