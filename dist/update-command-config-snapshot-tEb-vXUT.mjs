import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { i as hashConfigRaw, n as containsConfigIncludeDirective, s as parseConfigJson5 } from "./io.read-helpers-KYk5dB53.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { u as captureConfigFileWritePathProof } from "./write-lock-BlX1pI0w.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { t as createPreUpdateConfigSnapshot } from "./backup-rotation-BJBdiSUE.mjs";
import { n as readBackupConfigCaptureFile, r as resolveBackupConfigCapture, t as BackupConfigCaptureError } from "./backup-config-capture-gOLZYQL1.mjs";
import fs, { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/cli/update-cli/update-command-config-snapshot.ts
async function readUpdateConfigSnapshot(path) {
	const raw = await fs$1.readFile(path, "utf8").catch((error) => {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		return null;
	});
	return {
		path,
		raw,
		hash: hashConfigRaw(raw)
	};
}
/** Keep the authored include graph with the root's existing rollback snapshot. */
async function captureUpdateConfigSnapshot(configPath, env) {
	const root = await readUpdateConfigSnapshot(configPath);
	const parsed = root.raw === null ? void 0 : parseConfigJson5(root.raw);
	if (!parsed?.ok || !containsConfigIncludeDirective(parsed.parsed)) return root;
	try {
		const selected = await createConfigIO({
			configPath,
			env,
			observe: false,
			pluginValidation: "core-only"
		}).readConfigFileSnapshotForWrite();
		if (selected.snapshot.includeProvenance === void 0) return {
			...root,
			doctorOwned: false
		};
		const capture = await resolveBackupConfigCapture(selected, {
			env,
			pluginValidation: "core-only",
			allowIncludeAliases: true
		});
		const rootTarget = await fs$1.realpath(configPath);
		const files = /* @__PURE__ */ new Map();
		for (const file of capture.files) {
			const sourcePath = file.canonicalPath === rootTarget ? configPath : file.sourcePath;
			const proof = captureConfigFileWritePathProof(sourcePath, file.canonicalPath, fs);
			const raw = (await readBackupConfigCaptureFile(file)).toString("utf8");
			proof.assertCurrent();
			const existing = files.get(file.canonicalPath);
			if (existing) existing.pathSnapshot.entries.push(...proof.snapshot.entries);
			else files.set(file.canonicalPath, {
				path: sourcePath,
				raw,
				hash: hashConfigRaw(raw),
				pathSnapshot: proof.snapshot
			});
		}
		const capturedRoot = files.get(rootTarget);
		if (!capturedRoot) throw new Error("Update config capture is missing its root file.");
		return {
			...capturedRoot,
			includedFiles: [...files.values()].filter((file) => file !== capturedRoot)
		};
	} catch (error) {
		if (error instanceof BackupConfigCaptureError || error instanceof ConfigMutationConflictError) return {
			...root,
			doctorOwned: false
		};
		throw error;
	}
}
async function createUpdateConfigSnapshot(env = process.env) {
	await createPreUpdateConfigSnapshot({
		configPath: resolveConfigPath(env),
		fs: {
			writeFile: fs$1.writeFile,
			readFile: fs$1.readFile,
			existsSync
		}
	});
}
//#endregion
export { createUpdateConfigSnapshot as n, readUpdateConfigSnapshot as r, captureUpdateConfigSnapshot as t };
