import { a as normalizeTelegramCommandName, i as normalizeTelegramCommandDescription, o as resolveTelegramCustomCommands, t as TELEGRAM_COMMAND_NAME_PATTERN } from "../../command-config-B5uSKuEF.js";
import { n as parseTelegramTopicConversation } from "../../topic-conversation-DB0Kpc_a.js";
import { f as mergeTelegramAccountConfig } from "../../accounts-DKl_ZOCK.js";
import { i as buildTelegramModelsProviderChannelData, n as TelegramInteractiveHandlerRegistration, r as buildCommandsPaginationKeyboard, t as TelegramInteractiveHandlerContext } from "../../interactive-dispatch-D1xBFhKS.js";

//#region extensions/telegram/src/setup-contract.d.ts
declare const singleAccountKeysToMove: string[];
//#endregion
export { TELEGRAM_COMMAND_NAME_PATTERN, type TelegramInteractiveHandlerContext, type TelegramInteractiveHandlerRegistration, buildCommandsPaginationKeyboard, buildTelegramModelsProviderChannelData, mergeTelegramAccountConfig, normalizeTelegramCommandDescription, normalizeTelegramCommandName, parseTelegramTopicConversation, resolveTelegramCustomCommands, singleAccountKeysToMove };