/**
 * Local environment probes used by Crestodian overview loading.
 *
 * Probes are bounded by output and timeout limits so setup/status commands do
 * not hang or retain unbounded child output.
 */
/** Result from probing a local command binary. */
export type LocalCommandProbe = {
    command: string;
    found: boolean;
    version?: string;
    error?: string;
};
/** Probe a command by running a small version command with bounded output and timeout. */
export declare function probeLocalCommand(command: string, args?: string[], opts?: {
    outputLimit?: number;
    timeoutKillGraceMs?: number;
    timeoutMs?: number;
}): Promise<LocalCommandProbe>;
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
export declare function probeGatewayUrl(url: string, opts?: {
    timeoutMs?: number;
}): Promise<{
    reachable: boolean;
    url: string;
    error?: string;
}>;
