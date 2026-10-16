import { compileFunction } from "node:vm";
//#region src/worker/workspace-seed-retention.ts
const WORKSPACE_SEED_RETENTION = {
	maxEntries: 6,
	maxAgeMs: 2592e6,
	temporaryMaxAgeMs: 36e5
};
const WORKSPACE_SEED_RETENTION_JS = String.raw`
function selectWorkspaceSeedsToPrune(entries, policy, now, preserveKey) {
  const newest = entries
    .filter((entry) => /^(?:[a-f0-9]{64}|\.tmp-[a-f0-9]{64}-.+)$/u.test(entry.name))
    .toSorted((left, right) => right.mtimeMs - left.mtimeMs || left.name.localeCompare(right.name));
  // Reserve a slot for the just-prepared seed even when another entry's clock is ahead.
  let retained = newest.some((entry) => entry.name === preserveKey) ? 1 : 0;
  return newest.filter((entry) => {
    if (entry.name === preserveKey) {
      return false;
    }
    const temporary = entry.name.startsWith(".tmp-");
    return (
      now - entry.mtimeMs > (temporary ? policy.temporaryMaxAgeMs : policy.maxAgeMs) ||
      (!temporary && ++retained > policy.maxEntries)
    );
  });
}`;
const selectWorkspaceSeedsToPrune = compileFunction(`${WORKSPACE_SEED_RETENTION_JS}\nreturn selectWorkspaceSeedsToPrune;`)();
//#endregion
export { WORKSPACE_SEED_RETENTION_JS as n, selectWorkspaceSeedsToPrune as r, WORKSPACE_SEED_RETENTION as t };
