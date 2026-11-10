import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { T as parseCronRunScopeSuffix } from "./session-key-CSDERtm3.mjs";
import { n as resolveGitCoauthorAttribution } from "./git-coauthor-attribution-oOt34ShF.mjs";
//#region src/agents/git-coauthor-prompt.ts
const log = createSubsystemLogger("agents/system-prompt");
async function resolveSessionGitCoauthorPrompt(params) {
	if (!params.config || !params.agentId || !params.sessionKey) return;
	if (parseCronRunScopeSuffix(params.sessionKey).runId !== void 0) return;
	if (isIncognitoSessionKey(params.sessionKey)) return;
	try {
		const trailers = (await resolveGitCoauthorAttribution({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			...params.sessionId ? { sessionId: params.sessionId } : {},
			storePath: params.storePath
		}))?.trailers;
		return trailers?.length ? ["Git co-authors: add these exact trailers to every commit you make from this session.", ...trailers].join("\n") : void 0;
	} catch (error) {
		log.warn("failed to resolve session Git co-authors", { error });
		return;
	}
}
//#endregion
export { resolveSessionGitCoauthorPrompt as t };
