import { o as resolveAgentRoute } from "./resolve-route-CaibtbpY.mjs";
import "./routing-gwrpgNm_.mjs";
//#region extensions/telegram/src/account-owner.ts
/** Resolves the agent that owns account-scoped Telegram runtime state. */
function resolveTelegramAccountOwnerAgentId(params) {
	return resolveAgentRoute({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId
	}).agentId;
}
//#endregion
export { resolveTelegramAccountOwnerAgentId as t };
