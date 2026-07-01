import type { OutputRuntimeEnv, RuntimeEnv } from "openclaw/plugin-sdk/runtime";
type RuntimeEnvOptions = {
    throwOnExit?: boolean;
};
/** Creates a plugin runtime env with test-safe defaults and optional exit throwing. */
export declare function createRuntimeEnv(options?: RuntimeEnvOptions): OutputRuntimeEnv;
export declare function createTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(options?: RuntimeEnvOptions, _runtimeShape?: (runtime: TRuntime) => void): TRuntime;
export declare function createNonExitingRuntimeEnv(): OutputRuntimeEnv;
export declare function createNonExitingTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(runtimeShape?: (runtime: TRuntime) => void): TRuntime;
export {};
