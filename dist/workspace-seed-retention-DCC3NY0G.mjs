//#region src/worker/workspace-seed-retention.ts
const WORKSPACE_SEED_RETENTION = {
	maxEntries: 6,
	maxAgeMs: 2592e6,
	temporaryMaxAgeMs: 36e5
};
/** Self-contained so project preparation can embed it before any worker runtime is installed. */
function selectWorkspaceSeedsToPrune(entries, policy, now, preserveKey) {
	const newest = entries.filter((entry) => /^(?:[a-f0-9]{64}|\.tmp-[a-f0-9]{64}-.+)$/u.test(entry.name)).toSorted((left, right) => right.mtimeMs - left.mtimeMs || left.name.localeCompare(right.name));
	let retained = newest.some((entry) => entry.name === preserveKey) ? 1 : 0;
	return newest.filter((entry) => {
		if (entry.name === preserveKey) return false;
		const temporary = entry.name.startsWith(".tmp-");
		return now - entry.mtimeMs > (temporary ? policy.temporaryMaxAgeMs : policy.maxAgeMs) || !temporary && ++retained > policy.maxEntries;
	});
}
//#endregion
export { selectWorkspaceSeedsToPrune as n, WORKSPACE_SEED_RETENTION as t };
