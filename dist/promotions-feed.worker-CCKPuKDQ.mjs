import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-pMcF7uIi.mjs";
//#region src/infra/promotions-feed.kernel.ts
const PROMOTIONS_FEED_STATE_KEY = "clawhub.promotionsFeed";
function markPromotionSlugsNotifiedInDatabase(database, incoming, now) {
	updateConfigMachineStateInDatabase(database, PROMOTIONS_FEED_STATE_KEY, (existing) => ({
		etag: existing?.etag ?? null,
		sequence: existing?.sequence ?? null,
		payloadJson: existing?.payloadJson ?? null,
		lastCheckedAtMs: existing?.lastCheckedAtMs ?? null,
		notifiedSlugs: [.../* @__PURE__ */ new Set([...existing?.notifiedSlugs ?? [], ...incoming])].toSorted()
	}), now);
}
function recordPromotionClaimInDatabase(database, record) {
	const db = getNodeSqliteKysely(database);
	const values = {
		slug: record.slug,
		provider: record.provider,
		model_keys_json: record.modelKeysJson,
		ends_at_ms: record.endsAtMs,
		claimed_at_ms: record.claimedAtMs
	};
	executeSqliteQuerySync(database, db.insertInto("clawhub_promotion_claims").values(values).onConflict((conflict) => conflict.column("slug").doUpdateSet(values)));
}
//#endregion
//#region src/infra/promotions-feed.worker.ts
const promotionOperations = {
	"promotions.markNotified": (input, { stateOptions, open }) => {
		const options = stateOptions();
		const stored = readConfigMachineState(PROMOTIONS_FEED_STATE_KEY, options);
		const known = new Set(stored?.notifiedSlugs ?? []);
		const incoming = input.slugs.filter((slug) => !known.has(slug));
		if (incoming.length > 0) runOpenClawStateWriteTransaction(({ db }) => markPromotionSlugsNotifiedInDatabase(db, incoming, input.now), {
			...options,
			database: open()
		}, { operationLabel: "config-machine-state.update" });
		return true;
	},
	"promotions.recordClaim": (input, { stateOptions, open }) => runOpenClawStateWriteTransaction(({ db }) => recordPromotionClaimInDatabase(db, input), {
		...stateOptions(),
		database: open()
	})
};
//#endregion
export { promotionOperations };
