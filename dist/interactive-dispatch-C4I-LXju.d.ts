import { Ck as PluginConversationBindingRequestResult, G as PluginInteractiveRegistration, Iy as TelegramCallbackButton, Sk as PluginConversationBindingRequestParams, Vy as ReplyPayload, xk as PluginConversationBinding } from "./config-contracts-hzlacViZ.js";
import "./reply-runtime-Yj9dU15I.js";
import "./plugin-runtime-rF4yIn1y.js";
declare const TELEGRAM_COMMAND_NAME_PATTERN: RegExp;
type TelegramCustomCommandInput = {
  command?: string | null;
  description?: string | null;
};
type TelegramCustomCommandIssue = {
  index: number;
  field: "command" | "description";
  message: string;
};
declare function normalizeTelegramCommandName(value: string): string;
declare function normalizeTelegramCommandDescription(value: string): string;
declare function resolveTelegramCustomCommands(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
  checkDuplicates?: boolean;
}): {
  commands: Array<{
    command: string;
    description: string;
  }>;
  issues: TelegramCustomCommandIssue[];
};
type ButtonRow = Array<{
  text: string;
  callback_data: string;
}>;
type ParsedModelCallback = {
  type: "providers";
} | {
  type: "list";
  provider: string;
  page: number;
} | {
  type: "list-ref";
  digest: string;
  page: number;
} | {
  type: "select";
  provider?: string;
  model: string;
} | {
  type: "select-ref";
  digest: string;
} | {
  type: "back";
};
type ProviderInfo = {
  id: string;
  count: number;
};
type ResolveModelSelectionResult = {
  kind: "resolved";
  provider: string;
  model: string;
} | {
  kind: "ambiguous";
  model: string;
  matchingProviders: string[];
};
type ModelsKeyboardParams = {
  provider: string;
  models: readonly string[];
  currentModel?: string;
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  /** Optional map from provider/model to display name. When provided, the
   *  display name is shown on the button instead of the raw model ID. */
  modelNames?: ReadonlyMap<string, string>;
};
declare function parseModelCallbackData(data: string): ParsedModelCallback | null;
declare function buildModelSelectionCallbackData(params: {
  provider: string;
  model: string;
}): string;
declare function resolveModelSelection(params: {
  callback: Extract<ParsedModelCallback, {
    type: "select" | "select-ref";
  }>;
  providers: readonly string[];
  byProvider: ReadonlyMap<string, ReadonlySet<string>>;
}): ResolveModelSelectionResult;
declare function buildProviderKeyboard(providers: ProviderInfo[]): ButtonRow[];
declare function buildModelsKeyboard(params: ModelsKeyboardParams): ButtonRow[];
declare function buildBrowseProvidersButton(): ButtonRow[];
declare function getModelsPageSize(): number;
declare function calculateTotalPages(totalModels: number, pageSize?: number): number;
declare function buildCommandsPaginationKeyboard(currentPage: number, totalPages: number, agentId?: string): Array<Array<{
  text: string;
  callback_data: string;
}>>;
declare function buildTelegramModelsProviderChannelData(params: {
  providers: ProviderInfo[];
}): ReplyPayload["channelData"] | null;
type TelegramInteractiveButtons = TelegramCallbackButton[][];
type TelegramInteractiveHandlerContext = {
  channel: "telegram";
  accountId: string;
  callbackId: string;
  conversationId: string;
  parentConversationId?: string;
  senderId?: string;
  senderUsername?: string;
  threadId?: number;
  isGroup: boolean;
  isForum: boolean;
  auth: {
    isAuthorizedSender: boolean;
  };
  callback: {
    data: string;
    namespace: string;
    payload: string;
    messageId: number;
    chatId: string;
    messageText?: string;
  };
  respond: {
    reply: (params: {
      text: string;
      buttons?: TelegramInteractiveButtons;
    }) => Promise<void>;
    editMessage: (params: {
      text: string;
      buttons?: TelegramInteractiveButtons;
    }) => Promise<void>;
    editButtons: (params: {
      buttons: TelegramInteractiveButtons;
    }) => Promise<void>;
    clearButtons: () => Promise<void>;
    deleteMessage: () => Promise<void>;
  };
  requestConversationBinding: (params?: PluginConversationBindingRequestParams) => Promise<PluginConversationBindingRequestResult>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
type TelegramInteractiveHandlerResult = {
  handled?: boolean;
  /**
   * Submit text through Telegram's normal inbound path after the callback handler
   * returns, so plugin buttons can act like user-authored replies.
   */
  submitText?: string;
} | void;
type TelegramInteractiveHandlerRegistration = PluginInteractiveRegistration<TelegramInteractiveHandlerContext, "telegram", TelegramInteractiveHandlerResult>;
export { normalizeTelegramCommandName as C, normalizeTelegramCommandDescription as S, parseModelCallbackData as _, buildTelegramModelsProviderChannelData as a, TelegramCustomCommandInput as b, ParsedModelCallback as c, buildBrowseProvidersButton as d, buildModelSelectionCallbackData as f, getModelsPageSize as g, calculateTotalPages as h, buildCommandsPaginationKeyboard as i, ProviderInfo as l, buildProviderKeyboard as m, TelegramInteractiveHandlerRegistration as n, ButtonRow as o, buildModelsKeyboard as p, TelegramInteractiveHandlerResult as r, ModelsKeyboardParams as s, TelegramInteractiveHandlerContext as t, ResolveModelSelectionResult as u, resolveModelSelection as v, resolveTelegramCustomCommands as w, TelegramCustomCommandIssue as x, TELEGRAM_COMMAND_NAME_PATTERN as y };