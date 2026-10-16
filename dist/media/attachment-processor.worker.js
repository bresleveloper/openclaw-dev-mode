import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import { r as prepareAttachment } from "../attachment-processor.runtime-DJAGA9Eg.mjs";
//#region src/media/attachment-processor.worker.ts
serveWorkerTasks((input) => prepareAttachment(input), { transferList: (reply) => reply.buffer ? [reply.buffer.buffer] : [] });
//#endregion
export {};
