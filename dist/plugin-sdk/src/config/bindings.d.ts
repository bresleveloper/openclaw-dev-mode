import type { AgentAcpBinding, AgentBinding, AgentRouteBinding } from "./types.agents.js";
import type { OpenClawConfig } from "./types.openclaw.js";
/** Narrows a configured binding to the channel route form. */
export declare function isRouteBinding(binding: AgentBinding): binding is AgentRouteBinding;
/** Returns the configured binding list, treating missing/non-array config as empty. */
export declare function listConfiguredBindings(cfg: OpenClawConfig): AgentBinding[];
/** Lists channel route bindings, including legacy bindings without an explicit type. */
export declare function listRouteBindings(cfg: OpenClawConfig): AgentRouteBinding[];
/** Lists ACP conversation bindings only. */
export declare function listAcpBindings(cfg: OpenClawConfig): AgentAcpBinding[];
