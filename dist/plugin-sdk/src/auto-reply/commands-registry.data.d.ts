import type { ChatCommandDefinition } from "./commands-registry.types.js";
/** Returns the current command registry, including dynamic dock commands for native surfaces. */
export declare function getChatCommands(): ChatCommandDefinition[];
