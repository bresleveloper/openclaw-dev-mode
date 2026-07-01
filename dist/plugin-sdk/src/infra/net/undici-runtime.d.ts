export declare const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
/** Runtime-loaded undici constructors/functions used where static imports would affect globals. */
export type UndiciRuntimeDeps = {
    Agent: typeof import("undici").Agent;
    EnvHttpProxyAgent: typeof import("undici").EnvHttpProxyAgent;
    FormData?: typeof import("undici").FormData;
    ProxyAgent: typeof import("undici").ProxyAgent;
    fetch: typeof import("undici").fetch;
};
/** Minimal undici surface needed by global-dispatcher installation code. */
export type UndiciGlobalDispatcherDeps = Pick<UndiciRuntimeDeps, "Agent" | "EnvHttpProxyAgent"> & {
    getGlobalDispatcher: typeof import("undici").getGlobalDispatcher;
    setGlobalDispatcher: typeof import("undici").setGlobalDispatcher;
};
type UndiciAgentOptions = ConstructorParameters<UndiciRuntimeDeps["Agent"]>[0];
type UndiciEnvHttpProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["EnvHttpProxyAgent"]>[0];
type UndiciProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["ProxyAgent"]>[0];
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
export declare function loadUndiciRuntimeDeps(): UndiciRuntimeDeps;
/** Loads only the undici global-dispatcher API used by startup proxy setup. */
export declare function loadUndiciGlobalDispatcherDeps(): UndiciGlobalDispatcherDeps;
/** Creates a direct undici Agent with OpenClaw's HTTP/1-only dispatcher policy. */
export declare function createHttp1Agent(options?: UndiciAgentOptions, timeoutMs?: number): import("undici").Agent;
/**
 * Creates an EnvHttpProxyAgent with OpenClaw proxy TLS, IP-safe proxy pools,
 * timeout propagation, and HTTP/1-only dispatch.
 */
export declare function createHttp1EnvHttpProxyAgent(options?: UndiciEnvHttpProxyAgentOptions, timeoutMs?: number): import("undici").EnvHttpProxyAgent;
/**
 * Creates a fixed ProxyAgent with the same HTTP/1, managed TLS, timeout, and
 * IP-safe proxy connection policy used by env proxy dispatchers.
 */
export declare function createHttp1ProxyAgent(options: UndiciProxyAgentOptions, timeoutMs?: number): import("undici").ProxyAgent;
export {};
