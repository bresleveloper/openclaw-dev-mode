import "./sqlite-wal-D2XTertL.mjs";
import "./sqlite-strict-CTENSqnV.mjs";
import { n as capturePluginStateNativeBindingStore } from "./plugin-state-store.native-binding-77crF_5Y.mjs";
//#region src/plugin-sdk/plugin-state-runtime.ts
/**
* Runtime SDK type surface for plugin-scoped keyed state stores.
*/
function createPluginStateErrorReporter(getRuntime, plugin, feature, message, formatError = (error) => ({ error: String(error) })) {
	return (error) => {
		try {
			getRuntime()?.logging.getChildLogger({
				plugin,
				feature
			}).warn(message, formatError(error));
		} catch {}
	};
}
/** Pin an owner-published read for a final effect guard; custom stores retain their own reader. */
async function preparePluginStateRead(store, key) {
	const binding = capturePluginStateNativeBindingStore(store);
	if (!binding) return;
	const [{ capturePluginStateNativeBindingFacts }, { validateKey }] = await Promise.all([import("./plugin-state-native-binding-facts-CWeZOsQS.mjs"), import("./plugin-state-store.validation-b-BoGAHi.mjs")]);
	const facts = await capturePluginStateNativeBindingFacts(binding, validateKey(key, "lookup"), true);
	return {
		read: () => facts.read(),
		release: () => facts.release()
	};
}
/** Deny pending or unknown owner writes before a retained synchronous effect guard reads. */
function assertPluginStateReadAvailable(store) {
	capturePluginStateNativeBindingStore(store)?.assertReadable();
}
//#endregion
export { createPluginStateErrorReporter as n, preparePluginStateRead as r, assertPluginStateReadAvailable as t };
