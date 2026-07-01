/** Resolves webhook numeric options to finite integers with a minimum bound. */
export declare function resolveWebhookIntegerOption(value: number | undefined, fallback: number, params: {
    min: number;
}): number;
