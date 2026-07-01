type PortRange = {
    start: number;
    end: number;
};
/** Derives the browser-CDP sidecar range from the browser-control port when it fits. */
export declare function deriveDefaultBrowserCdpPortRange(browserControlPort: number): PortRange;
export {};
