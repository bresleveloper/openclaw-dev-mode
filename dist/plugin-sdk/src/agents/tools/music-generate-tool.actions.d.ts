/**
 * music_generate action helpers.
 *
 * Handles provider listing, task status, and duplicate-guard output for the music generation tool.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
import { type MediaGenerateActionResult } from "./media-generate-tool-actions-shared.js";
type MusicGenerateActionResult = MediaGenerateActionResult;
/** Builds the music-generation provider listing result shown to the agent. */
export declare function createMusicGenerateListActionResult(config?: OpenClawConfig, options?: {
    workspaceDir?: string;
    agentDir?: string;
    authStore?: AuthProfileStore;
}): MusicGenerateActionResult;
/** Builds status output for the active music-generation task in the current session. */
export declare function createMusicGenerateStatusActionResult(sessionKey?: string): MusicGenerateActionResult;
/** Returns duplicate-guard status output when a matching music task is already active. */
export declare function createMusicGenerateDuplicateGuardResult(sessionKey?: string, params?: {
    prompt?: string;
    requestKey?: string;
}): MusicGenerateActionResult | undefined;
export {};
