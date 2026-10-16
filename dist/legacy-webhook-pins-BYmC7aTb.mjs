import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { S as resolveIsConfigReadOnly, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { u as normalizePluginsConfig, x as resolveChannelConfigEnablement } from "./config-state-DY_WJYue.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import { r as setConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/legacy-webhook-pins.ts
const HISTORICAL_WEBHOOK_CHANNELS = [
	"telegram",
	"feishu",
	"msteams",
	"nextcloud-talk"
];
function webhookCompletionKey(env) {
	return `webhookListeners:${resolveConfigPath(env)}`;
}
/** No config bytes changed, so this completion does not depend on config rollback. */
function recordUnwrittenWebhookCompletion(snapshot, mutation, env) {
	const readOnly = resolveIsConfigReadOnly(env);
	const markerOnly = cloneConfigWithResolutionFacts(snapshot.sourceConfig);
	markerOnly.meta ??= {};
	markerOnly.meta.migrations ??= {};
	markerOnly.meta.migrations.webhookListeners = mutation.config.meta?.migrations?.webhookListeners;
	if (!isDeepStrictEqual(markerOnly, mutation.config)) {
		if (!readOnly) return false;
		throw new Error(`Webhook listeners need migration in the externally managed config. Add the required legacyWebhook endpoints and meta.migrations.webhookListeners completion marker in that source, then restart.\n${mutation.changes.join("\n")}`);
	}
	writeConfigMachineState(webhookCompletionKey(env), markerOnly.meta.migrations.webhookListeners, { env });
	return true;
}
/** Pins and completion travel together through Doctor's config backup and publication. */
function applyHistoricalWebhookPins(mutation, declaration, context = {}) {
	const env = context.env ?? process.env;
	const marker = mutation.config.meta?.migrations?.webhookListeners ?? readConfigMachineState(webhookCompletionKey(env), { env });
	if (marker === true || mutation.warnings?.length) return mutation;
	const accountIds = context.startup && mutation.historicalWebhookAccountIds === null || context.pluginId && !passesManifestOwnerBasePolicy({
		plugin: { id: context.pluginId },
		normalizedConfig: normalizePluginsConfig(mutation.config.plugins),
		allowRestrictiveAllowlistBypass: context.origin === "bundled" && resolveChannelConfigEnablement(mutation.config, declaration?.channelId ?? context.pluginId) === true
	}) ? [] : mutation.historicalWebhookAccountIds;
	const existing = marker !== void 0 || isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const query = getNodeSqliteKysely(db);
		return [
			query.selectFrom("gateway_boot_lifecycle").select("boot_id as evidence").limit(1),
			query.selectFrom("channel_ingress_events").select("event_id as evidence").limit(1),
			tableExists(db, "update_runs") && query.selectFrom("update_runs").select("run_id as evidence").limit(1)
		].some((statement) => statement && executeSqliteQueryTakeFirstSync(db, statement));
	}, { env });
	const completed = { ...marker };
	const channelId = declaration?.channelId;
	if (existing && (!channelId || !accountIds || Object.hasOwn(completed, channelId))) return mutation;
	const config = cloneConfigWithResolutionFacts(mutation.config);
	const changes = [...mutation.changes];
	if (existing && declaration) {
		const rootPath = ["channels", declaration.channelId];
		const root = asNullableRecord(getConfigValueAtPath(config, rootPath));
		const accounts = Object.keys(asNullableRecord(root?.accounts) ?? {});
		const paths = [];
		const { channelId: _channelId, preserveAuthoredActivation, ...endpoint } = declaration;
		if (preserveAuthoredActivation && root?.legacyWebhook !== void 0 && root.enabled === void 0) {
			setConfigValueAtPath(config, [...rootPath, "enabled"], true);
			paths.push([...rootPath, "enabled"]);
			changes.push(`Set ${rootPath.join(".")}.enabled to preserve authored webhook activation.`);
		}
		for (const accountId of accountIds ?? []) {
			if (root?.legacyWebhook !== void 0) continue;
			const accountPath = [...rootPath];
			if (accountId !== void 0) {
				const matches = accounts.includes(accountId) ? [accountId] : accounts.filter((id) => normalizeOptionalAccountId(id) === normalizeOptionalAccountId(accountId));
				if (matches.length > 1) return {
					...mutation,
					warnings: [`Ambiguous ${declaration.channelId} account ${JSON.stringify(accountId)} matches ${matches.map((id) => JSON.stringify(id)).join(", ")}; no pins were written for this channel. Pin the intended account manually: channels.${declaration.channelId}.accounts[<exact account key>].legacyWebhook = ${JSON.stringify(endpoint)}.`]
				};
				accountPath.push("accounts", matches[0] ?? accountId);
			}
			const pinPath = [...accountPath, "legacyWebhook"];
			if (getConfigValueAtPath(config, pinPath) !== void 0) continue;
			setConfigValueAtPath(config, pinPath, endpoint);
			paths.push(pinPath);
			changes.push(`Pinned ${accountPath.join(".")}.legacyWebhook. Move the callback or proxy to the Gateway route, then remove the pin.`);
		}
		completed[declaration.channelId] = paths;
	}
	config.meta ??= {};
	config.meta.migrations ??= {};
	config.meta.migrations.webhookListeners = existing ? completed : true;
	changes.push("Recorded webhook listener decisions; removed pins will not be recreated.");
	const result = {
		...mutation,
		config,
		changes
	};
	if (resolveUpdateRehearsalRoot(env) && recordUnwrittenWebhookCompletion({ sourceConfig: mutation.config }, result, env)) return mutation;
	return result;
}
//#endregion
export { applyHistoricalWebhookPins as n, recordUnwrittenWebhookCompletion as r, HISTORICAL_WEBHOOK_CHANNELS as t };
