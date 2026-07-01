import type { SandboxBackendFactory, SandboxBackendManager, SandboxBackendRegistration, SandboxBackendWorkdirResolver } from "./backend.types.js";
export type { CreateSandboxBackendParams, SandboxBackendFactory, SandboxBackendId, SandboxBackendManager, SandboxBackendRegistration, SandboxBackendRuntimeInfo, SandboxBackendWorkdirResolver, } from "./backend.types.js";
export type { SandboxBackendCommandParams, SandboxBackendCommandResult, SandboxBackendExecSpec, SandboxBackendHandle, } from "./backend-handle.types.js";
/** Register or replace a sandbox backend and return a restore callback. */
export declare function registerSandboxBackend(id: string, registration: SandboxBackendRegistration): () => void;
/** Look up a sandbox backend factory by normalized backend id. */
export declare function getSandboxBackendFactory(id: string): SandboxBackendFactory | null;
/** Look up optional lifecycle management hooks for a registered backend. */
export declare function getSandboxBackendManager(id: string): SandboxBackendManager | null;
/** Look up optional backend workdir resolution that does not start the runtime. */
export declare function getSandboxBackendWorkdirResolver(id: string): SandboxBackendWorkdirResolver | null;
/** Resolve a backend factory or throw the user-facing configuration error. */
export declare function requireSandboxBackendFactory(id: string): SandboxBackendFactory;
