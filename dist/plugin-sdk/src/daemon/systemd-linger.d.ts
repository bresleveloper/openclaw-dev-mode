type SystemdUserLingerStatus = {
    user: string;
    linger: "yes" | "no";
};
/** Reads systemd user linger status through loginctl when available. */
export declare function readSystemdUserLingerStatus(env: Record<string, string | undefined>): Promise<SystemdUserLingerStatus | null>;
/** Enables systemd user linger through loginctl, with optional sudo mode. */
export declare function enableSystemdUserLinger(params: {
    env: Record<string, string | undefined>;
    user?: string;
    sudoMode?: "prompt" | "non-interactive";
}): Promise<{
    ok: boolean;
    stdout: string;
    stderr: string;
    code: number;
}>;
export {};
