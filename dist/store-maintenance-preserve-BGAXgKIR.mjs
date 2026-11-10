import { n as SqliteSessionMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { L as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { a as resolveSessionMaintenancePreserveKeys, i as collectSessionWorkAdmissionKeysFromSnapshot, n as addSessionMaintenancePreserveKeys } from "./transcript-event-media-C4aKs47S.mjs";
import { c as collectActiveSessionLifecycleMutationIdentities, l as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(prepare) {
	const registration = { prepare };
	preserveKeysProviders.add(registration);
	return () => {
		preserveKeysProviders.delete(registration);
	};
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const keys = collectSessionWorkAdmissionKeysFromSnapshot(params.store, [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]);
	return keys.size > 0 ? keys : void 0;
}
/** Prepare storage-backed providers before workers acquire their transaction permit. */
async function prepareSessionMaintenancePreservation(storePath, options = {}) {
	const registrations = [...preserveKeysProviders];
	const prepared = [];
	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		for (const facts of prepared.toReversed()) facts.dispose();
	};
	const assertProvidersCurrent = () => {
		if (disposed) throw new Error("Session maintenance preparation was released");
		if (preserveKeysProviders.size !== registrations.length || registrations.some((registration) => !preserveKeysProviders.has(registration))) throw new SqliteSessionMutationConflictError("session maintenance");
	};
	try {
		for (const registration of registrations) {
			prepared.push(await registration.prepare(options));
			assertProvidersCurrent();
		}
		const capture = (sessionKeys) => {
			assertProvidersCurrent();
			const keys = /* @__PURE__ */ new Set();
			addSessionMaintenancePreserveKeys(keys, iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex()));
			for (const facts of prepared) {
				const values = sessionKeys !== void 0 && facts.refreshCandidates ? facts.refreshCandidates(sessionKeys) : facts.capture();
				addSessionMaintenancePreserveKeys(keys, values);
			}
			assertProvidersCurrent();
			return {
				providerKeys: [...keys].toSorted(),
				workIdentities: [...collectActiveSessionWorkAdmissions().get(storePath) ?? []].toSorted(),
				lifecycleIdentities: collectActiveSessionLifecycleMutationIdentities(storePath)
			};
		};
		return {
			dispose,
			capture: () => capture(),
			refreshCandidates: capture
		};
	} catch (error) {
		dispose();
		throw error;
	}
}
/** Collects runtime, active-work, and lifecycle keys protected from automatic maintenance. */
async function collectSessionMaintenancePreserveKeysForStore(params) {
	const prepared = await prepareSessionMaintenancePreservation(params.storePath);
	try {
		const keys = resolveSessionMaintenancePreserveKeys({
			...params,
			snapshot: prepared.capture()
		});
		return keys.size > 0 ? keys : void 0;
	} finally {
		prepared.dispose();
	}
}
//#endregion
export { registerSessionMaintenancePreserveKeysProvider as i, collectSessionMaintenancePreserveKeysForStore as n, prepareSessionMaintenancePreservation as r, collectActiveSessionWorkAdmissionKeys as t };
