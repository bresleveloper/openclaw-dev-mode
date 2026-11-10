import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { t as buildCodexAppServerUsageSnapshot } from "./rate-limits-BpfURnuy.mjs";
import { t as readCodexAppServerUsage } from "./request-i8njrYRU.mjs";
import "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { a as resolveCodexAppServerAuthProfileStore } from "./auth-profile-auwzSwwy.mjs";
import { isDeepStrictEqual } from "node:util";
import { listAgentIds, resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { z } from "zod";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
import { ensureAuthProfileStore } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/codex/src/account-usage-runtime.ts
const paramsSchema = z.object({
	agentId: z.string().min(1),
	profileId: z.string().min(1)
}).strict();
async function handleCodexAccountUsage({ params, respond, context, signal, hasCurrentClientAuthority }) {
	const invalid = (message) => respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		invalid("Expected agentId and profileId.");
		return;
	}
	const { agentId, profileId } = parsed.data;
	const config = context.getRuntimeConfig();
	if (!listAgentIds(config).includes(agentId)) {
		invalid("Unknown agent.");
		return;
	}
	try {
		const agentDir = resolveAgentDir(config, agentId);
		const store = structuredClone(await resolveCodexAppServerAuthProfileStore({
			agentDir,
			authProfileId: profileId,
			config
		}));
		const credential = store.profiles[profileId];
		if (!credential || credential.provider !== "openai" || credential.type === "api_key") {
			invalid("Select a saved Codex subscription login.");
			return;
		}
		const assertCurrent = () => {
			if (signal?.aborted || hasCurrentClientAuthority?.() === false || context.getRuntimeConfig() !== config || !isDeepStrictEqual(ensureAuthProfileStore(agentDir, {
				profileId,
				allowKeychainPrompt: false,
				config,
				externalCliProviderIds: ["openai"],
				externalCliProfileIds: [profileId]
			}).profiles[profileId], store.profiles[profileId])) throw new Error("Account credentials changed. Refresh Models and try again.");
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
