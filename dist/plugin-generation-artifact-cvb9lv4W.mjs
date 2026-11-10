import { A as PluginDependencyLinkError, c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as isPluginSourceCaptureRetained, s as retainPluginNativeCapturePath, t as createPluginNativeCaptureRoot } from "./plugin-source-capture-directory-uZgzXzIf.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import { c as snapshotOwners, l as startNativeAdmissionPublication, n as nativeAdmissionStateFor, o as retainNativePath } from "./plugin-native-admission-state-COqSwm4O.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { C as createPluginPackageMetadataCapture, D as isPluginPackageFile, E as importTargetNames, F as pluginSourceIdentityChangedOnlyByCtime, I as pluginSourceStatIdentity, M as hashPluginSourceFile, N as isPluginNativeExecutable, O as packageName, P as isPluginSourceEntry, S as createPluginNativeDependencyScopes, T as findPluginCapturedPackage, _ as pluginNativeNamespaceMemberPath, b as capturePluginPackageMetadata, c as linkPluginNativeReference, d as capturePluginNativeDirectoryAliases, f as capturePluginNativeNamespace, g as pluginNativeNamespaceIsCurrent, h as pluginNativeNamespaceDirectory, i as createPluginSourceFacts, j as copyPluginSourceFile, k as resolvePluginModulePackageRoot, m as pluginNativeNamespaceBoundary, n as createPluginGenerationModuleLookup, o as admitPluginNativeRecoveryReference, p as finishPluginNativeNamespace, r as createPluginGenerationSourceLookup, s as createPluginNativeReferenceValidator, t as createPluginGenerationCapture, u as assertPluginNativeNamespaceHost, v as pluginNativeNamespaceMemberRelativePath, w as createPluginSourceCapture, x as createPluginDependencyLookup, y as capturePluginDependencies } from "./plugin-generation-source-lookup-CdHM-XG_.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { createRootFileCopyBatchSync, createRootFileOpenBatchSync } from "@openclaw/fs-safe/advanced";
import { moduleResolve } from "import-meta-resolve";
//#region src/plugins/plugin-capture-resolution.ts
const javascriptExtension = /\.(c|m)?j(sx?)$/;
const nativeJitiModule = /node_modules\/(?:typescript|jiti)\//;
function typescriptSibling(source, specifier, options) {
	if (!path.isAbsolute(specifier) || !javascriptExtension.test(specifier) || options.tsconfigPaths || Object.keys(options.alias ?? {}).length || options.nativeModules?.length || nativeJitiModule.test(specifier.replaceAll("\\", "/")) || fs.existsSync(specifier)) return;
	try {
		const candidate = specifier.replace(javascriptExtension, ".$1t$2");
		const extensions = options.extensions ?? [];
		const firstAdditional = extensions.find((extension) => extension !== ".js");
		if (!firstAdditional || !fs.statSync(candidate, { throwIfNoEntry: false })?.isFile()) return;
		const require = createRequire(source);
		const nativeExtensions = Object.keys(require.extensions);
		if ([
			...extensions,
			...nativeExtensions,
			...nativeExtensions.map((ext) => firstAdditional + ext)
		].some((extension) => fs.existsSync(specifier + extension))) return;
		return require.resolve(candidate);
	} catch {
		return;
	}
}
/** Resolution state belongs to one capture, never to evaluated plugin modules. */
function createPluginCaptureResolver(options) {
	let shared;
	const scoped = /* @__PURE__ */ new Map();
	const get = (source, parentSensitive = false) => {
		if (!shared) {
			shared = createJiti(source, {
				...options,
				fsCache: false,
				moduleCache: false,
				tryNative: false
			});
			scoped.set(shared.options.tsconfigPaths ? source : path.dirname(source), shared);
		}
		if (!shared.options.tsconfigPaths && !parentSensitive) return shared;
		const key = shared.options.tsconfigPaths ? source : path.dirname(source);
		let resolver = scoped.get(key);
		if (!resolver) {
			resolver = createJiti(source, shared.options);
			scoped.set(key, resolver);
		}
		return resolver;
	};
	return {
		get,
		clear() {
			shared = void 0;
			scoped.clear();
		},
		resolve(source, reference, conditions) {
			const resolverOptions = get(source).options;
			const configured = Boolean(resolverOptions.tsconfigPaths || Object.keys(resolverOptions.alias ?? {}).length || resolverOptions.nativeModules?.length || nativeJitiModule.test(source.replaceAll("\\", "/")));
			const specifier = !configured && reference.startsWith(".") && !/[?#]/.test(reference) ? path.resolve(path.dirname(source), reference) : reference;
			const resolver = get(source, configured || !path.isAbsolute(specifier));
			return resolver.esmResolve(typescriptSibling(source, specifier, resolver.options) ?? specifier, {
				try: true,
				parentURL: pathToFileURL(source),
				conditions: [...conditions]
			});
		}
	};
}
//#endregion
//#region src/plugins/plugin-source-verification.ts
function readPluginSourceDirectory(source) {
	return fs.readdirSync(source).filter(isPluginSourceEntry).toSorted();
}
//#endregion
//#region src/plugins/plugin-generation-file-capture.ts
/** Publish only verified dependency links; real nested installs keep their own bytes. */
function linkPluginGenerationDependency(link, target) {
	const entry = fs.lstatSync(link, { throwIfNoEntry: false });
	if (entry && !entry.isSymbolicLink()) return false;
	if (entry && path.resolve(path.dirname(link), fs.readlinkSync(link)) === target && fs.statSync(link, { throwIfNoEntry: false })) return false;
	fs.mkdirSync(path.dirname(link), {
		recursive: true,
		mode: 448
	});
	if (process.platform === "win32") {
		if (entry) {
			if (!fs.lstatSync(link).isSymbolicLink()) throw new Error(`Dependency link became a real entry: ${link}`);
			fs.unlinkSync(link);
		}
		fs.symlinkSync(target, link, "junction");
	} else {
		const staged = `${link}.${randomUUID()}.tmp`;
		try {
			fs.symlinkSync(path.relative(path.dirname(link), target), staged, "junction");
			fs.renameSync(staged, link);
		} finally {
			fs.rmSync(staged, { force: true });
		}
	}
	if (!fs.lstatSync(link).isSymbolicLink() || fs.realpathSync(link) !== fs.realpathSync(target)) throw new Error(`Dependency link does not resolve to its captured target: ${link}`);
	if (entry) process.emitWarning(`Replacing plugin dependency link ${link}`);
	return true;
}
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
function createPluginGenerationFileCapture({ boundary, destination, directory, outputRoot, capturedPaths, originalSources, hardlinkedSources, sourceCapture, sourceLinks, deferExternalLinks, nativeAdmission, receipt, retained, sourceFacts, onPackageMetadata }) {
	const { additions } = sourceCapture;
	const ancestors = /* @__PURE__ */ new Set();
	const copy = (source, target, copyFile, openFile, realParent) => {
		if (capturedPaths.get(path.resolve(source)) === target) return;
		const prepared = nativeAdmission.resolvePreparedSource(source);
		const input = prepared?.path ?? source;
		const inputBoundary = prepared?.boundary ?? boundary;
		const entry = !prepared && realParent ? fs.lstatSync(input, { bigint: true }) : void 0;
		const ordinary = entry && !entry.isSymbolicLink();
		const real = ordinary ? path.join(realParent, path.basename(input)) : fs.realpathSync(input);
		const retainedNative = nativeAdmission.isRetainedReference(source, real);
		if (!isPathInside(inputBoundary, real) && !retainedNative) throw new Error(`Plugin source link leaves its package: ${path.relative(boundary, source)}. Declare shared code as a package dependency.`);
		if (!prepared && outputRoot && isPathInside(outputRoot, real)) return;
		const stat = ordinary ? entry : fs.statSync(real, { bigint: true });
		const captured = capturedPaths.get(real);
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
			for (const name of readPluginSourceDirectory(real)) if (!(deferExternalLinks && !nativeAdmission.isRetainedReference(path.join(source, name)) && sourceLinks.defer(path.join(input, name), inputBoundary, path.join(source, name)))) copy(path.join(source, name), path.join(target, name), copyFile, openFile, real);
			ancestors.delete(real);
		} else if (stat.isFile()) {
			if (stat.nlink > 1n) hardlinkedSources.add(target);
			if (!realParent) fs.mkdirSync(path.dirname(target), {
				recursive: true,
				mode: 448
			});
			additions.add(target);
			const retainedFile = retained?.files.get(path.relative(directory, target));
			const retainedReference = retained?.source.native?.references.has(target);
			if (retainedReference) fs.unlinkSync(target);
			const native = nativeAdmission.materialize(real, inputBoundary, target, stat, source);
			let copiedContent;
			if (!native && retainedFile && !retainedReference) copiedContent = retainedFile;
			else if (!native) copiedContent = copyPluginSourceFile(captured ?? real, captured ? directory : inputBoundary, target, {
				hashCopiedContent: true,
				copyFile,
				openFile,
				...captured ? { preserveSourceMode: true } : {}
			});
			receipt.file({
				target: native?.path ?? target,
				boundary: native?.boundary ?? directory,
				sizeBytes: Number(stat.size),
				native: native !== void 0,
				prepared: native?.content ?? copiedContent,
				onContent: (content) => {
					native?.record(content);
					sourceFacts?.set(path.relative(directory, target), content);
				}
			}, openFile);
			if (path.basename(target) === "package.json") onPackageMetadata(source, target);
		} else throw new Error(`Plugin build input is not a regular file: ${source}`);
	};
	return (source, target) => {
		try {
			var _usingCtx$2 = _usingCtx();
			const batch = _usingCtx$2.u(createRootFileCopyBatchSync());
			const opened = _usingCtx$2.u(createRootFileOpenBatchSync());
			return copy(source, target, batch.copyFile.bind(batch), opened.openFile.bind(opened));
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			_usingCtx$2.d();
		}
	};
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
	const readContent = (file, receipt, expected = file.content, openFile) => {
		const content = hashPluginSourceFile(file.target, file.boundary, receipt, file.native ? file.content : void 0, openFile);
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
		file(params, openFile) {
			const { prepared: content, ...input } = params;
			const file = input;
			if (content) {
				if (finished && !file.native) readContent(file, void 0, content, openFile);
				else publishContent(file, content);
			} else if (!file.native || finished) readContent(file, void 0, void 0, openFile);
			if (!finished) events.push(file);
		},
		finish() {
			try {
				var _usingCtx$1 = _usingCtx();
				if (finished) return finished;
				const signature = inputSignature();
				const receipt = signature !== void 0 && prepared?.signature === signature ? void 0 : createHash("sha256");
				const opened = _usingCtx$1.u(createRootFileOpenBatchSync());
				const openFile = opened.openFile.bind(opened);
				for (const event of events) if (typeof event === "string") receipt?.update(event);
				else if (receipt || !event.content || !event.native) readContent(event, receipt, event.content, openFile);
				finished = {
					signature: signature ?? inputSignature(),
					sourceDigest: receipt ? receipt.digest("hex") : prepared.sourceDigest
				};
				events.length = 0;
				return finished;
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}
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
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
		fork(relocate = (source) => source) {
			if (disposed) throw new Error("Plugin native recovery has been disposed");
			return createNativeRecovery(receipt, new Map([...references].map(([source, fact]) => [relocate(source), { ...fact }])), structuredClone(namespaces), new Map([...directories].map(([source, namespace]) => [relocate(source), namespace])), roots);
		},
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
function createPluginNativeAdmission(rootDir, directory, entryFiles, recovery, outputRoot) {
	recovery?.retain(getPluginCache());
	const state = nativeAdmissionStateFor();
	const entryKey = entryFiles?.length === 1 ? path.resolve(entryFiles[0]) : entryFiles && JSON.stringify(entryFiles.map((file) => path.resolve(file)));
	const key = `${path.resolve(rootDir)}\0${entryKey ?? ""}`;
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
			copyOnly: state.captureStorage.placement === "temporary",
			previous,
			retainedRoot,
			managedRoots: [...state.managedRoots.keys()],
			capturedRoot: root.directory,
			outputRoot,
			inspectionRoots: [.../* @__PURE__ */ new Set([boundary, ...owner ? [owner.rootDir] : []])],
			inspectedFiles: [
				owner?.source,
				owner?.setupSource,
				...entryFiles ?? []
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
			if (owner?.source === logicalSource || owner?.setupSource === logicalSource || entryFiles?.includes(logicalSource)) return;
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
			refreshReference(fact, source, target);
			files.set(logicalSource, fact);
			targets.set(target, logicalSource);
			return {
				fact,
				path: fact.capturedPath,
				boundary: pluginNativeNamespaceBoundary(namespace),
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
let parser;
function parse$1(...args) {
	if (!parser) {
		const entry = moduleResolve("acorn", new URL(import.meta.url), /* @__PURE__ */ new Set(["node", "import"]));
		parser = createRequire(import.meta.url)(fileURLToPath(entry));
	}
	return parser.parse(...args);
}
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
					"ImportDeclaration|ExportNamedDeclaration"(declaration) {
						const node = declaration.node;
						if (node.source && (node.type === "ImportDeclaration" ? node.importKind : node.exportKind) !== "type" && node.specifiers.length > 0 && node.specifiers.every((specifier) => specifier.type === "ImportSpecifier" && specifier.importKind === "type" || specifier.type === "ExportSpecifier" && specifier.exportKind === "type")) authoredStaticImports.add(node.source.value);
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
const capturePluginGenerationArtifact = createPluginGenerationCapture(createPluginGenerationArtifact);
function createPluginGenerationArtifact(rootDir, entryFile, execute, moduleSource, nativeRecovery, dependencyLookupBoundary, retained, captureForCustody = false) {
	const entryFiles = typeof entryFile === "string" ? [entryFile] : entryFile && [...entryFile];
	if (entryFiles?.length === 0) throw new Error("Selective plugin capture requires at least one entry");
	const sourceCapture = retained?.source.sourceCapture ?? createPluginSourceCapture();
	const directory = sourceCapture.directory;
	const packages = /* @__PURE__ */ new Map();
	const packageForFile = (filename) => findPluginCapturedPackage(packages, filename, directory)?.owner;
	const capturedPaths = /* @__PURE__ */ new Map();
	const originalSources = /* @__PURE__ */ new Map();
	const hardlinkedSources = /* @__PURE__ */ new Set();
	const nativeAdmission = createPluginNativeAdmission(rootDir, directory, entryFiles, nativeRecovery, sourceCapture.outputRoot);
	const metadataCapture = createPluginPackageMetadataCapture({
		sourceForCaptured: (filename) => originalSources.get(filename),
		packageForFile,
		isRetainedReference: nativeAdmission.isRetainedReference,
		resolveSource: nativeAdmission.resolvePreparedSource
	});
	const sourceAliases = {};
	const sourceFacts = createPluginSourceFacts(dependencyLookupBoundary, captureForCustody);
	const receipt = createPluginGenerationReceipt(nativeAdmission.prepared);
	const { additions, capture: acquireSources, assertModuleAvailable } = sourceCapture;
	const captureAdmitted = (run) => {
		const acquired = execute ? execute(() => acquireSources(run)) : acquireSources(run);
		nativeAdmission.finish(receipt.finish());
		return acquired;
	};
	const moduleCaptures = /* @__PURE__ */ new Map();
	const resolution = createPluginCaptureResolver();
	const resolveDependency = sourceFacts.resolveDependency;
	const copyPackage = (root, entry, metadataOnly = false, executableEntry = false) => {
		const boundary = root;
		const outputRoot = sourceCapture.outputRoot && isPathInside(boundary, sourceCapture.outputRoot) ? sourceCapture.outputRoot : void 0;
		const existing = packages.get(root);
		if (existing) {
			if (!metadataOnly) existing.materialize(executableEntry ? entry : void 0);
			return existing.capturedRoot;
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
			retained,
			sourceFacts: sourceFacts.files,
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
			const dependencyPackage = packages.get(dependency.root);
			dependencyPackage.links.add(link);
			try {
				if (linkPluginGenerationDependency(link, captured)) additions.add(link);
			} catch (cause) {
				const error = new PluginDependencyLinkError(`Cannot prepare dependency ${name} for plugin ${rootDir}; check filesystem permissions and retry.`, { cause });
				dependencyPackage.state = { error };
				additions.add(link);
				throw error;
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
		const captureFile = (source) => {
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
					for (const name of fs.readdirSync(real).toSorted()) if (isPluginSourceEntry(name)) captureFile(path.join(source, name));
					scannedDirectories.delete(real);
					return;
				}
				copy(source, target);
			}
			if (!/\.[cm]?[jt]sx?$/.test(source)) return;
			const scope = scopes.resolve(path.dirname(source));
			const prepareDependency = createPluginDependencyLookup(source, scope?.manifest, resolveDependency, linkDependency);
			const resolver = resolution.get(source);
			const captureReference = (reference, kind, conditions) => {
				const module = kind !== "asset";
				const importUrl = kind === "import" && reference.startsWith(".") ? new URL(reference, pathToFileURL(source)) : void 0;
				const value = importUrl ? `./${path.relative(path.dirname(source), fileURLToPath(importUrl))}` : module && reference.startsWith("file:") ? fileURLToPath(reference) : reference;
				const resolve = (specifier) => {
					const resolved = resolution.resolve(source, specifier, conditions ?? [
						"node",
						"module-sync",
						kind === "require" ? "require" : "import"
					]);
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
							captureFile(input);
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
					if (!external) captureFile(input);
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
					captureFile(input);
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
						captureFile(original);
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
	const captureExecutableFile = (filename) => execute?.(() => {
		const real = fs.realpathSync(filename);
		if (!fs.statSync(real).isFile()) return;
		copyPackage(resolvePluginModulePackageRoot(real), real, false, true);
		return real;
	});
	try {
		const sourceRoot = fs.realpathSync(rootDir);
		const entries = entryFiles?.map((file) => fs.realpathSync(file));
		const root = copyPackage(sourceRoot, entries?.[0]);
		for (const entry of entries?.slice(1) ?? []) packages.get(sourceRoot).materialize(entry);
		sourceAliases[path.resolve(rootDir)] = root;
		for (const [index, entry] of entries?.entries() ?? []) {
			const alias = path.join(sourceRoot, path.relative(path.resolve(rootDir), path.resolve(entryFiles[index])));
			capturedPaths.set(alias, capturedPaths.get(entry));
		}
		const initialReceipt = receipt.finish();
		nativeAdmission.finish(initialReceipt);
		additions.clear();
		const captures = [
			moduleCaptures,
			hardlinkedSources,
			metadataCapture,
			packages,
			resolution
		];
		const clearCaptures = () => captures.forEach((capture) => capture.clear());
		const sourceLookup = createPluginGenerationSourceLookup({
			rootDir,
			sourceRoot,
			capturedRoot: root,
			boundaryRoot: directory,
			capturedPaths,
			hardlinkedSources,
			assertModuleAvailable,
			captureNativeRecovery: () => nativeAdmission.captureRecovery(initialReceipt, sourceAliases)
		});
		return {
			sourceRoot,
			rootDir: root,
			sourceAliases,
			linkHost: (hostRoot) => {
				sourceCapture.linkHost(hostRoot);
				nativeAdmission.linkHost(hostRoot);
			},
			sourceDigest: initialReceipt.sourceDigest,
			...sourceLookup,
			retainSourceCustody: () => sourceFacts.captureCustody(sourceLookup.captureRecoverySource),
			...createPluginGenerationModuleLookup({
				capturedPaths,
				originalSources,
				moduleCaptures,
				metadataCapture,
				assertModuleAvailable,
				captureAdmitted,
				captureExecutableFile,
				executable: Boolean(execute),
				packages,
				directory
			}),
			dispose: () => {
				(retained?.source ?? sourceCapture).dispose();
				clearCaptures();
			},
			disposeAsync: () => (retained?.source ?? sourceCapture).disposeAsync().then(clearCaptures)
		};
	} catch (error) {
		(retained?.source ?? sourceCapture).dispose();
		throw error;
	}
}
//#endregion
export { getPluginBunConditions as a, visitPluginSourceReferences as i, inspectPluginTypeScriptExecutionFacts as n, resolvePluginPackageMapTarget as r, capturePluginGenerationArtifact as t };
