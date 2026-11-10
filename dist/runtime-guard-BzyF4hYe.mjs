import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { a as canRunOpenClawNodeDiagnostics, c as formatUnsupportedNodeDiagnosticWarning, f as parseNodeReleaseVersion, i as SUPPORTED_NODE_VERSION_RANGE, o as classifyUnsupportedNodeCommand, t as MINIMUM_BUN_VERSION, u as isNodeVersionAtLeast } from "./node-version-BfT-yCVT.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities, r as isSqliteWalResetSafeVersion } from "./node-sqlite-BvDyEHkZ.mjs";
import { a as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CYR1RYZS.mjs";
import process from "node:process";
import { format } from "node:util";
//#region src/infra/runtime-guard.ts
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
async function detectRuntime() {
	const bunVersion = process.versions?.bun;
	const details = {
		kind: bunVersion ? "bun" : process.versions?.node ? "node" : "unknown",
		version: bunVersion ?? process.versions?.node ?? null,
		execPath: process.execPath ?? null,
		pathEnv: process.env.PATH ?? "(not set)",
		hasNodeSqlite: false,
		sqliteVersion: null,
		sqliteSelectionError: void 0,
		sqliteProbe: void 0
	};
	try {
		ensureSqliteLibrarySelected();
	} catch (error) {
		details.sqliteSelectionError = error instanceof Error ? error.message : String(error);
		return details;
	}
	try {
		const probe = await detectCurrentSqliteCapabilities();
		details.hasNodeSqlite = probe.available;
		details.sqliteVersion = probe.version;
		details.sqliteProbe = probe;
	} catch {
		return details;
	}
	return details;
}
function runtimeSatisfies(details) {
	if (details.sqliteSelectionError) return false;
	if (details.kind === "node") return Boolean(details.sqliteProbe && !nodeRuntimeFailure(details.version, details.sqliteProbe));
	if (details.kind === "bun") return isSupportedBunVersion(details.version) && details.hasNodeSqlite && details.sqliteVersion !== null && isSqliteWalResetSafeVersion(details.sqliteVersion);
	return false;
}
async function isCurrentRuntimeSupported() {
	return runtimeSatisfies(await detectRuntime());
}
function isSupportedBunVersion(version) {
	return isNodeVersionAtLeast(parseSemver(version), MINIMUM_BUN_VERSION);
}
/** Returns whether a Node version satisfies a supported engine range, or null if unsupported. */
function nodeVersionSatisfiesEngine(version, engine) {
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
		if (isNodeVersionAtLeast(parsed, clauseMinimum) && (!upper || !isNodeVersionAtLeast(parsed, upper))) satisfied = true;
	}
	return satisfied;
}
async function assertSupportedRuntime(providedRuntime, providedDetails, argv, emitDiagnosticWarning = true, recoveryEnv) {
	const details = providedDetails ?? await detectRuntime();
	const writeNotice = (message) => providedRuntime ? providedRuntime.error(message) : process.stderr.write(`${message}\n`);
	if (runtimeSatisfies(details)) return;
	if (details.kind === "node" && argv && recoveryEnv) {
		const { recoverNodeRuntime } = await import("./node-runtime-recovery-Cs6l5Wzv.mjs");
		if (await recoverNodeRuntime({ env: recoveryEnv })) throw new ExitError(Number(process.exitCode ?? 0));
	}
	if (details.kind === "node" && canRunOpenClawNodeDiagnostics(details.version, details.hasNodeSqlite) && argv && classifyUnsupportedNodeCommand(argv)) {
		if (emitDiagnosticWarning && !diagnosticWarningPrinted) {
			writeNotice(formatUnsupportedNodeDiagnosticWarning(details.version));
			diagnosticWarningPrinted = true;
		}
		return;
	}
	let runtime = providedRuntime;
	if (!runtime) {
		const { formatConsoleDiagnosticBlock } = await import("./json-console-line-CytzoCTe.mjs");
		runtime = {
			log: (...args) => console.log(...args),
			error: (...args) => {
				const message = format(...args);
				process.stderr.write(formatConsoleDiagnosticBlock({
					level: "error",
					message: `${message}\n`
				}));
			},
			exit: (code) => {
				throw new ExitError(code);
			}
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
	const requirement = details.kind === "bun" ? "openclaw requires Bun 1.4.4 or newer with WAL-reset-safe node:sqlite (SQLite 3.51.3+ or a patched 3.50.x/3.44.x release)." : details.sqliteProbe && nodeRuntimeFailure(details.version, details.sqliteProbe) || `openclaw requires Node ${SUPPORTED_NODE_VERSION_RANGE.replace(" || ", ", or ")}.`;
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
export { nodeVersionSatisfiesEngine as a, isSupportedBunVersion as i, detectRuntime as n, parseSemver as o, isCurrentRuntimeSupported as r, assertSupportedRuntime as t };
