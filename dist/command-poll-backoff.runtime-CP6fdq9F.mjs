import { t as pruneStaleCommandPollsCore } from "./command-poll-backoff-C32T1x4y.mjs";
//#region src/agents/command-poll-backoff.runtime.ts
/**
* Runtime seam for command poll backoff cleanup.
*/
/** Prune stale command polls using the production backoff implementation. */
function pruneStaleCommandPolls(...args) {
	return pruneStaleCommandPollsCore(...args);
}
//#endregion
export { pruneStaleCommandPolls };
