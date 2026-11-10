import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import path from "node:path";
//#region extensions/agentsapi/agentsapi-executor-binding.ts
const agentsApiExecutorBindingSchema = object({
	workspaceDirectory: string().min(1).refine((value) => path.posix.isAbsolute(value) || path.win32.isAbsolute(value)),
	sessionKey: string().min(1),
	agentId: string().min(1),
	nativeSessionId: string().min(1),
	environmentId: string().min(1),
	remoteUrl: string().min(1)
});
//#endregion
export { agentsApiExecutorBindingSchema as t };
