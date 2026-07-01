type InstallCommandResult = {
    code: number | null;
    stdout: string;
    stderr: string;
};
/** Formats a bounded install failure message from command exit and output. */
export declare function formatInstallFailureMessage(result: InstallCommandResult): string;
export {};
