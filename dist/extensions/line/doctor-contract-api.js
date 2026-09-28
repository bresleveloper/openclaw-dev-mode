import { a as eventIdFor, i as errorText, o as laneKeyFor, r as LineWebhookPayloadError, s as legacyEventIdFor, t as LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON } from "./.setup/webhook-spool-contract-1rY8OJw8.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/line/src/webhook-spool-migration.ts
/** Pre-drain (#109655) rows stored the event object under `event` instead of the
*  canonical serialized `rawEvent`; anything else is not a migratable row. */
function parseLegacySpoolPayload(payload) {
	if (!isRecord(payload) || "rawEvent" in payload) return null;
	if (typeof payload.destination !== "string") return null;
	if (!isRecord(payload.event)) return null;
	return {
		destination: payload.destination,
		event: payload.event
	};
}
/** A dead-letter carries the pre-fix decoder's signature when the canonical spool
*  rejected a pre-drain row before this migration existed. The identity fence and
*  ordinary delivery failures write different reasons or messages, so neither is
*  ever treated as recoverable. */
function isLegacyDecodeDeadLetter(row) {
	return row.reason === "invalid-event" && row.message === "LINE webhook spool payload is invalid." && parseLegacySpoolPayload(row.payload) !== null;
}
/** Counts pre-drain rows (pending, still claimed, or decoder-dead-lettered)
*  without mutating anything. */
async function countLegacySpoolRows(queue) {
	const pending = await queue.listPending({ limit: "all" });
	const claims = await queue.listClaims();
	const failed = await queue.listFailed?.({ limit: "all" }) ?? [];
	return pending.filter((record) => parseLegacySpoolPayload(record.payload) !== null).length + claims.filter((claim) => parseLegacySpoolPayload(claim.payload) !== null).length + failed.filter((row) => isLegacyDecodeDeadLetter(row)).length;
}
/** One-time upgrade migration: rewrite pre-drain (#109655) rows into the canonical
*  payload and message:/event: keyspace before the spool drains, so the runtime
*  reader keeps a single row contract. Idempotent — enqueue deduplicates by id, so
*  a rerun after a crash only re-completes the leftover legacy rows. */
async function migrateLineLegacySpoolRows(queue) {
	const result = {
		migrated: 0,
		reconciled: 0,
		deadLettered: 0,
		recovered: 0,
		failures: []
	};
	await queue.recoverStaleClaims({
		staleMs: 0,
		shouldRecover: (claim) => parseLegacySpoolPayload(claim.payload) !== null
	});
	const failed = await queue.listFailed?.({ limit: "all" }) ?? [];
	for (const row of failed) {
		if (!isLegacyDecodeDeadLetter(row)) continue;
		try {
			if ((await queue.resubmit?.(row.id, { resubmittedAt: row.receivedAt }))?.kind === "resubmitted") result.recovered += 1;
		} catch (error) {
			result.failures.push(`row ${row.id}: ${errorText(error)}`);
		}
	}
	const pending = await queue.listPending({
		limit: "all",
		orderBy: "received"
	});
	for (const record of pending) {
		const legacy = parseLegacySpoolPayload(record.payload);
		if (!legacy) continue;
		let eventId;
		try {
			if (record.id !== legacyEventIdFor(legacy.event)) throw new LineWebhookPayloadError("LINE webhook event identity changed after durable admission.");
			eventId = eventIdFor(legacy.event);
		} catch (error) {
			await queue.fail(record.id, {
				reason: LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON,
				message: errorText(error)
			});
			result.deadLettered += 1;
			continue;
		}
		try {
			const admitted = await queue.enqueue(eventId, {
				version: 1,
				rawEvent: JSON.stringify(legacy.event),
				destination: legacy.destination
			}, {
				receivedAt: record.receivedAt,
				laneKey: laneKeyFor(legacy.event, eventId)
			});
			await queue.complete(record.id);
			if (admitted.kind === "completed" || admitted.kind === "failed") result.reconciled += 1;
			else result.migrated += 1;
		} catch (error) {
			result.failures.push(`row ${record.id}: ${errorText(error)}`);
		}
	}
	return result;
}
//#endregion
//#region extensions/line/doctor-contract-api.ts
const LINE_CHANNEL_ID = "line";
/** Pre-drain rows can outlive the account config that admitted them, so the sweep
*  enumerates accounts from the host's queue lane instead of the config; a host
*  without the lane fails visibly rather than silently skipping the migration. */
function lineSpoolQueueAccess(context) {
	const access = context.channelIngressQueues?.find((entry) => entry.channelId === LINE_CHANNEL_ID);
	if (!access) throw new Error("LINE pre-drain spool migration requires the doctor host's channel ingress queue access.");
	return access;
}
/** Doctor-owned upgrade migration for pre-drain (#109655) webhook spool rows. */
const stateMigrations = [{
	id: "line-pre-drain-spool-rows",
	label: "LINE pre-drain webhook spool rows",
	async detectLegacyState(params) {
		const spool = lineSpoolQueueAccess(params.context);
		const preview = [];
		for (const accountId of await spool.listChannelIngressQueueAccountIds()) {
			const count = await countLegacySpoolRows(spool.openChannelIngressQueueForInspection({ accountId }));
			if (count > 0) preview.push(`- LINE pre-drain spool rows (account "${accountId}"): ${count} row(s) -> canonical ingress contract`);
		}
		return preview.length > 0 ? { preview } : null;
	},
	async migrateLegacyState(params) {
		const spool = lineSpoolQueueAccess(params.context);
		const lineConfig = params.config.channels?.line;
		const configuredAccountIds = /* @__PURE__ */ new Set([...Object.keys(lineConfig?.accounts ?? {}), ...lineConfig ? ["default"] : []]);
		const openForMigration = spool.openChannelIngressQueue;
		if (!openForMigration) throw new Error("LINE pre-drain spool migration requires mutable ingress access from the doctor host's exclusive repair section.");
		const changes = [];
		const warnings = [];
		for (const accountId of await spool.listChannelIngressQueueAccountIds()) {
			const result = await migrateLineLegacySpoolRows(openForMigration({ accountId }));
			if (result.migrated > 0 || result.reconciled > 0 || result.deadLettered > 0 || result.recovered > 0) {
				const recovered = result.recovered > 0 ? ` (${result.recovered} recovered from the dead-letter table)` : "";
				const reconciled = result.reconciled > 0 ? `, ${result.reconciled} already settled under the canonical id` : "";
				const dispatchNote = configuredAccountIds.has(accountId) ? "" : ` (account not currently configured, so these stay queued until it is restored)`;
				changes.push(`Migrated LINE pre-drain spool rows (account "${accountId}"): ${result.migrated} queued under the canonical contract, ${result.deadLettered} dead-lettered at the identity fence${reconciled}${recovered}${dispatchNote}`);
			}
			for (const failure of result.failures) warnings.push(`Failed migrating a LINE pre-drain spool row (account "${accountId}", ${failure}); the row stays pending and the migration retries on the next run`);
		}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
