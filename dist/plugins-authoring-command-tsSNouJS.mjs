import{t as formatCwdRelativePathOrAbsolute}from"./safe-cwd-BRF56DNK.mjs";import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{r as filterStringEntries}from"./string-normalization-D_oBUpO3.mjs";import{r as defaultRuntime}from"./runtime-DIcLIHcp.mjs";import{t as parseJsonWithJson5Fallback}from"./parse-json-compat-BEbcOl-a.mjs";import{d as sleepWithAbort,u as retryAsync}from"./src-De06gkOi.mjs";import{i as createPluginCache,w as withPluginCache}from"./plugin-cache-EtAGS18Q.mjs";import{r as terminalText}from"./safe-text-B_QTgn0s.mjs";import{d as shortenHomeInString}from"./utils-CVVNdy3C.mjs";import{x as root}from"./fs-safe-Bxzu1j4h.mjs";import{r as listBuiltRuntimeEntryCandidates}from"./package-entrypoints-QGX6Paeq.mjs";import{a as loadPluginControlUiDeclaration,f as controlUiSource,p as normalizeManifestControlUi,r as loadPluginManifest,t as PLUGIN_MANIFEST_FILENAME}from"./manifest-BybuzSXA.mjs";import{r as resolvePackageExtensionEntries}from"./package-manifest-CMy2j7Hf.mjs";import{t as VERSION}from"./version-oopGZCxg.mjs";import{r as decodeUtf8Input}from"./utf8-input-CiFSnxL0.mjs";import{c as toSafeImportPath,t as getCachedPluginModuleLoader}from"./plugin-module-loader-cache-N3Dpjup8.mjs";import{t as buildPluginLoaderAliasMap}from"./sdk-alias-hNlbJuEC.mjs";import{i as pluginControlUiGenerationHash,n as CONTROL_UI_PLUGIN_MAX_BUILD_BYTES,r as isPluginControlUiAssetPath,t as CONTROL_UI_PLUGIN_MAX_ASSET_BYTES}from"./control-ui-assets-CN6itYqH.mjs";import{i as jsonSchemaValuesEqual}from"./json-schema-BlwsWcBs.mjs";import{n as unwrapDefaultModuleExport}from"./module-export-BuTJede2.mjs";import"./backoff-DRW5tqzp.mjs";import{n as throwExpectedCliError,t as ExpectedCliError}from"./expected-cli-error-oDVmXYil.mjs";import{i as formatCliOperatorError}from"./failure-output-DigaChvV.mjs";import{n as getToolPluginMetadata}from"./tool-plugin-Dml-gUYB.mjs";import{createRequire,isBuiltin}from"node:module";import fs,{existsSync}from"node:fs";import path,{dirname,join,resolve}from"node:path";import fs$1 from"node:fs/promises";import{readRegularFileSync}from"@openclaw/fs-safe/advanced";import{replaceFileAtomic}from"@openclaw/fs-safe/atomic";import{parse as parse$1}from"acorn";
//!src/cli/plugins-authoring-json.ts
function readPluginAuthoringJson(e,t=false){const{buffer:n}=readRegularFileSync({filePath:fs.realpathSync(e)});const r=decodeUtf8Input(n,`JSON file ${e}`);try{return(t?parseJsonWithJson5Fallback:JSON.parse)(r)}catch(t){const n=`Malformed JSON in ${e}`;throw new ExpectedCliError({message:n,humanOutput:n,machineOutput:n,cause:t})}}
//!src/cli/plugins-authoring-metadata.ts
function buildToolPluginManifest(e){const t=isRecord(e.existingManifest?.toolMetadata)?e.existingManifest.toolMetadata:{};const n=e.metadata.tools.map(e=>{const n=t[e.name];const r=isRecord(n)?{...n}:{};if(e.optional)r.optional=true;else delete r.optional;return[e.name,r]}).filter(([,e])=>Object.keys(e).length>0);const r=n.length>0?Object.fromEntries(n):void 0;const i=isRecord(e.existingManifest?.contracts)?e.existingManifest.contracts:{};const{contracts:a,toolMetadata:o,...s}=e.existingManifest??{};const c={...s,id:e.metadata.id,name:e.metadata.name,description:e.metadata.description,version:typeof e.packageManifest.version===`string`?e.packageManifest.version:`0.0.0`,configSchema:e.metadata.configSchema,activation:e.metadata.activation,contracts:{...i,tools:e.metadata.tools.map(e=>e.name)},...r?{toolMetadata:r}:{}};const l=JSON.stringify(c);return JSON.parse(l)}function buildToolPluginPackageManifest(e){const t=isRecord(e.packageManifest.openclaw)?e.packageManifest.openclaw:{};const n=filterStringEntries(t.extensions);const r=path.posix.normalize(e.entry);const matchesSelected=e=>path.posix.normalize(e)===r;const i=Array.isArray(t.runtimeExtensions)?t.runtimeExtensions:[];let a=n.findIndex(matchesSelected);if(a<0)a=i.findIndex(e=>typeof e===`string`&&matchesSelected(e));if(a<0)for(const t of listBuiltRuntimeEntryCandidates(e.entry)){a=n.findIndex(e=>path.posix.normalize(e)===path.posix.normalize(t));if(a>=0)break}if(a<0)a=n.findIndex((e,t)=>!i[t]&&listBuiltRuntimeEntryCandidates(e).some(matchesSelected));if(a<0)n.push(e.entry);else n[a]=e.entry;return{...e.packageManifest,openclaw:{...t,extensions:n}}}function validateToolPluginProject(e){const t=[];const n=buildToolPluginManifest({metadata:e.metadata,packageManifest:e.packageManifest,existingManifest:e.manifest});if(!jsonSchemaValuesEqual(e.manifest,n))t.push(`openclaw.plugin.json generated metadata is stale. Run openclaw plugins build.`);if(e.manifest.id!==e.metadata.id)t.push(`openclaw.plugin.json id (${String(e.manifest.id)}) must match entry id (${e.metadata.id})`);if(!e.manifest.configSchema||typeof e.manifest.configSchema!==`object`)t.push(`openclaw.plugin.json must include object configSchema`);const r=filterStringEntries(isRecord(e.manifest.contracts)?e.manifest.contracts.tools:void 0);const i=e.metadata.tools.map(e=>e.name);const a=i.filter(e=>!r.includes(e));const o=r.filter(e=>!i.includes(e));if(a.length>0)t.push(`openclaw.plugin.json contracts.tools is missing: ${a.join(`, `)}`);if(o.length>0)t.push(`openclaw.plugin.json contracts.tools has no matching defineToolPlugin tool: ${o.join(`, `)}`);const s=resolvePackageExtensionEntries(e.packageManifest);if(s.status!==`ok`)t.push(s.status===`missing`||s.status===`empty`?`package.json must include openclaw.extensions`:s.error);else if(!s.entries.includes(e.entry))t.push(`package.json openclaw.extensions must include ${e.entry}`);return t}function createConfigSchema(){return{type:`object`,additionalProperties:false,properties:{}}}
//!src/cli/plugins-build-solid.ts
function createSolidControlUiBuildPlugin(e){let t;return{name:`control-ui-solid`,setup(n){n.onLoad({filter:/\.tsx$/},async({path:r})=>{const i=await fs$1.readFile(r,`utf8`);if(((i.match(/^(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)*/u)?.[0]??``).match(/@jsxImportSource\s+([^\s*]+)/u)?.[1]??n.initialOptions.jsxImportSource)!==`@solidjs/web`)return;if(!t)try{t=createRequire(path.join(e,`package.json`))(`@solidjs/compiler`)}catch(e){throw new Error(`Install @solidjs/compiler in this plugin's devDependencies to build Solid TSX Control UI sources.`,{cause:e})}return{contents:t.transform(i,{filename:r,generate:`dom`,dev:false,sourceMap:false}).code,loader:`ts`,resolveDir:path.dirname(r)}})}}}
//!src/cli/plugins-build-bundle.ts
const moduleLocationImport=`openclaw-plugin-bundle:module-location`;const runtimeFilesImport=`openclaw-plugin-bundle:runtime-files`;const loadDiagnostics={"unsupported-require-call":`error`,"indirect-require":`error`};function isPluginBundleHostImport(e){return isBuiltin(e)||e===`openclaw`||e.startsWith(`openclaw/`)}async function buildPluginBundle(e){const t=createRequire(join(e.absWorkingDir,`package.json`));let n;try{n=t("esbuild")}catch(e){const t=`Install esbuild in this plugin's devDependencies, then run plugins build again.`;throw new ExpectedCliError({message:t,humanOutput:t,machineOutput:t,cause:e})}const r=e.platform===`node`;const i=r?`Use literal import or require paths and embed runtime resources, or use the regular package-install flow.`:`Use literal browser imports, or provide prebuilt browser assets without package.json openclaw.controlUi.`;const a=r?`metadata as "import.meta", directory as __dirname, filename as __filename, resolve as "require.resolve"`:`resolve as "require.resolve"`;let o;try{o=await n.build({...e,bundle:true,format:`esm`,write:false,metafile:true,minifySyntax:true,logLevel:`silent`,logOverride:{...loadDiagnostics,"unsupported-dynamic-import":`silent`},inject:[moduleLocationImport],plugins:[...!r?[createSolidControlUiBuildPlugin(e.absWorkingDir)]:[],{name:`plugin-bundle`,setup(e){e.onResolve({filter:/^openclaw-plugin-bundle:module-location$/},()=>({path:`module-location`,namespace:`plugin-bundle`,sideEffects:false}));e.onLoad({filter:/.*/,namespace:`plugin-bundle`},()=>({contents:[`export { ${a} } from "${runtimeFilesImport}";`,...r?[`import { createRequire } from "node:module"; export default createRequire(import.meta.url);`]:[]].join(`
`),loader:`js`}));e.onResolve({filter:/^openclaw-plugin-bundle:runtime-files$/},()=>({path:runtimeFilesImport,external:true,sideEffects:false}));if(r){e.onResolve({filter:/.*/},({path:e,kind:t})=>t===`require-call`&&isPluginBundleHostImport(e)?{path:e,namespace:`plugin-bundle-host`}:void 0);e.onLoad({filter:/.*/,namespace:`plugin-bundle-host`},({path:e})=>({contents:isBuiltin(e)?`import load from "${moduleLocationImport}"; module.exports = load(${JSON.stringify(e)});`:`import * as host from ${JSON.stringify(e)}; module.exports = host;`,loader:`js`}))}}}]})}catch(e){if(e instanceof Error&&`errors`in e&&Array.isArray(e.errors)&&e.errors.some(e=>isRecord(e)&&typeof e.id===`string`&&Object.hasOwn(loadDiagnostics,e.id))){const t=`${e.message}\n${i}`;throw new ExpectedCliError({message:t,humanOutput:t,machineOutput:t,cause:e})}throw e}const s=o.metafile.outputs;const c=Object.values(s).flatMap(e=>e.imports);if(c.some(e=>e.path===runtimeFilesImport))throwExpectedCliError(`${r?`Plugin artifacts cannot use module-relative runtime files or require.resolve.`:`Control UI builds cannot use require.resolve.`} ${i}`);const l=new Set(Object.keys(s).map(t=>resolve(e.absWorkingDir,t)));if(c.some(t=>t.external?!r||!isPluginBundleHostImport(t.path):!l.has(resolve(e.absWorkingDir,t.path)))||r&&o.outputFiles.some(e=>!e.path.endsWith(`.js`)))throwExpectedCliError(r?`Plugin artifact must bundle all dependencies into its JavaScript runtime files.`:`Control UI builds must bundle their browser dependencies.`);for(const e of o.outputFiles)if(e.path.endsWith(`.js`)&&hasUnbundledDynamicImport(parse$1(e.text,{ecmaVersion:`latest`,sourceType:`module`}),t=>r&&isPluginBundleHostImport(t)||(t.startsWith(`./`)||t.startsWith(`../`))&&l.has(resolve(dirname(e.path),t))))throwExpectedCliError(`Dynamic imports in plugin builds must use bundled literal paths; a retained import expression in ${e.path} will not be bundled. ${i}`);return o.outputFiles.toSorted((e,t)=>e.path.localeCompare(t.path))}function hasUnbundledDynamicImport(e,t){const n=[e];while(n.length>0){const e=n.pop();if(!isRecord(e))continue;if(e.type===`ImportExpression`){const n=e.source;if(!isRecord(n)||n.type!==`Literal`||typeof n.value!==`string`||!t(n.value))return true}for(const t of Object.values(e))for(const e of Array.isArray(t)?t:[t])n.push(e)}return false}
//!src/cli/plugins-control-ui-chunks.ts
function nameControlUiChunks(e){const t=new Map(e.map(e=>[e.name,e]));const n=/* @__PURE__ */ new Map;for(const r of e){if(!r.name.endsWith(`.js`))continue;const e=[];const i=[parse$1(Buffer.from(r.contents).toString(`utf8`),{ecmaVersion:`latest`,sourceType:`module`})];while(i.length>0){const n=i.pop();if(!isRecord(n))continue;if(n.type===`ImportDeclaration`||n.type===`ExportNamedDeclaration`||n.type===`ExportAllDeclaration`||n.type===`ImportExpression`){const r=n.source;if(isRecord(r)&&r.type===`Literal`&&typeof r.value===`string`&&r.value.startsWith(`./`)&&t.has(r.value.slice(2))&&typeof r.start===`number`&&typeof r.end===`number`)e.push({name:r.value.slice(2),start:r.start,end:r.end})}for(const e of Object.values(n))if(Array.isArray(e))for(const t of e)i.push(t);else i.push(e)}n.set(r.name,e.toSorted((e,t)=>e.start-t.start))}const r=/* @__PURE__ */ new Map;const visit=e=>{if(r.has(e))return;r.set(e,e===`index.js`?e:`chunk-`+r.size+`.js`);for(const t of n.get(e)??[])visit(t.name)};visit(`index.js`);return e.map(e=>{if(!e.name.endsWith(`.js`))return e;const t=r.get(e.name);if(!t)throw new Error(`Control UI JavaScript output is not reachable from its entrypoint.`);let i=Buffer.from(e.contents).toString(`utf8`);for(const t of(n.get(e.name)??[]).toReversed())i=i.slice(0,t.start)+JSON.stringify(`./`+r.get(t.name))+i.slice(t.end);return{name:t,contents:Buffer.from(i)}}).toSorted((e,t)=>e.name.localeCompare(t.name))}
//!src/cli/plugins-control-ui-build.ts
async function writePluginBuildManifest(e,t){const n=await fs$1.realpath(e);await replaceFileAtomic({filePath:path.join(n,PLUGIN_MANIFEST_FILENAME),content:`${JSON.stringify(t,null,2)}\n`,mode:438&~process.umask(),preserveExistingMode:true,dirMode:`preserve`,syncTempFile:true,syncParentDir:true,throwOnCleanupError:true})}async function buildPluginControlUi(e){const t=await fs$1.realpath(e.rootDir);let n;try{n=readPluginAuthoringJson(path.join(t,PLUGIN_MANIFEST_FILENAME),true)}catch(e){if(!isRecord(e)||e.code!==`ENOENT`)throw e;n={}}const r=normalizeManifestControlUi(isRecord(n)?n.controlUi:void 0,isRecord(n)?n.channels:void 0);if(!r.ok)throw new Error(r.error);const i=await fs$1.realpath(path.resolve(t,e.source));const a=path.relative(t,i);if(a.startsWith(`..${path.sep}`)||a===`..`||path.isAbsolute(a))throw new Error(`Control UI source must stay inside the plugin package.`);const o=path.join(t,`dist/control-ui/build`);const s=(await buildPluginBundle({absWorkingDir:t,entryPoints:{index:i},outdir:o,splitting:true,chunkNames:`chunk-[hash]`,platform:`browser`,target:`es2022`,minify:true,legalComments:`none`,sourcemap:false,tsconfigRaw:{compilerOptions:{experimentalDecorators:true,useDefineForClassFields:false}},alias:buildPluginLoaderAliasMap(i,process.argv[1],import.meta.url,`src`)})).map(e=>({name:path.relative(o,e.path),contents:e.contents}));validateControlUiFiles(s);const c=nameControlUiChunks(s);validateControlUiFiles(c);const l=`dist/control-ui/${pluginControlUiGenerationHash(c)}`;const u=path.join(t,l);const d={...r.value?.panelIcon?{panelIcon:r.value.panelIcon}:{},...r.value?.activation?{activation:r.value.activation}:{},...r.value?.settingsViews?{settingsViews:r.value.settingsViews}:{},entry:`${l}/index.js`,...c.some(e=>e.name===`index.css`)?{styles:[`${l}/index.css`]}:{}};if(e.check){for(const e of c)if(!(await fs$1.readFile(path.join(u,e.name)).catch(()=>null))?.equals(Buffer.from(e.contents)))throw new Error(`Control UI build is missing or stale. Run openclaw plugins build.`);return d}const f=path.dirname(u);await fs$1.mkdir(f,{recursive:true});await fs$1.chmod(f,493);const p=await fs$1.mkdtemp(path.join(f,`.build-`));try{for(const e of c)await fs$1.writeFile(path.join(p,e.name),e.contents);await normalizeGenerationPermissions(p,c);try{await retryAsync(()=>fs$1.rename(p,u),{attempts:6,minDelayMs:100,maxDelayMs:1600,sleep:sleepWithAbort,shouldRetry:t=>(e.platform??process.platform)===`win32`&&isRecord(t)&&[`EPERM`,`EBUSY`,`EACCES`].some(e=>t.code===e)&&!existsSync(u)})}catch(e){if(!isRecord(e)||e.code!==`EEXIST`&&e.code!==`ENOTEMPTY`&&e.code!==`EPERM`||!existsSync(u))throw e;for(const t of c)if(!(await fs$1.readFile(path.join(u,t.name))).equals(Buffer.from(t.contents)))throw new Error(`An immutable Control UI build was modified. Remove that build and rebuild.`,{cause:e});await normalizeGenerationPermissions(u,c)}}finally{await fs$1.rm(p,{recursive:true,force:true})}return d}function validateControlUiFiles(e){if(e.length>128)throw new Error(`Control UI builds allow at most ${128} assets.`);if(e.some(e=>e.contents.length>4194304)||e.reduce((e,t)=>e+t.contents.length,0)>8388608)throw new Error(`Control UI builds allow at most 4 MiB per asset and 8 MiB per plugin. Reduce the browser bundle before installing.`);if(!e.some(e=>e.name===`index.js`)||e.some(e=>e.name!==path.basename(e.name)||!isPluginControlUiAssetPath(e.name)))throw new Error(`Control UI build must produce a JavaScript entrypoint and only flat JavaScript/CSS assets.`)}async function normalizeGenerationPermissions(e,t){await fs$1.chmod(e,493);for(const n of t)await fs$1.chmod(path.join(e,n.name),420)}
//!src/cli/plugins-feature-scaffold.ts
function writeFeaturePluginScaffold(e){if(!/^[a-z][a-z0-9-]*$/u.test(e.id))throwExpectedCliError(`Feature plugin ids must start with a lowercase letter and contain lowercase letters, digits, or hyphens.`);fs.mkdirSync(path.join(e.rootDir,`src`),{recursive:true});const t=JSON.stringify;const n=`${e.id.replaceAll(`-`,`_`)}_analyze`;const r=`Analyze drafts with ${e.name} tools and native UI.`;const i={"package.json":JSON.stringify({name:`openclaw-plugin-${e.id}`,version:`0.1.0`,type:`module`,private:true,scripts:{build:`tsc -p tsconfig.json && openclaw plugins build`,validate:`openclaw plugins validate --json`,pack:`openclaw plugins pack --json`},files:[`dist`,`openclaw.plugin.json`,`README.md`],peerDependencies:{openclaw:`>=${VERSION}`},dependencies:{typebox:`^1.3.17`},devDependencies:{openclaw:`latest`,esbuild:`0.28.2`,typescript:`7.0.2`},openclaw:{extensions:[`./dist/index.js`],controlUi:`./src/control-ui.ts`,compat:{pluginApi:`>=${VERSION}`},build:{openclawVersion:VERSION}}},null,2),"src/contract.ts":`import { Type } from "typebox";
import { defineFeatureContract } from "openclaw/plugin-sdk/feature-contract";

export const contract = defineFeatureContract({
  pluginId: ${t(e.id)},
  operations: {
    analyze: {
      kind: "query",
      description: "Count words and lines and list Markdown headings in a draft.",
      input: Type.Object({ text: Type.String({ maxLength: 32000 }) }, { additionalProperties: false }),
      output: Type.Object({ words: Type.Integer(), lines: Type.Integer(), headings: Type.Array(Type.String()) }),
      tool: { name: ${t(n)}, label: "Analyze draft" },
    },
  },
  events: {},
});
`,"src/index.ts":`import { defineFeaturePlugin } from "openclaw/plugin-sdk/feature-plugin";
import { contract } from "./contract.js";

export default defineFeaturePlugin({
  contract,
  name: ${t(e.name)},
  description: ${t(r)},
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
`,"src/control-ui.ts":`import { defineControlUiPlugin } from "openclaw/plugin-sdk/control-ui";
import { createFeatureClient } from "openclaw/plugin-sdk/feature-contract";
import { contract } from "./contract.js";
import "./control-ui.css";

export default defineControlUiPlugin({
  id: contract.pluginId,
  activate(host) {
    host.ui.registerNavigation({ id: "drafts", label: ${t(e.name)}, page: { id: "drafts" }, icon: "fileText" });
    host.ui.registerPage({
      id: "drafts", label: ${t(e.name)},
      mount(container, context) {
        const feature = createFeatureClient(contract, context.host);
        const section = document.createElement("section");
        section.className = "feature-draft-page";
        const heading = document.createElement("h1");
        heading.textContent = ${t(e.name)};
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
`,"src/control-ui.css":`.feature-draft-page, .feature-draft-composer { display: grid; gap: 16px; padding: 24px; color: var(--text); }
.feature-draft-page textarea, .feature-draft-composer textarea { min-height: 140px; padding: 12px; color: var(--text); background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font: inherit; }
.feature-draft-page button, .feature-draft-composer button { justify-self: start; padding: 8px 14px; border-radius: 6px; color: var(--accent-foreground, var(--text)); background: var(--accent); border: 0; font: inherit; }
.feature-draft-page output { white-space: pre-wrap; }
`,"openclaw.plugin.json":JSON.stringify({id:e.id,name:e.name,description:r,version:`0.1.0`,configSchema:{type:`object`,properties:{},additionalProperties:false},activation:{onStartup:true},contracts:{tools:[n]}},null,2),"README.md":`# ${e.name}

This OpenClaw feature plugin includes a typed draft-analysis operation, a model tool, a native page, and a composer replacement. The browser entry owns its DOM and uses the host's standard draft and send operations.

## Build and install

\`\`\`sh
npm install
npm run build
npm run validate
openclaw plugins install .
\`\`\`

Installation applies the plugin in the running local Gateway. If the Gateway is stopped, start it to load the saved installation.

Native UI is available by default once the plugin is enabled, with no Labs opt-in. An existing advanced native UI opt-out remains honored; see https://docs.openclaw.ai/plugins/feature-plugins#enable-custom-plugin-ui.

Select ${e.name} in the Control UI sidebar. Open **Plugins > Customize UI** and choose Draft composer to try the replacement; choose Built-in to restore it.

For agent-requested activation, run \`npm run pack\`. The receipt contains the exact archive path and SHA-256 digest for \`plugin_activate_artifact\`. Approval applies to those bundled bytes, including their native UI; existing advanced native UI opt-outs remain honored. The archive has no install scripts or package dependencies; backend activation applies through the running Gateway.

After browser-only changes, run the build again and use **Plugins > Customize UI > Reload plugin UI** as an administrator. After editing installed backend source, run \`openclaw plugins reload ${e.id}\`. Rebuild compiled code before reloading; for a copied installation, reinstall the rebuilt package. Plugin install and update commands apply changes through the running Gateway. Native plugins run trusted code in the Gateway and browser; install only code you trust.

Keep browser imports on the browser-safe \`control-ui\` and \`feature-contract\` SDK entrypoints. Bundle framework dependencies with the plugin. Return a dispose handle for DOM, subscriptions, and other resources; check the view's abort signal after asynchronous work.
`};for(const[t,n]of Object.entries(i))fs.writeFileSync(path.join(e.rootDir,t),n.endsWith(`
`)?n:`${n}\n`)}
//!src/cli/plugins-authoring-command.ts
const SUPPORTED_PLUGIN_SCAFFOLD_TYPES=[`tool`,`provider`,`feature`];const CLAWHUB_PACKAGE_PUBLISH_WORKFLOW_REF=`9d49df109d4ad3dc8a6ecf05d26b39f46d294721`;const TOOL_PLUGIN_API_RANGE=`>=2026.5.17`;function writeJsonFile(e,t){fs.writeFileSync(e,`${JSON.stringify(t,null,2)}\n`)}function normalizeRelativePath(e,t){const n=path.relative(e,path.resolve(e,t)).replaceAll(path.sep,`/`);if(n===`..`||n.startsWith(`../`))throwExpectedCliError(`entry must stay inside plugin root: ${t}`);return n.startsWith(`.`)?n:`./${n}`}function resolveEntryPath(e,t){if(t)return path.resolve(e,t);const n=path.join(e,`package.json`);if(fs.existsSync(n)){const t=resolvePackageExtensionEntries(readPluginAuthoringJson(n));if(t.status===`ok`&&t.entries[0])return path.resolve(e,t.entries[0])}return path.resolve(e,`src/index.ts`)}function readPackageManifest(e){const t=path.join(e,`package.json`);if(!fs.existsSync(t))throwExpectedCliError(`package.json not found: ${t}`);return readPluginAuthoringJson(t)}async function loadToolPlugin(e){if(!fs.existsSync(e.entryPath))throwExpectedCliError(`plugin entry not found: ${normalizeRelativePath(e.rootDir,e.entryPath)}`);const t=getCachedPluginModuleLoader({modulePath:e.entryPath,importerUrl:import.meta.url,loaderFilename:e.entryPath,aliasMap:buildPluginLoaderAliasMap(e.entryPath,process.argv[1],import.meta.url)})(toSafeImportPath(e.entryPath));const n=t&&typeof t===`object`?t:void 0;const r=unwrapDefaultModuleExport(n?.default??n?.createEntry??n?.entry??t);const i=await(typeof r===`function`?r():r);const a=getToolPluginMetadata(i);if(!a)throwExpectedCliError(`plugin entry does not expose tool or feature authoring metadata: ${normalizeRelativePath(e.rootDir,e.entryPath)}`);return{entry:i,metadata:a}}async function runPluginsBuildCommand(e){const t=path.resolve(e.root??process.cwd());const n=resolveEntryPath(t,e.entry);const r=normalizeRelativePath(t,n);const i=path.join(t,`package.json`);const a=readPackageManifest(t);const{metadata:o}=await loadToolPlugin({rootDir:t,entryPath:n});const s=path.join(t,PLUGIN_MANIFEST_FILENAME);const c=fs.existsSync(s)?readPluginAuthoringJson(s,true):void 0;const l=buildToolPluginManifest({metadata:o,packageManifest:a,existingManifest:c});const u=controlUiSource(a);if(u)l.controlUi=await buildPluginControlUi({rootDir:t,source:u,check:e.check});const d=buildToolPluginPackageManifest({packageManifest:a,entry:r});if(e.check){const e=withPluginCache(createPluginCache(),()=>loadPluginControlUiDeclaration({rootDir:t,controlUi:c?.controlUi,channels:c?.channels,rejectHardlinks:false}));if(u&&(!e.ok||!jsonSchemaValuesEqual(e.value,l.controlUi))||!jsonSchemaValuesEqual(c,l)||!jsonSchemaValuesEqual(a,d)){defaultRuntime.error(`Generated plugin metadata is out of date. Run openclaw plugins build.`);return defaultRuntime.exit(1)}defaultRuntime.log(`Plugin metadata is up to date.`);return}const f=fs.realpathSync(t);await replaceFileAtomic({filePath:path.join(f,`package.json`),content:`${JSON.stringify(d,null,2)}\n`,preserveExistingMode:true,dirMode:`preserve`,syncTempFile:true,syncParentDir:true});if(u)await(await root(f,{symlinks:`reject`})).remove(`dist/${PLUGIN_MANIFEST_FILENAME}`,{force:true});await writePluginBuildManifest(f,l);defaultRuntime.log(terminalText`Wrote ${formatCwdRelativePathOrAbsolute(s,PLUGIN_MANIFEST_FILENAME)}`);defaultRuntime.log(terminalText`Updated ${formatCwdRelativePathOrAbsolute(i,`package.json`)}`)}async function collectPluginsValidationResult(e){const t=path.resolve(e.root??process.cwd());const n=resolveEntryPath(t,e.entry);const r=normalizeRelativePath(t,n);const i=readPackageManifest(t);const a=withPluginCache(createPluginCache(),()=>loadPluginManifest(t,false));if(!a.ok)return{valid:false,errors:[a.error]};const o=readPluginAuthoringJson(path.join(t,PLUGIN_MANIFEST_FILENAME),true);const{metadata:s}=await loadToolPlugin({rootDir:t,entryPath:n});const c=validateToolPluginProject({metadata:s,manifest:o,packageManifest:i,entry:r});const l=controlUiSource(i);if(l){const e=await buildPluginControlUi({rootDir:t,source:l,check:true});if(!jsonSchemaValuesEqual(o.controlUi,e)||!jsonSchemaValuesEqual(a.manifest.controlUi,e))c.push(`Control UI manifest is stale. Run openclaw plugins build.`)}if(c.length>0)return{valid:false,pluginId:s.id,errors:c};return{valid:true,pluginId:s.id,errors:[]}}async function runPluginsValidateCommand(e){let t;try{t=await collectPluginsValidationResult(e)}catch(n){if(!e.json)throw n;const r=n instanceof Error?n:String(n);t={valid:false,errors:[formatCliOperatorError(r)]}}if(!t.valid){for(const e of t.errors)defaultRuntime.error(terminalText`${e}`);if(e.json)defaultRuntime.writeJson({...t,errors:t.errors.map(shortenHomeInString)});return defaultRuntime.exit(1,e.json?{resetStream:process.stderr}:void 0)}if(e.json){defaultRuntime.writeJson(t);return}defaultRuntime.log(terminalText`Plugin ${t.pluginId} is valid.`)}function normalizeRequiredPluginText(e,t){const n=e.trim();if(!n)throwExpectedCliError(`Plugin ${t} is required.`);return n}const createPluginPackageMetadata=e=>({extensions:[`./dist/index.js`],compat:{pluginApi:e},build:{openclawVersion:VERSION}});async function runPluginsInitCommand(e,t){const n=normalizeRequiredPluginText(e,`id`);const r=t.name?normalizeRequiredPluginText(t.name,`display name`):n.split(/[-_]/u).filter(Boolean).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `);const i=t.type??`tool`;const a=SUPPORTED_PLUGIN_SCAFFOLD_TYPES.find(e=>e===i);if(!a)throwExpectedCliError(`Unsupported plugin scaffold type "${i}". Supported types: ${SUPPORTED_PLUGIN_SCAFFOLD_TYPES.join(`, `)}.`);const o=n.startsWith(`@`)?n.replace(`/`,`/openclaw-plugin-`):`openclaw-plugin-${n}`;const s=path.resolve(t.directory??n);if(t.force!==true&&fs.existsSync(s))throwExpectedCliError(`Refusing to overwrite existing path: ${s}`);if(a!==`feature`)fs.mkdirSync(path.join(s,`src`),{recursive:true});if(a===`feature`)writeFeaturePluginScaffold({rootDir:s,id:n,name:r});else if(a===`provider`){const e=n.startsWith(`@`)?n.slice(1).replace(`/`,`-`):n;const t=`${e.replace(/[^a-z0-9]+/giu,`_`).replace(/^_+|_+$/gu,``).toUpperCase()}_API_KEY`;const i=`${e.split(/-+/u).filter(Boolean).map((e,t)=>t===0?e:`${e.charAt(0).toUpperCase()}${e.slice(1)}`).join(``)}ApiKey`;const a=`--${e}-api-key`;const c=`example-chat`;const l=`${e}/${c}`;const u=`Add ${r} models to OpenClaw.`;const d={name:o,version:`0.1.0`,description:`OpenClaw provider plugin for ${r}.`,type:`module`,scripts:{build:`tsc -p tsconfig.json`,test:`vitest run --config ./vitest.config.ts`,validate:`npm run build && clawhub package validate . --out .clawhub-validation`},files:[`dist`,`openclaw.plugin.json`,`README.md`],peerDependencies:{openclaw:`>=${VERSION}`},peerDependenciesMeta:{openclaw:{optional:true}},devDependencies:{clawhub:`latest`,openclaw:`latest`,typescript:`7.0.2`,vitest:`^3.2.0`},openclaw:{...createPluginPackageMetadata(`>=${VERSION}`),install:{clawhubSpec:`clawhub:${o}`,defaultChoice:`clawhub`,minHostVersion:`>=${VERSION}`},release:{publishToClawHub:true}},pluginInspector:{version:1,plugin:{id:n,priority:`high`,seams:[`plugin-runtime`],sourceRoot:`.`,expect:{registrations:[`registerProvider`]}}}};const f=JSON.stringify(n);const p=JSON.stringify(e);const m=JSON.stringify(r);const h=JSON.stringify(t);const g=JSON.stringify(c);const _=JSON.stringify(l);const v=`import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const PLUGIN_ID = ${f};
const PROVIDER_ID = ${p};
const DEFAULT_MODEL_ID = ${g};
const DEFAULT_MODEL_REF = ${_};

export default definePluginEntry({
  id: PLUGIN_ID,
  name: ${m},
  description: ${JSON.stringify(u)},
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: ${m},
      docsPath: "/providers/${e}",
      envVars: [${h}],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: ${JSON.stringify(`${r} API key`)},
          hint: "OpenAI-compatible API endpoint",
          optionKey: ${JSON.stringify(i)},
          flagName: ${JSON.stringify(a)},
          envVar: ${h},
          promptMessage: ${JSON.stringify(`Enter ${r} API key`)},
          defaultModel: DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          noteTitle: ${m},
          noteMessage: ${JSON.stringify(`Replace https://api.example.com/v1 with your ${r} API base URL.`)},
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
`;const y=`import { describe, expect, it } from "vitest";
import type { OpenClawPluginApi, ProviderPlugin } from "openclaw/plugin-sdk/plugin-entry";
import entry from "./index.js";

describe(${f}, () => {
  it("registers the provider and resolves its authenticated catalog", async () => {
    const providers: ProviderPlugin[] = [];
    const api = {
      registerProvider(provider: ProviderPlugin) {
        providers.push(provider);
      },
    } as Partial<OpenClawPluginApi>;

    entry.register(api as OpenClawPluginApi);

    expect(providers.map((provider) => provider.id)).toEqual([${p}]);
    expect(providers[0]?.label).toBe(${m});
    expect(providers[0]?.envVars).toEqual([${h}]);

    const provider = providers[0];
    if (!provider?.catalog) {
      throw new Error("Generated provider did not register its catalog");
    }
    expect(provider.auth).toMatchObject([
      { id: "api-key", kind: "api_key", starterModel: ${_} },
    ]);
    for (const [apiKey, configuredId, baseUrl, expectedBaseUrl] of [
      [undefined, ${p}, "https://configured.example/v1", null],
      ["fixture-api-key", ${JSON.stringify(`${e}-unrelated`)}, "https://unrelated.example/v1", "https://api.example.com/v1"],
      ["fixture-api-key", ${JSON.stringify(` ${e.toUpperCase()} `)}, " https://configured.example/v1 ", "https://configured.example/v1"],
      ["fixture-api-key", ${p}, " ", "https://api.example.com/v1"],
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
                  id: ${g},
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
`;const b=`# ${r}

OpenClaw provider plugin for ${r}.

## Commands

\`\`\`bash
npm install
npm run build
npm test
npm run validate
\`\`\`

\`npm run validate\` builds the plugin and runs \`clawhub package validate . --out .clawhub-validation\`.

## Provider Setup

The generated provider uses an OpenAI-compatible API shape, \`${t}\` for API-key auth, and \`https://api.example.com/v1\` as a placeholder base URL. Update \`src/index.ts\` with your provider's real base URL, model list, docs route, and credential copy before publishing.

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
npm exec clawhub -- package trusted-publisher set ${o} \\
  --repository <owner>/<repo> \\
  --workflow-filename clawhub-publish.yml
\`\`\`

Future release publishes can run through the manually dispatched \`.github/workflows/clawhub-publish.yml\` action without a long-lived ClawHub token. Run it first with \`dry_run=true\`, then rerun with \`dry_run=false\` after the preview is clean.
`;const x=`name: ClawHub Publish

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
`;writeJsonFile(path.join(s,`package.json`),d);fs.writeFileSync(path.join(s,`src/index.ts`),v);fs.writeFileSync(path.join(s,`src/index.test.ts`),y);fs.writeFileSync(path.join(s,`README.md`),b);fs.mkdirSync(path.join(s,`.github/workflows`),{recursive:true});fs.writeFileSync(path.join(s,`.github/workflows/clawhub-publish.yml`),x);writeJsonFile(path.join(s,PLUGIN_MANIFEST_FILENAME),{id:n,name:r,description:u,version:d.version,providers:[e],setup:{providers:[{id:e,envVars:[t]}]},configSchema:createConfigSchema(),activation:{onStartup:true,providers:[e],capabilities:[`provider`]}})}else{const e={name:o,version:`0.1.0`,type:`module`,private:true,scripts:{build:`tsc -p tsconfig.json`,"plugin:build":`npm run build && openclaw plugins build --entry ./dist/index.js`,"plugin:validate":`npm run build && openclaw plugins validate --entry ./dist/index.js`,test:`vitest run --config ./vitest.config.ts`},files:[`dist`,`openclaw.plugin.json`,`README.md`],peerDependencies:{openclaw:TOOL_PLUGIN_API_RANGE},dependencies:{typebox:`^1.1.38`},devDependencies:{openclaw:`latest`,typescript:`7.0.2`,vitest:`^3.2.0`},openclaw:createPluginPackageMetadata(TOOL_PLUGIN_API_RANGE)};const t=JSON.stringify(n);const i=`Add ${r} tools to OpenClaw.`;const a=`import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

export default defineToolPlugin({
  id: ${t},
  name: ${JSON.stringify(r)},
  description: ${JSON.stringify(i)},
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
`;const c=`import { describe, expect, it } from "vitest";
import entry from "./index.js";
import { getToolPluginMetadata } from "openclaw/plugin-sdk/tool-plugin";

describe(${t}, () => {
  it("declares tool metadata", () => {
    expect(getToolPluginMetadata(entry)?.tools.map((tool) => tool.name)).toEqual(["echo"]);
  });
});
`;const l=`# ${r}

Simple OpenClaw tool plugin.

## Build

\`\`\`bash
npm install
npm run plugin:build
npm run plugin:validate
npm test
\`\`\`
`;writeJsonFile(path.join(s,`package.json`),e);fs.writeFileSync(path.join(s,`src/index.ts`),a);fs.writeFileSync(path.join(s,`src/index.test.ts`),c);fs.writeFileSync(path.join(s,`README.md`),l);writeJsonFile(path.join(s,PLUGIN_MANIFEST_FILENAME),{id:n,name:r,description:i,version:e.version,configSchema:createConfigSchema(),activation:{onStartup:true},contracts:{tools:[`echo`]}})}writeJsonFile(path.join(s,`tsconfig.json`),{compilerOptions:{target:`ES2022`,module:`NodeNext`,moduleResolution:`NodeNext`,strict:true,declaration:a===`tool`,rootDir:`src`,outDir:`dist`,skipLibCheck:true},include:a===`feature`?[`src/**/*.ts`]:[`src/index.ts`]});if(a!==`feature`)fs.writeFileSync(path.join(s,`vitest.config.ts`),`import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
`);defaultRuntime.log(terminalText`Created ${formatCwdRelativePathOrAbsolute(s,`.`)}`)}export{runPluginsValidateCommand as a,runPluginsInitCommand as i,loadToolPlugin as n,buildPluginBundle as o,runPluginsBuildCommand as r,collectPluginsValidationResult as t};