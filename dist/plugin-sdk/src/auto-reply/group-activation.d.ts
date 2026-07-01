/** Supported group activation modes. */
export type GroupActivationMode = "mention" | "always";
/** Normalize a raw group activation mode string. */
export declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
/** Parse `/activation` commands from inbound message text. */
export declare function parseActivationCommand(raw?: string): {
    hasCommand: boolean;
    mode?: GroupActivationMode;
};
