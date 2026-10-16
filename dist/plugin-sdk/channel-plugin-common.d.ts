import { l as buildChannelConfigSchema } from "../zod-schema.implicit-mentions-BfiN-dfC.js";
import { Ss as OpenClawPluginApi, jl as emptyPluginConfigSchema, ma as PluginRuntime } from "../agent-harness-runtime-DZjstJNb.js";
import { g as ChannelMessageActionContext, x as ChannelMeta } from "../types.core-Bra2QBA5.js";
import { n as ChatChannelId } from "../channel-id.types-CM2F8b5e.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { n as ChannelPlugin } from "../types.plugin-BiZwy65L.js";
import "../types.public-DpLTXZT0.js";
import { n as formatPairingApproveHint } from "../helpers-gk1rbVRv.js";
import { i as setAccountEnabledInConfigSection, r as deleteAccountFromConfigSection, t as clearAccountEntryFields } from "../config-helpers-B3C2dCc9.js";
import { o as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../setup-helpers-Bi7ML6Fn.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-CFs8lRw3.js";
//#region src/channels/chat-meta-shared.d.ts
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
type ChatChannelMeta = ChannelMeta;
//#endregion
//#region src/channels/chat-meta.d.ts
/**
 * Returns metadata for one built-in chat channel id.
 * Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
 * violation; drift-tolerant core paths use findChatChannelMeta instead.
 */
export declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
//#endregion
export { type ChannelMessageActionContext, type ChannelPlugin, DEFAULT_ACCOUNT_ID, type OpenClawPluginApi, PAIRING_APPROVED_MESSAGE, type PluginRuntime, applyAccountNameToChannelSection, buildChannelConfigSchema, clearAccountEntryFields, deleteAccountFromConfigSection, emptyPluginConfigSchema, formatPairingApproveHint, migrateBaseNameToDefaultAccount, normalizeAccountId, setAccountEnabledInConfigSection };