import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { f as formatProviderLoginCommand } from "./oauth-refresh-failure-CVji5U1C.mjs";
import "./provider-login-recovery-MlB9PuXu.mjs";
import { a as resolveProviderChannelLoginChoice, n as formatProviderOAuthLoginRef, t as formatProviderLoginChoiceRef } from "./provider-login-options-DbA7M9R5.mjs";
import { n as ProviderBrowserSignInUnavailableError, r as createProviderBrowserAuthSession } from "./provider-browser-auth-pWTijt25.mjs";
import { randomBytes } from "node:crypto";
//#region src/wizard/command-choice.ts
function buildCommandChoiceReply(message, buttons) {
	return {
		text: [message, ...buttons.map((button) => `${button.label}: \`${button.action.command}\``)].join("\n"),
		presentationTextMode: "fallback",
		presentation: { blocks: [{
			type: "text",
			text: message
		}, {
			type: "buttons",
			buttons
		}] }
	};
}
/** Use only provider identity; Telegram callbacks have a 64-byte limit (2026-09-11). */
function createLoginChoicePrompt(prompt, signal, provider) {
	const id = randomBytes(8).toString("hex");
	let answered = false;
	return {
		reply: buildCommandChoiceReply(prompt.message, prompt.options.map((option, index) => ({
			label: option.label,
			action: {
				type: "command",
				command: `/login choice ${id} ${index} ${provider}`
			}
		}))),
		answer(command) {
			const match = /^\/login choice ([a-f0-9]+) (\d+) (\S+)$/u.exec(command.trim());
			if (!match || answered || signal.aborted || match[1] !== id || match[3] !== provider) return;
			const index = Number(match[2]);
			const option = Number.isSafeInteger(index) ? prompt.options[index] : void 0;
			if (!option) return;
			answered = true;
			return { value: option.value };
		}
	};
}
//#endregion
//#region src/plugin-sdk/provider-auth-login-flow-runtime.ts
const PROVIDER_LOGIN_FLOW_TTL_MS = 9e5;
function createProviderLoginFlowRegistry() {
	return {
		logins: /* @__PURE__ */ new Map(),
		modelAccess: /* @__PURE__ */ new Map()
	};
}
const loadProviderAuthLoginFlowRuntime = createLazyRuntimeModule(() => import("./auth-H5YWlSAM.mjs"));
const runModelsAuthLoginFlow = createLazyRuntimeMethodBinder(loadProviderAuthLoginFlowRuntime)((runtime) => runtime.runModelsAuthLoginFlowCore);
function reserveProviderLoginFlow(params) {
	const now = params.now ?? Date.now();
	const activeFlow = params.flows.logins.get(params.flowKey);
	if (activeFlow && activeFlow.expiresAt > now) return {
		status: "active",
		providerLabel: activeFlow.providerLabel
	};
	if (activeFlow) {
		activeFlow.cancel();
		params.flows.logins.delete(params.flowKey);
	}
	const abortController = new AbortController();
	const signal = AbortSignal.any([
		abortController.signal,
		AbortSignal.timeout(PROVIDER_LOGIN_FLOW_TTL_MS),
		...params.signal ? [params.signal] : []
	]);
	const record = {
		providerLabel: params.providerLabel,
		expiresAt: now + PROVIDER_LOGIN_FLOW_TTL_MS,
		signal,
		cancel: (message) => abortController.abort(new Error(message ?? params.replacementMessage ?? "Provider login was replaced by a newer flow."))
	};
	signal.addEventListener("abort", () => {
		if (params.flows.logins.get(params.flowKey) === record) params.flows.logins.delete(params.flowKey);
	}, { once: true });
	params.flows.logins.set(params.flowKey, record);
	return {
		status: "reserved",
		record
	};
}
function releaseProviderLoginFlow(params) {
	if (params.flows.logins.get(params.flowKey) === params.record) params.flows.logins.delete(params.flowKey);
	params.record.cancel();
}
function offerProviderLoginModelAccess(params) {
	const signal = AbortSignal.timeout(PROVIDER_LOGIN_FLOW_TTL_MS);
	const prompt = createLoginChoicePrompt({
		...params.prepared.prompt,
		message: `${params.terminalMessage}\n\n${params.prepared.prompt.message}`
	}, signal, params.prepared.provider);
	const record = {
		expiresAt: Date.now() + PROVIDER_LOGIN_FLOW_TTL_MS,
		prepared: params.prepared,
		prompt
	};
	params.flows.modelAccess.set(params.flowKey, record);
	signal.addEventListener("abort", () => {
		if (params.flows.modelAccess.get(params.flowKey) === record) params.flows.modelAccess.delete(params.flowKey);
	}, { once: true });
	return prompt.reply;
}
async function answerProviderLoginModelAccess(params) {
	const provider = /^\/login (?:access|choice [a-f0-9]+ \d+) (\S+)$/u.exec(params.command.trim())?.[1];
	if (!provider) return;
	const assertAuthority = (config = params.readConfig()) => {
		params.signal?.throwIfAborted();
		params.assertCurrent(config);
	};
	assertAuthority();
	const { completeProviderModelAccess, prepareProviderModelAccess, ProviderModelPolicyChangedError } = await import("./auth-model-policy-D3yBGgjY.mjs");
	const renew = (message, config = params.readConfig()) => {
		assertAuthority();
		assertAuthority(config);
		const resolved = resolveProviderChannelLoginChoice(provider, { config });
		const providerLabel = resolved.status === "resolved" && resolved.choice.providerId === provider ? resolved.choice.providerLabel : resolved.status === "ambiguous" && resolved.choices.every((choice) => choice.providerId === provider) ? resolved.choices[0]?.providerLabel : void 0;
		if (!providerLabel) return { text: "This connection is no longer available. Send /models to choose another provider." };
		const prepared = prepareProviderModelAccess({
			config,
			agentId: params.agentId,
			provider,
			providerLabel
		});
		return prepared ? offerProviderLoginModelAccess({
			...params,
			prepared,
			terminalMessage: message
		}) : { text: `All ${providerLabel} models are already allowed. Send /models to choose a model.` };
	};
	const record = params.flows.modelAccess.get(params.flowKey);
	if (!record || record.expiresAt <= Date.now() || record.prepared.provider !== provider) return renew("Choose model access using your current restrictions. You do not need to sign in again.");
	const assertCurrent = (config) => {
		assertAuthority(config);
		if (params.flows.modelAccess.get(params.flowKey) !== record || record.expiresAt <= Date.now()) throw new Error("This model access choice is no longer available.");
	};
	assertCurrent();
	const answer = record.prompt.answer(params.command);
	if (!answer) return renew("Choose model access using your current restrictions. You do not need to sign in again.");
	try {
		return { text: `${(await completeProviderModelAccess({
			prepared: record.prepared,
			prompter: { select: async ({ options }) => {
				const option = options.find((entry) => entry.value === answer.value);
				if (!option) throw new Error("The selected model access option is no longer available.");
				return option.value;
			} },
			runtime: params.runtime,
			assertCurrent
		})).message}\n\nSend /models to choose a model. To update saved sign-in status, send /login refresh.` };
	} catch (error) {
		assertCurrent();
		if (error instanceof ProviderModelPolicyChangedError) return renew("Your model restrictions changed. Choose again using the current restrictions.", error.config);
		params.runtime.error(error instanceof Error ? error.message : String(error));
		return buildCommandChoiceReply("Your model-access choice could not be applied. Choose model access again.", [{
			label: "Choose model access",
			action: {
				type: "command",
				command: `/login access ${provider}`
			}
		}]);
	} finally {
		if (params.flows.modelAccess.get(params.flowKey) === record) params.flows.modelAccess.delete(params.flowKey);
	}
}
function cancelProviderLoginFlow(params) {
	const record = params.flows.logins.get(params.flowKey);
	const pending = params.flows.modelAccess.delete(params.flowKey);
	params.flows.logins.delete(params.flowKey);
	record?.cancel("Provider login cancelled from chat.");
	return record ? pending ? "both" : "login" : pending ? "model-access" : void 0;
}
async function prepareProviderChannelLogin(params) {
	const match = params.commandText.trim().match(/^\/login(?:\s+(.+))?$/u);
	if (!match) return null;
	params.signal?.throwIfAborted();
	if (!params.hasAdminScope && !params.config.commands?.ownerAllowFrom?.some((owner) => normalizeOptionalString(String(owner)))) return {
		status: "rejected",
		reply: { text: "No chat owner is configured. Ask the OpenClaw owner to add your chat account to `commands.ownerAllowFrom` in the OpenClaw configuration, then send `/login` again." }
	};
	if (!params.commandAuthorized || !params.senderIsOwner) return {
		status: "rejected",
		reply: { text: "Only an OpenClaw owner can sign in here. Ask the owner to connect this provider or grant you owner access." }
	};
	if (!params.isPrivateChat) return {
		status: "reply",
		reply: { text: "Provider login requires a private chat or Control UI session. Open a private chat with OpenClaw and send `/login` there." }
	};
	if (match[1]?.trim().toLowerCase() === "refresh") try {
		await params.refreshAuth();
		return {
			status: "reply",
			reply: { text: "Sign-in status refreshed. Send /models to see available models." }
		};
	} catch {
		return {
			status: "reply",
			reply: { text: "Your saved connections could not be applied. Send /login refresh to try again. You do not need to sign in again." }
		};
	}
	if (match[1]?.trim().toLowerCase() === "cancel") {
		const cancelled = params.cancelLogin?.();
		return {
			status: "reply",
			reply: { text: cancelled === "model-access" ? "Model-access choice cancelled. Your saved connection is unchanged. Send /models to choose a model." : cancelled === "both" ? "Sign-in and model-access choice cancelled. Send /login to connect a provider." : cancelled ? "Provider login cancelled for this chat." : "No provider login is active in this chat." }
		};
	}
	if (/^(?:choice|access)(?:\s|$)/u.test(match[1]?.trim() ?? "")) return {
		status: "reply",
		reply: await params.answerChoice?.(params.commandText.trim()) ?? { text: "This model access choice is no longer available. Open Models to change which models are allowed." }
	};
	const resolution = resolveProviderChannelLoginChoice(match[1]?.trim() || void 0, {
		config: params.config,
		workspaceDir: params.workspaceDir
	});
	if (resolution.status !== "resolved") return {
		status: "reply",
		reply: buildProviderLoginChoicesReply(resolution)
	};
	const choice = resolution.choice;
	if (choice.mode !== "chat") return {
		status: "reply",
		reply: { text: formatProviderLoginControlUiHandoff(choice) }
	};
	return {
		status: "ready",
		choice
	};
}
function buildProviderChannelLoginPrompter(params) {
	const sendCleanMessage = async (message) => {
		params.assertCurrent();
		const text = message.trim();
		if (text) {
			await params.sendMessage(text);
			params.assertCurrent();
		}
	};
	const sendDeviceCode = params.sendDeviceCode;
	const unsupportedPrompt = async () => {
		await sendCleanMessage(params.unsupportedPromptMessage);
		throw new Error(params.unsupportedPromptMessage);
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message, title) => {
			await sendCleanMessage([title?.trim(), message.trim()].filter(Boolean).join("\n\n"));
		},
		...sendDeviceCode ? { deviceCode: async (deviceCode) => {
			params.assertCurrent();
			await sendDeviceCode(deviceCode);
			params.assertCurrent();
		} } : {},
		plain: sendCleanMessage,
		select: unsupportedPrompt,
		multiselect: unsupportedPrompt,
		text: unsupportedPrompt,
		confirm: unsupportedPrompt,
		progress: () => ({
			update: () => {},
			stop: () => {}
		})
	};
}
function parseModelsAuthLoginFlowResult(value) {
	if (!value || typeof value !== "object") throw new Error("Provider login returned an invalid result.");
	const result = value;
	if (!Array.isArray(result.profiles)) throw new Error("Provider login returned an invalid result.");
	const parseRequiredString = (input, label) => {
		if (typeof input !== "string" || !input.trim()) throw new Error(`Provider login returned an invalid ${label}.`);
		return input.trim();
	};
	const providerId = parseRequiredString(result.providerId, "provider id");
	const methodId = parseRequiredString(result.methodId, "method id");
	const authRefresh = result.authRefresh;
	if (authRefresh !== "refreshed" && authRefresh !== "gateway-rejected" && authRefresh !== "gateway-unreachable") throw new Error("Provider login returned an invalid auth refresh outcome.");
	const profiles = result.profiles.map((profile) => {
		if (!profile || typeof profile !== "object") throw new Error("Provider login returned an invalid profile.");
		const record = profile;
		const profileId = parseRequiredString(record.profileId, "profile id");
		const provider = parseRequiredString(record.provider, "profile provider");
		const mode = parseRequiredString(record.mode, "profile mode");
		if (mode !== "api_key" && mode !== "oauth" && mode !== "token") throw new Error("Provider login returned an invalid profile.");
		return {
			profileId,
			provider,
			mode
		};
	});
	const defaultModel = result.defaultModel === void 0 ? void 0 : parseRequiredString(result.defaultModel, "default model");
	return {
		providerId,
		methodId,
		authRefresh,
		...defaultModel ? { defaultModel } : {},
		profiles
	};
}
async function refreshProviderLoginAuthState(params) {
	const readConfig = () => {
		const config = params.readConfig();
		params.assertCurrent(config);
		return config;
	};
	readConfig();
	const { refreshModelAuthStateAfterMutation } = await import("./model-auth-refresh-BEUUVHvW.mjs");
	readConfig();
	await refreshModelAuthStateAfterMutation(readConfig, params.agentId);
	readConfig();
}
async function runProviderChannelLoginFlow(params) {
	const openUrl = async (url) => {
		assertCurrent();
		const heading = `Sign in with ${params.choice.providerLabel}. Return here after approving access. Send /login cancel to cancel.`;
		const text = `${heading}\n${url}`;
		if (params.sendReply) await params.sendReply({
			text,
			presentationTextMode: "fallback",
			presentation: { blocks: [{
				type: "text",
				text: heading
			}, {
				type: "buttons",
				buttons: [{
					label: `Sign in with ${params.choice.providerLabel}`,
					action: {
						type: "url",
						url
					}
				}]
			}] }
		});
		else await params.sendMessage(text);
		assertCurrent();
	};
	const browser = createProviderBrowserAuthSession({
		signal: params.signal,
		openUrl
	});
	const readConfig = params.readConfig ?? (() => params.config);
	const assertCurrent = () => {
		browser.assertCurrent();
		const config = readConfig();
		params.assertCurrent?.(config);
		const resolution = resolveProviderChannelLoginChoice(formatProviderLoginChoiceRef(params.choice), { config });
		if (resolution.status !== "resolved" || resolution.choice.mode !== "chat" || resolution.choice.pluginId !== params.choice.pluginId || resolution.choice.providerId !== params.choice.providerId || resolution.choice.methodId !== params.choice.methodId) throw new Error("This provider login is no longer available. Send /login to choose again.");
	};
	try {
		assertCurrent();
		const choice = params.choice;
		return parseModelsAuthLoginFlowResult(await (params.runLoginFlow ?? runModelsAuthLoginFlow)({
			provider: choice.providerId,
			method: choice.methodId,
			ownerPluginId: choice.pluginId,
			credentialOnly: true,
			onModelAccessRequested: params.onModelAccessRequested,
			refreshAfterLogin: (agentId) => refreshProviderLoginAuthState({
				agentId,
				readConfig,
				assertCurrent
			}),
			assertCurrent,
			agent: params.agentId,
			config: readConfig(),
			runtime: params.runtime,
			signal: browser.signal,
			browserAuthorization: async (request) => {
				assertCurrent();
				try {
					return await browser.authorize(request);
				} catch (error) {
					if (error instanceof ProviderBrowserSignInUnavailableError) await params.sendMessage(error.message);
					throw error;
				}
			},
			beforePersistentEffect: assertCurrent,
			prompter: buildProviderChannelLoginPrompter({
				...params,
				assertCurrent
			}),
			isRemote: true,
			openUrl
		}));
	} finally {
		browser.close();
	}
}
function formatProviderLoginControlUiHandoff(choice) {
	if (choice.mode === "setup") return `${choice.label} needs provider setup. Open Control UI → Models → Configure Models, then choose “${choice.label}”.`;
	return choice.mode === "secret" ? `${choice.label} needs secure input that chat must not store. Open Control UI → Models → Connect provider, then choose “${choice.label}”.` : `${choice.label} needs provider sign-in. Open Control UI → Models → Connect provider, then choose “${choice.label}”.`;
}
function buildProviderLoginChoicesReply(resolution) {
	const buttons = resolution.status === "providers" ? resolution.providers.map((provider) => ({
		label: provider.label,
		action: {
			type: "command",
			command: formatProviderLoginCommand(formatProviderOAuthLoginRef(provider))
		}
	})) : resolution.choices.toSorted((left, right) => Number(right.mode === "chat") - Number(left.mode === "chat")).map((choice) => ({
		label: choice.label,
		action: {
			type: "command",
			command: formatProviderLoginCommand(formatProviderLoginChoiceRef(choice))
		}
	}));
	if (buttons.length === 0) return { text: resolution.status === "providers" ? "No OAuth sign-in providers are available. Use /login <provider> for other connection options." : "No provider connections are available. Enable a provider plugin in Control UI → Models." };
	return buildCommandChoiceReply(resolution.status === "providers" ? "Choose a provider to sign in:" : resolution.status === "ambiguous" ? "Choose how to connect:" : "No provider matched that name. Available connections:", buttons);
}
//#endregion
export { offerProviderLoginModelAccess as a, releaseProviderLoginFlow as c, runProviderChannelLoginFlow as d, createProviderLoginFlowRegistry as i, reserveProviderLoginFlow as l, buildProviderLoginChoicesReply as n, prepareProviderChannelLogin as o, cancelProviderLoginFlow as r, refreshProviderLoginAuthState as s, answerProviderLoginModelAccess as t, runModelsAuthLoginFlow as u };
