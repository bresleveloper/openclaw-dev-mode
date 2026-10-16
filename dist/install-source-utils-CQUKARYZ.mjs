import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord, n as asNullableObjectRecord, o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as resolveNpmJsonEntries } from "./npm-json-output-Z3qrSjbB.mjs";
import { o as parseRegistryNpmSpec, r as isExactSemverVersion } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { o as resolveNpmCommand, t as applyNpmFreshnessBypassEnv } from "./npm-install-env-CROOzau_.mjs";
import { r as parseNpmErrorCode } from "./npm-error-DcU9_CMV.mjs";
import { f as resolveArchiveKind } from "./archive-DqZZMnnW.mjs";
import { n as resolveInstallWorkTimeoutMs } from "./install-mode-options-HTpLEgtT.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { gt, satisfies, validRange } from "semver";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/infra/install-source-utils.ts
function formatNpmCommandFailureOutput(result) {
	const detail = result.stderr.trim() || result.stdout.trim();
	if (detail) return detail;
	if (result.termination === "timeout" || result.termination === "no-output-timeout") return `termination ${result.termination} (no output from npm)`;
	if (result.termination === "exit" && result.code !== null) return `exit code ${result.code} (no output from npm)`;
	if (result.signal) return `signal ${result.signal} (no output from npm)`;
	return `termination ${result.termination} (no output from npm)`;
}
/** Converts npm resolution metadata into stable result field names. */
function buildNpmResolutionFields(resolution) {
	return {
		resolvedName: resolution?.name,
		resolvedVersion: resolution?.version,
		resolvedSpec: resolution?.resolvedSpec,
		integrity: resolution?.integrity,
		shasum: resolution?.shasum,
		resolvedAt: resolution?.resolvedAt
	};
}
/** Creates a script-free npm environment for metadata and pack commands. */
function createNpmMetadataEnv(scope = {}) {
	const env = {
		COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
		NPM_CONFIG_IGNORE_SCRIPTS: "true"
	};
	applyNpmFreshnessBypassEnv(env, /* @__PURE__ */ new Date(), scope);
	return env;
}
async function loadNpmPackageVersions({ packageName, timeoutMs, ...commandOptions }) {
	const versions = await runCommandWithTimeout(resolveNpmCommand([
		"view",
		packageName,
		"versions",
		"--json"
	]), {
		...commandOptions,
		timeoutMs: Math.max(timeoutMs ?? 0, 6e4),
		env: createNpmMetadataEnv()
	});
	if (versions.code !== 0) return null;
	let parsed;
	try {
		parsed = JSON.parse(versions.stdout.trim());
	} catch {
		return null;
	}
	return (Array.isArray(parsed) ? parsed : [parsed]).filter((value) => typeof value === "string" && isExactSemverVersion(value));
}
function resolveNpmSpecVersionSelector(spec) {
	const separator = spec.lastIndexOf("@");
	return separator > 0 ? normalizeOptionalString(spec.slice(separator + 1)) : void 0;
}
function selectNpmViewMetadataEntry(value, spec) {
	if (!Array.isArray(value)) return value;
	const entries = value.filter(isRecord);
	if (entries.length === 1 && parseRegistryNpmSpec(spec)?.selectorKind === "tag") return entries[0];
	const selector = resolveNpmSpecVersionSelector(spec);
	const range = selector ? validRange(selector) : null;
	if (range) {
		let best;
		for (const entry of entries) {
			const version = normalizeOptionalString(entry.version);
			if (!version || !satisfies(version, range)) continue;
			if (!best || gt(version, best.version)) best = {
				entry,
				version
			};
		}
		return best?.entry;
	}
	return entries.at(-1);
}
function normalizeNpmViewMetadata(value, spec) {
	const entry = selectNpmViewMetadataEntry(value, spec);
	if (!isRecord(entry)) return null;
	const name = normalizeOptionalString(entry.name);
	const version = normalizeOptionalString(entry.version);
	const resolvedSpec = name && version ? `${name}@${version}` : void 0;
	const dist = asRecord(entry.dist);
	return {
		name,
		version,
		resolvedSpec,
		integrity: normalizeOptionalString(entry["dist.integrity"]) ?? normalizeOptionalString(dist.integrity),
		shasum: normalizeOptionalString(entry["dist.shasum"]) ?? normalizeOptionalString(dist.shasum),
		...isRecord(entry.openclaw) ? { packageOpenClaw: entry.openclaw } : {}
	};
}
async function resolveNpmSpecMetadata(params) {
	const res = await runCommandWithTimeout(resolveNpmCommand([
		"view",
		params.spec,
		"name",
		"version",
		"dist.integrity",
		"dist.shasum",
		"openclaw",
		"--json"
	]), {
		timeoutMs: Math.max(params.timeoutMs ?? 6e4, 6e4),
		signal: params.signal,
		killProcessTree: true,
		env: createNpmMetadataEnv()
	});
	if (res.code !== 0) {
		const raw = formatNpmCommandFailureOutput(res);
		if (parseNpmErrorCode(raw) === "E404") return {
			ok: false,
			error: `Package not found on npm: ${params.spec}. See https://docs.openclaw.ai/tools/plugin for installable plugins.`
		};
		return {
			ok: false,
			error: `npm view failed: ${raw}`,
			category: "metadata-env"
		};
	}
	try {
		const metadata = normalizeNpmViewMetadata(JSON.parse(res.stdout.trim()), params.spec);
		if (!metadata?.name || !metadata.version) return {
			ok: false,
			error: `npm view produced incomplete package metadata (missing: ${[!metadata?.name ? "name" : null, !metadata?.version ? "version" : null].filter((field) => field !== null).join(", ")})`,
			category: "metadata-env"
		};
		return {
			ok: true,
			metadata
		};
	} catch (err) {
		return {
			ok: false,
			error: `npm view produced invalid JSON: ${String(err)}`,
			category: "metadata-env"
		};
	}
}
/** Runs a callback in a private temp directory and removes it afterward. */
async function withInstallWorkspace(prefix, fn, options) {
	const rootDir = options?.rootDir ?? resolvePreferredOpenClawTmpDir();
	return await withTempWorkspace({
		rootDir,
		prefix
	}, async (tmp) => fn(tmp.dir));
}
/** Resolves and validates a user-supplied archive path before extraction. */
async function resolveArchiveSourcePath(archivePath) {
	const resolved = resolveUserPath(archivePath);
	if (!await pathExists(resolved)) return {
		ok: false,
		error: `archive not found: ${resolved}`
	};
	if (!resolveArchiveKind(resolved)) return {
		ok: false,
		error: `unsupported archive: ${resolved}`
	};
	return {
		ok: true,
		path: resolved
	};
}
function parseResolvedSpecFromId(id) {
	const at = id.lastIndexOf("@");
	if (at <= 0 || at >= id.length - 1) return;
	const name = id.slice(0, at).trim();
	const version = id.slice(at + 1).trim();
	if (!name || !version) return;
	return `${name}@${version}`;
}
function normalizeNpmPackEntry(entry) {
	const rec = asNullableObjectRecord(entry);
	if (!rec) return null;
	const name = normalizeOptionalString(rec.name);
	const version = normalizeOptionalString(rec.version);
	const id = normalizeOptionalString(rec.id);
	const resolvedSpec = (name && version ? `${name}@${version}` : void 0) ?? (id ? parseResolvedSpecFromId(id) : void 0);
	return {
		filename: normalizeOptionalString(rec.filename),
		metadata: {
			name,
			version,
			resolvedSpec,
			integrity: normalizeOptionalString(rec.integrity),
			shasum: normalizeOptionalString(rec.shasum)
		}
	};
}
function parseNpmPackJsonOutput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const candidates = [trimmed];
	const arrayStart = trimmed.indexOf("[");
	if (arrayStart > 0) candidates.push(trimmed.slice(arrayStart));
	for (const candidate of candidates) {
		let parsed;
		try {
			parsed = JSON.parse(candidate);
		} catch {
			continue;
		}
		const entries = resolveNpmJsonEntries(parsed);
		let fallback = null;
		for (let i = entries.length - 1; i >= 0; i -= 1) {
			const normalized = normalizeNpmPackEntry(entries[i]);
			if (!normalized) continue;
			if (!fallback) fallback = normalized;
			if (normalized.filename) return normalized;
		}
		if (fallback) return fallback;
	}
	return null;
}
async function findPackedArchiveInDir(cwd) {
	const archives = (await fs.readdir(cwd, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile() && entry.name.endsWith(".tgz"));
	return archives.length === 1 ? archives[0]?.name : void 0;
}
/** Packs an npm spec into a tarball in `cwd` and returns archive metadata. */
async function packNpmSpecToArchive(params) {
	const res = await runCommandWithTimeout(resolveNpmCommand([
		"pack",
		params.spec,
		"--ignore-scripts",
		"--json",
		"--dry-run=false",
		`--pack-destination=${params.cwd}`
	]), {
		timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, Math.max(params.timeoutMs, 3e5)),
		signal: params.signal,
		killProcessTree: true,
		cwd: params.cwd,
		env: createNpmMetadataEnv({ npmConfigCwd: params.cwd })
	});
	if (res.code !== 0) {
		const raw = formatNpmCommandFailureOutput(res);
		if (parseNpmErrorCode(raw) === "E404") return {
			ok: false,
			error: `Package not found on npm: ${params.spec}. See https://docs.openclaw.ai/tools/plugin for installable plugins.`
		};
		return {
			ok: false,
			error: `npm pack failed: ${raw}`
		};
	}
	const parsedJson = parseNpmPackJsonOutput(res.stdout || "");
	const packed = parsedJson?.filename ?? await findPackedArchiveInDir(params.cwd);
	if (!packed) return {
		ok: false,
		error: "npm pack produced no archive"
	};
	const archivePath = path.isAbsolute(packed) ? packed : path.join(params.cwd, packed);
	if (!await pathExists(archivePath)) return {
		ok: false,
		error: "npm pack produced no archive"
	};
	return {
		ok: true,
		archivePath,
		metadata: parsedJson?.metadata ?? {}
	};
}
/**
* Reads package metadata from an existing npm archive using `npm pack --dry-run`.
* The archive path is validated first so callers get path errors before npm errors.
*/
async function resolveNpmPackArchiveMetadata(params) {
	const archivePathResult = await resolveArchiveSourcePath(params.archivePath);
	if (!archivePathResult.ok) return archivePathResult;
	const archivePath = archivePathResult.path;
	const archiveStat = await fs.stat(archivePath).catch(() => null);
	const archiveMetadataTimeoutMs = archiveStat && archiveStat.size > 104857600 ? 3e5 : 6e4;
	const res = await runCommandWithTimeout(resolveNpmCommand([
		"pack",
		archivePath,
		"--ignore-scripts",
		"--dry-run",
		"--json"
	]), {
		timeoutMs: Math.max(params.timeoutMs ?? archiveMetadataTimeoutMs, archiveMetadataTimeoutMs),
		signal: params.signal,
		killProcessTree: true,
		env: createNpmMetadataEnv()
	});
	if (res.code !== 0) return {
		ok: false,
		error: `npm pack metadata read failed: ${formatNpmCommandFailureOutput(res)}`
	};
	const parsedJson = parseNpmPackJsonOutput(res.stdout || "");
	if (!parsedJson?.metadata.name || !parsedJson.metadata.version) return {
		ok: false,
		error: "npm pack metadata read produced incomplete package metadata"
	};
	return {
		ok: true,
		archivePath,
		tarballName: parsedJson.filename ?? path.basename(archivePath),
		metadata: parsedJson.metadata
	};
}
//#endregion
export { packNpmSpecToArchive as a, resolveNpmSpecMetadata as c, normalizeNpmViewMetadata as i, withInstallWorkspace as l, formatNpmCommandFailureOutput as n, resolveArchiveSourcePath as o, loadNpmPackageVersions as r, resolveNpmPackArchiveMetadata as s, buildNpmResolutionFields as t };
