import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { c as resolveApnsRelayConfigFromEnv, l as resolveApnsAuthConfigFromEnv } from "./push-apns-CQbSKavc.mjs";
//#region src/gateway/server-methods/node-push-transport.ts
async function resolveNodePushTransport(registration, cfg) {
	if (registration.transport === "relay") {
		const relay = resolveApnsRelayConfigFromEnv(process.env, (cfg ?? readRuntimeConfig()).gateway, { registrationRelayOrigin: registration.relayOrigin });
		return relay.ok ? {
			ok: true,
			transport: {
				registration,
				relayConfig: relay.value
			}
		} : {
			ok: false,
			error: relay.error
		};
	}
	const auth = await resolveApnsAuthConfigFromEnv(process.env);
	return auth.ok ? {
		ok: true,
		transport: {
			registration,
			auth: auth.value
		}
	} : {
		ok: false,
		error: auth.error
	};
}
//#endregion
export { resolveNodePushTransport as t };
