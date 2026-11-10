import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { n as resolveCodexAppServerLocalHomeDir } from "./auth-start-options-P3n7Bssz.mjs";
import { t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-CKBEird9.mjs";
import { n as resolveCodexAppServerRuntimeOptions, r as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
//#region extensions/codex/src/app-server/binding-connection.runtime.ts
/** Resolves connection and auth ownership exclusively from the private thread binding. */
async function resolveCodexBindingAppServerConnection(params, discoverHomes) {
	const { binding, authProfileId, assertCurrent, assertCurrentAsync, ...runtimeParams } = params;
	await assertCurrentAsync?.();
	assertCurrent?.();
	const usesSupervisionConnection = binding?.connectionScope === "supervision";
	if (usesSupervisionConnection && readCodexPluginConfig(runtimeParams.pluginConfig).supervision?.enabled !== true) throw new Error("Codex supervision is disabled; refusing to open a native user-home supervised session");
	const resolveRuntimeOptions = usesSupervisionConnection ? resolveCodexSupervisionAppServerRuntimeOptions : resolveCodexAppServerRuntimeOptions;
	let appServer = resolveRuntimeOptions(runtimeParams);
	if (usesSupervisionConnection) {
		const persistedFingerprint = binding.pendingSupervisionBranch?.connectionFingerprint ?? binding.appServerRuntimeFingerprint;
		const fingerprint = () => buildCodexAppServerConnectionFingerprint(appServer, runtimeParams.agentDir);
		let currentFingerprint = fingerprint();
		if (persistedFingerprint && currentFingerprint !== persistedFingerprint && runtimeParams.agentDir) {
			const home = (await discoverHomes?.(runtimeParams.agentDir))?.find((source) => source.appServer.start.transport === "stdio" && buildCodexAppServerConnectionFingerprint(source.appServer, source.agentDir) === persistedFingerprint);
			if (home) {
				home.assertCurrent();
				assertCurrent?.();
				appServer = resolveRuntimeOptions(runtimeParams);
				appServer = {
					...appServer,
					start: {
						...appServer.start,
						homeScope: "user",
						env: {
							...appServer.start.env,
							CODEX_HOME: resolveCodexAppServerLocalHomeDir(home.appServer.start, home.agentDir, runtimeParams.env)
						}
					}
				};
				currentFingerprint = fingerprint();
			}
		}
		if (!persistedFingerprint || persistedFingerprint !== currentFingerprint) throw new Error("Codex supervision connection changed; refusing to operate on its bound native thread");
	}
	assertCurrent?.();
	return {
		appServer,
		usesSupervisionConnection,
		requestAuthProfileId: usesSupervisionConnection ? void 0 : authProfileId,
		clientAuthProfileId: usesSupervisionConnection || appServer.start.homeScope === "user" ? null : authProfileId
	};
}
//#endregion
export { resolveCodexBindingAppServerConnection };
