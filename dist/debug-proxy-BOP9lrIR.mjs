import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as debugProxyCliCommandSchema } from "./cli-contract-Di9ABGhz.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
//#region src/gateway/server-methods/debug-proxy.ts
const requestSchema = object({
	expectedOwnerId: string().min(1),
	command: debugProxyCliCommandSchema
}).strict();
const debugProxyHandlers = { "debugProxy.capture": async (options) => {
	const parsed = requestSchema.safeParse(options.params);
	if (!parsed.success) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, parsed.error.message));
		return;
	}
	let assertCurrent;
	try {
		assertCurrent = captureLocalStateMutationGuard(parsed.data.expectedOwnerId, options);
	} catch (error) {
		options.respond(false, void 0, localStateOwnerChangedError(error));
		return;
	}
	try {
		const result = await runOpenClawStateWorkerOperation(captureOpenClawStateWorkerContext(), (scope) => scope.execute({
			type: parsed.data.command.type,
			input: parsed.data.command.input
		}), {
			assertCurrent,
			signal: options.signal
		});
		options.respond(true, result ?? null);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
	}
} };
//#endregion
export { debugProxyHandlers };
