export type TailscaleStatusCommandResult = {
    code: number | null;
    stdout: string;
};
export type TailscaleStatusCommandRunner = (argv: string[], opts: {
    timeoutMs: number;
}) => Promise<TailscaleStatusCommandResult>;
/** Resolves the host published to clients for tailnet or Tailscale Serve gateway modes. */
export declare function resolveTailscalePublishedHost(params: {
    tailscaleMode: string;
    tailnetHost: string | null;
    serviceName?: string | null;
}): string | null;
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
export declare function resolveTailnetHostWithRunner(runCommandWithTimeout?: TailscaleStatusCommandRunner): Promise<string | null>;
