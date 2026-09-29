import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { c as normalizeE164 } from "./utils-aKqR_F_U.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { i as loadConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as handlePortError, n as describePortOwner, r as ensurePortAvailable, t as PortInUseError } from "./ports-CDR43XuJ.mjs";
import { n as resolveSessionKey, t as deriveSessionKey } from "./session-key-BiOR3qX7.mjs";
import { t as applyTemplate } from "./templating-DocmBuN3.mjs";
import { t as createDefaultDeps } from "./deps-BNm1BD0Q.mjs";
import { r as saveLegacySessionStore, t as loadLegacySessionStore } from "./state-migrations.legacy-session-store-BJKmjQA9.mjs";
//#region src/cli/wait.ts
function waitForever() {
	setInterval(() => {}, 1e6);
	return new Promise(() => {});
}
//#endregion
//#region src/library.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./reply.runtime.js"));
const loadPromptRuntime = createLazyRuntimeModule(() => import("./prompt-Ce5779pD.mjs"));
const loadBinariesRuntime = createLazyRuntimeModule(() => import("./binaries-DnVECyet.mjs"));
const loadExecRuntime = createLazyRuntimeModule(() => import("./exec-CBexM2Ik.mjs"));
const loadWebChannelRuntime = createLazyRuntimeModule(() => import("./runtime-web-channel-plugin-BkS0X_9p.mjs"));
const getReplyFromConfig = async (...args) => (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) => (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) => (await loadWebChannelRuntime()).monitorWebChannel(...args);
/**
* @deprecated Legacy sessions.json compatibility for package-root consumers.
* Use SQLite-backed session APIs. Remove after 2026-10-12, once the v2026.7.x
* upgrade window no longer requires the legacy doctor importer.
*/
async function saveSessionStore(storePath, store, options) {
	await saveLegacySessionStore(storePath, store, options);
}
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadLegacySessionStore as loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, waitForever };
