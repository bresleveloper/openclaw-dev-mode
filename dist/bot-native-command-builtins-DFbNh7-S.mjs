import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-CYXCkx2Z.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { i as formatFastModeCurrentStatus } from "./fast-mode-CF9HctjM.mjs";
import { a as formatCommandArgMenuTitle, d as parseCommandArgs, i as findCommandByNativeName, n as buildCommandTextFromArgs, p as resolveCommandArgMenu, r as canResolveCommandArgMenu } from "./commands-registry-BUZjd6Tx.mjs";
import { n as resolveStoredModelOverride } from "./stored-model-overrides-Covy02dM.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { h as resolveStorePath, i as getSessionEntry } from "./session-store-runtime-XTMMGjZf.mjs";
import { n as loadPreparedModelCatalog, r as resolveThinkingDefaultWithRuntimeCatalog } from "./agent-runtime-vMVS3kbD.mjs";
import "./command-auth-native-l-wQHDTC.mjs";
import { D as buildInlineKeyboard } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-C11bj7rj.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-DxyzL-VJ.mjs";
//#region extensions/telegram/src/bot-native-command-builtins.ts
const loadTelegramLoginCommandExecutor = createLazyRuntimeModule(() => import("./bot-native-command-login-CGzmowWL.mjs"));
function buildTelegramCommandMenuModelContext(params) {
	return {
		provider: params.provider,
		model: params.model,
		...params.thinkingLevel ? { thinkingLevel: params.thinkingLevel } : {},
		...params.fastMode !== void 0 ? { fastMode: params.fastMode } : {}
	};
}
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
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) context = buildTelegramCommandMenuModelContext({
			provider: defaultModel.provider,
			model: defaultModel.model,
			...thinkingLevel ? { thinkingLevel } : {},
			...fastMode !== void 0 ? { fastMode } : {}
		});
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
			if (override?.model) context = buildTelegramCommandMenuModelContext({
				provider: override.provider || defaultModel.provider,
				model: override.model,
				...thinkingLevel ? { thinkingLevel } : {},
				...fastMode !== void 0 ? { fastMode } : {}
			});
			else {
				const provider = normalizeOptionalString(entry?.providerOverride) ?? normalizeOptionalString(entry?.modelProvider);
				const model = normalizeOptionalString(entry?.modelOverride) ?? normalizeOptionalString(entry?.model);
				context = {
					...provider ? { provider } : {},
					...model ? { model } : {},
					...thinkingLevel ? { thinkingLevel } : {},
					...fastMode !== void 0 ? { fastMode } : {}
				};
			}
		}
		return {
			...context,
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
			sessionEntry: entry?.fastMode !== void 0 ? { fastMode: entry.fastMode } : void 0
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
	const commandArgs = commandDefinition ? parseCommandArgs(commandDefinition, params.rawText) : params.rawText ? { raw: params.rawText } : void 0;
	const prompt = commandDefinition ? buildCommandTextFromArgs(commandDefinition, commandArgs) : params.rawText ? `/${params.commandName} ${params.rawText}` : `/${params.commandName}`;
	if (commandDefinition?.key !== "login" && (!commandDefinition || !canResolveCommandArgMenu({
		command: commandDefinition,
		args: commandArgs
	}))) return "fall-through";
	if (commandDefinition?.key === "login" && params.shouldSkip?.()) return "handled";
	const dispatch = await prepareTelegramCommandDispatch({
		...params,
		requireAuth: true
	});
	if (!dispatch) return "handled";
	if (commandDefinition?.key === "login") {
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
	const menuNeedsModelContext = commandDefinition?.argsMenu && !(commandArgs?.raw && !commandArgs.values) && commandDefinition.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
	const sessionKeyForMenu = commandDefinition && menuNeedsModelContext ? dispatch.targetSessionKey : "";
	const fastCommandState = commandDefinition?.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandState({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : void 0;
	const fastMenuModelContext = commandDefinition?.key === "fast" && menuNeedsModelContext ? resolveTelegramFastCommandModelContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : void 0;
	const menuModelContext = commandDefinition && menuNeedsModelContext ? fastMenuModelContext ?? resolveTelegramCommandMenuModelContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: sessionKeyForMenu
	}) : {};
	const menuModelCatalog = commandDefinition?.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
		config: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		agentDir: resolveAgentDir(dispatch.runtimeCfg, dispatch.route.agentId),
		readOnly: true
	}) : void 0;
	const menu = commandDefinition ? resolveCommandArgMenu({
		command: commandDefinition,
		args: commandArgs,
		cfg: dispatch.runtimeCfg,
		session: {
			agentId: dispatch.route.agentId,
			sessionKey: dispatch.targetSessionKey
		},
		...menuModelContext,
		catalog: menuModelCatalog
	}) : null;
	if (menu && commandDefinition) {
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
			currentFastModeStatus: commandDefinition.key === "fast" ? formatFastModeCurrentStatus({ ...fastCommandState ?? resolveTelegramFastCommandState({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId,
				sessionKey: sessionKeyForMenu
			}) }) : void 0
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
