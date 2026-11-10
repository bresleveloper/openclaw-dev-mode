import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import "./runs-Czr-I6_B.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
import "./session-transcript-readers-ChK_-oGN.mjs";
import "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { t as withSubagentSessionSource } from "./subagent-session-source-b7OOANca.mjs";
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
async function readSubagentSessionEntry(storePath, sessionKey, explicitAgentId) {
	const agentId = resolveSubagentChildAgentId({
		childSessionKey: sessionKey,
		childAgentId: explicitAgentId
	});
	if (!agentId) return;
	return withSubagentSessionSource({
		agentId,
		storePath,
		sessionKey
	}, async (source) => source ? source.actor.snapshot(source.authority)?.entry : isIncognitoSessionKey(sessionKey) ? void 0 : readSessionEntryReadOnlyInWorker({
		storePath,
		sessionKey,
		agentId
	}));
}
const callSubagentLifecycleGateway = (request) => bindGatewayLifecycleRequest()(request);
//#endregion
export { readSubagentSessionEntry as n, callSubagentLifecycleGateway as t };
