import type { SessionEntry } from "../config/sessions.js";
/** Format a provider/model pair without duplicating provider prefixes already in the model id. */
export declare function formatProviderModelRef(providerRaw: string, modelRaw: string): string;
type ModelRef = {
    provider: string;
    model: string;
    label: string;
};
/** Compare configured selected model with the active model stored on a session. */
export declare function resolveSelectedAndActiveModel(params: {
    selectedProvider: string;
    selectedModel: string;
    sessionEntry?: Pick<SessionEntry, "modelProvider" | "model">;
}): {
    selected: ModelRef;
    active: ModelRef;
    activeDiffers: boolean;
};
export {};
