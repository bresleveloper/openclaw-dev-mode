//#region src/state/user-profile-authority.ts
/** Cells belong to the canonical profile writer; delivery never grants or revives authority. */
function readProfileAuthority(descriptor) {
	const generation = new Int32Array(descriptor.generation);
	const lifetime = new BigInt64Array(descriptor.lifetime.revision);
	if (Atomics.load(lifetime, 0) !== descriptor.lifetime.epoch || Atomics.load(generation, 0) !== 1) return "revoked";
	const publication = Atomics.load(generation, 1);
	if (publication % 2 !== 0) return "pending";
	let status = "current";
	for (const entry of descriptor.entries) {
		const cell = new Int32Array(entry.state);
		const current = Atomics.load(cell, 0);
		const state = Atomics.load(cell, 1);
		if (entry.revision !== void 0 && current !== entry.revision) status = "revoked";
		else if (state === 2 && status !== "revoked") status = "uncertain";
		else if (state === 1 && status === "current") status = "pending";
		else if (state !== 0 && state !== 1 && state !== 2) status = "revoked";
	}
	if (Atomics.load(lifetime, 0) !== descriptor.lifetime.epoch || Atomics.load(generation, 0) !== 1) return "revoked";
	return Atomics.load(generation, 1) === publication ? status : "pending";
}
//#endregion
export { readProfileAuthority as t };
