import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import process from "node:process";
//#region src/infra/runtime-guard.ts
const MIN_NODE = {
	major: 22,
	minor: 19,
	patch: 0
};
const MINIMUM_ENGINE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)\s*$/i;
const SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;
/** Parses the first major/minor/patch triple from a runtime or package version label. */
function parseSemver(version) {
	if (!version) return null;
	const match = version.match(SEMVER_RE);
	if (!match) return null;
	const [, major, minor, patch] = match;
	return {
		major: Number.parseInt(major, 10),
		minor: Number.parseInt(minor, 10),
		patch: Number.parseInt(patch, 10)
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
function detectRuntime() {
	return {
		kind: process.versions?.node ? "node" : "unknown",
		version: process.versions?.node ?? null,
		execPath: process.execPath ?? null,
		pathEnv: process.env.PATH ?? "(not set)"
	};
}
/** Returns whether a detected runtime meets OpenClaw's minimum runtime contract. */
function runtimeSatisfies(details) {
	const parsed = parseSemver(details.version);
	if (details.kind === "node") return isAtLeast(parsed, MIN_NODE);
	return false;
}
/** Checks a Node version label against OpenClaw's current minimum Node version. */
function isSupportedNodeVersion(version) {
	return isAtLeast(parseSemver(version), MIN_NODE);
}
/** Parses simple package `engines.node` ranges of the form `>=x.y.z`. */
function parseMinimumNodeEngine(engine) {
	if (!engine) return null;
	const match = engine.match(MINIMUM_ENGINE_RE);
	if (!match) return null;
	return parseSemver(match[1] ?? null);
}
/** Returns whether a Node version satisfies a simple minimum engine range, or null if unsupported. */
function nodeVersionSatisfiesEngine(version, engine) {
	const minimum = parseMinimumNodeEngine(engine);
	if (!minimum) return null;
	return isAtLeast(parseSemver(version), minimum);
}
/** Exits through the provided runtime when the current Node runtime is unsupported. */
function assertSupportedRuntime(runtime = defaultRuntime, details = detectRuntime()) {
	if (runtimeSatisfies(details)) return;
	const versionLabel = details.version ?? "unknown";
	const runtimeLabel = details.kind === "unknown" ? "unknown runtime" : `${details.kind} ${versionLabel}`;
	const execLabel = details.execPath ?? "unknown";
	runtime.error([
		"openclaw requires Node >=22.19.0.",
		`Detected: ${runtimeLabel} (exec: ${execLabel}).`,
		`PATH searched: ${details.pathEnv}`,
		"Install Node: https://nodejs.org/en/download",
		"Upgrade Node and re-run openclaw."
	].join("\n"));
	runtime.exit(1);
}
//#endregion
export { parseSemver as a, nodeVersionSatisfiesEngine as i, isAtLeast as n, isSupportedNodeVersion as r, assertSupportedRuntime as t };
