/** Collects text-to-speech secret refs from runtime config. */
import { type ResolverContext, type SecretDefaults } from "./runtime-shared.js";
/** Collects provider API key SecretRefs from a TTS config block. */
export declare function collectTtsApiKeyAssignments(params: {
    tts: Record<string, unknown>;
    pathPrefix: string;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
    active?: boolean;
    inactiveReason?: string;
}): void;
