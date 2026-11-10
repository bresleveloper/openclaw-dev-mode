import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as formatCwdRelativePathOrAbsolute } from "./safe-cwd-DOxDm8mD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { f as shortenHomeInString } from "./utils-gjJ-tD2q.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { _ as controlUiSource, a as loadPluginControlUiDeclaration, r as loadPluginManifest, t as PLUGIN_MANIFEST_FILENAME } from "./manifest-gUPkNRN0.mjs";
import { r as resolvePackageExtensionEntries } from "./package-manifest-Zddwuhx3.mjs";
import { c as toSafeImportPath, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { t as buildPluginLoaderAliasMap } from "./sdk-alias-DCaIS4rn.mjs";
import { i as pluginControlUiGenerationHash, r as isPluginControlUiAssetPath } from "./control-ui-assets-DErxGcit.mjs";
import { i as jsonSchemaValuesEqual } from "./json-schema-BLReYZIW.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { i as formatCliOperatorError } from "./failure-output-CpIKhMiV.mjs";
import { n as getToolPluginMetadata } from "./tool-plugin-57isMP90.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path, { dirname, join, resolve } from "node:path";
import { replaceFileAtomic } from "@openclaw/fs-safe/atomic";
import { isUtf8 } from "node:buffer";
import { parse as parse$1 } from "acorn";
//#region src/cli/plugins-authoring-json.ts
/** Read author-owned metadata without silently replacing malformed input bytes. */
function readPluginAuthoringJson(filePath) {
	const bytes = fs.readFileSync(filePath);
	if (!isUtf8(bytes)) throw new Error(`JSON file must be valid UTF-8: ${filePath}`);
	try {
		return JSON.parse(bytes.toString("utf8"));
	} catch (err) {
		throw new Error(`Malformed JSON in ${filePath}`, { cause: err });
	}
}
//#endregion
//#region src/cli/plugins-authoring-metadata.ts
function buildToolPluginManifest(params) {
	const toolMetadata = buildToolPluginToolMetadata(params.metadata, params.existingManifest);
	const existingContracts = isRecord(params.existingManifest?.contracts) ? params.existingManifest.contracts : {};
	const { contracts: _existingContracts, toolMetadata: _existingToolMetadata, ...existingManifestFields } = params.existingManifest ?? {};
	const manifest = {
		...existingManifestFields,
		id: params.metadata.id,
		name: params.metadata.name,
		description: params.metadata.description,
		version: typeof params.packageManifest.version === "string" ? params.packageManifest.version : "0.0.0",
		configSchema: params.metadata.configSchema,
		activation: params.metadata.activation,
		contracts: {
			...existingContracts,
			tools: params.metadata.tools.map((tool) => tool.name)
		},
		...toolMetadata ? { toolMetadata } : {}
	};
	const serialized = JSON.stringify(manifest);
	return JSON.parse(serialized);
}
function buildToolPluginToolMetadata(metadata, existingManifest) {
	const existingToolMetadata = isRecord(existingManifest?.toolMetadata) ? existingManifest.toolMetadata : {};
	const nextEntries = metadata.tools.map((tool) => {
		const existingValue = existingToolMetadata[tool.name];
		const existing = isRecord(existingValue) ? { ...existingValue } : {};
		if (tool.optional) existing.optional = true;
		else delete existing.optional;
		return [tool.name, existing];
	}).filter(([, value]) => Object.keys(value).length > 0);
	return nextEntries.length > 0 ? Object.fromEntries(nextEntries) : void 0;
}
function buildToolPluginPackageManifest(params) {
	const openclaw = isRecord(params.packageManifest.openclaw) ? params.packageManifest.openclaw : {};
	const existingExtensions = filterStringEntries(openclaw.extensions);
	const extensions = uniqueStrings([...existingExtensions, params.entry]);
	return {
		...params.packageManifest,
		openclaw: {
			...openclaw,
			extensions
		}
	};
}
function validateToolPluginProject(params) {
	const errors = [];
	const expectedManifest = buildToolPluginManifest({
		metadata: params.metadata,
		packageManifest: params.packageManifest,
		existingManifest: params.manifest
	});
	if (!jsonSchemaValuesEqual(params.manifest, expectedManifest)) errors.push("openclaw.plugin.json generated metadata is stale. Run openclaw plugins build.");
	if (params.manifest.id !== params.metadata.id) errors.push(`openclaw.plugin.json id (${String(params.manifest.id)}) must match entry id (${params.metadata.id})`);
	if (!params.manifest.configSchema || typeof params.manifest.configSchema !== "object") errors.push("openclaw.plugin.json must include object configSchema");
	const manifestTools = filterStringEntries(isRecord(params.manifest.contracts) ? params.manifest.contracts.tools : void 0);
	const metadataTools = params.metadata.tools.map((tool) => tool.name);
	const missing = metadataTools.filter((tool) => !manifestTools.includes(tool));
	const extra = manifestTools.filter((tool) => !metadataTools.includes(tool));
	if (missing.length > 0) errors.push(`openclaw.plugin.json contracts.tools is missing: ${missing.join(", ")}`);
	if (extra.length > 0) errors.push(`openclaw.plugin.json contracts.tools has no matching defineToolPlugin tool: ${extra.join(", ")}`);
	const extensionResolution = resolvePackageExtensionEntries(params.packageManifest);
	if (extensionResolution.status !== "ok") errors.push(extensionResolution.status === "missing" || extensionResolution.status === "empty" ? "package.json must include openclaw.extensions" : extensionResolution.error);
	else if (!extensionResolution.entries.includes(params.entry)) errors.push(`package.json openclaw.extensions must include ${params.entry}`);
	return errors;
}
function createConfigSchema() {
	return {
		type: "object",
		additionalProperties: false,
		properties: {}
	};
}
//#endregion
//#region src/cli/plugins-build-solid.ts
function createSolidControlUiBuildPlugin(rootDir) {
	let compiler;
	return {
		name: "control-ui-solid",
		setup(build) {
			build.onLoad({ filter: /\.tsx$/ }, async ({ path: sourcePath }) => {
				const source = await fs$1.readFile(sourcePath, "utf8");
				if (((source.match(/^(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)*/u)?.[0] ?? "").match(/@jsxImportSource\s+([^\s*]+)/u)?.[1] ?? build.initialOptions.jsxImportSource) !== "@solidjs/web") return;
				if (!compiler) try {
					compiler = createRequire(path.join(rootDir, "package.json"))("@solidjs/compiler");
				} catch (cause) {
					throw new Error("Install @solidjs/compiler in this plugin's devDependencies to build Solid TSX Control UI sources.", { cause });
				}
				return {
					contents: compiler.transform(source, {
						filename: sourcePath,
						generate: "dom",
						dev: false,
						sourceMap: false
					}).code,
					loader: "ts",
					resolveDir: path.dirname(sourcePath)
				};
			});
		}
	};
}
//#endregion
//#region src/cli/plugins-build-bundle.ts
const moduleLocationImport = "openclaw-plugin-bundle:module-location";
const runtimeFilesImport = "openclaw-plugin-bundle:runtime-files";
const loadDiagnostics = {
	"unsupported-require-call": "error",
	"indirect-require": "error"
};
function isPluginBundleHostImport(specifier) {
	return isBuiltin(specifier) || specifier === "openclaw" || specifier.startsWith("openclaw/");
}
async function buildPluginBundle(options) {
	const require = createRequire(join(options.absWorkingDir, "package.json"));
	let builder;
	try {
		builder = require("esbuild");
	} catch (cause) {
		throw new Error("Install esbuild in this plugin's devDependencies, then run plugins build again.", { cause });
	}
	const backend = options.platform === "node";
	const recovery = backend ? "Use literal import or require paths and embed runtime resources, or use the regular package-install flow." : "Use literal browser imports, or provide prebuilt browser assets without package.json openclaw.controlUi.";
	const bindings = backend ? "metadata as \"import.meta\", directory as __dirname, filename as __filename, resolve as \"require.resolve\"" : "resolve as \"require.resolve\"";
	let result;
	try {
		result = await builder.build({
			...options,
			bundle: true,
			format: "esm",
			write: false,
			metafile: true,
			minifySyntax: true,
			logLevel: "silent",
			logOverride: {
				...loadDiagnostics,
				"unsupported-dynamic-import": "silent"
			},
			inject: [moduleLocationImport],
			plugins: [...!backend ? [createSolidControlUiBuildPlugin(options.absWorkingDir)] : [], {
				name: "plugin-bundle",
				setup(build) {
					build.onResolve({ filter: /^openclaw-plugin-bundle:module-location$/ }, () => ({
						path: "module-location",
						namespace: "plugin-bundle",
						sideEffects: false
					}));
					build.onLoad({
						filter: /.*/,
						namespace: "plugin-bundle"
					}, () => ({
						contents: [`export { ${bindings} } from "${runtimeFilesImport}";`, ...backend ? ["import { createRequire } from \"node:module\"; export default createRequire(import.meta.url);"] : []].join("\n"),
						loader: "js"
					}));
					build.onResolve({ filter: /^openclaw-plugin-bundle:runtime-files$/ }, () => ({
						path: runtimeFilesImport,
						external: true,
						sideEffects: false
					}));
					if (backend) {
						build.onResolve({ filter: /.*/ }, ({ path, kind }) => kind === "require-call" && isPluginBundleHostImport(path) ? {
							path,
							namespace: "plugin-bundle-host"
						} : void 0);
						build.onLoad({
							filter: /.*/,
							namespace: "plugin-bundle-host"
						}, ({ path }) => ({
							contents: isBuiltin(path) ? `import load from "${moduleLocationImport}"; module.exports = load(${JSON.stringify(path)});` : `import * as host from ${JSON.stringify(path)}; module.exports = host;`,
							loader: "js"
						}));
					}
				}
			}]
		});
	} catch (cause) {
		if (cause instanceof Error && "errors" in cause && Array.isArray(cause.errors) && cause.errors.some((diagnostic) => isRecord(diagnostic) && typeof diagnostic.id === "string" && Object.hasOwn(loadDiagnostics, diagnostic.id))) throw new Error(`${cause.message}\n${recovery}`, { cause });
		throw cause;
	}
	const outputs = result.metafile.outputs;
	const imports = Object.values(outputs).flatMap((output) => output.imports);
	if (imports.some((item) => item.path === runtimeFilesImport)) throw new Error(`${backend ? "Plugin artifacts cannot use module-relative runtime files or require.resolve." : "Control UI builds cannot use require.resolve."} ${recovery}`);
	const outputPaths = new Set(Object.keys(outputs).map((file) => resolve(options.absWorkingDir, file)));
	if (imports.some((item) => item.external ? !backend || !isPluginBundleHostImport(item.path) : !outputPaths.has(resolve(options.absWorkingDir, item.path))) || backend && result.outputFiles.some((file) => !file.path.endsWith(".js"))) throw new Error(backend ? "Plugin artifact must bundle all dependencies into its JavaScript runtime files." : "Control UI builds must bundle their browser dependencies.");
	for (const file of result.outputFiles) if (file.path.endsWith(".js") && hasUnbundledDynamicImport(parse$1(file.text, {
		ecmaVersion: "latest",
		sourceType: "module"
	}), (specifier) => backend && isPluginBundleHostImport(specifier) || (specifier.startsWith("./") || specifier.startsWith("../")) && outputPaths.has(resolve(dirname(file.path), specifier)))) throw new Error(`Dynamic imports in plugin builds must use bundled literal paths; a retained import expression in ${file.path} will not be bundled. ${recovery}`);
	return result.outputFiles.toSorted((left, right) => left.path.localeCompare(right.path));
}
function hasUnbundledDynamicImport(node, isBundled) {
	if (!isRecord(node)) return false;
	if (node.type === "ImportExpression") {
		const source = node.source;
		if (!isRecord(source) || source.type !== "Literal" || typeof source.value !== "string" || !isBundled(source.value)) return true;
	}
	for (const value of Object.values(node)) for (const child of Array.isArray(value) ? value : [value]) if (hasUnbundledDynamicImport(child, isBundled)) return true;
	return false;
}
//#endregion
//#region src/cli/plugins-control-ui-chunks.ts
/** The immutable generation directory owns content identity; chunk names only own graph identity. */
function nameControlUiChunks(files) {
	const assets = new Map(files.map((file) => [file.name, file]));
	const references = /* @__PURE__ */ new Map();
	for (const file of files) {
		if (!file.name.endsWith(".js")) continue;
		const found = [];
		const visit = (node) => {
			if (!isRecord(node)) return;
			if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration" || node.type === "ExportAllDeclaration" || node.type === "ImportExpression") {
				const source = node.source;
				if (isRecord(source) && source.type === "Literal" && typeof source.value === "string" && source.value.startsWith("./") && assets.has(source.value.slice(2)) && typeof source.start === "number" && typeof source.end === "number") found.push({
					name: source.value.slice(2),
					start: source.start,
					end: source.end
				});
			}
			for (const value of Object.values(node)) if (Array.isArray(value)) for (const child of value) visit(child);
			else visit(value);
		};
		visit(parse$1(Buffer.from(file.contents).toString("utf8"), {
			ecmaVersion: "latest",
			sourceType: "module"
		}));
		references.set(file.name, found.toSorted((a, b) => a.start - b.start));
	}
	const names = /* @__PURE__ */ new Map();
	const visit = (name) => {
		if (names.has(name)) return;
		names.set(name, name === "index.js" ? name : "chunk-" + names.size + ".js");
		for (const reference of references.get(name) ?? []) visit(reference.name);
	};
	visit("index.js");
	return files.map((file) => {
		if (!file.name.endsWith(".js")) return file;
		const name = names.get(file.name);
		if (!name) throw new Error("Control UI JavaScript output is not reachable from its entrypoint.");
		let contents = Buffer.from(file.contents).toString("utf8");
		for (const reference of (references.get(file.name) ?? []).toReversed()) contents = contents.slice(0, reference.start) + JSON.stringify("./" + names.get(reference.name)) + contents.slice(reference.end);
		return {
			name,
			contents: Buffer.from(contents)
		};
	}).toSorted((a, b) => a.name.localeCompare(b.name));
}
//#endregion
//#region src/cli/plugins-control-ui-build.ts
async function writePluginBuildManifest(rootDir, manifest) {
	const realRootDir = await fs$1.realpath(rootDir);
	await replaceFileAtomic({
		filePath: path.join(realRootDir, PLUGIN_MANIFEST_FILENAME),
		content: `${JSON.stringify(manifest, null, 2)}\n`,
		mode: 438 & ~process.umask(),
		preserveExistingMode: true,
		dirMode: (await fs$1.stat(realRootDir)).mode & 4095,
		syncTempFile: true,
		syncParentDir: true,
		throwOnCleanupError: true
	});
}
async function buildPluginControlUi(params) {
	const rootDir = await fs$1.realpath(params.rootDir);
	const entry = await fs$1.realpath(path.resolve(rootDir, params.source));
	const relative = path.relative(rootDir, entry);
	if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) throw new Error("Control UI source must stay inside the plugin package.");
	const buildDir = path.join(rootDir, "dist/control-ui/build");
	const rawFiles = (await buildPluginBundle({
		absWorkingDir: rootDir,
		entryPoints: { index: entry },
		outdir: buildDir,
		splitting: true,
		chunkNames: "chunk-[hash]",
		platform: "browser",
		target: "es2022",
		minify: true,
		legalComments: "none",
		sourcemap: false,
		tsconfigRaw: { compilerOptions: {
			experimentalDecorators: true,
			useDefineForClassFields: false
		} },
		alias: buildPluginLoaderAliasMap(entry, process.argv[1], import.meta.url, "src")
	})).map((file) => ({
		name: path.relative(buildDir, file.path),
		contents: file.contents
	}));
	validateControlUiFiles(rawFiles);
	const files = nameControlUiChunks(rawFiles);
	validateControlUiFiles(files);
	const output = `dist/control-ui/${pluginControlUiGenerationHash(files)}`;
	return await publishControlUiBuild(path.join(rootDir, output), {
		entry: `${output}/index.js`,
		...files.some((file) => file.name === "index.css") ? { styles: [`${output}/index.css`] } : {}
	}, files, params.check);
}
function validateControlUiFiles(files) {
	if (files.length > 128) throw new Error(`Control UI builds allow at most 128 assets.`);
	if (files.some((file) => file.contents.length > 4194304) || files.reduce((total, file) => total + file.contents.length, 0) > 8388608) throw new Error("Control UI builds allow at most 4 MiB per asset and 8 MiB per plugin. Reduce the browser bundle before installing.");
	if (!files.some((file) => file.name === "index.js") || files.some((file) => file.name !== path.basename(file.name) || !isPluginControlUiAssetPath(file.name))) throw new Error("Control UI build must produce a JavaScript entrypoint and only flat JavaScript/CSS assets.");
}
async function publishControlUiBuild(outputDir, declaration, files, check) {
	if (check) {
		for (const file of files) if (!(await fs$1.readFile(path.join(outputDir, file.name)).catch(() => null))?.equals(Buffer.from(file.contents))) throw new Error("Control UI build is missing or stale. Run openclaw plugins build.");
		return declaration;
	}
	const generations = path.dirname(outputDir);
	await fs$1.mkdir(generations, { recursive: true });
	await fs$1.chmod(generations, 493);
	const staging = await fs$1.mkdtemp(path.join(generations, ".build-"));
	try {
		for (const file of files) await fs$1.writeFile(path.join(staging, file.name), file.contents);
		await normalizeGenerationPermissions(staging, files);
		try {
			await fs$1.rename(staging, outputDir);
		} catch (error) {
			if (!isRecord(error) || error.code !== "EEXIST" && error.code !== "ENOTEMPTY" && error.code !== "EPERM") throw error;
			for (const file of files) if (!(await fs$1.readFile(path.join(outputDir, file.name))).equals(Buffer.from(file.contents))) throw new Error("An immutable Control UI build was modified. Remove that build and rebuild.", { cause: error });
			await normalizeGenerationPermissions(outputDir, files);
		}
	} finally {
		await fs$1.rm(staging, {
			recursive: true,
			force: true
		});
	}
	return declaration;
}
async function normalizeGenerationPermissions(directory, files) {
	await fs$1.chmod(directory, 493);
	for (const file of files) await fs$1.chmod(path.join(directory, file.name), 420);
}
//#endregion
//#region src/cli/plugins-feature-scaffold.ts
function writeFeaturePluginScaffold(params) {
	if (!/^[a-z][a-z0-9-]*$/u.test(params.id)) throw new Error("Feature plugin ids must start with a lowercase letter and contain lowercase letters, digits, or hyphens.");
	const literal = JSON.stringify;
	const toolName = `${params.id.replaceAll("-", "_")}_analyze`;
	const description = `Analyze drafts with ${params.name} tools and native UI.`;
	const files = {
		"package.json": JSON.stringify({
			name: `openclaw-plugin-${params.id}`,
			version: "0.1.0",
			type: "module",
			private: true,
			scripts: {
				build: "tsc -p tsconfig.json && openclaw plugins build",
				validate: "openclaw plugins validate --json",
				pack: "openclaw plugins pack --json"
			},
			files: [
				"dist",
				"openclaw.plugin.json",
				"README.md"
			],
			peerDependencies: { openclaw: `>=${VERSION}` },
			dependencies: { typebox: "^1.3.17" },
			devDependencies: {
				openclaw: "latest",
				esbuild: "0.28.2",
				typescript: "7.0.2"
			},
			openclaw: {
				extensions: ["./dist/index.js"],
				controlUi: "./src/control-ui.ts",
				compat: { pluginApi: `>=${VERSION}` },
				build: { openclawVersion: VERSION }
			}
		}, null, 2),
		"src/contract.ts": `import { Type } from "typebox";
import { defineFeatureContract } from "openclaw/plugin-sdk/feature-contract";

export const contract = defineFeatureContract({
  pluginId: ${literal(params.id)},
  operations: {
    analyze: {
      kind: "query",
      description: "Count words and lines and list Markdown headings in a draft.",
      input: Type.Object({ text: Type.String({ maxLength: 32000 }) }, { additionalProperties: false }),
      output: Type.Object({ words: Type.Integer(), lines: Type.Integer(), headings: Type.Array(Type.String()) }),
      tool: { name: ${literal(toolName)}, label: "Analyze draft" },
    },
  },
  events: {},
});
`,
		"src/index.ts": `import { defineFeaturePlugin } from "openclaw/plugin-sdk/feature-plugin";
import { contract } from "./contract.js";

export default defineFeaturePlugin({
  contract,
  name: ${literal(params.name)},
  description: ${literal(description)},
  setup() {
    return {
      analyze: ({ text }) => ({
        words: text.trim() ? text.trim().split(/\\s+/u).length : 0,
        lines: text ? text.split("\\n").length : 0,
        headings: text.split("\\n").filter((line) => /^#{1,6} /u.test(line)),
      }),
    };
  },
});
`,
		"src/control-ui.ts": `import { defineControlUiPlugin } from "openclaw/plugin-sdk/control-ui";
import { createFeatureClient } from "openclaw/plugin-sdk/feature-contract";
import { contract } from "./contract.js";
import "./control-ui.css";

export default defineControlUiPlugin({
  id: contract.pluginId,
  activate(host) {
    host.ui.registerNavigation({ id: "drafts", label: ${literal(params.name)}, page: { id: "drafts" }, icon: "fileText" });
    host.ui.registerPage({
      id: "drafts", label: ${literal(params.name)},
      mount(container, context) {
        const feature = createFeatureClient(contract, context.host);
        const section = document.createElement("section");
        section.className = "feature-draft-page";
        const heading = document.createElement("h1");
        heading.textContent = ${literal(params.name)};
        const input = document.createElement("textarea");
        input.placeholder = "Paste a draft to analyze";
        input.setAttribute("aria-label", "Draft to analyze");
        const button = document.createElement("button");
        button.textContent = "Analyze draft";
        const result = document.createElement("output");
        result.setAttribute("aria-live", "polite");
        button.onclick = async () => {
          button.disabled = true;
          try {
            const report = await feature.invoke("analyze", { text: input.value });
            if (!context.signal.aborted) {
              result.textContent = report.words + " words · " + report.lines + " lines\\n" + report.headings.join("\\n");
            }
          } catch (error) {
            if (!context.signal.aborted) result.textContent = String(error);
          } finally {
            if (!context.signal.aborted) button.disabled = false;
          }
        };
        section.append(heading, input, button, result);
        container.append(section);
        return { dispose: () => section.remove() };
      },
    });
    host.ui.registerReplacement({
      id: "draft-composer", surface: "composer", label: "Draft composer",
      mount(container, context) {
        let current = context;
        const form = document.createElement("form");
        form.className = "feature-draft-composer";
        const input = document.createElement("textarea");
        input.setAttribute("aria-label", "Draft message");
        input.oninput = () => current.props.setDraft(input.value);
        const send = document.createElement("button");
        send.type = "submit";
        send.textContent = "Send message";
        const error = document.createElement("output");
        error.setAttribute("aria-live", "polite");
        form.onsubmit = async (event) => {
          event.preventDefault();
          if (!current.props.canSend) return;
          const submitted = current;
          error.textContent = "";
          try {
            const accepted = await submitted.props.send();
            if (!submitted.signal.aborted && accepted === false) error.textContent = "Message was not sent. Check the connection and session permissions.";
          } catch (cause) { if (!submitted.signal.aborted) error.textContent = String(cause); }
        };
        const update = (next: typeof context) => {
          current = next;
          if (input.value !== next.props.draft) input.value = next.props.draft;
          send.disabled = !next.props.canSend;
        };
        update(context);
        form.append(input, send, error);
        container.append(form);
        return { update, focus: () => input.focus(), dispose: () => form.remove() };
      },
    });
  },
});
`,
		"src/control-ui.css": `.feature-draft-page, .feature-draft-composer { display: grid; gap: 16px; padding: 24px; color: var(--text); }
.feature-draft-page textarea, .feature-draft-composer textarea { min-height: 140px; padding: 12px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font: inherit; }
.feature-draft-page button, .feature-draft-composer button { justify-self: start; padding: 8px 14px; border-radius: 6px; color: var(--accent-foreground, var(--text)); background: var(--accent); border: 0; font: inherit; }
.feature-draft-page output { white-space: pre-wrap; }
`,
		"openclaw.plugin.json": JSON.stringify({
			id: params.id,
			name: params.name,
			description,
			version: "0.1.0",
			configSchema: {
				type: "object",
				properties: {},
				additionalProperties: false
			},
			activation: { onStartup: true },
			contracts: { tools: [toolName] }
		}, null, 2),
		"README.md": `# ${params.name}

This OpenClaw feature plugin includes a typed draft-analysis operation, a model tool, a native page, and a composer replacement. The browser entry owns its DOM and uses the host's standard draft and send operations.

## Build and install

\`\`\`sh
npm install
npm run build
npm run validate
openclaw plugins install .
\`\`\`

Installation applies the plugin in the running local Gateway. If the Gateway is stopped, start it to load the saved installation.

For native UI, enable **Settings > Labs > Custom plugin UI** (\`gateway.controlUi.experimental.customPlugins: true\`), then restart the Gateway and reload the browser tab. This setting is off by default; backend installation does not require it.

Select ${params.name} in the Control UI sidebar. Open **Plugins > Customize UI** and choose Draft composer to try the replacement; choose Built-in to restore it.

For agent-requested activation, run \`npm run pack\`. The receipt contains the exact archive path and SHA-256 digest for \`plugin_activate_artifact\`. Approval applies to those bundled bytes and does not enable Custom plugin UI. The archive has no install scripts or package dependencies; backend activation applies through the running Gateway.

After browser-only changes, run the build again and use **Plugins > Customize UI > Reload plugin UI** as an administrator. After editing installed backend source, run \`openclaw plugins reload ${params.id}\`. Rebuild compiled code before reloading; for a copied installation, reinstall the rebuilt package. Plugin install and update commands apply changes through the running Gateway. Native plugins run trusted code in the Gateway and browser; install only code you trust.

Keep browser imports on the browser-safe \`control-ui\` and \`feature-contract\` SDK entrypoints. Bundle framework dependencies with the plugin. Return a dispose handle for DOM, subscriptions, and other resources; check the view's abort signal after asynchronous work.
`
	};
	for (const [file, text] of Object.entries(files)) fs.writeFileSync(path.join(params.rootDir, file), text.endsWith("\n") ? text : `${text}\n`);
}
//#endregion
//#region src/cli/plugins-authoring-command.ts
const SUPPORTED_PLUGIN_SCAFFOLD_TYPES = [
	"tool",
	"provider",
	"feature"
];
const CLAWHUB_PACKAGE_PUBLISH_WORKFLOW_REF = "9d49df109d4ad3dc8a6ecf05d26b39f46d294721";
const TOOL_PLUGIN_API_RANGE = ">=2026.5.17";
function writeJsonFile(filePath, value) {
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
function normalizeRelativePath(rootDir, targetPath) {
	const relative = path.relative(rootDir, path.resolve(rootDir, targetPath)).replaceAll(path.sep, "/");
	if (relative === ".." || relative.startsWith("../")) throw new Error(`entry must stay inside plugin root: ${targetPath}`);
	return relative.startsWith(".") ? relative : `./${relative}`;
}
function resolveEntryPath(rootDir, entry) {
	if (entry) return path.resolve(rootDir, entry);
	const packagePath = path.join(rootDir, "package.json");
	if (fs.existsSync(packagePath)) {
		const extensionResolution = resolvePackageExtensionEntries(readPluginAuthoringJson(packagePath));
		if (extensionResolution.status === "ok" && extensionResolution.entries[0]) return path.resolve(rootDir, extensionResolution.entries[0]);
	}
	return path.resolve(rootDir, "src/index.ts");
}
function readPackageManifest(rootDir) {
	const packagePath = path.join(rootDir, "package.json");
	if (!fs.existsSync(packagePath)) throw new Error(`package.json not found: ${packagePath}`);
	return readPluginAuthoringJson(packagePath);
}
async function loadToolPlugin(params) {
	if (!fs.existsSync(params.entryPath)) throw new Error(`plugin entry not found: ${normalizeRelativePath(params.rootDir, params.entryPath)}`);
	const loaded = getCachedPluginModuleLoader({
		modulePath: params.entryPath,
		importerUrl: import.meta.url,
		loaderFilename: params.entryPath,
		aliasMap: buildPluginLoaderAliasMap(params.entryPath, process.argv[1], import.meta.url)
	})(toSafeImportPath(params.entryPath));
	const mod = loaded && typeof loaded === "object" ? loaded : void 0;
	const candidate = unwrapDefaultModuleExport(mod?.default ?? mod?.createEntry ?? mod?.entry ?? loaded);
	const entry = await (typeof candidate === "function" ? candidate() : candidate);
	const metadata = getToolPluginMetadata(entry);
	if (!metadata) throw new Error(`plugin entry does not expose tool or feature authoring metadata: ${normalizeRelativePath(params.rootDir, params.entryPath)}`);
	return {
		entry,
		metadata
	};
}
async function runPluginsBuildCommand(opts) {
	const rootDir = path.resolve(opts.root ?? process.cwd());
	const entryPath = resolveEntryPath(rootDir, opts.entry);
	const entryRelative = normalizeRelativePath(rootDir, entryPath);
	const packagePath = path.join(rootDir, "package.json");
	const packageManifest = readPackageManifest(rootDir);
	const { metadata } = await loadToolPlugin({
		rootDir,
		entryPath
	});
	const manifestPath = path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
	const currentManifest = fs.existsSync(manifestPath) ? readPluginAuthoringJson(manifestPath) : void 0;
	const manifest = buildToolPluginManifest({
		metadata,
		packageManifest,
		existingManifest: currentManifest
	});
	const browserSource = controlUiSource(packageManifest);
	if (browserSource) manifest.controlUi = await buildPluginControlUi({
		rootDir,
		source: browserSource,
		check: opts.check
	});
	const nextPackageManifest = buildToolPluginPackageManifest({
		packageManifest,
		entry: entryRelative
	});
	if (opts.check) {
		const currentPackage = readPluginAuthoringJson(packagePath);
		const currentControlUi = withPluginCache(createPluginCache(), () => loadPluginControlUiDeclaration({
			rootDir,
			controlUi: currentManifest?.controlUi,
			rejectHardlinks: false
		}));
		if (browserSource && (!currentControlUi.ok || !jsonSchemaValuesEqual(currentControlUi.value, manifest.controlUi)) || !jsonSchemaValuesEqual(currentManifest, manifest) || !jsonSchemaValuesEqual(currentPackage, nextPackageManifest)) {
			defaultRuntime.error("Generated plugin metadata is out of date. Run openclaw plugins build.");
			return defaultRuntime.exit(1);
		}
		defaultRuntime.log("Plugin metadata is up to date.");
		return;
	}
	const realRootDir = fs.realpathSync(rootDir);
	await replaceFileAtomic({
		filePath: path.join(realRootDir, "package.json"),
		content: `${JSON.stringify(nextPackageManifest, null, 2)}\n`,
		preserveExistingMode: true,
		dirMode: (await fs.promises.stat(realRootDir)).mode & 4095,
		syncTempFile: true,
		syncParentDir: true
	});
	if (browserSource) await (await root(realRootDir, { symlinks: "reject" })).remove(`dist/${PLUGIN_MANIFEST_FILENAME}`, { force: true });
	await writePluginBuildManifest(realRootDir, manifest);
	defaultRuntime.log(`Wrote ${formatCwdRelativePathOrAbsolute(manifestPath, PLUGIN_MANIFEST_FILENAME)}`);
	defaultRuntime.log(`Updated ${formatCwdRelativePathOrAbsolute(packagePath, "package.json")}`);
}
async function collectPluginsValidationResult(opts) {
	const rootDir = path.resolve(opts.root ?? process.cwd());
	const entryPath = resolveEntryPath(rootDir, opts.entry);
	const entryRelative = normalizeRelativePath(rootDir, entryPath);
	const packageManifest = readPackageManifest(rootDir);
	const manifestResult = withPluginCache(createPluginCache(), () => loadPluginManifest(rootDir, false));
	if (!manifestResult.ok) return {
		valid: false,
		errors: [manifestResult.error]
	};
	const manifest = readPluginAuthoringJson(path.join(rootDir, PLUGIN_MANIFEST_FILENAME));
	const { metadata } = await loadToolPlugin({
		rootDir,
		entryPath
	});
	const errors = validateToolPluginProject({
		metadata,
		manifest,
		packageManifest,
		entry: entryRelative
	});
	const browserSource = controlUiSource(packageManifest);
	if (browserSource) {
		const declaration = await buildPluginControlUi({
			rootDir,
			source: browserSource,
			check: true
		});
		if (!jsonSchemaValuesEqual(manifest.controlUi, declaration) || !jsonSchemaValuesEqual(manifestResult.manifest.controlUi, declaration)) errors.push("Control UI manifest is stale. Run openclaw plugins build.");
	}
	if (errors.length > 0) return {
		valid: false,
		pluginId: metadata.id,
		errors
	};
	return {
		valid: true,
		pluginId: metadata.id,
		errors: []
	};
}
async function runPluginsValidateCommand(opts) {
	let result;
	try {
		result = await collectPluginsValidationResult(opts);
	} catch (err) {
		if (!opts.json) throw err;
		const failure = err instanceof Error ? err : String(err);
		result = {
			valid: false,
			errors: [formatCliOperatorError(failure)]
		};
	}
	if (!result.valid) {
		for (const error of result.errors) defaultRuntime.error(error);
		if (opts.json) defaultRuntime.writeJson({
			...result,
			errors: result.errors.map(shortenHomeInString)
		});
		return defaultRuntime.exit(1, opts.json ? { resetStream: process.stderr } : void 0);
	}
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	defaultRuntime.log(`Plugin ${result.pluginId} is valid.`);
}
function resolveScaffoldType(input) {
	const type = input ?? "tool";
	const supported = SUPPORTED_PLUGIN_SCAFFOLD_TYPES.find((candidate) => candidate === type);
	if (supported) return supported;
	throw new Error(`Unsupported plugin scaffold type "${type}". Supported types: ${SUPPORTED_PLUGIN_SCAFFOLD_TYPES.join(", ")}.`);
}
function normalizeRequiredPluginText(input, label) {
	const value = input.trim();
	if (!value) throw new Error(`Plugin ${label} is required.`);
	return value;
}
function titleFromId(id) {
	return id.split(/[-_]/u).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function upperSnakeFromId(id) {
	return id.replace(/[^a-z0-9]+/giu, "_").replace(/^_+|_+$/gu, "").toUpperCase();
}
function lowerCamelFromId(id) {
	return id.split(/-+/u).filter(Boolean).map((part, index) => index === 0 ? part : `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}
const createPluginPackageMetadata = (pluginApi) => ({
	extensions: ["./dist/index.js"],
	compat: { pluginApi },
	build: { openclawVersion: VERSION }
});
function writeScaffoldVitestConfig(rootDir) {
	fs.writeFileSync(path.join(rootDir, "vitest.config.ts"), `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
`);
}
function writeToolPluginScaffold(params) {
	const packageManifest = {
		name: `openclaw-plugin-${params.id}`,
		version: "0.1.0",
		type: "module",
		private: true,
		scripts: {
			build: "tsc -p tsconfig.json",
			"plugin:build": "npm run build && openclaw plugins build --entry ./dist/index.js",
			"plugin:validate": "npm run build && openclaw plugins validate --entry ./dist/index.js",
			test: "vitest run --config ./vitest.config.ts"
		},
		files: [
			"dist",
			"openclaw.plugin.json",
			"README.md"
		],
		peerDependencies: { openclaw: TOOL_PLUGIN_API_RANGE },
		dependencies: { typebox: "^1.1.38" },
		devDependencies: {
			openclaw: "latest",
			typescript: "7.0.2",
			vitest: "^3.2.0"
		},
		openclaw: createPluginPackageMetadata(TOOL_PLUGIN_API_RANGE)
	};
	const idLiteral = JSON.stringify(params.id);
	const description = `Add ${params.name} tools to OpenClaw.`;
	const indexSource = `import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

export default defineToolPlugin({
  id: ${idLiteral},
  name: ${JSON.stringify(params.name)},
  description: ${JSON.stringify(description)},
  tools: (tool) => [
    tool({
      name: "echo",
      description: "Echo input text.",
      parameters: Type.Object({
        input: Type.String({ description: "Text to echo." }),
      }),
      execute: async ({ input }) => ({ input }),
    }),
  ],
});
`;
	const testSource = `import { describe, expect, it } from "vitest";
import entry from "./index.js";
import { getToolPluginMetadata } from "openclaw/plugin-sdk/tool-plugin";

describe(${idLiteral}, () => {
  it("declares tool metadata", () => {
    expect(getToolPluginMetadata(entry)?.tools.map((tool) => tool.name)).toEqual(["echo"]);
  });
});
`;
	const readmeSource = `# ${params.name}

Simple OpenClaw tool plugin.

## Build

\`\`\`bash
npm install
npm run plugin:build
npm run plugin:validate
npm test
\`\`\`
`;
	writeJsonFile(path.join(params.rootDir, "package.json"), packageManifest);
	fs.writeFileSync(path.join(params.rootDir, "src/index.ts"), indexSource);
	fs.writeFileSync(path.join(params.rootDir, "src/index.test.ts"), testSource);
	fs.writeFileSync(path.join(params.rootDir, "README.md"), readmeSource);
	writeJsonFile(path.join(params.rootDir, PLUGIN_MANIFEST_FILENAME), {
		id: params.id,
		name: params.name,
		description,
		version: packageManifest.version,
		configSchema: createConfigSchema(),
		activation: { onStartup: true },
		contracts: { tools: ["echo"] }
	});
}
function writeProviderPluginScaffold(params) {
	const packageName = `openclaw-plugin-${params.id}`;
	const envVar = `${upperSnakeFromId(params.id)}_API_KEY`;
	const optionKey = `${lowerCamelFromId(params.id)}ApiKey`;
	const flagName = `--${params.id}-api-key`;
	const defaultModelId = "example-chat";
	const defaultModelRef = `${params.id}/${defaultModelId}`;
	const description = `Add ${params.name} models to OpenClaw.`;
	const packageManifest = {
		name: packageName,
		version: "0.1.0",
		description: `OpenClaw provider plugin for ${params.name}.`,
		type: "module",
		scripts: {
			build: "tsc -p tsconfig.json",
			test: "vitest run --config ./vitest.config.ts",
			validate: "npm run build && clawhub package validate . --out .clawhub-validation"
		},
		files: [
			"dist",
			"openclaw.plugin.json",
			"README.md"
		],
		peerDependencies: { openclaw: `>=${VERSION}` },
		peerDependenciesMeta: { openclaw: { optional: true } },
		devDependencies: {
			clawhub: "latest",
			openclaw: "latest",
			typescript: "7.0.2",
			vitest: "^3.2.0"
		},
		openclaw: {
			...createPluginPackageMetadata(`>=${VERSION}`),
			install: {
				clawhubSpec: `clawhub:${packageName}`,
				defaultChoice: "clawhub",
				minHostVersion: `>=${VERSION}`
			},
			release: { publishToClawHub: true }
		},
		pluginInspector: {
			version: 1,
			plugin: {
				id: params.id,
				priority: "high",
				seams: ["plugin-runtime"],
				sourceRoot: ".",
				expect: { registrations: ["registerProvider"] }
			}
		}
	};
	const idLiteral = JSON.stringify(params.id);
	const nameLiteral = JSON.stringify(params.name);
	const envVarLiteral = JSON.stringify(envVar);
	const defaultModelIdLiteral = JSON.stringify(defaultModelId);
	const defaultModelRefLiteral = JSON.stringify(defaultModelRef);
	const indexSource = `import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const PLUGIN_ID = ${idLiteral};
const PROVIDER_ID = PLUGIN_ID;
const DEFAULT_MODEL_ID = ${defaultModelIdLiteral};
const DEFAULT_MODEL_REF = ${defaultModelRefLiteral};

export default definePluginEntry({
  id: PLUGIN_ID,
  name: ${nameLiteral},
  description: ${JSON.stringify(description)},
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: ${nameLiteral},
      docsPath: "/providers/${params.id}",
      envVars: [${envVarLiteral}],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: ${JSON.stringify(`${params.name} API key`)},
          hint: "OpenAI-compatible API endpoint",
          optionKey: ${JSON.stringify(optionKey)},
          flagName: ${JSON.stringify(flagName)},
          envVar: ${envVarLiteral},
          promptMessage: ${JSON.stringify(`Enter ${params.name} API key`)},
          defaultModel: DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          noteTitle: ${nameLiteral},
          noteMessage: ${JSON.stringify(`Replace https://api.example.com/v1 with your ${params.name} API base URL.`)},
        }),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) {
            return null;
          }
          const configuredProvider = Object.entries(ctx.config.models?.providers ?? {}).find(
            ([providerId]) => providerId.trim().toLowerCase() === PROVIDER_ID.toLowerCase(),
          )?.[1];
          return {
            provider: {
              api: "openai-completions",
              models: [
                {
                  id: DEFAULT_MODEL_ID,
                  name: "Example Chat",
                  reasoning: false,
                  input: ["text"],
                  cost: {
                    input: 0,
                    output: 0,
                    cacheRead: 0,
                    cacheWrite: 0,
                  },
                  contextWindow: 128000,
                  maxTokens: 8192,
                },
              ],
              apiKey,
              baseUrl: configuredProvider?.baseUrl?.trim() || "https://api.example.com/v1",
            },
          };
        },
      },
    });
  },
});
`;
	const testSource = `import { describe, expect, it } from "vitest";
