import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { i as isPathStrictlyInside, r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { r as hashFileMutationSnapshotSync } from "./file-descriptor-BWLpOgrg.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { i as resolveUpdateHashWorkerCount } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-B_IER0ZB.mjs";
import { r as isGitRuntimeStagingName } from "./plugin-safety-inspected-files-C9Of4ALD.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { t as ignoreMissingUpdateCandidateFile } from "./update-candidate-files-BfBN3EpP.mjs";
import { a as relocateRuntimeSymlink, n as readRuntimeModulesManifest, s as resolveRuntimeFileRelocator } from "./update-runtime-relocation-VUX2bZ3P.mjs";
import { n as isPackageUpdateRecoveryArtifactName } from "./package-update-backup-paths-CyGBQ44q.mjs";
import { c as publishUpdateCandidatePluginTreeLinks, d as createUpdateCandidatePluginPool, f as runUpdateCandidatePluginTasks, i as assertUpdateCandidatePluginEntryStat, l as resolveUpdateCandidatePluginTreeTargets, o as ignoreUnresolvedPluginLink, r as copyUpdateCandidatePluginFiles, s as isUpdateCandidateHostLauncher, u as verifyUpdateCandidatePluginTree } from "./update-candidate-plugin-file-DjSpiZwE.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/update-candidate-plugin-hash.ts
/** The inventory owner drains its four-file read window before retiring these workers. */
async function withUpdateCandidatePluginFileHashing(operation) {
	let files = 0;
	let workers;
	let pool;
	try {
		return await operation(async (filePath, expected) => {
			if (++files < 1024) return hashFileMutationSnapshotSync(filePath, expected);
			workers ??= resolveUpdateHashWorkerCount();
			if (workers === 0) return hashFileMutationSnapshotSync(filePath, expected);
			pool ??= createUpdateCandidatePluginPool(workers);
			const reply = await (await pool).run({
				type: "snapshot-hash",
				filePath,
				expected: {
					dev: expected.dev,
					ino: expected.ino,
					size: expected.size,
					birthtimeNs: expected.birthtimeNs,
					mtimeNs: expected.mtimeNs,
					ctimeNs: expected.ctimeNs,
					mode: expected.mode,
					uid: expected.uid,
					gid: expected.gid
				}
			}, {});
			switch (reply.type) {
				case "failed": throw Object.assign(reply.error, {
					...reply.code === void 0 ? {} : { code: reply.code },
					...reply.details === void 0 ? {} : { details: reply.details }
				});
				case "hashed": return reply.sha256;
				default: throw new Error("Unexpected update inventory hash worker reply");
			}
		});
	} finally {
		await (await pool)?.close();
	}
}
//#endregion
//#region src/infra/update-candidate-plugin-tree.ts
async function dependencyOwner(target, withinRetainedHost = false, retainedHost, fileOwnerBoundaries) {
	const parts = target.split(path.sep);
	const store = parts.indexOf(".pnpm");
	if (store >= 0 && !withinRetainedHost) return parts.slice(0, store + 1).join(path.sep);
	const modules = parts.indexOf("node_modules");
	if (modules >= 0 && !withinRetainedHost) return parts.slice(0, modules + 1).join(path.sep);
	const stat = await fs.stat(target);
	let directory = stat.isDirectory() ? target : path.dirname(target);
	const fallback = target;
	for (;;) {
		if (!withinRetainedHost && stat.isFile() && fileOwnerBoundaries?.some((boundary) => isPathInside(directory, boundary))) return fallback;
		if (directory === retainedHost?.root) {
			const entries = stat.isDirectory() ? await fs.readdir(target) : [];
			if (entries.length === 1 && entries[0] === "node_modules" && (await fs.lstat(path.join(target, "node_modules"))).isDirectory()) {
				retainedHost.moduleOnlyRoots.add(target);
				return target;
			}
			return directory;
		}
		if (await fs.stat(path.join(directory, "package.json")).catch(ignoreMissingUpdateCandidateFile)) return directory;
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
	return await withUpdateCandidatePluginFileHashing((hashFile) => prepareUpdateCandidatePluginTreesWithHashing(params, hashFile));
}
async function prepareUpdateCandidatePluginTreesWithHashing(params, hashFile) {
	const roots = new Map(params.roots);
	const privateRoot = resolvePathViaExistingAncestorSync$1(path.resolve(params.targetStateDir));
	const candidateRoot = resolvePathViaExistingAncestorSync$1(path.resolve(params.candidateRoot));
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
		const stat = await fs.lstat(file, { bigint: true });
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
			ctimeNs: stat.ctimeNs.toString(),
			uid: stat.uid.toString(),
			gid: stat.gid.toString(),
			sha256: await hashFile(file, stat)
		};
		else if (stat.isSymbolicLink()) {
			const target = process.platform === "win32" ? await fs.stat(file).catch(ignoreUnresolvedPluginLink) : void 0;
			entry = {
				...common,
				kind: "symlink",
				link: await fs.readlink(file),
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
				if (await fs.stat(dependency).catch((error) => {
					if (hasNodeErrorCode(error, "ENOTDIR")) return;
					return ignoreMissingUpdateCandidateFile(error);
				})) {
					const realModules = await fs.realpath(modulesDir);
					assertUpdateCandidatePluginCopySource(modulesDir, privateRoot);
					assertUpdateCandidatePluginCopySource(realModules, privateRoot);
					moduleOwners.add(realModules);
					if (realModules !== modulesDir) moduleAliases.set(modulesDir, realModules);
					if (boundary && isPathInside(modulesDir, boundary)) {
						const realDependency = await fs.realpath(dependency);
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
			const real = await fs.realpath(directory);
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
		const entries = await fs.readdir(directory, { withFileTypes: true });
		const mayContain = (name) => entries.some((entry) => entry.name.toLowerCase() === name || /[^\x20-\x7e]|[. ]$/u.test(entry.name));
		if (mayContain("package.json")) await discoverHoistedDependencies(directory);
		const modules = mayContain(".modules.yaml") ? await readRuntimeModulesManifest(path.join(directory, ".modules.yaml")) : null;
		if (typeof modules?.manifest.virtualStoreDir === "string") {
			const store = await fs.realpath(path.resolve(directory, modules.manifest.virtualStoreDir));
			stores.add(store);
			addRoot(store);
		}
		for (const entry of entries) if (entry.name === "node_modules" && (entry.isDirectory() || entry.isSymbolicLink())) {
			const owner = await fs.realpath(path.join(directory, entry.name)).catch(ignoreUnresolvedPluginLink);
			if (owner) {
				const source = path.join(directory, entry.name);
				assertUpdateCandidatePluginCopySource(owner, privateRoot);
				moduleOwners.add(owner);
				addRoot(owner);
				if (source !== owner) moduleAliases.set(source, owner);
			}
		}
		const leaves = await runUpdateCandidatePluginTasks(entries.filter((entry) => {
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
					real: await fs.realpath(file).catch((error) => ignoreUnresolvedPluginLink(error) ?? target)
				}
			};
		}));
		const observations = new Map(leaves.map((leaf) => [leaf.measured.path, leaf]));
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
			if (!await fs.lstat(source).catch((error) => {
				if (hasNodeErrorCode(error, "ENOTDIR")) return;
				return ignoreMissingUpdateCandidateFile(error);
			})) continue;
			const real = await fs.realpath(source).catch(ignoreMissingUpdateCandidateFile);
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
			const owner = (!retainedDependency ? store : void 0) ?? await dependencyOwner(real, retainedDependency, isRetainedDependency(real) ? retainedHost : void 0, [privateRoot, file]).catch((cause) => {
				throw new Error(`Cannot privately copy plugin dependency ${file} -> ${real}`, { cause });
			});
			if (excludesInferredRoot(owner)) throw Object.assign(/* @__PURE__ */ new Error(`Cannot privately copy host-owned plugin link ${file} -> ${real}; this dependency reaches OpenClaw-owned files. Repair the link before retrying the update.`), { code: "host-owned-plugin-link" });
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
	for (const root of [...hostRoots, ...hosts]) relocations.push({
		sourceRoot: root,
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
	const targets = resolveUpdateCandidatePluginTreeTargets(plan, params, params.onProgress);
	const { privateRoot, candidateRoot, copies, hostLinks, relocations, destinationFor } = targets;
	const assertEntry = async (entry) => {
		assertUpdateCandidatePluginEntryStat(entry, await fs.lstat(entry.path, { bigint: true }));
		if (entry.kind === "symlink" && await fs.readlink(entry.path) !== entry.link) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
		params.onProgress?.();
	};
	const assertEntries = async () => {
		await runUpdateCandidatePluginTasks(plan.entries.map((entry) => () => assertEntry(entry)));
	};
	await targets.assertBindings();
	await assertEntries();
	await fs.mkdir(privateRoot, {
		recursive: true,
		mode: 448
	});
	const rootIdentity = await readDirectoryIdentity(privateRoot);
	const destinationRoot = await root(privateRoot);
	assertDirectoryIdentitySync(privateRoot, rootIdentity);
	const preparedDirectories = /* @__PURE__ */ new Set([privateRoot]);
	for (const entry of plan.entries) if (entry.kind === "directory") {
		const destination = destinationFor(entry.path);
		await fs.mkdir(destination, {
			recursive: true,
			mode: entry.mode | 448
		});
		params.onProgress?.();
		preparedDirectories.add(destination);
	}
	for (const entry of plan.entries) if (entry.kind !== "directory") {
		const parent = path.dirname(destinationFor(entry.path));
		if (!preparedDirectories.has(parent)) {
			await fs.mkdir(parent, {
				recursive: true,
				mode: 448
			});
			params.onProgress?.();
			preparedDirectories.add(parent);
		}
	}
	const files = plan.entries.filter((entry) => entry.kind === "file");
	await copyUpdateCandidatePluginFiles(files, {
		privateRoot,
		rootIdentity,
		destinationRoot,
		destinationFor,
		onProgress: params.onProgress
	});
	for (const entry of plan.entries) if (entry.kind === "symlink") {
		await assertEntry(entry);
		const destination = destinationFor(entry.path);
		await fs.symlink(entry.link, destination, entry.linkType);
		params.onProgress?.();
	}
	await targets.assertBindings();
	await assertEntries();
	for (const entry of plan.entries) if (entry.kind !== "directory") {
		const target = destinationFor(entry.path);
		const relocate = entry.kind === "symlink" ? relocateRuntimeSymlink : resolveRuntimeFileRelocator(target);
		if (relocate) {
			await relocate(target, entry.path, target, relocations);
			params.onProgress?.();
		}
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
		onCodeLink: params.onCodeLink,
		onProgress: params.onProgress
	};
	for (const treeRoot of [...privateAliases, ...copies.map(([, target]) => target)]) await verifyUpdateCandidatePluginTree(treeRoot, verification);
	for (const entry of plan.entries) if (entry.kind === "file" && (entry.mode & 384) !== 384) {
		await fs.chmod(destinationFor(entry.path), entry.mode);
		params.onProgress?.();
	}
	for (const entry of plan.entries.filter((candidate) => candidate.kind === "directory").toSorted((left, right) => right.path.length - left.path.length)) {
		await fs.chmod(destinationFor(entry.path), entry.mode);
		params.onProgress?.();
	}
}
//#endregion
export { copyUpdateCandidatePluginTrees as n, prepareUpdateCandidatePluginTrees as r, assertUpdateCandidatePluginCopySource as t };
