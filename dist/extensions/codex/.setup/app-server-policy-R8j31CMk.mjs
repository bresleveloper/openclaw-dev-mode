import { n as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-DEC5R1wk.mjs";
//#region extensions/codex/src/app-server/app-server-policy.ts
function resolveCodexAppServerForModelProvider(params) {
	return params.appServer.approvalsReviewer === "user" || canUseCodexModelBackedApprovalsReviewerForModel({
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
	}) ? params.appServer : {
		...params.appServer,
		approvalsReviewer: "user"
	};
}
//#endregion
export { resolveCodexAppServerForModelProvider as t };
