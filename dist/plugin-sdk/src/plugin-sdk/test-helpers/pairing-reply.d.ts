/** Extracts and asserts the pairing code block from a pairing reply. */
export declare function extractPairingCode(text: string): string;
/** Verifies the visible pairing reply contains the expected id and approve command. */
export declare function expectPairingReplyText(text: string, params: {
    channel: string;
    idLine: string;
    code?: string;
}): string;
