import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as invokeNativeHookRelay } from "./native-hook-relay-CCP-M3P6.mjs";
//#region src/gateway/server-methods/native-hook-relay.ts
const nativeHookRelayHandlers = { "nativeHook.invoke": async ({ params, respond, client }) => {
	try {
		respond(true, await invokeNativeHookRelay({
			provider: params.provider,
			relayId: params.relayId,
			generation: params.generation,
			event: params.event,
			rawPayload: params.rawPayload,
			requireGeneration: true
		}, client?.connectionSignal));
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "native hook relay failed"));
	}
} };
//#endregion
export { nativeHookRelayHandlers };
