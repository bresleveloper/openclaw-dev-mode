//#region src/plugins/capability-lease.ts
function createPluginRuntimeCapabilityLease(owner) {
	let active = true;
	const cleanups = /* @__PURE__ */ new Set();
	const assertActive = (capability) => {
		if (!active) throw new Error(`${owner} ${capability} is no longer active`);
	};
	const retain = (cleanup) => {
		if (!active) {
			cleanup();
			assertActive("capability lease");
		}
		const release = () => {
			if (cleanups.delete(release)) cleanup();
		};
		cleanups.add(release);
		return release;
	};
	return {
		isActive: () => active,
		assertActive,
		retain,
		revoke: () => {
			if (!active) return;
			active = false;
			for (const cleanup of cleanups) cleanup();
		}
	};
}
//#endregion
export { createPluginRuntimeCapabilityLease as t };
