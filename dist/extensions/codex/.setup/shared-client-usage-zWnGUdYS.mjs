import { t as codexAppServerStartOptionsKey } from "./config-options-ZyoXdPOW.mjs";
import { S as getSharedCodexAppServerClientState } from "./auth-cache-key-DS0mnvrR.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { S as createSharedCodexAppServerClientKeyResolver, c as prepareCodexAppServerClient, n as captureSharedClientRegistration, rt as readRecentCodexRateLimits } from "./shared-client-DhJ31S_8.mjs";
import { a as resolveCodexAppServerAuthProfileStore, i as resolveCodexAppServerAuthProfileIdForAgent } from "./auth-profile-TZnVUd6M.mjs";
import { r as prepareCodexAppServerAuthBinding } from "./auth-binding-B6eynOvR.mjs";
import { resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
// extensions/codex/src/app-server/shared-client-usage.ts
/** Reads an already-owned subscription snapshot without acquiring or starting a client. */
async function readSharedCodexAppServerUsage(options, maxAgeMs) {
	const state = getSharedCodexAppServerClientState();
	if (maxAgeMs <= 0 || state.clients.size === 0 || options.preparedAuth?.kind === "api-key") return;
	const startOptions = options.startOptions ?? resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig }).start;
	if (startOptions.homeScope === "user" || options.authProfileId === null) return;
	const agentDir = options.agentDir ?? resolveDefaultAgentDir(options.config ?? {});
	const startKey = codexAppServerStartOptionsKey(startOptions);
	if (![...state.clients.values()].some(({ client, ready, closeWhenIdle }) => {
		const metadata = client && state.startMetadata.get(client);
		return ready && !closeWhenIdle && metadata?.agentDir === agentDir && codexAppServerStartOptionsKey(metadata.requestedStartOptions) === startKey;
	})) return;
	const prepared = options.preparedAuth;
	const store = prepared?.store ?? await resolveCodexAppServerAuthProfileStore({
		...options,
		authProfileId: options.authProfileId ?? void 0,
		agentDir
	});
	const profileId = prepared?.profileId ?? await resolveCodexAppServerAuthProfileIdForAgent({
		...options,
		authProfileId: options.authProfileId ?? void 0,
		agentDir,
		authProfileStore: store
	});
	if (!profileId || !store) return;
	const binding = await prepareCodexAppServerAuthBinding({
		authProfileId: profileId,
		authProfileStore: store,
		agentDir,
		config: options.config ?? {}
	});
	if (!binding) return;
	const { context, assertCurrent } = await prepareCodexAppServerClient({
		...options,
		agentDir,
		authProfileId: void 0,
		preparedAuth: {
			kind: "profile",
			profileId,
			store: binding.authProfileStore
		},
		authBindingFingerprint: binding.fingerprint
	});
	assertCurrent();
	options.assertCurrent?.();
	const keyFor = createSharedCodexAppServerClientKeyResolver({
		...context,
		authBindingFingerprint: binding.fingerprint
	});
	const entry = state.clients.get(keyFor(context.startOptions));
	const client = entry?.client;
	if (!entry?.ready || !client || !captureSharedClientRegistration(client)()) return;
	const rateLimits = readRecentCodexRateLimits(client, maxAgeMs);
	const accountEmail = store.profiles[profileId]?.email;
	return rateLimits === void 0 ? void 0 : {
		rateLimits,
		...accountEmail ? { accountEmail } : {}
	};
}
export { readSharedCodexAppServerUsage };
