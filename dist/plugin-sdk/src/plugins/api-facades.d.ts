import type { OpenClawPluginApi } from "./types.js";
type PluginApiFacadeFields = Pick<OpenClawPluginApi, "agent" | "lifecycle" | "runContext" | "session">;
/** Plugin API shape without nested facade namespaces attached. */
export type OpenClawPluginApiWithoutFacades = Omit<OpenClawPluginApi, keyof PluginApiFacadeFields>;
type PluginApiFacadeSource = Pick<OpenClawPluginApi, "clearRunContext" | "emitAgentEvent" | "enqueueNextTurnInjection" | "getRunContext" | "registerAgentEventSubscription" | "registerControlUiDescriptor" | "registerRuntimeLifecycle" | "registerSessionAction" | "registerSessionExtension" | "registerSessionSchedulerJob" | "scheduleSessionTurn" | "sendSessionAttachment" | "setRunContext" | "unscheduleSessionTurnsByTag">;
/** Attaches nested facade namespaces to the flat plugin API implementation. */
export declare function attachPluginApiFacades<T extends object>(api: T & PluginApiFacadeSource & Partial<PluginApiFacadeFields>): T & PluginApiFacadeFields;
export {};
