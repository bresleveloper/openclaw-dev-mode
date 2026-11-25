import { t as collectMattermostCallbackPaths } from "./callback-host-CRQTeNn9.mjs";
// extensions/mattermost/src/gateway-auth-bypass.ts
function resolveMattermostGatewayAuthBypassPaths(params) {
	return collectMattermostCallbackPaths(params.cfg.channels?.mattermost).filter((path) => path.startsWith("/api/channels/mattermost/"));
}
export { resolveMattermostGatewayAuthBypassPaths as t };
