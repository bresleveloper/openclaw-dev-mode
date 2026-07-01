/** Parsed `/plugins` command variants accepted by auto-reply command handling. */
type PluginsCommand = {
    action: "list";
} | {
    action: "inspect";
    name?: string;
} | {
    action: "install";
    spec: string;
} | {
    action: "enable";
    name: string;
} | {
    action: "disable";
    name: string;
} | {
    action: "error";
    message: string;
};
/** Parses a `/plugin` or `/plugins` command into a closed command action. */
export declare function parsePluginsCommand(raw: string): PluginsCommand | null;
export {};
