/** Explain the valid TCP port range with a concrete example. */
export declare function formatPortRangeHint(example?: number): string;
/** Format an invalid CLI port option using the shared port-range hint. */
export declare function formatInvalidPortOption(option: string, example?: number): string;
/** Explain a bad configured port and include the equivalent CLI override. */
export declare function formatInvalidConfigPort(path: string, example?: number): string;
/** Format the standard missing-channel error plus channel-list recovery command. */
export declare function formatUnknownChannelMessage(params: {
    channel: string;
    listCommand?: string;
    purpose?: string;
}): string;
/** Format a channel capability miss with the inspection command for that channel. */
export declare function formatUnsupportedChannelActionMessage(params: {
    channel: string;
    action: string;
    inspectCommand?: string;
}): string;
/** Format strict JSON parsing failures without exposing long untrusted input verbatim. */
export declare function formatStrictJsonParseFailure(params: {
    value: string;
    cause: unknown;
}): string;
/** Normalize gateway failure text and attach the deep-status recovery command. */
export declare function formatGatewayCommandFailure(params: {
    action: string;
    error: unknown;
    inspectCommand?: string;
}): string;
/** Format a generic lookup miss with the list command that can recover it. */
export declare function formatLookupMiss(params: {
    noun: string;
    value: string;
    listCommand: string;
    valueLabel?: string;
}): string;
/** Format a plugin lookup miss with optional ClawHub search guidance. */
export declare function formatMissingPluginMessage(params: {
    id: string;
    listCommand?: string;
    includeSearch?: boolean;
}): string;
