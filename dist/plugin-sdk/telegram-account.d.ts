import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../config-contracts-DYGYnzuk.js";
//#region src/plugin-sdk/telegram-account.d.ts
/**
 * @deprecated Compatibility type for the `openclaw/plugin-sdk/telegram-account` facade.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export type TelegramAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["telegram"]>;
/**
 * @deprecated Compatibility type for the `openclaw/plugin-sdk/telegram-account` facade.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export type ResolvedTelegramAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "tokenFile" | "config" | "none";
  config: TelegramAccountConfig;
};
/**
 * @deprecated Compatibility facade for plugin code that needs Telegram account resolution.
 * New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
 */
export declare function resolveTelegramAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedTelegramAccount;
//#endregion