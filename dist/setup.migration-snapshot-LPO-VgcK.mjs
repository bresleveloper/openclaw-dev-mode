import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isNotFoundPathError } from "./path-guards-D5kuI0Tv.mjs";
import { a as readJsonFile } from "./json-files-C0HSMh2Z.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import crypto from "node:crypto";
//#region src/wizard/setup.migration-canonical.ts
function canonicalizeSetupMigrationValue(value) {
	if (Array.isArray(value)) return value.map(canonicalizeSetupMigrationValue);
	if (!value || typeof value !== "object") return value;
	const record = value;
	return Object.fromEntries(Object.keys(record).toSorted().filter((key) => record[key] !== void 0).map((key) => [key, canonicalizeSetupMigrationValue(record[key])]));
}
function hashSetupMigrationConfig(config) {
	return crypto.createHash("sha256").update(JSON.stringify(canonicalizeSetupMigrationValue(config))).digest("hex");
}
//#endregion
//#region src/wizard/setup.migration-snapshot.ts
const ONBOARDING_TARGET_LOCK_OPTIONS = {
	retries: {
		retries: 0,
		factor: 1,
		minTimeout: 1,
		maxTimeout: 1
	},
	stale: 18e5,
	staleRecovery: "remove-if-unchanged"
};
const activeSetupMigrationTargetLock = new AsyncLocalStorage();
const MEANINGFUL_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set([
	"$schema",
	"meta",
	"telemetry"
]);
const MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["securityAcknowledgedAt"]);
const MEANINGFUL_WORKSPACE_ENTRIES = [
	"AGENTS.md",
	"SOUL.md",
	"USER.md",
	"IDENTITY.md",
	"MEMORY.md",
	"skills"
];
const IMPORT_BLOCKING_STATE_ENTRIES = [
	"credentials",
	"sessions",
	"agents"
];
var SetupTargetLockedError = class extends Error {
	constructor(holderPid, profile, cause) {
		const target = profile ? `profile ${profile}` : "the current profile";
		const owner = holderPid === void 0 ? "" : ` (pid ${holderPid})`;
		super(`Another onboarding/config operation is running for ${target}${owner}. Finish or abort it, then re-run.`, { cause });
		this.holderPid = holderPid;
		this.code = "setup_target_locked";
		this.name = "SetupTargetLockedError";
	}
};
async function exists(candidate) {
	try {
		await fs$1.access(candidate);
		return true;
	} catch {
		return false;
	}
}
async function hasDirectoryEntries(candidate) {
	try {
		return (await fs$1.readdir(candidate)).length > 0;
	} catch {
		return false;
	}
}
function hasMeaningfulWizardConfig(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return true;
	return Object.keys(value).some((key) => !MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS.has(key));
}
function hasMeaningfulConfig(config) {
	return Object.entries(config).some(([key, value]) => {
		if (MEANINGFUL_CONFIG_IGNORED_KEYS.has(key)) return false;
		return key === "wizard" ? hasMeaningfulWizardConfig(value) : true;
	});
}
function buildSetupMigrationSnapshotConfig(config) {
	const snapshot = {};
	for (const [key, value] of Object.entries(config)) {
		if (MEANINGFUL_CONFIG_IGNORED_KEYS.has(key)) continue;
		if (key !== "wizard" || !value || typeof value !== "object" || Array.isArray(value)) {
			snapshot[key] = value;
			continue;
		}
		const wizard = Object.fromEntries(Object.entries(value).filter(([wizardKey]) => !MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS.has(wizardKey)));
		if (Object.keys(wizard).length > 0) snapshot[key] = wizard;
	}
	return snapshot;
}
async function inspectSetupMigrationFreshness(params) {
	const reasons = [];
	if (hasMeaningfulConfig(params.baseConfig)) reasons.push("existing config values are loaded");
	for (const entry of MEANINGFUL_WORKSPACE_ENTRIES) if (await exists(path.join(params.workspaceDir, entry))) reasons.push(`workspace ${entry} exists`);
	if (reasons.every((reason) => !reason.startsWith("workspace ")) && await hasDirectoryEntries(params.workspaceDir)) reasons.push("workspace directory is not empty");
	for (const entry of IMPORT_BLOCKING_STATE_ENTRIES) if (await hasDirectoryEntries(path.join(params.stateDir, entry))) reasons.push(`state ${entry}/ exists`);
	return {
		fresh: reasons.length === 0,
		reasons
	};
}
/** Preserve interactive consent decisions made before the import lock rereads config. */
function preserveSetupMigrationOnboardingConsents(config, inMemoryConfig) {
	const securityAcknowledgedAt = inMemoryConfig.wizard?.securityAcknowledgedAt;
	const preserveSecurity = securityAcknowledgedAt && !config.wizard?.securityAcknowledgedAt;
	const preserveTelemetry = inMemoryConfig.telemetry?.consentedAt && !config.telemetry?.consentedAt;
	if (!preserveSecurity && !preserveTelemetry) return config;
	return {
		...config,
		...preserveSecurity ? { wizard: {
			...config.wizard,
			securityAcknowledgedAt
		} } : {},
		...preserveTelemetry ? { telemetry: inMemoryConfig.telemetry } : {}
	};
}
async function hashTargetPath(hash, candidate, snapshotPath) {
	let stat;
	try {
		stat = await fs$1.lstat(candidate);
	} catch (error) {
		if (isNotFoundPathError(error)) {
			hash.update(`missing:${snapshotPath}\0`);
			return;
		}
		throw error;
	}
	if (stat.isSymbolicLink()) {
		hash.update(`symlink:${snapshotPath}\0${await fs$1.readlink(candidate)}\0`);
		return;
	}
	if (stat.isDirectory()) {
		hash.update(`directory:${snapshotPath}\0`);
		for (const entry of (await fs$1.readdir(candidate)).toSorted()) await hashTargetPath(hash, path.join(candidate, entry), `${snapshotPath}/${entry}`);
		return;
	}
	if (stat.isFile()) {
		hash.update(`file:${snapshotPath}\0${stat.size}\0`);
		for await (const chunk of createReadStream(candidate)) hash.update(chunk);
		hash.update("\0");
		return;
	}
	hash.update(`other:${snapshotPath}\0`);
}
async function hashSourcePath(hash, candidate, snapshotPath, followedRealPaths = /* @__PURE__ */ new Set()) {
	let stat;
	try {
		stat = await fs$1.lstat(candidate);
	} catch (error) {
		if (isNotFoundPathError(error)) {
			hash.update(`missing:${snapshotPath}\0`);
			return;
		}
		throw error;
	}
	if (stat.isSymbolicLink()) {
		hash.update(`symlink:${snapshotPath}\0${await fs$1.readlink(candidate)}\0`);
		let realPath;
		try {
			realPath = await fs$1.realpath(candidate);
		} catch (error) {
			hash.update(`unresolved:${error.code ?? "unknown"}\0`);
			return;
		}
		if (followedRealPaths.has(realPath)) {
			hash.update(`cycle:${snapshotPath}\0`);
			return;
		}
		followedRealPaths.add(realPath);
		await hashSourcePath(hash, realPath, `${snapshotPath}/referent`, followedRealPaths);
		followedRealPaths.delete(realPath);
		return;
	}
	if (stat.isDirectory()) {
		hash.update(`directory:${snapshotPath}\0`);
		for (const entry of (await fs$1.readdir(candidate)).toSorted()) await hashSourcePath(hash, path.join(candidate, entry), `${snapshotPath}/${entry}`, followedRealPaths);
		return;
	}
	if (stat.isFile()) {
		hash.update(`file:${snapshotPath}\0${stat.size}\0`);
		for await (const chunk of createReadStream(candidate)) hash.update(chunk);
		hash.update("\0");
		return;
	}
	hash.update(`other:${snapshotPath}\0`);
}
/** Hashes migration-owned target state without persisting raw paths or values. */
async function buildSetupMigrationTargetSnapshot(params) {
	const hash = crypto.createHash("sha256");
	const targetConfig = buildSetupMigrationSnapshotConfig(params.config);
	hash.update(`config:${JSON.stringify(canonicalizeSetupMigrationValue(targetConfig))}\0`);
	await hashTargetPath(hash, params.workspaceDir, "workspace");
	for (const entry of IMPORT_BLOCKING_STATE_ENTRIES) await hashTargetPath(hash, path.join(params.stateDir, entry), `state/${entry}`);
	return hash.digest("hex");
}
/** Hashes only source paths represented by the provider's concrete migration plan. */
async function buildSetupMigrationPlanSourceSnapshot(plan) {
	const hash = crypto.createHash("sha256");
	const itemSources = [...new Set(plan.items.map((item) => item.source?.trim()).filter((source) => Boolean(source)).map((source) => path.resolve(resolveUserPath(source))))].toSorted();
	const sources = [...new Set(itemSources.flatMap((source) => path.extname(source) === ".db" ? [
		source,
		`${source}-wal`,
		`${source}-shm`,
		`${source}-journal`
	] : [source]))].toSorted();
	for (const [index, source] of sources.entries()) await hashSourcePath(hash, source, `source/${index}`);
	return hash.digest("hex");
}
/** Verifies planning inputs and builds the exact provider-side-effect retry boundary. */
async function prepareSetupMigrationAttemptBoundary(params) {
	const currentTargetSnapshotHash = await buildSetupMigrationTargetSnapshot({
		config: params.currentConfig,
		stateDir: params.stateDir,
		workspaceDir: params.workspaceDir
	});
	if (currentTargetSnapshotHash !== params.expectedTargetSnapshotHash) throw new SetupMigrationTargetChangedError("Migration target changed while preparing the import. Review it and retry.");
	const sourceSnapshotHash = await buildSetupMigrationPlanSourceSnapshot(params.plan);
	if (sourceSnapshotHash !== params.expectedSourceSnapshotHash) throw new Error("Migration source changed while preparing the import. Review it and retry.");
	return {
		sourceSnapshotHash,
		preparedTargetSnapshotHash: currentTargetSnapshotHash,
		targetSnapshotHash: await buildSetupMigrationTargetSnapshot({
			config: params.targetConfig,
			stateDir: params.stateDir,
			workspaceDir: params.workspaceDir
		})
	};
}
/** Serializes onboarding writes that share one OpenClaw state target. */
async function withSetupMigrationTargetLock(stateDir, fn) {
	const resolvedStateDir = path.resolve(stateDir);
	const activeStateDir = activeSetupMigrationTargetLock.getStore();
	if (activeStateDir) {
		if (activeStateDir !== resolvedStateDir) throw new Error("nested onboarding target lock cannot switch the OpenClaw state directory");
		return await fn();
	}
	const migrationDir = path.join(resolvedStateDir, "migration");
	await fs$1.mkdir(migrationDir, {
		recursive: true,
		mode: 448
	});
	const lockTarget = path.join(migrationDir, "onboarding.lock-target");
	let acquired = false;
	try {
		return await withFileLock(lockTarget, ONBOARDING_TARGET_LOCK_OPTIONS, async () => {
			acquired = true;
			return await activeSetupMigrationTargetLock.run(resolvedStateDir, fn);
		});
	} catch (error) {
		if (acquired || error.code !== "file_lock_timeout") throw error;
		const pid = (await readJsonFile(`${lockTarget}.lock`, { maxBytes: 1024 }))?.pid;
		throw new SetupTargetLockedError(typeof pid === "number" && Number.isSafeInteger(pid) && pid > 0 ? pid : void 0, process.env.OPENCLAW_PROFILE?.trim(), error);
	}
}
function assertFreshSetupMigrationTarget(freshness) {
	if (freshness.fresh) return;
	throw new SetupMigrationFreshnessError([
		"Migration import during onboarding requires a fresh OpenClaw setup.",
		"Create a fresh setup or reset config, credentials, sessions, and workspace before importing.",
		"Backup plus overwrite/merge imports are feature-gated for now.",
		"Existing setup:",
		...freshness.reasons.map((reason) => `- ${reason}`)
	].join("\n"));
}
var SetupMigrationFreshnessError = class extends Error {};
var SetupMigrationTargetChangedError = class extends Error {};
//#endregion
export { buildSetupMigrationPlanSourceSnapshot as a, prepareSetupMigrationAttemptBoundary as c, hashSetupMigrationConfig as d, assertFreshSetupMigrationTarget as i, preserveSetupMigrationOnboardingConsents as l, SetupMigrationTargetChangedError as n, buildSetupMigrationTargetSnapshot as o, SetupTargetLockedError as r, inspectSetupMigrationFreshness as s, SetupMigrationFreshnessError as t, withSetupMigrationTargetLock as u };
