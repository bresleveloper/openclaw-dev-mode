import { c as getLeasedSharedCodexAppServerClient, m as withTimeout, o as createIsolatedCodexAppServerClient, u as releaseLeasedSharedCodexAppServerClient } from "./shared-client-ChYWHlb8.js";
import { t as resolveCodexAppServerDirectSandboxBypassBlock } from "./sandbox-guard-Bz6I90fx.js";
//#region extensions/codex/src/app-server/request.ts
async function requestCodexAppServerJson(params) {
	const sandboxBlock = resolveCodexAppServerDirectSandboxBypassBlock({
		method: params.method,
		requestParams: params.requestParams,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	});
	if (sandboxBlock) throw new Error(sandboxBlock);
	const timeoutMs = params.timeoutMs ?? 6e4;
	return await withTimeout((async () => {
		const client = await (params.isolated ? createIsolatedCodexAppServerClient : getLeasedSharedCodexAppServerClient)({
			startOptions: params.startOptions,
			timeoutMs,
			authProfileId: params.authProfileId,
			agentDir: params.agentDir,
			config: params.config
		});
		try {
			return await client.request(params.method, params.requestParams, { timeoutMs });
		} finally {
			if (params.isolated) await client.closeAndWait({
				exitTimeoutMs: 2e3,
				forceKillDelayMs: 250
			});
			else releaseLeasedSharedCodexAppServerClient(client);
		}
	})(), timeoutMs, `codex app-server ${params.method} timed out`);
}
//#endregion
export { requestCodexAppServerJson as t };
