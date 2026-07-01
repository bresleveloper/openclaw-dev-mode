import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";
import type { ManagedProxyTlsOptions } from "./proxy-tls.js";
export type ActiveManagedProxyUrl = Readonly<URL>;
/** Managed proxy loopback behavior shared by gateway and child-process fetch paths. */
type ActiveManagedProxyLoopbackMode = NonNullable<NonNullable<ProxyConfig>["loopbackMode"]>;
/** Ref-counted active proxy handle; callers must stop it when their proxy scope ends. */
export type ActiveManagedProxyRegistration = {
    proxyUrl: ActiveManagedProxyUrl;
    loopbackMode: ActiveManagedProxyLoopbackMode;
    proxyTls?: ManagedProxyTlsOptions;
    stopped: boolean;
};
/** Registration metadata for managed proxy URLs and their TLS trust material. */
type RegisterActiveManagedProxyOptions = {
    loopbackMode?: ActiveManagedProxyLoopbackMode;
    proxyTls?: ManagedProxyTlsOptions;
};
/** Registers the active managed proxy, sharing identical nested registrations. */
export declare function registerActiveManagedProxyUrl(proxyUrl: URL, options?: ActiveManagedProxyLoopbackMode | RegisterActiveManagedProxyOptions): ActiveManagedProxyRegistration;
/** Stops one registration scope and clears active proxy state after the last owner. */
export declare function stopActiveManagedProxyRegistration(registration: ActiveManagedProxyRegistration): void;
/** Returns local loopback policy from in-process state or inherited proxy env. */
export declare function getActiveManagedProxyLoopbackMode(): ActiveManagedProxyLoopbackMode | undefined;
/** Returns the in-process managed proxy URL, if this process owns the proxy. */
export declare function getActiveManagedProxyUrl(): ActiveManagedProxyUrl | undefined;
/** Returns the active managed proxy TLS options used by undici/proxyline dispatchers. */
export declare function getActiveManagedProxyTlsOptions(): ManagedProxyTlsOptions | undefined;
/** Clears process-local proxy state for tests that share a worker process. */
export declare function resetActiveManagedProxyStateForTests(): void;
export {};
