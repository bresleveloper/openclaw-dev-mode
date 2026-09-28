import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, nr as tuple, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-C_0BsNDD.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { i as relocateRuntimePath, n as relocateRuntimeEntry, t as readRuntimeModulesManifest } from "./update-runtime-relocation-YSSIn7u2.mjs";
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
	const rebase = (file) => relocateRuntimePath(file, [{
		sourceRoot: plan.privateRoot,
		destinationRoot: privateRoot
	}]);
	const copies = plan.copies.map(([source, target]) => [source, rebase(target)]);
	for (const [, target] of copies) {
		const destination = resolvePathViaExistingAncestorSync(target);
		if (!isPathInside(privateRoot, destination)) throw new Error("Plugin copy destination escapes update state");
		for (const [other] of copies) if (isPathInside(other, destination) || isPathInside(destination, other)) throw new Error("Plugin copy source overlaps its destination");
	}
	const destinationFor = (source) => {
		const owner = copies.find(([root]) => isPathInside(root, source));
		if (!owner) throw new Error("Inventoried plugin entry has no copy owner");
		return path.join(owner[1], path.relative(owner[0], source));
	};
	const assertBindings = async () => {
		for (const [source, real] of plan.moduleBindings) if (await fs$1.realpath(source) !== real) throw new Error(`Plugin module owner changed after snapshot inventory: ${source}`);
		for (const edge of plan.edges) {
			const target = path.resolve(path.dirname(edge.source), await fs$1.readlink(edge.source));
			const real = await fs$1.realpath(edge.source).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return target;
				throw error;
			});
			if (target !== edge.target || real !== edge.real) throw new Error(`Plugin link changed after snapshot inventory: ${edge.source}`);
		}
	};
	return {
		privateRoot,
		candidateRoot,
		copies,
		hostLinks: new Set(plan.hostLinks.map(rebase)),
		relocations: plan.relocations.map(({ sourceRoot, destinationRoot }) => ({
			sourceRoot,
			destinationRoot: rebase(destinationRoot)
		})),
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
		await fs$1.mkdir(path.dirname(link), { recursive: true });
		const existing = await fs$1.lstat(link).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (existing) {
			if (!existing.isSymbolicLink() || path.resolve(path.dirname(link), await fs$1.readlink(link)) !== candidateRoot) throw new Error("Plugin host link conflicts with its update owner");
		} else await fs$1.symlink(candidateRoot, link, process.platform === "win32" ? "junction" : "dir");
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
			await fs$1.mkdir(path.dirname(alias), { recursive: true });
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
async function verifyUpdateCandidatePluginTree(file, params) {
	const stat = await fs$1.lstat(file);
	if (params.hostLinks.has(file)) {
		if (!stat.isSymbolicLink() || path.resolve(path.dirname(file), await fs$1.readlink(file)) !== params.candidateRoot) throw new Error("Copied plugin host link does not target the update");
		return;
	}
	if (stat.isSymbolicLink()) {
		assertUpdateCandidatePluginLinkTarget(file, path.resolve(path.dirname(file), await fs$1.readlink(file)), params);
		return;
	}
	if (stat.isDirectory()) for (const entry of await fs$1.readdir(file)) await verifyUpdateCandidatePluginTree(path.join(file, entry), params);
}
//#endregion
//#region src/infra/update-candidate-plugin-tree.ts
const entryFields = {
	path: string(),
	size: number().int().nonnegative(),
	mode: number().int().nonnegative(),
	dev: string(),
	ino: string()
};
const UpdateCandidatePluginEntrySchema = discriminatedUnion("kind", [
	object({
		...entryFields,
		kind: literal("directory")
	}),
	object({
		...entryFields,
		kind: literal("file"),
		birthtimeNs: string(),
		mtimeNs: string(),
		ctimeNs: string()
	}),
	object({
		...entryFields,
		kind: literal("symlink"),
		link: string(),
		linkType: _enum(["file", "junction"])
	})
]);
const UpdateCandidatePluginTreePlanSchema = object({
	bytes: number().int().nonnegative(),
	privateRoot: string(),
	candidateRoot: string(),
	copies: array(tuple([string(), string()])),
	entries: array(UpdateCandidatePluginEntrySchema),
	hostLinks: array(string()),
	relocations: array(object({
		sourceRoot: string(),
		destinationRoot: string()
	})),
	aliases: array(tuple([string(), string()])),
	moduleBindings: array(tuple([string(), string()])),
	edges: array(object({
		source: string(),
		target: string(),
		real: string()
	}))
});
async function dependencyOwner(target, withinRetainedHost = false) {
	const parts = target.split(path.sep);
	const store = parts.indexOf(".pnpm");
	if (store >= 0 && !withinRetainedHost) return parts.slice(0, store + 1).join(path.sep);
	const modules = parts.indexOf("node_modules");
	if (modules >= 0 && !withinRetainedHost) return parts.slice(0, modules + 1).join(path.sep);
	let directory = (await fs$1.stat(target)).isDirectory() ? target : path.dirname(target);
	const fallback = target;
	for (;;) {
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
	const footprints = /* @__PURE__ */ new Map();
	const edges = /* @__PURE__ */ new Map();
	const hosts = /* @__PURE__ */ new Set();
	const hostRoots = /* @__PURE__ */ new Set();
	const stores = /* @__PURE__ */ new Set();
	const moduleAliases = /* @__PURE__ */ new Map();
	const moduleOwners = /* @__PURE__ */ new Set();
	const retainedHostRoot = params.retainedHostRoot;
	const isOwnedHostEdge = (file) => path.basename(file) === "openclaw" && moduleOwners.has(path.dirname(file));
	const covered = (file) => [...roots.keys()].some((root) => isPathInside(root, file));
	const insideHost = (file) => [...hosts].some((root) => isPathInside(root, file)) && !(retainedHostRoot && isPathInside(retainedHostRoot, file) && [...roots.keys()].some((root) => isPathInside(retainedHostRoot, root) && isPathInside(root, file)));
	const isRetainedDependency = (root) => retainedHostRoot !== void 0 && root !== retainedHostRoot && isPathInside(retainedHostRoot, root);
	const excludesInferredRoot = (root) => !params.roots.has(root) && (insideHost(root) && !isRetainedDependency(root) || hostRoots.has(root));
	function addRoot(source) {
		if (!roots.has(source)) roots.set(source, params.project(source));
	}
	async function measureEntry(file) {
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
		footprints.set(file, entry);
		await params.onProgress?.();
		return entry;
	}
	async function discoverHoistedDependencies(directory) {
		const manifest = await tryReadJson(path.join(directory, "package.json"));
		if (!isRecord(manifest)) return;
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
				const dependency = path.join(modulesDir, ...name.split("/"));
				if (await fs$1.stat(dependency).then(() => true, (error) => {
					if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return false;
					throw error;
				})) {
					const realModules = await fs$1.realpath(modulesDir);
					assertUpdateCandidatePluginCopySource(modulesDir, privateRoot);
					assertUpdateCandidatePluginCopySource(realModules, privateRoot);
					moduleOwners.add(realModules);
					addRoot(realModules);
					if (realModules !== modulesDir) moduleAliases.set(modulesDir, realModules);
					break;
				}
			}
			if (path.dirname(ancestor) === ancestor) break;
		}
	}
	async function scan(directory) {
		assertUpdateCandidatePluginCopySource(directory, privateRoot);
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
		await discoverHoistedDependencies(directory);
		const modules = await readRuntimeModulesManifest(path.join(directory, ".modules.yaml"));
		if (typeof modules?.manifest.virtualStoreDir === "string") {
			const store = await fs$1.realpath(path.resolve(directory, modules.manifest.virtualStoreDir));
			stores.add(store);
			addRoot(store);
		}
		const entries = await fs$1.readdir(directory, { withFileTypes: true });
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
		for (const entry of entries) {
			const file = path.join(directory, entry.name);
			if (isOwnedHostEdge(file)) continue;
			else if (entry.isDirectory()) await scan(file);
			else {
				const measured = await measureEntry(file);
				if (measured.kind !== "symlink") continue;
				const target = path.resolve(directory, measured.link);
				const real = await fs$1.realpath(file).catch((error) => {
					if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return target;
					throw error;
				});
				edges.set(file, {
					target,
					real
				});
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
		for (const root of roots.keys()) if (excludesInferredRoot(root)) roots.delete(root);
		for (const file of edges.keys()) if (insideHost(file)) edges.delete(file);
		for (const source of moduleAliases.keys()) if (insideHost(source)) moduleAliases.delete(source);
	}
	if (retainedHostRoot) await discoverHoistedDependencies(retainedHostRoot);
	for (const source of params.roots.keys()) if (source.split(path.sep).includes("node_modules")) addRoot(await dependencyOwner(source));
	for (;;) {
		for (const root of roots.keys()) await scan(root);
		await refreshHostEdges();
		let added = false;
		for (const [file, { real }] of edges) {
			if (covered(real) && !(insideHost(real) && isRetainedDependency(real)) || hostRoots.has(real) || isUpdateCandidateHostLauncher(file) && [...hostRoots].some((root) => isPathInside(root, real))) continue;
			const store = [...stores].find((root) => isPathInside(root, real));
			const retainedDependency = insideHost(real) && isRetainedDependency(real);
			const owner = (!retainedDependency ? store : void 0) ?? await dependencyOwner(real, retainedDependency).catch((cause) => {
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
	function projected(file) {
		const copy = copies.find(([source]) => isPathInside(source, file));
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
		const host = [...hostRoots].find((root) => real === root || isUpdateCandidateHostLauncher(file) && isPathInside(root, real));
		relocations.push({
			sourceRoot: target,
			destinationRoot: host ? path.join(candidateRoot, path.relative(host, real)) : projected(real)
		});
	}
	relocations.sort((a, b) => b.sourceRoot.length - a.sourceRoot.length);
	const hostLinks = new Set([...hosts].filter((root) => root !== params.retainedHostRoot).map(projected));
	const entries = [...footprints.values()].filter((entry) => !insideHost(entry.path) && copies.some(([source]) => isPathInside(source, entry.path)));
	const bytes = entries.reduce((total, entry) => total + Math.max(4096, Math.ceil(entry.size / 4096) * 4096), (hostLinks.size + moduleAliases.size) * 4096);
	const aliases = [...moduleAliases].map(([source, real]) => {
		const owner = copies.find(([root]) => isPathInside(root, source));
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
		await params.onProgress?.();
		assertUpdateCandidatePluginEntryStat(entry, await fs$1.lstat(entry.path, { bigint: true }));
		if (entry.kind === "symlink" && await fs$1.readlink(entry.path) !== entry.link) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	};
	await targets.assertBindings();
	for (const entry of plan.entries) await assertEntry(entry);
	await fs$1.mkdir(privateRoot, {
		recursive: true,
		mode: 448
	});
	const destinationRoot = await root(privateRoot);
	for (const entry of plan.entries) if (entry.kind === "directory") await fs$1.mkdir(destinationFor(entry.path), {
		recursive: true,
		mode: entry.mode | 448
	});
	for (const entry of plan.entries) if (entry.kind === "file") {
		await assertEntry(entry);
		const destination = destinationFor(entry.path);
		await fs$1.mkdir(path.dirname(destination), {
			recursive: true,
			mode: 448
		});
		await destinationRoot.copyIn(path.relative(privateRoot, destination), entry.path, {
			overwrite: false,
			maxBytes: entry.size,
			mode: entry.mode | 384,
			sourceHardlinks: "allow",
			assertBeforeMutation: () => assertUpdateCandidatePluginEntryStat(entry, fs.lstatSync(entry.path, { bigint: true }))
		});
		await assertEntry(entry);
	}
	for (const entry of plan.entries) if (entry.kind === "symlink") {
		await assertEntry(entry);
		const destination = destinationFor(entry.path);
		await fs$1.mkdir(path.dirname(destination), {
			recursive: true,
			mode: 448
		});
		await fs$1.symlink(entry.link, destination, entry.linkType);
	}
	await targets.assertBindings();
	for (const entry of plan.entries) await assertEntry(entry);
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
		hostLinks
	};
	for (const alias of privateAliases) await verifyUpdateCandidatePluginTree(alias, verification);
	for (const [, target] of copies) await verifyUpdateCandidatePluginTree(target, verification);
	for (const entry of plan.entries) if (entry.kind === "file" && (entry.mode & 384) !== 384) await fs$1.chmod(destinationFor(entry.path), entry.mode);
	for (const entry of plan.entries.filter((candidate) => candidate.kind === "directory").toSorted((left, right) => right.path.length - left.path.length)) await fs$1.chmod(destinationFor(entry.path), entry.mode);
}
//#endregion
export { assertUpdateCandidatePluginEntryStat as a, resolveUpdateCandidatePluginTreeTargets as c, prepareUpdateCandidatePluginTrees as i, verifyUpdateCandidatePluginTree as l, assertUpdateCandidatePluginCopySource as n, assertUpdateCandidatePluginLinkTarget as o, copyUpdateCandidatePluginTrees as r, publishUpdateCandidatePluginTreeLinks as s, UpdateCandidatePluginTreePlanSchema as t };
