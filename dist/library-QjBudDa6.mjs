import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as normalizeE164 } from "./utils-DgZn2dLu.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { i as loadConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as handlePortError, n as describePortOwner, r as ensurePortAvailable, t as PortInUseError } from "./ports-D1Nyn7_l.mjs";
import { n as resolveSessionKey, t as deriveSessionKey } from "./session-key-DRL62oER.mjs";
import { t as applyTemplate } from "./templating-CdR59CXd.mjs";
import { t as createDefaultDeps } from "./deps-BPCWhUW0.mjs";
//#region src/cli/wait.ts
function waitForever() {
	setInterval(() => {}, 1e6);
	return new Promise(() => {});
}
//#endregion
//#region src/library.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./reply.runtime.js"));
const loadPromptRuntime = createLazyRuntimeModule(() => import("./prompt-gRQjXOH_.mjs"));
const loadBinariesRuntime = createLazyRuntimeModule(() => import("./binaries-CwAqjmMu.mjs"));
const loadExecRuntime = createLazyRuntimeModule(() => import("./exec-C89-C-hl.mjs"));
const loadWebChannelRuntime = createLazyRuntimeModule(() => import("./runtime-web-channel-plugin-BN1t5r_m.mjs"));
const getReplyFromConfig = async (...args) => (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) => (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) => (await loadWebChannelRuntime()).monitorWebChannel(...args);
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout, runExec, waitForever };
