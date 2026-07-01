/** Runs Windows schtasks with bounded timeouts and normalized process results. */
export declare function execSchtasks(args: string[]): Promise<{
    stdout: string;
    stderr: string;
    code: number;
}>;
