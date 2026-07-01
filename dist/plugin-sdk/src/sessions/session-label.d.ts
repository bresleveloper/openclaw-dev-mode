export declare const SESSION_LABEL_MAX_LENGTH = 512;
type ParsedSessionLabel = {
    ok: true;
    label: string;
} | {
    ok: false;
    error: string;
};
export declare function parseSessionLabel(raw: unknown): ParsedSessionLabel;
export {};
