import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-diff-baseline-capture.ts
function createSessionDiffBaselineCaptureClaim() {
	return {
		version: 1,
		captureId: randomUUID(),
		status: "pending"
	};
}
//#endregion
export { createSessionDiffBaselineCaptureClaim as t };
