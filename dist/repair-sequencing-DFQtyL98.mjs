import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { l as tryResolveSoleAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { d as isUpdatePackageSwapInProgress } from "./update-phase-BClSJ17n.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C81nk32q.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { a as resolveChannelDmAllowFrom, i as resolveChannelDmAccess, s as setCanonicalDmAllowFrom } from "./dm-access-_PDn4zky.mjs";
import { r as validateConfigObjectWithPlugins } from "./validation-R7HXbC_L.mjs";
import { D as ensureUserProfilesSchema, V as publishUserProfileAuthorityChange, q as stageUserProfileEmailBindingChange } from "./user-profiles-internal-DlO1LBbo.mjs";
import { r as VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { C as githubAuthenticationSubject } from "./user-profile-list-CtETKur7.mjs";
import { t as classifyTailscaleLogin } from "./user-profiles-tailscale-login-BtASdRBZ.mjs";
import { n as materializePluginAutoEnableCandidates, t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { n as recordUpdateModelRetirement, t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-BYnhH9wq.mjs";
import { n as recoverInstalledPluginConfigIds, t as assertInstalledPluginIdRecoveryCurrent } from "./installed-plugin-id-recovery-CjK88Neg.mjs";
import { o as maybeRepairPluginOpenClawHostLinks, r as maybeRepairStaleManagedNpmBundledPlugins } from "./doctor-plugin-registry-Cqmy9qKT.mjs";
import { t as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-QCpRdNk7.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-oLRk6qbw.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths } from "./doctor-auth-legacy-paths-CYXKyNhX.mjs";
import { r as resolveConfigWideDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-DlqQbiDN.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-T3qeDQIp.mjs";
import { n as collectOpenAICodexAuthProfileStoreIdMap, r as maybeRepairLegacyAuthProfileStores, t as repairAuthProfileMigration } from "./auth-profile-repair-DGBAAfoz.mjs";
import { t as repairMergedGatewayOwnerProfile } from "./user-profiles-owner-migration-CPBLGuPn.mjs";
import { t as getDoctorChannelCapabilities } from "./channel-capabilities-DZx0Xb3a.mjs";
import { n as hasAllowFromEntries, t as scanEmptyAllowlistPolicyWarnings } from "./empty-allowlist-scan-JONTVGqX.mjs";
import { n as maybeRepairBundledPluginLoadPaths } from "./bundled-plugin-load-paths-m6imPkY-.mjs";
import { i as collectChannelDoctorRepairMutations, o as createChannelDoctorEmptyAllowlistPolicyHooks, t as collectChannelDoctorCompatibilityMutations } from "./channel-doctor-DEEFPokm.mjs";
import { r as maybeRepairCodexRoutes } from "./codex-route-warnings-ClgPece4.mjs";
import { n as maybeRepairContextEngineHostCompatibility } from "./context-engine-host-compat-BYBnPfd0.mjs";
import { r as maybeRepairExecSafeBinProfiles } from "./exec-safe-bins-CBEF-_Qv.mjs";
import { n as maybeRepairOpenPolicyAllowFrom } from "./open-policy-allowfrom-BLoJUsjy.mjs";
import { r as removeStalePluginRuntimeSymlinks } from "./plugin-runtime-symlinks-lR_KM4QM.mjs";
import { t as repairStaleAgentModelRefs } from "./stale-agent-model-ref-repair-CcQ5l5-O.mjs";
import { n as maybeRepairStaleConfiguredAuthOrders } from "./stale-auth-order-t6osr0mg.mjs";
import { n as repairStaleOAuthProfileShadows } from "./stale-oauth-profile-shadows-1ErWrphO.mjs";
import { r as maybeRepairStalePluginConfig } from "./stale-plugin-config--OpYQ2Ww.mjs";
import { n as maybeRepairStaleSubagentAllowlists } from "./stale-subagent-allowlist-BRxiS-L4.mjs";
//#region src/state/user-profiles-tailscale-migration.ts
function migrateLegacyTailscaleProfileIdentities(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (!tableExists(database.db, "user_profile_emails")) return {
		changes: [],
		warnings: []
	};
	const kysely = getNodeSqliteKysely(database.db);
	const legacyRows = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select([
		"email",
		"profile_id",
		"created_at"
	]).orderBy("email", "asc")).rows.flatMap((row) => {
		const classified = classifyTailscaleLogin(row.email);
		return classified.kind === "provider" ? [{
			...row,
			...classified
		}] : [];
	});
	if (legacyRows.length === 0) return {
		changes: [],
		warnings: []
	};
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const transactionKysely = getNodeSqliteKysely(db);
		let migrated = 0;
		const warnings = [];
		for (const row of legacyRows) {
			const subject = row.provider === "github" ? githubAuthenticationSubject(row.subject) : row.subject;
			const inserted = executeSqliteQuerySync(db, transactionKysely.insertInto("user_profile_identities").values({
				provider: row.provider,
				subject,
				profile_id: row.profile_id,
				canonical_login: null,
				created_at: row.created_at
			}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doNothing()));
			if (executeSqliteQueryTakeFirstSync(db, transactionKysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", row.provider).where("subject", "=", subject))?.profile_id !== row.profile_id) {
				warnings.push(`Kept legacy profile login ${row.email}: ${row.provider} identity is already linked to another profile.`);
				continue;
			}
			const deleted = executeSqliteQuerySync(db, transactionKysely.deleteFrom("user_profile_emails").where("email", "=", row.email).where("profile_id", "=", row.profile_id));
			if ((deleted.numAffectedRows ?? 0n) > 0n) stageUserProfileEmailBindingChange(db, row.email, null);
			if ((inserted.numAffectedRows ?? 0n) > 0n || (deleted.numAffectedRows ?? 0n) > 0n) publishUserProfileAuthorityChange(db, row.profile_id);
			migrated += 1;
		}
		return {
			changes: migrated > 0 ? [`Moved ${migrated} legacy Tailscale provider ${migrated === 1 ? "identity" : "identities"} out of user profile email aliases.`] : [],
			warnings
		};
	}, options, { operationLabel: "user-profiles.migrate-legacy-identities" });
}
//#endregion
//#region src/commands/doctor/shared/allowfrom-fallback-migration.ts
const PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set([
	"defaults",
	"modelByChannel",
	"tools"
]);
const ACCOUNT_SCHEMA_WILDCARD = "*";
const CHANNEL_GROUP_ALLOW_FROM_PATH = ["groupAllowFrom"];
const ACCOUNT_GROUP_ALLOW_FROM_PATH = [
	"accounts",
	ACCOUNT_SCHEMA_WILDCARD,
	"groupAllowFrom"
];
function normalizeAllowFrom(raw) {
	return normalizeUniqueStringEntries(Array.isArray(raw) ? raw : []);
}
function readGroupAllowFrom(record) {
	return normalizeAllowFrom(record.groupAllowFrom);
}
function readDmAllowFrom(params) {
	return normalizeAllowFrom(resolveChannelDmAllowFrom({
		account: params.account,
		parent: params.parent,
		mode: getDoctorChannelCapabilities(params.channelName).dmAllowFromMode
	}));
}
function findGeneratedChannelConfigSchema(channelName) {
	const normalizedChannelId = normalizeAnyChannelId(channelName);
	return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === channelName || entry.channelId === normalizedChannelId)?.schema;
}
function schemaAllowsConfigPath(schema, path) {
	if (path.length === 0) return true;
	const node = asNullableRecord(schema);
	if (!node) return true;
	const anyOf = Array.isArray(node.anyOf) ? node.anyOf : void 0;
	if (anyOf) return anyOf.some((branch) => schemaAllowsConfigPath(branch, path));
	const oneOf = Array.isArray(node.oneOf) ? node.oneOf : void 0;
	if (oneOf) return oneOf.some((branch) => schemaAllowsConfigPath(branch, path));
	const allOf = Array.isArray(node.allOf) ? node.allOf : void 0;
	if (allOf) return allOf.every((branch) => schemaAllowsConfigPath(branch, path));
	const segment = expectDefined(path[0], "schema path segment");
	const rest = path.slice(1);
	const properties = asNullableRecord(node.properties);
	if (segment !== ACCOUNT_SCHEMA_WILDCARD && properties && Object.hasOwn(properties, segment)) return schemaAllowsConfigPath(expectDefined(properties[segment], "schema property"), rest);
	const additionalProperties = node.additionalProperties;
	if (additionalProperties === false) return false;
	if (additionalProperties && typeof additionalProperties === "object") return schemaAllowsConfigPath(additionalProperties, rest);
	return true;
}
function generatedSchemaAllowsGroupAllowFrom(channelName, path) {
	const schema = findGeneratedChannelConfigSchema(channelName);
	return schema !== void 0 && schemaAllowsConfigPath(schema, path);
}
function migrateRecord(params) {
	if (!params.canWriteGroupAllowFrom) return false;
	if (readGroupAllowFrom(params.account).length > 0) return false;
	if (params.parent && params.parentHadGroupAllowFrom) return false;
	const ownAllowFrom = readDmAllowFrom({
		channelName: params.channelName,
		account: params.account
	});
	if (params.parent && ownAllowFrom.length === 0 && readGroupAllowFrom(params.parent).length > 0) return false;
	const allowFrom = readDmAllowFrom(params);
	if (allowFrom.length === 0) return false;
	params.account.groupAllowFrom = allowFrom;
	const noun = allowFrom.length === 1 ? "entry" : "entries";
	params.changes.push(`${params.prefix}.groupAllowFrom: copied ${allowFrom.length} sender ${noun} from allowFrom for explicit group allowlist.`);
	return true;
}
/** Copy legacy allowFrom entries into groupAllowFrom where channel metadata permits fallback. */
function maybeRepairGroupAllowFromFallback(cfg) {
	if (!asNullableRecord(cfg.channels)) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const nextChannels = next.channels;
	const changes = [];
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (PSEUDO_CHANNEL_KEYS.has(channelName) || !channelConfig || typeof channelConfig !== "object") continue;
		if (channelConfig.enabled === false) continue;
		if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom) continue;
		const hadGroupAllowFrom = readGroupAllowFrom(channelConfig).length > 0;
		migrateRecord({
			account: channelConfig,
			canWriteGroupAllowFrom: generatedSchemaAllowsGroupAllowFrom(channelName, CHANNEL_GROUP_ALLOW_FROM_PATH),
			channelName,
			changes,
			prefix: `channels.${channelName}`
		});
		const accounts = asNullableRecord(channelConfig.accounts);
		if (!accounts) continue;
		const canWriteAccountGroupAllowFrom = generatedSchemaAllowsGroupAllowFrom(channelName, ACCOUNT_GROUP_ALLOW_FROM_PATH);
		for (const [accountId, accountConfig] of Object.entries(accounts)) {
			const account = asNullableRecord(accountConfig);
			if (!account || account.enabled === false) continue;
			migrateRecord({
				account,
				canWriteGroupAllowFrom: canWriteAccountGroupAllowFrom,
				channelName,
				changes,
				parent: channelConfig,
				parentHadGroupAllowFrom: hadGroupAllowFrom,
				prefix: `channels.${channelName}.accounts.${accountId}`
			});
		}
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/allowlist-policy-repair.ts
/** Restore missing allowFrom entries for allowlist DM policies from persisted pairing stores. */
async function maybeRepairAllowlistPolicyAllowFrom(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	const recoverAllowFromForAccount = async (params) => {
		const { mode } = params;
		const { dmPolicy, allowFrom } = resolveChannelDmAccess({
			account: params.account,
			parent: params.parent,
			mode
		});
		if (dmPolicy !== "allowlist" || hasAllowFromEntries(allowFrom)) return;
		const normalizedChannelId = normalizeOptionalLowercaseString(normalizeChatChannelId(params.channelName) ?? params.channelName);
		if (!normalizedChannelId) return;
		const normalizedAccountId = normalizeAccountId(params.accountId) || "default";
		const fromStore = await readChannelAllowFromStore(normalizedChannelId, process.env, normalizedAccountId).catch(() => []);
		const recovered = normalizeUniqueStringEntries(fromStore);
		if (recovered.length === 0) return;
		const count = recovered.length;
		const noun = count === 1 ? "entry" : "entries";
		setCanonicalDmAllowFrom({
			entry: params.account,
			allowFrom: recovered,
			mode,
			pathPrefix: params.prefix,
			changes,
			reason: `restored ${count} sender ${noun} from pairing store (dmPolicy="allowlist").`
		});
	};
	const nextChannels = next.channels;
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (!channelConfig || typeof channelConfig !== "object") continue;
		if (channelConfig.enabled === false) continue;
		const mode = getDoctorChannelCapabilities(channelName).dmAllowFromMode;
		await recoverAllowFromForAccount({
			channelName,
			mode,
			account: channelConfig,
			prefix: `channels.${channelName}`
		});
		const accounts = asNullableRecord(channelConfig.accounts);
		if (!accounts) continue;
		for (const [accountId, accountConfig] of Object.entries(accounts)) {
			if (!accountConfig || typeof accountConfig !== "object") continue;
			if (accountConfig.enabled === false) continue;
			await recoverAllowFromForAccount({
				channelName,
				mode,
				account: accountConfig,
				parent: channelConfig,
				accountId,
				prefix: `channels.${channelName}.accounts.${accountId}`
			});
		}
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/invalid-plugin-config.ts
const PLUGIN_CONFIG_ISSUE_RE = /^plugins\.entries\.([^.]+)\.config(?:\.|$)/;
function scanInvalidPluginConfig(cfg) {
	const hits = /* @__PURE__ */ new Set();
	const validation = validateConfigObjectWithPlugins(cfg);
	if (validation.ok) return hits;
	const legacyIssues = findDoctorLegacyConfigIssues(cfg);
	for (const issue of validation.issues) {
		if (!issue.message.startsWith("invalid config:")) continue;
		const pluginId = issue.path.match(PLUGIN_CONFIG_ISSUE_RE)?.[1];
		if (!pluginId || hits.has(pluginId)) continue;
		const configPath = `plugins.entries.${pluginId}.config`;
		if (legacyIssues.some((legacy) => legacy.path === configPath || legacy.path.startsWith(`${configPath}.`))) continue;
		hits.add(pluginId);
	}
	return hits;
}
/** Disable plugin entries and clear config when plugin validation marks their config invalid. */
function maybeRepairInvalidPluginConfig(cfg) {
	const hits = scanInvalidPluginConfig(cfg);
	if (hits.size === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const entries = asNullableRecord(next.plugins?.entries);
	if (!entries) return {
		config: cfg,
		changes: []
	};
	const quarantined = [];
	for (const pluginId of hits) {
		const entry = asNullableRecord(entries[pluginId]);
		if (!entry) continue;
		if ("config" in entry) delete entry.config;
		entry.enabled = false;
		quarantined.push(pluginId);
	}
	if (quarantined.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes: [sanitizeForLog(`- plugins.entries: quarantined ${quarantined.length} invalid plugin config${quarantined.length === 1 ? "" : "s"} (${quarantined.join(", ")})`)]
	};
}
//#endregion
//#region src/commands/doctor/repair-sequencing.ts
/** Run doctor auto-repairs in dependency order and collect sanitized user notes. */
async function runDoctorRepairSequence(params) {
	let state = params.state;
	const pluginMetadataSnapshotState = params.pluginMetadataSnapshotState ?? {};
	const changeNotes = [];
	const configChangeNotes = [];
	const warningNotes = [];
	const env = params.env ?? process.env;
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(env, state.candidate));
	await assertInstalledPluginIdRecoveryCurrent(state.candidate, params.installedPluginIdRecovery, env);
	let modelRetirementRepairRan = false;
	let retiredModelRefConfig;
	const resolveCurrentPluginMetadataScope = () => {
		const config = state.candidate;
		const soleAgentId = tryResolveSoleAgentId(config);
		return {
			config,
			workspaceDir: soleAgentId ? resolveAgentWorkspaceDir(config, soleAgentId, env) : void 0
		};
	};
	const sanitizeLines = (lines) => lines.map((line) => sanitizeForLog(line)).join("\n");
	const appendNotes = (notes, lines) => {
		if (lines && lines.length > 0) notes.push(sanitizeLines(lines));
	};
	const appendRepairNotes = (repair) => {
		appendNotes(changeNotes, repair.changes);
		appendNotes(warningNotes, repair.warnings);
		appendNotes(warningNotes, repair.notices);
	};
	const runWithCurrentPluginMetadata = (run) => {
		if (!params.runWithPluginMetadataSnapshot) return run();
		return params.runWithPluginMetadataSnapshot(resolveCurrentPluginMetadataScope(), run);
	};
	const applyMutation = (mutation) => {
		if (mutation.changes.length > 0) {
			appendNotes(configChangeNotes, mutation.changes);
			state = applyDoctorConfigMutation({
				state,
				mutation,
				shouldRepair: true
			});
		}
		appendNotes(warningNotes, mutation.warnings);
	};
	const applyRepairStages = async (stages) => {
		for (const repair of stages) applyMutation(await runWithCurrentPluginMetadata(() => repair(state.candidate)));
	};
	const initialChannelRepairs = await runWithCurrentPluginMetadata(() => collectChannelDoctorRepairMutations({
		cfg: state.candidate,
		doctorFixCommand: params.doctorFixCommand,
		env
	}));
	for (const mutation of initialChannelRepairs) applyMutation(mutation);
	applyMutation(maybeRepairBundledPluginLoadPaths(state.candidate, env));
	const staleManagedNpmBundledPluginRepair = maybeRepairStaleManagedNpmBundledPlugins({
		config: state.candidate,
		env,
		prompter: { shouldRepair: true }
	});
	const repairedPluginOpenClawHostLinks = await maybeRepairPluginOpenClawHostLinks({
		env,
		prompter: { shouldRepair: true }
	});
	const authFieldRepair = await maybeRepairLegacyAuthProfileStores({
		cfg: state.candidate,
		env,
		profileIdMap: /* @__PURE__ */ new Map()
	});
	appendRepairNotes(authFieldRepair);
	const codexRouteRepair = runWithCurrentPluginMetadata(() => maybeRepairCodexRoutes({
		cfg: state.candidate,
		env,
		shouldRepair: true,
		blockedProviderPlan: params.blockedCodexProviderPlan
	}));
	applyMutation({
		config: codexRouteRepair.cfg,
		changes: codexRouteRepair.changes,
		warnings: codexRouteRepair.warnings
	});
	let openAICodexAuthProfileIdMap = collectOpenAICodexAuthProfileStoreIdMap({
		cfg: state.candidate,
		env
	});
	applyMutation(await runWithCurrentPluginMetadata(() => maybeRepairContextEngineHostCompatibility({
		cfg: state.candidate,
		doctorFixCommand: params.doctorFixCommand,
		env
	})));
	const missingConfiguredPluginInstallRepair = await runWithCurrentPluginMetadata(() => repairMissingConfiguredPluginInstalls({
		cfg: state.candidate,
		env,
		repairVersionDrift: true,
		...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
		...staleManagedNpmBundledPluginRepair ? { baselineRecords: staleManagedNpmBundledPluginRepair.installRecords } : {}
	}));
	const repairedPluginIds = missingConfiguredPluginInstallRepair.repairedPluginIds ?? [];
	if (staleManagedNpmBundledPluginRepair || repairedPluginOpenClawHostLinks || missingConfiguredPluginInstallRepair.pluginInventoryChanged) {
		pluginMetadataSnapshotState.inventoryChanged = true;
		const currentScope = resolveCurrentPluginMetadataScope();
		pluginMetadataSnapshotState.current = runWithCurrentPluginMetadata(() => resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: loadPluginMetadataSnapshot({
				config: currentScope.config,
				env,
				workspaceDir: currentScope.workspaceDir,
				index: loadInstalledPluginIndex({
					config: currentScope.config,
					env,
					workspaceDir: currentScope.workspaceDir,
					installRecords: missingConfiguredPluginInstallRepair.records
				})
			}),
			config: currentScope.config,
			env
		}));
	}
	const installedPluginRecovery = await recoverInstalledPluginConfigIds(state.candidate, env, {
		previousRecovery: params.installedPluginIdRecovery,
		repairedPluginIds,
		records: missingConfiguredPluginInstallRepair.records
	});
	applyMutation(installedPluginRecovery);
	appendNotes(warningNotes, installedPluginRecovery.notices);
	if (missingConfiguredPluginInstallRepair.changes.length > 0) {
		appendNotes(changeNotes, missingConfiguredPluginInstallRepair.changes);
		applyMutation(applyPluginAutoEnable({
			config: state.candidate,
			env,
			manifestRegistry: pluginMetadataSnapshotState.current?.manifestRegistry
		}));
		if (repairedPluginIds.length > 0) {
			applyMutation(materializePluginAutoEnableCandidates({
				config: state.candidate,
				env,
				manifestRegistry: pluginMetadataSnapshotState.current?.manifestRegistry,
				candidates: repairedPluginIds.map((pluginId) => ({
					pluginId,
					kind: "configured-plugin-repaired"
				}))
			}));
			const channelCompatibilityMutations = runWithCurrentPluginMetadata(() => collectChannelDoctorCompatibilityMutations(state.candidate, { env }));
			for (const mutation of channelCompatibilityMutations) applyMutation(mutation);
			const channelRepairs = await runWithCurrentPluginMetadata(() => collectChannelDoctorRepairMutations({
				cfg: state.candidate,
				doctorFixCommand: params.doctorFixCommand,
				env
			}));
			for (const mutation of channelRepairs) applyMutation(mutation);
		}
	}
	appendNotes(warningNotes, missingConfiguredPluginInstallRepair.warnings);
	appendNotes(warningNotes, missingConfiguredPluginInstallRepair.notices);
	const failedPluginIds = missingConfiguredPluginInstallRepair.failedPluginIds ?? [];
	const hasUnscopedInstallRepairWarnings = missingConfiguredPluginInstallRepair.warnings.length > 0 && failedPluginIds.length === 0;
	const packageSwapInProgress = isUpdatePackageSwapInProgress(env);
	const pluginInstallRepairConverged = !packageSwapInProgress && failedPluginIds.length === 0 && !hasUnscopedInstallRepairWarnings;
	if (!packageSwapInProgress && !hasUnscopedInstallRepairWarnings) applyMutation(runWithCurrentPluginMetadata(() => maybeRepairStalePluginConfig(state.candidate, env, {
		preservePluginIds: [...failedPluginIds, ...installedPluginRecovery.preservePluginIds],
		surfacePreservePluginIds: VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE
	})));
	await applyRepairStages([
		maybeRepairInvalidPluginConfig,
		maybeRepairAllowlistPolicyAllowFrom,
		maybeRepairOpenPolicyAllowFrom,
		maybeRepairGroupAllowFromFallback,
		maybeRepairStaleSubagentAllowlists
	]);
	appendNotes(warningNotes, await runWithCurrentPluginMetadata(() => scanEmptyAllowlistPolicyWarnings(state.candidate, {
		doctorFixCommand: params.doctorFixCommand,
		...createChannelDoctorEmptyAllowlistPolicyHooks({
			cfg: state.candidate,
			env
		})
	})));
	await applyRepairStages([maybeRepairExecSafeBinProfiles]);
	appendRepairNotes(migrateLegacyTailscaleProfileIdentities({ env }));
	appendRepairNotes(repairMergedGatewayOwnerProfile({
		env,
		shouldRepair: true
	}));
	appendRepairNotes(await removeStalePluginRuntimeSymlinks());
	const staleOAuthShadowRepair = await repairStaleOAuthProfileShadows({
		cfg: state.candidate,
		env
	});
	appendRepairNotes(staleOAuthShadowRepair);
	const authRepair = await repairAuthProfileMigration({
		cfg: state.candidate,
		env,
		prompter: {
			shouldRepair: true,
			confirmAutoFix: async () => true
		},
		profileIdMap: openAICodexAuthProfileIdMap
	});
	appendNotes(changeNotes, authRepair.storeChanges);
	openAICodexAuthProfileIdMap = authRepair.profileIdMap;
	applyMutation(authRepair);
	applyMutation(maybeRepairStaleConfiguredAuthOrders({
		cfg: state.candidate,
		env
	}));
	if (pluginInstallRepairConverged) {
		const modelRepair = repairStaleAgentModelRefs(state.candidate, {
			env,
			pluginMetadataSnapshot: pluginMetadataSnapshotState.current
		});
		retiredModelRefConfig = modelRepair.retiredModelRefConfig;
		applyMutation(modelRepair);
		modelRetirementRepairRan = modelRepair.warnings.length === 0 && hasDeferredUpdateModelRetirement(env);
	} else if (packageSwapInProgress) {
		recordUpdateModelRetirement("deferred", env);
		warningNotes.push("Model retirement deferred until configured plugin installation converges.");
	}
	const authProfilesRepaired = authFieldRepair.changes.length > 0 || staleOAuthShadowRepair.changes.length > 0 || authRepair.storeChanges.length > 0;
	return {
		state,
		changeNotes,
		configChangeNotes,
		warningNotes,
		authProfilesRepaired,
		modelRetirementRepairRan,
		installedPluginIdRecovery: installedPluginRecovery.recovery,
		...retiredModelRefConfig ? { retiredModelRefConfig } : {},
		openAICodexAuthProfileIdMap,
		...pluginMetadataSnapshotState.current ? { pluginMetadataSnapshot: pluginMetadataSnapshotState.current } : {}
	};
}
//#endregion
export { runDoctorRepairSequence };
