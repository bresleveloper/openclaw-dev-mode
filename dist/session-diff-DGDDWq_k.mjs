import { n as runGitReadOperation } from "./git-read-cache-D-dVASTK.mjs";
//#region src/sessions/session-diff.ts
async function loadCheckoutDiff(params) {
	const { sessionKey, ...input } = params;
	return {
		...await runGitReadOperation({
			type: "checkout.diff",
			input
		}),
		sessionKey
	};
}
async function captureSessionDiffBaseline(params) {
	const baseline = await runGitReadOperation({
		type: "checkout.baseline",
		input: { cwd: params.cwd }
	});
	return baseline ? {
		...baseline,
		sessionId: params.sessionId
	} : void 0;
}
//#endregion
export { loadCheckoutDiff as n, captureSessionDiffBaseline as t };
