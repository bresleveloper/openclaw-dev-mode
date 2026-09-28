import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCwdRelativePathOrAbsolute } from "./safe-cwd-DOxDm8mD.mjs";
import { f as shortenHomeInString } from "./utils-aKqR_F_U.mjs";
import { s as toSafeImportPath, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { i as resolvePackageExtensionEntries, n as controlUiSource } from "./package-manifest-C8sTeZKW.mjs";
import { t as buildPluginLoaderAliasMap } from "./sdk-alias-DjyX8sAu.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { r as loadPluginManifest, t as PLUGIN_MANIFEST_FILENAME } from "./manifest-DHkEL08H.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { n as jsonSchemaValuesEqual } from "./json-schema-Cq3X13VY.mjs";
import { i as formatCliOperatorError } from "./failure-output-Cct-llrO.mjs";
import { n as getToolPluginMetadata } from "./tool-plugin-odJvsmEs.mjs";
import "./control-ui-assets-CkvqX-YU.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import path, { join } from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/cli/plugins-build-bundle.ts
const moduleLocationImport = "openclaw-plugin-bundle:module-location";
const runtimeFilesImport = "openclaw-plugin-bundle:runtime-files";
const loadDiagnostics = {
	"unsupported-dynamic-import": "error",
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
			logOverride: loadDiagnostics,
			inject: [moduleLocationImport],
			plugins: [{
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
	const imports = Object.values(result.metafile.outputs).flatMap((output) => output.imports);
	if (imports.some((item) => item.path === runtimeFilesImport)) throw new Error(`${backend ? "Plugin artifacts cannot use module-relative runtime files or require.resolve." : "Control UI builds cannot use require.resolve."} ${recovery}`);
	if (imports.some((item) => item.external && (!backend || !isPluginBundleHostImport(item.path))) || backend && result.outputFiles.some((file) => !file.path.endsWith(".js"))) throw new Error(backend ? "Plugin artifact must bundle all dependencies into its JavaScript runtime files." : "Control UI builds must bundle their browser dependencies.");
	return result.outputFiles.toSorted((left, right) => left.path.localeCompare(right.path));
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
	const files = await buildPluginBundle({
		absWorkingDir: rootDir,
		entryPoints: { index: entry },
		outdir: path.join(rootDir, "dist/control-ui/build"),
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
	});
	if (files.some((file) => file.contents.length > 4194304) || files.reduce((total, file) => total + file.contents.length, 0) > 8388608) throw new Error("Control UI builds allow at most 4 MiB per asset and 8 MiB per plugin. Reduce the browser bundle before installing.");
	if (!files.some((file) => path.basename(file.path) === "index.js") || files.some((file) => !["index.js", "index.css"].includes(path.basename(file.path)))) throw new Error("Control UI build must produce a JavaScript entrypoint and optional stylesheet.");
	const hash = createHash("sha256");
	for (const file of files) hash.update(`${path.basename(file.path)}\0${file.contents.length}\0`).update(file.contents);
	const output = `dist/control-ui/${hash.digest("hex")}`;
	const outputDir = path.join(rootDir, output);
	const declaration = {
		entry: `${output}/index.js`,
		...files.some((file) => file.path.endsWith(".css")) ? { styles: [`${output}/index.css`] } : {}
	};
	if (params.check) {
		for (const file of files) if (!(await fs$1.readFile(path.join(outputDir, path.basename(file.path))).catch(() => null))?.equals(Buffer.from(file.contents))) throw new Error("Control UI build is missing or stale. Run openclaw plugins build.");
		return declaration;
	}
	const generations = path.dirname(outputDir);
	await fs$1.mkdir(generations, { recursive: true });
	await fs$1.chmod(generations, 493);
	const staging = await fs$1.mkdtemp(path.join(generations, ".build-"));
	try {
		for (const file of files) await fs$1.writeFile(path.join(staging, path.basename(file.path)), file.contents);
		await normalizeGenerationPermissions(staging, files);
		try {
			await fs$1.rename(staging, outputDir);
		} catch (error) {
			if (!isRecord(error) || error.code !== "EEXIST" && error.code !== "ENOTEMPTY" && error.code !== "EPERM") throw error;
			for (const file of files) if (!(await fs$1.readFile(path.join(outputDir, path.basename(file.path)))).equals(Buffer.from(file.contents))) throw new Error("An immutable Control UI build was modified. Remove that build and rebuild.", { cause: error });
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
	for (const file of files) await fs$1.chmod(path.join(directory, path.basename(file.path)), 420);
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
				typescript: "^5.9.0"
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

This OpenClaw feature plugin includes a typed draft-analysis operation, a model tool, a native page, and a composer replacement. The browser entry owns its DOM and uses the host's canonical draft and send operations.

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
function readJsonFile(filePath) {
	const raw = fs.readFileSync(filePath, "utf8");
	try {
		return JSON.parse(raw);
	} catch (err) {
		throw new Error(`Malformed JSON in ${filePath}`, { cause: err });
	}
}
function writeJsonFile(filePath, value) {
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
function jsStringLiteral(value) {
	return JSON.stringify(value);
}
function normalizeRelativePath(rootDir, targetPath) {
	const relative = path.relative(rootDir, path.resolve(rootDir, targetPath)).replaceAll(path.sep, "/");
	if (relative === ".." || relative.startsWith("../")) throw new Error(`entry must stay inside plugin root: ${targetPath}`);
	return relative.startsWith(".") ? relative : `./${relative}`;
}
function resolveRootDir(input) {
	return path.resolve(input ?? process.cwd());
}
function resolveEntryPath(rootDir, entry) {
	if (entry) return path.resolve(rootDir, entry);
	const packagePath = path.join(rootDir, "package.json");
	if (fs.existsSync(packagePath)) {
		const extensionResolution = resolvePackageExtensionEntries(readJsonFile(packagePath));
		if (extensionResolution.status === "ok" && extensionResolution.entries[0]) return path.resolve(rootDir, extensionResolution.entries[0]);
	}
	return path.resolve(rootDir, "src/index.ts");
}
function readPackageManifest(rootDir) {
	const packagePath = path.join(rootDir, "package.json");
	if (!fs.existsSync(packagePath)) throw new Error(`package.json not found: ${packagePath}`);
	return readJsonFile(packagePath);
}
async function importToolPluginEntry(entryPath) {
	const loaded = getCachedPluginModuleLoader({
		modulePath: entryPath,
		importerUrl: import.meta.url,
		loaderFilename: entryPath,
		aliasMap: buildPluginLoaderAliasMap(entryPath, process.argv[1], import.meta.url)
	})(toSafeImportPath(entryPath));
	const mod = loaded && typeof loaded === "object" ? loaded : void 0;
	const candidate = unwrapDefaultModuleExport(mod?.default ?? mod?.createEntry ?? mod?.entry ?? loaded);
	return typeof candidate === "function" ? candidate() : candidate;
}
async function loadToolPlugin(params) {
	if (!fs.existsSync(params.entryPath)) throw new Error(`plugin entry not found: ${normalizeRelativePath(params.rootDir, params.entryPath)}`);
	const entry = await importToolPluginEntry(params.entryPath);
	const metadata = getToolPluginMetadata(entry);
	if (!metadata) throw new Error(`plugin entry does not expose tool or feature authoring metadata: ${normalizeRelativePath(params.rootDir, params.entryPath)}`);
	return {
		entry,
		metadata
	};
}
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
	const serializedManifest = JSON.stringify(manifest);
	return JSON.parse(serializedManifest);
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
	const openclaw = params.packageManifest.openclaw && typeof params.packageManifest.openclaw === "object" && !Array.isArray(params.packageManifest.openclaw) ? { ...params.packageManifest.openclaw } : {};
	const existingExtensions = Array.isArray(openclaw.extensions) ? openclaw.extensions.filter((entry) => typeof entry === "string") : [];
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
	const manifestContracts = params.manifest.contracts;
	const manifestTools = Array.isArray(manifestContracts?.tools) ? manifestContracts.tools.filter((tool) => typeof tool === "string") : [];
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
async function runPluginsBuildCommand(opts) {
	const rootDir = resolveRootDir(opts.root);
	const entryPath = resolveEntryPath(rootDir, opts.entry);
	const entryRelative = normalizeRelativePath(rootDir, entryPath);
	const packagePath = path.join(rootDir, "package.json");
	const packageManifest = readPackageManifest(rootDir);
	const { metadata } = await loadToolPlugin({
		rootDir,
		entryPath
	});
	const manifestPath = path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
	const currentManifest = fs.existsSync(manifestPath) ? readJsonFile(manifestPath) : void 0;
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
		const currentPackage = readJsonFile(packagePath);
		if (!jsonSchemaValuesEqual(currentManifest, manifest) || !jsonSchemaValuesEqual(currentPackage, nextPackageManifest)) {
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
	await writePluginBuildManifest(realRootDir, manifest);
	defaultRuntime.log(`Wrote ${formatCwdRelativePathOrAbsolute(manifestPath, PLUGIN_MANIFEST_FILENAME)}`);
	defaultRuntime.log(`Updated ${formatCwdRelativePathOrAbsolute(packagePath, "package.json")}`);
}
async function collectPluginsValidationResult(opts) {
	const rootDir = resolveRootDir(opts.root);
	const entryPath = resolveEntryPath(rootDir, opts.entry);
	const entryRelative = normalizeRelativePath(rootDir, entryPath);
	const packageManifest = readPackageManifest(rootDir);
	const manifestResult = loadPluginManifest(rootDir, false);
	if (!manifestResult.ok) return {
		valid: false,
		errors: [manifestResult.error]
	};
	const manifest = readJsonFile(path.join(rootDir, PLUGIN_MANIFEST_FILENAME));
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
		if (!jsonSchemaValuesEqual(manifest.controlUi, declaration)) errors.push("Control UI manifest is stale. Run openclaw plugins build.");
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
function assertCanCreate(filePath, force) {
	if (!force && fs.existsSync(filePath)) throw new Error(`Refusing to overwrite existing path: ${filePath}`);
}
function resolveScaffoldType(input) {
	const type = input ?? "tool";
	if (SUPPORTED_PLUGIN_SCAFFOLD_TYPES.includes(type)) return type;
	throw new Error(`Unsupported plugin scaffold type "${type}". Supported types: ${SUPPORTED_PLUGIN_SCAFFOLD_TYPES.join(", ")}.`);
}
function normalizeDisplayName(input) {
	const name = input.trim();
	if (!name) throw new Error("Plugin display name is required.");
	return name;
}
function normalizePluginId(input) {
	const id = input.trim();
	if (!id) throw new Error("Plugin id is required.");
	return id;
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
function createConfigSchema() {
	return {
		type: "object",
		additionalProperties: false,
		properties: {}
	};
}
const createPluginPackageMetadata = (pluginApi) => ({
	extensions: ["./dist/index.js"],
	compat: { pluginApi },
	build: { openclawVersion: VERSION }
});
function buildScaffoldTsconfig(type) {
	return {
		compilerOptions: {
			target: "ES2022",
			module: "NodeNext",
			moduleResolution: "NodeNext",
			strict: true,
			declaration: type === "tool",
			outDir: "dist",
			skipLibCheck: true
		},
		include: type === "feature" ? ["src/**/*.ts"] : ["src/index.ts"]
	};
}
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
			typescript: "^5.9.0",
			vitest: "^3.2.0"
		},
		openclaw: createPluginPackageMetadata(TOOL_PLUGIN_API_RANGE)
	};
	const idLiteral = jsStringLiteral(params.id);
	const nameLiteral = jsStringLiteral(params.name);
	const description = `Add ${params.name} tools to OpenClaw.`;
	const indexSource = `import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

export default defineToolPlugin({
  id: ${idLiteral},
  name: ${nameLiteral},
  description: ${jsStringLiteral(description)},
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
			typescript: "^5.9.0",
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
	const idLiteral = jsStringLiteral(params.id);
	const nameLiteral = jsStringLiteral(params.name);
	const envVarLiteral = jsStringLiteral(envVar);
	const optionKeyLiteral = jsStringLiteral(optionKey);
	const flagNameLiteral = jsStringLiteral(flagName);
	const defaultModelIdLiteral = jsStringLiteral(defaultModelId);
	const defaultModelRefLiteral = jsStringLiteral(defaultModelRef);
	const descriptionLiteral = jsStringLiteral(description);
	const apiKeyLabelLiteral = jsStringLiteral(`${params.name} API key`);
	const promptMessageLiteral = jsStringLiteral(`Enter ${params.name} API key`);
	const noteMessageLiteral = jsStringLiteral(`Replace https://api.example.com/v1 with your ${params.name} API base URL.`);
	const indexSource = `import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const PLUGIN_ID = ${idLiteral};
const PROVIDER_ID = PLUGIN_ID;
const DEFAULT_MODEL_ID = ${defaultModelIdLiteral};
const DEFAULT_MODEL_REF = ${defaultModelRefLiteral};

export default definePluginEntry({
  id: PLUGIN_ID,
  name: ${nameLiteral},
  description: ${descriptionLiteral},
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
          label: ${apiKeyLabelLiteral},
          hint: "OpenAI-compatible API endpoint",
          optionKey: ${optionKeyLiteral},
          flagName: ${flagNameLiteral},
          envVar: ${envVarLiteral},
          promptMessage: ${promptMessageLiteral},
          defaultModel: DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          noteTitle: ${nameLiteral},
          noteMessage: ${noteMessageLiteral},
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
      ["fixture-api-key", ${jsStringLiteral(`${params.id}-unrelated`)}, "https://unrelated.example/v1", "https://api.example.com/v1"],
      ["fixture-api-key", ${jsStringLiteral(` ${params.id.toUpperCase()} `)}, " https://configured.example/v1 ", "https://configured.example/v1"],
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
	const id = normalizePluginId(idInput);
	const name = opts.name ? normalizeDisplayName(opts.name) : titleFromId(id);
	const type = resolveScaffoldType(opts.type);
	const rootDir = path.resolve(opts.directory ?? id);
	assertCanCreate(rootDir, opts.force === true);
	fs.mkdirSync(path.join(rootDir, "src"), { recursive: true });
	const tsconfig = buildScaffoldTsconfig(type);
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
	writeJsonFile(path.join(rootDir, "tsconfig.json"), tsconfig);
	if (type !== "feature") writeScaffoldVitestConfig(rootDir);
	defaultRuntime.log(`Created ${formatCwdRelativePathOrAbsolute(rootDir, ".")}`);
}
//#endregion
export { runPluginsBuildCommand as a, validateToolPluginProject as c, loadToolPlugin as i, buildPluginBundle as l, buildToolPluginPackageManifest as n, runPluginsInitCommand as o, collectPluginsValidationResult as r, runPluginsValidateCommand as s, buildToolPluginManifest as t };
