export type CommandTurnKind = "native" | "text-slash" | "normal";
/** Transport-level source labels carried through auto-reply dispatch. */
type CommandTurnSource = "native" | "text" | "message";
type BaseCommandTurnContext = {
    commandName?: string;
    body?: string;
};
type NativeCommandTurnContext = BaseCommandTurnContext & {
    kind: "native";
    source: "native";
    authorized: boolean;
};
type TextSlashCommandTurnContext = BaseCommandTurnContext & {
    kind: "text-slash";
    source: "text";
    authorized: boolean;
};
type NormalCommandTurnContext = BaseCommandTurnContext & {
    kind: "normal";
    source: "message";
    authorized: false;
};
export type CommandTurnContext = NativeCommandTurnContext | TextSlashCommandTurnContext | NormalCommandTurnContext;
/** Loose inbound context shape accepted from channel adapters and tests before normalization. */
export type CommandTurnContextInput = {
    CommandTurn?: unknown;
    CommandSource?: unknown;
    CommandAuthorized?: unknown;
    CommandBody?: unknown;
    BodyForCommands?: unknown;
    RawBody?: unknown;
    Body?: unknown;
    BotUsername?: unknown;
};
/** Maps the internal turn discriminator to the source value used by downstream routing. */
export declare function commandTurnKindToSource(kind: CommandTurnKind): CommandTurnSource;
/** Builds a normalized command-turn context and forces normal messages to unauthorized. */
export declare function createCommandTurnContext(source: CommandTurnSource, input: {
    authorized: boolean;
    commandName?: string;
    body?: string;
}): CommandTurnContext;
/** Normalizes command metadata with a legacy body fallback for older channel contexts. */
export declare function resolveCommandTurnContext(input: CommandTurnContextInput): CommandTurnContext;
/** Returns true for channel-native command turns. */
export declare function isNativeCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true for text slash-command turns regardless of authorization. */
export declare function isTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
export declare function isAuthorizedTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true when a turn was explicitly invoked by a native or authorized text command. */
export declare function isExplicitCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Resolves the target session override allowed only for native command invocations. */
export declare function resolveCommandTurnTargetSessionKey(input: {
    CommandTurn?: CommandTurnContext;
    CommandSource?: unknown;
    CommandAuthorized?: unknown;
    CommandBody?: unknown;
    BodyForCommands?: unknown;
    RawBody?: unknown;
    Body?: unknown;
    CommandTargetSessionKey?: unknown;
}): string | undefined;
export {};
