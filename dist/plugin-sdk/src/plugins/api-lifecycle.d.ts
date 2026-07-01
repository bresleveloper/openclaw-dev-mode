/** Tracks plugin API lifecycle callbacks registered during runtime activation. */
import type { OpenClawPluginApi } from "./types.js";
type FunctionPropertyNames<T> = Extract<{
    [K in keyof T]-?: Exclude<T[K], undefined> extends (...args: unknown[]) => unknown ? K : never;
}[keyof T], string>;
/** Names of plugin API methods exposed on the OpenClaw plugin API. */
export type PluginApiMethodName = FunctionPropertyNames<OpenClawPluginApi>;
/** Lifecycle policy for whether a plugin API method can be called after registration. */
export type PluginApiLifecyclePolicy = {
    phase: "registration" | "runtime";
    lateCallable: boolean;
};
/** Returns lifecycle policy for one plugin API method name. */
export declare function getPluginApiMethodLifecyclePolicy(methodName: string): PluginApiLifecyclePolicy | undefined;
/** True when a plugin API method remains callable after registration. */
export declare function isLateCallablePluginApiMethod(methodName: string): methodName is PluginApiMethodName;
export {};
