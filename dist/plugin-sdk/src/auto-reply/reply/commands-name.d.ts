import type { CommandHandler } from "./commands-types.js";
export declare function parseNameCommand(raw: string): {
    title: string;
} | null;
export declare const handleNameCommand: CommandHandler;
