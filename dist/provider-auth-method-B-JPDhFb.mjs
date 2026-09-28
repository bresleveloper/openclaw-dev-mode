import { n as openUrl } from "./browser-open-4uUcM1Wd.mjs";
import { t as isRemoteEnvironment } from "./remote-env-Dkn0ouel.mjs";
import { t as createVpsAwareOAuthHandlers } from "./provider-oauth-flow-DL7WaUgl.mjs";
//#region src/plugins/provider-auth-method.ts
async function runProviderPluginAuthMethodUnpersisted(params) {
	const openBrowser = params.openUrl ?? (async (url) => {
		if (params.prompter.openUrl) await params.prompter.openUrl(url);
		else if (params.isRemote !== true) await openUrl(url);
	});
	const authorize = params.browserAuthorization;
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	assertCurrent();
	const result = await params.method.run({
		config: params.config,
		credentialOnly: params.credentialOnly,
		assertCurrent,
		env: params.env,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		prompter: params.prompter,
		runtime: params.runtime,
		signal: params.signal,
		opts: params.opts,
		secretInputMode: params.secretInputMode,
		allowSecretRefPrompt: params.allowSecretRefPrompt,
		isRemote: params.isRemote ?? isRemoteEnvironment(),
		openUrl: openBrowser,
		oauth: {
			createVpsAwareHandlers: (options) => createVpsAwareOAuthHandlers(options),
			...authorize ? { authorize } : {}
		}
	});
	assertCurrent();
	return result;
}
//#endregion
export { runProviderPluginAuthMethodUnpersisted as t };
