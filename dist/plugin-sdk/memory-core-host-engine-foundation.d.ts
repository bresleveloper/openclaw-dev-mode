import { r as OpenClawConfig, zt as MemorySearchConfig } from "../types.openclaw-LzSbb55e.js";
import { a as onInternalSessionTranscriptUpdate, r as resolveSessionTranscriptsDirForAgent } from "../paths-UINMFCfh.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import "../config-CTir7RIz.js";
import { t as resolveStateDir } from "../state-dir-CrCP_VLr.js";
import "../paths-DU1ocwxX.js";
import { o as resolveUserPath } from "../home-dir-zeNXGRsP.js";
import { n as truncateUtf16Safe } from "../utf16-slice-C5Uh1nl-.js";
import { V as root } from "../fs-safe-DBBalKLY.js";
import { c as resolveAgentContextLimits, l as resolveAgentDir, u as resolveAgentWorkspaceDir } from "../agent-scope-D4U2tjwQ.js";
import { n as resolveMemorySearchConfig, r as resolveMemorySearchSyncConfig, t as ResolvedMemorySearchConfig } from "../memory-search-CpX4fand.js";
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