import type { OpenClawPluginApi, ProviderPlugin } from "openclaw/plugin-sdk/plugin-entry";
import entry from "./index.js";

describe(${idLiteral}, () => {
  it("registers the provider and resolves its authenticated catalog", async () => {
    const providers: ProviderPlugin[] = [];
    const api = {
      registerProvider(provider: ProviderPlugin) {
        providers.push(provider);
      },
    } as Partial<OpenClawPluginApi>;

    entry.register(api as OpenClawPluginApi);

    expect(providers.map((provider) => provider.id)).toEqual([${idLiteral}]);
    expect(providers[0]?.label).toBe(${nameLiteral});
    expect(providers[0]?.envVars).toEqual([${envVarLiteral}]);

    const provider = providers[0];
    if (!provider?.catalog) {
      throw new Error("Generated provider did not register its catalog");
    }
    expect(provider.auth).toMatchObject([
      { id: "api-key", kind: "api_key", starterModel: ${defaultModelRefLiteral} },
    ]);
    for (const [apiKey, configuredId, baseUrl, expectedBaseUrl] of [
      [undefined, ${idLiteral}, "https://configured.example/v1", null],
      ["fixture-api-key", ${JSON.stringify(`${params.id}-unrelated`)}, "https://unrelated.example/v1", "https://api.example.com/v1"],
      ["fixture-api-key", ${JSON.stringify(` ${params.id.toUpperCase()} `)}, " https://configured.example/v1 ", "https://configured.example/v1"],
      ["fixture-api-key", ${idLiteral}, " ", "https://api.example.com/v1"],
    ] as const) {
      const result = await provider.catalog.run({
        config: { models: { providers: { [configuredId]: { baseUrl, models: [] } } } },
        env: {},
        resolveProviderApiKey: () => ({ apiKey }),
        resolveProviderAuth: () => ({ apiKey, mode: "api_key", source: "env" }),
      });
      expect(result).toEqual(
        expectedBaseUrl === null
          ? null
          : {
              provider: {
                api: "openai-completions",
                apiKey,
                baseUrl: expectedBaseUrl,
                models: [{
                  id: ${defaultModelIdLiteral},
                  name: "Example Chat",
                  reasoning: false,
                  input: ["text"],
                  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                  contextWindow: 128000,
                  maxTokens: 8192,
                }],
              },
            },
      );
    }
  });
});
`;
	const readmeSource = `# ${params.name}

