/** Parses explicit `clawhub:<name>[@version]` package specs for ClawHub installs. */
export declare function parseClawHubPluginSpec(raw: string): {
    name: string;
    version?: string;
    baseUrl?: string;
} | null;
