import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { t as findCrabboxBinary } from "../../crabbox-binary-BMI8aWfR.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../logging-core-CsXmxYo2.mjs";
import { t as createPluginRuntimeStore } from "../../runtime-store-pFaG-6b2.mjs";
import { f as runCrabboxProcess } from "../../crabbox-worker-command-BA1LZN18.mjs";
import { i as createCrabboxMachineCatalogResolver, r as loadCrabboxConfigShow } from "../../crabbox-worker-preflight-DthjGyWm.mjs";
//#region extensions/crabbox/src/crabbox-worker-profile-suggestion.ts
const STANDARD_CLASSES = [
	"tiny",
	"small",
	"standard",
	"fast",
	"large",
	"beast"
];
function createCrabboxProfileSuggestionDiscovery(dependencies) {
	const runCommand = dependencies.runCommand ?? runCrabboxProcess;
	let cached;
	const discover = async () => {
		const binary = dependencies.findBinary ? dependencies.findBinary() : findCrabboxBinary({ pathEnv: process.env.PATH });
		if (!binary) return;
		const config = await loadCrabboxConfigShow({
			binary,
			runCommand
		});
		if (!isRecord(config) || config.providerSelected !== true) return;
		const provider = normalizeOptionalString(config.provider)?.toLowerCase();
		if (!provider) return;
		if (normalizeOptionalString(config.coordinator)) {
			if (config.brokerAuth !== "configured" && config.brokerAuth !== "command") return;
		} else {
			const statuses = isRecord(config.providerStatus) ? config.providerStatus.providers : void 0;
			const selected = isRecord(statuses) ? statuses[provider] : void 0;
			const configuration = isRecord(selected) ? selected.configuration : void 0;
			if (!isRecord(configuration) || configuration.state !== "explicit") return;
		}
		const catalog = await createCrabboxMachineCatalogResolver({
			resolveBinary: async () => binary,
			runCommand,
			warn: dependencies.warn
		})(provider);
		const machineClass = STANDARD_CLASSES.find((candidate) => catalog?.machines.some((machine) => machine.os === "linux" && machine.class === candidate));
		if (!machineClass) return;
		return {
			id: "cloud",
			providerDisplayId: provider,
			profile: {
				provider: "crabbox",
				install: "bundle",
				suspendAfter: "45m",
				settings: {
					provider,
					target: "linux",
					class: machineClass,
					ttl: "4h",
					idleTimeout: "45m",
					warmImage: true
				}
			}
		};
	};
	return ({ refresh }) => {
		if (refresh || !cached) cached = discover().catch((error) => {
			dependencies.warn(`Crabbox profile discovery unavailable: ${String(error)}`);
		});
		return cached;
	};
}
//#endregion
//#region extensions/crabbox/worker-profile-api.ts
const discovery = createPluginRuntimeStore({
	key: "crabbox:worker-profile-discovery",
	errorMessage: "Crabbox profile discovery has not initialized"
});
const discoverWorkerProfile = (params) => {
	let resolve = discovery.tryGetRuntime();
	if (!resolve) {
		const log = createSubsystemLogger("crabbox");
		resolve = createCrabboxProfileSuggestionDiscovery({ warn: (message) => log.warn(message) });
		discovery.setRuntime(resolve);
	}
	return resolve(params);
};
//#endregion
export { discoverWorkerProfile };
