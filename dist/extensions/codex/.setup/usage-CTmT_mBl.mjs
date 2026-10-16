import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-CMPy24F5.mjs";
import { t as readCodexAppServerUsage } from "./request-CB7T766a.mjs";
import "./config-0Gxk3_eq.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-cUYrqu_a.mjs";
import { CODEX_APP_SERVER_AUTH_MARKER } from "openclaw/plugin-sdk/agent-runtime";
//#region extensions/codex/src/app-server/usage.ts
/** Handles the synthetic usage credential for a Codex-backed OpenAI route. */
async function fetchCodexAppServerUsageSnapshot(ctx, options = {}) {
	if (ctx.token !== CODEX_APP_SERVER_AUTH_MARKER) return null;
	const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	const usage = await (options.readUsage ?? readCodexAppServerUsage)({
		timeoutMs: ctx.timeoutMs,
		signal: ctx.signal,
		agentDir: ctx.agentDir,
		...ctx.authProfileId ? { authProfileId: ctx.authProfileId } : {},
		config: ctx.config,
		startOptions: appServer.start
	});
	const snapshot = buildCodexAppServerUsageSnapshot(usage.rateLimits);
	const accountEmail = ctx.email ?? usage.accountEmail;
	return accountEmail && !snapshot.error ? {
		...snapshot,
		accountEmail
	} : snapshot;
}
//#endregion
export { fetchCodexAppServerUsageSnapshot };
