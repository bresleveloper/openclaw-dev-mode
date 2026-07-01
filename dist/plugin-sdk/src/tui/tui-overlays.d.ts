import type { Component, TUI } from "@earendil-works/pi-tui";
type OverlayHost = Pick<TUI, "showOverlay" | "hideOverlay" | "hasOverlay" | "setFocus">;
/** Creates open/close handlers that restore focus when no overlay is active. */
export declare function createOverlayHandlers(host: OverlayHost, fallbackFocus: Component): {
    openOverlay: (component: Component) => void;
    closeOverlay: () => void;
};
export {};
