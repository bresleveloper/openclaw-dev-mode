import { c as isRecord$1 } from "./record-coerce-DItp3I4t.mjs";
import { r as PACKAGE_LIFECYCLE_PENDING_RELATIVE_PATH, t as LEGACY_PACKAGE_INSTALL_GUARD_RELATIVE_PATH } from "./package-lifecycle-marker-DhfhzqrA.mjs";
import { D as walkDirectory, w as root } from "./fs-safe-BAPek8At.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as collectPackageDistInventory, t as PACKAGE_DIST_INVENTORY_RELATIVE_PATH } from "./package-dist-inventory-DV_9aVsG.mjs";
import { a as compareWorkerBundlePaths, o as hashWorkerBundleManifest } from "./worker-bundle-hash-6Zw7Auqb.mjs";
import { n as MAX_WORKER_BUNDLE_ARCHIVE_BYTES, t as DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS } from "./worker-bundle-limits-CF239rpc.mjs";
import { n as readWorkerBundleArchiveManifest } from "./worker-bundle-archive-BV6ehv7l.mjs";
import { createRequire } from "node:module";
import fs, { constants, createWriteStream } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path, { isAbsolute, join, win32 } from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
import { satisfies, valid } from "semver";
import { finished, pipeline } from "node:stream/promises";
import * as tar from "tar";
//#region scripts/lib/record-shared.mjs
/**
* Return whether a value is a plain non-array object record.
* @param {unknown} value
* @returns {value is Record<string, unknown>}
*/
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
//#region scripts/lib/package-bundled-mcp.mts
const PATCHED_MCP_NAME = "chrome-devtools-mcp";
const PATCHED_MCP_VERSION = "1.8.0";
const PATCHED_MCP_CLI = "build/src/bin/chrome-devtools-mcp.js";
const REQUIRED_MCP_FILE_HASHES = /* @__PURE__ */ new Map([
	[PATCHED_MCP_CLI, "9f380d06e1ac05b257e27e708c0cc4b4ba190e285ed6eb6c8aa50978d98a12c5"],
	["build/src/bin/chrome-devtools-mcp-main.js", "fc383cb3e5db5f18cf1e8c49221212c669825248874ba91c90ba9035e175f5b4"],
	["LICENSE", "58d1e17ffe5109a7ae296caafcadfdbe6a7d176f0bc4ab01e12a689b0499d8bd"],
	["build/src/third_party/THIRD_PARTY_NOTICES", "8f10277934fe6888173f41f7cbbd9112d208c8c931bf163db59110f69f119e53"],
	["build/src/TextSnapshot.js", "299833ad0e4cfc171a417afaec41df594e4862fe53a7ada6ba160409f979788b"],
	["build/src/McpPage.js", "b9e791d758e4d28589525e2d427600e24b271d365a5879893a392043a11cf426"],
	["build/src/third_party/index.js", "a8f5cb1e02405d347117114141b58572f71c083861fb50ab31a27511e3a279bf"],
	["build/src/OPENCLAW_PATCH_NOTICE.md", "8f5a32aaedf4bb6f8ad39f226bd343bf804132c11ebc6c3c19f667669856287c"]
]);
const REQUIRED_MCP_FILES = [
	"build/src/third_party/devtools-formatter-worker.js",
	"build/src/third_party/devtools-heap-snapshot-worker.js",
	"build/src/third_party/lighthouse-devtools-mcp-bundle.js",
	"build/src/third_party/bundled-packages.json"
];
/** The published MCP bundles contain optional UMD/BiDi imports; exact patches and assets own their artifact contract. */
function collectPatchedMcpArtifactErrors({ manifest, files, sha256 }) {
	const errors = [];
	if (!isRecord(manifest) || manifest.version !== "1.8.0" || manifest.type !== "module") errors.push(`bundled ${PATCHED_MCP_NAME} must be ESM version ${PATCHED_MCP_VERSION}`);
	if (!isRecord(manifest) || !isRecord(manifest.bin) || manifest.bin["chrome-devtools-mcp"] !== `./build/src/bin/chrome-devtools-mcp.js`) errors.push(`bundled ${PATCHED_MCP_NAME} must expose CLI ${PATCHED_MCP_CLI}`);
	for (const file of [...REQUIRED_MCP_FILES, ...REQUIRED_MCP_FILE_HASHES.keys()]) {
		if (!files.has(file)) {
			errors.push(`bundled ${PATCHED_MCP_NAME} is missing required runtime entry ${file}`);
			continue;
		}
		const expectedHash = REQUIRED_MCP_FILE_HASHES.get(file);
		if (expectedHash && sha256(file) !== expectedHash) errors.push(`bundled ${PATCHED_MCP_NAME} has unpatched or changed runtime entry ${file}`);
	}
	if (![...files].some((entry) => entry.startsWith("build/src/third_party/issue-descriptions/") && entry.endsWith(".md"))) errors.push(`bundled ${PATCHED_MCP_NAME} is missing third-party issue descriptions`);
	return errors;
}
createRequire(import.meta.url);
/** Visit static and dynamic module specifiers in a parsed TypeScript source file. */
function visitModuleSpecifiers(ts, sourceFile, visit, options = {}) {
	function walk(node) {
		let kind;
		let specifierNode;
		if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
			kind = "import";
			specifierNode = node.moduleSpecifier;
		} else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
			kind = "export";
			specifierNode = node.moduleSpecifier;
		} else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length >= 1 && ts.isStringLiteralLike(node.arguments[0])) {
			kind = "dynamic-import";
			specifierNode = node.arguments[0];
		} else if (options.includeImportTypes && ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
			kind = "dynamic-import";
			specifierNode = node.argument.literal;
		} else if (options.includeCommonJs && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "require" && node.arguments.length >= 1 && ts.isStringLiteralLike(node.arguments[0])) {
			kind = "commonjs-require";
			specifierNode = node.arguments[0];
		} else if (options.includeCommonJs && ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && ts.isStringLiteralLike(node.moduleReference.expression)) {
			kind = "commonjs-require";
			specifierNode = node.moduleReference.expression;
		} else if (options.includeImportMetaUrl && ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "URL" && node.arguments?.length >= 2 && ts.isStringLiteralLike(node.arguments[0]) && ts.isPropertyAccessExpression(node.arguments[1]) && node.arguments[1].name.text === "url" && ts.isMetaProperty(node.arguments[1].expression) && node.arguments[1].expression.keywordToken === ts.SyntaxKind.ImportKeyword && node.arguments[1].expression.name.text === "meta") {
			kind = "import-meta-url";
			specifierNode = node.arguments[0];
		}
		if (specifierNode) visit({
			kind,
			node,
			specifier: specifierNode.text,
			specifierNode
		});
		ts.forEachChild(node, walk);
	}
	walk(sourceFile);
}
//#endregion
//#region scripts/lib/package-dist-imports.mjs
const ts = createRequire(import.meta.url)("typescript");
const JS_FILE_RE = /\.(?:cjs|js|mjs)$/u;
function normalizePackagePath(value) {
	return value.replace(/\\/gu, "/").replace(/^package\//u, "");
}
function stripSpecifierSuffix(value) {
	return value.replace(/[?#].*$/u, "");
}
function hasJavaScriptFileExtension(value) {
	return /\.(?:cjs|js|mjs)$/u.test(path.posix.basename(stripSpecifierSuffix(value)));
}
function appendImportEdges(source, importerPath, imports) {
	const sourceFile = ts.createSourceFile(importerPath, source, {
		languageVersion: ts.ScriptTarget.Latest,
		jsDocParsingMode: ts.JSDocParsingMode.ParseNone
	}, false, ts.ScriptKind.JS);
	visitModuleSpecifiers(ts, sourceFile, ({ kind, specifier }) => {
		if (!specifier.startsWith(".") || kind === "import-meta-url" && !hasJavaScriptFileExtension(specifier)) return;
		const importedPath = path.posix.normalize(path.posix.join(path.posix.dirname(importerPath), stripSpecifierSuffix(specifier)));
		if (kind === "import-meta-url" && importerPath === "dist/managed-handoff-runtime.mjs" && importedPath === "dist/node_modules/koffi/indirect.cjs") return;
		if (kind !== "import-meta-url" || importedPath.startsWith("dist/")) imports.push({
			importerPath,
			importedPath
		});
	}, {
		includeCommonJs: true,
		includeImportMetaUrl: true
	});
}
/** Collect missing-file errors for relative imports inside package files. */
function collectPackageDistImportErrors(params) {
	const files = [...new Set(params.files.map(normalizePackagePath))];
	const fileSet = new Set(files);
	const errors = [];
	const imports = params.imports ?? collectPackageDistImports({
		files,
		readText: params.readText
	});
	for (const { importerPath, importedPath } of imports) if (!fileSet.has(importedPath)) errors.push(`${importerPath} imports missing ${importedPath}`);
	return errors;
}
/** Collect relative dist import edges from package JavaScript files. */
function collectPackageDistImports(params) {
	const files = params.files.length === 1 ? [normalizePackagePath(params.files[0])] : [...new Set(params.files.map(normalizePackagePath))].toSorted((left, right) => left.localeCompare(right));
	const imports = [];
	for (const importerPath of files) {
		if (!JS_FILE_RE.test(importerPath) || /(?:^|\/)node_modules\//u.test(importerPath)) continue;
		appendImportEdges(params.readText(importerPath), importerPath, imports);
	}
	return imports;
}
//#endregion
//#region scripts/package-source-dependencies.mjs
const PRIVATE_WORKSPACE_VERSION = "0.0.0-private";
function dependenciesRecord(value, label) {
	if (value === void 0) return {};
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} dependencies must be an object when present`);
	return value;
}
function validateBundledPackageDependencyAlignment({ bundledDependencies, bundledPackageLabel, rootDependencies, rootPackageLabel = "root package.json" }) {
	const bundled = dependenciesRecord(bundledDependencies, bundledPackageLabel);
	const root = dependenciesRecord(rootDependencies, rootPackageLabel);
	const aligned = [];
	for (const [name, version] of Object.entries(bundled)) {
		if (typeof version !== "string") throw new Error(`${bundledPackageLabel} dependency ${name} must declare a string version`);
		if (version === PRIVATE_WORKSPACE_VERSION) continue;
		const rootVersion = root[name];
		if (rootVersion !== void 0 && typeof rootVersion !== "string") throw new Error(`${rootPackageLabel} dependency ${name} must declare a string version`);
		if (rootVersion !== version && rootVersion !== `workspace:${version}`) throw new Error(`${rootPackageLabel} must declare ${name}@${version} to bundle ${bundledPackageLabel} without duplicate dependencies`);
		aligned.push([name, version]);
	}
	return aligned;
}
//#endregion
//#region src/infra/package-plugin-composition.ts
/** Shared dependency ownership for release packages and private node distributions. */
function composePackagePlugins(packageJson, plugins) {
	const composed = structuredClone(packageJson);
	for (const { id, packageJson: plugin } of plugins) for (const section of ["dependencies", "optionalDependencies"]) {
		const dependencies = plugin[section] ?? {};
		for (const [name, spec] of Object.entries(dependencies)) if (valid(spec) !== spec) throw new Error(`Selected plugin ${id} requires an exact dependency pin: ${name}@${spec}`);
		for (const existing of [composed.dependencies, composed.optionalDependencies]) validateBundledPackageDependencyAlignment({
			bundledDependencies: dependencies,
			bundledPackageLabel: `selected plugin ${id}`,
			rootDependencies: {
				...dependencies,
				...existing
			}
		});
		composed[section] = {
			...composed[section],
			...dependencies
		};
	}
	for (const name of Object.keys(composed.dependencies ?? {})) delete composed.optionalDependencies?.[name];
	for (const { id, packageJson: plugin } of plugins) for (const [name, range] of Object.entries(plugin.peerDependencies ?? {})) {
		const version = name === composed.name ? composed.version : composed.dependencies?.[name] ?? composed.optionalDependencies?.[name];
		if (!version && !plugin.peerDependenciesMeta?.[name]?.optional || version && !satisfies(version, range)) throw new Error(`Selected plugin ${id} requires peer ${name}@${range} in the distribution`);
	}
	const exclusions = new Set(plugins.map(({ id }) => `!dist/extensions/${id}/**`));
	if (composed.files) composed.files = composed.files.filter((entry) => !exclusions.has(entry));
	return composed;
}
//#endregion
//#region src/gateway/worker-environments/node-bootstrap-prebuilt.ts
/** Deployment-owned input; never write or remove this file in the running installation. */
const NODE_BOOTSTRAP_PREBUILT_ARCHIVE = "node-runtime.tgz";
async function copyNodeBootstrapPrebuiltArchive(packageRoot, temporaryRoot) {
	if (process.platform === "win32") return;
	const tarballPath = path.join(temporaryRoot, NODE_BOOTSTRAP_PREBUILT_ARCHIVE);
	const source = await root(packageRoot, {
		symlinks: "reject",
		hardlinks: "allow",
		nonBlockingRead: true
	});
	const destination = await root(temporaryRoot);
	try {
		await destination.copyIn(NODE_BOOTSTRAP_PREBUILT_ARCHIVE, {
			root: source,
			relativePath: NODE_BOOTSTRAP_PREBUILT_ARCHIVE
		}, {
			maxBytes: MAX_WORKER_BUNDLE_ARCHIVE_BYTES,
			overwrite: false,
			durable: false,
			mode: 384
		});
		return await readWorkerBundleArchiveManifest(tarballPath, DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS);
	} catch {
		await fs$1.rm(tarballPath, { force: true });
		return;
	}
}
//#endregion
//#region src/infra/package-root-imports.ts
const require = createRequire(import.meta.url);
const namespaces = /* @__PURE__ */ new Map([
	["node:module", "module"],
	["module", "module"],
	["node:process", "process"],
	["process", "process"],
	["node:path", "path"],
	["path", "path"],
	["node:fs", "fs"],
	["fs", "fs"],
	["node:fs/promises", "fs-promises"],
	["fs/promises", "fs-promises"]
]);
const members = /* @__PURE__ */ new Map([
	["module", /* @__PURE__ */ new Map([["createRequire", "factory"]])],
	["process", /* @__PURE__ */ new Map([
		["getBuiltinModule", "builtin"],
		["cwd", "cwd"],
		["chdir", "chdir"]
	])],
	["path", /* @__PURE__ */ new Map([["join", "join"], ["resolve", "resolve"]])],
	["fs", /* @__PURE__ */ new Map([["realpathSync", "realpath"], ["promises", "fs-promises"]])],
	["fs-promises", /* @__PURE__ */ new Map([["realpath", "realpath-async"]])]
]);
const ambient = /* @__PURE__ */ new Map([
	["require", "root"],
	["__filename", "location"],
	["process", "process"]
]);
const loaders = /* @__PURE__ */ new Set([
	"root",
	"caller",
	"unlocated"
]);
const snapshotsKinds = /* @__PURE__ */ new Set([
	"caller-path",
	"caller-string",
	"caller",
	"root"
]);
const callerValues = /* @__PURE__ */ new Set([
	"input",
	"caller-path",
	"caller-string"
]);
const pathValues = /* @__PURE__ */ new Set([
	...callerValues,
	"literal",
	"relative"
]);
const readableValues = /* @__PURE__ */ new Set([
	...pathValues,
	"module",
	"process",
	"path",
	"fs",
	"fs-promises",
	"scalar"
]);
const pureCalls = /* @__PURE__ */ new Set([
	"factory",
	"builtin",
	"join",
	"resolve",
	"realpath",
	"realpath-async",
	"cwd"
]);
function union(...values) {
	const result = [...new Set(values.flat())];
	return result.length ? result : ["unknown"];
}
/** Read dependency ownership without resolving or executing the inspected package. */
function collectPackageRootImports(source) {
	const ts = require("typescript");
	const file = ts.createSourceFile("dist.js", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
	const imports = [];
	const recordImport = (specifier) => {
		imports.push(specifier);
	};
	const calls = [];
	const scopes = [file];
	const assignments = [];
	const cwdReferences = [];
	const snapshots = /* @__PURE__ */ new Map();
	let changedCwd = false;
	let checker;
	function symbolAt(node) {
		checker ??= ts.createProgram([file.fileName], {
			allowJs: true,
			noLib: true,
			noResolve: true
		}, {
			getSourceFile: (name) => name === file.fileName ? file : void 0,
			getDefaultLibFileName: () => "",
			writeFile: () => {},
			getCurrentDirectory: () => "",
			getCanonicalFileName: (name) => name,
			useCaseSensitiveFileNames: () => true,
			getNewLine: () => "\n",
			fileExists: (name) => name === file.fileName,
			readFile: (name) => name === file.fileName ? source : void 0
		}).getTypeChecker();
		return ts.isShorthandPropertyAssignment(node.parent) && node.parent.name === node ? checker.getShorthandAssignmentValueSymbol(node.parent) : checker.getSymbolAtLocation(node);
	}
	function literal(node) {
		let value = node;
		while (value && ts.isParenthesizedExpression(value)) value = value.expression;
		return value && ts.isStringLiteral(value) ? value.text : void 0;
	}
	function property(node) {
		return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : ts.isComputedPropertyName(node) ? literal(node.expression) : void 0;
	}
	const logical = /* @__PURE__ */ new Set([
		ts.SyntaxKind.BarBarToken,
		ts.SyntaxKind.AmpersandAmpersandToken,
		ts.SyntaxKind.QuestionQuestionToken,
		ts.SyntaxKind.BarBarEqualsToken,
		ts.SyntaxKind.AmpersandAmpersandEqualsToken,
		ts.SyntaxKind.QuestionQuestionEqualsToken
	]);
	function recordWrite(node, value) {
		if (ts.isIdentifier(node)) assignments.push([node, value]);
		else if (ts.isParenthesizedExpression(node)) recordWrite(node.expression, value);
		else if (ts.isPropertyAssignment(node)) recordWrite(node.initializer);
		else if (ts.isShorthandPropertyAssignment(node) || ts.isBindingElement(node)) recordWrite(node.name);
		else if (ts.isBinaryExpression(node)) recordWrite(node.left);
		else if (!ts.isPropertyAccessExpression(node) && !ts.isElementAccessExpression(node)) ts.forEachChild(node, (child) => recordWrite(child));
	}
	const pending = [file];
	let hasLoader = false;
	while (pending.length) {
		const node = pending.pop();
		if ((ts.isIdentifier(node) || ts.isStringLiteral(node)) && [
			"require",
			"createRequire",
			"getBuiltinModule"
		].includes(node.text)) hasLoader = true;
		if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
			const specifier = literal(node.moduleSpecifier);
			if (specifier !== void 0) recordImport(specifier);
		}
		if (ts.isCallExpression(node)) {
			const specifier = literal(node.arguments[0]);
			if (node.expression.kind === ts.SyntaxKind.ImportKeyword && specifier !== void 0) recordImport(specifier);
			else calls.push(node);
		}
		if (ts.isFunctionLike(node) && "body" in node && node.body) scopes.push(node);
		if (ts.isBinaryExpression(node) && node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && node.operatorToken.kind <= ts.SyntaxKind.LastAssignment) recordWrite(node.left, node.right);
		if ((ts.isForOfStatement(node) || ts.isForInStatement(node)) && !ts.isVariableDeclarationList(node.initializer)) recordWrite(node.initializer);
		if (ts.isPropertyAccessExpression(node) && node.name.text === "chdir" || ts.isElementAccessExpression(node) && literal(node.argumentExpression) === "chdir" || (ts.isImportSpecifier(node) || ts.isBindingElement(node)) && property(node.propertyName ?? node.name) === "chdir") cwdReferences.push(node);
		ts.forEachChild(node, (child) => {
			pending.push(child);
		});
	}
	if (!hasLoader) return imports;
	const writes = /* @__PURE__ */ new Map();
	for (const [name, value] of assignments) {
		const symbol = symbolAt(name);
		if (symbol) writes.set(symbol, [...writes.get(symbol) ?? [], value]);
	}
	function memberOrigins(owners, name) {
		return union(owners.map((owner) => owner === "input" ? "input" : name === void 0 ? "unknown" : members.get(owner)?.get(name) ?? "unknown"));
	}
	function origins(expression, seen = /* @__PURE__ */ new Set(), inputScope, awaited = false) {
		if (ts.isParenthesizedExpression(expression)) return origins(expression.expression, seen, inputScope, awaited);
		if (ts.isAwaitExpression(expression)) return origins(expression.expression, seen, inputScope, true);
		if (ts.isStringLiteralLike(expression)) return [isAbsolute(expression.text) || win32.isAbsolute(expression.text) || URL.canParse(expression.text) ? "literal" : "relative"];
		if (ts.isNumericLiteral(expression) || [
			ts.SyntaxKind.TrueKeyword,
			ts.SyntaxKind.FalseKeyword,
			ts.SyntaxKind.NullKeyword
		].includes(expression.kind)) return ["literal"];
		if (ts.isConditionalExpression(expression)) return union(origins(expression.whenTrue, new Set(seen), inputScope), origins(expression.whenFalse, new Set(seen), inputScope));
		if (ts.isBinaryExpression(expression)) {
			const op = expression.operatorToken.kind;
			if (op === ts.SyntaxKind.EqualsToken || op === ts.SyntaxKind.CommaToken) return origins(expression.right, seen, inputScope);
			const values = union(origins(expression.left, new Set(seen), inputScope), origins(expression.right, new Set(seen), inputScope));
			if (logical.has(op)) return values;
			if (op === ts.SyntaxKind.PlusToken && values.some((value) => callerValues.has(value)) && values.every((value) => pathValues.has(value))) return ["caller-string"];
			return ["scalar"];
		}
		if (ts.isIdentifier(expression)) {
			const symbol = symbolAt(expression);
			if (!symbol?.declarations?.length) return [ambient.get(expression.text) ?? "unknown"];
			const snapshot = snapshots.get(symbol);
			if (snapshot) return snapshot;
			if (seen.has(symbol)) return ["unknown"];
			seen.add(symbol);
			const entryParameter = symbol.declarations.some((declaration) => ts.isParameter(declaration) && ts.findAncestor(declaration.parent, ts.isFunctionLike) === inputScope);
			return union(...symbol.declarations.map((declaration) => declarationOrigins(declaration, new Set(seen), inputScope)), ...(entryParameter ? [] : writes.get(symbol) ?? []).map((value) => value ? origins(value, new Set(seen), inputScope) : ["unknown"]));
		}
		if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
			const name = ts.isPropertyAccessExpression(expression) ? expression.name.text : literal(expression.argumentExpression);
			if (name === "url" && ts.isMetaProperty(expression.expression) && expression.expression.keywordToken === ts.SyntaxKind.ImportKeyword) return ["location"];
			return memberOrigins(origins(expression.expression, seen, inputScope), name);
		}
		if (ts.isCallExpression(expression)) {
			const specifier = literal(expression.arguments[0]);
			const namespace = specifier === void 0 ? void 0 : namespaces.get(specifier);
			if (expression.expression.kind === ts.SyntaxKind.ImportKeyword) return [namespace ?? "unknown"];
			const locations = expression.arguments.map((value) => origins(value, new Set(seen), inputScope));
			return union(...origins(expression.expression, new Set(seen), inputScope).map((loader) => {
				if (loader === "factory") return (locations[0] ?? ["unknown"]).map((location) => location === "location" ? "root" : callerValues.has(location) ? "caller" : "unlocated");
				if (loaders.has(loader) || loader === "builtin") return [namespace ?? "unknown"];
				if (loader === "cwd") return [inputScope && !changedCwd ? "caller-path" : "scalar"];
				if (loader === "realpath-async" && !awaited) return ["unknown"];
				if (loader === "resolve" || (loader === "realpath" || loader === "realpath-async") && expression.arguments.length === 1) {
					const values = loader === "resolve" ? locations.flat() : locations[0] ?? ["unknown"];
					return [!changedCwd && values.every((value) => [
						"input",
						"caller-path",
						"caller-string",
						"relative"
					].includes(value)) && (inputScope || values.includes("caller-path")) && (inputScope || !values.includes("caller-string")) ? "caller-path" : "scalar"];
				}
				if (loader === "join") {
					const values = locations.flat();
					if (values.every((value) => pathValues.has(value)) && values.some((value) => callerValues.has(value))) return [locations[0]?.every((value) => value === "caller-path") ? "caller-path" : "caller-string"];
					return ["scalar"];
				}
				return ["unknown"];
			}));
		}
		return ["unknown"];
	}
	function declarationOrigins(declaration, seen, inputScope) {
		if (ts.isParameter(declaration)) {
			const input = inputScope && ts.findAncestor(declaration.parent, ts.isFunctionLike) === inputScope ? "input" : "unknown";
			const initial = declaration.initializer ? origins(declaration.initializer, seen, inputScope) : [];
			return union([input], declaration.initializer && !ts.isIdentifier(declaration.name) ? ["unknown"] : initial);
		}
		if (ts.isBindingElement(declaration)) {
			let owner = declaration;
			const defaults = [];
			while (ts.isBindingElement(owner) || ts.isObjectBindingPattern(owner) || ts.isArrayBindingPattern(owner)) {
				if (ts.isBindingElement(owner) && owner.initializer) defaults.push(owner === declaration ? origins(owner.initializer, new Set(seen), inputScope) : ["unknown"]);
				owner = owner.parent;
			}
			const incoming = ts.isParameter(owner) ? declarationOrigins(owner, new Set(seen), inputScope) : ts.isVariableDeclaration(owner) && owner.initializer ? origins(owner.initializer, new Set(seen), inputScope) : ["unknown"];
			const name = property(declaration.propertyName ?? declaration.name);
			return union(ts.isParameter(owner) ? incoming : ts.isObjectBindingPattern(declaration.parent) && declaration.parent.parent === owner && name !== void 0 ? memberOrigins(incoming, name) : ["unknown"], ...defaults, !ts.isParameter(owner) && !(ts.getCombinedNodeFlags(declaration) & ts.NodeFlags.Const) ? ["unknown"] : []);
		}
		if (ts.isVariableDeclaration(declaration) && declaration.initializer) return union(origins(declaration.initializer, seen, inputScope), ts.getCombinedNodeFlags(declaration) & ts.NodeFlags.Const ? [] : ["unknown"]);
		if (ts.isImportSpecifier(declaration) || ts.isNamespaceImport(declaration) || ts.isImportClause(declaration)) {
			const owner = ts.findAncestor(declaration, ts.isImportDeclaration);
			const namespace = owner && ts.isStringLiteral(owner.moduleSpecifier) ? namespaces.get(owner.moduleSpecifier.text) : void 0;
			if (namespace) return ts.isImportSpecifier(declaration) ? memberOrigins([namespace], (declaration.propertyName ?? declaration.name).text) : [namespace];
		}
		return ["unknown"];
	}
	function pure(node, scope) {
		if (ts.isIdentifier(node)) return Boolean(symbolAt(node)) || ambient.has(node.text) || node.text === "undefined";
		if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node) || [
			ts.SyntaxKind.TrueKeyword,
			ts.SyntaxKind.FalseKeyword,
			ts.SyntaxKind.NullKeyword
		].includes(node.kind)) return true;
		if (ts.isParenthesizedExpression(node)) return pure(node.expression, scope);
		if (ts.isBinaryExpression(node)) return logical.has(node.operatorToken.kind) && node.operatorToken.kind < ts.SyntaxKind.FirstAssignment && pure(node.left, scope) && pure(node.right, scope);
		if (ts.isConditionalExpression(node)) return pure(node.condition, scope) && pure(node.whenTrue, scope) && pure(node.whenFalse, scope);
		if (ts.isAwaitExpression(node)) {
			let value = node.expression;
			while (ts.isParenthesizedExpression(value)) value = value.expression;
			if (!ts.isCallExpression(value)) return false;
			const specifier = literal(value.arguments[0]);
			const native = origins(value.expression, /* @__PURE__ */ new Set(), scope).every((origin) => origin === "realpath-async");
			const builtin = value.expression.kind === ts.SyntaxKind.ImportKeyword && specifier !== void 0 && namespaces.has(specifier);
			return (native || builtin) && pure(value, scope);
		}
		if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
			if (origins(node, /* @__PURE__ */ new Set(), scope).includes("location")) return true;
			return origins(node.expression, /* @__PURE__ */ new Set(), scope).every((value) => readableValues.has(value)) && pure(node.expression, scope) && (!ts.isElementAccessExpression(node) || literal(node.argumentExpression) !== void 0);
		}
		if (!ts.isCallExpression(node)) return false;
		const builtin = literal(node.arguments[0]);
		const builtinCall = builtin !== void 0 && namespaces.has(builtin) && node.arguments.length === 1;
		if (node.expression.kind === ts.SyntaxKind.ImportKeyword) return builtinCall;
		return origins(node.expression, /* @__PURE__ */ new Set(), scope).every((value) => pureCalls.has(value) && (value === "join" || value === "resolve" || node.arguments.length === (value === "cwd" ? 0 : 1)) || loaders.has(value) && builtinCall) && pure(node.expression, scope) && node.arguments.every((argument) => pure(argument, scope));
	}
	changedCwd = cwdReferences.some((reference) => (ts.isImportSpecifier(reference) || ts.isBindingElement(reference) ? declarationOrigins(reference, /* @__PURE__ */ new Set()) : origins(reference)).includes("chdir"));
	for (const scope of scopes.toSorted((a, b) => a.pos - b.pos)) {
		const body = ts.isSourceFile(scope) ? scope : scope.body;
		if (!body || !ts.isSourceFile(body) && !ts.isBlock(body)) continue;
		if (!ts.isSourceFile(scope) && scope.parameters.some((parameter) => !ts.isIdentifier(parameter.name) || Boolean(parameter.initializer) || Boolean(parameter.dotDotDotToken))) continue;
		prefix: for (const statement of body.statements) {
			if (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement) || ts.isFunctionDeclaration(statement) || ts.isEmptyStatement(statement) || ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) continue;
			if (!ts.isVariableStatement(statement) || !(statement.declarationList.flags & ts.NodeFlags.Const)) break;
			for (const declaration of statement.declarationList.declarations) {
				if (!ts.isIdentifier(declaration.name) || !declaration.initializer || !pure(declaration.initializer, scope)) break prefix;
				const values = origins(declaration.initializer, /* @__PURE__ */ new Set(), scope);
				if (!values.every((value) => snapshotsKinds.has(value) || [
					"literal",
					"relative",
					...namespaces.values(),
					...pureCalls
				].includes(value))) break prefix;
				const symbol = symbolAt(declaration.name);
				if (symbol && values.every((value) => snapshotsKinds.has(value))) snapshots.set(symbol, values);
			}
		}
	}
	for (const node of calls) {
		const specifier = literal(node.arguments[0]);
		if (node.arguments.length !== 1 || specifier === void 0) continue;
		const values = origins(node.expression);
		let callee = node.expression;
		while (ts.isParenthesizedExpression(callee)) callee = callee.expression;
		if (values.includes("root") || ts.isIdentifier(callee) && callee.text === "require" && !values.every((value) => value === "caller")) recordImport(specifier);
	}
	return imports;
}
//#endregion
//#region src/infra/runtime-dependency-ownership.ts
const RUNTIME_DEPENDENCY_OWNERSHIP_RELATIVE_PATH = "dist/runtime-dependency-ownership.json";
function parseRuntimeDependencyOwnership(value) {
	if (!isRecord$1(value) || !isRecord$1(value.chunks)) return null;
	for (const chunk of Object.values(value.chunks)) if (!isRecord$1(chunk) || typeof chunk.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(chunk.sha256) || !Array.isArray(chunk.extensions) || chunk.extensions.length === 0 || !chunk.extensions.every((id) => typeof id === "string" && /^[a-z0-9][a-z0-9-]*$/u.test(id)) || new Set(chunk.extensions).size !== chunk.extensions.length) return null;
	return value;
}
function readRuntimeDependencyOwnership(packageRoot, fsImpl = fs) {
	const file = join(packageRoot, RUNTIME_DEPENDENCY_OWNERSHIP_RELATIVE_PATH);
	if (!fsImpl.existsSync(file)) return null;
	const stat = fsImpl.lstatSync(file);
	if (!stat.isFile() || stat.size > 1048576) throw new Error("ownership artifact must be a regular file no larger than 1048576 bytes");
	const ownership = parseRuntimeDependencyOwnership(JSON.parse(fsImpl.readFileSync(file, "utf8")));
	if (!ownership) throw new Error("ownership artifact does not match the supported schema");
	return ownership;
}
//#endregion
//#region src/shared/non-packaged-plugin-dirs.ts
/** Bundled plugins available to source builds but excluded from node and npm distributions. */
const NON_PACKAGED_BUNDLED_PLUGIN_DIRS = /* @__PURE__ */ new Set(["qa-channel", "qa-lab"]);
//#endregion
//#region src/gateway/worker-environments/node-bootstrap-runtime-chunks.ts
async function resolveNodeBootstrapRuntimeChunks(packageRoot, files) {
	const ownership = readRuntimeDependencyOwnership(packageRoot);
	const privateChunks = new Map(files.flatMap((file) => {
		if (!file.startsWith("dist/") || !/\.[cm]?js$/u.test(file) || file.startsWith("dist/extensions/")) return [];
		const owner = ownership?.chunks[file.slice(5)];
		return owner?.extensions.every((id) => NON_PACKAGED_BUNDLED_PLUGIN_DIRS.has(id)) ? [[file, owner]] : [];
	}));
	const sourceFacts = /* @__PURE__ */ new Map();
	if (privateChunks.size === 0) return {
		files,
		sourceFacts
	};
	const root$1 = await root(packageRoot, {
		hardlinks: "allow",
		symlinks: "reject",
		nonBlockingRead: true
	});
	const fileSet = new Set(files);
	const imports = /* @__PURE__ */ new Map();
	for (const file of files.filter((candidate) => /\.[cm]?js$/u.test(candidate))) {
		const { buffer } = await root$1.read(file, {
			hardlinks: "allow",
			symlinks: "reject",
			maxBytes: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS.maxExpandedBytes
		});
		const sha256 = createHash("sha256").update(buffer).digest("hex");
		const owner = privateChunks.get(file);
		if (owner && sha256 !== owner.sha256) throw new Error(`Runtime dependency ownership does not match ${file}; rebuild the Gateway`);
		const source = buffer.toString("utf8");
		const fileImports = collectPackageDistImports({
			files: [file],
			readText: () => source
		});
		sourceFacts.set(file, {
			sha256,
			imports: fileImports
		});
		const dependencies = new Set(fileImports.map(({ importedPath }) => importedPath));
		const resolveImport = createRequire(path.join(packageRoot, file)).resolve;
		for (const specifier of collectPackageRootImports(source)) {
			if (!specifier.startsWith(".")) continue;
			const specifierPath = specifier.replace(/[?#].*$/u, "");
			const direct = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifierPath));
			if (fileSet.has(direct) && dependencies.has(direct)) continue;
			try {
				dependencies.add(path.relative(packageRoot, resolveImport(specifierPath)).split(path.sep).join("/"));
			} catch {}
		}
		imports.set(file, [...dependencies]);
	}
	const retained = files.filter((file) => !privateChunks.has(file));
	for (const file of retained) for (const dependency of imports.get(file) ?? []) if (privateChunks.delete(dependency)) retained.push(dependency);
	return {
		files: files.filter((file) => !privateChunks.has(file)),
		sourceFacts
	};
}
//#endregion
//#region src/gateway/worker-environments/node-bootstrap-artifact.ts
const BOOTSTRAP_LAUNCHER_FILES = [
	"openclaw.mjs",
	"node-version.mjs",
	"node-sqlite.mjs",
	"node-runtime-update.mjs",
	"node-runtime-recovery.mjs",
	"cli-root-options.mjs",
	"gateway-run-argv.mjs",
	"gateway-shutdown-budget.mjs",
	"node-host-launcher.mjs"
];
const READ_CONCURRENCY = 16;
const IGNORED_PLUGIN_DIRECTORIES = /* @__PURE__ */ new Set([
	"node_modules",
	"src",
	"test",
	"tests"
]);
const METADATA_KEYS = [
	"name",
	"version",
	"dependencies",
	"optionalDependencies",
	"peerDependencies",
	"peerDependenciesMeta"
];
function bootstrapPath(value) {
	if (!value || value.includes("\\") || value.includes("\0") || value.startsWith("/") || value.split("/").some((part) => !part || part === "." || part === "..")) throw new Error(`Unsafe node distribution path: ${value}`);
	return value;
}
async function readPackageManifest(root) {
	const value = JSON.parse(await fs$1.readFile(path.join(root, "package.json"), "utf8"));
	if (!value.name || valid(value.version) !== value.version) throw new Error("Node distribution requires a named package with an exact version");
	return value;
}
function requireRunningBuild(options, text, version) {
	const info = JSON.parse(text);
	if (!options.runningBuildId || info.buildId !== options.runningBuildId || info.version !== version) throw new Error("Cloud bootstrap requires the running Gateway build; run pnpm build and restart the Gateway before provisioning");
	return options.runningBuildId;
}
async function observeBootstrapModes(root) {
	const modes = [];
	for (const requested of [420, 493]) {
		const probe = path.join(root, `.mode-${requested.toString(8)}`);
		const handle = await fs$1.open(probe, "wx", requested);
		try {
			modes.push((await handle.stat()).mode & 511);
		} finally {
			await handle.close();
			await fs$1.rm(probe);
		}
	}
	return modes;
}
async function collectInstalledBundledFiles(root) {
	const included = ({ name }) => name !== "node_modules" && !name.startsWith(".");
	const { entries, failedDirs, truncated } = await walkDirectory(root, {
		maxEntries: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS.maxEntries,
		symlinks: "include",
		include: included,
		descend: (entry) => {
			if (entry.depth >= 64) throw new Error("Node bootstrap dependency exceeds its directory depth limit");
			return included(entry);
		}
	});
	if (failedDirs.length > 0) throw failedDirs[0].error;
	if (truncated) throw new Error("Node bootstrap distribution exceeds its artifact limits");
	return entries.flatMap((entry) => {
		if (entry.kind === "directory" || entry.relativePath === "package.json") return [];
		if (entry.kind !== "file") throw new Error(`Unsafe bundled node distribution path: ${entry.relativePath}`);
		return [entry.relativePath.split(path.sep).join("/")];
	});
}
async function resolvePlugins(options, packageRoot) {
	const ids = /* @__PURE__ */ new Set();
	return await Promise.all(options.plugins.map(async ({ id, root }) => {
		if (!/^[a-z0-9][a-z0-9_-]*$/u.test(id) || ids.has(id)) throw new Error(`Invalid or duplicate node bootstrap plugin: ${id}`);
		ids.add(id);
		const requestedRoot = await fs$1.realpath(root);
		const sourceRoot = path.join(packageRoot, "extensions", id);
		const bundledRoot = path.join(packageRoot, "dist", "extensions", id);
		const builtRoot = requestedRoot === sourceRoot ? bundledRoot : requestedRoot;
		const packageJson = await readPackageManifest(builtRoot);
		if (requestedRoot === sourceRoot) {
			const sourcePackage = await readPackageManifest(sourceRoot);
			if (METADATA_KEYS.some((key) => !isDeepStrictEqual(packageJson[key], sourcePackage[key]))) throw new Error(`Built plugin ${id} does not match source metadata; rebuild and restart the Gateway`);
		}
		if (JSON.parse(await fs$1.readFile(path.join(builtRoot, "openclaw.plugin.json"), "utf8")).id !== id) throw new Error(`Node bootstrap plugin identity does not match ${id}`);
		const entries = packageJson.openclaw?.runtimeExtensions ?? packageJson.openclaw?.extensions;
		if (!entries?.length) throw new Error(`Node bootstrap plugin ${id} has no runtime entry`);
		for (const entry of entries) {
			const relative = bootstrapPath(entry.replace(/^\.\//u, "").replace(/\.ts$/u, ".js"));
			await fs$1.access(path.join(builtRoot, relative));
		}
		return {
			id,
			root: builtRoot,
			packageJson,
			bundled: builtRoot === bundledRoot
		};
	}));
}
async function prepareNodeBootstrapArtifact(options, temporaryRoot, usePrebuilt = true) {
	try {
		var _usingCtx$1 = _usingCtx();
		const packageRoot = await fs$1.realpath(options.packageRoot);
		const sourcePackage = await readPackageManifest(packageRoot);
		if (sourcePackage.name !== "openclaw") throw new Error("Node bootstrap requires the running OpenClaw package root");
		const buildInfoPath = path.join(packageRoot, "dist", "build-info.json");
		const buildInfo = await fs$1.readFile(buildInfoPath, "utf8").catch((cause) => {
			throw new Error("Cloud bootstrap requires a built Gateway; run pnpm build and restart the Gateway before provisioning", { cause });
		});
		const buildId = requireRunningBuild(options, buildInfo, sourcePackage.version);
		const plugins = await resolvePlugins(options, packageRoot);
		const packageJson = composePackagePlugins(sourcePackage, plugins);
		const modes = await observeBootstrapModes(temporaryRoot);
		const mainScope = {
			label: packageJson.name,
			prefix: "",
			files: [],
			imports: []
		};
		const scopes = [];
		const entries = /* @__PURE__ */ new Map();
		const planEntry = (relative, entry) => {
			bootstrapPath(relative);
			entries.set(relative, entry);
			if (entries.size > DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS.maxEntries) throw new Error("Node bootstrap distribution exceeds its artifact limits");
		};
		let expandedBytes = 0;
		let reservedEntries = 0;
		const reserveFile = (relative, bytes) => {
			bootstrapPath(relative);
			expandedBytes += bytes;
			reservedEntries += 1;
			if (reservedEntries > DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS.maxEntries || expandedBytes > DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS.maxExpandedBytes) throw new Error("Node bootstrap distribution exceeds its artifact limits");
		};
		const addGeneratedFile = (relative, contents, scope = mainScope) => {
			reserveFile(relative, Buffer.byteLength(contents));
			planEntry(relative, {
				contents: Buffer.from(contents),
				scope
			});
		};
		const addFiles = (root, files, prefix = "", scope = mainScope) => {
			for (const relative of new Set(files)) {
				bootstrapPath(relative);
				planEntry(`${prefix}${relative}`, {
					source: {
						root,
						relative
					},
					scope
				});
			}
		};
		const readEntry = async (destination, entry) => {
			if ("contents" in entry) return {
				contents: entry.contents,
				mode: modes[0]
			};
			const { root, relative } = entry.source;
			const source = path.join(root, relative);
			if (await fs$1.realpath(source) !== source) throw new Error(`Node distribution cannot contain symbolic links: ${relative}`);
			const handle = await fs$1.open(source, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			try {
				const before = await handle.stat();
				if (!before.isFile()) throw new Error(`Invalid node distribution file: ${relative}`);
				reserveFile(destination, before.size);
				const contents = await handle.readFile();
				const after = await handle.stat();
				const current = await fs$1.lstat(source);
				if (contents.byteLength !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs || current.isSymbolicLink() || current.dev !== before.dev || current.ino !== before.ino || await fs$1.realpath(source) !== source) throw new Error(`Node distribution changed while packaging: ${relative}`);
				return {
					contents,
					mode: modes[(before.mode & 73) !== 0 ? 1 : 0]
				};
			} finally {
				await handle.close();
			}
		};
		const externalPluginPrefixes = plugins.filter((plugin) => !plugin.bundled).map(({ id }) => `dist/extensions/${id}/`);
		const publicFiles = (await collectPackageDistInventory(packageRoot, { packageManifest: packageJson })).filter((relative) => !relative.startsWith("dist/worker/") && !relative.startsWith("dist/control-ui/") && !externalPluginPrefixes.some((prefix) => relative.startsWith(prefix)));
		const scripts = (sourcePackage.files ?? []).filter((relative) => relative.startsWith("scripts/") && !relative.includes("*") && !relative.endsWith("/"));
		const { files, sourceFacts } = await resolveNodeBootstrapRuntimeChunks(packageRoot, [
			...BOOTSTRAP_LAUNCHER_FILES,
			...publicFiles,
			...scripts
		].filter((relative) => relative !== LEGACY_PACKAGE_INSTALL_GUARD_RELATIVE_PATH));
		if (!files.includes("dist/entry.js") && !files.includes("dist/entry.mjs")) throw new Error("Cloud bootstrap is missing its built CLI entry; run pnpm build and restart the Gateway");
		addFiles(packageRoot, files);
		packageJson.scripts = Object.fromEntries(Object.entries(packageJson.scripts ?? {}).filter(([name]) => [
			"preinstall",
			"install",
			"postinstall"
		].includes(name)));
		delete packageJson.devDependencies;
		for (const plugin of plugins) {
			if (plugin.bundled) continue;
			const pluginFiles = [];
			const visit = async (directory, relativeRoot = "") => {
				for (const child of await fs$1.readdir(directory, { withFileTypes: true })) {
					if (child.name.startsWith(".") || IGNORED_PLUGIN_DIRECTORIES.has(child.name)) continue;
					const relative = relativeRoot ? `${relativeRoot}/${child.name}` : child.name;
					if (relative.split("/").length > 64) throw new Error("Node bootstrap plugin exceeds its directory depth limit");
					if (child.isDirectory()) await visit(path.join(directory, child.name), relative);
					else if (/\.(?:[cm]?js|json|wasm)$/u.test(child.name)) pluginFiles.push(relative);
				}
			};
			await visit(plugin.root);
			addFiles(plugin.root, pluginFiles, `dist/extensions/${plugin.id}/`);
		}
		const bundledNames = /* @__PURE__ */ new Set([...packageJson.bundleDependencies ?? packageJson.bundledDependencies ?? [], ...Object.entries(packageJson.dependencies ?? {}).filter(([, spec]) => spec.startsWith("workspace:")).map(([name]) => name)]);
		for (const name of [...bundledNames].toSorted()) {
			bootstrapPath(name);
			const root = await fs$1.realpath(path.join(packageRoot, "node_modules", name));
			const bundled = await readPackageManifest(root);
			if (bundled.name !== name) throw new Error(`Bundled node distribution dependency identity does not match ${name}`);
			const dependencies = validateBundledPackageDependencyAlignment({
				bundledDependencies: bundled.dependencies,
				bundledPackageLabel: `bundled ${name}`,
				rootDependencies: packageJson.dependencies
			});
			for (const [dependency, version] of dependencies) packageJson.dependencies[dependency] = version;
			const bundledFiles = sourcePackage.dependencies?.[name]?.startsWith("workspace:") || !root.endsWith(`${path.sep}node_modules${path.sep}${name.split("/").join(path.sep)}`) ? await collectPackageDistInventory(root) : await collectInstalledBundledFiles(root);
			if (bundledFiles.length === 0) throw new Error(`Bundled node dependency ${name} needs its compiled distribution; rebuild the Gateway`);
			const scope = {
				label: name,
				prefix: `node_modules/${name}/`,
				files: [],
				imports: [],
				...name === "chrome-devtools-mcp" ? { patchedMcp: {
					manifest: bundled,
					hashes: /* @__PURE__ */ new Map()
				} } : {}
			};
			scopes.push(scope);
			addFiles(root, bundledFiles, scope.prefix, scope);
			delete bundled.dependencies;
			delete bundled.devDependencies;
			delete bundled.scripts;
			addGeneratedFile(`node_modules/${name}/package.json`, `${JSON.stringify(bundled, null, 2)}\n`, scope);
			packageJson.dependencies[name] = bundled.version;
		}
		packageJson.bundleDependencies = [...bundledNames].toSorted();
		delete packageJson.bundledDependencies;
		for (const [name, spec] of Object.entries({
			...packageJson.optionalDependencies,
			...packageJson.dependencies
		})) if (valid(spec) !== spec) throw new Error(`Node distribution requires an exact dependency pin: ${name}@${spec}`);
		addGeneratedFile("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
		const inventory = [...entries.keys()].filter((entry) => entry.startsWith("dist/")).toSorted();
		addGeneratedFile(PACKAGE_DIST_INVENTORY_RELATIVE_PATH, `${JSON.stringify(inventory)}\n`);
		addGeneratedFile(PACKAGE_LIFECYCLE_PENDING_RELATIVE_PATH, "pending\n");
		const ordered = [...entries].toSorted(([left], [right]) => compareWorkerBundlePaths(left, right));
		mainScope.files = ordered.map(([relative]) => relative);
		for (const [relative, entry] of ordered) if (entry.scope !== mainScope) entry.scope.files.push(relative.slice(entry.scope.prefix.length));
		const tarballPath = path.join(temporaryRoot, NODE_BOOTSTRAP_PREBUILT_ARCHIVE);
		const prebuiltManifest = usePrebuilt ? await copyNodeBootstrapPrebuiltArchive(packageRoot, temporaryRoot) : void 0;
		let entryConsumed = Promise.resolve();
		const pack = prebuiltManifest ? void 0 : new tar.Pack({
			gzip: true,
			noMtime: true,
			portable: true,
			strict: true,
			onWriteEntry(entry) {
				entryConsumed = finished(entry, {
					readable: true,
					writable: false,
					cleanup: true
				});
				entryConsumed.catch(() => void 0);
			}
		});
		const archiveDone = pack ? pipeline(pack, createWriteStream(tarballPath, { flags: "wx" })) : Promise.resolve();
		archiveDone.catch(() => void 0);
		const manifest = [];
		try {
			for (let offset = 0; offset < ordered.length; offset += READ_CONCURRENCY) {
				const batch = ordered.slice(offset, offset + READ_CONCURRENCY);
				const read = await runTasksWithConcurrency({
					tasks: batch.map(([relative, entry]) => () => readEntry(relative, entry)),
					limit: READ_CONCURRENCY,
					errorMode: "stop"
				});
				if (read.hasError) throw read.firstError;
				for (let index = 0; index < batch.length; index += 1) {
					const [relative, entry] = batch[index];
					const { contents, mode } = read.results[index];
					const importerPath = relative.slice(entry.scope.prefix.length);
					const identity = {
						path: `package/${relative}`,
						size: contents.byteLength,
						mode: process.platform === "win32" ? 448 : mode,
						sha256: createHash("sha256").update(contents).digest("hex")
					};
					const inspected = sourceFacts.get(relative);
					if (inspected && identity.sha256 !== inspected.sha256) throw new Error(`Node distribution changed after import inspection: ${relative}`);
					if (entry.scope.patchedMcp) entry.scope.patchedMcp.hashes.set(importerPath, identity.sha256);
					else entry.scope.imports.push(...inspected?.imports ?? collectPackageDistImports({
						files: [importerPath],
						readText: () => contents.toString("utf8")
					}));
					manifest.push(identity);
					if (!pack) continue;
					const input = new tar.ReadEntry(new tar.Header({
						path: identity.path,
						size: identity.size,
						mode,
						type: "File"
					}));
					pack.add(input);
					input.end(contents);
					await Promise.race([entryConsumed, archiveDone]);
				}
			}
			for (const scope of [...scopes, mainScope]) {
				const errors = scope.patchedMcp ? collectPatchedMcpArtifactErrors({
					manifest: scope.patchedMcp.manifest,
					files: new Set(scope.files),
					sha256: (file) => scope.patchedMcp?.hashes.get(file)
				}) : collectPackageDistImportErrors(scope);
				if (errors.length > 0) throw new Error(`Node distribution ${scope.label} ${scope.patchedMcp ? "has an invalid patched dependency" : "has an incomplete built import closure"}; rebuild and restart the Gateway: ${errors.slice(0, 5).join("; ")}`);
			}
			if (!isDeepStrictEqual(await observeBootstrapModes(temporaryRoot), modes)) throw new Error("Node bootstrap file creation policy changed while packaging");
			if (await fs$1.readFile(buildInfoPath, "utf8") !== buildInfo || !isDeepStrictEqual(await readPackageManifest(packageRoot), sourcePackage)) throw new Error("Gateway build changed while preparing cloud bootstrap; restart the Gateway and retry");
			pack?.end();
			await archiveDone;
		} catch (error) {
			pack?.destroy(error instanceof Error ? error : new Error("Node bootstrap archive failed", { cause: error }));
			pack?.zip?.destroy();
			await archiveDone.catch(() => void 0);
			throw error;
		}
		const tarballBytes = (await fs$1.stat(tarballPath)).size;
		if (tarballBytes > 536870912) throw new Error("Node bootstrap archive exceeds the transfer limit");
		const archiveManifest = prebuiltManifest ?? await readWorkerBundleArchiveManifest(tarballPath, DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS);
		if (hashWorkerBundleManifest(manifest) !== hashWorkerBundleManifest(archiveManifest)) {
			if (prebuiltManifest) {
				await fs$1.rm(tarballPath);
				return await prepareNodeBootstrapArtifact(options, temporaryRoot, false);
			}
			throw new Error("Node bootstrap archive does not match the verified distribution");
		}
		const handle = _usingCtx$1.a(await fs$1.open(tarballPath, "r"));
		const { digest: tarballSha256 } = await sha256File(handle);
		return Object.freeze({
			tarballPath,
			tarballSha256,
			tarballBytes,
			openclawVersion: packageJson.version,
			buildId,
			enabledPluginIds: Object.freeze(plugins.map(({ id }) => id).toSorted())
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Owns one immutable deployment artifact for this Gateway process, never the live installation. */
function createNodeBootstrapArtifactProvider(options) {
	let prepared;
	let temporaryRoot;
	let closed = false;
	const consumers = /* @__PURE__ */ new Map();
	return {
		async prepare(signal) {
			signal?.throwIfAborted();
			if (closed) throw new Error("Node bootstrap artifact provider is closed");
			prepared ??= Promise.resolve().then(async () => {
				try {
					temporaryRoot = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-node-runtime-"));
					if (closed) throw new Error("Node bootstrap artifact provider is closed");
					const artifact = await prepareNodeBootstrapArtifact(options, temporaryRoot);
					if (closed) throw new Error("Node bootstrap artifact provider is closed");
					return artifact;
				} catch (error) {
					if (temporaryRoot) await fs$1.rm(temporaryRoot, {
						recursive: true,
						force: true
					});
					temporaryRoot = void 0;
					prepared = void 0;
					throw error;
				}
			});
			const artifact = await racePromiseWithAbortSignal(prepared, signal);
			signal?.throwIfAborted();
			if (closed) throw new Error("Node bootstrap artifact provider is closed");
			if (signal && !consumers.has(signal)) consumers.set(signal, new Promise((resolve) => {
				signal.addEventListener("abort", () => {
					consumers.delete(signal);
					resolve();
				}, { once: true });
			}));
			return artifact;
		},
		async close() {
			closed = true;
			await prepared?.catch(() => void 0);
			await Promise.all(consumers.values());
			if (temporaryRoot) {
				await fs$1.rm(temporaryRoot, {
					recursive: true,
					force: true
				});
				temporaryRoot = void 0;
			}
		}
	};
}
//#endregion
export { createNodeBootstrapArtifactProvider };
