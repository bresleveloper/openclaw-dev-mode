import { r as parseStoredJson } from "./plugin-state-error-Wxkh7e3f.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as pluginStatePublication, o as pluginStatePublicationKey, t as assertPluginStatePublicationSettled } from "./plugin-state-publication-CI0IKkN0.mjs";
import { S as readCommittedPluginStateObservationCache, g as observePluginStateRowInWorker } from "./plugin-state-worker-client-S8ldxtrq.mjs";
//#region src/plugin-state/plugin-state-native-binding-facts.ts
/** One held native lease pins its committed row until settlement, independently of the read LRU. */
async function capturePluginStateNativeBindingFacts(store, key, authority = false) {
	const { options } = store;
	const context = captureOpenClawStateWorkerContext({ env: options.env });
	const identity = () => context.admission.identity.key;
	const scope = {
		pluginId: options.pluginId,
		namespace: options.namespace,
		key
	};
	const entryKey = pluginStatePublicationKey({
		plugin_id: scope.pluginId,
		namespace: scope.namespace,
		entry_key: key
	});
	let active = true;
	let loaded = false;
	let row;
	let unavailable = false;
	const stop = pluginStatePublication.subscribeFacts((change) => {
		if (change.kind === "unknown" && change.identity === identity()) unavailable = true;
		else if (change.kind === "committed" && change.receipt.source.identity === identity()) {
			const fact = change.receipt.facts.get(entryKey);
			if (fact?.kind === "unknown") unavailable = true;
			else if (fact) {
				row = fact.kind === "postimage" ? fact.value : void 0;
				loaded = true;
			}
		}
	});
	const release = () => {
		active = false;
		row = void 0;
		stop();
	};
	const load = async () => {
		if (!active || unavailable) throw new Error("Native binding committed state is unavailable");
		loaded = false;
		row = void 0;
		const observation = await observePluginStateRowInWorker({
			...scope,
			env: options.env,
			context,
			assertActive: store.assertCurrent,
			sessionEntryCurrent: store.sessionEntryCurrent
		});
		if (!loaded) {
			const observed = readCommittedPluginStateObservationCache(identity(), scope);
			row = observed ? observed.row : observation.row;
			loaded = true;
		}
		if (!active || !loaded || unavailable) throw new Error("Native binding committed state is unavailable");
	};
	try {
		if (authority) assertPluginStatePublicationSettled(identity());
		const cached = readCommittedPluginStateObservationCache(identity(), scope);
		if (cached) {
			row = cached.row;
			loaded = true;
		} else await load();
		return {
			read() {
				if (!active || !loaded || unavailable) throw new Error("Native binding committed state is unavailable");
				if (authority) {
					assertPluginStatePublicationSettled(identity());
					store.assertCurrent?.();
				}
				(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
				return row && (row.expires_at == null || row.expires_at > Date.now()) ? parseStoredJson(row.value_json, "lookup", context.admission.databasePath) : void 0;
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { capturePluginStateNativeBindingFacts as t };
