import { n as zaloDmPolicy, r as zaloSetupAdapter, t as createZaloSetupWizardProxy } from "./.setup/setup-core-BE-EaCnS.mjs";
import { n as resolveZaloRuntimeGroupPolicy } from "./.setup/group-access-Blsyu-ot.mjs";
import { loadBundledEntryExportSync } from "openclaw/plugin-sdk/channel-entry-contract";
//#region extensions/zalo/setup-api.ts
function createLazyObjectValue(load) {
	return new Proxy({}, {
		get(_target, property, receiver) {
			return Reflect.get(load(), property, receiver);
		},
		has(_target, property) {
			return property in load();
		},
		ownKeys() {
			return Reflect.ownKeys(load());
		},
		getOwnPropertyDescriptor(_target, property) {
			const descriptor = Object.getOwnPropertyDescriptor(load(), property);
			return descriptor ? {
				...descriptor,
				configurable: true
			} : void 0;
		}
	});
}
function loadSetupSurfaceModule() {
	return loadBundledEntryExportSync(import.meta.url, { specifier: "./setup-surface.js" });
}
const zaloSetupWizard = createLazyObjectValue(() => loadSetupSurfaceModule().zaloSetupWizard);
//#endregion
export { createZaloSetupWizardProxy, resolveZaloRuntimeGroupPolicy, zaloDmPolicy, zaloSetupAdapter, zaloSetupWizard };
