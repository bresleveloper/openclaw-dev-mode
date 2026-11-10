import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import "./cli-state-owner-CBu2WDHQ.mjs";
import { t as drainSessionBackfill } from "./session-backfill-drain-BesfPfDr.mjs";
//#region extensions/memory-core/src/cli-session-backfill.ts
async function runMemorySessionBackfillCli(opts, hostOptions) {
	if (opts.rollback && (opts.apply || opts.rem || opts.from || opts.to || opts.archiveFiles?.length)) throw new Error("Memory session-backfill --rollback cannot be combined with input, range, --rem, or --apply options.");
	const operation = opts.rollback ? "rollback" : opts.apply ? "apply" : "preview";
	let operationOwnerId;
	const executeBatch = async () => {
		const reply = await runWithLocalStateOwner({
			method: `memory.sessionBackfill.${operation}.owner`,
			params: {
				agentId: opts.agent,
				...opts.rollback ? {} : {
					from: opts.from,
					to: opts.to,
					limitDays: opts.limitDays
				},
				cliResult: true,
				...operationOwnerId ? { operationOwnerId } : {}
			},
			target: "memory session backfill",
			recoveryCommand: "openclaw memory session-backfill --json",
			...opts.rem || opts.archiveFiles?.length ? { onForeignOwner: "refuse" } : {},
			runLocal: async () => {
				if (operationOwnerId) throw new Error("The selected Gateway is no longer running; inspect the operation before retrying.");
				await (await import("./cli.runtime.js")).runMemorySessionBackfill(opts, hostOptions);
				return null;
			}
		});
		if (reply) operationOwnerId ??= reply.ownerId;
		return reply;
	};
	const first = await executeBatch();
	if (!first) return;
	let initial = first.execution;
	const result = opts.apply && !opts.rollback ? await drainSessionBackfill({ executeBatch: async () => {
		if (initial) {
			const value = initial;
			initial = void 0;
			return value;
		}
		const next = await executeBatch();
		if (!next) throw new Error("Memory backfill lost its Gateway owner.");
		return next.execution;
	} }) : first.execution.result;
	const { printSessionBackfillResult } = await import("./cli-rem.runtime.js");
	printSessionBackfillResult(result, opts);
}
//#endregion
export { runMemorySessionBackfillCli };
