import type { SlashCommand } from "@earendil-works/pi-tui";
import type { CommandEntry } from "../../packages/gateway-protocol/src/index.js";
import type { OpenClawConfig } from "../config/types.js";
export type ParsedCommand = {
    name: string;
    args: string;
};
export type SlashCommandOptions = {
    cfg?: OpenClawConfig;
    provider?: string;
    model?: string;
    thinkingLevels?: Array<{
        id: string;
        label: string;
    }>;
    local?: boolean;
    dynamicCommands?: CommandEntry[];
};
export declare function parseCommand(input: string): ParsedCommand;
export declare function getSlashCommands(options?: SlashCommandOptions): SlashCommand[];
export declare function helpText(options?: SlashCommandOptions): string;
