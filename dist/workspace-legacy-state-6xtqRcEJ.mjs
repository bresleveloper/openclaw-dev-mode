import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir, w as resolveLegacyStateDirs } from "./paths-DehQwyE0.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { c as resolveWorkspaceStateIdentity, o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-CmGr5k4K.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/workspace-legacy-state.ts
const LEGACY_WORKSPACE_STATE_DIRNAME = ".openclaw";
const LEGACY_WORKSPACE_STATE_FILENAME = "workspace-state.json";
const LEGACY_WORKSPACE_STATE_CURRENT_FILENAME = "openclaw-workspace-state.json";
const LEGACY_WORKSPACE_ATTESTATION_DIRNAME = "workspace-attestations";
const LEGACY_WORKSPACE_ATTESTATION_SUFFIX = ".attested";
const LEGACY_WORKSPACE_ATTESTATION_HEADER = "openclaw-workspace-attestation:v1";
const LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES = 2048;
const WORKSPACE_DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const checkedWorkspaceSourceSets = /* @__PURE__ */ new Set();
function uniqueSiblingPaths(paths) {
	const seen = /* @__PURE__ */ new Set();
	return paths.filter((candidate) => {
		let key = path.resolve(candidate);
		try {
			key = path.join(fs.realpathSync.native(path.dirname(candidate)), path.basename(candidate));
		} catch {}
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function resolveLegacyWorkspaceSourcePaths(workspaceDir, options) {
	const workspacePath = path.resolve(resolveUserPath(workspaceDir));
	const canonicalIdentity = resolveWorkspaceStateIdentity(workspaceDir);
	const canonicalDirectoryPath = resolveCanonicalWorkspacePath(workspaceDir);
	const workspaceKeys = [createHash("sha256").update(workspacePath).digest("hex"), canonicalIdentity.workspaceKey];
	const workspacePaths = [workspacePath, canonicalDirectoryPath];
	const env = options?.env ?? process.env;
	const stateDirs = [resolveStateDir(env, options?.homedir), ...resolveLegacyStateDirs(options?.homedir)];
	return {
		workspacePath,
		setupStatePaths: [path.join(canonicalDirectoryPath, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME), path.join(canonicalDirectoryPath, LEGACY_WORKSPACE_STATE_DIRNAME, LEGACY_WORKSPACE_STATE_FILENAME)],
		stateDirAttestationPaths: [...new Set(stateDirs)].flatMap((stateDir) => [...new Set(workspaceKeys)].map((workspaceKey) => path.join(stateDir, LEGACY_WORKSPACE_ATTESTATION_DIRNAME, `${workspaceKey}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))),
		siblingAttestationPaths: uniqueSiblingPaths([...new Set(workspacePaths)].map((candidate) => `${candidate}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))
	};
}
/** Share presence-only sibling ownership checks between runtime and Doctor. */
function legacyWorkspaceSiblingAttestationMayExist(filePath) {
	try {
		const before = fs.lstatSync(filePath);
		if (!before.isFile()) return false;
		const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		let fd;
		try {
			fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
		} catch {
			return true;
		}
		try {
			const opened = fs.fstatSync(fd);
			if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) return true;
			const expected = Buffer.from(`${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`, "utf8");
			const bytes = Buffer.alloc(expected.length);
			return fs.readSync(fd, bytes, 0, bytes.length, 0) === expected.length && bytes.equals(expected);
		} catch {
			return true;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return false;
	}
}
function findUnmigratedWorkspaceSource(sources) {
	const withClaims = (paths) => paths.flatMap((filePath) => [filePath, `${filePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`]);
	return withClaims([...sources.setupStatePaths, ...sources.stateDirAttestationPaths]).find(pathMayExistSync) ?? withClaims(sources.siblingAttestationPaths).find(legacyWorkspaceSiblingAttestationMayExist);
}
function workspaceMigrationError(blockedPaths, env, operation) {
	return new StartupMaintenanceRequiredError("legacy-workspace", operation === "doctor" ? formatDoctorStateRepairFailure(`Legacy workspace setup state requires migration at ${blockedPaths.join(", ")}`, "Stop the Gateway, then restore the retained setup file or claim from a verified backup.") : `Legacy workspace setup state requires migration for ${blockedPaths.join(", ")}; run ${formatCliCommand("openclaw doctor --fix", env)}.`);
}
/** Recheck lifecycle readiness without reusing a running turn's verified-absence cache. */
function assertWorkspaceStateMigrationReady(params) {
	const blocked = params.workspaceDirs.flatMap((workspaceDir) => {
		const sourcePath = findUnmigratedWorkspaceSource(resolveLegacyWorkspaceSourcePaths(workspaceDir, params));
		return sourcePath ? [params.operation === "doctor" ? sourcePath : workspaceDir] : [];
	});
	if (blocked.length > 0) throw workspaceMigrationError(blocked, params.env, params.operation);
}
/** Fail closed on unmigrated owned state without reading it as runtime data. */
function assertNoUnmigratedWorkspaceState(params) {
	const identity = resolveWorkspaceStateIdentity(params.workspaceDir);
	const sources = resolveLegacyWorkspaceSourcePaths(params.workspaceDir);
	const sourceSetKey = JSON.stringify([
		identity.workspaceKey,
		...sources.setupStatePaths,
		...sources.stateDirAttestationPaths,
		...sources.siblingAttestationPaths
	]);
	if (checkedWorkspaceSourceSets.has(sourceSetKey)) return;
	if (findUnmigratedWorkspaceSource(sources)) throw workspaceMigrationError([identity.workspacePath]);
	checkedWorkspaceSourceSets.add(sourceSetKey);
}
function resetLegacyWorkspaceStateCheckForTest() {
	checkedWorkspaceSourceSets.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.workspaceLegacyStateTestApi")] = { resetLegacyWorkspaceStateCheckForTest };
function isOwnedAttestationBuffer(buffer) {
	return buffer.subarray(0, 34).toString("utf8") === `${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`;
}
/** Capture canonical legacy paths before a destructive workspace removal. */
function prepareLegacyWorkspaceStateReset(workspaceDir, options) {
	const sources = resolveLegacyWorkspaceSourcePaths(workspaceDir, options);
	return { candidates: [
		...sources.setupStatePaths.map((sourcePath) => ({
			rootDir: sourcePath.endsWith("openclaw-workspace-state.json") ? path.dirname(sourcePath) : path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.stateDirAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.siblingAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(sourcePath),
			sourcePath,
			requireAttestationHeader: true
		}))
	].flatMap((candidate) => [candidate, {
		...candidate,
		sourcePath: `${candidate.sourcePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`,
		requireAttestationHeader: candidate.requireAttestationHeader
	}]) };
}
/** Discard retired workspace files from a pre-removal reset plan. */
async function removeLegacyWorkspaceStateForReset(plan, options) {
	const removedPaths = [];
	const warnings = [];
	for (const candidate of plan.candidates) {
		const rootDir = path.resolve(candidate.rootDir);
		const sourcePath = path.resolve(candidate.sourcePath);
		const relativePath = path.relative(rootDir, sourcePath);
		try {
			fs.lstatSync(rootDir);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			warnings.push(`Could not inspect retired workspace state at ${sourcePath}: ${String(error)}`);
			continue;
		}
		try {
			const sourceRoot = await root(rootDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES,
				symlinks: "reject"
			});
			if (!await sourceRoot.exists(relativePath)) continue;
			if (candidate.requireAttestationHeader) {
				if (!isOwnedAttestationBuffer((await sourceRoot.read(relativePath)).buffer)) continue;
			}
			if (!options?.dryRun) {
				options?.assertCurrent?.();
				await sourceRoot.remove(relativePath);
			}
			removedPaths.push(sourcePath);
		} catch (error) {
			warnings.push(`Could not remove retired workspace state at ${sourcePath}: ${String(error)}`);
		}
	}
	return {
		removedPaths,
		warnings
	};
}
//#endregion
export { LEGACY_WORKSPACE_STATE_DIRNAME as a, assertWorkspaceStateMigrationReady as c, removeLegacyWorkspaceStateForReset as d, resolveLegacyWorkspaceSourcePaths as f, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME as i, legacyWorkspaceSiblingAttestationMayExist as l, LEGACY_WORKSPACE_ATTESTATION_HEADER as n, WORKSPACE_DOCTOR_CLAIM_SUFFIX as o, LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES as r, assertNoUnmigratedWorkspaceState as s, LEGACY_WORKSPACE_ATTESTATION_DIRNAME as t, prepareLegacyWorkspaceStateReset as u };
