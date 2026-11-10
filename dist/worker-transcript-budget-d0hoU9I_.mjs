import { v as isWorkerFrameWithinBudget } from "./worker-protocol-primitives-wrWgxYRD.mjs";
//#region packages/gateway-protocol/src/worker-transcript-budget.ts
function isWorkerTranscriptFrameWithinBudget(frame) {
	return isWorkerFrameWithinBudget(frame, () => frame.params.messages.flatMap(({ content }) => typeof content === "string" ? [] : content.flatMap((part) => part.type === "image" ? [part.data] : [])));
}
//#endregion
export { isWorkerTranscriptFrameWithinBudget as t };
