import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { c as isNamedProfile, g as resolveDefaultConfigCandidates, m as resolveConfigPath, p as resolveCanonicalConfigPath } from "./paths-orClZ-2Z.mjs";
import { Et as _enum, Jn as string, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-N5UzY_DG.mjs";
import { c as sha256File, i as pinDirectory } from "./directory-durability-B2RKADOj.mjs";
import { r as sameUpdateRunDriver, t as inspectUpdateRunDriver } from "./update-run-driver-CPVdsIOp.mjs";
import { c as recordedUpdateRunDrivers } from "./update-run-activity-B_OeQT4u.mjs";
import { a as getUpdateRunAsync } from "./update-run-reader-BOC3s3Sk.mjs";
import { r as resolveUpdateCaptureRoot } from "./update-capture-paths-KB4ru3JI.mjs";
import { i as parseUpdateRecoveryBackupManifest } from "./backup-verify-manifest-OCDSc6Go.mjs";
import { c as resolveLegacyStateDirMigrationCandidates } from "./state-migrations.state-dir-ClPpou0a.mjs";
import { i as hasPendingUpdateRecoverySeal, r as assertUpdateRecoverySealComplete, t as canonicalEntryPath } from "./update-recovery-path-CMEBglNY.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-recovery-backup-reader.ts
const updateRecoveryBackupRefSchema = strictObject({
	directory: string().min(1),
	manifestPath: string().min(1),
	manifestSha256: string().regex(/^[a-f0-9]{64}$/u)
});
/** Inspection derives evidence from the sealed original, never from today's inventory. */
async function withVerifiedUpdateRecoveryBackup(ref, inspect) {
	return withRecoveryMetadata(ref, async ({ manifest, pin }) => {
		if (manifest.schemaVersion !== 2) throw new Error("Preservation inspection requires a versioned recovery inventory.");
		if (manifest.entries.length > 4096) throw new Error("Preservation inspection exceeds its 4096-resource bound.");
		const verify = async () => {
			for (const entry of manifest.entries) {
				if (entry.kind !== "file") continue;
				const pathname = path.join(ref.directory, entry.archivePath);
				if (entry.sqlite) {
					for (const suffix of SQLITE_SIDECAR_SUFFIXES) if (await statOrMissing(`${pathname}${suffix}`)) throw new Error(`Preservation requires a consolidated SQLite payload: ${entry.sourcePath}`);
				}
				const actual = await fileDigest(pathname);
				if (actual.sha256 !== entry.sha256 || actual.size !== entry.size) throw new Error(`Preservation payload does not match its manifest: ${entry.sourcePath}`);
			}
			await pin.assertCurrent();
		};
		await verify();
		const result = await inspect(manifest);
		await verify();
		const source = await root(ref.directory, {
			symlinks: "reject",
			hardlinks: "reject"
		});
		if (sha256Hex(await source.readBytes("manifest.json", { maxBytes: MAX_MANIFEST_BYTES })) !== ref.manifestSha256) throw new Error("Preservation manifest changed during inspection.");
		return result;
	});
}
const recordedOutcomeSchema = strictObject({
	status: _enum(["restored", "committed"]),
	error: string().max(4096).optional(),
	manifestSha256: string().regex(/^[a-f0-9]{64}$/u)
});
async function statOrMissing(pathname) {
	try {
		return await fs.lstat(pathname);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function fileDigest(pathname) {
	const source = await (await root(path.dirname(pathname))).open(path.basename(pathname), {
		symlinks: "reject",
		hardlinks: "reject"
	});
	try {
		const before = await source.handle.stat({ bigint: true });
		const hashed = await sha256File(source.handle);
		if (!sameFileMutationFingerprint(before, await source.handle.stat({ bigint: true }))) throw new Error(`Update recovery payload changed while reading: ${pathname}`);
		return {
			size: hashed.bytes,
			sha256: hashed.digest
		};
	} finally {
		await source.handle.close();
	}
}
const MAX_MANIFEST_BYTES = 134217728;
function captureScopes(env) {
	const selectedStateDir = resolvePathViaExistingAncestorSync(resolveStateDir(env));
	const selectedConfigPath = canonicalEntryPath(resolveConfigPath(env));
	const scopes = /* @__PURE__ */ new Map([[selectedStateDir, /* @__PURE__ */ new Set([selectedConfigPath])]]);
	if (isNamedProfile(env)) return scopes;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	const migrations = resolveLegacyStateDirMigrationCandidates({
		env,
		homedir
	}).map(({ source, target }) => ({
		source: canonicalEntryPath(source),
		target: canonicalEntryPath(target)
	})).filter(({ source, target }) => selectedStateDir === source || selectedStateDir === target);
	for (const { source, target } of migrations) {
		if (selectedStateDir !== target) continue;
		const relative = path.relative(target, selectedConfigPath);
		const movedConfig = !path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`) ? path.join(source, relative) : selectedConfigPath;
		scopes.set(source, /* @__PURE__ */ new Set([movedConfig]));
	}
	if (migrations.length > 0 && !env.OPENCLAW_CONFIG_PATH?.trim() && selectedConfigPath === canonicalEntryPath(resolveCanonicalConfigPath(env, selectedStateDir))) for (const candidate of resolveDefaultConfigCandidates(env, homedir)) {
		const stateDir = canonicalEntryPath(path.dirname(candidate));
		scopes.get(stateDir)?.add(path.join(stateDir, path.basename(candidate)));
	}
	return scopes;
}
function assertManifestSelectedScope(manifest, scopes) {
	if (!scopes.get(manifest.stateDir)?.has(manifest.configPath)) throw new Error("Update recovery backup belongs to another selected state or configuration.");
}
function captureDirectory(runId, stateDir) {
	return path.join(resolveUpdateCaptureRoot(stateDir), runId);
}
const MAX_UPDATE_RECOVERY_OUTCOME_BYTES = 16384;
function assertManifestLocation(ref, manifest) {
	if (ref.directory !== (manifest.generation && manifest.generation.kind !== "baseline" ? path.join(captureDirectory(manifest.runId, manifest.stateDir), manifest.generation.kind) : captureDirectory(manifest.runId, manifest.stateDir))) throw new Error("Update recovery backup belongs to another state directory or update run.");
}
/**
* The recorded locator must name the pinned directory itself, not a link to it.
* pinDirectory opened this exact locator, and the pin revalidates its retained
* exact identity, so no realpath spelling comparison is needed: Windows short
* (8.3) names, letter case, and symlinked ancestors spell one directory
* differently.
*/
async function assertPinnedDirectoryAt(pin, directory, message) {
	if (!(await fs.lstat(directory)).isDirectory()) throw new Error(message);
	await pin.assertCurrent();
}
async function withRecoveryMetadata(location, run, assertOwned) {
	assertOwned?.();
	updateRecoveryBackupRefSchema.partial({ manifestSha256: true }).parse(location);
	if (path.resolve(location.directory) !== location.directory || location.manifestPath !== path.join(location.directory, "manifest.json")) throw new Error("Invalid update recovery manifest locator.");
	const pin = await pinDirectory(location.directory);
	try {
		assertOwned?.();
		await assertPinnedDirectoryAt(pin, location.directory, "Update recovery capture changed location.");
		await assertUpdateRecoverySealComplete(location.directory);
		const source = await root(location.directory, {
			symlinks: "reject",
			hardlinks: "reject"
		});
		assertOwned?.();
		const bytes = await source.readBytes("manifest.json", { maxBytes: MAX_MANIFEST_BYTES });
		assertOwned?.();
		const ref = {
			...location,
			manifestSha256: sha256Hex(bytes)
		};
		if (location.manifestSha256 !== void 0 && ref.manifestSha256 !== location.manifestSha256) throw new Error("Update recovery manifest changed before metadata access.");
		const manifest = parseUpdateRecoveryBackupManifest(bytes.toString("utf8"));
		assertManifestLocation(ref, manifest);
		let outcome;
		const outcomeEntry = await statOrMissing(path.join(ref.directory, "outcome.json"));
		assertOwned?.();
		if (outcomeEntry) {
			outcome = recordedOutcomeSchema.parse(await source.readJson("outcome.json", { maxBytes: MAX_UPDATE_RECOVERY_OUTCOME_BYTES }));
			assertOwned?.();
			if (outcome.manifestSha256 !== ref.manifestSha256) throw new Error("Update recovery outcome refers to another manifest.");
		}
		await pin.assertCurrent();
		await assertUpdateRecoverySealComplete(location.directory);
		assertOwned?.();
		return await run({
			ref,
			manifest,
			outcome,
			pin
		});
	} finally {
		await pin.close();
	}
}
/** Bind retained crash/refusal evidence without claiming it is a sealed or restorable generation. */
async function fingerprintIncompleteRecoveryGeneration(directory) {
	const observed = /* @__PURE__ */ new Map();
	const inventory = [];
	const walk = async (current) => {
		const pin = await pinDirectory(current);
		try {
			await assertPinnedDirectoryAt(pin, current, "Incomplete recovery generation changed location.");
			const before = await fs.lstat(current, { bigint: true });
			observed.set(current, before);
			const entries = (await (await root(current)).list("", { withFileTypes: true })).toSorted((a, b) => a.name.localeCompare(b.name));
			for (const entry of entries) {
				const pathname = path.join(current, entry.name);
				if (entry.isDirectory) await walk(pathname);
				else if (entry.isFile) {
					const identity = await fs.lstat(pathname, { bigint: true });
					observed.set(pathname, identity);
					inventory.push([path.relative(directory, pathname), await fileDigest(pathname)]);
				} else throw new Error("Incomplete recovery generation contains an unsupported file kind.");
			}
			await pin.assertCurrent();
		} finally {
			await pin.close();
		}
	};
	await walk(directory);
	for (const [pathname, before] of observed) {
		const after = await fs.lstat(pathname, { bigint: true });
		if (!sameFileMutationFingerprint(before, after) || before.mode !== after.mode) throw new Error("Incomplete recovery generation changed while binding its evidence.");
		inventory.push([path.relative(directory, pathname), [
			before.dev,
			before.ino,
			before.mode,
			before.size,
			before.birthtimeNs,
			before.mtimeNs,
			before.ctimeNs
		].map(String)]);
	}
	return sha256Hex(JSON.stringify(inventory));
}
/** This records repair of current state, never reverse publication or permission to delete B/C/T. */
async function readBinding(ref) {
	return withRecoveryMetadata(ref, async ({ manifest, outcome, pin }) => {
		const run = await getUpdateRunAsync(manifest.runId);
		const capture = run?.origin.updateRecoveryCapture;
		if (outcome || run?.status !== "failed" || run.finishedAtMs === null || !capture || capture.manifestSha256 !== ref.manifestSha256 || capture.restored || capture.retirement || manifest.schemaVersion !== 2 || manifest.generation?.kind !== "baseline") throw new Error("Forward recovery requires the same failed run and unresolved baseline.");
		const generations = {
			candidateSha256: null,
			preparedSha256: null
		};
		const incompleteGenerations = {};
		for (const kind of ["candidate", "prepared"]) {
			const directory = path.join(ref.directory, kind);
			if (!await statOrMissing(directory)) continue;
			await assertUpdateRecoverySealComplete(directory);
			if (!await statOrMissing(path.join(directory, "manifest.json"))) {
				incompleteGenerations[kind] = await fingerprintIncompleteRecoveryGeneration(directory);
				continue;
			}
			const raw = await (await root(directory)).readBytes("manifest.json", {
				maxBytes: MAX_MANIFEST_BYTES,
				symlinks: "reject",
				hardlinks: "reject"
			});
			let generation;
			try {
				generation = parseUpdateRecoveryBackupManifest(raw.toString("utf8"));
			} catch (error) {
				if (!(error instanceof SyntaxError)) throw error;
				incompleteGenerations[kind] = await fingerprintIncompleteRecoveryGeneration(directory);
				continue;
			}
			if (generation.runId !== manifest.runId || generation.installRoot !== manifest.installRoot || generation.stateDir !== manifest.stateDir || generation.configPath !== manifest.configPath || generation.generation?.kind !== kind || generation.generation.baselineSha256 !== ref.manifestSha256 || generation.generation.kind === "prepared" && generation.generation.candidateSha256 !== generations.candidateSha256) throw new Error("Forward recovery generation identity changed.");
			generations[`${kind}Sha256`] = sha256Hex(raw);
		}
		await pin.assertCurrent();
		return {
			runId: manifest.runId,
			failedAtMs: run.finishedAtMs,
			manifestSha256: ref.manifestSha256,
			installRoot: manifest.installRoot,
			stateDir: manifest.stateDir,
			configPath: manifest.configPath,
			...generations,
			...Object.keys(incompleteGenerations).length > 0 ? { incompleteGenerations } : {}
		};
	});
}
/** Missing receipt keeps admission closed. Malformed or contradictory receipts fail closed. */
async function hasUpdateRecoveryForwardResolution(ref) {
	return withRecoveryMetadata(ref, async ({ manifest, outcome }) => {
		const receipt = (await getUpdateRunAsync(manifest.runId))?.origin.updateRecoveryCapture?.forwardResolution;
		if (!receipt) return false;
		if (outcome || !isDeepStrictEqual(receipt.binding, await readBinding(ref))) throw new Error("Forward recovery receipt is stale or contradicts its failed capture.");
		return true;
	});
}
/** Read original capture identity only; payload validity and restoration authority are separate. */
async function readUpdateRecoveryBaselineIdentity(params) {
	if (!/^[a-zA-Z0-9_-]{1,128}$/u.test(params.runId)) throw new Error("Invalid original update capture run identity.");
	const expectedRef = params.ref ? updateRecoveryBackupRefSchema.parse(params.ref) : void 0;
	if (expectedRef && !params.installRoot?.trim()) throw new Error("An explicit original capture requires its admitted installation root.");
	params.assertCurrent();
	const scopes = captureScopes(params.env);
	const candidates = expectedRef ? [expectedRef.directory] : [...scopes.keys()].map((stateDir) => captureDirectory(params.runId, stateDir));
	const present = [];
	for (const directory of candidates) {
		const entry = await statOrMissing(directory);
		params.assertCurrent();
		if (!entry) continue;
		if (!entry.isDirectory()) throw new Error(`Original update capture is not a retained directory: ${directory}`);
		present.push(directory);
	}
	const [directory] = present;
	if (directory === void 0) {
		if (expectedRef) throw new Error("The admitted original update capture is unavailable.");
		return;
	}
	if (present.length !== 1) throw new Error("Multiple original update captures belong to this run; preserve all evidence.");
	let identity;
	const assertReuseCurrent = () => {
		params.assertCurrent();
		const run = params.readContinuation();
		if (!expectedRef && !run || run && (run.runId !== params.runId || run.status !== "running" || run.finishedAtMs !== null)) throw new Error("Original capture reuse requires the same live update continuation.");
		if (!identity) return;
		const { manifest, ref } = identity;
		assertManifestSelectedScope(manifest, scopes);
		const capture = run?.origin.updateRecoveryCapture;
		if (manifest.runId !== params.runId || manifest.schemaVersion !== 2 || manifest.generation?.kind !== "baseline" || params.installRoot !== void 0 && manifest.installRoot !== path.resolve(params.installRoot) || capture && (capture.manifestSha256 !== ref.manifestSha256 || capture.status !== "pending" || capture.restored || capture.retirement || capture.forwardResolution)) throw new Error("Original update capture identity or pending state changed.");
		if (!expectedRef && run) {
			const recorded = recordedUpdateRunDrivers(run);
			if (inspectUpdateRunDriver(manifest.creator) !== "dead" || manifest.drivers.some((driver) => !recorded.some((current) => sameUpdateRunDriver(driver, current))) || !manifest.drivers.some((driver) => inspectUpdateRunDriver(driver) === "alive")) throw new Error("Original update capture does not share its admitted live driver lineage.");
		}
	};
	const result = await withRecoveryMetadata(expectedRef ?? {
		directory,
		manifestPath: path.join(directory, "manifest.json")
	}, async ({ ref, manifest, outcome, pin }) => {
		identity = {
			ref,
			manifest
		};
		assertReuseCurrent();
		if (outcome) throw new Error("A terminal update capture cannot be reused as the original baseline.");
		for (const kind of ["candidate", "prepared"]) {
			const entry = await statOrMissing(path.join(directory, kind));
			assertReuseCurrent();
			if (entry) throw new Error("Original update capture already has later recovery generations.");
		}
		await pin.assertCurrent();
		assertReuseCurrent();
		return identity;
	}, assertReuseCurrent);
	assertReuseCurrent();
	return result;
}
async function readUpdateRecoveryBackups() {
	const result = [];
	const scopes = captureScopes(process.env);
	for (const stateDir of scopes.keys()) {
		const store = resolveUpdateCaptureRoot(stateDir);
		if (!await statOrMissing(store)) continue;
		for (const captureId of await fs.readdir(store)) {
			const directory = path.join(store, captureId);
			if (!(await statOrMissing(directory))?.isDirectory() || !(await statOrMissing(path.join(directory, ".openclaw-private-update-capture")))?.isFile()) continue;
			const manifestPath = path.join(directory, "manifest.json");
			const manifestEntry = await statOrMissing(manifestPath);
			if (/^[a-zA-Z0-9_-]{1,128}$/u.test(captureId) && (!manifestEntry || await hasPendingUpdateRecoverySeal(directory))) {
				result.push({
					kind: "incomplete",
					directory
				});
				continue;
			}
			if (!manifestEntry?.isFile()) throw new Error(`Unresolved update capture ${directory} has incomplete publication. Inspection only: openclaw update status --json; npx openclaw@latest doctor --fix. Earlier captures are retained.`);
			const source = await root(directory, {
				symlinks: "reject",
				hardlinks: "reject"
			});
			const raw = await source.readText("manifest.json", { maxBytes: MAX_MANIFEST_BYTES });
			const manifest = parseUpdateRecoveryBackupManifest(raw);
			const ref = {
				directory,
				manifestPath,
				manifestSha256: sha256Hex(raw)
			};
			assertManifestLocation(ref, manifest);
			assertManifestSelectedScope(manifest, scopes);
			const capture = (await getUpdateRunAsync(manifest.runId))?.origin.updateRecoveryCapture;
			if (capture && capture.manifestSha256 !== ref.manifestSha256) throw new Error(`Update capture identity changed: ${manifestPath}. Inspect with openclaw update status --json; npx openclaw@latest doctor --fix.`);
			const terminalPath = path.join(directory, "outcome.json");
			let outcome;
			if (await statOrMissing(terminalPath)) {
				const terminal = recordedOutcomeSchema.parse(await source.readJson("outcome.json", { maxBytes: MAX_UPDATE_RECOVERY_OUTCOME_BYTES }));
				if (terminal.manifestSha256 !== ref.manifestSha256) throw new Error(`Update recovery outcome refers to another manifest: ${manifestPath}`);
				outcome = terminal;
			} else outcome = {
				status: capture?.status ?? "pending",
				error: capture?.error
			};
			result.push({
				kind: "sealed",
				ref,
				manifest,
				outcome
			});
		}
	}
	return result.toSorted((a, b) => {
		if (a.kind === "incomplete") return b.kind === "incomplete" ? a.directory.localeCompare(b.directory) : 1;
		return b.kind === "incomplete" ? -1 : b.manifest.createdAt.localeCompare(a.manifest.createdAt);
	});
}
//#endregion
export { withVerifiedUpdateRecoveryBackup as a, readUpdateRecoveryBaselineIdentity as i, hasUpdateRecoveryForwardResolution as n, readUpdateRecoveryBackups as r, captureScopes as t };
