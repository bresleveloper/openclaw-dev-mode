//#region extensions/codex/src/app-server/client-factory.ts
let sharedClientModulePromise = null;
const loadSharedClientModule = async () => {
	sharedClientModulePromise ??= import("./shared-client-PRyuKgvm.js");
	return await sharedClientModulePromise;
};
/** Returns a leased shared client so startup can release ownership explicitly. */
const defaultLeasedCodexAppServerClientFactory = (startOptions, authProfileId, agentDir, config, options) => loadSharedClientModule().then(({ getLeasedSharedCodexAppServerClient }) => getLeasedSharedCodexAppServerClient({
	startOptions,
	authProfileId,
	agentDir,
	config,
	onStartedClient: options?.onStartedClient,
	abandonSignal: options?.abandonSignal,
	timeoutMs: options?.timeoutMs
}));
//#endregion
export { defaultLeasedCodexAppServerClientFactory as t };
