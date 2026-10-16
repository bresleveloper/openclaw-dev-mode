import { t as collectMattermostCallbackPaths } from "./callback-host-CBsPjVAZ.mjs";
//#region extensions/mattermost/src/gateway-auth-bypass.ts
function resolveMattermostGatewayAuthBypassPaths(params) {
	return collectMattermostCallbackPaths(params.cfg.channels?.mattermost).filter((path) => path.startsWith("/api/channels/mattermost/"));
}
//#endregion
export { resolveMattermostGatewayAuthBypassPaths as t };
