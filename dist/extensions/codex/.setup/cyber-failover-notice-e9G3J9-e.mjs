import { t as emitCodexAppServerEvent } from "./run-attempt-lifecycle-B7JbY4-F.mjs";
//#region extensions/codex/src/app-server/cyber-failover-notice.ts
async function emitCodexCyberNotice(params, notice) {
	await emitCodexAppServerEvent(params, {
		stream: "notice",
		data: {
			phase: "provider_policy",
			category: "cyber",
			state: notice.state,
			provider: "openai",
			...notice.model ? { model: notice.model } : {},
			fallbackModel: notice.fallbackModel
		}
	});
}
//#endregion
export { emitCodexCyberNotice };
