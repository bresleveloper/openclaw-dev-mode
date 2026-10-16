import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { g as resolveApnsRelayConfigFromEnv } from "./push-apns-store-BNQPyh4x.mjs";
import { c as resolveApnsAuthConfigFromEnv } from "./push-apns-DWV7vQst.mjs";
//#region src/gateway/server-methods/node-push-transport.ts
async function resolveNodePushTransport(registration, cfg) {
	if (registration.transport === "relay") {
		const relay = resolveApnsRelayConfigFromEnv(process.env, (cfg ?? getRuntimeConfig()).gateway, { registrationRelayOrigin: registration.relayOrigin });
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
