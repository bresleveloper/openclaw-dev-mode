/** Renders QR text for terminal display, with an optional compact half-block mode. */
export declare function renderQrTerminal(input: string, opts?: {
    small?: boolean;
}): Promise<string>;
