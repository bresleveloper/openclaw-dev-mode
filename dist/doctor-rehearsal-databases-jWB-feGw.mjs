import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { t as createRehearsalPathInspector } from "./doctor-update-rehearsal-paths-Bu_Z53RK.mjs";
import { lstatSync, realpathSync } from "node:fs";
import path from "node:path";
//#region src/commands/doctor-rehearsal-databases.ts
/** Only core images in Doctor's currently owned disposable namespace need no second backup. */
function createDoctorRehearsalDatabaseCoverage(env) {
	const root = resolveUpdateRehearsalRoot(env);
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!root || !maintenance?.ownsSchemaMaintenance) return;
	maintenance.assertAdmission();
	maintenance.assertDatabaseAccess(resolveOpenClawStateSqlitePath(env));
	const inspect = (pathname) => {
		const inspector = createRehearsalPathInspector(root, []);
		const stat = inspector.inspectPath(pathname);
		const identities = /* @__PURE__ */ new Map();
		for (const filename of inspector.identities.keys()) {
			const identity = lstatSync(filename, { bigint: true });
			if (identity.dev === 0n || identity.ino === 0n) throw new Error(`Disposable database identity is unavailable: ${filename}`);
			identities.set(filename, identity);
		}
		if (!stat) identities.set(pathname, void 0);
		return {
			stat,
			identities
		};
	};
	let rootIdentity;
	try {
		if (path.resolve(root) !== root || realpathSync(root) !== root || !inspect(root).stat?.isDirectory()) return;
		rootIdentity = lstatSync(root, { bigint: true });
	} catch {
		return;
	}
	const identities = /* @__PURE__ */ new Map([[root, rootIdentity]]);
	const databases = /* @__PURE__ */ new Set();
	const family = /* @__PURE__ */ new Set();
	const aliases = /* @__PURE__ */ new Map();
	const assertCurrent = () => {
		maintenance.assertAdmission();
		maintenance.assertDatabaseAccess(resolveOpenClawStateSqlitePath(env));
		if (resolveUpdateRehearsalRoot(env) !== root || realpathSync(root) !== root) throw new Error("Disposable Doctor database namespace changed");
		for (const [filename, before] of identities) {
			const { identities: current } = inspect(filename);
			const after = current.get(filename);
			if (before ? !after || after.dev !== before.dev || after.ino !== before.ino : after !== void 0) throw new Error(`Disposable Doctor database identity changed: ${filename}`);
		}
		for (const [filename, target] of aliases) if (resolvePathViaExistingAncestorSync(filename) !== target) throw new Error(`Disposable Doctor database alias changed: ${filename}`);
	};
	return {
		assertCurrent,
		/** Call with the complete core discovery, never arbitrary plugin declarations. */
		admit(paths) {
			assertCurrent();
			for (const filename of paths) {
				if (databases.has(filename)) continue;
				const captured = /* @__PURE__ */ new Map();
				try {
					if (!inspect(filename).stat?.isFile() || realpathSync(filename) !== filename) continue;
					for (const companion of resolveSqliteDatabaseFilePaths(filename)) {
						const inspected = inspect(companion);
						if (inspected.stat && !inspected.stat.isFile()) throw new Error(`Disposable database companion is not a regular file: ${companion}`);
						for (const [entry, identity] of inspected.identities) captured.set(entry, identity);
					}
				} catch {
					continue;
				}
				for (const [entry, identity] of captured) identities.set(entry, identity);
				databases.add(filename);
				for (const companion of resolveSqliteDatabaseFilePaths(filename)) family.add(companion);
			}
			assertCurrent();
			return [...databases];
		},
		excludes(filename) {
			const target = resolvePathViaExistingAncestorSync(filename);
			if (!family.has(target)) return false;
			if (target !== filename && !aliases.has(filename)) aliases.set(filename, target);
			return true;
		},
		get paths() {
			return [...family].toSorted();
		}
	};
}
//#endregion
export { createDoctorRehearsalDatabaseCoverage as t };
