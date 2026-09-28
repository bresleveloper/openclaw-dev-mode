import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { i as runOpenClawStateWorkerOperation, t as executeOpenClawStateWorker } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { c as readClawHubBooleanField, d as readClawHubStringField, f as readRequiredClawHubBooleanField, h as readRequiredClawHubStringField, i as fetchClawHubJson, p as readRequiredClawHubNumberField, u as readClawHubStringArrayField } from "./clawhub-client-D8cfvjQG.mjs";
//#region src/infra/clawhub-promotions.ts
const CLAWHUB_PROMOTION_MODEL_REF_RE = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/;
function parseClawHubPromotionModel(value, context) {
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected each model to be an object.`);
	const modelRef = readRequiredClawHubStringField(value, "modelRef", context);
	if (!CLAWHUB_PROMOTION_MODEL_REF_RE.test(modelRef)) throw new Error(`Malformed ClawHub ${context}: modelRef contains unsupported characters.`);
	const model = { modelRef };
	const alias = readClawHubStringField(value, "alias", context);
	if (alias) model.alias = alias;
	const suggestedDefault = readClawHubBooleanField(value, "suggestedDefault", context);
	if (suggestedDefault !== void 0) model.suggestedDefault = suggestedDefault;
	return model;
}
const CLAWHUB_PROMOTION_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const CLAWHUB_PROMOTION_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9._@/-]*$/;
function parseClawHubPromotionCore(value, context) {
	const modelsRaw = value.models;
	if (!Array.isArray(modelsRaw) || modelsRaw.length === 0) throw new Error(`Malformed ClawHub ${context}: expected models to be a non-empty array.`);
	const slug = readRequiredClawHubStringField(value, "slug", context);
	if (!CLAWHUB_PROMOTION_SLUG_RE.test(slug)) throw new Error(`Malformed ClawHub ${context}: slug must be lowercase [a-z0-9-].`);
	const startsAt = readRequiredClawHubNumberField(value, "startsAt", context);
	const endsAt = readRequiredClawHubNumberField(value, "endsAt", context);
	if (endsAt <= startsAt) throw new Error(`Malformed ClawHub ${context}: promotion window must end after it starts.`);
	const promotion = {
		slug,
		title: readRequiredClawHubStringField(value, "title", context),
		blurb: readRequiredClawHubStringField(value, "blurb", context),
		startsAt,
		endsAt,
		models: modelsRaw.map((entry) => parseClawHubPromotionModel(entry, context))
	};
	for (const field of [
		"sponsor",
		"signupUrl",
		"docsUrl",
		"launchPageUrl"
	]) {
		const parsed = readClawHubStringField(value, field, context);
		if (parsed) promotion[field] = parsed;
	}
	for (const field of ["provider", "authChoiceId"]) {
		const parsed = readClawHubStringField(value, field, context);
		if (!parsed) continue;
		if (!CLAWHUB_PROMOTION_IDENTIFIER_RE.test(parsed)) throw new Error(`Malformed ClawHub ${context}: ${field} contains unsupported characters.`);
		promotion[field] = parsed;
	}
	const pluginNames = readClawHubStringArrayField(value, "pluginNames", context);
	if (pluginNames && pluginNames.length > 0) {
		for (const name of pluginNames) {
			const parsed = parseRegistryNpmSpec(name);
			if (!parsed || parsed.selectorKind !== "none" || parsed.name !== name) throw new Error(`Malformed ClawHub ${context}: pluginNames must contain npm package names.`);
		}
		promotion.pluginNames = pluginNames;
	}
	return promotion;
}
function parseClawHubPromotion(value) {
	const context = "promotion";
	if (!isRecord(value)) throw new Error(`Malformed ClawHub ${context}: expected an object.`);
	return {
		...parseClawHubPromotionCore(value, context),
		status: readRequiredClawHubStringField(value, "status", context),
		active: readRequiredClawHubBooleanField(value, "active", context)
	};
}
async function fetchClawHubPromotions(params = {}) {
	const response = await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: "/api/v1/promotions",
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	});
	if (!isRecord(response) || !Array.isArray(response.promotions)) throw new Error("Malformed ClawHub promotions response: expected a promotions array.");
	return response.promotions.map((entry) => parseClawHubPromotion(entry));
}
async function fetchClawHubPromotion(params) {
	return parseClawHubPromotion(await fetchClawHubJson({
		baseUrl: params.baseUrl,
		path: `/api/v1/promotions/${encodeURIComponent(params.slug)}`,
		timeoutMs: params.timeoutMs,
		fetchImpl: params.fetchImpl
	}));
}
//#endregion
//#region src/infra/promotions-feed.ts
/** Retains explicit promotion notice and claim provenance. */
async function markPromotionSlugsNotified(slugs) {
	try {
		const input = {
			slugs: [...slugs],
			now: Date.now()
		};
		if (input.slugs.length === 0) return;
		const context = captureOpenClawStateWorkerContext();
		const command = {
			type: "promotions.markNotified",
			input
		};
		if (await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), { existingOnly: true }) === void 0) await executeOpenClawStateWorker(context, command);
	} catch {}
}
async function recordPromotionClaim(record) {
	try {
		const input = {
			slug: record.slug,
			provider: record.provider ?? null,
			modelKeysJson: JSON.stringify(record.modelKeys),
			endsAtMs: record.endsAtMs,
			claimedAtMs: record.claimedAtMs
		};
		const context = captureOpenClawStateWorkerContext();
		await executeOpenClawStateWorker(context, {
			type: "promotions.recordClaim",
			input
		});
	} catch {}
}
//#endregion
export { fetchClawHubPromotions as i, recordPromotionClaim as n, fetchClawHubPromotion as r, markPromotionSlugsNotified as t };
