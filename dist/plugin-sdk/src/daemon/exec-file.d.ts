/** Child-process wrapper used by daemon installers to preserve stdout/stderr on failure. */
import { type ExecFileOptionsWithStringEncoding } from "node:child_process";
type ExecResult = {
    stdout: string;
    stderr: string;
    code: number;
};
/** Runs a child process as UTF-8 and returns exit data instead of throwing on nonzero exit. */
export declare function execFileUtf8(command: string, args: string[], options?: Omit<ExecFileOptionsWithStringEncoding, "encoding">): Promise<ExecResult>;
export {};
