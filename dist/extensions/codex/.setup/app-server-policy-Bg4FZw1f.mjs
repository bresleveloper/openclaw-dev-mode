import { n as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-0Gxk3_eq.mjs";
//#region extensions/codex/src/app-server/app-server-policy.ts
function resolveCodexAppServerForModelProvider(params) {
	if (params.appServer.approvalsReviewer === "user" || canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: params.provider,
		model: params.model,
		config: params.config,
		env: {
			...params.env ?? process.env,
			...params.appServer.start.env
		},
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope: params.appServer.start.homeScope,
		codexArgs: params.appServer.start.args
	})) return params.appServer;
	return {
		...params.appServer,
		approvalsReviewer: "user"
	};
}
//#endregion
export { resolveCodexAppServerForModelProvider as t };
