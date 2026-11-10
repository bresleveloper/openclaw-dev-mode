import { d as readDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { _ as withSqliteReadOnlyWorkerScope, f as runSqliteReadOnlyOperation } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { performance } from "node:perf_hooks";
import { setTimeout } from "node:timers/promises";
//#region src/gateway/server-database-page-cache.ts
const BYTES_PER_SECOND = 16777216;
const MAX_PASS_BYTES = 2147483648;
/** Each pass owns one cancellable reader; no page map or SQLite snapshot survives it. */
async function warmGatewayDatabasePageCache(params) {
	if (process.platform !== "linux") return;
	const statePath = resolveOpenClawStateSqlitePath();
	const state = captureOpenClawStateReadContext(statePath);
	const targets = [{
		path: statePath,
		kind: "state",
		assertCurrent: () => state.admission.assertCurrent(),
		env: process.env
	}, ...params.databases.map(({ database, assertCurrent }) => ({
		path: database.path,
		kind: "agent",
		assertCurrent,
		env: database.env ?? process.env
	}))];
	let remaining = MAX_PASS_BYTES;
	for (const target of targets) {
		if (params.signal.aborted || remaining <= 0) return;
		const signal = AbortSignal.any([params.signal, AbortSignal.timeout(18e4)]);
		try {
			target.assertCurrent();
			const identity = await readDatabasePathIdentity(target.path);
			target.assertCurrent();
			const options = {
				source: "canonical",
				expectedIdentity: identity.key,
				signal,
				env: target.env
			};
			await withSqliteReadOnlyWorkerScope(async () => {
				const started = performance.now();
				let progress = await runSqliteReadOnlyOperation(target.path, {
					type: "pageCache.begin",
					input: {
						kind: target.kind,
						maxBytes: remaining,
						now: Date.now()
					}
				}, options);
				const report = (stage, value) => {
					params.startupTrace?.detail("database.page-cache", [
						["database", target.kind],
						["stage", stage],
						["residencyScope", value.residency?.scope ?? "unavailable"],
						["residentRatio", value.residency?.residentRatio ?? -1],
						["residentRatioAfter", value.residencyAfter?.residentRatio ?? -1],
						["readBytes", value.readBytes],
						["diskBytes", value.diskBytes],
						["payloadBytes", value.payloadBytes],
						["payloadMessages", value.payloadMessages],
						["elapsedMs", value.elapsedMs],
						["projectionQueryBeforeMs", value.queryBeforeMs ?? -1],
						["projectionQueryAfterMs", value.queryAfterMs ?? -1],
						["limited", String(value.limited)]
					]);
				};
				report("probe", progress);
				let reportedAt = started;
				let previousBytes = 0;
				let chunkStarted = performance.now();
				while (!progress.complete) {
					await setTimeout(Math.max(1, (Math.max(progress.readBytes, progress.diskBytes) - previousBytes) / BYTES_PER_SECOND * 1e3 - (performance.now() - chunkStarted)), void 0, { signal });
					target.assertCurrent();
					previousBytes = Math.max(progress.readBytes, progress.diskBytes);
					chunkStarted = performance.now();
					progress = await runSqliteReadOnlyOperation(target.path, {
						type: "pageCache.step",
						input: null
					}, options);
					if (performance.now() - reportedAt >= 5e3) {
						report("warming", progress);
						reportedAt = performance.now();
					}
				}
				target.assertCurrent();
				remaining -= Math.max(progress.readBytes, progress.diskBytes);
				report("complete", progress);
				params.log.info(`database page-cache residency: database=${target.kind} scope=file-sample resident=${((progress.residency?.residentRatio ?? 0) * 100).toFixed(1)}% readBytes=${progress.readBytes} diskBytes=${progress.diskBytes} payloadBytes=${progress.payloadBytes} payloadMessages=${progress.payloadMessages} elapsedMs=${progress.elapsedMs.toFixed(1)} projectionQueryMs=${progress.queryBeforeMs?.toFixed(2) ?? "n/a"}->${progress.queryAfterMs?.toFixed(2) ?? "n/a"} limited=${progress.limited}`);
			}, {
				signal,
				deadlineOwnedByCaller: true
			});
		} catch (error) {
			if (!params.signal.aborted) params.log.warn(`database page-cache warm failed (${target.kind}): ${String(error)}`);
			return;
		}
	}
}
//#endregion
export { warmGatewayDatabasePageCache };
