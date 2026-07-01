import type { ShouldHandleTextCommandsParams } from "./commands-registry.types.js";
/** Returns whether a surface can receive provider-native slash commands. */
export declare function isNativeCommandSurface(surface?: string): boolean;
/** Decides whether text slash commands remain active for the current surface/config pair. */
export declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
