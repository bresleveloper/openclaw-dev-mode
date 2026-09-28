import { promisify } from "node:util";
import path from "node:path";
import { execFile } from "node:child_process";
import os from "node:os";
import { walkDirectory } from "@openclaw/fs-safe/walk";
import pLimit from "p-limit";
//#region src/infra/installed-apps.ts
const execFileAsync = promisify(execFile);
const PLIST_READ_CONCURRENCY = 8;
const PLIST_READ_TIMEOUT_MS = 2e3;
const SYSTEM_APP_NAMES = /* @__PURE__ */ new Set([
	"Calendar",
	"Contacts",
	"FaceTime",
	"Home",
	"Mail",
	"Maps",
	"Messages",
	"Music",
	"Notes",
	"Photos",
	"Podcasts",
	"Reminders",
	"Shortcuts"
]);
function defaultRoots() {
	return {
		applications: "/Applications",
		userApplications: path.join(os.homedir(), "Applications"),
		systemApplications: "/System/Applications"
	};
}
function isBackupishBundle(label) {
	return /(?:^|[\s._-])(?:backup|previous|rollback)(?:[\s._-]|$)/i.test(label) || /(?:^|[\s._-])pre-[\p{L}\p{N}._-]+$/iu.test(label);
}
async function listAppPaths(root, system) {
	const { entries } = await walkDirectory(root, {
		maxDepth: 1,
		symlinks: "follow",
		include: (entry) => {
			if (entry.kind !== "directory" || !entry.name.toLowerCase().endsWith(".app")) return false;
			const label = entry.name.slice(0, -4);
			return !isBackupishBundle(label) && (!system || SYSTEM_APP_NAMES.has(label));
		}
	});
	return entries.map((entry) => ({
		path: entry.path,
		system
	}));
}
async function readBundleIdWithPlutil(appPath) {
	try {
		const plistPath = path.join(appPath, "Contents", "Info.plist");
		const { stdout } = await execFileAsync("/usr/bin/plutil", [
			"-extract",
			"CFBundleIdentifier",
			"raw",
			"-expect",
			"string",
			plistPath
		], {
			encoding: "utf8",
			maxBuffer: 1048576,
			timeout: PLIST_READ_TIMEOUT_MS
		});
		return stdout.trim() || void 0;
	} catch {
		return;
	}
}
async function scanInstalledApps(options = {}) {
	const platform = options.platform ?? process.platform;
	if (platform !== "darwin") return {
		status: "unsupported",
		platform,
		apps: []
	};
	const roots = options.roots ?? defaultRoots();
	const appPaths = (await Promise.all([
		listAppPaths(roots.applications, false),
		listAppPaths(roots.userApplications, false),
		listAppPaths(roots.systemApplications, true)
	])).flat();
	const limit = pLimit(PLIST_READ_CONCURRENCY);
	return {
		status: "ok",
		apps: (await Promise.all(appPaths.map((entry) => limit(async () => {
			const bundleId = await readBundleIdWithPlutil(entry.path);
			return {
				label: path.basename(entry.path, ".app"),
				...bundleId ? { bundleId } : {},
				path: entry.path,
				system: entry.system
			};
		})))).toSorted((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || left.path.localeCompare(right.path))
	};
}
//#endregion
export { scanInstalledApps as t };
