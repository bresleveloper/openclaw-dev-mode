import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import "./src-CdRlGRnW.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as quotePowerShellArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as resolveNpmGlobalPrefixLayoutFromGlobalRoot } from "./update-npm-prefix-bBxyXd_e.mjs";
import { u as isUpdateDoctorLintPass } from "./update-phase-BClSJ17n.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-update-snapshots.ts
const SNAPSHOT_NAME = /^\.openclaw[.-]package-backup-.*\.databases$/u;
const MAX_ROOT_ENTRIES = 1024;
const MAX_SIZE_ENTRIES = 4096;
const MAX_DEPTH = 32;
const SCAN_BUDGET_MS = 200;
/** Older snapshots have no durable success receipt; discovery never authorizes removal. */
async function collectUpdateSnapshotHealthFindings(env = process.env) {
	if (isUpdateDoctorLintPass(env)) return [];
	const packageRoot = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	});
	const layout = packageRoot ? resolveNpmGlobalPrefixLayoutFromGlobalRoot(path.dirname(packageRoot)) : null;
	if (!layout) return [];
	const deadline = performance.now() + SCAN_BUDGET_MS;
	const directories = [];
	let partial = false;
	let rootEntries = 0;
	try {
		const root = await fs.opendir(layout.globalRoot);
		for await (const entry of root) {
			if (++rootEntries > MAX_ROOT_ENTRIES || performance.now() > deadline) {
				partial = true;
				break;
			}
			if (entry.isDirectory() && SNAPSHOT_NAME.test(entry.name)) directories.push(path.join(layout.globalRoot, entry.name));
		}
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		partial = true;
	}
	if (directories.length === 0) return partial ? [{
		checkId: "core/doctor/update-snapshots",
		severity: "warning",
		message: `Inspection was incomplete; retained pre-migration database snapshots may remain. Manually list the npm global root ${layout.globalRoot}, including hidden entries, and check for .openclaw.package-backup-*.databases and .openclaw-package-backup-*.databases directories.`
	}] : [];
	directories.sort();
	let bytes = 0;
	let sizeEntries = 0;
	const pending = directories.map((directory) => ({
		directory,
		depth: 0
	}));
	while (pending.length > 0) {
		if (sizeEntries >= MAX_SIZE_ENTRIES || performance.now() > deadline) {
			partial = true;
			break;
		}
		const next = pending.pop();
		try {
			if (!(await fs.lstat(next.directory)).isDirectory()) {
				partial = true;
				continue;
			}
			const directory = await fs.opendir(next.directory);
			for await (const entry of directory) {
				if (++sizeEntries > MAX_SIZE_ENTRIES || performance.now() > deadline) {
					partial = true;
					break;
				}
				const entryPath = path.join(next.directory, entry.name);
				if (entry.isDirectory()) {
					if (next.depth < MAX_DEPTH) pending.push({
						directory: entryPath,
						depth: next.depth + 1
					});
					else partial = true;
				} else if (entry.isFile()) {
					const stat = await fs.lstat(entryPath);
					if (stat.isFile()) bytes += stat.size;
				}
			}
		} catch {
			partial = true;
		}
	}
	const size = formatByteSize(bytes, {
		style: "iec",
		maxUnit: "tera",
		separator: " ",
		fractionDigits: 1
	});
	const commands = directories.map((directory) => process.platform === "win32" ? `Remove-Item -LiteralPath ${quotePowerShellArg(directory)} -Recurse -Force` : `rm -rf -- '${directory.replaceAll("'", "'\\''")}'`);
	return [{
		checkId: "core/doctor/update-snapshots",
		severity: "warning",
		message: [
			`${partial ? "At least " : ""}${directories.length} retained pre-migration database snapshot director${directories.length === 1 ? "y" : "ies"}: ${partial ? "at least " : ""}${bytes} bytes (${size}) in regular files.`,
			...partial ? ["Inspection was bounded or incomplete; paths and size may be partial."] : [],
			"Doctor cannot prove these updates succeeded and never removes these snapshots, including with --fix.",
			"Before manual removal, confirm no update is in progress and no recovery needs these snapshots; inspect the corresponding update reports first.",
			...commands
		].join("\n")
	}];
}
//#endregion
export { collectUpdateSnapshotHealthFindings };
