import { r as getLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-Bm9V3G-F.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { f as getPluginRegistryInspectionResources } from "./registry-BKkCbmgx.mjs";
//#region src/plugins/legacy-sdk-provider-projection.ts
/** One selection checks source admission; adopted host views retain their exact consumers. */
function createLegacyPluginSdkProviderProjection() {
	let host;
	const selected = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	return {
		select(registry) {
			const source = registry && getPluginRegistryInspectionResources(registry);
			if (!registry || !source) return;
			host ??= getLegacyPluginSdkResourceHost();
			host.assertOpen();
			let projection = selected.get(source);
			if (!projection) {
				const physical = source.retain();
				const owner = host;
				projection = owner.getProviderProjection(source, () => {
					const consumers = /* @__PURE__ */ new Map();
					let references = 0;
					const shared = {
						retain(claim) {
							references++;
							let released;
							return { release: () => {
								if (!released) {
									if (--references === 0) {
										consumers.forEach((consumer) => consumer.release());
										consumers.clear();
										owner.forgetProviderProjection(source, shared);
									}
									released = claim.release();
								}
								return released;
							} };
						},
						project(provider, instance) {
							owner.assertOpen();
							if (!instance) return provider;
							let consumer = consumers.get(instance);
							if (!consumer) {
								consumer = instance.retainConsumer((run) => owner.invoke(run));
								consumers.set(instance, consumer);
							}
							const retained = consumer;
							return retained.run(() => retained.wrap(provider));
						}
					};
					return shared;
				});
				pending.set(source, projection.retain(physical));
				selected.set(source, projection);
			}
			const retained = projection;
			return (provider, pluginId) => {
				const record = registry.plugins.find((entry) => entry.id === pluginId);
				return retained.project(provider, record && getPluginInstance(record));
			};
		},
		adopt() {
			host?.assertOpen();
			for (const [source, claim] of pending) {
				host.adopt(source, claim);
				pending.delete(source);
			}
		},
		[Symbol.dispose]() {
			const claims = [...pending.values()];
			pending.clear();
			for (const claim of claims) host.releaseClaim(claim);
		}
	};
}
//#endregion
export { createLegacyPluginSdkProviderProjection as t };
