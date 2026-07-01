import { v as parseStrictInteger } from "./number-coercion-CJQ8TR--.js";
import { y as sliceUtf16Safe } from "./utils-BApvfmPs.js";
import { n as assertSandboxPath } from "./sandbox-paths-_3aaGW_c.js";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
//#region src/agents/bash-tools.shared.ts
/**
* Shared helpers for bash exec/process tools.
* Owns sandbox workdir mapping, Docker exec argument construction, output
* slicing, environment coercion, and compact session labels.
*/
const CHUNK_LIMIT = 8 * 1024;
/** Builds the environment passed into sandboxed exec calls. */
function buildSandboxEnv(params) {
	const env = {
		PATH: params.defaultPath,
		HOME: params.containerWorkdir
	};
	for (const [key, value] of Object.entries(params.sandboxEnv ?? {})) env[key] = value;
	for (const [key, value] of Object.entries(params.paramsEnv ?? {})) env[key] = value;
	return env;
}
/** Coerces process/env-like records to string-only environment variables. */
function coerceEnv(env) {
	const record = {};
	if (!env) return record;
	for (const [key, value] of Object.entries(env)) if (typeof value === "string") record[key] = value;
	return record;
}
/** Builds `docker exec` arguments while preserving container PATH behavior. */
function buildDockerExecArgs(params) {
	const args = ["exec", "-i"];
	if (params.tty) args.push("-t");
	if (params.workdir) args.push("-w", params.workdir);
	for (const [key, value] of Object.entries(params.env)) {
		if (key === "PATH") continue;
		args.push("-e", `${key}=${value}`);
	}
	const hasCustomPath = typeof params.env.PATH === "string" && params.env.PATH.length > 0;
	if (hasCustomPath) args.push("-e", `OPENCLAW_PREPEND_PATH=${params.env.PATH}`);
	const pathExport = hasCustomPath ? "export PATH=\"${OPENCLAW_PREPEND_PATH}:$PATH\"; unset OPENCLAW_PREPEND_PATH; " : "";
	args.push(params.containerName, "/bin/sh", "-lc", `${pathExport}${params.command}`);
	return args;
}
/** Resolves a requested workdir to both host and container paths for a sandbox. */
async function resolveSandboxWorkdir(params) {
	const fallback = params.sandbox.workspaceDir;
	const candidateWorkdir = mapContainerWorkdirToHost({
		workdir: params.workdir,
		sandbox: params.sandbox
	}) ?? params.workdir;
	try {
		const resolved = await assertSandboxPath({
			filePath: candidateWorkdir,
			cwd: process.cwd(),
			root: params.sandbox.workspaceDir
		});
		if (!(await fs$1.stat(resolved.resolved)).isDirectory()) throw new Error("workdir is not a directory");
		const relative = resolved.relative ? resolved.relative.split(path.sep).join(path.posix.sep) : "";
		const containerWorkdir = relative ? path.posix.join(params.sandbox.containerWorkdir, relative) : params.sandbox.containerWorkdir;
		return {
			hostWorkdir: resolved.resolved,
			containerWorkdir
		};
	} catch {
		params.warnings.push(`Warning: workdir "${params.workdir}" is unavailable; using "${fallback}".`);
		return {
			hostWorkdir: fallback,
			containerWorkdir: params.sandbox.containerWorkdir
		};
	}
}
function mapContainerWorkdirToHost(params) {
	const workdir = normalizeContainerPath(params.workdir);
	const containerRoot = normalizeContainerPath(params.sandbox.containerWorkdir);
	if (containerRoot === ".") return;
	if (workdir === containerRoot) return path.resolve(params.sandbox.workspaceDir);
	if (!workdir.startsWith(`${containerRoot}/`)) return;
	const rel = workdir.slice(containerRoot.length + 1).split("/").filter(Boolean);
	return path.resolve(params.sandbox.workspaceDir, ...rel);
}
function normalizeContainerPath(input) {
	const normalized = input.trim().replace(/\\/g, "/");
	if (!normalized) return ".";
	return path.posix.normalize(normalized);
}
/** Resolves a host workdir, falling back to a safe cwd/home path with a warning. */
function resolveWorkdir(workdir, warnings) {
	const fallback = safeCwd() ?? homedir();
	try {
		if (statSync(workdir).isDirectory()) return workdir;
	} catch {}
	warnings.push(`Warning: workdir "${workdir}" is unavailable; using "${fallback}".`);
	return fallback;
}
function safeCwd() {
	try {
		const cwd = process.cwd();
		return existsSync(cwd) ? cwd : null;
	} catch {
		return null;
	}
}
/**
* Clamp a number within min/max bounds, using defaultValue if undefined or NaN.
*/
function clampWithDefault(value, defaultValue, min, max) {
	if (value === void 0 || Number.isNaN(value)) return defaultValue;
	return Math.min(Math.max(value, min), max);
}
/** Reads a strict integer from the preferred env var or one legacy alias. */
function readEnvInt(key, legacyKey) {
	return parseStrictInteger(process.env[key] || (legacyKey ? process.env[legacyKey] : void 0));
}
/** Splits large output into fixed-size UTF-16 chunks for transport. */
function chunkString(input, limit = CHUNK_LIMIT) {
	const chunks = [];
	for (let i = 0; i < input.length; i += limit) chunks.push(input.slice(i, i + limit));
	return chunks;
}
/** Truncates long labels in the middle while preserving UTF-16 boundaries. */
function truncateMiddle(str, max) {
	if (str.length <= max) return str;
	const half = Math.floor((max - 3) / 2);
	return `${sliceUtf16Safe(str, 0, half)}...${sliceUtf16Safe(str, -half)}`;
}
/** Returns a line-based log slice plus original line/character counts. */
function sliceLogLines(text, offset, limit) {
	if (!text) return {
		slice: "",
		totalLines: 0,
		totalChars: 0
	};
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
	const totalLines = lines.length;
	const totalChars = text.length;
	let start = typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
	if (limit !== void 0 && offset === void 0) start = Math.max(totalLines - Math.max(0, Math.floor(limit)), 0);
	const end = typeof limit === "number" && Number.isFinite(limit) ? start + Math.max(0, Math.floor(limit)) : void 0;
	return {
		slice: lines.slice(start, end).join("\n"),
		totalLines,
		totalChars
	};
}
/** Derives a compact human label from a shell command. */
function deriveSessionName(command) {
	const tokens = tokenizeCommand(command);
	if (tokens.length === 0) return;
	const verb = tokens[0];
	let target = tokens.slice(1).find((t) => !t.startsWith("-"));
	if (!target) target = tokens[1];
	if (!target) return verb;
	const cleaned = truncateMiddle(stripQuotes(target), 48);
	return `${stripQuotes(verb)} ${cleaned}`;
}
function tokenizeCommand(command) {
	return (command.match(/(?:[^\s"']+|"(?:\\.|[^"\\])*"|'[^']*')+/g) ?? []).map((token) => stripQuotes(token)).filter(Boolean);
}
function stripQuotes(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
/** Right-pads a string for aligned plain-text process output. */
function pad(str, width) {
	if (str.length >= width) return str;
	return str + " ".repeat(width - str.length);
}
//#endregion
export { coerceEnv as a, readEnvInt as c, sliceLogLines as d, truncateMiddle as f, clampWithDefault as i, resolveSandboxWorkdir as l, buildSandboxEnv as n, deriveSessionName as o, chunkString as r, pad as s, buildDockerExecArgs as t, resolveWorkdir as u };
