import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { i as materializeModelPolicyAllowlist } from "./model-policy-allowlist-migration-BErDvsnV.mjs";
import { r as writeConfigMachineStateAsync } from "./config-machine-state-async-Ck1ARyFy.mjs";
import { i as unsetConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CmYYNsY8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/io.meta.ts
/** Metadata keys automatically stamped on config writes. */
const AUTO_MANAGED_CONFIG_META_PATHS = [
	["meta", "lastTouchedVersion"],
	[
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	],
	[
		"meta",
		"migrations",
		"utilityModelSeparation"
	]
];
function hasWebhookMigrationProgress(previous, next) {
	const before = previous.meta?.migrations?.webhookListeners;
	const after = next.meta?.migrations?.webhookListeners;
	return before !== true && after !== void 0 && !isDeepStrictEqual(before, after);
}
/** Publish migration pins beside includes so the root marker and pins roll back together. */
function projectWebhookMigrationIncludeWrite(previous, next) {
	if (!hasWebhookMigrationProgress(previous, next)) return;
	const completed = next.meta?.migrations?.webhookListeners;
	const before = previous.meta?.migrations?.webhookListeners;
	const paths = Object.entries(completed === true ? {} : completed ?? {}).flatMap(([channelId, fields]) => typeof before === "object" && Object.hasOwn(before, channelId) ? [] : fields.filter((field) => {
		const value = getConfigValueAtPath(next, field);
		return field[0] === "channels" && field[1] === channelId && (field.length === 3 || field.length === 5 && field[2] === "accounts") && getConfigValueAtPath(previous, field) === void 0 && (field.at(-1) === "legacyWebhook" ? asNullableRecord(value) !== null : field.at(-1) === "enabled" && value === true);
	}));
	const config = cloneConfigWithResolutionFacts(next);
	for (const field of paths) unsetConfigValueAtPath(config, field, previous);
	return {
		config,
		paths
	};
}
function stampConfigWriteMetadata(cfg, version = VERSION, previousConfig, env = process.env) {
	const migrationStamped = previousConfig === void 0 ? cfg : materializeUtilityModelSeparation(materializeModelPolicyAllowlist(cfg, previousConfig).config, previousConfig).config;
	if (resolveUpdateRehearsalRoot(env)) {
		const { meta: beforeMeta, ...before } = cfg;
		const { meta: afterMeta, ...after } = migrationStamped;
		return !(beforeMeta?.migrations?.modelPolicyAllowlist && !afterMeta?.migrations?.modelPolicyAllowlist || beforeMeta?.migrations?.utilityModelSeparation && !afterMeta?.migrations?.utilityModelSeparation) && isDeepStrictEqual(before, after) ? cfg : migrationStamped;
	}
	return {
		...migrationStamped,
		meta: {
			...migrationStamped.meta,
			lastTouchedVersion: version
		}
	};
}
/** Persist machine-owned metadata only after the matching config file commit succeeds. */
async function recordConfigWriteMetadata(now = (/* @__PURE__ */ new Date()).toISOString()) {
	await writeConfigMachineStateAsync("config.lastTouchedAt", now);
}
//#endregion
export { stampConfigWriteMetadata as a, recordConfigWriteMetadata as i, hasWebhookMigrationProgress as n, projectWebhookMigrationIncludeWrite as r, AUTO_MANAGED_CONFIG_META_PATHS as t };
