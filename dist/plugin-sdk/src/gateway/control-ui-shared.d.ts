declare const CONTROL_UI_AVATAR_PREFIX = "/avatar";
/** Normalizes a Control UI base path to either "" or a leading-slash path without trailing slash. */
export declare function normalizeControlUiBasePath(basePath?: string): string;
/** Builds the gateway-served avatar URL for an agent under the provided base path. */
export declare function buildControlUiAvatarUrl(basePath: string, agentId: string): string;
/** Resolves the assistant avatar URL that Control UI should render for the active agent. */
export declare function resolveAssistantAvatarUrl(params: {
    avatar?: string | null;
    agentId?: string | null;
    basePath?: string;
}): string | undefined;
/** URL prefix for gateway-served Control UI avatar assets. */
export { CONTROL_UI_AVATAR_PREFIX };
