import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as invokeNativeHookRelay } from "./native-hook-relay-lrqqdj9O.mjs";
//#region src/gateway/server-methods/native-hook-relay.ts
/** Gateway request handlers for invoking registered native hook relays. */
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
