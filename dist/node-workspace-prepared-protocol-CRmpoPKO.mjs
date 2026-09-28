import { Fn as object, Jn as string, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/worker/node-workspace-prepared-protocol.ts
const Identifier = string().min(1).max(256).refine((value) => value.trim() === value && !value.includes("\0"));
const Identity = object({
	gatewayNamespace: Identifier.regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u),
	environmentId: Identifier,
	preparationKey: string().regex(/^[a-f0-9]{64}$/u),
	cacheKey: string().regex(/^[a-f0-9]{64}$/u)
});
const Paths = object({
	workspaceDir: string().min(1).max(4096).refine((value) => !value.includes("\0")),
	homeDir: string().min(1).max(4096).refine((value) => !value.includes("\0")),
	sourceManifestRef: string().regex(/^sha256:[a-f0-9]{64}$/u),
	preparedManifestRef: string().regex(/^sha256:[a-f0-9]{64}$/u)
});
const Registration = Identity.extend({
	action: literal("register"),
	...Paths.shape
}).strict();
const Binding = Identity.extend({
	action: literal("bind"),
	sessionId: Identifier,
	sessionKey: string().min(1).max(1024).refine((value) => value.trim() === value && !value.includes("\0")),
	ownerEpoch: number().int().min(1).max(Number.MAX_SAFE_INTEGER)
}).strict();
const Input = discriminatedUnion("action", [Registration, Binding]);
const Result = Identity.extend(Paths.shape).strict();
function parseNodeWorkerPreparedWorkspaceInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > 16384) throw new Error("INVALID_REQUEST: invalid prepared workspace request");
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed prepared workspace request");
	}
	const parsed = Input.safeParse(value);
	if (!parsed.success) throw new Error("INVALID_REQUEST: invalid prepared workspace request");
	return parsed.data;
}
function parseNodeWorkerPreparedWorkspaceResult(value) {
	const parsed = Result.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
//#endregion
export { parseNodeWorkerPreparedWorkspaceResult as n, parseNodeWorkerPreparedWorkspaceInput as t };
