type MinimalTheme = {
    dim: (s: string) => string;
    bold: (s: string) => string;
    accentSoft: (s: string) => string;
};
/** Default phrase cycle for animated waiting status. */
export declare const defaultWaitingPhrases: string[];
/** Picks a stable phrase for a timer tick. */
export declare function pickWaitingPhrase(tick: number, phrases?: string[]): string;
/** Applies a moving highlight window to status text. */
export declare function shimmerText(theme: MinimalTheme, text: string, tick: number): string;
/** Builds the single-line waiting status shown while a TUI run is active. */
export declare function buildWaitingStatusMessage(params: {
    theme: MinimalTheme;
    tick: number;
    elapsed: string;
    connectionStatus: string;
    phrases?: string[];
}): string;
export {};
