import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
//#region extensions/bonjour/index.ts
function formatBonjourInstanceName(displayName) {
	const trimmed = displayName.trim();
	if (!trimmed) return "OpenClaw";
	if (/openclaw/i.test(trimmed)) return trimmed;
	return `${trimmed} (OpenClaw)`;
}
var bonjour_default = definePluginEntry({
	id: "bonjour",
	name: "Bonjour Gateway Discovery",
	description: "Advertise the local OpenClaw gateway over Bonjour/mDNS.",
	register(api) {
		api.registerGatewayDiscoveryService({
			id: "bonjour",
			advertise: async (ctx) => {
				const [{ startGatewayBonjourAdvertiser }, { registerUncaughtExceptionHandler, registerUnhandledRejectionHandler }] = await Promise.all([import("../../advertiser-C86ADcfa.mjs"), import("../../plugin-sdk/runtime.js")]);
				return startGatewayBonjourAdvertiser({
					instanceName: formatBonjourInstanceName(ctx.machineDisplayName),
					gatewayPort: ctx.gatewayPort,
					gatewayTlsEnabled: ctx.gatewayTlsEnabled,
					gatewayTlsFingerprintSha256: ctx.gatewayTlsFingerprintSha256,
					gatewayDirectReachable: ctx.gatewayDirectReachable,
					sshPort: ctx.sshPort,
					tailnetDns: ctx.tailnetDns,
					cliPath: ctx.cliPath,
					minimal: ctx.minimal
				}, {
					logger: api.logger,
					registerUncaughtExceptionHandler,
					registerUnhandledRejectionHandler
				});
			}
		});
	}
});
//#endregion
export { bonjour_default as default };