OpenClaw provider plugin for ${params.name}.

## Commands

\`\`\`bash
npm install
npm run build
npm test
npm run validate
\`\`\`

\`npm run validate\` builds the plugin and runs \`clawhub package validate . --out .clawhub-validation\`.

## Provider Setup

The generated provider uses an OpenAI-compatible API shape, \`${envVar}\` for API-key auth, and \`https://api.example.com/v1\` as a placeholder base URL. Update \`src/index.ts\` with your provider's real base URL, model list, docs route, and credential copy before publishing.

## First Publish

Install dependencies, log in to the ClawHub CLI, then validate and publish manually once:

\`\`\`bash
npm install
npm exec clawhub -- login
npm run validate
npm exec clawhub -- package publish .
\`\`\`

That first publish creates the ClawHub package and establishes the package managers who can configure trusted publishing.

## Trusted Publishing

After the first publish, configure GitHub Actions OIDC publishing for future releases:

\`\`\`bash
npm exec clawhub -- package trusted-publisher set ${packageName} \\
  --repository <owner>/<repo> \\
  --workflow-filename clawhub-publish.yml
\`\`\`

Future release publishes can run through the manually dispatched \`.github/workflows/clawhub-publish.yml\` action without a long-lived ClawHub token. Run it first with \`dry_run=true\`, then rerun with \`dry_run=false\` after the preview is clean.
`;
	const workflowSource = `name: ClawHub Publish

on:
  workflow_dispatch:
    inputs:
      dry_run:
        description: Preview without publishing
        required: true
        type: boolean
        default: true

jobs:
  publish:
    permissions:
      actions: read
      contents: read
      id-token: write
    uses: openclaw/clawhub/.github/workflows/package-publish.yml@${CLAWHUB_PACKAGE_PUBLISH_WORKFLOW_REF}
    with:
      dry_run: \${{ inputs.dry_run }}
`;
	writeJsonFile(path.join(params.rootDir, "package.json"), packageManifest);
	fs.writeFileSync(path.join(params.rootDir, "src/index.ts"), indexSource);
	fs.writeFileSync(path.join(params.rootDir, "src/index.test.ts"), testSource);
	fs.writeFileSync(path.join(params.rootDir, "README.md"), readmeSource);
	fs.mkdirSync(path.join(params.rootDir, ".github/workflows"), { recursive: true });
	fs.writeFileSync(path.join(params.rootDir, ".github/workflows/clawhub-publish.yml"), workflowSource);
	writeJsonFile(path.join(params.rootDir, PLUGIN_MANIFEST_FILENAME), {
		id: params.id,
		name: params.name,
		description,
		version: packageManifest.version,
		providers: [params.id],
		setup: { providers: [{
			id: params.id,
			envVars: [envVar]
		}] },
		configSchema: createConfigSchema(),
		activation: {
			onStartup: true,
			providers: [params.id],
			capabilities: ["provider"]
		}
	});
}
async function runPluginsInitCommand(idInput, opts) {
	const id = normalizeRequiredPluginText(idInput, "id");
	const name = opts.name ? normalizeRequiredPluginText(opts.name, "display name") : titleFromId(id);
	const type = resolveScaffoldType(opts.type);
	const rootDir = path.resolve(opts.directory ?? id);
	if (opts.force !== true && fs.existsSync(rootDir)) throw new Error(`Refusing to overwrite existing path: ${rootDir}`);
	fs.mkdirSync(path.join(rootDir, "src"), { recursive: true });
	if (type === "feature") writeFeaturePluginScaffold({
		rootDir,
		id,
		name
	});
	else if (type === "provider") writeProviderPluginScaffold({
		rootDir,
		id,
		name
	});
	else writeToolPluginScaffold({
		rootDir,
		id,
		name
	});
	writeJsonFile(path.join(rootDir, "tsconfig.json"), {
		compilerOptions: {
			target: "ES2022",
			module: "NodeNext",
			moduleResolution: "NodeNext",
			strict: true,
			declaration: type === "tool",
			rootDir: "src",
			outDir: "dist",
			skipLibCheck: true
		},
		include: type === "feature" ? ["src/**/*.ts"] : ["src/index.ts"]
	});
	if (type !== "feature") writeScaffoldVitestConfig(rootDir);
	defaultRuntime.log(`Created ${formatCwdRelativePathOrAbsolute(rootDir, ".")}`);
}
//#endregion
export { runPluginsValidateCommand as a, runPluginsInitCommand as i, loadToolPlugin as n, buildPluginBundle as o, runPluginsBuildCommand as r, collectPluginsValidationResult as t };
