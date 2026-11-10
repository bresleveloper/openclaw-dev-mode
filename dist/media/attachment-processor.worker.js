import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import { r as prepareAttachment } from "../attachment-processor.runtime-BGZ3ToVT.mjs";
//#region src/media/attachment-processor.worker.ts
serveWorkerTasks((input) => prepareAttachment(input), { transferList: (reply) => reply.buffer ? [reply.buffer.buffer] : [] });
//#endregion
export {};
