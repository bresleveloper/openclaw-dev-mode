import { C as parseStrictNonNegativeInteger, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { PATH_ALIAS_POLICIES } from "@openclaw/fs-safe/advanced";
import { GUEST_FILESYSTEM_PYTHON } from "@openclaw/fs-safe/guest";
//#region src/infra/directory-entries.ts
/** Decode the sandbox directory command's metadata, never file contents. */
function parseDirectoryEntries(text) {
	const entries = JSON.parse(text);
	if (!Array.isArray(entries)) throw new Error("Invalid sandbox directory listing.");
	return entries.map((entry) => {
		const record = asNullableRecord(entry);
		if (!record || typeof record.name !== "string" || typeof record.isDirectory !== "boolean") throw new Error("Invalid sandbox directory entry.");
		return {
			name: record.name,
			isDirectory: record.isDirectory
		};
	});
}
//#endregion
//#region src/agents/sandbox/fs-bridge-mutation-helper.ts
/**
* Shell plans for pinned sandbox filesystem operations.
*
* Selects the local interpreter and supplies quoted Python source to local and remote transports.
*/
const SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES = [
	"/usr/bin/python3",
	"/usr/local/bin/python3",
	"/opt/homebrew/bin/python3",
	"/bin/python3"
];
const PINNED_MUTATION_ACTION_LABELS = {
	write: "write files",
	create: "create files",
	mkdir: "create directories",
	remove: "remove files",
	"copy-destination": "copy files"
};
const SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL = `'${GUEST_FILESYSTEM_PYTHON.replaceAll("'", `'\\''`)}'`;
function pinnedEntryArgs(pinned) {
	return [
		pinned.mountRootPath,
		pinned.relativeParentPath,
		pinned.basename
	];
}
/** Encode only already-admitted pinned facts; transport and path checks stay with each bridge. */
function buildPinnedMutationArgs(operation) {
	switch (operation.kind) {
		case "read": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			...operation.maxBytes === void 0 ? [] : [String(operation.maxBytes)]
		];
		case "write":
		case "create": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			operation.mkdir ? "1" : "0"
		];
		case "mkdirp":
		case "readdir": return [
			operation.kind,
			operation.pinned.mountRootPath,
			operation.pinned.relativePath
		];
		case "remove": return [
			operation.kind,
			...pinnedEntryArgs(operation.pinned),
			operation.recursive ? "1" : "0",
			operation.force === false ? "0" : "1"
		];
	}
	return [
		operation.kind,
		...pinnedEntryArgs(operation.source),
		...pinnedEntryArgs(operation.destination),
		operation.kind === "rename" || operation.mkdir ? "1" : "0"
	];
}
const PINNED_OPERATION_CHECK_OPTIONS = {
	write: {
		action: "write files",
		requireWritable: true
	},
	create: {
		action: "create files",
		requireWritable: true
	},
	readdir: {
		action: "list directories",
		allowedType: "directory"
	},
	mkdirp: {
		action: "create directories",
		requireWritable: true,
		allowedType: "directory"
	},
	remove: {
		action: "remove files",
		requireWritable: true,
		allowedType: "file-or-directory"
	},
	rename: {
		action: "rename files",
		requireWritable: "subtree",
		allowedType: "file-or-directory"
	},
	copy: {
		action: "copy files",
		requireWritable: true
	}
};
function buildPinnedMutationPlan(operation) {
	const options = { ...PINNED_OPERATION_CHECK_OPTIONS[operation.kind] };
	if (operation.kind === "remove" && operation.recursive) options.requireWritable = "subtree";
	const checks = operation.kind === "copy" || operation.kind === "rename" ? [{
		target: operation.sourceTarget,
		options: operation.kind === "copy" ? {
			action: options.action,
			allowedType: "file"
		} : options
	}, {
		target: operation.destinationTarget,
		options
	}] : [{
		target: operation.target,
		options
	}];
	if (operation.kind === "remove" || operation.kind === "rename") checks[0].options = {
		...checks[0].options,
		aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget
	};
	const args = buildPinnedMutationArgs(operation);
	return {
		checks,
		recheckBeforeCommand: true,
		script: [
			"set -eu",
			"python_cmd=''",
			...SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES.map((candidate) => `if [ -z "$python_cmd" ] && [ -x '${candidate}' ]; then python_cmd='${candidate}'; fi`),
			"if [ -z \"$python_cmd\" ]; then python_cmd=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || true); fi",
			"if [ -z \"$python_cmd\" ]; then",
			"  echo >&2 'sandbox pinned mutation helper requires python3 or python'",
			"  exit 127",
			"fi",
			`python_script=${SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL}`,
			"exec \"$python_cmd\" -c \"$python_script\" \"$@\""
		].join("\n"),
		args
	};
}
//#endregion
//#region src/agents/sandbox/fs-bridge-stat-parse.ts
/**
* Stat output parsers for sandbox filesystem bridges.
*
* Handles GNU/BSD size and mtime formats returned through backend shell commands.
*/
function hasMultipleHardlinks(raw) {
	const linkCount = parseStrictNonNegativeInteger(raw);
	return linkCount === void 0 ? /^\d+$/.test(raw) : linkCount > 1;
}
/** Parses file sizes, capping huge integer strings at the largest safe JS integer. */
function parseSandboxStatSize(value) {
	const raw = value ?? "0";
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed !== void 0) return parsed;
	return /^\d+$/.test(raw) ? Number.MAX_SAFE_INTEGER : 0;
}
/** Parses stat mtimes from epoch seconds or date strings into millisecond timestamps. */
function parseSandboxStatMtimeMs(value) {
	const raw = value ?? "0";
	if (/^\d+(?:\.\d+)?$/.test(raw)) {
		const mtimeMs = Number(raw) * 1e3;
		return asDateTimestampMs(mtimeMs) ?? 0;
	}
	return asDateTimestampMs(Date.parse(raw)) ?? 0;
}
//#endregion
export { SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL as a, parseDirectoryEntries as c, PINNED_MUTATION_ACTION_LABELS as i, parseSandboxStatMtimeMs as n, buildPinnedMutationArgs as o, parseSandboxStatSize as r, buildPinnedMutationPlan as s, hasMultipleHardlinks as t };
