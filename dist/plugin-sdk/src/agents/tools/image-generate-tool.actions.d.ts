/**
 * image_generate action helpers.
 *
 * Handles provider listing, task status, and duplicate-guard output for the image generation tool.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
import { type MediaGenerateActionResult } from "./media-generate-tool-actions-shared.js";
type ImageGenerateActionResult = MediaGenerateActionResult;
/** Builds the image-generation provider listing result shown to the agent. */
export declare function createImageGenerateListActionResult(params: {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    authStore?: AuthProfileStore;
}): ImageGenerateActionResult;
/** Builds status output for active image-generation tasks in the current session. */
export declare function createImageGenerateStatusActionResult(sessionKey?: string): ImageGenerateActionResult;
/** Returns duplicate-guard status output when a matching image task is already active. */
export declare function createImageGenerateDuplicateGuardResult(sessionKey?: string, params?: {
    prompt?: string;
    requestKey?: string;
}): ImageGenerateActionResult | undefined;
export {};
