import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as classifyUnsupportedNodeCommand, c as isNodeVersionAtLeast, i as canRunOpenClawNodeDiagnostics, l as isSupportedOpenClawNodeVersion, o as formatUnsupportedNodeDiagnosticWarning, u as parseNodeReleaseVersion } from "./node-version-DdJ6cN09.mjs";
import { a as nodeRuntimeNote, i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities, r as isSqliteWalResetSafeVersion } from "./node-sqlite-DWn4GVXM.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import process from "node:process";
import { format } from "node:util";
//#region src/infra/runtime-guard.ts
const MINIMUM_BUN_VERSION = {
	major: 1,
	minor: 4,
	patch: 0
};
const MINIMUM_ENGINE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)\s*$/i;
const ENGINE_CLAUSE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)(?:\s+<\s*v?(\d+(?:\.\d+\.\d+)?))?\s*$/i;
const SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;
let diagnosticWarningPrinted = false;
/** Parses the first major/minor/patch triple from a runtime or package version label. */
function parseSemver(version) {
	if (!version) return null;
	const match = version.match(SEMVER_RE);
	if (!match) return null;
	const [, major, minor, patch] = match;
	return {
		major: Number.parseInt(expectDefined(major, "runtime guard major"), 10),
		minor: Number.parseInt(expectDefined(minor, "runtime guard minor"), 10),
		patch: Number.parseInt(expectDefined(patch, "runtime guard patch"), 10)
	};
}
/** Compares parsed semver triples against an inclusive minimum version. */
function isAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
/** Reads current process runtime metadata for startup support checks. */
async function detectRuntime() {
	const bunVersion = process.versions?.bun;
	const kind = bunVersion ? "bun" : process.versions?.node ? "node" : "unknown";
	const version = bunVersion ?? process.versions?.node ?? null;
	const execPath = process.execPath ?? null;
	const pathEnv = process.env.PATH ?? "(not set)";
	const sqlite = await detectCurrentRuntimeSqlite();
	return {
		kind,
		version,
		execPath,
		pathEnv,
		hasNodeSqlite: sqlite.available,
		sqliteVersion: sqlite.version,
		sqliteSelectionError: sqlite.selectionError,
		sqliteProbe: sqlite.probe
	};
}
async function detectCurrentRuntimeSqlite() {
	try {
		ensureSqliteLibrarySelected();
	} catch (error) {
		return {
			available: false,
			version: null,
			selectionError: error instanceof Error ? error.message : String(error)
		};
	}
	try {
		const probe = await detectCurrentSqliteCapabilities();
		return {
			available: probe.available,
			version: probe.version,
			probe
		};
	} catch {
		return {
			available: false,
			version: null
		};
	}
}
/** Returns whether a detected runtime meets OpenClaw's minimum runtime contract. */
function runtimeSatisfies(details) {
	if (details.sqliteSelectionError) return false;
	if (details.kind === "node") return Boolean(details.sqliteProbe && !nodeRuntimeFailure(details.version, details.sqliteProbe));
	if (details.kind === "bun") return isSupportedBunVersion(details.version) && details.hasNodeSqlite && details.sqliteVersion !== null && isSqliteWalResetSafeVersion(details.sqliteVersion);
	return false;
}
/** Returns whether the current process runtime satisfies OpenClaw's engine contract. */
async function isCurrentRuntimeSupported() {
	return runtimeSatisfies(await detectRuntime());
}
/** Checks a Node version label against OpenClaw's supported Node version range. */
function isSupportedNodeVersion(version) {
	return isSupportedOpenClawNodeVersion(version);
}
/** Checks a Bun version label against OpenClaw's minimum supported release. */
function isSupportedBunVersion(version) {
	return isAtLeast(parseSemver(version), MINIMUM_BUN_VERSION);
}
/** Parses simple package `engines.node` ranges of the form `>=x.y.z`. */
function parseMinimumNodeEngine(engine) {
	if (!engine) return null;
	const match = engine.match(MINIMUM_ENGINE_RE);
	if (!match) return null;
	return parseSemver(match[1] ?? null);
}
/** Returns whether a Node version satisfies a supported engine range, or null if unsupported. */
function nodeVersionSatisfiesEngine(version, engine) {
	const minimum = parseMinimumNodeEngine(engine);
	if (minimum) return isNodeVersionAtLeast(parseNodeReleaseVersion(version), minimum);
	if (!engine) return null;
	const parsed = parseNodeReleaseVersion(version);
	if (!parsed) return false;
	const clauses = engine.split("||");
	let satisfied = false;
	for (const clause of clauses) {
		const match = clause.match(ENGINE_CLAUSE_RE);
		if (!match) return null;
		const clauseMinimum = parseSemver(match[1] ?? null);
		const upperRaw = match[2];
		const upper = upperRaw ? parseSemver(upperRaw.includes(".") ? upperRaw : `${upperRaw}.0.0`) : null;
		if (!clauseMinimum || upperRaw && !upper) return null;
		if (isAtLeast(parsed, clauseMinimum) && (!upper || !isAtLeast(parsed, upper))) satisfied = true;
	}
	return satisfied;
}
/** Exits through the provided runtime when the current Node runtime is unsupported. */
async function assertSupportedRuntime(providedRuntime, providedDetails, argv, emitDiagnosticWarning = true, recoveryEnv) {
	const details = providedDetails ?? await detectRuntime();
	if (runtimeSatisfies(details)) {
		const note = details.kind === "node" && details.sqliteProbe ? nodeRuntimeNote(details.version, details.sqliteProbe) : null;
		if (note) {
			if (providedRuntime) providedRuntime.error(note);
			else process.stderr.write(`${note}\n`);
		}
		return;
	}
	if (details.kind === "node" && argv && recoveryEnv) {
		const { recoverNodeRuntime } = await import("./node-runtime-recovery-DLm64sza.mjs");
		await recoverNodeRuntime({ env: recoveryEnv });
	}
	if (details.kind === "node" && canRunOpenClawNodeDiagnostics(details.version, details.hasNodeSqlite) && argv && classifyUnsupportedNodeCommand(argv)) {
		if (emitDiagnosticWarning && !diagnosticWarningPrinted) {
			const warning = formatUnsupportedNodeDiagnosticWarning(details.version);
			if (providedRuntime) providedRuntime.error(warning);
			else process.stderr.write(`${warning}\n`);
			diagnosticWarningPrinted = true;
		}
		return;
	}
	let runtime = providedRuntime;
	if (!runtime) {
		const { formatConsoleDiagnosticBlock } = await import("./json-console-line-BzCCANfr.mjs");
		runtime = {
			log: (...args) => console.log(...args),
			error: (...args) => {
				const message = format(...args);
				process.stderr.write(formatConsoleDiagnosticBlock({
					level: "error",
					message: `${message}\n`
				}));
			},
			exit: (code) => process.exit(code)
		};
	}
	const versionLabel = details.version ?? "unknown";
	const runtimeLabel = details.kind === "unknown" ? "unknown runtime" : `${details.kind} ${versionLabel}`;
	const execLabel = details.execPath ?? "unknown";
	if (details.sqliteSelectionError) {
		runtime.error(`${details.sqliteSelectionError}\nDetected: ${runtimeLabel} (exec: ${execLabel}).`);
		runtime.exit(1);
		return;
	}
	const requirement = details.kind === "bun" ? "openclaw requires Bun 1.4 or newer with WAL-reset-safe node:sqlite (SQLite 3.51.3+ or a patched 3.50.x/3.44.x release)." : details.sqliteProbe && nodeRuntimeFailure(details.version, details.sqliteProbe) || "openclaw requires Node >=24.16.0 <25, or >=26.1.0.";
	const retryHint = details.kind === "bun" ? "Upgrade Bun or run OpenClaw with a supported Node release." : "Upgrade Node and re-run openclaw.";
	runtime.error([
		requirement,
		`Detected: ${runtimeLabel} (exec: ${execLabel}).`,
		...details.kind === "bun" ? [`Detected SQLite: ${details.sqliteVersion ?? "unavailable"}.`] : [],
		`PATH searched: ${details.pathEnv}`,
		details.kind === "bun" ? "Install Bun: https://bun.com/docs/installation" : "Install Node: https://nodejs.org/en/download",
		retryHint
	].join("\n"));
	runtime.exit(1);
}
//#endregion
export { isSupportedNodeVersion as a, isSupportedBunVersion as i, detectRuntime as n, nodeVersionSatisfiesEngine as o, isCurrentRuntimeSupported as r, parseSemver as s, assertSupportedRuntime as t };
