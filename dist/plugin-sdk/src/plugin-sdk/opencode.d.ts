import { type OpenClawConfig } from "./provider-auth-api-key.js";
export { applyOpencodeZenModelDefault, OPENCODE_ZEN_DEFAULT_MODEL } from "./provider-onboard.js";
/** Build a shared OpenCode API-key auth method for one OpenCode-compatible catalog. */
export declare function createOpencodeCatalogApiKeyAuthMethod(params: {
    /** Provider id for the catalog being configured, such as `opencode` or `opencode-go`. */
    providerId: string;
    /** Human-facing auth method label for this catalog. */
    label: string;
    /** CLI/setup option key that carries the OpenCode API key. */
    optionKey: string;
    /** CLI flag name that maps to the option key. */
    flagName: `--${string}`;
    /** Default model written when this catalog is selected. */
    defaultModel: string;
    /** Provider-specific config patch applied after shared API-key auth succeeds. */
    applyConfig: (cfg: OpenClawConfig) => OpenClawConfig;
    /** Setup note explaining how the shared OpenCode key is reused. */
    noteMessage: string;
    /** Wizard choice id for this catalog. */
    choiceId: string;
    /** Wizard choice label for this catalog. */
    choiceLabel: string;
}): import("./plugin-runtime.ts").ProviderAuthMethod;
