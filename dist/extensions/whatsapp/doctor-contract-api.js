import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./.setup/account-ids-CB5SOWjc.mjs";
import { r as isWhatsAppBaileysAuthFileName } from "./.setup/creds-files-B8WcOAmE.mjs";
import { r as runtime_doctor_migrations_exports, t as normalizeCompatibilityConfig$1 } from "./.setup/doctor-DKzeBEmH.mjs";
import fs, { realpathSync } from "node:fs";
import path from "node:path";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-core";
import { resolveOAuthDir } from "openclaw/plugin-sdk/state-paths";
import { assertNoSymlinkParentsSync, readRegularFileSync, root } from "openclaw/plugin-sdk/file-access-runtime";
import { resolveUserPath as resolveUserPath$1 } from "openclaw/plugin-sdk/account-resolution";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import fs$1 from "node:fs/promises";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2 } from "openclaw/plugin-sdk/account-id";
import { createHash } from "node:crypto";
//#region extensions/whatsapp/src/state-migrations.ts
function credentialSetDigest(files) {
	return createHash("sha256").update(JSON.stringify([...files].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0))).digest("hex");
}
function comparablePath(value) {
	try {
		return realpathSync.native(value);
	} catch {
		return path.resolve(value);
	}
}
function explicitlyOwnsRoot(params) {
	const channel = params.config.channels?.whatsapp;
	const oauthRoot = comparablePath(params.oauthDir);
	return Object.values(channel?.accounts ?? {}).some((owner) => {
		const configured = owner?.authDir?.trim();
		return configured && comparablePath(resolveUserPath$1(configured, params.env)) === oauthRoot;
	});
}
async function listSources(params) {
	try {
		if (!(await fs$1.lstat(params.oauthDir)).isDirectory()) throw new Error("WhatsApp legacy credential root must be a regular directory.");
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return [];
		throw error;
	}
	const sources = /* @__PURE__ */ new Map();
	for (const entry of await fs$1.readdir(params.oauthDir, { withFileTypes: true })) {
		const name = runtime_doctor_migrations_exports.resolveLegacyMigrationSourcePath?.(entry.name) ?? entry.name;
		if (!entry.isFile() || !isWhatsAppBaileysAuthFileName(name)) continue;
		const source = sources.get(name) ?? {
			name,
			filePath: path.join(params.oauthDir, name),
			claimPaths: []
		};
		if (name !== entry.name) source.claimPaths.push(path.join(params.oauthDir, entry.name));
		sources.set(name, source);
	}
	return [...sources.values()].filter((source) => !explicitlyOwnsRoot(params) || source.claimPaths.length > 0).toSorted((left, right) => Number(left.name === "creds.json") - Number(right.name === "creds.json") || left.name.localeCompare(right.name));
}
const whatsappLegacyStateMigration = {
	id: "whatsapp-legacy-state",
	label: "WhatsApp legacy state",
	collectBackupResources: ({ env, stateDir }) => [{
		path: resolveOAuthDir(env, stateDir),
		kind: "directory"
	}, {
		path: path.join(stateDir, "state", "openclaw.sqlite"),
		kind: "sqlite"
	}],
	async detectLegacyState(params) {
		const sources = await listSources(params);
		return sources.length > 0 ? { preview: [explicitlyOwnsRoot(params) ? `- Restore ${sources.length} interrupted WhatsApp credential claims in the configured root` : `- Move ${sources.length} WhatsApp credential files into the default account`] } : null;
	},
	async migrateLegacyState(params) {
		const sources = await listSources(params);
		const changes = [];
		const warnings = [];
		if (sources.length === 0) return {
			changes,
			warnings
		};
		const assertCurrent = params.context.channelIngressQueues?.find((entry) => entry.channelId === "whatsapp")?.assertCurrent;
		const { backupLegacyStateSource } = runtime_doctor_migrations_exports;
		if (!assertCurrent || !backupLegacyStateSource) return {
			changes,
			warnings: ["WhatsApp credential import requires offline Doctor repair. Update OpenClaw core and run openclaw doctor --fix; original files remain unchanged."]
		};
		const backups = [];
		for (const source of sources) backups.push({
			source,
			backup: await backupLegacyStateSource({
				filePath: source.filePath,
				claimPaths: source.claimPaths,
				assertCurrent
			})
		});
		if (explicitlyOwnsRoot(params)) return {
			changes: backups.map(({ source, backup }) => `Restored WhatsApp auth ${source.name} in the configured root; backup: ${backup.backupPath}`),
			warnings
		};
		const credentials = await root(params.oauthDir, {
			assertBeforeMutation: assertCurrent,
			symlinks: "reject",
			hardlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER
		});
		const targetDir = path.join("whatsapp", DEFAULT_ACCOUNT_ID$2);
		const targetCreds = path.join(targetDir, "creds.json");
		const canonical = await credentials.exists(targetCreds) ? await credentials.read(targetCreds) : void 0;
		const legacy = backups.find(({ source }) => source.name === "creds.json");
		if (!legacy) return {
			changes,
			warnings: ["WhatsApp shared-root key files have no creds.json identity. Kept all original files and private .migrated backups; restore the original creds.json before retrying Doctor."],
			...canonical ? { warningDisposition: "recoverable" } : {}
		};
		if (canonical && !canonical.buffer.equals(legacy.backup.bytes)) return {
			changes,
			warnings: ["WhatsApp canonical credentials differ from the legacy shared root. Kept both complete sets and private .migrated backups; choose the intended authDir before removing either set."],
			warningDisposition: "recoverable"
		};
		const targetNames = await fs$1.readdir(path.join(params.oauthDir, targetDir)).catch((error) => {
			if (extractErrorCode(error) === "ENOENT") return [];
			throw error;
		});
		const targetFiles = /* @__PURE__ */ new Map();
		for (const name of targetNames.filter(isWhatsAppBaileysAuthFileName)) {
			const target = await credentials.read(path.join(targetDir, name));
			targetFiles.set(name, createHash("sha256").update(target.buffer).digest("hex"));
		}
		const receiptStore = params.context.openPluginStateKeyedStore({
			namespace: "auth-directory-migrations",
			maxEntries: 4096,
			overflowPolicy: "reject-new"
		});
		if (!receiptStore.withCurrent) return {
			changes,
			warnings: ["WhatsApp credential import requires current offline storage authority. Update OpenClaw core and rerun Doctor; original credentials remain unchanged."]
		};
		const receipts = receiptStore.withCurrent({ assertCurrent });
		const sourceIdentity = legacy.backup.snapshot.sha256;
		const previous = await receipts.lookup(sourceIdentity);
		if (previous && (!canonical || previous.targetDigest !== credentialSetDigest(targetFiles))) return {
			changes,
			warnings: ["WhatsApp credential migration previously started, but its complete canonical credential set is absent or changed. Kept source files and backups; restore the complete intended account or select its authDir explicitly. Doctor will not recreate credentials after logout."],
			...canonical ? { warningDisposition: "recoverable" } : {}
		};
		if (!canonical) {
			const sourceNames = new Set(sources.map((source) => source.name));
			if (targetNames.some((name) => isWhatsAppBaileysAuthFileName(name) && !sourceNames.has(name))) return {
				changes,
				warnings: ["WhatsApp default account contains unmatched auth files without creds.json. Kept the incomplete account and legacy credentials separate; choose the intended credential set before retrying Doctor."]
			};
		}
		for (const { source, backup } of backups) {
			const relativePath = path.join(targetDir, source.name);
			if (await credentials.exists(relativePath) && !(await credentials.read(relativePath)).buffer.equals(backup.bytes)) return {
				changes,
				warnings: [`WhatsApp auth ${source.name} differs between the default account and legacy shared root. Kept both copies and a private .migrated backup; choose the intended credential set before retrying Doctor.`],
				...canonical ? { warningDisposition: "recoverable" } : {}
			};
		}
		if (!previous) {
			const expected = new Map(targetFiles);
			for (const { source, backup } of backups) {
				backup.assertUnchanged();
				expected.set(source.name, backup.snapshot.sha256);
			}
			if (!await receipts.registerIfAbsent(sourceIdentity, { targetDigest: credentialSetDigest(expected) })) throw new Error("WhatsApp credential migration receipt changed; rerun Doctor.");
		}
		await credentials.mkdir(targetDir, { private: true });
		const targets = [];
		for (const { source, backup } of backups) {
			backup.assertUnchanged();
			const relativePath = path.join(targetDir, source.name);
			if (!await credentials.exists(relativePath)) await credentials.create(relativePath, backup.bytes, {
				atomic: true,
				durable: true,
				mode: 384,
				private: true
			});
			const target = await credentials.read(relativePath);
			if (!target.buffer.equals(backup.bytes)) throw new Error("WhatsApp canonical credentials changed during import; original files retained.");
			targets.push({
				source,
				backup,
				target,
				targetPath: path.join(params.oauthDir, relativePath)
			});
		}
		for (const { source, backup, target, targetPath } of targets) {
			backup.removeSource(() => {
				assertCurrent();
				assertNoSymlinkParentsSync({
					rootDir: params.oauthDir,
					targetPath: path.dirname(targetPath),
					requireDirectories: true
				});
				const current = readRegularFileSync({ filePath: targetPath });
				if (current.stat.dev !== target.stat.dev || current.stat.ino !== target.stat.ino || !current.buffer.equals(target.buffer)) throw new Error("WhatsApp canonical credentials changed during import; original backup retained.");
			});
			changes.push(`Moved WhatsApp auth ${source.name} into the default account; backup: ${backup.backupPath}`);
		}
		return {
			changes,
			warnings
		};
	}
};
//#endregion
//#region extensions/whatsapp/src/doctor-contract.ts
const streamingAliasMigration = (0, runtime_doctor_migrations_exports.defineChannelAliasMigration)({
	channelId: "whatsapp",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingInheritsDefaultAccount: true
});
const hasAckReaction = (value) => Boolean((0, runtime_doctor_migrations_exports.asObjectRecord)((0, runtime_doctor_migrations_exports.asObjectRecord)(value)?.ackReaction));
const legacyDefaultPolicyKeys = /* @__PURE__ */ new Set([
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom"
]);
function hasPossibleLeftoverDefault(cfg) {
	const channel = (0, runtime_doctor_migrations_exports.asObjectRecord)(cfg.channels?.whatsapp);
	const accounts = (0, runtime_doctor_migrations_exports.asObjectRecord)(channel?.accounts);
	const fallback = (0, runtime_doctor_migrations_exports.asObjectRecord)(accounts?.default);
	if (!channel || !accounts || !fallback || channel.authDir !== void 0 || typeof channel.defaultAccount === "string" && channel.defaultAccount.trim().toLowerCase() === "default" || Object.keys(accounts).length < 2) return false;
	const keys = Object.keys(fallback);
	if (keys.length === 0 || keys.some((key) => !legacyDefaultPolicyKeys.has(key)) || Object.values(accounts).some((account) => !(0, runtime_doctor_migrations_exports.asObjectRecord)(account)) || cfg.bindings?.some((binding) => binding.match.channel.trim().toLowerCase() === "whatsapp" && binding.match.accountId?.trim().toLowerCase() === "default")) return false;
	const oauthDir = resolveOAuthDir();
	for (const dir of [oauthDir, path.join(oauthDir, "whatsapp", "default")]) try {
		if (fs.readdirSync(dir).some(isWhatsAppBaileysAuthFileName)) return false;
	} catch (error) {
		if ((0, runtime_doctor_migrations_exports.asObjectRecord)(error)?.code !== "ENOENT") return false;
	}
	return true;
}
function collectDefaultAccountWarnings(cfg) {
	if (!hasPossibleLeftoverDefault(cfg)) return [];
	const namedAccountId = listAccountIds(cfg).find((id) => id !== "default" && normalizeOptionalAccountId(id) === id);
	if (!namedAccountId) return [];
	const currentAccountId = resolveDefaultWhatsAppAccountId(cfg);
	return [`channels.whatsapp.accounts.default contains only shared policy and has no detected credentials. It may be a leftover of an earlier Doctor migration or an intentional account awaiting login. Unqualified WhatsApp operations currently select "${currentAccountId}". Doctor left all accounts and routing unchanged. To select a named account while keeping all accounts and shared policy, run \`openclaw config set channels.whatsapp.defaultAccount '${JSON.stringify(currentAccountId === "default" ? namedAccountId : currentAccountId)}' --strict-json\`. Only if "default" is unwanted, preserve any shared policy you still need, then run \`openclaw channels remove --channel whatsapp --account default --delete\`.`];
}
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: [
			"channels",
			"whatsapp",
			"ackReaction"
		],
		message: "channels.whatsapp.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\".",
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, hasAckReaction)
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const ackReaction = normalizeCompatibilityConfig$1({ cfg });
	const normalized = streamingAliasMigration.normalizeChannelConfig({
		cfg: ackReaction.config,
		changes: ackReaction.changes
	});
	const warnings = collectDefaultAccountWarnings(normalized.config);
	return {
		...normalized,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
//#region extensions/whatsapp/doctor-contract-api.ts
const stateMigrations = [whatsappLegacyStateMigration];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
