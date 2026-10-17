import { r as getRuntimeConfig, t as captureRuntimeConfigAsyncReader } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { u as resolveMaintenanceConfigFromInput } from "./store-maintenance-CGOlSbiV.mjs";
import { a as collectActiveSessionLifecycleMutationIdentities, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { n as collectSessionWorkAdmissionKeysFromSnapshot, r as resolveSessionMaintenancePreserveKeys, t as addSessionMaintenancePreserveKeys } from "./store-maintenance-preserve-snapshot-Bc3JacvP.mjs";
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Map();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider, prepare) {
	preserveKeysProviders.set(provider, { prepare });
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders.keys()) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const keys = collectSessionWorkAdmissionKeysFromSnapshot(params.store, [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]);
	return keys.size > 0 ? keys : void 0;
}
/** Capture live parent owners before dispatch; no protection registry is copied into the worker. */
function captureSessionMaintenancePreservation(storePath) {
	return {
		providerKeys: [...collectSessionMaintenancePreserveKeys() ?? []].toSorted(),
		workIdentities: [...collectActiveSessionWorkAdmissions().get(storePath) ?? []].toSorted(),
		lifecycleIdentities: collectActiveSessionLifecycleMutationIdentities(storePath)
	};
}
/** Prepare storage-backed providers before workers acquire their transaction permit. */
async function prepareSessionMaintenancePreservation(storePath) {
	const registrations = [...preserveKeysProviders];
	const prepared = [];
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		for (const { facts } of prepared.toReversed()) facts?.dispose();
	};
	const assertProvidersCurrent = () => {
		if (disposed) throw new Error("Session maintenance preparation was released");
		if (preserveKeysProviders.size !== registrations.length || registrations.some(([provider, registration]) => preserveKeysProviders.get(provider) !== registration)) throw new Error("Session maintenance providers changed during preparation");
	};
	try {
		for (const [provider, registration] of registrations) {
			prepared.push({
				provider,
				facts: registration.prepare ? await registration.prepare() : void 0
			});
			assertProvidersCurrent();
		}
		const bases = prepared.flatMap(({ facts }) => facts?.subagentRunBasis ? [facts.subagentRunBasis] : []);
		if (bases.length > 1) throw new Error("Session maintenance has competing subagent registry providers");
		return {
			subagentRunBasis: bases[0],
			dispose,
			capture() {
				assertProvidersCurrent();
				const keys = /* @__PURE__ */ new Set();
				for (const { provider, facts } of prepared) addSessionMaintenancePreserveKeys(keys, facts ? facts.capture() : provider());
				assertProvidersCurrent();
				return {
					providerKeys: [...keys].toSorted(),
					workIdentities: [...collectActiveSessionWorkAdmissions().get(storePath) ?? []].toSorted(),
					lifecycleIdentities: collectActiveSessionLifecycleMutationIdentities(storePath)
				};
			}
		};
	} catch (error) {
		dispose();
		throw error;
	}
}
/** Collects runtime, active-work, and lifecycle keys protected from automatic maintenance. */
function collectSessionMaintenancePreserveKeysForStore(params) {
	const keys = resolveSessionMaintenancePreserveKeys({
		...params,
		snapshot: captureSessionMaintenancePreservation(params.storePath)
	});
	return keys.size > 0 ? keys : void 0;
}
//#endregion
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = getRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
/** Use the canonical runtime policy even when a caller supplies only routing config. */
function captureMaintenanceConfigAsyncReader(assertCallerCurrent) {
	const read = captureRuntimeConfigAsyncReader({ assertCurrent: assertCallerCurrent });
	return Object.assign(async () => {
		let maintenance;
		try {
			maintenance = (await read()).session?.maintenance;
		} catch {
			read.assertCurrent();
		}
		read.assertCurrent();
		return resolveMaintenanceConfigFromInput(maintenance);
	}, { assertCurrent: read.assertCurrent });
}
//#endregion
export { collectSessionMaintenancePreserveKeysForStore as a, collectActiveSessionWorkAdmissionKeys as i, resolveMaintenanceConfig as n, prepareSessionMaintenancePreservation as o, captureSessionMaintenancePreservation as r, registerSessionMaintenancePreserveKeysProvider as s, captureMaintenanceConfigAsyncReader as t };
