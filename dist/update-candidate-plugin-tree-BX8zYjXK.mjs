import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { i as isPathStrictlyInside, r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as createFileCopyWithCloneFallback } from "./fs-safe-file-copy-BgC-YGR-.mjs";
import { r as captureUpdateCandidatePluginCodeLink } from "./update-candidate-plugin-code-links-C3dE-q0T.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-B4yBUiAP.mjs";
import { r as isGitRuntimeStagingName } from "./plugin-safety-inspected-files-Bbt-kJ4j.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { a as relocateRuntimeEntry, i as readRuntimeModulesManifest, n as isPackageUpdateRecoveryArtifactName, r as prepareRuntimeRelocations, s as relocateRuntimePath } from "./package-update-backup-paths-DyfDj6A4.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/infra/update-candidate-plugin-tree-links.ts
const isUpdateCandidateHostLauncher = (file) => path.basename(path.dirname(file)) === ".bin" && [
	"openclaw",
	"openclaw.cmd",
	"openclaw.ps1"
].includes(path.basename(file));
function assertUpdateCandidatePluginEntryStat(entry, current) {
	const sameKind = entry.kind === "directory" ? current.isDirectory() : entry.kind === "file" ? current.isFile() : current.isSymbolicLink();
	const sameIdentity = current.dev.toString() === entry.dev && current.ino.toString() === entry.ino;
	const sameMode = Number(current.mode & 4095n) === entry.mode;
	if (!sameKind || !sameIdentity || !sameMode) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	if (!(entry.kind !== "file" || sameFileMutationFingerprint(current, {
		dev: BigInt(entry.dev),
		ino: BigInt(entry.ino),
		size: BigInt(entry.size),
		birthtimeNs: BigInt(entry.birthtimeNs),
		mtimeNs: BigInt(entry.mtimeNs),
		ctimeNs: BigInt(entry.ctimeNs)
	})) || entry.kind === "symlink" && current.size !== BigInt(entry.size)) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
}
/** Rebase the admitted plan onto the caller's state directory and check its bindings still hold. */
function resolveUpdateCandidatePluginTreeTargets(plan, params) {
	const privateRoot = resolvePathViaExistingAncestorSync(path.resolve(params.targetStateDir));
	const candidateRoot = resolvePathViaExistingAncestorSync(path.resolve(params.candidateRoot));
	if (candidateRoot !== plan.candidateRoot) throw new Error("Plugin files changed during update preparation; rerun the update");
	const rebasing = prepareRuntimeRelocations([{
		sourceRoot: plan.privateRoot,
		destinationRoot: privateRoot
	}]);
	const rebase = (file) => relocateRuntimePath(file, rebasing);
	const copies = plan.copies.map(([source, target]) => [source, rebase(target)]);
	for (const [, target] of copies) {
		const destination = resolvePathViaExistingAncestorSync(target);
		if (!isPathInside(privateRoot, destination)) throw new Error("Plugin copy destination escapes update state");
		for (const [other] of copies) if (isPathInside(other, destination) || isPathInside(destination, other)) throw new Error("Plugin copy source overlaps its destination");
	}
	const copyOwner = createRuntimePathLookup(copies.map((copy) => [copy[0], copy]));
	const destinationFor = (source) => {
		const owner = copyOwner(source);
		if (!owner) throw new Error("Inventoried plugin entry has no copy owner");
		return path.join(owner[1], path.relative(owner[0], source));
	};
	const assertBindings = async () => {
		const checked = await runTasksWithConcurrency({
			limit: 4,
			errorMode: "stop",
			tasks: [...plan.moduleBindings.map(([source, real]) => async () => {
				if (await fs$1.realpath(source) !== real) throw new Error(`Plugin module owner changed after snapshot inventory: ${source}`);
			}), ...plan.edges.map((edge) => async () => {
				const target = path.resolve(path.dirname(edge.source), await fs$1.readlink(edge.source));
				const real = await fs$1.realpath(edge.source).catch((error) => {
					if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return target;
					throw error;
				});
				if (target !== edge.target || real !== edge.real) throw new Error(`Plugin link changed after snapshot inventory: ${edge.source}`);
			})]
		});
		if (checked.hasError) throw checked.firstError;
	};
	return {
		privateRoot,
		candidateRoot,
		copies,
		hostLinks: new Set(plan.hostLinks.map(rebase)),
		relocations: prepareRuntimeRelocations(plan.relocations.map(({ sourceRoot, destinationRoot }) => ({
			sourceRoot,
			destinationRoot: rebase(destinationRoot)
		}))),
		aliases: plan.aliases.map(([alias, target]) => [rebase(alias), rebase(target)]),
		destinationFor,
		assertBindings
	};
}
/** Publish host links and module aliases; both must stay inside the private tree. */
async function publishUpdateCandidatePluginTreeLinks(params) {
	const { privateRoot, candidateRoot } = params;
	for (const link of params.hostLinks) {
		if (!isPathInside(privateRoot, resolvePathViaExistingAncestorSync(path.dirname(link)))) throw new Error("Plugin host link escapes update state");
		params.assertBeforeMutation?.();
		await fs$1.mkdir(path.dirname(link), { recursive: true });
		const existing = await fs$1.lstat(link).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (existing) {
			if (!existing.isSymbolicLink() || path.resolve(path.dirname(link), await fs$1.readlink(link)) !== candidateRoot) throw new Error("Plugin host link conflicts with its update owner");
		} else {
			params.assertBeforeMutation?.();
			await fs$1.symlink(candidateRoot, link, process.platform === "win32" ? "junction" : "dir");
		}
	}
	const privateAliases = [];
	for (const [alias, target] of params.aliases) {
		if (!isPathInside(privateRoot, resolvePathViaExistingAncestorSync(path.dirname(alias)))) throw new Error("Plugin module alias escapes update state");
		if (await fs$1.lstat(alias).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		})) {
			if (await fs$1.realpath(alias) !== await fs$1.realpath(target)) throw new Error("Plugin module alias conflicts with its private owner");
		} else {
			params.assertBeforeMutation?.();
			await fs$1.mkdir(path.dirname(alias), { recursive: true });
			params.assertBeforeMutation?.();
			await fs$1.symlink(target, alias, process.platform === "win32" ? "junction" : "dir");
		}
		privateAliases.push(alias);
	}
	return privateAliases;
}
/** Symbolic links in the private tree may only point back into it or at the update host. */
function assertUpdateCandidatePluginLinkTarget(file, target, params) {
	if (!isPathInside(params.privateRoot, target) && !(isUpdateCandidateHostLauncher(file) && isPathInside(params.candidateRoot, target))) throw new Error("Copied plugin symlink escapes update state");
}
async function verifyUpdateCandidatePluginTree(rootFile, params) {
	const readEntry = async (file) => {
		const stat = await fs$1.lstat(file, { bigint: true });
		return {
			file,
			stat,
			link: stat.isSymbolicLink() ? await fs$1.readlink(file) : void 0
		};
	};
	const verify = async ({ file, stat, link }) => {
		if (params.hostLinks.has(file)) {
			if (!stat.isSymbolicLink() || path.resolve(path.dirname(file), link) !== params.candidateRoot) throw new Error("Copied plugin host link does not target the update");
		} else if (stat.isSymbolicLink()) assertUpdateCandidatePluginLinkTarget(file, path.resolve(path.dirname(file), link), params);
		if (link !== void 0) {
			params.onCodeLink?.(captureUpdateCandidatePluginCodeLink(file, stat, link));
			return;
		}
		if (stat.isDirectory()) {
			const listing = await fs$1.readdir(file, { withFileTypes: true });
			const leaves = await runTasksWithConcurrency({
				limit: 4,
				errorMode: "stop",
				tasks: listing.filter((entry) => !entry.isDirectory()).map((entry) => () => readEntry(path.join(file, entry.name)))
			});
			if (leaves.hasError) throw leaves.firstError;
			const observations = new Map(leaves.results.map((entry) => [entry.file, entry]));
			for (const entry of listing) {
				const child = path.join(file, entry.name);
				await verify(entry.isDirectory() ? await readEntry(child) : observations.get(child));
			}
		}
	};
	await verify(await readEntry(rootFile));
}
//#endregion
//#region src/infra/update-candidate-plugin-tree.ts
async function dependencyOwner(target, withinRetainedHost = false, retainedHost) {
	const parts = target.split(path.sep);
	const store = parts.indexOf(".pnpm");
	if (store >= 0 && !withinRetainedHost) return parts.slice(0, store + 1).join(path.sep);
	const modules = parts.indexOf("node_modules");
	if (modules >= 0 && !withinRetainedHost) return parts.slice(0, modules + 1).join(path.sep);
	const stat = await fs$1.stat(target);
	let directory = stat.isDirectory() ? target : path.dirname(target);
	const fallback = target;
	for (;;) {
		if (directory === retainedHost?.root) {
			const entries = stat.isDirectory() ? await fs$1.readdir(target) : [];
			if (entries.length === 1 && entries[0] === "node_modules" && (await fs$1.lstat(path.join(target, "node_modules"))).isDirectory()) {
				retainedHost.moduleOnlyRoots.add(target);
				return target;
			}
			return directory;
		}
		if (await fs$1.stat(path.join(directory, "package.json")).then(() => true, (error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return false;
			throw error;
		})) return directory;
		const parent = path.dirname(directory);
		if (parent === directory) return fallback;
		directory = parent;
	}
}
function assertUpdateCandidatePluginCopySource(source, privateRoot) {
	if (isPathInside(source, privateRoot) || isPathInside(privateRoot, source)) throw new Error("Plugin copy source overlaps update state");
}
/** Measure the same dependency owners and private link graph that copying will materialize. */
async function prepareUpdateCandidatePluginTrees(params) {
	const roots = new Map(params.roots);
	const privateRoot = resolvePathViaExistingAncestorSync(path.resolve(params.targetStateDir));
	const candidateRoot = resolvePathViaExistingAncestorSync(path.resolve(params.candidateRoot));
	const scanned = /* @__PURE__ */ new Set();
	const staging = /* @__PURE__ */ new Set();
	const footprints = /* @__PURE__ */ new Map();
	const edges = /* @__PURE__ */ new Map();
	const hosts = /* @__PURE__ */ new Set();
	const hostRoots = /* @__PURE__ */ new Set();
	const stores = /* @__PURE__ */ new Set();
	const moduleAliases = /* @__PURE__ */ new Map();
	const moduleOwners = /* @__PURE__ */ new Set();
	const isRecoveryArtifact = (file) => {
		for (let current = file; path.dirname(current) !== current; current = path.dirname(current)) if (moduleOwners.has(path.dirname(current)) && isPackageUpdateRecoveryArtifactName(path.basename(current))) return true;
		return false;
	};
	const retainedHostRoot = params.retainedHostRoot;
	const retainedHost = retainedHostRoot ? {
		root: retainedHostRoot,
		moduleOnlyRoots: /* @__PURE__ */ new Set()
	} : void 0;
	const isOwnedHostEdge = (file) => path.basename(file) === "openclaw" && moduleOwners.has(path.dirname(file));
	const lookupRoots = (values) => createRuntimePathLookup(Array.from(values, (root) => [root, root]));
	let rootLookup;
	let retainedRootLookup;
	let hostLookup = lookupRoots(hosts);
	let hostRootLookup = lookupRoots(hostRoots);
	const invalidateRoots = () => {
		rootLookup = void 0;
		retainedRootLookup = void 0;
	};
	const covered = (file) => (rootLookup ??= lookupRoots(roots.keys()))(file) !== void 0;
	const insideHost = (file) => hostLookup(file) !== void 0 && !(retainedHostRoot && isPathInside(retainedHostRoot, file) && (retainedRootLookup ??= lookupRoots([...roots.keys()].filter((root) => isPathInside(retainedHostRoot, root))))(file) !== void 0);
	const isRetainedDependency = (root) => retainedHostRoot !== void 0 && root !== retainedHostRoot && isPathInside(retainedHostRoot, root);
	const excludesInferredRoot = (root) => !params.roots.has(root) && (insideHost(root) && !isRetainedDependency(root) || hostRoots.has(root));
	function addRoot(source) {
		if (!roots.has(source)) {
			roots.set(source, params.project(source));
			invalidateRoots();
		}
	}
	async function readEntry(file) {
		const stat = await fs$1.lstat(file, { bigint: true });
		const common = {
			path: file,
			size: Number(stat.size),
			mode: Number(stat.mode & 4095n),
			dev: stat.dev.toString(),
			ino: stat.ino.toString()
		};
		let entry;
		if (stat.isDirectory()) entry = {
			...common,
			kind: "directory"
		};
		else if (stat.isFile()) entry = {
			...common,
			kind: "file",
			birthtimeNs: stat.birthtimeNs.toString(),
			mtimeNs: stat.mtimeNs.toString(),
			ctimeNs: stat.ctimeNs.toString()
		};
		else if (stat.isSymbolicLink()) {
			const target = process.platform === "win32" ? await fs$1.stat(file).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return;
				throw error;
			}) : void 0;
			entry = {
				...common,
				kind: "symlink",
				link: await fs$1.readlink(file),
				linkType: target?.isDirectory() ? "junction" : "file"
			};
		} else throw new Error(`Unsupported plugin snapshot entry: ${file}`);
		return entry;
	}
	async function recordEntry(entry) {
		footprints.set(entry.path, entry);
		await params.onProgress?.();
	}
	async function measureEntry(file) {
		const entry = await readEntry(file);
		await recordEntry(entry);
		return entry;
	}
	async function discoverHoistedDependencies(directory) {
		const manifest = await tryReadJson(path.join(directory, "package.json"));
		if (!isRecord(manifest)) return;
		const boundary = params.retainedDependencyRoot && isPathInside(params.retainedDependencyRoot, directory) ? params.retainedDependencyRoot : void 0;
		const names = /* @__PURE__ */ new Set();
		for (const field of [
			"dependencies",
			"optionalDependencies",
			"peerDependencies"
		]) {
			const dependencies = manifest[field];
			if (isRecord(dependencies)) for (const [name, spec] of Object.entries(dependencies)) {
				const parsed = parseRegistryNpmSpec(name);
				if (typeof spec === "string" && parsed?.name === name && parsed.selectorKind === "none") names.add(name);
			}
		}
		for (const name of names) for (let ancestor = directory;; ancestor = path.dirname(ancestor)) {
			if (path.basename(ancestor) !== "node_modules") {
				const modulesDir = path.join(ancestor, "node_modules");
				if (boundary && !isPathInside(boundary, modulesDir)) break;
				const dependency = path.join(modulesDir, ...name.split("/"));
				if (await fs$1.stat(dependency).then(() => true, (error) => {
					if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return false;
					throw error;
				})) {
					const realModules = await fs$1.realpath(modulesDir);
					assertUpdateCandidatePluginCopySource(modulesDir, privateRoot);
					assertUpdateCandidatePluginCopySource(realModules, privateRoot);
					moduleOwners.add(realModules);
					if (realModules !== modulesDir) moduleAliases.set(modulesDir, realModules);
					if (boundary && isPathInside(modulesDir, boundary)) {
						const realDependency = await fs$1.realpath(dependency);
						assertUpdateCandidatePluginCopySource(realDependency, privateRoot);
						addRoot(realDependency);
						if (realDependency !== dependency) moduleAliases.set(dependency, realDependency);
					} else addRoot(realModules);
					break;
				}
			}
			if (path.dirname(ancestor) === ancestor) break;
		}
	}
	async function scan(directory) {
		assertUpdateCandidatePluginCopySource(directory, privateRoot);
		staging.delete(directory);
		if (scanned.has(directory)) return;
		scanned.add(directory);
		const rootEntry = await measureEntry(directory);
		if (rootEntry.kind === "symlink") {
			const target = path.resolve(path.dirname(directory), rootEntry.link);
			const real = await fs$1.realpath(directory);
			edges.set(directory, {
				target,
				real
			});
			if (path.basename(directory) === "node_modules") {
				moduleOwners.add(real);
				moduleAliases.set(directory, real);
			}
			return;
		}
		if (rootEntry.kind !== "directory") return;
		if (path.basename(directory) === "node_modules") moduleOwners.add(directory);
		const entries = await fs$1.readdir(directory, { withFileTypes: true });
		const mayContain = (name) => entries.some((entry) => entry.name.toLowerCase() === name || /[^\x20-\x7e]|[. ]$/u.test(entry.name));
		if (mayContain("package.json")) await discoverHoistedDependencies(directory);
		const modules = mayContain(".modules.yaml") ? await readRuntimeModulesManifest(path.join(directory, ".modules.yaml")) : null;
		if (typeof modules?.manifest.virtualStoreDir === "string") {
			const store = await fs$1.realpath(path.resolve(directory, modules.manifest.virtualStoreDir));
			stores.add(store);
			addRoot(store);
		}
		for (const entry of entries) if (entry.name === "node_modules" && (entry.isDirectory() || entry.isSymbolicLink())) {
			const owner = await fs$1.realpath(path.join(directory, entry.name)).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return;
				throw error;
			});
			if (owner) {
				const source = path.join(directory, entry.name);
				assertUpdateCandidatePluginCopySource(owner, privateRoot);
				moduleOwners.add(owner);
				addRoot(owner);
				if (source !== owner) moduleAliases.set(source, owner);
			}
		}
		const leaves = await runTasksWithConcurrency({
			limit: 4,
			errorMode: "stop",
			tasks: entries.filter((entry) => {
				const file = path.join(directory, entry.name);
				return !entry.isDirectory() && !isRecoveryArtifact(file) && !isOwnedHostEdge(file);
			}).map((entry) => async () => {
				const file = path.join(directory, entry.name);
				const measured = await readEntry(file);
				if (measured.kind !== "symlink") return { measured };
				const target = path.resolve(directory, measured.link);
				return {
					measured,
					edge: {
						target,
						real: await fs$1.realpath(file).catch((error) => {
							if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return target;
							throw error;
						})
					}
				};
			})
		});
		if (leaves.hasError) throw leaves.firstError;
		const observations = new Map(leaves.results.map((leaf) => [leaf.measured.path, leaf]));
		for (const entry of entries) {
			const file = path.join(directory, entry.name);
			if (isRecoveryArtifact(file)) continue;
			else if (isOwnedHostEdge(file)) continue;
			else if (entry.isDirectory()) {
				if (isGitRuntimeStagingName(entry.name) && !roots.has(file)) staging.add(file);
				else await scan(file);
			} else {
				const leaf = observations.get(file);
				await recordEntry(leaf.measured);
				if (leaf.edge) edges.set(file, leaf.edge);
			}
		}
	}
	async function refreshHostEdges() {
		const discovered = [];
		for (const owner of moduleOwners) {
			const source = path.join(owner, "openclaw");
			if (!await fs$1.lstat(source).then(() => true, (error) => {
				if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return false;
				throw error;
			})) continue;
			const real = await fs$1.realpath(source).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT")) return;
				throw error;
			});
			discovered.push({
				source,
				real
			});
		}
		hosts.clear();
		hostRoots.clear();
		for (const host of discovered) {
			if (discovered.some((other) => other.source !== host.source && isPathInside(other.source, host.source))) continue;
			hosts.add(host.source);
			if (host.real) hostRoots.add(host.real);
		}
		hostLookup = lookupRoots(hosts);
		hostRootLookup = lookupRoots(hostRoots);
		for (const root of roots.keys()) if (excludesInferredRoot(root)) {
			roots.delete(root);
			invalidateRoots();
		}
		for (const file of edges.keys()) if (insideHost(file)) edges.delete(file);
		for (const source of moduleAliases.keys()) if (insideHost(source)) moduleAliases.delete(source);
	}
	if (retainedHostRoot) await discoverHoistedDependencies(retainedHostRoot);
	const installationBoundsHost = retainedHostRoot !== void 0 && params.retainedDependencyRoot !== void 0 && isPathStrictlyInside(params.retainedDependencyRoot, retainedHostRoot);
	for (const source of params.roots.keys()) if (source.split(path.sep).includes("node_modules") && !(installationBoundsHost && isPathInside(retainedHostRoot, source))) addRoot(await dependencyOwner(source));
	for (;;) {
		for (const root of roots.keys()) await scan(root);
		await refreshHostEdges();
		const storeLookup = lookupRoots(stores);
		const stagingLookup = lookupRoots(staging);
		let added = false;
		for (const [file, { real, target }] of edges) {
			if (isRecoveryArtifact(file)) {
				edges.delete(file);
				continue;
			}
			if (isRecoveryArtifact(real) || isRecoveryArtifact(target)) throw new Error("Package recovery state cannot be a runtime dependency.");
			const directory = stagingLookup(real);
			if (directory && staging.delete(directory)) {
				await scan(directory);
				added = true;
			}
			if (covered(real) && !(insideHost(real) && isRetainedDependency(real)) || hostRoots.has(real) || isUpdateCandidateHostLauncher(file) && hostRootLookup(real) !== void 0) continue;
			const store = storeLookup(real);
			const retainedDependency = insideHost(real) && isRetainedDependency(real);
			const owner = (!retainedDependency ? store : void 0) ?? await dependencyOwner(real, retainedDependency, isRetainedDependency(real) ? retainedHost : void 0).catch((cause) => {
				throw new Error(`Cannot privately copy plugin dependency ${file} -> ${real}`, { cause });
			});
			if (excludesInferredRoot(owner)) throw new Error(`Cannot privately copy host-owned plugin link ${file} -> ${real}; use the openclaw package/SDK import or a separately owned plugin dependency.`);
			assertUpdateCandidatePluginCopySource(owner, privateRoot);
			addRoot(owner);
			added = true;
		}
		if (!added) break;
	}
	const copies = [...roots].filter(([source]) => ![...roots.keys()].some((other) => other !== source && isPathInside(other, source)));
	const copyOwner = createRuntimePathLookup(copies.map((copy) => [copy[0], copy]));
	function projected(file) {
		const copy = copyOwner(file);
		if (!copy) throw new Error("Plugin dependency has no private copy owner");
		return path.join(copy[1], path.relative(copy[0], file));
	}
	const relocations = copies.map(([sourceRoot, destinationRoot]) => ({
		sourceRoot,
		destinationRoot
	}));
	for (const [sourceRoot, real] of moduleAliases) relocations.push({
		sourceRoot,
		destinationRoot: projected(real)
	});
	for (const root of hostRoots) relocations.push({
		sourceRoot: root,
		destinationRoot: candidateRoot
	});
	for (const host of hosts) relocations.push({
		sourceRoot: host,
		destinationRoot: candidateRoot
	});
	for (const [file, { target, real }] of edges) {
		const host = isUpdateCandidateHostLauncher(file) ? hostRootLookup(real) : hostRoots.has(real) ? real : void 0;
		relocations.push({
			sourceRoot: target,
			destinationRoot: host ? path.join(candidateRoot, path.relative(host, real)) : projected(real)
		});
	}
	relocations.sort((a, b) => b.sourceRoot.length - a.sourceRoot.length);
	const hostLinks = new Set([...hosts].filter((root) => root !== params.retainedHostRoot).map(projected));
	const entries = [...footprints.values()].filter((entry) => {
		if (isRecoveryArtifact(entry.path) || insideHost(entry.path) || copyOwner(entry.path) === void 0) return false;
		const moduleOnlyRoots = retainedHost?.moduleOnlyRoots;
		if (moduleOnlyRoots?.has(entry.path) && (entry.kind !== "directory" || footprints.get(path.join(entry.path, "node_modules"))?.kind !== "directory") || moduleOnlyRoots?.has(path.dirname(entry.path)) && (path.basename(entry.path) !== "node_modules" || entry.kind !== "directory")) throw new Error(`Retired workspace changed during runtime retention: ${entry.path}`);
		return true;
	});
	const bytes = entries.reduce((total, entry) => total + Math.max(4096, Math.ceil(entry.size / 4096) * 4096), (hostLinks.size + moduleAliases.size) * 4096);
	const aliases = [...moduleAliases].map(([source, real]) => {
		const owner = copyOwner(source);
		return [owner ? path.join(owner[1], path.relative(owner[0], source)) : params.project(source), projected(real)];
	});
	return {
		bytes,
		privateRoot,
		candidateRoot,
		copies,
		entries,
		hostLinks: [...hostLinks],
		relocations,
		aliases,
		moduleBindings: [...moduleAliases],
		edges: [...edges].map(([source, edge]) => ({
			source,
			target: edge.target,
			real: edge.real
		}))
	};
}
/** Execute the admitted graph without rediscovering owners from newer source state. */
async function copyUpdateCandidatePluginTrees(plan, params) {
	const targets = resolveUpdateCandidatePluginTreeTargets(plan, params);
	const { privateRoot, candidateRoot, copies, hostLinks, relocations, destinationFor } = targets;
	const assertEntry = async (entry) => {
		assertUpdateCandidatePluginEntryStat(entry, await fs$1.lstat(entry.path, { bigint: true }));
		if (entry.kind === "symlink" && await fs$1.readlink(entry.path) !== entry.link) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	};
	const assertEntries = async () => {
		const checked = await runTasksWithConcurrency({
			limit: 4,
			errorMode: "stop",
			tasks: plan.entries.map((entry) => () => assertEntry(entry))
		});
		if (checked.hasError) throw checked.firstError;
	};
	await targets.assertBindings();
	await assertEntries();
	await fs$1.mkdir(privateRoot, {
		recursive: true,
		mode: 448
	});
	const destinationRoot = await root(privateRoot);
	const copyFile = createFileCopyWithCloneFallback();
	const preparedDirectories = /* @__PURE__ */ new Set([privateRoot]);
	for (const entry of plan.entries) if (entry.kind === "directory") {
		const destination = destinationFor(entry.path);
		await fs$1.mkdir(destination, {
			recursive: true,
			mode: entry.mode | 448
		});
		preparedDirectories.add(destination);
	}
	for (const entry of plan.entries) if (entry.kind !== "directory") {
		const parent = path.dirname(destinationFor(entry.path));
		if (!preparedDirectories.has(parent)) {
			await fs$1.mkdir(parent, {
				recursive: true,
				mode: 448
			});
			preparedDirectories.add(parent);
		}
	}
	const copied = await runTasksWithConcurrency({
		limit: 4,
		errorMode: "stop",
		tasks: plan.entries.filter((entry) => entry.kind === "file").map((entry) => async () => {
			await assertEntry(entry);
			const destination = destinationFor(entry.path);
			await copyFile(destinationRoot, path.relative(privateRoot, destination), entry.path, {
				overwrite: false,
				mkdir: false,
				durable: false,
				maxBytes: entry.size,
				mode: entry.mode | 384,
				sourceHardlinks: "allow",
				assertBeforeMutation: () => assertUpdateCandidatePluginEntryStat(entry, fs.lstatSync(entry.path, { bigint: true }))
			});
			await assertEntry(entry);
		})
	});
	if (copied.hasError) throw copied.firstError;
	for (const entry of plan.entries) if (entry.kind === "symlink") {
		await assertEntry(entry);
		const destination = destinationFor(entry.path);
		await fs$1.symlink(entry.link, destination, entry.linkType);
	}
	await targets.assertBindings();
	await assertEntries();
	for (const entry of plan.entries) if (entry.kind !== "directory") {
		const target = destinationFor(entry.path);
		await relocateRuntimeEntry(target, entry.path, target, entry.kind, relocations);
	}
	const privateAliases = await publishUpdateCandidatePluginTreeLinks({
		privateRoot,
		candidateRoot,
		hostLinks,
		aliases: targets.aliases
	});
	const verification = {
		privateRoot,
		candidateRoot,
		hostLinks,
		onCodeLink: params.onCodeLink
	};
	for (const alias of privateAliases) await verifyUpdateCandidatePluginTree(alias, verification);
	for (const [, target] of copies) await verifyUpdateCandidatePluginTree(target, verification);
	for (const entry of plan.entries) if (entry.kind === "file" && (entry.mode & 384) !== 384) await fs$1.chmod(destinationFor(entry.path), entry.mode);
	for (const entry of plan.entries.filter((candidate) => candidate.kind === "directory").toSorted((left, right) => right.path.length - left.path.length)) await fs$1.chmod(destinationFor(entry.path), entry.mode);
}
//#endregion
export { assertUpdateCandidatePluginLinkTarget as a, verifyUpdateCandidatePluginTree as c, assertUpdateCandidatePluginEntryStat as i, copyUpdateCandidatePluginTrees as n, publishUpdateCandidatePluginTreeLinks as o, prepareUpdateCandidatePluginTrees as r, resolveUpdateCandidatePluginTreeTargets as s, assertUpdateCandidatePluginCopySource as t };
