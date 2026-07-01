/** Browser executable candidate discovered on the host platform. */
export type BrowserExecutable = {
    kind: "brave" | "canary" | "chromium" | "chrome" | "custom" | "edge";
    path: string;
};
/** Resolves the preferred local Chrome-compatible executable for a platform. */
export declare function resolveGoogleChromeExecutableForPlatform(platform: NodeJS.Platform): BrowserExecutable | null;
/** Reads a browser executable version string through the activated browser facade. */
export declare function readBrowserVersion(executablePath: string): string | null;
/** Parses a browser major version from raw command output. */
export declare function parseBrowserMajorVersion(rawVersion: string | null | undefined): number | null;
