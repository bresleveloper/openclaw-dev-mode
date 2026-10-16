import { Fn as object, Jn as string, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as decodeWorkerRequest } from "./protocol-record-CQCXx-YV.mjs";
//#region src/worker/node-workspace-prepared-protocol.ts
const Identifier = string().min(1).max(256).refine((value) => value.trim() === value && !value.includes("\0"));
const Identity = object({
	gatewayNamespace: Identifier.regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u),
	environmentId: Identifier,
	preparationKey: string().regex(/^[a-f0-9]{64}$/u),
	cacheKey: string().regex(/^[a-f0-9]{64}$/u)
});
const WorkspacePath = string().min(1).max(4096).refine((value) => !value.includes("\0"));
const Paths = object({
	workspaceDir: WorkspacePath,
	homeDir: WorkspacePath,
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
	const value = decodeWorkerRequest(raw, 16384, "prepared workspace");
	const parsed = Input.safeParse(value);
	if (!parsed.success) throw new Error("INVALID_REQUEST: invalid prepared workspace request");
	return parsed.data;
}
function parseNodeWorkerPreparedWorkspaceResult(value) {
	return Result.safeParse(value).data;
}
//#endregion
export { parseNodeWorkerPreparedWorkspaceResult as n, parseNodeWorkerPreparedWorkspaceInput as t };
