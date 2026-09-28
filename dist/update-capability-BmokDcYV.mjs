import { t as GATEWAY_UPDATE_EXECUTOR_CONTRACT } from "./service-update-authority-DujRnzx9.mjs";
import { finished } from "node:stream/promises";
//#region src/cli/daemon-cli/update-capability.ts
async function writeGatewayServiceUpdateCapability() {
	process.stdout.write(JSON.stringify({
		updateExecutor: GATEWAY_UPDATE_EXECUTOR_CONTRACT,
		targetRootBinding: true,
		definitionBackup: true,
		retainedOwnerBinding: true,
		originalDefinitionBinding: true,
		originalRuntimePinBinding: true
	}));
	await finished(process.stdin.resume(), { cleanup: true });
}
/** The updater's machine probe must return before capture or config can open live state. */
async function tryRunGatewayServiceUpdateCapabilityProbe(argv) {
	const [primary, action, ...options] = argv.slice(2);
	if (primary !== "gateway" && primary !== "daemon" || action !== "install" && action !== "restart" && action !== "stop") return false;
	const probe = options.slice(options[0] === "--json" ? 1 : 0, options.at(-1) === "--json" ? -1 : void 0);
	if (!(probe.length === 2 && probe[0] === "--update-executor" && probe[1] === "check" || probe.length === 1 && probe[0] === "--update-executor=check")) return false;
	await writeGatewayServiceUpdateCapability();
	return true;
}
//#endregion
export { writeGatewayServiceUpdateCapability as n, tryRunGatewayServiceUpdateCapabilityProbe as t };
