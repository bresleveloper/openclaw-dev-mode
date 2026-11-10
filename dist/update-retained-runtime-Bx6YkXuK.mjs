import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { s as withUserPathBaseDirectory } from "./home-dir-CtsdYvX3.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as withRuntimeWorkerGeneration } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { o as sameFileMutationMetadata } from "./file-descriptor-BWLpOgrg.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { a as resolveRetainedUpdateRuntimeParents, i as reportRetainedUpdateRuntime, n as registerRetainedUpdateRuntime, r as removeTemporaryArtifacts, t as maintainRetainedUpdateRuntimes } from "./temp-artifact-cleanup-DIl8XLa9.mjs";
import { t as isNativeEsmPackage } from "./native-module-format-DZMPKTeH.mjs";
import { t as collectPluginSafetyInspectedFiles } from "./plugin-safety-inspected-files-C9Of4ALD.mjs";
import { t as resolveNativePackageProjectRoot } from "./update-native-package-owner-CYzbhR-v.mjs";
import { n as withUpdateCandidateIoBudget } from "./update-candidate-io-BDP-YZR-.mjs";
import { t as ignoreMissingUpdateCandidateFile } from "./update-candidate-files-BfBN3EpP.mjs";
import { a as relocateRuntimeSymlink, i as relocateRuntimePath, s as resolveRuntimeFileRelocator, t as prepareRuntimeRelocations } from "./update-runtime-relocation-VUX2bZ3P.mjs";
import { a as assertUpdateCandidatePluginLinkTarget, c as publishUpdateCandidatePluginTreeLinks, f as runUpdateCandidatePluginTasks, i as assertUpdateCandidatePluginEntryStat, l as resolveUpdateCandidatePluginTreeTargets, n as copyUpdateCandidatePluginFileBytes, u as verifyUpdateCandidatePluginTree } from "./update-candidate-plugin-file-DjSpiZwE.mjs";
import { r as prepareUpdateCandidatePluginTrees } from "./update-candidate-plugin-tree-C5sdL-sn.mjs";
import Module from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-retained-runtime-imports.ts
const retainedSourceLoaders = {
	".jsx": "jsx",
	".ts": "ts",
	".mts": "ts",
	".cts": "ts",
	".tsx": "tsx"
};
/** Keep module identity and import.meta.url while loading the retained generation's bytes. */
function retainUpdateRuntimeImports(relocations, files) {
	const prepared = prepareRuntimeRelocations(relocations);
	const forward = /* @__PURE__ */ new Map();
	const reverse = /* @__PURE__ */ new Map();
	const loads = /* @__PURE__ */ new Map();
	for (const file of files) {
		const original = pathToFileURL(file).href;
		const retained = pathToFileURL(relocateRuntimePath(file, prepared)).href;
		forward.set(original, retained);
		reverse.set(retained, original);
	}
	const relocateUrl = (value, mapping) => {
		if (!value.startsWith("file:")) return value;
		const url = new URL(value);
		const search = url.search;
		const hash = url.hash;
		url.search = "";
		url.hash = "";
		const relocated = mapping.get(url.href);
		if (!relocated) return value;
		const result = new URL(relocated);
		result.search = search;
		result.hash = hash;
		return result.href;
	};
	if (process.versions.bun) {
		const bun = globalThis.Bun;
		const require = Module.createRequire(import.meta.url);
		const bunFileUrl = (filename) => {
			const direct = pathToFileURL(filename).href;
			return forward.has(direct) || reverse.has(direct) ? direct : new URL(filename, "file:///").href;
		};
		let resolving = false;
		bun.plugin({
			name: "openclaw-retained-update-runtime",
			setup(builder) {
				builder.onResolve({
					filter: /.*/,
					namespace: "file"
				}, ({ path: specifier, importer, kind }) => {
					const importerUrl = bunFileUrl(importer);
					const relocatedParent = relocateUrl(importerUrl, forward);
					const parent = relocatedParent !== importerUrl ? relocatedParent : relocateUrl(importerUrl, reverse) !== importerUrl ? importerUrl : void 0;
					if (!parent || resolving) return;
					const target = path.isAbsolute(specifier) ? pathToFileURL(specifier).href : specifier;
					if (reverse.has(target)) return;
					let resolved;
					resolving = true;
					try {
						const retainedTarget = relocateUrl(target, forward);
						resolved = kind === "require-call" || kind === "require-resolve" ? Module.createRequire(parent).resolve(retainedTarget.startsWith("file:") ? fileURLToPath(retainedTarget) : retainedTarget) : bun.resolveSync(retainedTarget, path.dirname(fileURLToPath(parent)));
					} finally {
						resolving = false;
					}
					const retained = bunFileUrl(resolved);
					const original = relocateUrl(retained, reverse);
					if (original !== retained) {
						const originalUrl = new URL(original);
						const filename = fileURLToPath(originalUrl);
						const modulePath = filename + originalUrl.search + originalUrl.hash;
						if (path.extname(filename) === ".node") return {
							path: require.cache[filename] ? filename : resolved,
							namespace: "file"
						};
						if (!loads.has(original)) {
							const source = fileURLToPath(retained);
							builder.onLoad({
								filter: new RegExp(`^${escapeRegExp(modulePath)}$`),
								namespace: "file"
							}, () => {
								const extension = path.extname(source);
								const commonJs = extension === ".cjs" || extension === ".cts" || [".js", ".ts"].includes(extension) && !isNativeEsmPackage(source);
								if (extension === ".json" || commonJs) {
									const value = commonJs ? require(source) : JSON.parse(fs.readFileSync(source, "utf8"));
									return {
										exports: {
											...value !== null && (typeof value === "object" || typeof value === "function") && !Array.isArray(value) ? value : {},
											default: value,
											__esModule: true
										},
										loader: "object"
									};
								}
								return {
									contents: fs.readFileSync(source),
									loader: retainedSourceLoaders[extension] ?? "js"
								};
							});
							loads.set(original, retained);
						}
						return {
							path: modulePath,
							namespace: "file"
						};
					}
					return {
						path: resolved,
						namespace: "file"
					};
				});
			}
		});
		return;
	}
	let resolving = false;
	Module.registerHooks({
		resolve(specifier, context, nextResolve) {
			if (resolving) return nextResolve(specifier, context);
			const parentURL = context.parentURL && relocateUrl(context.parentURL, forward);
			if (!parentURL || parentURL === context.parentURL) return nextResolve(specifier, context);
			const target = path.isAbsolute(specifier) ? pathToFileURL(specifier).href : specifier;
			let retainedTarget = relocateUrl(target, forward);
			if (context.conditions.includes("require")) {
				resolving = true;
				try {
					retainedTarget = Module.createRequire(parentURL).resolve(retainedTarget.startsWith("file:") ? fileURLToPath(retainedTarget) : retainedTarget);
				} finally {
					resolving = false;
				}
			}
			const result = nextResolve(retainedTarget, {
				...context,
				parentURL
			});
			const url = relocateUrl(result.url, reverse);
			if (url !== result.url) loads.set(url, result.url);
			return {
				...result,
				url
			};
		},
		load(url, context, nextLoad) {
			return nextLoad(loads.get(url) ?? url, context);
		}
	});
}
//#endregion
//#region src/infra/update-retained-runtime-tree.ts
const isLinkUnsupported = (error) => [
	"EXDEV",
	"EPERM",
	"EACCES",
	"ENOTSUP",
	"EOPNOTSUPP",
	"EMLINK",
	"ENOSYS"
].some((code) => hasNodeErrorCode(error, code));
/**
* Retain the admitted tree by hard-linking its files into the private directory.
*
* Retention only needs the inventoried inodes to outlive the installer's rename or
* unlink, so files share their inode with the source and bytes are copied only when
* the filesystem cannot preserve identity, a plugin boundary checks it, or relocation rewrites it.
* One walk performs the inventory check, publication, relocation, and escape check
* for every entry.
*/
async function linkUpdateCandidatePluginTrees(plan, params) {
	const targets = resolveUpdateCandidatePluginTreeTargets(plan, params);
	const { privateRoot, candidateRoot, hostLinks, relocations, destinationFor } = targets;
	const assertEntry = async (entry) => {
		await params.onProgress?.();
		const current = await fs$1.lstat(entry.path, { bigint: true });
		assertUpdateCandidatePluginEntryStat(entry, current);
		if (entry.kind === "symlink" && await fs$1.readlink(entry.path) !== entry.link) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
		return current;
	};
	for (const entry of plan.entries) if (path.basename(entry.path) === "openclaw.plugin.json") await assertEntry(entry);
	const pluginFiles = collectPluginSafetyInspectedFiles(plan.entries);
	await targets.assertBindings();
	params.assertCurrent();
	await fs$1.mkdir(privateRoot, {
		recursive: true,
		mode: 448
	});
	const preparedDirectories = /* @__PURE__ */ new Map([[privateRoot, Promise.resolve(void 0)]]);
	const prepareDirectory = (directory, mode) => {
		let preparing = preparedDirectories.get(directory);
		if (!preparing) {
			params.assertCurrent();
			preparing = fs$1.mkdir(directory, {
				recursive: true,
				mode
			});
			preparedDirectories.set(directory, preparing);
		}
		return preparing;
	};
	let destinationRoot;
	const copyEntry = async (entry, destination) => {
		const root$1 = await (destinationRoot ??= root(privateRoot));
		await copyUpdateCandidatePluginFileBytes({
			entry,
			privateRoot,
			destination
		}, root$1, {
			assertBeforeMutation: params.assertCurrent,
			assertAfterCopy: async () => {
				await assertEntry(entry);
			}
		});
		const relocate = resolveRuntimeFileRelocator(destination);
		if (relocate) await relocate(destination, entry.path, destination, relocations, params.assertCurrent);
		if ((entry.mode & 384) !== 384) {
			params.assertCurrent();
			await fs$1.chmod(destination, entry.mode);
		}
	};
	const copyDevices = /* @__PURE__ */ new Map();
	const requiresCopy = async (entry) => {
		if (process.platform !== "linux") return false;
		let copy = copyDevices.get(entry.dev);
		if (copy === void 0) {
			copy = (await fs$1.statfs(entry.path)).type === 2035054128;
			copyDevices.set(entry.dev, copy);
		}
		return copy;
	};
	const counts = {
		linked: 0,
		copied: 0
	};
	const directories = [];
	const materialize = async (entry) => {
		const admitted = await assertEntry(entry);
		const destination = destinationFor(entry.path);
		const directory = entry.kind === "directory" ? destination : path.dirname(destination);
		await prepareDirectory(directory, entry.kind === "directory" ? entry.mode | 448 : 448);
		if (entry.kind === "directory") directories.push(entry);
		else if (entry.kind === "symlink") {
			params.assertCurrent();
			await fs$1.symlink(entry.link, destination, entry.linkType);
			await relocateRuntimeSymlink(destination, entry.path, destination, relocations, params.assertCurrent);
			assertUpdateCandidatePluginLinkTarget(destination, path.resolve(path.dirname(destination), await fs$1.readlink(destination)), {
				privateRoot,
				candidateRoot
			});
		} else {
			let copy = pluginFiles.has(entry.path) || Boolean(resolveRuntimeFileRelocator(destination)) || await requiresCopy(entry);
			if (!copy) {
				params.assertCurrent();
				try {
					await fs$1.link(entry.path, destination);
				} catch (error) {
					if (!isLinkUnsupported(error)) throw error;
					copy = true;
				}
			}
			if (copy) {
				await copyEntry(entry, destination);
				counts.copied += 1;
			} else {
				const linked = await fs$1.lstat(destination, { bigint: true });
				if (!linked.isFile() || linked.dev.toString() !== entry.dev || linked.ino.toString() !== entry.ino || !sameFileMutationMetadata(admitted, linked)) throw new Error(`Retained runtime entry does not reference its inventoried file: ${entry.path}`);
				counts.linked += 1;
			}
		}
		params.onMaterialized?.();
	};
	const files = [];
	const inodes = /* @__PURE__ */ new Set();
	const drain = async () => {
		await runUpdateCandidatePluginTasks(files.map((entry) => () => materialize(entry)));
		files.length = 0;
		inodes.clear();
	};
	for (const entry of plan.entries) {
		const inode = `${entry.dev}:${entry.ino}`;
		if (files.length && (entry.kind !== "file" || files.length === 4 || inodes.has(inode))) await drain();
		if (entry.kind === "file") {
			files.push(entry);
			inodes.add(inode);
		} else await materialize(entry);
	}
	if (files.length) await drain();
	await targets.assertBindings();
	const privateAliases = await publishUpdateCandidatePluginTreeLinks({
		privateRoot,
		candidateRoot,
		hostLinks,
		aliases: targets.aliases,
		assertBeforeMutation: params.assertCurrent
	});
	for (const alias of privateAliases) await verifyUpdateCandidatePluginTree(alias, {
		privateRoot,
		candidateRoot,
		hostLinks
	});
	for (const entry of directories.toSorted((left, right) => right.path.length - left.path.length)) {
		params.assertCurrent();
		await fs$1.chmod(destinationFor(entry.path), entry.mode);
		params.onMaterialized?.();
	}
	return counts;
}
//#endregion
//#region src/infra/update-retained-runtime.ts
const log = createSubsystemLogger("update/retained-runtime");
/** The command retains its own workers through reporting, rollback, and native settlement. */
async function withRetainedUpdateRuntime(moduleUrl, operation) {
	return await withUserPathBaseDirectory(tryProcessCwd(), () => runWithRetainedUpdateRuntime(moduleUrl, operation));
}
async function runWithRetainedUpdateRuntime(moduleUrl, operation) {
	let directory;
	let prepared = false;
	let closing = false;
	let preparation;
	let unregister;
	let parkedCwd;
	return await withRuntimeWorkerGeneration(async (bind) => await operation((params) => {
		preparation = (async () => {
			const { mutationRoots, installTarget, env, timeoutMs } = params;
			const assertCurrent = () => {
				if (closing) throw new Error("The updater's retained runtime is closing");
				params.assertCurrent();
			};
			assertCurrent();
			if (prepared) return;
			const root = await resolveOpenClawPackageRoot({ moduleUrl });
			if (!root) throw new Error("Cannot retain the running updater's package root");
			const sourceRoot = await fs$1.realpath(root);
			assertCurrent();
			const mutations = mutationRoots.map((entry) => resolveIdentityPathViaExistingAncestorSync(path.resolve(entry)));
			const packageOwner = installTarget ? resolveNativePackageProjectRoot(installTarget, env) ?? installTarget.globalRoot : void 0;
			const mutationBoundaries = [...mutations, ...packageOwner ? [resolveIdentityPathViaExistingAncestorSync(path.resolve(packageOwner))] : []];
			const cwd = tryProcessCwd();
			if (!parkedCwd && cwd) {
				const physicalCwd = resolveIdentityPathViaExistingAncestorSync(cwd);
				if (mutationBoundaries.some((entry) => isPathInside(entry, physicalCwd))) {
					const parked = path.parse(process.execPath).root;
					assertCurrent();
					process.chdir(parked);
					parkedCwd = {
						original: cwd,
						parked: tryProcessCwd() ?? parked
					};
				}
			}
			if (!mutations.some((entry) => isPathInside(entry, sourceRoot) || isPathInside(sourceRoot, entry))) return;
			await maintainRetainedUpdateRuntimes({
				packageRoots: [sourceRoot],
				repair: true,
				assertCurrent
			});
			assertCurrent();
			const boundaries = [sourceRoot, ...mutationBoundaries];
			const parent = resolveRetainedUpdateRuntimeParents(sourceRoot, mutationBoundaries).at(-1);
			const outsideMutation = (candidate) => !boundaries.some((entry) => isPathInside(entry, candidate));
			if ((installTarget || !sourceRoot.split(path.sep).includes("node_modules")) && outsideMutation(parent)) {
				const sourceStat = await fs$1.stat(sourceRoot);
				assertCurrent();
				try {
					const parentStat = await fs$1.stat(parent);
					if (sourceStat.dev === parentStat.dev) {
						directory = await fs$1.mkdtemp(path.join(parent, "openclaw-update-runtime-"));
						unregister = registerRetainedUpdateRuntime(directory);
					}
				} catch (error) {
					if (![
						"EACCES",
						"EPERM",
						"EROFS",
						"ENOENT",
						"ENOTDIR",
						"ENOSPC",
						"EDQUOT"
					].some((code) => hasErrnoCode(error, code))) throw error;
				}
			}
			if (!directory) {
				const temporary = resolveIdentityPathViaExistingAncestorSync(path.resolve(os.tmpdir()));
				if (!outsideMutation(temporary)) throw new Error("Updater temporary directory is inside an installation being replaced");
				assertCurrent();
				directory = await fs$1.mkdtemp(path.join(temporary, "openclaw-update-runtime-"));
				unregister = registerRetainedUpdateRuntime(directory);
			}
			const privateRoot = await fs$1.realpath(directory);
			assertCurrent();
			if (!outsideMutation(privateRoot)) throw new Error("Retained updater directory overlaps an installation being replaced");
			const project = (source) => {
				const base = path.parse(source).root;
				return path.join(privateRoot, "tree", Buffer.from(base).toString("hex"), path.relative(base, source));
			};
			const candidateRoot = project(sourceRoot);
			const roots = /* @__PURE__ */ new Map();
			for (const name of [
				"package.json",
				"dist",
				"node_modules"
			]) {
				const entry = path.join(sourceRoot, name);
				const present = await fs$1.lstat(entry).catch(ignoreMissingUpdateCandidateFile);
				assertCurrent();
				if (present) roots.set(entry, project(entry));
			}
			const inventoryStartedAt = performance.now();
			const plan = await prepareUpdateCandidatePluginTrees({
				roots,
				project,
				targetStateDir: privateRoot,
				candidateRoot,
				retainedHostRoot: sourceRoot,
				retainedDependencyRoot: packageOwner ? resolveIdentityPathViaExistingAncestorSync(path.resolve(packageOwner)) : sourceRoot,
				onProgress: assertCurrent
			});
			const inventoryMs = Math.round(performance.now() - inventoryStartedAt);
			const materializationStartedAt = performance.now();
			const counts = await withUpdateCandidateIoBudget({
				directory: privateRoot,
				bytes: plan.bytes,
				timeoutMs,
				progress: "reported"
			}, async (signal, reportProgress) => await linkUpdateCandidatePluginTrees(plan, {
				targetStateDir: privateRoot,
				candidateRoot,
				onMaterialized: reportProgress,
				onProgress: () => {
					signal.throwIfAborted();
				},
				assertCurrent: () => {
					signal.throwIfAborted();
					assertCurrent();
				}
			}));
			const materializationMs = Math.round(performance.now() - materializationStartedAt);
			assertCurrent();
			const relocations = prepareRuntimeRelocations([...plan.relocations, ...root === sourceRoot ? [] : [{
				sourceRoot: root,
				destinationRoot: candidateRoot
			}]].map((entry) => Object.freeze({ ...entry })));
			const resolve = (url) => pathToFileURL(relocateRuntimePath(fileURLToPath(url), relocations));
			bind(resolve);
			retainUpdateRuntimeImports(relocations.rules, plan.entries.filter((entry) => entry.kind === "file").map((entry) => entry.path));
			prepared = true;
			return {
				inventoryMs,
				materializationMs,
				entries: plan.entries.length,
				estimatedBytes: plan.bytes,
				...counts
			};
		})();
		return preparation;
	}), async () => {
		closing = true;
		await preparation?.catch(() => void 0);
		if (directory) {
			if (prepared) reportRetainedUpdateRuntime(directory, "worker generation settled; cleanup deferred to the next eligible update or openclaw doctor --fix");
			else await removeTemporaryArtifacts(directory, "Updater runtime");
		}
		unregister?.();
	}, (reason) => {
		if (directory) reportRetainedUpdateRuntime(directory, reason);
		return directory;
	}).finally(() => {
		if (!parkedCwd || tryProcessCwd() !== parkedCwd.parked) return;
		try {
			process.chdir(parkedCwd.original);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) log.warn(`Could not restore updater launch directory: ${formatErrorMessage(error)}`);
		}
	});
}
//#endregion
export { withRetainedUpdateRuntime };
