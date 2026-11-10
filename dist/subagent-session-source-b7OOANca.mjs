import { o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
//#region src/agents/subagents/spawn/subagent-session-source.ts
/** Retain the selected logical session; absence never creates a replacement owner. */
async function withSubagentSessionSource(input, consume) {
	const assertCurrent = () => input.assertCurrent?.();
	const source = await acquireSessionActorStorage(input, {
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize() {}
		}
	});
	if (!source) return consume(void 0);
	try {
		return await runWithSessionActorStorage(source, () => consume(source));
	} finally {
		await source.actor.release();
	}
}
//#endregion
export { withSubagentSessionSource as t };
