import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./plugin-entry-D4OPnFRH.mjs";
import { c as runCrabboxCommand, n as crabboxCommandOutput, s as parseCrabboxJson } from "./crabbox-worker-command-BA1LZN18.mjs";
import { a as CRABBOX_MACHINE_CATALOG_TIMEOUT_MS, t as CRABBOX_CONFIG_TIMEOUT_MS } from "./crabbox-worker-timeouts-BzTVngvW.mjs";
import { f as parseCrabboxProfile, n as CRABBOX_OS_LABELS, s as listCrabboxMachineOptions, t as CRABBOX_ENROLLABLE_TARGETS } from "./crabbox-worker-profile-BWx5cVTt.mjs";
//#region extensions/crabbox/src/crabbox-worker-machine-options.ts
function parseCrabboxMachineShapes(stdout) {
	const parsed = JSON.parse(stdout);
	if (!Array.isArray(parsed)) throw new Error("Crabbox providers returned invalid JSON");
	return new Map(parsed.flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const provider = normalizeOptionalString(entry.provider)?.toLowerCase();
		if (!provider) return [];
		const targets = Array.isArray(entry.targets) ? entry.targets : [];
		const operatingSystems = CRABBOX_ENROLLABLE_TARGETS.filter((os) => targets.includes(os));
		const profiles = isRecord(entry.classCatalog) && entry.classCatalog.disposition === "mapped" && Array.isArray(entry.classCatalog.profiles) ? entry.classCatalog.profiles.filter(isRecord) : [];
		return [[provider, {
			operatingSystems,
			machines: operatingSystems.flatMap((os) => {
				const [target, windowsMode] = os.split("/");
				const matching = profiles.filter((raw) => raw.target === target && (windowsMode === void 0 || raw.windowsMode === windowsMode));
				const amd64 = matching.some((raw) => raw.architecture === "amd64");
				return matching.flatMap((raw) => {
					if (amd64 && raw.architecture !== "amd64" || !isRecord(raw.primary)) return [];
					const machineClass = normalizeOptionalString(raw.class);
					if (!machineClass) return [];
					const cpu = asPositiveSafeInteger(raw.primary.vcpu);
					const memory = raw.primary.memory;
					const memoryGb = isRecord(memory) && (memory.unit === "GB" || memory.unit === "GiB") ? asPositiveSafeInteger(memory.value) : void 0;
					return [{
						class: machineClass,
						os,
						...cpu ? { cpu } : {},
						...memoryGb ? { memoryGb } : {}
					}];
				});
			})
		}]];
	}));
}
function createCrabboxMachineCatalogResolver(dependencies) {
	const machineShapesByBinary = /* @__PURE__ */ new Map();
	const loadMachineShapes = async (binary) => {
		const result = await dependencies.runCommand([
			binary,
			"providers",
			"--json"
		], {
			maxOutputBytes: 1048576,
			killProcessTree: true,
			timeoutMs: CRABBOX_MACHINE_CATALOG_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error(`Crabbox providers command failed (${result.termination}, code ${result.code})`);
		return parseCrabboxMachineShapes(result.stdout);
	};
	return async (provider, explicitBinary) => {
		const binary = await dependencies.resolveBinary(explicitBinary);
		let shapes = machineShapesByBinary.get(binary);
		if (!shapes) {
			shapes = loadMachineShapes(binary).catch((error) => {
				machineShapesByBinary.delete(binary);
				dependencies.warn(`Crabbox machine shapes unavailable: ${coerceErrorMessage(error)}`);
				return /* @__PURE__ */ new Map();
			});
			machineShapesByBinary.set(binary, shapes);
		}
		return (await shapes).get(provider);
	};
}
function createCrabboxMachineOptionsResolver(dependencies) {
	const resolveMachineCatalog = createCrabboxMachineCatalogResolver(dependencies);
	const resolveCatalog = async (profile) => {
		const parsed = parseCrabboxProfile(profile);
		return {
			parsed,
			catalog: await resolveMachineCatalog(parsed.provider, parsed.binary)
		};
	};
	return {
		async listMachineOptions(profile) {
			const { parsed, catalog } = await resolveCatalog(profile);
			return listCrabboxMachineOptions(parsed.class, catalog?.machines);
		},
		async listOperatingSystems(profile) {
			const { parsed, catalog } = await resolveCatalog(profile);
			return (catalog?.operatingSystems ?? []).map((id) => {
				const label = CRABBOX_OS_LABELS[id];
				return id === parsed.target ? {
					id,
					label,
					default: true
				} : {
					id,
					label
				};
			});
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-preflight.ts
async function loadCrabboxConfigShow(params) {
	const result = await runCrabboxCommand({
		action: "config show",
		args: [
			"config",
			"show",
			"--json"
		],
		binary: params.binary,
		runCommand: params.runCommand,
		signal: params.signal,
		timeoutMs: CRABBOX_CONFIG_TIMEOUT_MS
	});
	return parseCrabboxJson(crabboxCommandOutput("config show", result), "config show");
}
async function assertAwsWorkerHasNoInstanceProfile(params) {
	const config = await loadCrabboxConfigShow(params);
	const instanceProfile = isRecord(config) && isRecord(config.aws) ? config.aws.instanceProfile : void 0;
	if (typeof instanceProfile !== "string") throw new WorkerProviderError("Crabbox config show returned an invalid AWS instance profile");
	if (normalizeOptionalString(instanceProfile)) throw new WorkerProviderError("Crabbox AWS instance profile must be empty for cloud workers");
}
async function assertHetznerDesktopHasManagedCoordinator(params) {
	const config = await loadCrabboxConfigShow(params);
	const view = isRecord(config) ? config : void 0;
	if (normalizeOptionalString(view?.coordinator) && view?.brokerMode === "managed") return;
	throw new Error("Crabbox Hetzner desktop profiles require a managed coordinator");
}
//#endregion
export { createCrabboxMachineOptionsResolver as a, createCrabboxMachineCatalogResolver as i, assertHetznerDesktopHasManagedCoordinator as n, loadCrabboxConfigShow as r, assertAwsWorkerHasNoInstanceProfile as t };
