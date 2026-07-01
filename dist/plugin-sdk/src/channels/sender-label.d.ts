export type SenderLabelParams = {
    name?: string;
    username?: string;
    tag?: string;
    e164?: string;
    id?: string;
};
/** Resolves the best one-line sender label from available identity fields. */
export declare function resolveSenderLabel(params: SenderLabelParams): string | null;
