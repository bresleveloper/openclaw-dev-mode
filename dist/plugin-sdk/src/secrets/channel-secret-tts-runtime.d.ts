/** Runtime adapter for channel text-to-speech secret contracts. */
import type { ChannelAccountPredicate, ChannelAccountSurface } from "./channel-secret-basic-runtime.js";
import type { ResolverContext, SecretDefaults } from "./runtime-shared.js";
/** Collects nested TTS provider SecretRefs from channel root and account-specific blocks. */
export declare function collectNestedChannelTtsAssignments(params: {
    /** Channel config key used in runtime warning/assignment paths. */
    channelKey: string;
    /** Nested channel config field that owns the `tts` block, such as `outbound`. */
    nestedKey: string;
    channel: Record<string, unknown>;
    surface: ChannelAccountSurface;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
    /** Whether the top-level nested `tts` block can affect runtime behavior. */
    topLevelActive: boolean;
    topInactiveReason: string;
    /** Per-account activity predicate for account-specific nested `tts` blocks. */
    accountActive: ChannelAccountPredicate;
    accountInactiveReason: string | ((entry: {
        accountId: string;
        account: Record<string, unknown>;
        enabled: boolean;
    }) => string);
}): void;
