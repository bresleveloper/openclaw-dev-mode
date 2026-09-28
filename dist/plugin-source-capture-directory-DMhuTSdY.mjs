import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as runInPluginSourceCaptureContext } from "./plugin-source-capture-context-B73e-LdE.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-DVlzzTlh.mjs";
import { o as tryAcquireExclusiveSqliteCoordinator } from "./sqlite-coordinator-z2lO0ops.mjs";
import { t as removeTemporaryArtifacts } from "./temp-artifact-cleanup-D_2UpyuT.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
//#region src/plugins/plugin-source-capture-directory.ts
const CAPTURE_GRACE_MS = 36e5;
const LEASE_FILE = "owner.sqlite";
const { instances, ownedRoots, sweeps, warningBackoff } = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureInstances"), () => {
	process.once("exit", () => {
		for (const [key, instance] of instances) try {
			const root = retireInstance(key, instance);
			if (root) fs.rmSync(root, {
				recursive: true,
				force: true
			});
		} catch (error) {
			process.stderr.write(`Plugin source capture exit cleanup failed: ${String(error)}\n`);
		}
	});
	return {
		instances: /* @__PURE__ */ new Map(),
		ownedRoots: /* @__PURE__ */ new Set(),
		sweeps: /* @__PURE__ */ new Map(),
		warningBackoff: /* @__PURE__ */ new Map()
	};
});
function retireInstance(key, instance) {
	instance.closing = true;
	instance.lease?.release();
	if (instance.root) ownedRoots.delete(instance.root);
	instance.references = 0;
	instances.delete(key);
	clearInterval(instance.timer);
	return instance.root;
}
function instanceDirectory(stateDir) {
	return path.join(stateDir, "tmp", "plugin-captures");
}
function warn(error) {
	process.emitWarning(`Plugin source capture cleanup: ${String(error)}`);
}
async function reclaimInstances(root, recordFailure) {
	let entries;
	try {
		entries = await fs$1.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return;
	}
	const cutoff = Date.now() - CAPTURE_GRACE_MS;
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const directory = path.join(root, entry.name);
		let lease = null;
		try {
			const stat = await fs$1.lstat(directory);
			if (!stat.isDirectory() || stat.mtimeMs > cutoff) continue;
			const canonical = await fs$1.realpath(directory);
			if (ownedRoots.has(canonical)) continue;
			const leasePath = path.join(canonical, LEASE_FILE);
			const leaseStat = await fs$1.lstat(leasePath);
			const captures = path.join(canonical, "captures");
			const captureStat = await fs$1.lstat(captures).catch((error) => {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			});
			if (!leaseStat.isFile() || leaseStat.nlink !== 1 || captureStat && !captureStat.isDirectory() || ownedRoots.has(canonical)) continue;
			lease = tryAcquireExclusiveSqliteCoordinator(leasePath);
			if (!lease) continue;
			ownedRoots.add(canonical);
			try {
				await fs$1.rm(captures, {
					recursive: true,
					force: true
				});
				lease.release();
				lease = null;
				await fs$1.rm(canonical, {
					recursive: true,
					force: true
				});
			} finally {
				ownedRoots.delete(canonical);
			}
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) recordFailure(error);
		} finally {
			lease?.release();
		}
	}
}
/** Coalesce active scans, but throttle diagnostics independently of cleanup retries. */
function sweepPluginSourceCaptureDirectories(stateDir = resolveStateDir()) {
	const root = path.resolve(instanceDirectory(stateDir));
	let sweep = sweeps.get(root);
	if (!sweep) {
		let failures = 0;
		let firstFailure;
		const recordFailure = (error) => {
			if (failures++ === 0) firstFailure = error;
		};
		sweep = reclaimInstances(root, recordFailure).catch(recordFailure).then(() => {
			if (failures === 0) {
				warningBackoff.delete(root);
				return;
			}
			const now = Date.now();
			const previous = warningBackoff.get(root);
			if (previous && now < previous.next) return;
			const delay = Math.min((previous?.delay ?? CAPTURE_GRACE_MS / 2) * 2, 24 * CAPTURE_GRACE_MS);
			if (!previous && warningBackoff.size >= 32) {
				const oldest = warningBackoff.keys().next().value;
				if (oldest !== void 0) warningBackoff.delete(oldest);
			}
			warningBackoff.set(root, {
				next: now + delay,
				delay
			});
			warn(`${failures} cleanup failure(s) in ${root}; will retry. First: ${String(firstFailure)}`);
		}).finally(() => sweeps.delete(root));
		sweeps.set(root, sweep);
	}
	return sweep;
}
function createCaptureDirectory(instance, stateDir, prefix) {
	if (instance.root) return fs.mkdtempSync(path.join(instance.root, "captures", prefix));
	const prepare = (fallback) => {
		let directory;
		let lease = null;
		try {
			if (fallback) directory = fs.mkdtempSync(path.join(tmpdir(), "openclaw-plugin-captures-"));
			else {
				const parent = instanceDirectory(stateDir);
				fs.mkdirSync(parent, {
					recursive: true,
					mode: 448
				});
				instance.managedRoot = fs.realpathSync(parent);
				const candidate = path.join(instance.managedRoot, randomUUID());
				fs.mkdirSync(candidate, { mode: 448 });
				directory = candidate;
			}
			const canonical = fs.realpathSync(directory);
			lease = tryAcquireExclusiveSqliteCoordinator(path.join(canonical, LEASE_FILE));
			if (!lease) throw new Error("Could not acquire new plugin source instance");
			const captures = path.join(canonical, "captures");
			fs.mkdirSync(captures, { mode: 448 });
			const capture = fs.mkdtempSync(path.join(captures, prefix));
			instance.root = canonical;
			instance.lease = lease;
			ownedRoots.add(canonical);
			return capture;
		} catch (error) {
			try {
				lease?.release();
			} catch (releaseError) {
				instance.root = directory;
				instance.lease = lease ?? void 0;
				instance.closing = true;
				if (directory) ownedRoots.add(directory);
				throw new AggregateError([error, releaseError], "Plugin source preparation cleanup failed", { cause: releaseError });
			}
			if (directory) try {
				fs.rmSync(directory, {
					recursive: true,
					force: true
				});
			} catch (cleanupError) {
				warn(cleanupError);
			}
			throw error;
		}
	};
	try {
		return prepare(false);
	} catch (error) {
		if (instance.closing) throw error;
		warn(error);
		return prepare(true);
	}
}
/** Metadata and its captures share custody; standalone CLI captures own their own lifetime. */
function retainPluginSourceCaptureInstance(stateDir = resolveStateDir()) {
	const key = path.resolve(stateDir);
	let instance = instances.get(key);
	if (instance?.closing) throw new Error("Plugin source instance cleanup is incomplete; retry cleanup before creating captures");
	if (!instance) {
		const timer = runInPluginSourceCaptureContext(() => setInterval(() => void sweepPluginSourceCaptureDirectories(key), CAPTURE_GRACE_MS));
		timer.unref();
		instance = {
			references: 0,
			timer
		};
		instances.set(key, instance);
		sweepPluginSourceCaptureDirectories(key);
	}
	instance.references += 1;
	const retained = instance;
	let released = false;
	const retire = () => {
		if (released) return;
		if (retained.references > 1) {
			retained.references -= 1;
			released = true;
			return;
		}
		const root = retireInstance(key, retained);
		released = true;
		return root;
	};
	return {
		get managedRoot() {
			return retained.managedRoot;
		},
		createDirectory(prefix = PLUGIN_SOURCE_CAPTURE_PREFIX) {
			if (released || retained.closing) throw new Error("Plugin source instance has been released");
			return createCaptureDirectory(retained, key, prefix);
		},
		release() {
			const root = retire();
			if (root) fs.rmSync(root, {
				recursive: true,
				force: true
			});
		},
		async releaseAsync() {
			const root = retire();
			if (root) await removeTemporaryArtifacts(root, "Plugin source instance");
		}
	};
}
/** The producer retains this root until its worker has confirmed exit. */
function createPluginSourceCaptureRoot(stateDir, prefix) {
	const instance = retainPluginSourceCaptureInstance(stateDir);
	try {
		const directory = instance.createDirectory(prefix);
		return {
			directory,
			managedRoot: instance.managedRoot,
			release: async () => {
				await removeTemporaryArtifacts(directory, "Plugin source worker");
				await instance.releaseAsync();
			}
		};
	} catch (error) {
		instance.release();
		throw error;
	}
}
//#endregion
export { retainPluginSourceCaptureInstance as n, sweepPluginSourceCaptureDirectories as r, createPluginSourceCaptureRoot as t };
