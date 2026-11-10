import { Fn as object, Jn as string, Pn as number, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { t as agentsApiExecutorBindingSchema } from "./agentsapi-executor-binding-DQMt0WQ-.mjs";
//#region extensions/agentsapi/agentsapi-binding-record.ts
const bindingSchema = object({
	sessionId: string().min(1),
	configFingerprint: string().min(1),
	executorControllerPluginId: string().min(1).optional(),
	executor: agentsApiExecutorBindingSchema.optional()
}).refine((row) => !row.executor || row.executor.nativeSessionId === row.sessionId && row.executorControllerPluginId !== void 0);
const storedBindingSchema = strictObject({
	sessionId: string().min(1).optional(),
	configFingerprint: string().min(1).optional(),
	authFingerprint: string().regex(/^[a-f0-9]{64}$/).optional(),
	executorControllerPluginId: string().min(1).optional(),
	executor: agentsApiExecutorBindingSchema.optional(),
	lease: object({
		token: string().min(1),
		expiresAt: number().finite()
	}).optional()
}).refine((row) => row.sessionId === void 0 ? row.configFingerprint === void 0 && row.authFingerprint === void 0 : row.configFingerprint === void 0 !== (row.authFingerprint === void 0)).refine((row) => !row.authFingerprint || !row.executor && !row.executorControllerPluginId).refine((row) => !row.executor || row.executor.nativeSessionId === row.sessionId && row.executorControllerPluginId !== void 0);
function readRecord(raw) {
	if (raw && typeof raw === "object" && "executor" in raw && raw.executor && !("executorControllerPluginId" in raw)) throw new Error("Agents API executor binding predates plugin ownership; retire this session with the previous version before upgrading");
	const result = storedBindingSchema.safeParse(raw);
	return result.success ? result.data : void 0;
}
//#endregion
export { readRecord as n, bindingSchema as t };
