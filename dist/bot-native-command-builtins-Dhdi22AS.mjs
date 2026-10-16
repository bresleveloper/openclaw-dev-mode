import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { f as resolveStorePath, i as getSessionEntry } from "./session-store-runtime-BS2ijndm.mjs";
import { a as formatFastModeCurrentStatus } from "./fast-mode-smSVCJXN.mjs";
import { d as resolveCommandArgMenu, i as formatCommandArgMenuTitle, l as parseCommandArgs, n as canResolveCommandArgMenu, r as findCommandByNativeName, t as buildCommandTextFromArgs } from "./commands-registry-DcFr3mpT.mjs";
import { n as resolveStoredModelOverride } from "./stored-model-overrides-C1-DcdN6.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { n as loadPreparedModelCatalog, r as resolveThinkingDefaultWithRuntimeCatalog } from "./agent-runtime-BhLWDirV.mjs";
import "./command-auth-native-Df-1rxxc.mjs";
import { C as buildInlineKeyboard } from "./text-chunk-limit-BgiLU1vv.mjs";
import { t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-oKFReBjD.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-Dcv6s_s2.mjs";
import { t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-DiI_zo7L.mjs";
//#region extensions/telegram/src/bot-native-command-builtins.ts
const loadTelegramLoginCommandExecutor = createLazyRuntimeModule(() => import("./bot-native-command-login-2T0QWi-k.mjs"));
function resolveTelegramCommandMenuModelContext(params) {
	if (!params.sessionKey.trim()) return {};
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const defaultModel = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId
		});
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		const thinkingLevel = normalizeOptionalString(entry?.thinkingLevel);
		const fastMode = entry?.fastMode;
		let context;
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) context = {
			provider: defaultModel.provider,
			model: defaultModel.model
		};
		else {
			const override = resolveStoredModelOverride({
				sessionEntry: entry,
				loadSessionEntry: (sessionKey) => getSessionEntry({
					storePath,
					sessionKey
				}),
				sessionKey: params.sessionKey,
				defaultProvider: defaultModel.provider
			});
			if (override?.model) context = {
				provider: override.provider || defaultModel.provider,
				model: override.model
			};
			else {
				const provider = normalizeOptionalString(entry?.providerOverride) ?? normalizeOptionalString(entry?.modelProvider);
				const model = normalizeOptionalString(entry?.modelOverride) ?? normalizeOptionalString(entry?.model);
				context = {
					...provider ? { provider } : {},
					...model ? { model } : {}
				};
			}
		}
		return {
			...context,
			...thinkingLevel ? { thinkingLevel } : {},
			...fastMode !== void 0 ? { fastMode } : {},
			agentRuntime: resolveEffectiveAgentRuntime({
				cfg: params.cfg,
				provider: context.provider ?? defaultModel.provider,
				modelId: context.model ?? defaultModel.model,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionEntry: entry
			})
		};
	} catch {
		return {};
	}
}
function resolveTelegramFastCommandModelContext(params) {
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const fallback = () => ({
		provider: defaultModel.provider,
		model: defaultModel.model
	});
	if (!params.sessionKey.trim()) return fallback();
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) return fallback();
		const override = resolveStoredModelOverride({
			sessionEntry: entry,
			loadSessionEntry: (sessionKey) => getSessionEntry({
				storePath,
				sessionKey
			}),
			sessionKey: params.sessionKey,
			defaultProvider: defaultModel.provider
		});
		return {
			provider: override?.provider ?? defaultModel.provider,
			model: override?.model ?? defaultModel.model
		};
	} catch {
		return fallback();
	}
}
function resolveTelegramFastCommandState(params) {
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const fallback = () => resolveFastModeState({
		cfg: params.cfg,
		provider: defaultModel.provider,
		model: defaultModel.model,
		agentId: params.agentId
	});
	if (!params.sessionKey.trim()) return fallback();
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		const modelContext = resolveTelegramFastCommandModelContext(params);
		return resolveFastModeState({
			cfg: params.cfg,
			provider: modelContext.provider ?? defaultModel.provider,
			model: modelContext.model ?? defaultModel.model,
			agentId: params.agentId,
			sessionEntry: entry
		});
	} catch {
		return fallback();
	}
}
async function resolveTelegramThinkMenuCurrentLevel(params) {
	const explicit = normalizeOptionalString(params.thinkingLevel);
	if (explicit) return explicit;
	const agentThinkingDefault = normalizeOptionalString(resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault);
	if (agentThinkingDefault) return agentThinkingDefault;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return await resolveThinkingDefaultWithRuntimeCatalog({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider ?? defaultModel.provider,
		model: params.model ?? defaultModel.model,
		agentRuntime: params.agentRuntime,
		loadModelCatalog: async () => params.catalog
	});
}
function formatTelegramCommandArgMenuTitle(params) {
	const title = formatCommandArgMenuTitle({
		command: params.command,
		menu: params.menu
	});
	if (params.command.key === "think" && params.currentThinkingLevel) return `Current thinking level: ${params.currentThinkingLevel}.\n${title}`;
	if (params.command.key === "fast" && params.currentFastModeStatus) {
		const options = params.menu.choices.map((choice) => choice.label.trim()).filter(Boolean).join(", ");
		return options ? `${params.currentFastModeStatus}\nOptions: ${options}.` : params.currentFastModeStatus;
	}
	return title;
}
async function executeTelegramBuiltinCommand(params) {
	const commandDefinition = findCommandByNativeName(params.commandName, "telegram", { includeBundledChannelFallback: false });
	if (!commandDefinition) return "fall-through";
	const commandArgs = parseCommandArgs(commandDefinition, params.rawText);
	const prompt = buildCommandTextFromArgs(commandDefinition, commandArgs);
	if (commandDefinition.key !== "login" && !canResolveCommandArgMenu({
		command: commandDefinition,
		args: commandArgs
	})) return "fall-through";
	if (commandDefinition.key === "login" && params.shouldSkip?.()) return "handled";
	const dispatch = await prepareTelegramCommandDispatch({
		...params,
		requireAuth: true
	});
	if (!dispatch) return "handled";
	if (commandDefinition.key === "login") {
		const { executeTelegramLoginCommand } = await loadTelegramLoginCommandExecutor();
		return await executeTelegramLoginCommand({
			dispatch,
			commandText: prompt,
			currentProvider: resolveTelegramCommandMenuModelContext({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId,
				sessionKey: dispatch.targetSessionKey
			}).provider ?? resolveDefaultModelForAgent({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId
			}).provider
		}) ? "handled-clear-buttons" : "handled";
	}
	const menuNeedsModelContext = commandDefinition.argsMenu && !(commandArgs?.raw && !commandArgs.values) && commandDefinition.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
	const sessionKeyForMenu = menuNeedsModelContext ? dispatch.targetSessionKey : "";
	const fastCommandState = commandDefinition.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandState({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : void 0;
	const fastMenuModelContext = commandDefinition.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandModelContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : void 0;
	const menuModelContext = menuNeedsModelContext ? fastMenuModelContext ?? resolveTelegramCommandMenuModelContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : {};
	const menuModelCatalog = commandDefinition.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
		config: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		agentDir: resolveAgentDir(dispatch.runtimeCfg, dispatch.route.agentId),
		readOnly: true
	}) : void 0;
	const menu = resolveCommandArgMenu({
		command: commandDefinition,
		args: commandArgs,
		cfg: dispatch.runtimeCfg,
		session: {
			agentId: dispatch.route.agentId,
			sessionKey: dispatch.targetSessionKey
		},
		...menuModelContext,
		catalog: menuModelCatalog
	});
	if (menu) {
		if (params.shouldSkip?.()) return "handled";
		const title = formatTelegramCommandArgMenuTitle({
			command: commandDefinition,
			menu,
			currentThinkingLevel: commandDefinition.key === "think" ? await resolveTelegramThinkMenuCurrentLevel({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId,
				...menuModelContext,
				catalog: menuModelCatalog ?? []
			}) : void 0,
			currentFastModeStatus: commandDefinition.key === "fast" ? formatFastModeCurrentStatus(fastCommandState ?? resolveTelegramFastCommandState({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId,
				sessionKey: sessionKeyForMenu
			})) : void 0
		});
		const rows = [];
		for (let index = 0; index < menu.choices.length; index += 2) rows.push(menu.choices.slice(index, index + 2).map((choice) => ({
			text: choice.label,
			callback_data: buildTelegramNativeCommandCallbackData(buildCommandTextFromArgs(commandDefinition, { values: { [menu.arg.name]: choice.value } }))
		})));
		const replyMarkup = buildInlineKeyboard(rows);
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, title, {
				...replyMarkup ? { reply_markup: replyMarkup } : {},
				...dispatch.threadParams
			})
		});
		return "handled";
	}
	return "fall-through";
}
//#endregion
export { executeTelegramBuiltinCommand };
