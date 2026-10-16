import { v as isWorkerFrameWithinBudget } from "./worker-protocol-primitives-BajTgPT4.mjs";
//#region packages/gateway-protocol/src/worker-transcript-budget.ts
function isWorkerTranscriptFrameWithinBudget(frame) {
	return isWorkerFrameWithinBudget(frame, () => frame.params.messages.flatMap(({ content }) => content.flatMap((part) => part.type === "image" ? [part.data] : [])));
}
//#endregion
export { isWorkerTranscriptFrameWithinBudget as t };
