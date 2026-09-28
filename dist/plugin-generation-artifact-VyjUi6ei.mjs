import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-DVlzzTlh.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { r as relativePluginPathInsideRootSync, t as isPathInside$1 } from "./path-safety-Cc0rrc_m.mjs";
import { n as retainPluginSourceCaptureInstance } from "./plugin-source-capture-directory-DMhuTSdY.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { moduleResolve } from "import-meta-resolve";
import { parse as parse$1 } from "acorn";
//#region src/plugins/plugin-instance-error.ts
/** A retired instance cannot admit a fresh invocation. */
var PluginInstanceUnavailableError = class extends Error {
	constructor(pluginId) {
		super(pluginId ? `Plugin ${pluginId} was reloaded or disabled; use its current tools.` : "Plugin tools changed during automation setup; use the current plugin runtime.");
		this.name = "PluginInstanceUnavailableError";
	}
};
const PluginSourceRecoveryUnavailableError = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceRecoveryUnavailableError"), () => class SourceRecoveryUnavailableError extends Error {
	constructor(cause) {
		super("Captured plugin source is missing; its previous code cannot be recovered.", { cause });
		this.name = "PluginSourceRecoveryUnavailableError";
	}
});
const PluginInstanceDrainTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceDrainTimeoutError"), () => class DrainTimeoutError extends Error {
	constructor(message, settled, options, forcedRetirement) {
		super(message, options);
		this.settled = settled;
		this.forcedRetirement = forcedRetirement;
		this.name = "PluginInstanceDrainTimeoutError";
	}
});
//#endregion
//#region src/plugins/plugin-package-metadata-capture.ts
function createPluginSourceLinkCapture() {
	const links = /* @__PURE__ */ new Set();
	return {
		defer(filename, root) {
			if (!fs.lstatSync(filename).isSymbolicLink() || isPathInside(root, fs.realpathSync(filename))) return false;
			links.add(filename);
			return true;
		},
		contains: (filename) => [...links].some((link) => isPathInside(link, filename))
	};
}
const pluginSourceStatIdentity = (stat) => `${stat.dev}:${stat.ino}:${stat.mode}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`;
function readPluginSourceBytes(source, boundary) {
	const opened = openRootFileSync({
		absolutePath: source,
		rootPath: boundary,
		boundaryLabel: "plugin build source",
		rejectHardlinks: false
	});
	if (!opened.ok) throw new Error(`Cannot capture plugin source ${source}`, { cause: opened.error });
	try {
		return fs.readFileSync(opened.fd);
	} finally {
		fs.closeSync(opened.fd);
	}
}
const pluginSourceContentHash = (content) => createHash("sha256").update(Array.isArray(content) ? JSON.stringify(content) : content).digest("hex");
function verifyPluginSourceInputs(inputs, sources) {
	for (const source of sources) {
		const input = inputs.get(source);
		if (fs.realpathSync(source) !== source || pluginSourceStatIdentity(fs.statSync(source, { bigint: true })) !== input.identity || pluginSourceContentHash(input.directory ? fs.readdirSync(source).toSorted() : readPluginSourceBytes(source, input.boundary)) !== input.contentHash) throw new Error("Plugin source changed while preparing its reload; retry after the edit finishes.");
	}
}
function createPluginDependencyResolver() {
	const roots = /* @__PURE__ */ new Map();
	return (name, importer) => {
		const key = `${path.dirname(importer)}\0${name}`;
		if (roots.has(key)) return roots.get(key);
		for (const nodeModules of createRequire(importer).resolve.paths(`${name}/`) ?? []) {
			const candidate = path.join(nodeModules, name);
			if (fs.existsSync(path.join(candidate, "package.json"))) {
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
			if (!params.manifestFile || name in (manifest.optionalDependencies ?? {}) || name in (manifest.peerDependencies ?? {})) continue;
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
function capturePluginPackageMetadata(root, destination, copy) {
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
			if (isPathInside(root, filename) && fs.statSync(filename, { throwIfNoEntry: false })?.isFile() && isPathInside(root, fs.realpathSync(filename))) {
				copy(filename, path.join(destination, path.relative(root, filename)));
				break;
			}
		}
	}
	return data;
}
const packageName = (specifier) => specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
const importTargetNames = (value) => {
	if (typeof value === "string") return value && !value.startsWith(".") && !value.startsWith("#") && !path.isAbsolute(value) && !isBuiltin(value) ? [packageName(value)] : [];
	return value && typeof value === "object" ? Object.values(value).flatMap(importTargetNames) : [];
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
		const stat = fs.statSync(source, { throwIfNoEntry: false });
		if (!stat) return;
		const real = fs.realpathSync(source);
		if (!isPathInside(params.boundary, real)) return;
		if (stat.isDirectory()) {
			if (!matcher) return;
			if (ancestors.has(real)) throw new Error(`Plugin source contains a directory cycle: ${source}`);
			ancestors.add(real);
			for (const name of fs.readdirSync(source).toSorted()) visit(path.join(source, name));
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
				if (hasSource(source) || fs.existsSync(source)) {
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
		if (created) fs.rmSync(created, {
			recursive: true,
			force: true
		});
		instance?.release();
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
			fs.rmSync(directory, {
				recursive: true,
				force: true
			});
			instance?.release();
		},
		async disposeAsync() {
			beginDisposal();
			await fs$1.rm(directory, {
				recursive: true,
				force: true
			});
			await instance?.releaseAsync();
		}
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
function createRecoverySourceDisposal(recovery) {
	return {
		dispose: () => recovery.dispose(),
		disposeAsync: () => recovery.disposeAsync()
	};
}
function captureRecoverySource({ rootDir, sourceRoot, capturedRoot, boundaryRoot, capturedPaths }) {
	const recovery = createPluginSourceCapture();
	try {
		fs.cpSync(boundaryRoot, recovery.directory, {
			recursive: true,
			verbatimSymlinks: true
		});
		const relocate = (filename) => path.join(recovery.directory, path.relative(boundaryRoot, filename));
		for (const captured of new Set(capturedPaths.values())) fs.lstatSync(relocate(captured));
		const sources = new Map(Array.from(capturedPaths, ([source, captured]) => [source, relocate(captured)]));
		return {
			rootDir: relocate(capturedRoot),
			resolve: createRecoverySourceResolver(rootDir, sourceRoot, sources),
			...createRecoverySourceDisposal(recovery)
		};
	} catch (error) {
		recovery.dispose();
		if (hasErrnoCode(error, "ENOENT")) throw new PluginSourceRecoveryUnavailableError(error);
		throw error;
	}
}
/** Resolves captured source identities and gives recovery its own copy of their bytes. */
function createPluginGenerationSourceLookup({ rootDir, sourceRoot, capturedRoot, boundaryRoot, capturedPaths, hardlinkedSources, assertModuleAvailable }) {
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
		captureRecoverySource: () => captureRecoverySource({
			rootDir,
			sourceRoot,
			capturedRoot,
			boundaryRoot,
			capturedPaths
		})
	};
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
function staticString(node) {
	if ((node?.type === "Literal" || node?.type === "StringLiteral") && typeof node.value === "string") return node.value;
	if (node?.type === "TemplateLiteral" && node.expressions?.length === 0) return node.quasis?.[0]?.value.cooked ?? void 0;
}
function unwrapReferenceArgument(input) {
	let argument = input;
	while (argument && [
		"TSAsExpression",
		"TSTypeAssertion",
		"TSNonNullExpression",
		"TSSatisfiesExpression",
		"TSInstantiationExpression"
	].includes(argument.node?.type ?? "")) argument = argument.get("expression");
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
				ImportDeclaration(declaration) {
					const specifier = staticString(declaration.get("source").node);
					if (specifier !== void 0) recordStaticImport(specifier, declaration.node?.specifiers?.length === 0);
				},
				ExportNamedDeclaration(declaration) {
					const specifier = staticString(declaration.get("source").node);
					if (specifier !== void 0) recordStaticImport(specifier, false);
				},
				ExportAllDeclaration(declaration) {
					const specifier = staticString(declaration.get("source").node);
					if (specifier !== void 0) recordStaticImport(specifier, false);
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
	const reference = callee.node?.type === "MemberExpression" && !callee.node.computed && callee.get("property").node?.name === "resolve" ? callee.get("object") : callee;
	let init = reference;
	if (reference.node?.type === "Identifier" && reference.node.name) {
		const binding = reference.scope.getBinding(reference.node.name);
		if (!binding?.constant || binding.path.node?.type !== "VariableDeclarator") return false;
		init = binding.path.get("init");
	}
	if (init.node?.type !== "CallExpression") return false;
	const args = init.get("arguments");
	const anchor = args.length === 1 ? args[0] : void 0;
	if (!anchor || !(anchor.node?.type === "MemberExpression" && !anchor.node.computed && anchor.get("object").node?.type === "MetaProperty" && anchor.matchesPattern("import.meta.url") || anchor.node?.type === "Identifier" && anchor.node.name === "__filename" && !anchor.scope.getBinding("__filename"))) return false;
	const factory = init.get("callee");
	return ["module", "node:module"].some((source) => factory.referencesImport(source, "createRequire") || factory.node?.type === "MemberExpression" && !factory.node.computed && factory.get("property").node?.name === "createRequire" && factory.get("object").referencesImport(source, "default"));
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
		for (const value of Object.values(node)) if (Array.isArray(value)) {
			for (const child of value) if (child && typeof child === "object" && "type" in child && needsTransform(child, exportedDeclaration || node.type === "ExportNamedDeclaration" && child === node.declaration)) return true;
		} else if (value && typeof value === "object" && "type" in value && needsTransform(value, exportedDeclaration || node.type === "ExportNamedDeclaration" && value === node.declaration)) return true;
		return false;
	};
	return needsTransform(tree) ? void 0 : tree;
}
/** Visit literal module and explicit asset inputs without evaluating plugin code. */
function visitPluginSourceReferences(source, sourceText, resolver, visitReference) {
	const visitDirectoryAsset = (name, parts) => {
		if ((name === "join" || name === "resolve") && parts.length > 0 && parts.every((part) => part !== void 0) && (name === "join" || !parts.some((part) => path.isAbsolute(part)))) visitReference(path.join(".", ...parts), "asset");
	};
	const tree = parseNativePluginJavaScript(source, sourceText) ?? parse$1(resolver.transform({
		source: sourceText,
		filename: source,
		ts: /\.[cm]?tsx?$/.test(source),
		async: true,
		babel: { plugins: [{ pre(file) {
			file.path.traverse({ CallExpression(call) {
				const args = call.get("arguments");
				if (unwrapReferenceArgument(args[0])?.matchesPattern("import.meta.dirname")) {
					const callee = call.get("callee");
					const member = callee.node?.type === "MemberExpression" ? callee.get("property") : callee;
					const name = ["join", "resolve"].find((method) => ["path", "node:path"].some((moduleName) => callee.referencesImport(moduleName, method))) ?? member.node?.name ?? "";
					visitDirectoryAsset(name, args.slice(1).map((arg) => staticString(unwrapReferenceArgument(arg)?.node)));
				}
				const specifier = staticString(unwrapReferenceArgument(args.length === 1 ? args[0] : void 0)?.node);
				if (specifier !== void 0 && isCurrentFileRequire(call)) visitReference(specifier, "require");
			} });
		} }] }
	}), {
		ecmaVersion: "latest",
		allowImportExportEverywhere: true,
		allowAwaitOutsideFunction: true,
		allowReturnOutsideFunction: true
	});
	const staticImports = /* @__PURE__ */ new Set();
	for (const statement of tree.body) if ((statement.type === "ImportDeclaration" || statement.type === "ExportNamedDeclaration" || statement.type === "ExportAllDeclaration") && statement.source) {
		const reference = staticString(statement.source);
		if (reference !== void 0) staticImports.add(reference);
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
		for (const value of Object.values(node)) if (Array.isArray(value)) {
			for (const child of value) if (child && typeof child === "object" && "type" in child) visit(child);
		} else if (value && typeof value === "object" && "type" in value) visit(value);
	};
	visit(tree);
}
//#endregion
//#region src/plugins/plugin-generation-artifact.ts
/** Capture selective entries and whole dependencies without replacing earlier file bytes. */
function capturePluginGenerationArtifact(rootDir, entryFile, execute, moduleSource) {
	const sourceCapture = createPluginSourceCapture(execute);
	const directory = sourceCapture.directory;
	const packages = /* @__PURE__ */ new Map();
	const capturedPaths = /* @__PURE__ */ new Map();
	const originalSources = /* @__PURE__ */ new Map();
	const hardlinkedSources = /* @__PURE__ */ new Set();
	const metadataCapture = createPluginPackageMetadataCapture({
		sourceForCaptured: (filename) => originalSources.get(filename),
		packageForFile: (filename) => packageForFile(filename)
	});
	const sourceAliases = {};
	const digest = createHash("sha256");
	const { inputs, pendingInputs, additions, capture: captureAdmitted, assertModuleAvailable } = sourceCapture;
	const moduleCaptures = /* @__PURE__ */ new Map();
	const resolveDependency = createPluginDependencyResolver();
	const copyPackage = (root, entry, metadataOnly = false, executableEntry = false) => {
		const boundary = root;
		const outputRoot = sourceCapture.outputRoot && isPathInside(boundary, sourceCapture.outputRoot) ? sourceCapture.outputRoot : void 0;
		const existing = packages.get(root);
		if (existing) {
			if (!metadataOnly) existing.materialize(executableEntry ? entry : void 0);
			return existing.destination;
		}
		const packageId = `package-${packages.size}`;
		const moduleRoot = path.join(directory, packageId, "node_modules");
		const parentName = path.basename(path.dirname(boundary));
		const sourceModuleRoot = parentName.startsWith("@") ? path.dirname(path.dirname(boundary)) : path.dirname(boundary);
		const destination = path.join(moduleRoot, parentName.startsWith("@") ? parentName : "", path.basename(boundary));
		const capturedBoundary = destination;
		sourceAliases[root] = destination;
		digest.update(packageId).update("\0");
		const owner = {
			destination,
			capturedRoot: capturedBoundary,
			sourceRoot: boundary,
			links: /* @__PURE__ */ new Set(),
			state: "metadata",
			captureTarget(filename) {
				const source = path.join(boundary, path.relative(capturedBoundary, filename));
				if (!capturedPaths.has(source) && fs.statSync(source, { throwIfNoEntry: false })?.isFile() && isPathInside(boundary, fs.realpathSync(source))) {
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
		const ancestors = /* @__PURE__ */ new Set();
		const sourceLinks = createPluginSourceLinkCapture();
		const copy = (source, target) => {
			if (capturedPaths.get(path.resolve(source)) === target) return;
			const real = fs.realpathSync(source);
			if (!isPathInside(boundary, real)) throw new Error(`Plugin source link leaves its package: ${path.relative(root, source)}. Declare shared code as a package dependency.`);
			if (outputRoot && isPathInside(outputRoot, real)) return;
			const stat = fs.statSync(real, { bigint: true });
			const captured = capturedPaths.get(real);
			const recordContent = (content) => {
				if (!captured) {
					inputs.set(real, {
						identity: pluginSourceStatIdentity(stat),
						contentHash: pluginSourceContentHash(content),
						directory: stat.isDirectory(),
						boundary
					});
					pendingInputs.add(real);
				}
			};
			capturedPaths.set(path.resolve(source), target);
			originalSources.set(target, path.resolve(source));
			capturedPaths.set(target, target);
			if (!capturedPaths.has(real)) capturedPaths.set(real, target);
			digest.update(stat.isDirectory() ? "directory\0" : "file\0").update(path.relative(destination, target)).update("\0");
			if (stat.isDirectory()) {
				if (ancestors.has(real)) throw new Error(`Plugin source contains a directory cycle: ${source}`);
				ancestors.add(real);
				fs.mkdirSync(target, {
					recursive: true,
					mode: 448
				});
				const names = fs.readdirSync(real).toSorted();
				recordContent(names);
				for (const name of names) if (name !== "node_modules" && name !== ".git" && !(execute && sourceLinks.defer(path.join(source, name), boundary))) copy(path.join(source, name), path.join(target, name));
				ancestors.delete(real);
			} else if (stat.isFile()) {
				if (stat.nlink > 1n) hardlinkedSources.add(target);
				let bytes;
				fs.mkdirSync(path.dirname(target), {
					recursive: true,
					mode: 448
				});
				if (captured) {
					bytes = fs.readFileSync(captured);
					fs.copyFileSync(captured, target);
				} else {
					bytes = readPluginSourceBytes(real, boundary);
					fs.writeFileSync(target, bytes, { mode: 384 | Number(stat.mode & 64n) });
				}
				recordContent(bytes);
				digest.update(String(bytes.length)).update("\0").update(bytes);
				additions.add(target);
				if (path.basename(target) === "package.json") metadataCapture.record(target, (manifest) => {
					for (const alias of importTargetNames(manifest.imports)) {
						if (alias === "openclaw" || alias === "@openclaw/plugin-sdk") continue;
						const dependency = resolveDependency(alias, source);
						if (dependency) linkDependency(alias, dependency, true);
					}
				});
			} else throw new Error(`Plugin build input is not a regular file: ${source}`);
		};
		const linkDependency = (name, dependency, captureMetadataOnly = false) => {
			const captured = copyPackage(dependency.root, void 0, captureMetadataOnly);
			const lookupDirectory = isPluginPackageFile(boundary, dependency.lookupDirectory) ? path.join(capturedBoundary, path.relative(boundary, dependency.lookupDirectory)) : path.join(dependency.lookupDirectory, "node_modules") === sourceModuleRoot ? path.dirname(moduleRoot) : capturedBoundary;
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
			if (existingSource && (!/\.[cm]?[jt]sx?$/.test(source) || moduleCaptures.has(existingSource))) return;
			const target = existingSource ?? path.join(destination, path.relative(root, source));
			if (!existingSource) {
				const real = fs.realpathSync(source);
				if (!isPathInside(boundary, real)) throw new Error("Standalone plugin input leaves its source directory");
				if (outputRoot && isPathInside(outputRoot, real)) return;
				if (fs.statSync(source).isDirectory()) {
					if (scannedDirectories.has(real)) throw new Error("Standalone plugin input contains a directory cycle");
					scannedDirectories.add(real);
					for (const name of fs.readdirSync(source).toSorted()) if (name !== "node_modules" && name !== ".git") captureFile(path.join(source, name), options);
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
						conditions: conditions ? [...conditions] : kind === "require" ? ["node", "require"] : ["node", "import"]
					});
					if (!resolved?.startsWith("file:")) return resolved;
					const url = new URL(resolved);
					const filename = fileURLToPath(url);
					const captured = moduleSource?.(filename) ?? filename;
					url.pathname = pathToFileURL(originalSources.get(captured) ?? captured).pathname;
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
					const resolved = resolve(value);
					const input = resolved?.startsWith("file:") ? fileURLToPath(resolved) : resolved;
					if (resolver.options.tsconfigPaths && name !== "openclaw" && name !== "@openclaw/plugin-sdk" && resolved?.startsWith("file:") && input) {
						if (isPluginPackageFile(boundary, input) && (capturedPaths.has(path.resolve(input)) || isPluginPackageFile(boundary, fs.realpathSync(input)))) {
							captureFile(input, resolver.options);
							return input;
						}
						if (!isPathInside(resolveDependency(name, source)?.root ?? boundary, input)) return conditions && execute ? captureExecutableFile(input) : null;
					}
					const self = scope?.manifest.exports != null && scope.manifest.name === name;
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
							addDependency(alias, scope.source);
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
				const moduleRequest = owner.state === "body" && !sourceLinks.contains(local) ? path.join(destination, path.relative(root, local)) : local;
				const resolved = module ? resolve(moduleRequest) : void 0;
				if (module && !resolved) return;
				const input = resolved?.startsWith("file:") ? fileURLToPath(resolved) : resolved ?? local;
				const capturedInput = capturedPaths.has(path.resolve(input));
				if (capturedInput || fs.existsSync(input)) {
					if (module && execute && !capturedInput && !isPathInside(boundary, fs.realpathSync(input))) return conditions ? captureExecutableFile(input) : null;
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
				if (execute && known) return { target: capturedPluginModuleUrl(known, specifier, conditions) };
				const name = packageName(specifier);
				const self = scope?.manifest.exports != null && scope.manifest.name === name;
				const bare = !specifier.startsWith(".") && !path.isAbsolute(specifier) && !specifier.startsWith("file:");
				if (resolver.options.tsconfigPaths && bare && !self && !specifier.startsWith("#")) {
					const mapped = captureObservedReference(specifier, conditions.includes("require") ? "require" : "import", conditions);
					if (mapped && capturedPaths.has(path.resolve(mapped))) {
						captureDependencies();
						return { target: pathToFileURL(capturedPaths.get(path.resolve(mapped))) };
					}
				}
				const dependencyPrepared = prepareDependency(specifier);
				if (typeof dependencyPrepared === "boolean") return dependencyPrepared ? { retryNative: true } : void 0;
				if (dependencyPrepared === "package-map") {
					let selected;
					try {
						selected = moduleResolve(specifier, pathToFileURL(target), new Set(conditions));
					} catch (error) {
						if (!(error instanceof Error) || !("code" in error) || error.code !== "ERR_MODULE_NOT_FOUND") throw error;
						if (!("url" in error) || typeof error.url !== "string") return;
						selected = new URL(error.url);
					}
					if (selected.protocol !== "file:") return;
					const filename = fileURLToPath(selected);
					if (isPluginPackageFile(capturedBoundary, filename)) {
						const original = path.join(boundary, path.relative(capturedBoundary, filename));
						if (!capturedPaths.has(original) && !fs.existsSync(original)) return;
						captureFile(original, resolver.options);
					} else packageForFile(filename)?.materialize();
					captureDependencies();
					return { retryNative: true };
				}
				const observedSource = captureObservedReference(specifier, conditions.includes("require") ? "require" : "import", conditions);
				captureDependencies();
				const captured = observedSource ? capturedPaths.get(path.resolve(observedSource)) : void 0;
				if (!captured) return;
				return { target: capturedPluginModuleUrl(captured, specifier, conditions) };
			};
			const nativeScope = getNativeScope(source, scope?.manifest);
			moduleCaptures.set(target, {
				prepareDependency,
				nativeScope,
				capture: captureModule
			});
			if (entry && !executableEntry) visitPluginSourceReferences(source, fs.readFileSync(target, "utf8"), resolver, captureObservedReference);
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
			const manifest = capturePluginPackageMetadata(root, destination, copy);
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
			verifyPluginSourceInputs(inputs, inputs.keys());
		};
		assertSourceCurrent();
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
			linkHost: sourceCapture.linkHost,
			sourceForCaptured: (file) => originalSources.get(path.resolve(file)),
			boundaryRoot: directory,
			sourceDigest: digest.copy().digest("hex"),
			...createPluginGenerationSourceLookup({
				rootDir,
				sourceRoot,
				capturedRoot: root,
				boundaryRoot: directory,
				capturedPaths,
				hardlinkedSources,
				assertModuleAvailable
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
			captureResolvedModule: (filename) => {
				const known = capturedPaths.get(path.resolve(filename));
				if (known) {
					assertModuleAvailable(known);
					return known;
				}
				return captureAdmitted(() => {
					const captured = findPluginCapturedPackage(packages, filename, directory);
					const original = captured ? path.join(captured.owner.sourceRoot, path.relative(captured.root, filename)) : filename;
					const source = captureExecutableFile(original);
					const target = source ? capturedPaths.get(source) : void 0;
					if (target) capturedPaths.set(path.resolve(filename), target);
					return target;
				}).value;
			},
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
export { PluginInstanceDrainTimeoutError as a, withPluginSourceCaptureDirectory as i, inspectPluginTypeScriptExecutionFacts as n, PluginInstanceUnavailableError as o, visitPluginSourceReferences as r, PluginSourceRecoveryUnavailableError as s, capturePluginGenerationArtifact as t };
