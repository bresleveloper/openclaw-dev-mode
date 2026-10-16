import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
//#region extensions/agentsapi/agentsapi-binding-record.ts
const bindingSchema = object({
	sessionId: string().min(1),
	configFingerprint: string().min(1)
});
const storedBindingSchema = object({
	sessionId: string().min(1).optional(),
	configFingerprint: string().min(1).optional(),
	lease: object({
		token: string().min(1),
		expiresAt: number().finite()
	}).optional()
}).refine((row) => row.sessionId === void 0 === (row.configFingerprint === void 0));
function readRecord(raw) {
	const result = storedBindingSchema.safeParse(raw);
	return result.success ? result.data : void 0;
}
//#endregion
export { readRecord as n, bindingSchema as t };
