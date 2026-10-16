import path from "node:path";
import fs from "node:fs/promises";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
import { isNotFoundPathError } from "@openclaw/fs-safe/path";
//#region src/infra/fs-observation-mode.ts
/** Preserve operator polling overrides while letting fs-safe choose the native backend. */
function resolveFsObservationMode(env = process.env) {
	const value = env.CHOKIDAR_USEPOLLING?.toLowerCase();
	return value && value !== "false" && value !== "0" ? "poll" : "auto";
}
function resolveFsObservationIntervalMs(env = process.env, defaultIntervalMs = 100) {
	const interval = Number.parseInt(env.CHOKIDAR_INTERVAL ?? "", 10);
	return Number.isFinite(interval) && interval > 0 ? Math.min(2147483647, Math.max(20, interval)) : defaultIntervalMs;
}
//#endregion
//#region src/infra/fs-observation-root.ts
/** Probe a caller-selected prefix without following links or comparing entry names. */
async function observationPrefixKind(authority, relative, signal) {
	const entries = authority.entries("./" + relative, {
		symlinks: "reject",
		maxEntries: 1,
		signal
	});
	try {
		await entries.next();
		return "directory";
	} catch (error) {
		if (error instanceof FsSafeError) {
			if (error.code === "symlink") return "symlink";
			if (error.code === "not-file") return "other";
			if (error.code === "not-found") return "missing";
		}
		throw error;
	} finally {
		await entries.return?.();
	}
}
/**
* Admit an existing prefix of a caller-selected stable boundary, stopping before
* a symbolic entry. Each subscription admits its own Root; callers separately
* admit trusted canonical targets. This does not scan descendants.
*/
async function admitObservationRoot(boundary, hardlinks = "reject") {
	const absolute = path.resolve(boundary);
	let ancestor = path.parse(absolute).root;
	for (const component of path.relative(ancestor, absolute).split(path.sep).filter(Boolean)) {
		const candidate = path.join(ancestor, component);
		try {
			const stat = await fs.lstat(candidate);
			if (!stat.isDirectory() || stat.isSymbolicLink()) break;
			ancestor = candidate;
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			break;
		}
	}
	return await root(ancestor, {
		symlinks: "reject",
		hardlinks
	});
}
//#endregion
//#region src/infra/fs-observation-snapshot.ts
var ObservationSampleCloseError = class extends Error {
	constructor(cause) {
		super("File observation metadata handle cleanup failed", { cause });
	}
};
async function readObservationSnapshot(authority, relative) {
	let opened;
	try {
		opened = await authority.open("./" + relative, { symlinks: "reject" });
	} catch {
		return;
	}
	try {
		await opened[Symbol.asyncDispose]();
	} catch (error) {
		throw new ObservationSampleCloseError(error);
	}
	return {
		size: opened.stat.size,
		mtimeMs: opened.stat.mtimeMs
	};
}
//#endregion
export { resolveFsObservationIntervalMs as a, observationPrefixKind as i, readObservationSnapshot as n, resolveFsObservationMode as o, admitObservationRoot as r, ObservationSampleCloseError as t };
