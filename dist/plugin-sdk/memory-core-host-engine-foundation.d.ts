import { Kt as MemorySearchConfig, r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { a as onInternalSessionTranscriptUpdate, r as resolveSessionTranscriptsDirForAgent } from "../paths-BfUTg5dU.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import "../config-Dpca5-xX.js";
import { t as resolveStateDir } from "../state-dir-CrCP_VLr.js";
import "../paths-DeeYrQKO.js";
import { n as resolveUserPath } from "../home-dir-BLQZzvXY.js";
import { n as truncateUtf16Safe } from "../utf16-slice-C5Uh1nl-.js";
import "../utils-DhaCU8ER.js";
import { p as root } from "../fs-safe-D1a5zN4L.js";
import { c as resolveAgentContextLimits, l as resolveAgentDir, u as resolveAgentWorkspaceDir } from "../agent-scope-CQBriA71.js";
import { n as resolveMemorySearchConfig, r as resolveMemorySearchSyncConfig, t as ResolvedMemorySearchConfig } from "../memory-search-Cw2OPp4i.js";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/root";
import { isPathInside } from "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/walk";
//#region src/shared/global-singleton.d.ts
type GlobalSingletonLifecycle = "close-and-restart" | "close-only" | "plugin-registry";
type GlobalSingletonReset<T> = (value: T) => void | Promise<void>;
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
export declare function resolveGlobalSingleton<T>(key: symbol, create: () => T, reset?: GlobalSingletonReset<T>, lifecycle?: GlobalSingletonLifecycle): T;
//#endregion
export { type MemorySearchConfig, type OpenClawConfig, type ResolvedMemorySearchConfig, createSubsystemLogger, isPathInside, onInternalSessionTranscriptUpdate, resolveAgentContextLimits, resolveAgentDir, resolveAgentWorkspaceDir, resolveMemorySearchConfig, resolveMemorySearchSyncConfig, resolveSessionTranscriptsDirForAgent, resolveStateDir, resolveUserPath, root, truncateUtf16Safe };