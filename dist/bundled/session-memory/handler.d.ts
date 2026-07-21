import { t as HookHandler } from "../../hooks-GKcLmVjU.js";

//#region src/hooks/bundled/session-memory/handler.d.ts
declare function flushSessionMemoryWritesForTest(): Promise<void>;
declare const saveSessionToMemory: HookHandler;
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };