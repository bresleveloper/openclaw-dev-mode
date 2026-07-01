type BrowserOpenCommand = {
    argv: string[] | null;
    reason?: string;
    command?: string;
};
type BrowserOpenSupport = {
    ok: boolean;
    reason?: string;
    command?: string;
};
/** Resolve the platform command used to open an HTTP(S) URL in a browser. */
export declare function resolveBrowserOpenCommand(): Promise<BrowserOpenCommand>;
/** Report whether browser opening is currently available. */
export declare function detectBrowserOpenSupport(): Promise<BrowserOpenSupport>;
/** Open a safe HTTP(S) URL in the user's browser when the platform supports it. */
export declare function openUrl(url: string): Promise<boolean>;
export {};
