/** Render command output with a stable placeholder for empty output. */
export declare function renderExecOutputText(value: string | undefined): string;
/** Render the text shown in exec progress updates, including warnings first. */
export declare function renderExecUpdateText(params: {
    tailText?: string;
    warnings: string[];
}): string;
