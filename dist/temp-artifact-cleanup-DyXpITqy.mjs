import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/temp-artifact-cleanup.ts
const log = createSubsystemLogger("infra:temp-artifacts");
const retainedRuntimes = resolveGlobalSingleton(Symbol.for("openclaw.retainedUpdateRuntimes"), () => /* @__PURE__ */ new Set());
/** Registration lasts through worker settlement, including failed update reporting. */
function registerRetainedUpdateRuntime(directory) {
	retainedRuntimes.add(directory);
	return () => void retainedRuntimes.delete(directory);
}
function reportRetainedUpdateRuntime(directory, reason) {
	const message = `Runtime retained at ${directory}: ${reason}`;
	try {
		log.warn(message);
	} catch {}
	return message;
}
/** Placement and discovery share the climb outside the enclosing module owner. */
function resolveRetainedUpdateRuntimeParents(packageRoot, mutationRoots = []) {
	const parts = packageRoot.split(path.sep);
	const modules = parts.indexOf("node_modules");
	const boundaries = [parts.slice(0, modules >= 0 ? modules + 1 : parts.length).join(path.sep), ...mutationRoots];
	let parent = path.dirname(packageRoot);
	const parents = [parent];
	while (boundaries.some((root) => isPathInside(root, parent))) {
		const ancestor = path.dirname(parent);
		if (ancestor === parent) break;
		parent = ancestor;
		parents.push(parent);
	}
	return parents;
}
async function isRetainedRuntimeMarker(marker) {
	if (await fs.realpath(marker).catch(() => void 0) !== marker) return false;
	const value = JSON.parse(await fs.readFile(marker, "utf8"));
	return isRecord(value) && value.name === "openclaw";
}
async function recognizesRetainedRuntime(directory, packageRoot) {
	const base = path.parse(packageRoot).root;
	const tree = path.join(directory, "tree", Buffer.from(base).toString("hex"));
	const projectedRoot = path.join(tree, path.relative(base, packageRoot));
	if (await isRetainedRuntimeMarker(path.join(projectedRoot, "package.json"))) return true;
	const modules = path.dirname(projectedRoot);
	const version = path.dirname(modules);
	const store = path.dirname(version);
	if (path.basename(projectedRoot) !== "openclaw" || path.basename(modules) !== "node_modules" || !path.basename(version).startsWith("openclaw@") || path.basename(store) !== ".pnpm" || await fs.realpath(store).catch(() => void 0) !== store) return false;
	let inspected = 0;
	for await (const entry of await fs.opendir(store)) {
		if (++inspected > 4096) throw new Error("retained pnpm version inventory exceeds the bounded lookup; inspect it before manual cleanup");
		if (entry.isDirectory() && entry.name.startsWith("openclaw@") && await isRetainedRuntimeMarker(path.join(store, entry.name, "node_modules/openclaw/package.json"))) return true;
	}
	return false;
}
/** Marked updater projections are disposable; live owners and maintenance fence reclamation. */
async function maintainRetainedUpdateRuntimes(params) {
	const messages = [];
	const packages = params.packageRoots.map(resolveIdentityPathViaExistingAncestorSync);
	const roots = new Set([
		os.tmpdir(),
		...params.temporaryDirectories ?? [],
		...packages.flatMap((root) => resolveRetainedUpdateRuntimeParents(root))
	].map(resolveIdentityPathViaExistingAncestorSync));
	for (const parent of roots) try {
		for (const entry of await fs.readdir(parent, { withFileTypes: true })) {
			if (!/^openclaw-update-runtime-[A-Za-z0-9]{6}$/u.test(entry.name)) continue;
			const directory = path.join(parent, entry.name);
			try {
				const before = await fs.lstat(directory);
				if (!before.isDirectory() || process.getuid && before.uid !== process.getuid()) throw new Error("directory ownership is unknown; inspect it before manual cleanup");
				if (retainedRuntimes.has(directory)) throw new Error("the creating update still owns this runtime");
				let marked = false;
				for (const packageRoot of packages) if (await recognizesRetainedRuntime(directory, packageRoot)) {
					marked = true;
					break;
				}
				if (!marked) throw new Error("no recognized runtime marker; inspect it before manual cleanup");
				if (!params.repair) {
					messages.push(`Runtime retained at ${directory}: run \`openclaw doctor --fix\` after its workers stop`);
					continue;
				}
				const { inspectOtherOpenClawProcesses } = await import("./openclaw-process-census-BocFHlra.mjs");
				const current = await fs.lstat(directory);
				if (current.dev !== before.dev || current.ino !== before.ino || current.ctimeMs !== before.ctimeMs || retainedRuntimes.has(directory)) throw new Error("directory identity or custody changed");
				params.assertCurrent();
				const census = inspectOtherOpenClawProcesses();
				if ("error" in census) throw new Error(census.error);
				if (census.pids.length) throw new Error(`other OpenClaw processes are still running (PIDs: ${census.pids.join(", ")}); let these holders finish, then rerun openclaw doctor --fix`);
				params.assertResourcesSettled?.();
				params.assertCurrent();
				let failure;
				await removeTemporaryArtifacts(directory, "Updater runtime", (error) => {
					failure = `cleanup failed: ${formatErrorMessage(error)}`;
				});
				messages.push(failure ? reportRetainedUpdateRuntime(directory, failure) : `Removed abandoned updater runtime: ${directory}`);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) messages.push(reportRetainedUpdateRuntime(directory, formatErrorMessage(error)));
			}
		}
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) messages.push(`Cannot inspect updater runtimes in ${parent}: ${formatErrorMessage(error)}`);
	}
	return messages;
}
function removeTemporaryArtifacts(directory, owner, onError = (error) => log.warn(truncateUtf16Safe(formatErrorMessage(`${owner} cleanup failed; files may remain in ${directory}. After the worker or session stops, check permissions and remove the retained directory: ${formatErrorMessage(error)}`), 1024))) {
	return runBestEffortCleanup({
		cleanup: () => fs.rm(directory, {
			recursive: true,
			force: true
		}),
		onError
	});
}
//#endregion
export { resolveRetainedUpdateRuntimeParents as a, reportRetainedUpdateRuntime as i, registerRetainedUpdateRuntime as n, removeTemporaryArtifacts as r, maintainRetainedUpdateRuntimes as t };
