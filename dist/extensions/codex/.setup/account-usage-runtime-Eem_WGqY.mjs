import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-CMU3DUD0.mjs";
import { n as readCodexAppServerUsage } from "./request-D2L0zMrq.mjs";
import "./config-BoTP_mrL.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { a as resolveCodexAppServerAuthProfileStore } from "./auth-profile-WqZtZfXN.mjs";
import { isDeepStrictEqual } from "node:util";
import { listAgentIds, resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { z } from "zod";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
//#region extensions/codex/src/account-usage-runtime.ts
const paramsSchema = z.object({
	agentId: z.string().min(1),
	profileId: z.string().min(1)
}).strict();
async function handleCodexAccountUsage({ params, respond, context, signal, hasCurrentClientAuthority }) {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Expected agentId and profileId."));
		return;
	}
	const { agentId, profileId } = parsed.data;
	const config = context.getRuntimeConfig();
	if (!listAgentIds(config).includes(agentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Unknown agent."));
		return;
	}
	try {
		const agentDir = resolveAgentDir(config, agentId);
		const readStore = () => resolveCodexAppServerAuthProfileStore({
			agentDir,
			authProfileId: profileId,
			config
		});
		const store = structuredClone(readStore());
		const credential = store.profiles[profileId];
		if (!credential || credential.provider !== "openai" || credential.type === "api_key") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Select a saved Codex subscription login."));
			return;
		}
		const assertCurrent = () => {
			if (signal?.aborted || hasCurrentClientAuthority?.() === false || context.getRuntimeConfig() !== config || !isDeepStrictEqual(readStore().profiles[profileId], store.profiles[profileId])) throw new Error("Account credentials changed. Refresh Models and try again.");
		};
		assertCurrent();
		const { start } = resolveCodexAppServerRuntimeOptions({ pluginConfig: config.plugins?.entries?.codex?.config });
		if (isCodexAppServerProxyLaunch(start.args)) throw new Error("Account usage is unavailable through a Codex proxy. Configure a direct app-server launch.");
		const usage = await readCodexAppServerUsage({
			agentDir,
			config,
			timeoutMs: 2e4,
			preparedAuth: {
				kind: "profile",
				profileId,
				store
			},
			authRequirement: "subscription",
			assertCurrent,
			startOptions: {
				...start,
				transport: "stdio",
				homeScope: "agent"
			}
		});
		assertCurrent();
		const snapshot = buildCodexAppServerUsageSnapshot(usage.rateLimits, { accountDetails: true });
		respond(true, {
			updatedAt: Date.now(),
			providers: [snapshot]
		});
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "Codex usage unavailable. Try refreshing the account."));
	}
}
//#endregion
export { handleCodexAccountUsage };
