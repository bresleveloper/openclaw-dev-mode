import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { r as resolveStoredModelOverrideAsync } from "./stored-model-overrides-RKQxlZXm.mjs";
import { a as formatFastModeCurrentStatus } from "./fast-mode-smSVCJXN.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { f as resolveCommandArgMenuAsync, i as formatCommandArgMenuTitle, l as parseCommandArgs, n as canResolveCommandArgMenu, r as findCommandByNativeName, t as buildCommandTextFromArgs } from "./commands-registry-CFDGAPH8.mjs";
import { t as getSessionEntryAsync } from "./session-store-runtime-internal-Cv2I3LCC.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { n as loadPreparedModelCatalog, r as resolveThinkingDefaultWithRuntimeCatalog } from "./agent-runtime-DkCKSFV_.mjs";
import "./command-auth-native-DcOXNEhg.mjs";
import { w as buildInlineKeyboard } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-egNNRPnG.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-Dwxi_VTm.mjs";
//#region extensions/telegram/src/bot-native-command-builtins.ts
async function resolveTelegramCommandMenuModelContext(params, mode = "menu") {
	const fastDefault = mode === "fast" ? resolveDefaultModelForAgent(params) : void 0;
	const fallback = fastDefault ? {
		provider: fastDefault.provider,
		model: fastDefault.model
	} : {};
	if (!params.sessionKey.trim()) return fallback;
	try {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
		const defaultModel = fastDefault ?? resolveDefaultModelForAgent(params);
		const entry = await getSessionEntryAsync({
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
			const override = await resolveStoredModelOverrideAsync({
				sessionEntry: entry,
				loadSessionEntry: (sessionKey) => getSessionEntryAsync({
					storePath,
					sessionKey
				}),
				sessionKey: params.sessionKey,
				defaultProvider: defaultModel.provider
			});
			if (mode === "fast") return {
				provider: override?.provider ?? defaultModel.provider,
				model: override?.model ?? defaultModel.model,
				sessionEntry: entry
			};
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
		if (mode === "fast") return {
			...context,
			sessionEntry: entry
		};
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
		return fallback;
	}
}
function resolveTelegramFastCommandState(params) {
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolveFastModeState({
		cfg: params.cfg,
		provider: params.modelContext.provider ?? defaultModel.provider,
		model: params.modelContext.model ?? defaultModel.model,
		agentId: params.agentId,
		sessionEntry: params.modelContext.sessionEntry
	});
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
		const { executeTelegramLoginCommand } = await import("./bot-native-command-login-S-hxlx7a.mjs");
		return await executeTelegramLoginCommand({
			dispatch,
			commandText: prompt,
			currentProvider: (await resolveTelegramCommandMenuModelContext({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId,
				sessionKey: dispatch.targetSessionKey
			})).provider ?? resolveDefaultModelForAgent({
				cfg: dispatch.runtimeCfg,
				agentId: dispatch.route.agentId
			}).provider
		}) ? "handled-clear-buttons" : "handled";
	}
	const menuNeedsModelContext = commandDefinition.argsMenu && !(commandArgs?.raw && !commandArgs.values) && commandDefinition.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
	const menuContextParams = {
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: menuNeedsModelContext ? dispatch.targetSessionKey : ""
	};
	const menuModelContext = menuNeedsModelContext ? await resolveTelegramCommandMenuModelContext(menuContextParams, commandDefinition.key === "fast" ? "fast" : "menu") : {};
	const menuModelCatalog = commandDefinition.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
		config: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		agentDir: resolveAgentDir(dispatch.runtimeCfg, dispatch.route.agentId),
		readOnly: true
	}) : void 0;
	const menu = await resolveCommandArgMenuAsync({
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
		const currentThinkingLevel = commandDefinition.key === "think" ? await resolveTelegramThinkMenuCurrentLevel({
			cfg: dispatch.runtimeCfg,
			agentId: dispatch.route.agentId,
			...menuModelContext,
			catalog: menuModelCatalog ?? []
		}) : void 0;
		const currentFastModeStatus = commandDefinition.key === "fast" ? formatFastModeCurrentStatus(resolveTelegramFastCommandState({
			...menuContextParams,
			modelContext: menuModelContext
		})) : void 0;
		let title = formatCommandArgMenuTitle({
			command: commandDefinition,
			menu
		});
		if (commandDefinition.key === "think" && currentThinkingLevel) title = `Current thinking level: ${currentThinkingLevel}.\n${title}`;
		else if (commandDefinition.key === "fast" && currentFastModeStatus) {
			const options = menu.choices.map((choice) => choice.label.trim()).filter(Boolean).join(", ");
			title = options ? `${currentFastModeStatus}\nOptions: ${options}.` : currentFastModeStatus;
		}
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
		await dispatch.recordDeliveredReply(prompt, `${title}\n${menu.choices.map((choice) => choice.label).join(", ")}`, "menu");
		return "handled";
	}
	return "fall-through";
}
//#endregion
export { executeTelegramBuiltinCommand };
