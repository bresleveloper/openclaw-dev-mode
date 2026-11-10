import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { _ as stageUserProfileEmailBindingChange, d as publishUserProfileAuthorityChange } from "./user-profile-events-CXjmX5Qy.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C6coO7KH.mjs";
import { a as resolveChannelDmAllowFrom, i as resolveChannelDmAccess, s as setCanonicalDmAllowFrom } from "./dm-access-Hz7HYgpa.mjs";
import { i as validateConfigObjectWithPlugins } from "./validation-gzn6Bd6i.mjs";
import { D as ensureUserProfilesSchema } from "./user-profiles-internal-CBUpoSHj.mjs";
import { f as githubAuthenticationSubject } from "./user-profile-identity.read-DXpuvx74.mjs";
import { m as classifyTailscaleLogin } from "./user-channel-identities-B1CU1eh6.mjs";
import { r as VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { n as materializePluginAutoEnableCandidates, t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { p as isUpdatePackageSwapInProgress } from "./update-phase-M5rvMZiC.mjs";
import { n as recordUpdateModelRetirement, t as hasDeferredUpdateModelRetirement } from "./update-deferred-model-retirement-BmVkte5n.mjs";
import { n as recoverInstalledPluginConfigIds, t as assertInstalledPluginIdRecoveryCurrent } from "./installed-plugin-id-recovery-CM-iJWF3.mjs";
import { r as maybeRepairStaleManagedNpmBundledPlugins } from "./doctor-plugin-registry-4GHEwsm1.mjs";
import { n as maybeRepairPluginOpenClawHostLinks } from "./doctor-plugin-host-links-DTIMikSS.mjs";
import { t as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-lupDczXs.mjs";
import { t as readChannelAllowFromStore } from "./pairing-store.read-30DeRp-H.mjs";
import "./pairing-store-BIAARSUf.mjs";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-Dbhci2Vm.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths } from "./doctor-auth-legacy-paths-BW9Ya4su.mjs";
import { n as resolveConfigWideDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-Chaaplry.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-BoUI31s1.mjs";
import { n as collectOpenAICodexAuthProfileStoreIdMap, r as maybeRepairLegacyAuthProfileStores, t as repairAuthProfileMigration } from "./auth-profile-repair-CYBVRD0H.mjs";
import { t as repairMergedGatewayOwnerProfile } from "./user-profiles-owner-migration-BwBqlbNz.mjs";
import { n as iterateDoctorChannelAccounts, r as getDoctorChannelCapabilities, t as hasAllowFromEntries } from "./allowlist-CX9NeGVw.mjs";
import { n as maybeRepairBundledPluginLoadPaths } from "./bundled-plugin-load-paths-8Mgaz9aZ.mjs";
import { i as collectChannelDoctorRepairMutations, o as createChannelDoctorEmptyAllowlistPolicyHooks, t as collectChannelDoctorCompatibilityMutations } from "./channel-doctor-DUBSvtxW.mjs";
import { r as maybeRepairCodexRoutes } from "./codex-route-warnings-DXtHVmFJ.mjs";
import { n as maybeRepairContextEngineHostCompatibility } from "./context-engine-host-compat-C-w4j8Ba.mjs";
import { t as scanEmptyAllowlistPolicyWarnings } from "./empty-allowlist-scan-Drig1Qki.mjs";
import { r as maybeRepairExecSafeBinProfiles } from "./exec-safe-bins-Cl3cV7ko.mjs";
import { n as maybeRepairOpenPolicyAllowFrom } from "./open-policy-allowfrom-CeZNhPmM.mjs";
import { r as removeStalePluginRuntimeSymlinks } from "./plugin-runtime-symlinks-BAXqKirE.mjs";
import { t as repairStaleAgentModelRefs } from "./stale-agent-model-ref-repair-D9AuA8dX.mjs";
import { n as maybeRepairStaleConfiguredAuthOrders } from "./stale-auth-order-fPcs9pBK.mjs";
import { n as repairStaleOAuthProfileShadows } from "./stale-oauth-profile-shadows-ClzhpUNe.mjs";
import { r as maybeRepairStalePluginConfig } from "./stale-plugin-config-C6NtNdLS.mjs";
import { n as maybeRepairStaleSubagentAllowlists } from "./stale-subagent-allowlist-BblVZ6Ry.mjs";
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
function readDmAllowFrom(channelName, account, parent) {
	return normalizeAllowFrom(resolveChannelDmAllowFrom({
		account,
		parent,
		mode: getDoctorChannelCapabilities(channelName).dmAllowFromMode
	}));
}
function schemaAllowsConfigPath(schema, path) {
	if (path.length === 0) return true;
	const node = asNullableRecord(schema);
	if (!node) return true;
	for (const key of ["anyOf", "oneOf"]) {
		const branches = node[key];
		if (Array.isArray(branches)) return branches.some((branch) => schemaAllowsConfigPath(branch, path));
	}
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
	const normalizedChannelId = normalizeAnyChannelId(channelName);
	const schema = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === channelName || entry.channelId === normalizedChannelId)?.schema;
	return schema !== void 0 && schemaAllowsConfigPath(schema, path);
}
function migrateRecord(params) {
	if (!params.canWriteGroupAllowFrom || Array.isArray(params.account.groupAllowFrom) || params.parentHadGroupAllowFrom || (params.account.groupPolicy ?? params.parent?.groupPolicy ?? params.defaultGroupPolicy) === "disabled") return;
	const ownAllowFrom = readDmAllowFrom(params.channelName, params.account);
	if (Array.isArray(params.parent?.groupAllowFrom) && ownAllowFrom.length === 0) return;
	const allowFrom = readDmAllowFrom(params.channelName, params.account, params.parent);
	if (allowFrom.length === 0) return;
	params.account.groupAllowFrom = allowFrom;
	const noun = allowFrom.length === 1 ? "entry" : "entries";
	params.changes.push(`${params.prefix}.groupAllowFrom: copied ${allowFrom.length} sender ${noun} from allowFrom for explicit group allowlist.`);
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
		const hadGroupAllowFrom = Array.isArray(channelConfig.groupAllowFrom);
		const canWriteChannelGroupAllowFrom = generatedSchemaAllowsGroupAllowFrom(channelName, CHANNEL_GROUP_ALLOW_FROM_PATH);
		migrateRecord({
			account: channelConfig,
			defaultGroupPolicy: nextChannels.defaults?.groupPolicy,
			canWriteGroupAllowFrom: canWriteChannelGroupAllowFrom,
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
				defaultGroupPolicy: nextChannels.defaults?.groupPolicy,
				canWriteGroupAllowFrom: canWriteAccountGroupAllowFrom,
				channelName,
				changes,
				parent: channelConfig,
				parentHadGroupAllowFrom: hadGroupAllowFrom,
				prefix: `channels.${channelName}.accounts.${accountId}`
			});
		}
	}
	return {
		config: changes.length > 0 ? next : cfg,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/allowlist-policy-repair.ts
async function maybeRepairAllowlistPolicyAllowFrom(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	for (const [channelName, value] of Object.entries(next.channels ?? {})) {
		const channelConfig = asOptionalObjectRecord(value);
		if (!channelConfig || channelConfig.enabled === false) continue;
		const mode = getDoctorChannelCapabilities(channelName).dmAllowFromMode;
		const recoverAllowFromForAccount = async (params) => {
			const { dmPolicy, allowFrom } = resolveChannelDmAccess({
				account: params.account,
				parent: params.parent,
				mode
			});
			if (dmPolicy !== "allowlist" || hasAllowFromEntries(allowFrom)) return;
			const normalizedChannelId = normalizeOptionalLowercaseString(normalizeChatChannelId(channelName) ?? channelName);
			if (!normalizedChannelId) return;
			const normalizedAccountId = normalizeAccountId(params.accountId);
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
		for (const account of iterateDoctorChannelAccounts(channelConfig, `channels.${channelName}`, true)) await recoverAllowFromForAccount(account);
	}
	return {
		config: changes.length > 0 ? next : cfg,
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
function maybeRepairInvalidPluginConfig(cfg) {
	const hits = scanInvalidPluginConfig(cfg);
	if (hits.size === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const entries = asNullableRecord(next.plugins?.entries);
	const quarantined = [];
	for (const pluginId of hits) {
		const entry = asNullableRecord(entries?.[pluginId]);
		if (!entry) continue;
		delete entry.config;
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
	const collectCurrentChannelRepairs = () => runWithCurrentPluginMetadata(() => collectChannelDoctorRepairMutations({
		cfg: state.candidate,
		doctorFixCommand: params.doctorFixCommand,
		env
	}));
	for (const mutation of await collectCurrentChannelRepairs()) applyMutation(mutation);
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
		const currentScope = {
			...resolveCurrentPluginMetadataScope(),
			env
		};
		pluginMetadataSnapshotState.current = runWithCurrentPluginMetadata(() => resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: loadPluginMetadataSnapshot({
				...currentScope,
				index: loadInstalledPluginIndex({
					...currentScope,
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
			for (const mutation of await collectCurrentChannelRepairs()) applyMutation(mutation);
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
