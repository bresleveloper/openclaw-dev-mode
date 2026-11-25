import { n as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-B-xRmWRi.mjs";
// extensions/codex/src/app-server/app-server-policy.ts
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
		homeScope: params.appServer.start.homeScope,
		codexArgs: params.appServer.start.args
	}) ? params.appServer : {
		...params.appServer,
		approvalsReviewer: "user"
	};
}
export { resolveCodexAppServerForModelProvider as t };
