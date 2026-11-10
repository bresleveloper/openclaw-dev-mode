import { a as extractErrorCode, c as readErrorCauses, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { N as PluginSourceRecoveryUnavailableError, c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as openRootFileSync$1 } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { c as retainPluginSourceCaptureInstance, o as retainLoadedPluginSourceCapture } from "./plugin-source-capture-directory-uZgzXzIf.mjs";
import { r as mkdtempPluginCaptureSync, t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-D7PBfh7S.mjs";
import { i as relativePluginPathInsideRootSync, n as isPathInside$1 } from "./path-safety-n0YlfCVt.mjs";
import { r as isGitRuntimeStagingName, t as collectPluginSafetyInspectedFiles } from "./plugin-safety-inspected-files-C9Of4ALD.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { copyFileDescriptorSync, copyRootFileSync, createFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { channel } from "node:diagnostics_channel";
//#region src/plugins/plugin-source-file.ts
const isPluginSourceEntry = (name) => name !== "node_modules" && name !== ".git" && !isGitRuntimeStagingName(name);
const scratch = Buffer.allocUnsafe(65536);
const SMALL_SOURCE_COPY_BYTES = 65536;
const pluginSourceStatIdentity = (stat, identity = stat) => `${identity.dev}:${identity.ino}:${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`;
const pluginSourceIdentityChangedOnlyByCtime = (previous, current) => previous.slice(0, previous.lastIndexOf(":")) === current.slice(0, current.lastIndexOf(":"));
function withPluginSourceFile(source, boundary, read, openFile = openRootFileSync$1) {
	const opened = openFile({
		absolutePath: source,
		rootPath: boundary,
		boundaryLabel: "plugin build source",
		rejectHardlinks: false
	});
	if (!opened.ok) throw new Error(`Cannot capture plugin source ${source}`, { cause: opened.error });
	try {
		return read(opened.fd);
	} finally {
		fs.closeSync(opened.fd);
	}
}
function isPluginNativeExecutable(source, boundary) {
	return withPluginSourceFile(source, boundary, isPluginNativeDescriptor);
}
function isPluginNativeDescriptor(fd) {
	if (fs.readSync(fd, scratch, 0, 4, 0) !== 4) return false;
	const magic = scratch.readUInt32BE(0);
	return scratch.readUInt16BE(0) === 19802 || [
		2135247942,
		4277009102,
		4277009103,
		3472551422,
		3489328638,
		3405691582,
		3199925962
	].includes(magic);
}
function copySmallPluginSourceFile(target, fd, admitted, mode, hashCopiedContent) {
	try {
		var _usingCtx$2 = _usingCtx();
		const copied = _usingCtx$2.u(createFileSync(target, { mode: 384 }));
		const identity = fs.fstatSync(copied.fd, { bigint: true });
		const assertCurrent = () => {
			const named = fs.lstatSync(target, { bigint: true });
			const current = fs.fstatSync(copied.fd, { bigint: true });
			if (!named.isFile() || named.nlink !== 1n || named.dev !== identity.dev || named.ino !== identity.ino || !current.isFile() || current.nlink !== 1n || current.dev !== identity.dev || current.ino !== identity.ino) throw new FsSafeError("path-mismatch", "Plugin capture destination changed during copying");
		};
		if (copyFileDescriptorSync(fd, copied.fd, { maxBytes: Number(admitted.size) }) !== Number(admitted.size)) throw new FsSafeError("path-mismatch", "Plugin source changed while copying");
		fs.fchmodSync(copied.fd, mode);
		assertCurrent();
		return hashCopiedContent ? {
			...hashPluginSourceDescriptor(copied.fd),
			sourceIdentity: pluginSourceStatIdentity(admitted)
		} : void 0;
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
}
/**
* fs-safe copy admission compares an ordinary and a native realpath of its root, so a
* Windows 8.3 alias such as `C:\Users\RUNNER~1` always reads as a moved root.
* Rebase the admitted source onto the root's native spelling before handing it over.
*/
function resolveNativeCopySource(boundary, source) {
	if (process.platform !== "win32") return {
		rootPath: boundary,
		absolutePath: source
	};
	const rootPath = fs.realpathSync.native(boundary);
	const relative = path.relative(boundary, source);
	if (rootPath === boundary || relative.startsWith("..") || path.isAbsolute(relative)) return {
		rootPath: boundary,
		absolutePath: source
	};
	return {
		rootPath,
		absolutePath: path.join(rootPath, relative)
	};
}
function copyPluginSourceFile(source, boundary, target, options = {}) {
	return withPluginSourceFile(source, boundary, (fd) => {
		const admitted = fs.fstatSync(fd, { bigint: true });
		try {
			try {
				var _usingCtx3 = _usingCtx();
				const mode = options.preserveSourceMode ? Number(admitted.mode & 511n) : 384 | Number(admitted.mode & 64n);
				if (admitted.size <= BigInt(SMALL_SOURCE_COPY_BYTES) && !/\.(?:node|so|dylib|dll)$/iu.test(source) && !isPluginNativeDescriptor(fd) && fs.realpathSync.native(path.dirname(target)) === path.dirname(target)) return copySmallPluginSourceFile(target, fd, admitted, mode, options.hashCopiedContent);
				const copied = _usingCtx3.u((options.copyFile ?? copyRootFileSync)({
					source: resolveNativeCopySource(boundary, source),
					destination: {
						rootPath: path.dirname(target),
						absolutePath: target
					},
					expectedSourceIdentity: {
						dev: admitted.dev,
						ino: admitted.ino
					},
					clone: "auto",
					maxBytes: Number(admitted.size),
					mode,
					sourceHardlinks: "allow"
				}));
				return options.hashCopiedContent ? {
					...hashPluginSourceDescriptor(copied.fd),
					sourceIdentity: pluginSourceStatIdentity(admitted, copied.sourceIdentity)
				} : void 0;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		} catch (error) {
			if (error instanceof FsSafeError && collectErrorGraphCandidates(error, readErrorCauses).some((cause) => extractErrorCode(cause) === "ENOSPC")) throw Object.assign(new Error(formatErrorMessage(error), { cause: error }), { code: "ENOSPC" });
			if (error instanceof FsSafeError && error.code === "too-large") throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.", { cause: error });
			throw error;
		}
	}, options.openFile);
}
function linkPluginSourceFile(source, boundary, target) {
	withPluginSourceFile(source, boundary, (fd) => {
		const admitted = fs.fstatSync(fd, { bigint: true });
		fs.linkSync(source, target);
		const linked = fs.statSync(target, { bigint: true });
		if (linked.dev !== admitted.dev || linked.ino !== admitted.ino) throw new Error("Native plugin artifact changed during admission");
	});
}
function hashPluginSourceFile(source, boundary, receipt, prepared, openFile = openRootFileSync$1) {
	return withPluginSourceFile(source, boundary, (fd) => hashPluginSourceDescriptor(fd, receipt, prepared), openFile);
}
function hashPluginSourceDescriptor(fd, receipt, prepared) {
	const content = prepared ? void 0 : createHash("sha256");
	const sizeBytes = prepared?.sizeBytes ?? fs.fstatSync(fd).size;
	receipt?.update(String(sizeBytes)).update("\0");
	let position = 0;
	for (;;) {
		const length = fs.readSync(fd, scratch, 0, Math.min(scratch.length, sizeBytes - position + 1), position);
		position += length;
		if (length === 0 || position > sizeBytes) break;
		const chunk = scratch.subarray(0, length);
		content?.update(chunk);
		receipt?.update(chunk);
	}
	if (position !== sizeBytes) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
	return prepared ?? {
		contentHash: content.digest("hex"),
		sizeBytes
	};
}
//#endregion
//#region src/plugins/plugin-package-metadata-capture.ts
function createPluginDependencyResolver(lookupBoundary) {
	const roots = /* @__PURE__ */ new Map();
	return (name, importer) => {
		const key = `${path.dirname(importer)}\0${name}`;
		if (roots.has(key)) return roots.get(key);
		for (const nodeModules of createRequire(importer).resolve.paths(`${name}/`) ?? []) {
			const candidate = path.join(nodeModules, name);
			if (fs.existsSync(path.join(candidate, "package.json"))) {
				if (lookupBoundary && isPathInside(lookupBoundary.root, importer) && !isPathInside(lookupBoundary.root, nodeModules)) {
					const manifestFile = path.join(resolvePluginModulePackageRoot(importer), "package.json");
					if (!pluginDependencyNames(fs.existsSync(manifestFile) ? asOptionalRecord(JSON.parse(fs.readFileSync(manifestFile, "utf8"))) : void 0).has(name)) {
						lookupBoundary.onUnresolvable(name, importer);
						roots.set(key, void 0);
						return;
					}
				}
				const resolved = {
					root: fs.realpathSync(candidate),
					lookupDirectory: path.dirname(nodeModules)
				};
				roots.set(key, resolved);
				return resolved;
			}
		}
		roots.set(key, void 0);
	};
}
/** Prepare each importer's package lookup once; Node still selects its export target. */
function createPluginDependencyLookup(importer, manifest, resolve, capture) {
	const prepared = /* @__PURE__ */ new Map();
	return (specifier) => {
		if (!specifier || specifier.startsWith(".") || path.isAbsolute(specifier) || URL.canParse(specifier) || isBuiltin(specifier)) return;
		const name = packageName(specifier);
		if (name === "openclaw" || name === "@openclaw/plugin-sdk") return;
		if (specifier.startsWith("#") || manifest?.exports != null && manifest.name === name) return "package-map";
		if (!prepared.has(name)) {
			const dependency = resolve(name, importer);
			if (dependency) capture(name, dependency);
			prepared.set(name, dependency !== void 0);
		}
		return prepared.get(name);
	};
}
function pluginDependencyNames(manifest) {
	return /* @__PURE__ */ new Set([
		...Object.keys(manifest?.dependencies ?? {}),
		...Object.keys(manifest?.optionalDependencies ?? {}),
		...Object.keys(manifest?.peerDependencies ?? {})
	]);
}
/** Native resolvers need declared package lookups before they can resolve a deferred import. */
function createPluginNativeDependencyScopes(resolve, capture) {
	const scopes = /* @__PURE__ */ new Map();
	return (source, manifest) => {
		const key = path.dirname(source);
		let scope = scopes.get(key);
		if (!scope) {
			const dependencies = [...pluginDependencyNames(manifest)].filter((name) => name !== "openclaw" && name !== "@openclaw/plugin-sdk");
			scope = { prepareDependencies: dependencies.length ? () => {
				for (const name of dependencies) {
					const dependency = resolve(name, source);
					if (dependency) capture(name, dependency);
				}
			} : void 0 };
			scopes.set(key, scope);
		}
		return scope;
	};
}
function capturePluginDependencies(params) {
	const manifest = params.manifestFile ? JSON.parse(fs.readFileSync(params.manifestFile, "utf8")) : {};
	const dependencies = [...[...pluginDependencyNames(manifest)].toSorted().map((name) => ({
		name,
		importer: path.join(params.root, "package.json")
	})), ...[...params.references].flatMap(([importer, names]) => [...names].toSorted().map((name) => ({
		name,
		importer
	})))];
	for (const { name, importer } of dependencies) {
		if (name === "openclaw" || name === "@openclaw/plugin-sdk") continue;
		const dependency = params.resolve(name, importer);
		if (!dependency) {
			if (!params.manifestFile || params.incidental || name in (manifest.optionalDependencies ?? {}) || name in (manifest.peerDependencies ?? {})) continue;
			throw new Error(`Plugin dependency ${name} is missing from ${params.root}; install its dependencies and reload.`);
		}
		params.capture(name, dependency);
	}
	return manifest;
}
function resolvePluginModulePackageRoot(filename) {
	let directory = path.dirname(filename);
	while (path.basename(directory) !== "node_modules") {
		if (fs.existsSync(path.join(directory, "package.json"))) return directory;
		const parent = path.dirname(directory);
		if (parent === directory) break;
		directory = parent;
	}
	return path.dirname(filename);
}
function capturePluginPackageMetadata(root, destination, copy, isRetainedReference, resolveSource) {
	const manifest = path.join(destination, "package.json");
	copy(path.join(root, "package.json"), manifest);
	let data;
	try {
		data = asOptionalRecord(JSON.parse(fs.readFileSync(manifest, "utf8")));
	} catch (error) {
		if (!(error instanceof SyntaxError)) throw error;
	}
	if (data && data.exports == null) {
		const main = typeof data.main === "string" && data.main ? data.main : void 0;
		const bases = main === void 0 ? ["./index"] : [
			`./${main}`,
			`./${main}/index`,
			"./index"
		];
		const candidates = [...main === void 0 ? [] : [main], ...bases.flatMap((base) => [
			".js",
			".json",
			".node"
		].map((extension) => base + extension))];
		for (const candidate of candidates) {
			const url = new URL(candidate, pathToFileURL(path.join(root, "package.json")));
			if (url.protocol !== "file:") continue;
			const filename = fileURLToPath(url);
			const prepared = resolveSource?.(filename);
			const input = prepared?.path ?? filename;
			if (isPathInside(root, filename) && fs.statSync(input, { throwIfNoEntry: false })?.isFile()) {
				const real = fs.realpathSync(input);
				if (!isPathInside(prepared?.boundary ?? root, real) && !isRetainedReference?.(filename, real)) continue;
				copy(filename, path.join(destination, path.relative(root, filename)));
				break;
			}
		}
	}
	return data;
}
const packageName = (specifier) => specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
const importTargetNames = (value) => {
	return [...pluginPackageTargets(value)].filter((target) => target && !target.startsWith(".") && !target.startsWith("#") && !path.isAbsolute(target) && !isBuiltin(target)).map(packageName);
};
/** Capture declared targets; native loading owns conditions and subpath selection. */
function* pluginPackageTargets(value) {
	if (typeof value === "string") yield value;
	else if (value && typeof value === "object") for (const target of Object.values(value)) yield* pluginPackageTargets(target);
}
/** Package '*' substitutes one subpath everywhere; only its declared fixed prefix is walked. */
function visitPluginPackageTargetFiles(params) {
	if (!params.target.startsWith("./")) return;
	const marker = randomUUID();
	let filename;
	try {
		filename = fileURLToPath(new URL(params.wildcard ? params.target.replaceAll("*", marker) : params.target, pathToFileURL(params.metadata)));
	} catch {
		return;
	}
	if (!isPathInside(params.boundary, filename)) return;
	const parts = filename.split(marker);
	const matcher = parts.length > 1 ? new RegExp(`^${escapeRegExp(parts[0])}([\\s\\S]*)${parts.slice(1).map(escapeRegExp).join("\\1")}$`, "i") : void 0;
	const ancestors = /* @__PURE__ */ new Set();
	const visit = (source) => {
		if (path.relative(params.boundary, source).split(path.sep).some((name) => name === ".git" || name === "node_modules")) return;
		const prepared = params.resolveSource?.(source);
		const input = prepared?.path ?? source;
		const stat = fs.statSync(input, { throwIfNoEntry: false });
		if (!stat) return;
		const real = fs.realpathSync(input);
		if (!isPathInside(prepared?.boundary ?? params.boundary, real) && !(stat.isFile() && params.isRetainedReference?.(source, real))) return;
		if (stat.isDirectory()) {
			if (!matcher) return;
			if (ancestors.has(real)) throw new Error(`Plugin source contains a directory cycle: ${source}`);
			ancestors.add(real);
			for (const name of fs.readdirSync(input).filter(isPluginSourceEntry).toSorted()) visit(path.join(source, name));
			ancestors.delete(real);
		} else if (stat.isFile()) {
			if (!matcher || matcher.test(source)) params.visit(source);
		}
	};
	visit(matcher ? path.dirname(parts[0] + "_") : filename);
}
const isPluginPackageFile = (root, file) => isPathInside(root, file) && !path.relative(root, file).split(path.sep).includes("node_modules");
function isCapturedPathInside(root, file) {
	return process.platform === "win32" ? isPathInside(root, file) : file === root || file.startsWith(root) && (root.endsWith("/") || file.charCodeAt(root.length) === 47);
}
function isCapturedPackageFile(root, file) {
	if (process.platform === "win32") return isPluginPackageFile(root, file);
	return isCapturedPathInside(root, file) && !/(?:^|\/)node_modules(?:\/|$)/u.test(file.slice(root.length));
}
/** Retain the matched lookup root; dependency links need their own source-relative mapping. */
function findPluginCapturedPackage(packages, filename, directory) {
	const file = process.platform === "win32" ? filename : path.resolve(filename);
	if (!isCapturedPathInside(directory, file)) return;
	for (const owner of packages.values()) {
		if (isCapturedPackageFile(owner.capturedRoot, file)) return {
			owner,
			root: owner.capturedRoot
		};
		for (const root of owner.links) if (isCapturedPackageFile(root, file)) return {
			owner,
			root
		};
	}
}
/** Captured metadata and declared target preparation share the artifact lifetime. */
function createPluginPackageMetadataCapture(params) {
	const metadataScopes = /* @__PURE__ */ new Map();
	const pendingScopes = /* @__PURE__ */ new Set();
	const prepareNativeScopes = () => {
		for (const metadata of pendingScopes) {
			pendingScopes.delete(metadata);
			const scope = metadataScopes.get(metadata);
			if (scope.manifest === void 0) try {
				scope.manifest = asOptionalRecord(JSON.parse(fs.readFileSync(metadata, "utf8"))) ?? null;
			} catch (error) {
				if (!(error instanceof SyntaxError)) throw error;
				scope.manifest = null;
			}
			const manifest = scope.manifest;
			const owner = params.packageForFile(metadata);
			if (!manifest || !owner) continue;
			scope.prepareAliases(manifest);
			if (owner.state === "body") continue;
			const sourceMetadata = params.sourceForCaptured(metadata);
			const packageExports = manifest.exports;
			const exportMap = packageExports && typeof packageExports === "object" && !Array.isArray(packageExports) && Object.keys(packageExports).some((key) => key.startsWith(".")) ? asOptionalRecord(packageExports) ?? {} : { ".": packageExports };
			const declarations = [...Object.entries(asOptionalRecord(manifest.imports) ?? {}), ...Object.entries(exportMap)];
			for (const [key, value] of declarations) for (const target of pluginPackageTargets(value)) visitPluginPackageTargetFiles({
				metadata: sourceMetadata,
				boundary: owner.sourceRoot,
				target,
				wildcard: key.includes("*"),
				isRetainedReference: params.isRetainedReference,
				resolveSource: params.resolveSource,
				visit(filename) {
					owner.captureTarget(path.join(path.dirname(metadata), path.relative(path.dirname(sourceMetadata), filename)));
				}
			});
		}
	};
	return {
		record(metadata, prepareAliases) {
			if (metadataScopes.has(metadata)) return;
			let aliasesPrepared = false;
			metadataScopes.set(metadata, { prepareAliases(manifest) {
				if (!aliasesPrepared) {
					prepareAliases(manifest);
					aliasesPrepared = true;
				}
			} });
			pendingScopes.add(metadata);
		},
		setManifest(metadata, manifest) {
			metadataScopes.get(metadata).manifest = manifest;
		},
		get pending() {
			return pendingScopes.size > 0;
		},
		prepare(scope) {
			if (scope?.prepareDependencies) {
				scope.prepareDependencies();
				delete scope.prepareDependencies;
			}
			prepareNativeScopes();
		},
		createScope({ root, destination, boundary, copy, hasSource }) {
			const capturedScopes = /* @__PURE__ */ new Map();
			const captureScopeMetadata = (scopeDirectory) => {
				if (capturedScopes.has(scopeDirectory)) return capturedScopes.get(scopeDirectory);
				let scope;
				const source = path.join(scopeDirectory, "package.json");
				if (hasSource(source) || fs.existsSync(params.resolveSource?.(source)?.path ?? source)) {
					const target = path.join(destination, path.relative(root, source));
					copy(source, target);
					let parsed;
					scope = () => {
						if (!parsed) {
							const metadata = metadataScopes.get(target);
							const data = asOptionalRecord(metadata.manifest) ?? asOptionalRecord(JSON.parse(fs.readFileSync(target, "utf8"))) ?? {};
							metadata.manifest = data;
							metadata.prepareAliases(data);
							parsed = {
								source,
								manifest: data,
								aliases: new Set(importTargetNames(data.imports))
							};
						}
						return parsed;
					};
				} else if (scopeDirectory !== boundary && isPathInside(boundary, path.dirname(scopeDirectory))) scope = captureScopeMetadata(path.dirname(scopeDirectory));
				capturedScopes.set(scopeDirectory, scope);
				return scope;
			};
			return {
				captureMetadata: captureScopeMetadata,
				resolve: (scopeDirectory) => captureScopeMetadata(scopeDirectory)?.()
			};
		},
		clear() {
			metadataScopes.clear();
			pendingScopes.clear();
		}
	};
}
const sourceCaptureDirectory = new AsyncLocalStorage();
/** A compute worker's parent reclaims this scratch directory after confirmed exit. */
function withPluginSourceCaptureDirectory(directory, run, managedRoot) {
	return sourceCaptureDirectory.run({
		directory,
		managedRoot
	}, run);
}
/** Admissions and failed-input receipts belong to one source acquisition lifetime. */
function createPluginSourceCapture() {
	const override = sourceCaptureDirectory.getStore();
	const instance = override === void 0 ? retainPluginSourceCaptureInstance() : void 0;
	let created;
	let directory;
	try {
		created = override !== void 0 ? mkdtempPluginCaptureSync(path.join(override.directory, PLUGIN_SOURCE_CAPTURE_PREFIX)) : instance.createDirectory();
		directory = fs.realpathSync.native(created);
		fs.chmodSync(directory, 448);
	} catch (error) {
		const cleanupErrors = [];
		try {
			if (created) fs.rmSync(created, {
				recursive: true,
				force: true
			});
		} catch (cleanupError) {
			cleanupErrors.push(cleanupError);
		}
		try {
			instance?.release();
		} catch (cleanupError) {
			cleanupErrors.push(cleanupError);
		}
		if (cleanupErrors.length > 0) throw createSqliteLifecycleAggregateError([error, ...cleanupErrors], "Plugin source capture setup and cleanup failed", error);
		throw error;
	}
	const additions = /* @__PURE__ */ new Set();
	const captureFailures = /* @__PURE__ */ new Map();
	let disposed = false;
	const acquire = (capture) => {
		if (disposed) throw new Error("Plugin module capture has been disposed");
		try {
			return {
				value: capture(),
				additions: [...additions]
			};
		} catch (error) {
			for (const filename of additions) captureFailures.set(filename, error);
			throw error;
		} finally {
			additions.clear();
		}
	};
	const assertModuleAvailable = (filename) => {
		if (captureFailures.has(filename)) throw captureFailures.get(filename);
	};
	const beginDisposal = () => {
		disposed = true;
		const urls = pathToFileURL(directory + path.sep).href;
		const cache = createRequire(import.meta.url).cache;
		for (const id of Object.keys(cache)) if (id.startsWith(urls) || path.isAbsolute(id) && isPathInside(directory, id)) delete cache[id];
		captureFailures.clear();
	};
	return {
		additions,
		capture: acquire,
		assertModuleAvailable,
		directory,
		outputRoot: override?.managedRoot ?? instance?.managedRoot,
		linkHost: (hostRoot) => {
			const modules = path.join(directory, "node_modules");
			fs.mkdirSync(modules, {
				recursive: true,
				mode: 448
			});
			fs.symlinkSync(hostRoot, path.join(modules, "openclaw"), "junction");
		},
		dispose() {
			beginDisposal();
			if (!retainLoadedPluginSourceCapture(directory)) fs.rmSync(directory, {
				recursive: true,
				force: true
			});
			instance?.release();
		},
		async disposeAsync() {
			beginDisposal();
			if (!retainLoadedPluginSourceCapture(directory)) await fs$1.rm(directory, {
				recursive: true,
				force: true
			});
			await instance?.releaseAsync();
		}
	};
}
//#endregion
//#region src/plugins/plugin-native-namespace.ts
const pluginNativeNamespaceDirectory = (fact) => fact.referenceRoot ? fact.sourceDirectory : path.join(fact.capturedRoot, "content");
const pluginNativeNamespaceBoundary = (fact) => fact.referenceRoot ?? fact.capturedRoot;
const pluginNativeNamespaceMemberPath = (fact, relative) => fact.referenceRoot ? fact.members[relative].source : path.join(fact.capturedRoot, "content", relative);
const pluginNativeNamespaceMemberRelativePath = (fact, filename) => fact.referenceRoot ? Object.entries(fact.members).find(([, member]) => member.source === filename)[0] : path.relative(pluginNativeNamespaceDirectory(fact), filename);
function capturePluginNativeDirectoryAliases(selected, packageRoots) {
	const directories = /* @__PURE__ */ new Map();
	const roots = Object.keys(packageRoots).toSorted((left, right) => right.length - left.length);
	for (const [alias, { capturedRoot }] of selected) {
		const root = roots.find((candidate) => isPathInside(candidate, alias));
		if (root) directories.set(path.join(packageRoots[root], path.relative(root, alias)), capturedRoot);
	}
	return directories;
}
/** The installer owns this peer link; a native directory reference must never retarget it. */
function assertPluginNativeNamespaceHost(fact, hostRoot, pluginRoot) {
	if (!fact.referenceRoot) return;
	const pluginDirectory = fs.realpathSync(pluginRoot);
	for (const directory of /* @__PURE__ */ new Set([pluginDirectory, fs.realpathSync(fact.sourceDirectory)])) {
		const candidate = createRequire(path.join(directory, "native-host.cjs")).resolve.paths("openclaw")?.map((modules) => path.join(modules, "openclaw")).find((filename) => fs.existsSync(filename));
		const resolvedHost = candidate ? fs.realpathSync(candidate) : void 0;
		if (resolvedHost === hostRoot || !candidate && directory !== pluginDirectory) continue;
		throw new Error(`Retained native directory ${fact.sourceDirectory} does not resolve the selected OpenClaw host ${hostRoot}: ` + (candidate ? `${candidate} resolves to ${resolvedHost}` : `no OpenClaw peer resolves from ${directory}`) + ". Run openclaw doctor --fix with the selected host to repair the installed plugin's OpenClaw peer link, then reload the plugin.");
	}
}
function inspectDirectory(directory, boundary, outputRoot, sourceDependencies = true) {
	const members = /* @__PURE__ */ new Map();
	const directories = /* @__PURE__ */ new Map();
	const ancestors = /* @__PURE__ */ new Set();
	const resolve = createPluginDependencyResolver();
	const visit = (filename, relative, packageBoundary, admittedDependency = false) => {
		const source = fs.realpathSync(filename);
		if (outputRoot && isPathInside(outputRoot, source)) return;
		if (!isPathInside(packageBoundary, source)) throw new Error(`Native plugin companion leaves its package: ${filename}`);
		const stat = fs.statSync(source, { bigint: true });
		if (!stat.isDirectory() && !stat.isFile()) throw new Error(`Native plugin companion is not a regular file: ${filename}`);
		const linkTo = stat.isDirectory() ? directories.get(source) : void 0;
		if (sourceDependencies && !admittedDependency && ancestors.has(source)) throw new Error(`Native plugin companions contain a directory cycle: ${filename}`);
		members.set(relative, {
			source,
			identity: pluginSourceStatIdentity(stat),
			stat,
			boundary: packageBoundary,
			...linkTo === void 0 ? {} : { linkTo }
		});
		if (stat.isDirectory()) {
			if (linkTo !== void 0) return;
			directories.set(source, relative);
			ancestors.add(source);
			for (const name of fs.readdirSync(source).toSorted()) if (isPluginSourceEntry(name)) visit(path.join(source, name), path.join(relative, name), packageBoundary);
			if (sourceDependencies) {
				const root = relative ? source : resolvePluginModulePackageRoot(path.join(source, "native-companion.cjs"));
				const manifestFile = path.join(root, "package.json");
				if (isPathInside(packageBoundary, root) && fs.existsSync(manifestFile)) capturePluginDependencies({
					root,
					manifestFile,
					incidental: Boolean(relative) && !admittedDependency,
					references: /* @__PURE__ */ new Map(),
					resolve,
					capture(name, dependency) {
						visit(dependency.root, path.join(relative, "node_modules", name), dependency.root, true);
					}
				});
			} else {
				const modules = path.join(source, "node_modules");
				for (const name of fs.existsSync(modules) ? fs.readdirSync(modules).toSorted() : []) {
					const names = name.startsWith("@") ? fs.readdirSync(path.join(modules, name)).toSorted().map((entry) => `${name}/${entry}`) : [name];
					for (const dependency of names) if (dependency !== "openclaw" && dependency !== "@openclaw/plugin-sdk") visit(path.join(modules, dependency), path.join(relative, "node_modules", dependency), boundary);
				}
			}
			ancestors.delete(source);
		}
	};
	visit(directory, "", boundary);
	return members;
}
/** Both names and file identities must match: new, removed, and edited companions invalidate reuse. */
function pluginNativeNamespaceIsCurrent(fact, boundary, outputRoot) {
	const source = inspectDirectory(fact.sourceDirectory, boundary, outputRoot);
	const captured = inspectDirectory(pluginNativeNamespaceDirectory(fact), pluginNativeNamespaceBoundary(fact), fact.referenceRoot ? outputRoot : void 0, Boolean(fact.referenceRoot));
	return source.size === Object.keys(fact.members).length && captured.size === source.size && [...source].every(([relative, member]) => {
		const prior = fact.members[relative];
		return prior?.source === member.source && prior.sourceIdentity === member.identity && prior.capturedIdentity === captured.get(relative)?.identity;
	});
}
/** A retained namespace is complete before exposing any native pathname from it. */
function capturePluginNativeNamespace(params) {
	const { sourceDirectory, boundary, capturedRoot, managed, outputRoot, previous } = params;
	const from = previous ? pluginNativeNamespaceDirectory(previous) : sourceDirectory;
	const fromBoundary = previous ? pluginNativeNamespaceBoundary(previous) : boundary;
	const before = inspectDirectory(from, fromBoundary, previous ? void 0 : outputRoot, !previous || Boolean(previous.referenceRoot));
	const inspectedEntries = [...before.values()].map((member) => ({
		path: member.source,
		kind: member.stat.isDirectory() ? "directory" : "file"
	}));
	for (const root of params.inspectionRoots ?? [boundary]) {
		inspectedEntries.push({
			path: root,
			kind: "directory"
		});
		for (const name of ["openclaw.plugin.json", "package.json"]) {
			const filename = path.join(root, name);
			if (fs.statSync(filename, { throwIfNoEntry: false })?.isFile()) inspectedEntries.push({
				path: filename,
				kind: "file"
			});
		}
	}
	const boundaryFiles = previous ? /* @__PURE__ */ new Set() : collectPluginSafetyInspectedFiles(inspectedEntries);
	for (const filename of params.inspectedFiles ?? []) if (!previous) boundaryFiles.add(fs.realpathSync(filename));
	const directory = path.join(capturedRoot, "content");
	const linkedSources = /* @__PURE__ */ new Set();
	const captureDevice = fs.statSync(capturedRoot, { bigint: true }).dev;
	let referenceRoot;
	try {
		for (const [relative, member] of before) {
			const target = path.join(directory, relative);
			if (member.linkTo !== void 0) {
				fs.mkdirSync(path.dirname(target), {
					recursive: true,
					mode: 448
				});
				fs.symlinkSync(path.relative(path.dirname(target), path.join(directory, member.linkTo)), target, "junction");
			} else if (member.stat.isDirectory()) fs.mkdirSync(target, {
				recursive: true,
				mode: 448
			});
			else if (!params.copyOnly && member.stat.dev === captureDevice && (previous || managed && (params.managedRoots ?? [boundary]).some((root) => isPathInside(root, member.source))) && !(previous?.members[relative]?.boundaryChecked ?? boundaryFiles.has(member.source))) {
				linkPluginSourceFile(member.source, member.boundary, target);
				linkedSources.add(member.source);
			} else copyPluginSourceFile(member.source, member.boundary, target);
		}
	} catch (error) {
		if (params.copyOnly || !managed || previous || !params.retainedRoot || [...before.values()].some((member) => !isPathInside(params.retainedRoot, member.source)) || ![
			"EXDEV",
			"EPERM",
			"EACCES",
			"ENOTSUP",
			"EOPNOTSUPP",
			"EMLINK",
			"ENOSYS"
		].some((code) => hasErrnoCode(error, code))) throw error;
		fs.rmSync(directory, {
			recursive: true,
			force: true
		});
		linkedSources.clear();
		fs.symlinkSync(sourceDirectory, directory, "junction");
		referenceRoot = params.retainedRoot;
	}
	const content = /* @__PURE__ */ new Map();
	for (const [relative, member] of before) {
		if (!member.stat.isFile()) continue;
		if (!previous) {
			content.set(relative, { sizeBytes: Number(member.stat.size) });
			continue;
		}
		const filename = path.join(directory, relative);
		const stat = pluginSourceStatIdentity(fs.statSync(filename, { bigint: true }));
		const digest = hashPluginSourceFile(filename, capturedRoot);
		const prior = previous?.members[relative];
		if (!pluginSourceIdentityChangedOnlyByCtime(stat, pluginSourceStatIdentity(fs.statSync(filename, { bigint: true }))) || prior && (digest.contentHash !== prior.contentHash || digest.sizeBytes !== prior.sizeBytes)) throw new Error("Native plugin companion changed during admission");
		content.set(relative, digest);
	}
	const after = inspectDirectory(from, fromBoundary, previous ? void 0 : outputRoot, !previous || Boolean(previous.referenceRoot));
	const captured = inspectDirectory(referenceRoot ? sourceDirectory : directory, referenceRoot ?? capturedRoot, referenceRoot ? outputRoot : void 0, Boolean(referenceRoot));
	if (before.size !== after.size || captured.size !== before.size || [...before].some(([relative, member]) => {
		const current = after.get(relative);
		if (!current || current.source !== member.source || !pluginSourceIdentityChangedOnlyByCtime(member.identity, current.identity)) return true;
		if (!managed && !previous && member.stat.isFile() && current.identity !== member.identity) {
			const copy = captured.get(relative);
			if (!copy) return true;
			const digest = hashPluginSourceFile(copy.source, capturedRoot);
			const sourceDigest = hashPluginSourceFile(member.source, member.boundary);
			const sourceIdentity = pluginSourceStatIdentity(fs.statSync(member.source, { bigint: true }));
			const capturedIdentity = pluginSourceStatIdentity(fs.statSync(copy.source, { bigint: true }));
			if (digest.contentHash !== sourceDigest.contentHash || digest.sizeBytes !== sourceDigest.sizeBytes || !pluginSourceIdentityChangedOnlyByCtime(current.identity, sourceIdentity) || !pluginSourceIdentityChangedOnlyByCtime(copy.identity, capturedIdentity)) return true;
			current.identity = sourceIdentity;
			copy.identity = capturedIdentity;
			content.set(relative, digest);
		}
		return false;
	})) throw new Error("Native plugin directory changed during admission");
	const changed = /* @__PURE__ */ new Map();
	const fact = {
		sourceDirectory,
		capturedRoot,
		managed,
		...referenceRoot ? { referenceRoot } : {},
		members: Object.fromEntries([...after].map(([relative, member]) => {
			if (linkedSources.has(member.source) && member.identity === captured.get(relative).identity) changed.set(member.source, member.identity);
			const old = previous?.members[relative];
			if (old) old.capturedIdentity = member.identity;
			return [relative, {
				source: old?.source ?? member.source,
				sourceIdentity: old?.sourceIdentity ?? member.identity,
				capturedIdentity: captured.get(relative).identity,
				boundaryChecked: old?.boundaryChecked ?? boundaryFiles.has(member.source),
				...content.get(relative)
			}];
		}))
	};
	if (previous?.managed) for (const [relative, member] of Object.entries(fact.members)) {
		const current = fs.statSync(member.source, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (linkedSources.has(after.get(relative).source) && current && current.dev === after.get(relative).stat.dev && current.ino === after.get(relative).stat.ino && pluginSourceStatIdentity(current) === member.capturedIdentity) {
			member.sourceIdentity = pluginSourceStatIdentity(current);
			previous.members[relative].sourceIdentity = member.sourceIdentity;
			changed.set(member.source, member.sourceIdentity);
		}
	}
	return {
		fact,
		changed
	};
}
/** Fill dormant companion digests after the legacy initial receipt has consumed native bytes. */
function finishPluginNativeNamespace(fact) {
	for (const [relative, member] of Object.entries(fact.members)) {
		if (member.sizeBytes === void 0 || member.contentHash) continue;
		const filename = pluginNativeNamespaceMemberPath(fact, relative);
		const content = hashPluginSourceFile(filename, pluginNativeNamespaceBoundary(fact));
		const identity = pluginSourceStatIdentity(fs.statSync(filename, { bigint: true }));
		if (content.sizeBytes !== member.sizeBytes || !pluginSourceIdentityChangedOnlyByCtime(member.capturedIdentity, identity)) throw new Error("Native plugin companion changed before admission completed");
		if (member.sourceIdentity === member.capturedIdentity) member.sourceIdentity = identity;
		member.capturedIdentity = identity;
		member.contentHash = content.contentHash;
	}
}
//#endregion
//#region src/plugins/plugin-native-reference.ts
const nativeReferenceProgress = channel("openclaw.plugin-native-reference");
let verifiedMembers = 0;
/** A hardlink needs the owner's complete-directory check before the generation is exposed. */
function linkPluginNativeReference(source, target, fact) {
	try {
		fs.symlinkSync(fact.capturedPath, target, "file");
		return "symlink";
	} catch (error) {
		if (![
			"EPERM",
			"EACCES",
			"ENOSYS",
			"ENOTSUP"
		].some((code) => hasErrnoCode(error, code))) throw error;
	}
	const boundary = path.dirname(fact.capturedPath);
	linkPluginSourceFile(fact.capturedPath, boundary, target);
	if (fact.contentHash) {
		const content = hashPluginSourceFile(fact.capturedPath, boundary);
		if (content.contentHash !== fact.contentHash || content.sizeBytes !== fact.sizeBytes) throw new Error("Native plugin artifact changed while linking its generation");
	}
	const captured = fs.statSync(fact.capturedPath, { bigint: true });
	const sourceStat = fs.statSync(source, { bigint: true });
	const identity = pluginSourceStatIdentity(sourceStat);
	if (identity !== fact.sourceIdentity && (!pluginSourceIdentityChangedOnlyByCtime(fact.sourceIdentity, identity) || (captured.dev !== sourceStat.dev || captured.ino !== sourceStat.ino) && (!fact.contentHash || hashPluginSourceFile(source, path.dirname(source)).contentHash !== fact.contentHash))) throw new Error("Plugin source changed while linking its native artifact");
	fact.sourceIdentity = identity;
	fact.capturedIdentity = pluginSourceStatIdentity(captured);
	return "hardlink";
}
function resolveNativeHost(filename) {
	for (const modules of createRequire(filename).resolve.paths("openclaw") ?? []) {
		const candidate = path.join(modules, "openclaw");
		if (fs.existsSync(candidate)) return fs.realpathSync(candidate);
	}
}
/** Verdicts belong to one capture; replacement namespaces and placements must be admitted again. */
function createPluginNativeReferenceValidator(boundary, pluginId) {
	const admitted = /* @__PURE__ */ new WeakMap();
	return (target, fact, namespace, expectedHost) => {
		const directory = path.dirname(pluginNativeNamespaceMemberRelativePath(namespace, fact.capturedPath));
		const placement = `${directory}\0${path.dirname(target)}`;
		let verdict = admitted.get(namespace);
		try {
			if (!verdict?.placements.has(placement)) {
				if (!verdict) {
					verdict = {
						placements: /* @__PURE__ */ new Set(),
						members: /* @__PURE__ */ new Set()
					};
					admitted.set(namespace, verdict);
				}
				assertPluginNativeReferenceDirectory(target, namespace, boundary, directory, verdict.members, pluginId);
				verdict.placements.add(placement);
			}
			if (expectedHost && resolveNativeHost(target) !== expectedHost) throw new Error("The native companion directory resolves a different OpenClaw host");
		} catch (cause) {
			throw new Error("Native plugin companions cannot be preserved without file symlinks. Enable file symlink support for this filesystem, then reload the plugin.", { cause });
		}
	};
}
/** Hardlinks keep bytes but not realpath parents; only a coherent captured directory can use them. */
function assertPluginNativeReferenceDirectory(target, namespace, boundary, directory, admittedMembers, pluginId) {
	nativeReferenceProgress.publish({
		pluginId,
		completed: verifiedMembers
	});
	for (const [name, member] of Object.entries(namespace.members)) {
		if (!isPathInside(directory, name || ".")) continue;
		const memberPath = path.join(path.dirname(target), path.relative(directory, name || "."));
		const memberKey = `${name}\0${memberPath}`;
		if (admittedMembers.has(memberKey)) continue;
		const filename = fs.realpathSync(memberPath);
		if (!isPathInside(boundary, filename) && !isPathInside(pluginNativeNamespaceBoundary(namespace), filename)) throw new Error(`Companion ${name} leaves the captured generation`);
		const current = fs.statSync(filename, { bigint: true });
		if (member.sizeBytes === void 0) {
			if (!current.isDirectory()) throw new Error(`Companion ${name} is not a directory`);
		} else {
			const captured = fs.statSync(pluginNativeNamespaceMemberPath(namespace, name), { bigint: true });
			if (current.dev !== captured.dev || current.ino !== captured.ino) {
				const content = hashPluginSourceFile(filename, path.dirname(filename));
				if (content.contentHash !== member.contentHash || content.sizeBytes !== member.sizeBytes) throw new Error(`Companion ${name} differs from its captured bytes`);
			}
		}
		admittedMembers.add(memberKey);
		nativeReferenceProgress.publish({
			pluginId,
			completed: ++verifiedMembers
		});
	}
}
/** The caller has selected this exact recovery-map entry; symlinks and hardlinks retain its inode. */
function admitPluginNativeRecoveryReference(canonical, fact, prepared = fact) {
	if (fs.realpathSync(fact.capturedPath) !== fact.capturedPath) return;
	const captured = fs.statSync(fact.capturedPath, { bigint: true });
	const source = canonical === fact.capturedPath ? captured : fs.statSync(canonical, { bigint: true });
	if (source.dev !== captured.dev || source.ino !== captured.ino) return;
	const identity = pluginSourceStatIdentity(source);
	if (identity !== prepared.capturedIdentity || prepared.contentHash !== fact.contentHash || prepared.sizeBytes !== fact.sizeBytes) {
		const content = hashPluginSourceFile(fact.capturedPath, path.dirname(fact.capturedPath));
		if (content.contentHash !== fact.contentHash || content.sizeBytes !== fact.sizeBytes) return;
	}
	return {
		...fact,
		sourceIdentity: identity,
		capturedIdentity: identity
	};
}
//#endregion
//#region src/plugins/plugin-generation-source-lookup.ts
const sourceCustody = new AsyncLocalStorage();
/** Retain files across management phases, without retaining their callback instances or leases. */
async function withPluginGenerationSourceCustody(run) {
	try {
		var _usingCtx$1 = _usingCtx();
		if (sourceCustody.getStore()) return await run();
		const scope = _usingCtx$1.a({
			sources: /* @__PURE__ */ new Map(),
			async [Symbol.asyncDispose]() {
				const errors = (await Promise.allSettled([...this.sources.values()].map(({ source }) => source.disposeAsync()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (errors.length) throw new AggregateError(errors, "Plugin source custody cleanup failed");
			}
		});
		return await sourceCustody.run(scope, run);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Bind scoped file custody around an instance's independently constructed module graph. */
function createPluginGenerationCapture(create) {
	return (...args) => {
		const [rootDir, entryFile, execute, moduleSource, nativeRecovery, dependencyLookupBoundary] = args;
		const custody = execute && !nativeRecovery && !dependencyLookupBoundary && sourceCustody.getStore();
		if (!custody) return create(...args);
		const key = JSON.stringify([path.resolve(rootDir), typeof entryFile === "string" ? path.resolve(entryFile) : entryFile?.map((file) => path.resolve(file))]);
		let retained = custody.sources.get(key);
		if (!retained) {
			const seed = create(rootDir, entryFile, (run) => run(), void 0, void 0, void 0, void 0, true);
			try {
				retained = seed.retainSourceCustody();
				custody.sources.set(key, retained);
			} finally {
				seed.dispose();
			}
		}
		const fork = retained.source.fork();
		try {
			fork.native?.retain(getPluginCache());
			return create(rootDir, entryFile, execute, moduleSource, void 0, void 0, {
				source: fork,
				files: retained.files
			});
		} catch (error) {
			fork.dispose();
			throw error;
		}
	};
}
/** Reuse captured bytes across one management operation; source edits take effect next time. */
function createPluginSourceFacts(dependencyLookupBoundary, captureForCustody) {
	const files = /* @__PURE__ */ new Map();
	return {
		files: captureForCustody ? files : void 0,
		resolveDependency: createPluginDependencyResolver(dependencyLookupBoundary),
		captureCustody: (capture) => ({
			source: capture(),
			files: structuredClone(files)
		})
	};
}
function canonicalSource(rootDir, sourceRoot, source) {
	const lexical = path.resolve(source);
	const relative = relativePluginPathInsideRootSync(rootDir, lexical);
	return relative === void 0 ? lexical : path.join(sourceRoot, relative);
}
function getCapturedSource(sources, rootDir, sourceRoot, source) {
	const lexical = path.resolve(source);
	return sources.get(lexical) ?? sources.get(canonicalSource(rootDir, sourceRoot, lexical));
}
function createRecoverySourceResolver(rootDir, sourceRoot, sources) {
	return (source) => {
		const captured = getCapturedSource(sources, rootDir, sourceRoot, source);
		if (!captured) throw new Error("Plugin recovery entry is outside its captured source package");
		return captured;
	};
}
function copyRecoverySource({ rootDir, sourceRoot, capturedRoot, boundaryRoot, sources, native: suppliedNative }) {
	let native = suppliedNative;
	let recovery;
	try {
		recovery = createPluginSourceCapture();
		const directory = recovery.directory;
		const relocate = (filename) => path.join(directory, path.relative(boundaryRoot, filename));
		const hardlinkedTargets = /* @__PURE__ */ new Map();
		fs.cpSync(boundaryRoot, recovery.directory, {
			recursive: true,
			verbatimSymlinks: true,
			filter: (from, to) => {
				const fact = native?.references.get(from);
				if (!fact) {
					if (fs.lstatSync(from).isSymbolicLink()) {
						const target = fs.readlinkSync(from);
						const relative = path.isAbsolute(target) ? relativePluginPathInsideRootSync(boundaryRoot, target) : void 0;
						if (relative !== void 0) {
							fs.mkdirSync(path.dirname(to), {
								recursive: true,
								mode: 448
							});
							fs.symlinkSync(path.relative(path.dirname(to), path.join(directory, relative)), to, fs.statSync(from).isDirectory() ? "junction" : "file");
							return false;
						}
					}
					return true;
				}
				const retained = {
					...fact,
					sourceIdentity: fact.capturedIdentity
				};
				if (linkPluginNativeReference(fact.capturedPath, to, retained) === "hardlink") hardlinkedTargets.set(to, retained);
				native.references.set(from, retained);
				return false;
			}
		});
		const assertReference = createPluginNativeReferenceValidator(recovery.directory, rootDir);
		for (const [target, fact] of hardlinkedTargets) assertReference(target, fact, native.namespaces.get(fact.namespace));
		const copiedSources = new Map(Array.from(sources, ([source, captured]) => [source, relocate(captured)]));
		const previousNative = native;
		native = previousNative?.fork(relocate);
		previousNative?.dispose();
		const sourceCapture = recovery;
		const root = relocate(capturedRoot);
		let disposed = false;
		return {
			rootDir: root,
			sourceCapture,
			resolve: createRecoverySourceResolver(rootDir, sourceRoot, copiedSources),
			native,
			fork() {
				if (disposed) throw new Error("Plugin source recovery has been disposed");
				return copyRecoverySource({
					rootDir,
					sourceRoot,
					capturedRoot: root,
					boundaryRoot: directory,
					sources: copiedSources,
					native: native?.fork()
				});
			},
			dispose() {
				if (!disposed) {
					disposed = true;
					try {
						sourceCapture.dispose();
					} finally {
						native?.dispose();
					}
				}
			},
			async disposeAsync() {
				if (!disposed) {
					disposed = true;
					await Promise.all([sourceCapture.disposeAsync(), native?.disposeAsync()]);
				}
			}
		};
	} catch (error) {
		try {
			recovery?.dispose();
		} finally {
			native?.dispose();
		}
		if (hasErrnoCode(error, "ENOENT")) throw new PluginSourceRecoveryUnavailableError(error);
		throw error;
	}
}
/** Resolves captured source identities and gives recovery its own copy of their bytes. */
function createPluginGenerationSourceLookup({ rootDir, sourceRoot, capturedRoot, boundaryRoot, capturedPaths, hardlinkedSources, assertModuleAvailable, captureNativeRecovery }) {
	const resolveCaptured = (source) => {
		const captured = getCapturedSource(capturedPaths, rootDir, sourceRoot, source);
		return captured && isPathInside$1(capturedRoot, captured) ? captured : void 0;
	};
	return {
		hasSource: (source) => resolveCaptured(source) !== void 0,
		resolve: (source, rejectHardlinks = false) => {
			const captured = resolveCaptured(source);
			if (!captured) throw new Error("Plugin entry is outside its captured source package");
			if (rejectHardlinks && hardlinkedSources.has(captured)) throw new Error("Plugin source is hardlinked; use a separate file and reload.");
			assertModuleAvailable(captured);
			return captured;
		},
		captureRecoverySource: () => {
			for (const captured of new Set(capturedPaths.values())) assertModuleAvailable(captured);
			return copyRecoverySource({
				rootDir,
				sourceRoot,
				capturedRoot,
				boundaryRoot,
				sources: new Map(capturedPaths),
				native: captureNativeRecovery?.()
			});
		}
	};
}
/** Keep first-demand module lookup and admission with the captured source graph. */
function createPluginGenerationModuleLookup({ capturedPaths, originalSources, moduleCaptures, metadataCapture, assertModuleAvailable, captureAdmitted, captureExecutableFile, executable, packages, directory }) {
	const packageForFile = (filename) => findPluginCapturedPackage(packages, filename, directory)?.owner;
	return {
		boundaryRoot: directory,
		sourceForCaptured: (file) => originalSources.get(path.resolve(file)),
		moduleFacts: (importer) => moduleCaptures.get(importer),
		moduleRoot: (filename) => originalSources.has(filename) ? packageForFile(filename)?.capturedRoot : void 0,
		assertModuleAvailable,
		prepareModule: (filename) => {
			const owner = packageForFile(filename);
			const source = originalSources.get(filename);
			const needsEntry = executable && source && /\.[cm]?[jt]sx?$/.test(source) && !moduleCaptures.has(filename);
			if (!owner || (owner.state === "entry" || owner.state === "body") && !needsEntry) return [];
			return captureAdmitted(() => {
				owner.materialize(owner.state === "entry" ? source : void 0);
				if (needsEntry && owner.state !== "entry") owner.materialize(source);
			}).additions;
		},
		prepareDependency: (importer, specifier) => captureAdmitted(() => moduleCaptures.get(importer)?.prepareDependency(specifier)).additions,
		prepareNativeScopes: (importer) => {
			const scope = importer ? moduleCaptures.get(importer)?.nativeScope : void 0;
			return scope?.prepareDependencies || metadataCapture.pending ? captureAdmitted(() => metadataCapture.prepare(scope)) : void 0;
		},
		prepareNativeModule: (importer, specifier) => captureAdmitted(() => {
			const packageMap = moduleCaptures.get(importer)?.prepareDependency(specifier) === "package-map";
			metadataCapture.prepare();
			return packageMap;
		}).value,
		captureModule: (importer, specifier, conditions) => {
			const result = captureAdmitted(() => moduleCaptures.get(importer)?.capture(specifier, conditions));
			return result.value ? {
				...result.value,
				additions: result.additions
			} : void 0;
		},
		captureResolvedModule: (filename) => {
			const known = capturedPaths.get(path.resolve(filename));
			if (known) {
				assertModuleAvailable(known);
				return known;
			}
			return captureAdmitted(() => {
				const captured = findPluginCapturedPackage(packages, filename, directory);
				const source = captureExecutableFile(captured ? path.join(captured.owner.sourceRoot, path.relative(captured.root, filename)) : filename);
				const target = source ? capturedPaths.get(source) : void 0;
				if (target) capturedPaths.set(path.resolve(filename), target);
				return target;
			}).value;
		}
	};
}
//#endregion
export { withPluginSourceCaptureDirectory as A, createPluginPackageMetadataCapture as C, isPluginPackageFile as D, importTargetNames as E, pluginSourceIdentityChangedOnlyByCtime as F, pluginSourceStatIdentity as I, hashPluginSourceFile as M, isPluginNativeExecutable as N, packageName as O, isPluginSourceEntry as P, createPluginNativeDependencyScopes as S, findPluginCapturedPackage as T, pluginNativeNamespaceMemberPath as _, withPluginGenerationSourceCustody as a, capturePluginPackageMetadata as b, linkPluginNativeReference as c, capturePluginNativeDirectoryAliases as d, capturePluginNativeNamespace as f, pluginNativeNamespaceIsCurrent as g, pluginNativeNamespaceDirectory as h, createPluginSourceFacts as i, copyPluginSourceFile as j, resolvePluginModulePackageRoot as k, nativeReferenceProgress as l, pluginNativeNamespaceBoundary as m, createPluginGenerationModuleLookup as n, admitPluginNativeRecoveryReference as o, finishPluginNativeNamespace as p, createPluginGenerationSourceLookup as r, createPluginNativeReferenceValidator as s, createPluginGenerationCapture as t, assertPluginNativeNamespaceHost as u, pluginNativeNamespaceMemberRelativePath as v, createPluginSourceCapture as w, createPluginDependencyLookup as x, capturePluginDependencies as y };
