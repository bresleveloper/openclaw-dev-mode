import type { AgentPromptSurfaceKind } from "./types.js";
/** Normalizes legacy prompt surface names to current OpenClaw surface names. */
export declare function normalizeAgentPromptSurfaceKind(surface: AgentPromptSurfaceKind): AgentPromptSurfaceKind;
/** True when a prompt surface targets the main OpenClaw prompt. */
export declare function isOpenClawMainPromptSurface(surface: AgentPromptSurfaceKind): boolean;
