//#region src/cli/capability-cli/media-understanding-result.ts
function isMissingMediaUnderstandingProvider(result) {
	const decision = result.decision;
	return decision?.outcome === "skipped" && decision.attachments.length > 0 && decision.attachments.every((attachment) => attachment.attempts.length === 0);
}
//#endregion
export { isMissingMediaUnderstandingProvider as t };
