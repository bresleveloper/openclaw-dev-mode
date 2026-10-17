import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CzrjMN2p.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-PVt0mIew.mjs";
//#region src/agents/mcp-operator-auth.ts
/** The shared operator OAuth connection that Settings may inspect and sign in. */
function resolveOperatorMcpOAuthConfig(serverName, server) {
	const raw = asOptionalObjectRecord(server);
	if (!raw || raw.enabled === false) return;
	const config = resolveMcpTransportConfig(serverName, raw, { logWarnings: false });
	return config?.kind === "http" && config.auth === "oauth" && !config.oauth?.authProfileId && Object.hasOwn(partitionMcpServersByConnectionScope({ [serverName]: raw }).staticServers, serverName) ? config : void 0;
}
//#endregion
export { resolveOperatorMcpOAuthConfig as t };
