import { p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-DMubSy5d.mjs";
import { t as readCodexAppServerUsage } from "./request-DaqFEDj8.mjs";
import "./config-B-xRmWRi.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { CODEX_APP_SERVER_AUTH_MARKER } from "openclaw/plugin-sdk/agent-runtime";
// extensions/codex/src/app-server/usage.ts
/** Handles the synthetic usage credential for a Codex-backed OpenAI route. */
async function fetchCodexAppServerUsageSnapshot(ctx, options = {}) {
	if (ctx.token !== CODEX_APP_SERVER_AUTH_MARKER) return null;
	const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: readCodexPluginConfig(options.pluginConfig) });
	const usage = await readCodexAppServerUsage({
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
export { fetchCodexAppServerUsageSnapshot };
