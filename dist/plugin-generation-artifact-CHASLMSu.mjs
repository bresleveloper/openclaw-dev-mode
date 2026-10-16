import { i as extractErrorCode, n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-CvJK4lmH.mjs";
import { A as PluginSourceRecoveryUnavailableError, o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as openRootFileSync$1 } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as retainLoadedPluginSourceCapture, o as retainPluginNativeCapturePath, r as isPluginSourceCaptureRetained, s as retainPluginSourceCaptureInstance, t as createPluginNativeCaptureRoot } from "./plugin-source-capture-directory-suikpgfR.mjs";
import { t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-Dqh0vrxU.mjs";
import { i as relativePluginPathInsideRootSync, n as isPathInside$1 } from "./path-safety-6KJ2Rbnw.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { a as retainNativePath, c as startNativeAdmissionPublication, n as nativeAdmissionStateFor, s as snapshotOwners } from "./plugin-native-admission-state-D3dxXEX2.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { r as isGitRuntimeStagingName, t as collectPluginSafetyInspectedFiles } from "./plugin-safety-inspected-files-Bbt-kJ4j.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { assertDirectoryIdentitySync, copyFileDescriptorSync, copyRootFileSync, createFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { channel } from "node:diagnostics_channel";
import { moduleResolve } from "import-meta-resolve";
import { parse as parse$1 } from "acorn";
//#region src/plugins/plugin-source-file.ts
const isPluginSourceEntry = (name) => name !== "node_modules" && name !== ".git" && !isGitRuntimeStagingName(name);
const scratch = Buffer.allocUnsafe(65536);
const SMALL_SOURCE_COPY_BYTES = 65536;
const pluginSourceStatIdentity = (stat, identity = stat) => `${identity.dev}:${identity.ino}:${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`;
const pluginSourceIdentityChangedOnlyByCtime = (previous, current) => previous.slice(0, previous.lastIndexOf(":")) === current.slice(0, current.lastIndexOf(":"));
function withPluginSourceFile(source, boundary, read) {
	const opened = openRootFileSync$1({
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
function pluginSourceFileIdentity(source, boundary) {
	return withPluginSourceFile(source, boundary, (fd) => pluginSourceStatIdentity(fs.fstatSync(fd, { bigint: true })));
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
function copySmallPluginSourceFile(source, boundary, target, fd, admitted, mode, hashCopiedContent) {
	try {
		var _usingCtx$1 = _usingCtx();
		const parent = path.dirname(target);
		const parentIdentity = fs.lstatSync(parent, { bigint: true });
		const assertParent = () => assertDirectoryIdentitySync(parent, {
			dev: parentIdentity.dev,
			ino: parentIdentity.ino,
			realPath: parent
		});
		const assertSource = () => withPluginSourceFile(source, boundary, (currentFd) => {
			const current = fs.fstatSync(currentFd, { bigint: true });
			const before = pluginSourceStatIdentity(admitted);
			const after = pluginSourceStatIdentity(current);
			if (before !== after && !pluginSourceIdentityChangedOnlyByCtime(before, after)) throw new FsSafeError(current.size > admitted.size ? "too-large" : "path-mismatch", "Plugin source changed while preparing its reload; retry after the edit finishes.");
		});
		const assertAdmission = () => {
			assertParent();
			assertSource();
		};
		const copied = _usingCtx$1.u(createFileSync(target, {
			mode: 384,
			assertBeforeMutation: assertAdmission
		}));
		const identity = fs.fstatSync(copied.fd, { bigint: true });
		const assertCurrent = () => {
			assertAdmission();
			const named = fs.lstatSync(target, { bigint: true });
			const current = fs.fstatSync(copied.fd, { bigint: true });
			if (!named.isFile() || named.nlink !== 1n || named.dev !== identity.dev || named.ino !== identity.ino || !current.isFile() || current.nlink !== 1n || current.dev !== identity.dev || current.ino !== identity.ino) throw new FsSafeError("path-mismatch", "Plugin capture destination changed during copying");
		};
		if (copyFileDescriptorSync(fd, copied.fd, {
			maxBytes: Number(admitted.size),
			assertBeforeMutation: assertCurrent
		}) !== Number(admitted.size)) throw new FsSafeError("path-mismatch", "Plugin source changed while copying");
		fs.fchmodSync(copied.fd, mode);
		assertCurrent();
		return hashCopiedContent ? {
			...hashPluginSourceDescriptor(copied.fd),
			sourceIdentity: pluginSourceStatIdentity(admitted)
		} : void 0;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
function copyPluginSourceFile(source, boundary, target, options = {}) {
	return withPluginSourceFile(source, boundary, (fd) => {
		const admitted = fs.fstatSync(fd, { bigint: true });
		try {
			try {
				var _usingCtx3 = _usingCtx();
				const mode = options.preserveSourceMode ? Number(admitted.mode & 511n) : 384 | Number(admitted.mode & 64n);
				if (admitted.size <= BigInt(SMALL_SOURCE_COPY_BYTES) && !/\.(?:node|so|dylib|dll)$/iu.test(source) && !isPluginNativeDescriptor(fd) && fs.realpathSync.native(path.dirname(target)) === path.dirname(target)) return copySmallPluginSourceFile(source, boundary, target, fd, admitted, mode, options.hashCopiedContent);
				const copied = _usingCtx3.u(copyRootFileSync({
					source: {
						rootPath: boundary,
						absolutePath: source
					},
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
	});
}
function linkPluginSourceFile(source, boundary, target) {
	withPluginSourceFile(source, boundary, (fd) => {
		const admitted = fs.fstatSync(fd, { bigint: true });
		fs.linkSync(source, target);
		const linked = fs.statSync(target, { bigint: true });
		if (linked.dev !== admitted.dev || linked.ino !== admitted.ino) throw new Error("Native plugin artifact changed during admission");
	});
}
function hashPluginSourceFile(source, boundary, receipt, prepared) {
	return withPluginSourceFile(source, boundary, (fd) => hashPluginSourceDescriptor(fd, receipt, prepared));
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
//#region src/plugins/plugin-source-verification.ts
function readPluginSourceDirectory(source) {
	const entries = fs.readdirSync(source, { withFileTypes: true }).filter((entry) => isPluginSourceEntry(entry.name)).toSorted((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	const content = entries.map((entry) => [entry.name, entry.isSymbolicLink() ? fs.readlinkSync(path.join(source, entry.name)) : null]);
	return {
		names: entries.map((entry) => entry.name),
		contentHash: createHash("sha256").update(JSON.stringify(content)).digest("hex")
	};
}
const pluginSourceInputIdentity = (stat) => stat.isDirectory() ? `${stat.dev}:${stat.ino}:${stat.mode}` : pluginSourceStatIdentity(stat);
function verifyPluginSourceInputs(inputs, sources) {
	for (const source of sources) {
		const input = inputs.get(source);
		const identity = input.native ? pluginSourceFileIdentity(source, input.boundary) : pluginSourceInputIdentity(fs.statSync(source, { bigint: true }));
		if (!input.directory && identity !== input.identity && pluginSourceIdentityChangedOnlyByCtime(input.identity, identity) && hashPluginSourceFile(source, input.boundary).contentHash === input.contentHash) input.identity = identity;
		if (fs.realpathSync(source) !== source || identity !== input.identity || (input.directory ? readPluginSourceDirectory(source).contentHash : input.native ? input.contentHash : hashPluginSourceFile(source, input.boundary).contentHash) !== input.contentHash) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
	}
}
//#endregion
//#region src/plugins/plugin-generation-file-capture.ts
function createPluginSourceLinkCapture() {
	const links = /* @__PURE__ */ new Set();
	return {
		defer(filename, root, source = filename) {
			if (!fs.lstatSync(filename).isSymbolicLink() || isPathInside(root, fs.realpathSync(filename))) return false;
			links.add(source);
			return true;
		},
		contains: (filename) => [...links].some((link) => isPathInside(link, filename))
	};
}
/** Capture each selected package file once, retaining its source facts and ordered receipt. */
function createPluginGenerationFileCapture({ boundary, destination, directory, outputRoot, capturedPaths, originalSources, hardlinkedSources, sourceCapture, sourceLinks, deferExternalLinks, nativeAdmission, receipt, onPackageMetadata }) {
	const { inputs, pendingInputs, additions } = sourceCapture;
	const ancestors = /* @__PURE__ */ new Set();
	const copy = (source, target) => {
		if (capturedPaths.get(path.resolve(source)) === target) return;
		const prepared = nativeAdmission.resolvePreparedSource(source);
		const input = prepared?.path ?? source;
		const inputBoundary = prepared?.boundary ?? boundary;
		const real = fs.realpathSync(input);
		const retainedNative = nativeAdmission.isRetainedReference(source, real);
		if (!isPathInside(inputBoundary, real) && !retainedNative) throw new Error(`Plugin source link leaves its package: ${path.relative(boundary, source)}. Declare shared code as a package dependency.`);
		if (!prepared && outputRoot && isPathInside(outputRoot, real)) return;
		const stat = fs.statSync(real, { bigint: true });
		const captured = capturedPaths.get(real);
		const recordContent = (contentHash, sizeBytes = 0, native = false, identity = pluginSourceInputIdentity(stat), admittedBoundary = inputBoundary) => {
			if (!captured) {
				inputs.set(real, {
					identity,
					contentHash,
					sizeBytes,
					directory: stat.isDirectory(),
					boundary: admittedBoundary,
					...native ? { native: true } : {}
				});
				pendingInputs.add(real);
			}
		};
		capturedPaths.set(path.resolve(source), target);
		originalSources.set(target, path.resolve(source));
		capturedPaths.set(target, target);
		if (!capturedPaths.has(real)) capturedPaths.set(real, target);
		receipt.marker(`${stat.isDirectory() ? "directory" : "file"}\0${path.relative(destination, target)}\0`);
		if (stat.isDirectory()) {
			if (ancestors.has(real)) throw new Error(`Plugin source contains a directory cycle: ${source}`);
			ancestors.add(real);
			fs.mkdirSync(target, {
				recursive: true,
				mode: 448
			});
			const { names, contentHash } = readPluginSourceDirectory(real);
			recordContent(contentHash);
			for (const name of names) if (!(deferExternalLinks && !nativeAdmission.isRetainedReference(path.join(source, name)) && sourceLinks.defer(path.join(input, name), inputBoundary, path.join(source, name)))) copy(path.join(source, name), path.join(target, name));
			ancestors.delete(real);
		} else if (stat.isFile()) {
			if (stat.nlink > 1n) hardlinkedSources.add(target);
			fs.mkdirSync(path.dirname(target), {
				recursive: true,
				mode: 448
			});
			additions.add(target);
			let copiedContent;
			const native = nativeAdmission.materialize(real, inputBoundary, target, stat, source);
			if (native) nativeAdmission.reconcileSourceInputs(inputs);
			else if (captured) copiedContent = copyPluginSourceFile(captured, directory, target, {
				hashCopiedContent: true,
				preserveSourceMode: true
			});
			else {
				copiedContent = copyPluginSourceFile(real, inputBoundary, target, { hashCopiedContent: true });
				const identity = pluginSourceInputIdentity(stat);
				if (copiedContent && copiedContent.sourceIdentity !== identity && !pluginSourceIdentityChangedOnlyByCtime(identity, copiedContent.sourceIdentity)) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
			}
			receipt.file({
				target: native?.path ?? target,
				boundary: native?.boundary ?? directory,
				sizeBytes: Number(stat.size),
				native: native !== void 0,
				prepared: native?.content ?? copiedContent,
				onContent: (content) => {
					native?.record(content);
					recordContent(content.contentHash, content.sizeBytes, native !== void 0, native?.sourceIdentity ?? (captured ? void 0 : copiedContent?.sourceIdentity), native?.sourceBoundary ?? inputBoundary);
				}
			});
			if (path.basename(target) === "package.json") onPackageMetadata(source, target);
		} else throw new Error(`Plugin build input is not a regular file: ${source}`);
	};
	return copy;
}
//#endregion
//#region src/plugins/plugin-generation-receipt.ts
/** Reuse the initial raw-byte receipt only when its complete ordered inputs still match. */
function createPluginGenerationReceipt(prepared) {
	const events = [];
	let finished;
	const publishContent = (file, content) => {
		if (content.sizeBytes !== file.sizeBytes) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
		if (!file.content) {
			file.content = content;
			file.onContent(content);
		}
	};
	const readContent = (file, receipt, expected = file.content) => {
		const content = hashPluginSourceFile(file.target, file.boundary, receipt, file.native ? file.content : void 0);
		if (!file.native && expected && content.contentHash !== expected.contentHash) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
		publishContent(file, content);
	};
	const inputSignature = () => {
		if (events.some((event) => typeof event !== "string" && !event.content)) return;
		const signature = createHash("sha256");
		for (const event of events) signature.update(JSON.stringify(typeof event === "string" ? ["marker", event] : [
			"file",
			event.sizeBytes,
			event.content.contentHash
		]));
		return signature.digest("hex");
	};
	return {
		marker(framed) {
			if (!finished) events.push(framed);
		},
		file(params) {
			const { prepared: content, ...input } = params;
			const file = input;
			if (content) {
				if (finished && !file.native) readContent(file, void 0, content);
				else publishContent(file, content);
			} else if (!file.native || finished) readContent(file);
			if (!finished) events.push(file);
		},
		finish() {
			if (finished) return finished;
			const signature = inputSignature();
			const receipt = signature !== void 0 && prepared?.signature === signature ? void 0 : createHash("sha256");
			for (const event of events) if (typeof event === "string") receipt?.update(event);
			else if (receipt || !event.content || !event.native) readContent(event, receipt);
			finished = {
				signature: signature ?? inputSignature(),
				sourceDigest: receipt ? receipt.digest("hex") : prepared.sourceDigest
			};
			events.length = 0;
			return finished;
		}
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
function capturePluginModuleSource(filename, capture) {
	const real = fs.realpathSync(filename);
	if (!fs.statSync(real).isFile()) return;
	capture(resolvePluginModulePackageRoot(real), real);
	return real;
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
function createPluginSourceCapture(execute) {
	const override = sourceCaptureDirectory.getStore();
	const instance = override === void 0 ? retainPluginSourceCaptureInstance() : void 0;
	let created;
	let directory;
	try {
		created = override !== void 0 ? fs.mkdtempSync(path.join(override.directory, PLUGIN_SOURCE_CAPTURE_PREFIX)) : instance.createDirectory();
		directory = fs.realpathSync(created);
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
	const inputs = /* @__PURE__ */ new Map();
	const pendingInputs = /* @__PURE__ */ new Set();
	const additions = /* @__PURE__ */ new Set();
	const captureFailures = /* @__PURE__ */ new Map();
	let disposed = false;
	const acquire = (capture) => {
		if (disposed) throw new Error("Plugin module capture has been disposed");
		try {
			const value = capture();
			verifyPluginSourceInputs(inputs, pendingInputs);
			return {
				value,
				additions: [...additions]
			};
		} catch (error) {
			for (const filename of additions) captureFailures.set(filename, error);
			throw error;
		} finally {
			pendingInputs.clear();
			additions.clear();
		}
	};
	const assertModuleAvailable = (filename) => {
		if (captureFailures.has(filename)) throw captureFailures.get(filename);
	};
	const captureAdmitted = (run) => {
		const capture = () => acquire(run);
		return execute ? execute(capture) : capture();
	};
	const beginDisposal = () => {
		disposed = true;
		const filenames = directory + path.sep;
		const urls = pathToFileURL(filenames).href;
		const cache = createRequire(import.meta.url).cache;
		for (const id of Object.keys(cache)) if (id.startsWith(filenames) || id.startsWith(urls)) delete cache[id];
		captureFailures.clear();
	};
	return {
		inputs,
		pendingInputs,
		additions,
		capture: captureAdmitted,
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
	for (const [alias, namespace] of selected) {
		const root = Object.keys(packageRoots).filter((candidate) => isPathInside(candidate, alias)).toSorted((left, right) => right.length - left.length)[0];
		if (root) directories.set(path.join(packageRoots[root], path.relative(root, alias)), namespace.capturedRoot);
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
			else if ((previous || managed && (params.managedRoots ?? [boundary]).some((root) => isPathInside(root, member.source))) && !(previous?.members[relative]?.boundaryChecked ?? boundaryFiles.has(member.source))) {
				linkPluginSourceFile(member.source, member.boundary, target);
				linkedSources.add(member.source);
			} else {
				copyPluginSourceFile(member.source, member.boundary, target);
				fs.chmodSync(target, 384 | Number(member.stat.mode & 64n));
			}
		}
	} catch (error) {
		if (!managed || previous || !params.retainedRoot || [...before.values()].some((member) => !isPathInside(params.retainedRoot, member.source)) || ![
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
		if (stat !== pluginSourceStatIdentity(fs.statSync(filename, { bigint: true })) || prior && (digest.contentHash !== prior.contentHash || digest.sizeBytes !== prior.sizeBytes)) throw new Error("Native plugin companion changed during admission");
		content.set(relative, digest);
	}
	const after = inspectDirectory(from, fromBoundary, previous ? void 0 : outputRoot, !previous || Boolean(previous.referenceRoot));
	const captured = inspectDirectory(referenceRoot ? sourceDirectory : directory, referenceRoot ?? capturedRoot, referenceRoot ? outputRoot : void 0, Boolean(referenceRoot));
	if (before.size !== after.size || captured.size !== before.size || [...before].some(([relative, member]) => {
		const current = after.get(relative);
		return !current || current.source !== member.source || current.identity !== member.identity && (!(managed || previous) || !pluginSourceIdentityChangedOnlyByCtime(member.identity, current.identity));
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
		if (content.sizeBytes !== member.sizeBytes || pluginSourceStatIdentity(fs.statSync(filename, { bigint: true })) !== member.capturedIdentity) throw new Error("Native plugin companion changed before admission completed");
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
		nativeReferenceProgress.publish({
			pluginId,
			completed: verifiedMembers,
			active: true
		});
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
		} finally {
			nativeReferenceProgress.publish({
				pluginId,
				completed: verifiedMembers,
				active: false
			});
		}
	};
}
/** Hardlinks keep bytes but not realpath parents; only a coherent captured directory can use them. */
function assertPluginNativeReferenceDirectory(target, namespace, boundary, directory, admittedMembers, pluginId) {
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
			completed: ++verifiedMembers,
			active: true
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
function createRecoverySourceDisposal(recovery, native) {
	return {
		dispose: () => {
			try {
				recovery.dispose();
			} finally {
				native?.dispose();
			}
		},
		disposeAsync: async () => {
			await Promise.all([recovery.disposeAsync(), ...native ? [native.disposeAsync()] : []]);
		}
	};
}
function captureRecoverySource({ rootDir, sourceRoot, capturedRoot, boundaryRoot, capturedPaths, captureNativeRecovery }) {
	const recovery = createPluginSourceCapture();
	let native;
	try {
		native = captureNativeRecovery?.();
		const hardlinkedTargets = /* @__PURE__ */ new Map();
		fs.cpSync(boundaryRoot, recovery.directory, {
			recursive: true,
			verbatimSymlinks: true,
			filter: (from, to) => {
				const fact = native?.references.get(from);
				if (!fact) return true;
				const retained = {
					...fact,
					sourceIdentity: fact.capturedIdentity
				};
				if (linkPluginNativeReference(fact.capturedPath, to, retained) === "hardlink") hardlinkedTargets.set(to, retained);
				native.references.set(from, retained);
				return false;
			}
		});
		const assertReference = createPluginNativeReferenceValidator(recovery.directory, "native-recovery");
		for (const [target, fact] of hardlinkedTargets) assertReference(target, fact, native.namespaces.get(fact.namespace));
		const relocate = (filename) => path.join(recovery.directory, path.relative(boundaryRoot, filename));
		for (const captured of new Set(capturedPaths.values())) fs.lstatSync(relocate(captured));
		const sources = new Map(Array.from(capturedPaths, ([source, captured]) => [source, relocate(captured)]));
		return {
			rootDir: relocate(capturedRoot),
			resolve: createRecoverySourceResolver(rootDir, sourceRoot, sources),
			native: native && {
				...native,
				references: new Map(Array.from(native.references, ([source, fact]) => [relocate(source), fact])),
				directories: new Map(Array.from(native.directories, ([source, namespace]) => [relocate(source), namespace]))
			},
			...createRecoverySourceDisposal(recovery, native)
		};
	} catch (error) {
		createRecoverySourceDisposal(recovery, native).dispose();
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
			return captureRecoverySource({
				rootDir,
				sourceRoot,
				capturedRoot,
				boundaryRoot,
				capturedPaths,
				captureNativeRecovery
			});
		}
	};
}
/** Resolve first-demand executable files through the same captured-source availability owner. */
function createPluginResolvedModuleCapture({ capturedPaths, assertModuleAvailable, captureAdmitted, captureExecutableFile, packages, directory }) {
	return (filename) => {
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
	};
}
//#endregion
//#region src/plugins/plugin-source-admission-store.ts
/** Deferred publication retains its original store and authority through settlement. */
function createPluginSourceAdmissionPublisher(options = {}) {
	if (isArtifactPreservingStateRead()) return;
	let context;
	try {
		context = captureOpenClawStateWorkerContext(resolveInstalledPluginIndexStateDatabaseOptions(options));
	} catch (error) {
		return async () => {
			throw error;
		};
	}
	return async (publication) => {
		if (isArtifactPreservingStateRead()) return false;
		const prepared = structuredClone(publication);
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "plugins.metadata.sourceAdmission.publish",
			input: prepared
		}), { existingOnly: true }) ?? false;
	};
}
//#endregion
//#region src/plugins/plugin-native-admission.ts
const nativeSourceMembers = /* @__PURE__ */ new WeakMap();
function nativeMemberForSource(namespace, source) {
	const relative = path.relative(namespace.sourceDirectory, source);
	if (namespace.members[relative]?.source === source) return relative;
	let members = nativeSourceMembers.get(namespace);
	if (!members) {
		members = /* @__PURE__ */ new Map();
		for (const [key, { source: memberSource }] of Object.entries(namespace.members)) if (!members.has(memberSource)) members.set(memberSource, key);
		nativeSourceMembers.set(namespace, members);
	}
	return members.get(source);
}
function createNativeRecovery(receipt, references, namespaces, directories, roots) {
	const custody = {};
	const paths = [...references.values()].map((fact) => fact.capturedPath);
	paths.push(...[...namespaces.keys()].map((root) => path.join(root, "content")));
	const pins = [...new Set(paths)].map(retainPluginNativeCapturePath);
	for (const root of roots) snapshotOwners.get(root).add(custody);
	let disposed = false;
	const release = () => {
		if (disposed) return [];
		disposed = true;
		for (const pin of pins) pin();
		return roots.filter((root) => {
			const owners = snapshotOwners.get(root);
			owners.delete(custody);
			return owners.size === 0;
		});
	};
	return {
		receipt: { ...receipt },
		references,
		namespaces,
		directories,
		retain(cache) {
			if (disposed) throw new Error("Plugin native recovery has been disposed");
			const state = nativeAdmissionStateFor(cache);
			for (const [key, namespace] of namespaces) {
				state.namespaces.set(key, namespace);
				retainNativePath(state, path.join(key, "content"));
			}
			for (const root of roots) {
				state.roots.add(root);
				snapshotOwners.get(root).add(state);
			}
			for (const fact of references.values()) retainNativePath(state, fact.capturedPath);
		},
		dispose() {
			for (const root of release()) root.dispose();
		},
		async disposeAsync() {
			await Promise.all(release().map((root) => root.disposeAsync()));
		}
	};
}
function isNativeArtifact(source, boundary, stat, known) {
	return /\.(?:node|so(?:\.\d+)*|dylib|dll|exe|bin)$/i.test(source) || (stat.mode & 73n) !== 0n && path.extname(source) === "" && (known || isPluginNativeExecutable(source, boundary));
}
/** Admission is shared below registration; each generation still owns its module graph. */
function createPluginNativeAdmission(rootDir, directory, entryFile, recovery, outputRoot) {
	recovery?.retain(getPluginCache());
	const state = nativeAdmissionStateFor();
	const key = `${path.resolve(rootDir)}\0${entryFile ? path.resolve(entryFile) : ""}`;
	const owner = state.owners.get(path.resolve(rootDir));
	const publishAdmission = owner && !state.artifactPreservingReadOnly ? createPluginSourceAdmissionPublisher({ stateDir: state.publicationStateDir }) : void 0;
	const prepared = recovery?.receipt ?? state.receipts.get(key);
	const selected = /* @__PURE__ */ new Map();
	const priorNamespaces = /* @__PURE__ */ new Set();
	const files = /* @__PURE__ */ new Map();
	const targets = /* @__PURE__ */ new Map();
	const hardlinkedTargets = /* @__PURE__ */ new Set();
	const pendingTargets = /* @__PURE__ */ new Set();
	let assertReference = createPluginNativeReferenceValidator(directory, owner?.pluginId ?? rootDir);
	const recoveredFiles = /* @__PURE__ */ new Map();
	let hostRoot;
	let finalReceipt;
	const namespaces = () => [...new Set(selected.values())];
	for (const [alias, id] of recovery?.directories ?? []) {
		const namespace = state.namespaces.get(id);
		if (namespace) selected.set(alias, namespace);
	}
	const namespaceFor = (source) => [...selected].toSorted(([left], [right]) => right.length - left.length).find(([alias]) => isPathInside(alias, source));
	const resolvePreparedSource = (source) => {
		const file = files.get(path.resolve(source));
		if (file) return {
			path: file.capturedPath,
			boundary: pluginNativeNamespaceBoundary(state.namespaces.get(file.namespace))
		};
		if (!recovery) for (const namespace of namespaces()) {
			const relative = nativeMemberForSource(namespace, source);
			if (relative !== void 0) return {
				path: pluginNativeNamespaceMemberPath(namespace, relative),
				boundary: pluginNativeNamespaceBoundary(namespace)
			};
		}
		const found = namespaceFor(path.resolve(source));
		return found ? {
			path: path.join(pluginNativeNamespaceDirectory(found[1]), path.relative(found[0], path.resolve(source))),
			boundary: pluginNativeNamespaceBoundary(found[1])
		} : void 0;
	};
	const sourceForPrepared = (filename) => {
		for (const [alias, namespace] of selected) {
			const root = pluginNativeNamespaceDirectory(namespace);
			if (isPathInside(root, filename)) {
				const relative = path.relative(root, filename);
				return !recovery && namespace.members[relative]?.source || path.join(alias, relative);
			}
		}
	};
	const createNamespace = (sourceDirectory, boundary, managed, previous, retainedRoot) => {
		const root = createPluginNativeCaptureRoot(state.captureStorage.stateDir, state.captureStorage.placement);
		state.roots.add(root);
		snapshotOwners.set(root, /* @__PURE__ */ new Set([state]));
		const { fact, changed } = capturePluginNativeNamespace({
			sourceDirectory,
			boundary,
			managed,
			previous,
			retainedRoot,
			managedRoots: [...state.managedRoots.keys()],
			capturedRoot: root.directory,
			outputRoot,
			inspectionRoots: [.../* @__PURE__ */ new Set([boundary, ...owner ? [owner.rootDir] : []])],
			inspectedFiles: [
				owner?.source,
				owner?.setupSource,
				entryFile
			].filter((file) => Boolean(file))
		});
		for (const namespace of state.namespaces.values()) for (const [relative, member] of Object.entries(namespace.members)) {
			const identity = changed.get(member.source);
			const sourceChanged = identity !== void 0 && pluginSourceIdentityChangedOnlyByCtime(member.sourceIdentity, identity);
			const captureChanged = identity !== void 0 && pluginSourceIdentityChangedOnlyByCtime(member.capturedIdentity, identity);
			if (!identity || !sourceChanged && !captureChanged) continue;
			if (!namespace.referenceRoot && namespace !== previous && !namespaces().includes(namespace) && !priorNamespaces.has(namespace) && !isPluginSourceCaptureRetained(namespace.capturedRoot) && !fs.lstatSync(namespace.capturedRoot, { throwIfNoEntry: false })) break;
			if (namespace !== previous || !captureChanged) {
				const capturedHash = hashPluginSourceFile(pluginNativeNamespaceMemberPath(namespace, relative), pluginNativeNamespaceBoundary(namespace)).contentHash;
				if (member.contentHash && capturedHash !== member.contentHash || sourceChanged && hashPluginSourceFile(member.source, path.dirname(member.source)).contentHash !== capturedHash) throw new Error("Native plugin companion changed during admission");
				member.contentHash ??= capturedHash;
			}
			if (sourceChanged) member.sourceIdentity = identity;
			if (captureChanged) member.capturedIdentity = identity;
		}
		state.namespaces.set(root.directory, fact);
		return fact;
	};
	const publish = () => {
		if (!finalReceipt || files.size === 0) return;
		for (const [source, fact] of files) {
			state.files.set(source, fact);
			retainNativePath(state, fact.capturedPath);
			retainNativePath(state, path.join(fact.namespace, "content"));
		}
		const used = new Set([...files.values()].map((fact) => fact.namespace));
		const next = structuredClone({
			...finalReceipt,
			nativeArtifacts: Object.fromEntries(files),
			nativeNamespaces: Object.fromEntries([...used].map((id) => [id, state.namespaces.get(id)]))
		});
		const unchanged = isDeepStrictEqual(state.receipts.get(key), next);
		state.receipts.set(key, next);
		if (!owner || !publishAdmission) return;
		if (unchanged) {
			startNativeAdmissionPublication(state, key);
			return;
		}
		const roots = [...state.roots].filter((root) => used.has(root.directory));
		const publication = () => publishAdmission({
			pluginId: owner.pluginId,
			rootDir: owner.rootDir,
			installRecordHash: owner.installRecordHash,
			key,
			receipt: next
		}).then((accepted) => {
			if (accepted) {
				for (const root of roots) root.commit();
				if (state.publications.get(key) === publication) state.publications.delete(key);
			}
		}).catch((error) => process.emitWarning(`Plugin source receipt was not recorded: ${String(error)}`));
		state.publications.set(key, publication);
		startNativeAdmissionPublication(state, key);
	};
	const refreshReference = (fact, input, target) => {
		const namespace = state.namespaces.get(fact.namespace);
		const relative = pluginNativeNamespaceMemberRelativePath(namespace, fact.capturedPath);
		const member = namespace.members[relative];
		const linked = {
			...fact,
			sourceIdentity: pluginSourceStatIdentity(fs.statSync(input, { bigint: true }))
		};
		if (linkPluginNativeReference(input, target, linked) === "hardlink") hardlinkedTargets.add(target);
		else hardlinkedTargets.delete(target);
		const oldIdentity = member.capturedIdentity;
		member.capturedIdentity = linked.capturedIdentity;
		if (member.sourceIdentity === oldIdentity) member.sourceIdentity = linked.capturedIdentity;
		fact.sourceIdentity = member.sourceIdentity;
		fact.capturedIdentity = linked.capturedIdentity;
		pendingTargets.add(target);
		return linked.sourceIdentity;
	};
	const assertReferenceNamespaces = (references = pendingTargets) => {
		for (const target of references) {
			if (!hardlinkedTargets.has(target)) continue;
			const fact = files.get(targets.get(target));
			assertReference(target, fact, state.namespaces.get(fact.namespace), hostRoot);
		}
	};
	const linkHost = (selectedHost) => {
		hostRoot = fs.realpathSync(selectedHost);
		for (const namespace of namespaces()) {
			if (namespace.referenceRoot) {
				assertPluginNativeNamespaceHost(namespace, hostRoot, rootDir);
				continue;
			}
			const link = path.join(namespace.capturedRoot, "node_modules", "openclaw");
			const present = fs.lstatSync(link, { throwIfNoEntry: false });
			if (present && fs.realpathSync(link) !== hostRoot) {
				const replacement = createNamespace(namespace.sourceDirectory, namespace.sourceDirectory, namespace.managed, namespace);
				priorNamespaces.add(namespace);
				fs.mkdirSync(path.join(replacement.capturedRoot, "node_modules"), {
					recursive: true,
					mode: 448
				});
				fs.symlinkSync(hostRoot, path.join(replacement.capturedRoot, "node_modules", "openclaw"), "junction");
				for (const [alias, selectedNamespace] of selected) if (selectedNamespace === namespace) selected.set(alias, replacement);
				for (const [source, fact] of files) {
					if (fact.namespace !== namespace.capturedRoot) continue;
					const relative = pluginNativeNamespaceMemberRelativePath(namespace, fact.capturedPath);
					const member = replacement.members[relative];
					files.set(source, {
						...fact,
						namespace: replacement.capturedRoot,
						capturedPath: path.join(pluginNativeNamespaceDirectory(replacement), relative),
						capturedIdentity: member.capturedIdentity,
						sourceIdentity: member.sourceIdentity
					});
				}
				for (const [target, source] of targets) {
					const fact = files.get(source);
					if (fact.namespace !== replacement.capturedRoot) continue;
					fs.unlinkSync(target);
					refreshReference(fact, fact.capturedPath, target);
				}
			} else if (!present) {
				fs.mkdirSync(path.dirname(link), {
					recursive: true,
					mode: 448
				});
				try {
					fs.symlinkSync(hostRoot, link, "junction");
				} catch (error) {
					if (!hasErrnoCode(error, "EEXIST")) throw error;
					if (fs.realpathSync(link) !== hostRoot) return linkHost(hostRoot);
				}
			}
		}
	};
	return {
		prepared,
		resolvePreparedSource,
		sourceForPrepared,
		reconcileSourceInputs(inputs) {
			for (const namespace of /* @__PURE__ */ new Set([...priorNamespaces, ...namespaces()])) for (const [relative, member] of Object.entries(namespace.members)) {
				if (member.sizeBytes === void 0) continue;
				const capturedPath = pluginNativeNamespaceMemberPath(namespace, relative);
				for (const [source, identity] of [[member.source, member.sourceIdentity], [capturedPath, member.capturedIdentity]]) {
					const input = inputs.get(source);
					if (!input || input.identity === identity) continue;
					if (!pluginSourceIdentityChangedOnlyByCtime(input.identity, identity)) throw new Error("Plugin source changed during native namespace admission");
					member.contentHash ??= hashPluginSourceFile(capturedPath, pluginNativeNamespaceBoundary(namespace)).contentHash;
					if (input.contentHash !== member.contentHash) throw new Error("Plugin source changed during native namespace admission");
					input.identity = identity;
				}
			}
		},
		captureRecovery(receipt, packageRoots) {
			const references = new Map([...targets].map(([target, source]) => [target, { ...files.get(source) }]));
			const used = new Set([...references.values()].map((fact) => fact.namespace));
			return createNativeRecovery(receipt, references, new Map([...used].map((id) => [id, structuredClone(state.namespaces.get(id))])), capturePluginNativeDirectoryAliases(selected, packageRoots), [...state.roots].filter((root) => used.has(root.directory)));
		},
		isRetainedReference(source, real) {
			const fact = recovery?.references.get(path.resolve(source));
			if (!fact) return false;
			const canonical = real ?? fs.realpathSync(source);
			const admitted = admitPluginNativeRecoveryReference(canonical, fact, recoveredFiles.get(canonical));
			if (!admitted) return false;
			recoveredFiles.set(canonical, admitted);
			return true;
		},
		materialize(source, boundary, target, stat, logicalSource = sourceForPrepared(source) ?? source) {
			const recovered = recoveredFiles.get(source);
			const resolvedSource = sourceForPrepared(source) ?? source;
			const known = files.get(logicalSource) ?? state.files.get(logicalSource) ?? recovered;
			if (owner?.source === logicalSource || owner?.setupSource === logicalSource || entryFile === logicalSource) return;
			if (!isNativeArtifact(source, boundary, stat, Boolean(known))) return;
			const found = namespaceFor(resolvedSource);
			let namespace = recovered ? state.namespaces.get(recovered.namespace) : namespaces().find((candidate) => nativeMemberForSource(candidate, resolvedSource) !== void 0) ?? found?.[1];
			let alias = found?.[0] ?? path.dirname(resolvedSource);
			if (!namespace) {
				const tree = [...state.managedRoots].find(([root]) => isPathInside(root, resolvedSource));
				const managed = Boolean(tree);
				const admittedBoundary = tree?.[0] ?? boundary;
				const packageRoot = resolvePluginModulePackageRoot(resolvedSource);
				alias = isPathInside(admittedBoundary, packageRoot) ? packageRoot : path.dirname(resolvedSource);
				const preferred = known && state.namespaces.get(known.namespace);
				namespace = [.../* @__PURE__ */ new Set([...preferred ? [preferred] : [], ...[...state.namespaces.values()].toReversed()])].find((candidate) => {
					if (!isPathInside(candidate.sourceDirectory, alias) || candidate.managed !== managed || candidate.referenceRoot !== void 0 && (tree?.[1] !== "retained-npm" || candidate.referenceRoot !== tree[0])) return false;
					try {
						return pluginNativeNamespaceIsCurrent(candidate, admittedBoundary, outputRoot);
					} catch {
						return false;
					}
				});
				namespace ??= createNamespace(alias, admittedBoundary, managed, void 0, tree?.[1] === "retained-npm" ? tree[0] : void 0);
				alias = namespace.sourceDirectory;
				selected.set(alias, namespace);
			} else if (recovered) alias = [...selected].find(([, candidate]) => candidate === namespace)?.[0] ?? alias;
			const relative = recovered ? pluginNativeNamespaceMemberRelativePath(namespace, recovered.capturedPath) : nativeMemberForSource(namespace, resolvedSource) ?? path.relative(alias, resolvedSource);
			const member = namespace.members[relative];
			if (!member || member.sizeBytes === void 0) throw new Error("Native plugin artifact is outside its admitted directory");
			const fact = {
				sourceIdentity: member.sourceIdentity,
				contentHash: member.contentHash ?? "",
				sizeBytes: member.sizeBytes,
				namespace: namespace.capturedRoot,
				capturedPath: pluginNativeNamespaceMemberPath(namespace, relative),
				capturedIdentity: member.capturedIdentity
			};
			const inputIdentity = refreshReference(fact, source, target);
			files.set(logicalSource, fact);
			targets.set(target, logicalSource);
			return {
				fact,
				path: fact.capturedPath,
				boundary: pluginNativeNamespaceBoundary(namespace),
				sourceIdentity: inputIdentity,
				sourceBoundary: path.dirname(source),
				content: fact.contentHash ? {
					contentHash: fact.contentHash,
					sizeBytes: fact.sizeBytes
				} : void 0,
				record(content) {
					Object.assign(fact, content);
					Object.assign(member, content);
					for (const other of namespaces()) for (const sibling of Object.values(other.members)) {
						if (sibling.sizeBytes !== content.sizeBytes || sibling.contentHash) continue;
						if (sibling.source === member.source && sibling.sourceIdentity === member.sourceIdentity || sibling.capturedIdentity.split(":").slice(0, 2).join(":") === member.capturedIdentity.split(":").slice(0, 2).join(":")) Object.assign(sibling, content);
					}
				}
			};
		},
		finish(receipt) {
			if (!pendingTargets.size) return;
			for (const namespace of namespaces()) finishPluginNativeNamespace(namespace);
			finalReceipt = receipt;
			if (hostRoot) linkHost(hostRoot);
			assertReferenceNamespaces();
			publish();
			pendingTargets.clear();
		},
		linkHost(selectedHost) {
			assertReference = createPluginNativeReferenceValidator(directory, owner?.pluginId ?? rootDir);
			linkHost(selectedHost);
			assertReferenceNamespaces(hardlinkedTargets);
			publish();
			pendingTargets.clear();
			return new Map([...files].map(([source, fact]) => [source, fact.sourceIdentity]));
		}
	};
}
//#endregion
//#region src/plugins/plugin-native-resolution.ts
function getPluginBunConditions(requireMode) {
	const conditions = /* @__PURE__ */ new Set([
		"bun",
		"node",
		"module-sync",
		requireMode ? "require" : "import"
	]);
	if (!process.execArgv.includes("--no-addons")) conditions.add("node-addons");
	for (let index = 0; index < process.execArgv.length; index += 1) {
		const argument = process.execArgv[index];
		if (argument === "--conditions") {
			const condition = process.execArgv[index + 1];
			if (condition && !condition.startsWith("-")) {
				conditions.add(condition);
				index += 1;
			}
		} else if (argument?.startsWith("--conditions=")) conditions.add(argument.slice(13));
	}
	return conditions;
}
function createPluginNativeImportPattern(imports) {
	const importKeys = imports && typeof imports === "object" ? Object.keys(imports) : [];
	return (specifier) => !importKeys.includes(specifier) && importKeys.some((key) => {
		const star = key.indexOf("*");
		return star >= 0 && star < key.length - 1 && key.lastIndexOf("*") === star && specifier.startsWith(key.slice(0, star)) && specifier.endsWith(key.slice(star + 1));
	});
}
//#endregion
//#region src/plugins/plugin-source-references.ts
function capturedPluginModuleUrl(filename, specifier, conditions) {
	const url = pathToFileURL(filename);
	if (!conditions.includes("require") && (specifier.startsWith(".") || specifier.startsWith("file:") || path.isAbsolute(specifier))) {
		const requested = new URL(specifier, url);
		url.search = requested.search;
		url.hash = requested.hash;
	}
	return url;
}
function isPackageMapError(error, code) {
	return error instanceof Error && "code" in error && error.code === code;
}
/** Package metadata selects a target before its deferred body has been captured. */
function resolvePluginPackageMapTarget(specifier, importer, conditions) {
	let selected;
	try {
		selected = moduleResolve(specifier, pathToFileURL(importer), new Set(conditions));
	} catch (error) {
		if (conditions.includes("bun") && isPackageMapError(error, "ERR_INVALID_PACKAGE_TARGET")) return;
		if (!isPackageMapError(error, "ERR_MODULE_NOT_FOUND")) throw error;
		if (typeof error.url !== "string") return;
		selected = new URL(error.url);
	}
	return selected.protocol === "file:" ? selected : void 0;
}
/** Missing physical inputs stay absent without poisoning another condition's selected target. */
function createPluginPackageMapReferences() {
	const missingTargets = /* @__PURE__ */ new Set();
	const recordMissingTarget = (filename) => {
		missingTargets.add(path.resolve(filename));
	};
	return {
		recordMissingTarget,
		hasMissingTarget: (filename) => missingTargets.has(path.resolve(filename)),
		resolveReference(specifier, importer, conditions) {
			try {
				return moduleResolve(specifier, pathToFileURL(importer), new Set(conditions)).href;
			} catch (error) {
				if (isPackageMapError(error, "ERR_MODULE_NOT_FOUND") && typeof error.url === "string") {
					const target = new URL(error.url);
					if (target.protocol === "file:") recordMissingTarget(fileURLToPath(target));
				}
				return;
			}
		}
	};
}
function staticString(node) {
	if ((node?.type === "Literal" || node?.type === "StringLiteral") && typeof node.value === "string") return node.value;
	if (node?.type === "TemplateLiteral" && node.expressions?.length === 0) return node.quasis?.[0]?.value.cooked ?? void 0;
}
/** Whether this expression receives a value, directly or through a destructuring pattern. */
function isAssignmentTarget(target) {
	let child = target;
	for (let parent = target.parentPath; parent?.node; parent = parent.parentPath) {
		switch (parent.node.type) {
			case "AssignmentExpression":
			case "AssignmentPattern":
			case "ForInStatement":
			case "ForOfStatement": return child.key === "left";
			case "UpdateExpression": return true;
			case "ObjectProperty":
				if (child.key !== "value") return false;
				break;
			case "ArrayPattern":
			case "ObjectPattern":
			case "RestElement": break;
			default: return false;
		}
		child = parent;
	}
	return false;
}
function unwrapReferenceArgument(input) {
	let argument = input;
	while (argument?.isTSAsExpression() || argument?.isTSTypeAssertion() || argument?.isTSNonNullExpression() || argument?.isTSSatisfiesExpression() || argument?.isTSInstantiationExpression()) argument = argument.get("expression");
	return argument;
}
/** Inspect authored TypeScript syntax before Jiti rewrites module operations. */
function inspectPluginTypeScriptExecutionFacts(source, sourceText, resolver) {
	let hasComputedImport = false;
	const staticImports = /* @__PURE__ */ new Map();
	const recordStaticImport = (specifier, sideEffect) => {
		staticImports.set(specifier, (staticImports.get(specifier) ?? false) || sideEffect);
	};
	resolver.transform({
		source: sourceText,
		filename: source,
		ts: true,
		async: true,
		babel: { plugins: [{ pre(file) {
			file.path.traverse({
				"ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration"(declaration) {
					const specifier = staticString(declaration.node.source);
					if (specifier !== void 0) recordStaticImport(specifier, declaration.isImportDeclaration() && declaration.node.specifiers.length === 0);
				},
				ImportExpression(expression) {
					if (staticString(expression.get("source").node) === void 0) hasComputedImport = true;
				},
				CallExpression(call) {
					const args = call.get("arguments");
					if (call.get("callee").node?.type === "Import" && staticString(unwrapReferenceArgument(args[0])?.node) === void 0) hasComputedImport = true;
				}
			});
		} }] }
	});
	return {
		hasComputedImport,
		staticImports: [...staticImports].map(([specifier, sideEffect]) => ({
			specifier,
			sideEffect
		}))
	};
}
/** Read the native factory binding before Jiti rewrites modules and import.meta. */
function isCurrentFileRequire(call) {
	const callee = call.get("callee");
	const reference = callee.isMemberExpression() && !callee.node.computed && callee.get("property").isIdentifier({ name: "resolve" }) ? callee.get("object") : callee;
	let init = reference;
	if (reference.isIdentifier() && reference.node.name) {
		const binding = reference.scope.getBinding(reference.node.name);
		if (!binding?.constant || !binding.path.isVariableDeclarator()) return false;
		init = binding.path.get("init");
	}
	if (!init.isCallExpression()) return false;
	const args = init.get("arguments");
	const anchor = args.length === 1 ? args[0] : void 0;
	if (!anchor || !(anchor.isMemberExpression() && !anchor.node.computed && anchor.get("object").node?.type === "MetaProperty" && anchor.matchesPattern("import.meta.url") || anchor.node?.type === "Identifier" && anchor.node.name === "__filename" && !anchor.scope.getBinding("__filename"))) return false;
	const factory = init.get("callee");
	return ["module", "node:module"].some((source) => factory.referencesImport(source, "createRequire") || factory.isMemberExpression() && !factory.node.computed && factory.get("property").isIdentifier({ name: "createRequire" }) && factory.get("object").referencesImport(source, "default"));
}
const TRANSFORMED_REFERENCE_NAMES = /* @__PURE__ */ new Set([
	"createRequire",
	"URL",
	"readFile",
	"readFileSync",
	"createReadStream",
	"join",
	"resolve",
	"require",
	"jitiImport",
	"jitiESMResolve",
	"__dirname"
]);
function* sourceChildren(node) {
	for (const value of Object.values(node)) for (const child of Array.isArray(value) ? value : [value]) if (child && typeof child === "object" && "type" in child) yield child;
}
function parseNativePluginJavaScript(source, sourceText) {
	if (!/\.[cm]?js$/.test(source)) return;
	let tree;
	try {
		tree = parse$1(sourceText, {
			ecmaVersion: "latest",
			sourceType: "module",
			allowAwaitOutsideFunction: true
		});
	} catch (error) {
		if (error instanceof SyntaxError) return;
		throw error;
	}
	const needsTransform = (node, exportedDeclaration = false) => {
		if (node.type === "MetaProperty") return true;
		if (node.type === "VariableDeclaration" && (node.kind === "using" || node.kind === "await using")) return true;
		if ((node.type === "ForInStatement" || node.type === "ForOfStatement") && node.left.type !== "VariableDeclaration") return true;
		const exported = node.type === "ExportSpecifier" || node.type === "ExportAllDeclaration" ? node.exported : void 0;
		if ((exported?.type === "Identifier" ? exported.name : staticString(exported)) === "__esModule" || exportedDeclaration && node.type === "Identifier" && node.name === "__esModule") return true;
		if (node.type === "Identifier" && (node.name === "require" || node.name === "__dirname")) return true;
		if (node.type === "ImportExpression" && (node.source.type !== "Literal" || typeof node.source.value !== "string" || node.options != null)) return true;
		if (node.type === "ImportDeclaration") {
			if (node.source.value === "module" || node.source.value === "node:module") return true;
			for (const specifier of node.specifiers) {
				const imported = specifier.type === "ImportSpecifier" ? specifier.imported.type === "Identifier" ? specifier.imported.name : staticString(specifier.imported) : void 0;
				if (TRANSFORMED_REFERENCE_NAMES.has(specifier.local.name) || imported !== void 0 && TRANSFORMED_REFERENCE_NAMES.has(imported)) return true;
			}
		}
		for (const child of sourceChildren(node)) if (needsTransform(child, exportedDeclaration || node.type === "ExportNamedDeclaration" && child === node.declaration)) return true;
		return false;
	};
	return needsTransform(tree) ? void 0 : tree;
}
function parseTransformedPluginSource(source, code) {
	try {
		return parse$1(code, {
			ecmaVersion: "latest",
			allowImportExportEverywhere: true,
			allowAwaitOutsideFunction: true,
			allowReturnOutsideFunction: true
		});
	} catch (error) {
		if (!(error instanceof SyntaxError)) throw error;
		throw new SyntaxError(`${source}: could not parse transformed source: ${error.message}`, { cause: error });
	}
}
/** Visit literal module and explicit asset inputs without evaluating plugin code. */
function visitPluginSourceReferences(source, sourceText, resolver, visitReference) {
	const authoredStaticImports = /* @__PURE__ */ new Set();
	const visitDirectoryAsset = (name, parts) => {
		if ((name === "join" || name === "resolve") && parts.length > 0 && parts.every((part) => part !== void 0) && (name === "join" || !parts.some((part) => path.isAbsolute(part)))) visitReference(path.join(".", ...parts), "asset");
	};
	const tree = parseNativePluginJavaScript(source, sourceText) ?? parseTransformedPluginSource(source, resolver.transform({
		source: sourceText,
		filename: source,
		ts: /\.[cm]?tsx?$/.test(source),
		async: true,
		babel: { plugins: [{
			pre(file) {
				file.path.traverse({
					ImportDeclaration(declaration) {
						if (declaration.node.importKind !== "type" && declaration.node.specifiers.length > 0 && declaration.node.specifiers.every((specifier) => specifier.type === "ImportSpecifier" && specifier.importKind === "type")) authoredStaticImports.add(declaration.node.source.value);
					},
					ExportNamedDeclaration(declaration) {
						if (declaration.node.source && declaration.node.exportKind !== "type" && declaration.node.specifiers.length > 0 && declaration.node.specifiers.every((specifier) => specifier.type === "ExportSpecifier" && specifier.exportKind === "type")) authoredStaticImports.add(declaration.node.source.value);
					},
					MemberExpression(member) {
						if (member.get("object").node?.type === "MetaProperty" && isAssignmentTarget(member)) member.replaceWith({
							type: "Identifier",
							name: "importMetaTarget"
						});
					},
					CallExpression(call) {
						const args = call.get("arguments");
						if (unwrapReferenceArgument(args[0])?.matchesPattern("import.meta.dirname")) {
							const callee = call.get("callee");
							const member = callee.isMemberExpression() ? callee.get("property") : callee;
							const name = ["join", "resolve"].find((method) => ["path", "node:path"].some((moduleName) => callee.referencesImport(moduleName, method))) ?? (member.isIdentifier() ? member.node.name : void 0) ?? "";
							visitDirectoryAsset(name, args.slice(1).map((arg) => staticString(unwrapReferenceArgument(arg)?.node)));
						}
						const specifier = staticString(unwrapReferenceArgument(args.length === 1 ? args[0] : void 0)?.node);
						if (specifier !== void 0 && isCurrentFileRequire(call)) visitReference(specifier, "require");
					}
				});
			},
			visitor: { "ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration"(declaration) {
				if (declaration.node.source) authoredStaticImports.add(declaration.node.source.value);
			} }
		}] }
	}));
	const staticImports = /* @__PURE__ */ new Set();
	for (const statement of tree.body) if ((statement.type === "ImportDeclaration" || statement.type === "ExportNamedDeclaration" || statement.type === "ExportAllDeclaration") && statement.source) {
		const reference = staticString(statement.source);
		if (reference !== void 0) {
			staticImports.add(reference);
			authoredStaticImports.add(reference);
		}
	}
	for (const reference of staticImports) visitReference(reference, "import");
	const visit = (node) => {
		if (node.type === "ImportExpression") {
			const reference = staticString(node.source);
			if (reference !== void 0) visitReference(reference, "import");
		}
		if (node.type === "CallExpression" || node.type === "NewExpression") {
			const { callee: call, arguments: args } = node;
			const callee = call.type === "SequenceExpression" ? call.expressions.at(-1) : call;
			const member = callee.type === "MemberExpression" ? callee.property : callee;
			const name = member.type === "Identifier" ? member.name : "";
			const module = callee.type === "Identifier" ? [
				"require",
				"jitiImport",
				"jitiESMResolve"
			].includes(name) : callee.type === "MemberExpression" && callee.object.type === "Identifier" && callee.object.name === "require" && name === "resolve";
			const asset = node.type === "NewExpression" && name === "URL" || [
				"readFile",
				"readFileSync",
				"createReadStream"
			].includes(name);
			const reference = staticString(args[0]);
			if ((module || asset) && reference !== void 0) visitReference(reference, module ? name === "require" || name === "resolve" ? "require" : "import" : "asset");
			if (callee.type === "MemberExpression" && args[0]?.type === "Identifier" && args[0].name === "__dirname") visitDirectoryAsset(name, args.slice(1).map(staticString));
		}
		for (const child of sourceChildren(node)) visit(child);
	};
	visit(tree);
	return authoredStaticImports;
}
//#endregion
//#region src/plugins/plugin-generation-artifact.ts
/** Capture selective entries and whole dependencies without replacing earlier file bytes. */
function capturePluginGenerationArtifact(rootDir, entryFile, execute, moduleSource, nativeRecovery, dependencyLookupBoundary) {
	const sourceCapture = createPluginSourceCapture(execute);
	const directory = sourceCapture.directory;
	const packages = /* @__PURE__ */ new Map();
	const capturedPaths = /* @__PURE__ */ new Map();
	const originalSources = /* @__PURE__ */ new Map();
	const hardlinkedSources = /* @__PURE__ */ new Set();
	const nativeAdmission = createPluginNativeAdmission(rootDir, directory, entryFile, nativeRecovery, sourceCapture.outputRoot);
	const metadataCapture = createPluginPackageMetadataCapture({
		sourceForCaptured: (filename) => originalSources.get(filename),
		packageForFile: (filename) => packageForFile(filename),
		isRetainedReference: nativeAdmission.isRetainedReference,
		resolveSource: nativeAdmission.resolvePreparedSource
	});
	const sourceAliases = {};
	const receipt = createPluginGenerationReceipt(nativeAdmission.prepared);
	const { inputs, pendingInputs, additions, capture: acquireSources, assertModuleAvailable } = sourceCapture;
	const captureAdmitted = (run) => {
		const acquired = acquireSources(run);
		nativeAdmission.finish(receipt.finish());
		return acquired;
	};
	const moduleCaptures = /* @__PURE__ */ new Map();
	const resolveDependency = createPluginDependencyResolver(dependencyLookupBoundary);
	const copyPackage = (root, entry, metadataOnly = false, executableEntry = false) => {
		const boundary = root;
		const outputRoot = sourceCapture.outputRoot && isPathInside(boundary, sourceCapture.outputRoot) ? sourceCapture.outputRoot : void 0;
		const existing = packages.get(root);
		if (existing) {
			if (!metadataOnly) existing.materialize(executableEntry ? entry : void 0);
			return existing.destination;
		}
		const packageMap = createPluginPackageMapReferences();
		const packageId = `package-${packages.size}`;
		const moduleRoot = path.join(directory, packageId, "node_modules");
		const parentName = path.basename(path.dirname(boundary));
		const sourceModuleRoot = parentName.startsWith("@") ? path.dirname(path.dirname(boundary)) : path.dirname(boundary);
		const destination = path.join(moduleRoot, parentName.startsWith("@") ? parentName : "", path.basename(boundary));
		sourceAliases[root] = destination;
		receipt.marker(`${packageId}\0`);
		const owner = {
			destination,
			capturedRoot: destination,
			sourceRoot: boundary,
			links: /* @__PURE__ */ new Set(),
			state: "metadata",
			captureTarget(filename) {
				const source = path.join(boundary, path.relative(destination, filename));
				if (!capturedPaths.has(source) && !packageMap.hasMissingTarget(source) && fs.statSync(source, { throwIfNoEntry: false })?.isFile() && (isPathInside(boundary, fs.realpathSync(source)) || nativeAdmission.isRetainedReference(source))) {
					copy(source, filename);
					scopes.captureMetadata(path.dirname(source));
				}
			},
			materialize(selectedEntry) {
				if (typeof owner.state === "object") throw owner.state.error;
				if (owner.state === "body" && !selectedEntry) return;
				owner.state = selectedEntry && owner.state !== "body" ? "entry" : "body";
				try {
					if (selectedEntry) captureFile(path.resolve(selectedEntry));
					else copy(root, destination);
					captureDependencies();
				} catch (error) {
					owner.state = { error };
					throw error;
				}
			}
		};
		packages.set(root, owner);
		const sourceLinks = createPluginSourceLinkCapture();
		const copy = createPluginGenerationFileCapture({
			boundary,
			destination,
			directory,
			outputRoot,
			capturedPaths,
			originalSources,
			hardlinkedSources,
			sourceCapture,
			sourceLinks,
			deferExternalLinks: Boolean(execute),
			nativeAdmission,
			receipt,
			onPackageMetadata(source, target) {
				metadataCapture.record(target, (manifest) => {
					for (const alias of importTargetNames(manifest.imports)) {
						if (alias === "openclaw" || alias === "@openclaw/plugin-sdk") continue;
						const dependency = resolveDependency(alias, source);
						if (dependency) linkDependency(alias, dependency, true);
					}
				});
			}
		});
		const linkDependency = (name, dependency, captureMetadataOnly = false) => {
			const captured = copyPackage(dependency.root, void 0, captureMetadataOnly);
			const lookupDirectory = isPluginPackageFile(boundary, dependency.lookupDirectory) ? path.join(destination, path.relative(boundary, dependency.lookupDirectory)) : path.join(dependency.lookupDirectory, "node_modules") === sourceModuleRoot ? path.dirname(moduleRoot) : destination;
			const link = path.join(lookupDirectory, "node_modules", name);
			packages.get(dependency.root).links.add(link);
			if (!fs.existsSync(link)) {
				fs.mkdirSync(path.dirname(link), {
					recursive: true,
					mode: 448
				});
				fs.symlinkSync(path.relative(path.dirname(link), captured), link, "junction");
				additions.add(link);
			}
		};
		const scopes = metadataCapture.createScope({
			root,
			destination,
			boundary,
			copy,
			hasSource: (source) => capturedPaths.has(source)
		});
		const references = /* @__PURE__ */ new Map();
		const getNativeScope = createPluginNativeDependencyScopes(resolveDependency, (name, dependency) => linkDependency(name, dependency, true));
		const scannedDirectories = /* @__PURE__ */ new Set();
		const captureFile = (source, options) => {
			const existingSource = capturedPaths.get(path.resolve(source));
			if (existingSource) assertModuleAvailable(existingSource);
			if (existingSource && (!/\.[cm]?[jt]sx?$/.test(source) || moduleCaptures.has(existingSource))) return;
			const target = existingSource ?? path.join(destination, path.relative(root, source));
			if (!existingSource) {
				const prepared = nativeAdmission.resolvePreparedSource(source);
				const real = fs.realpathSync(prepared?.path ?? source);
				if (!isPathInside(prepared?.boundary ?? boundary, real) && !nativeAdmission.isRetainedReference(source, real)) throw new Error("Standalone plugin input leaves its source directory");
				if (!prepared && outputRoot && isPathInside(outputRoot, real)) return;
				if (fs.statSync(real).isDirectory()) {
					if (scannedDirectories.has(real)) throw new Error("Standalone plugin input contains a directory cycle");
					scannedDirectories.add(real);
					for (const name of fs.readdirSync(real).toSorted()) if (isPluginSourceEntry(name)) captureFile(path.join(source, name), options);
					scannedDirectories.delete(real);
					return;
				}
				copy(source, target);
			}
			if (!/\.[cm]?[jt]sx?$/.test(source)) return;
			const scope = scopes.resolve(path.dirname(source));
			const prepareDependency = createPluginDependencyLookup(source, scope?.manifest, resolveDependency, linkDependency);
			const resolver = createJiti(source, {
				...options,
				fsCache: false,
				moduleCache: false,
				tryNative: false
			});
			const captureReference = (reference, kind, conditions) => {
				const module = kind !== "asset";
				const importUrl = kind === "import" && reference.startsWith(".") ? new URL(reference, pathToFileURL(source)) : void 0;
				const value = importUrl ? `./${path.relative(path.dirname(source), fileURLToPath(importUrl))}` : module && reference.startsWith("file:") ? fileURLToPath(reference) : reference;
				const resolve = (specifier) => {
					const resolved = resolver.esmResolve(specifier, {
						try: true,
						conditions: conditions ? [...conditions] : [
							"node",
							"module-sync",
							kind === "require" ? "require" : "import"
						]
					});
					if (!resolved?.startsWith("file:")) return resolved;
					const url = new URL(resolved);
					const filename = fileURLToPath(url);
					const captured = moduleSource?.(filename) ?? filename;
					url.pathname = pathToFileURL(originalSources.get(captured) ?? nativeAdmission.sourceForPrepared(captured) ?? captured).pathname;
					return url.href;
				};
				const addDependency = (name, importer = source) => {
					const imports = references.get(importer) ?? /* @__PURE__ */ new Set();
					imports.add(name);
					references.set(importer, imports);
				};
				if (module && !value.startsWith(".") && !path.isAbsolute(value)) {
					if (isBuiltin(value)) return;
					const name = packageName(value);
					const self = scope?.manifest.exports != null && scope.manifest.name === name;
					const resolved = value.startsWith("#") || self ? packageMap.resolveReference(value, source, conditions ?? [
						"node",
						"module-sync",
						kind
					]) : resolve(value);
					const input = resolved?.startsWith("file:") ? fileURLToPath(resolved) : resolved;
					if (resolver.options.tsconfigPaths && name !== "openclaw" && name !== "@openclaw/plugin-sdk" && resolved?.startsWith("file:") && input) {
						if (isPluginPackageFile(boundary, input) && (capturedPaths.has(path.resolve(input)) || isPluginPackageFile(boundary, fs.realpathSync(input)))) {
							captureFile(input, resolver.options);
							return input;
						}
						if (!isPathInside(resolveDependency(name, source)?.root ?? boundary, input)) return conditions && execute ? captureExecutableFile(input) : null;
					}
					if (!value.startsWith("#") && !self) {
						if (conditions && !resolved) return;
						addDependency(name);
						return resolved?.startsWith("file:") ? input : void 0;
					}
					if (!input || isBuiltin(input)) return;
					let external = false;
					if (!self && scope) for (const alias of scope.aliases) {
						const dependency = resolveDependency(alias, scope.source);
						if (dependency && isPathInside(dependency.root, input)) {
							if (conditions || !execute) addDependency(alias, scope.source);
							external = true;
						}
					}
					if (!external) captureFile(input, resolver.options);
					return input;
				}
				const requested = path.resolve(path.dirname(source), value);
				const lexicalBoundary = entry && !executableEntry ? path.resolve(rootDir) : root;
				const local = module && path.isAbsolute(value) && isPathInside(lexicalBoundary, requested) ? path.join(boundary, path.relative(lexicalBoundary, requested)) : requested;
				if (module && !isPathInside(boundary, local)) {
					if (!conditions || !execute) return null;
					const selected = resolve(local);
					if (!selected?.startsWith("file:")) return;
					return captureExecutableFile(fileURLToPath(selected));
				}
				if (!value || !module && path.isAbsolute(value) || !isPathInside(boundary, local) || local === boundary) return;
				if (module && path.isAbsolute(value) && path.relative(boundary, local).split(path.sep).includes("node_modules")) return;
				const fromCopy = owner.state === "body" && !sourceLinks.contains(local);
				const moduleRequest = nativeAdmission.resolvePreparedSource(local)?.path ?? (fromCopy ? path.join(destination, path.relative(root, local)) : local);
				const resolved = module ? resolve(moduleRequest) : void 0;
				if (module && !resolved) return;
				const input = resolved?.startsWith("file:") ? fileURLToPath(resolved) : resolved ?? local;
				const capturedInput = capturedPaths.has(path.resolve(input));
				const preparedInput = nativeAdmission.resolvePreparedSource(input);
				if (capturedInput || fs.existsSync(preparedInput?.path ?? input)) {
					if (module && execute && !capturedInput && !preparedInput && !isPathInside(boundary, fs.realpathSync(input))) return conditions ? captureExecutableFile(input) : null;
					captureFile(input, resolver.options);
					if (module && path.isAbsolute(value)) capturedPaths.set(requested, capturedPaths.get(path.resolve(input)));
					return input;
				}
			};
			const observed = /* @__PURE__ */ new Map();
			const captureObservedReference = (reference, kind, conditions) => {
				const key = `${kind}\0${reference}`;
				if (!observed.has(key) || conditions && execute && observed.get(key) === null) observed.set(key, captureReference(reference, kind, conditions));
				return observed.get(key) ?? void 0;
			};
			const captureModule = (specifier, conditions) => {
				const inputFilename = specifier.startsWith("file:") ? fileURLToPath(specifier) : path.isAbsolute(specifier) ? specifier : void 0;
				const known = inputFilename && capturedPaths.get(path.resolve(inputFilename));
				if (execute && known) {
					assertModuleAvailable(known);
					return { target: capturedPluginModuleUrl(known, specifier, conditions) };
				}
				const name = packageName(specifier);
				const self = scope?.manifest.exports != null && scope.manifest.name === name;
				const bare = !specifier.startsWith(".") && !path.isAbsolute(specifier) && !specifier.startsWith("file:");
				if (resolver.options.tsconfigPaths && bare && !self && !specifier.startsWith("#")) {
					const mapped = captureObservedReference(specifier, conditions.includes("require") ? "require" : "import", conditions);
					const captured = mapped && capturedPaths.get(path.resolve(mapped));
					if (captured) {
						captureDependencies();
						assertModuleAvailable(captured);
						return { target: pathToFileURL(captured) };
					}
				}
				const dependencyPrepared = prepareDependency(specifier);
				if (typeof dependencyPrepared === "boolean") return dependencyPrepared ? { retryNative: true } : void 0;
				if (dependencyPrepared === "package-map") {
					const selected = resolvePluginPackageMapTarget(specifier, target, conditions);
					if (!selected) return;
					const filename = fileURLToPath(selected);
					if (isPluginPackageFile(destination, filename)) {
						const original = path.join(boundary, path.relative(destination, filename));
						if (packageMap.hasMissingTarget(original)) return;
						if (!capturedPaths.has(original) && !fs.existsSync(original)) {
							packageMap.recordMissingTarget(original);
							return;
						}
						captureFile(original, resolver.options);
					} else packageForFile(filename)?.materialize();
					captureDependencies();
					return { retryNative: true };
				}
				const observedSource = captureObservedReference(specifier, conditions.includes("require") ? "require" : "import", conditions);
				captureDependencies();
				const captured = observedSource ? capturedPaths.get(path.resolve(observedSource)) : void 0;
				if (!captured) return;
				assertModuleAvailable(captured);
				return { target: capturedPluginModuleUrl(captured, specifier, conditions) };
			};
			const moduleCapture = {
				isNativeImportPattern: createPluginNativeImportPattern(scope?.manifest.imports),
				isRequireReference: (specifier) => observed.has(`require\0${specifier}`) && !observed.has(`import\0${specifier}`),
				prepareDependency,
				nativeScope: getNativeScope(source, scope?.manifest),
				capture: captureModule
			};
			moduleCaptures.set(target, moduleCapture);
			if (entry && !executableEntry || process.versions.bun) moduleCapture.staticImports = visitPluginSourceReferences(source, fs.readFileSync(target, "utf8"), resolver, entry && !executableEntry ? captureObservedReference : (reference, kind) => observed.set(`${kind}\0${reference}`, null));
		};
		const captureDependencies = () => {
			const manifestPath = path.join(root, "package.json");
			if (!entry && !capturedPaths.has(manifestPath)) return;
			const manifest = capturePluginDependencies({
				root,
				manifestFile: entry ? void 0 : path.join(destination, "package.json"),
				references,
				resolve: resolveDependency,
				capture: linkDependency
			});
			if (!entry) metadataCapture.setManifest(path.join(destination, "package.json"), manifest);
		};
		if (metadataOnly) {
			const manifest = capturePluginPackageMetadata(root, destination, copy, nativeAdmission.isRetainedReference, nativeAdmission.resolvePreparedSource);
			metadataCapture.setManifest(path.join(destination, "package.json"), manifest ?? null);
		} else owner.materialize(entry);
		return destination;
	};
	const captureExecutableFile = (filename) => execute?.(() => capturePluginModuleSource(filename, (root, source) => copyPackage(root, source, false, true)));
	const packageForFile = (filename) => findPluginCapturedPackage(packages, filename, directory)?.owner;
	try {
		const sourceRoot = fs.realpathSync(rootDir);
		const entry = entryFile ? fs.realpathSync(entryFile) : void 0;
		const root = copyPackage(sourceRoot, entry);
		sourceAliases[path.resolve(rootDir)] = root;
		if (entry && entryFile) {
			const alias = path.join(sourceRoot, path.relative(path.resolve(rootDir), path.resolve(entryFile)));
			capturedPaths.set(alias, capturedPaths.get(entry));
		}
		const assertSourceCurrent = () => {
			if (fs.realpathSync(rootDir) !== sourceRoot || entryFile && fs.realpathSync(entryFile) !== entry) throw new Error("Plugin source root changed after capture");
			nativeAdmission.reconcileSourceInputs(inputs);
			verifyPluginSourceInputs(inputs, inputs.keys());
		};
		const initialReceipt = receipt.finish();
		assertSourceCurrent();
		nativeAdmission.finish(initialReceipt);
		pendingInputs.clear();
		additions.clear();
		const captures = [
			moduleCaptures,
			hardlinkedSources,
			metadataCapture,
			packages
		];
		const clearCaptures = () => captures.forEach((capture) => capture.clear());
		return {
			sourceRoot,
			rootDir: root,
			sourceAliases,
			linkHost: (hostRoot) => {
				sourceCapture.linkHost(hostRoot);
				for (const [source, identity] of nativeAdmission.linkHost(hostRoot)) {
					const input = inputs.get(source);
					if (input?.native) input.identity = identity;
				}
				nativeAdmission.reconcileSourceInputs(inputs);
			},
			sourceForCaptured: (file) => originalSources.get(path.resolve(file)),
			moduleFacts: (importer) => moduleCaptures.get(importer),
			boundaryRoot: directory,
			sourceDigest: initialReceipt.sourceDigest,
			...createPluginGenerationSourceLookup({
				rootDir,
				sourceRoot,
				capturedRoot: root,
				boundaryRoot: directory,
				capturedPaths,
				hardlinkedSources,
				assertModuleAvailable,
				captureNativeRecovery: () => nativeAdmission.captureRecovery(initialReceipt, sourceAliases)
			}),
			assertSourceCurrent,
			moduleRoot: (filename) => originalSources.has(filename) ? packageForFile(filename)?.capturedRoot : void 0,
			assertModuleAvailable,
			prepareModule: (filename) => {
				const owner = packageForFile(filename);
				const source = originalSources.get(filename);
				const needsEntry = execute && source && /\.[cm]?[jt]sx?$/.test(source) && !moduleCaptures.has(filename);
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
			captureResolvedModule: createPluginResolvedModuleCapture({
				capturedPaths,
				assertModuleAvailable,
				captureAdmitted,
				captureExecutableFile,
				packages,
				directory
			}),
			dispose: () => {
				sourceCapture.dispose();
				clearCaptures();
			},
			disposeAsync: () => sourceCapture.disposeAsync().then(clearCaptures)
		};
	} catch (error) {
		sourceCapture.dispose();
		throw error;
	}
}
//#endregion
export { getPluginBunConditions as a, isPluginSourceEntry as c, visitPluginSourceReferences as i, inspectPluginTypeScriptExecutionFacts as n, nativeReferenceProgress as o, resolvePluginPackageMapTarget as r, withPluginSourceCaptureDirectory as s, capturePluginGenerationArtifact as t };
