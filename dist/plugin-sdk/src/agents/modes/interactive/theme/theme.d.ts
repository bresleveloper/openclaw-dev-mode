import type { SourceInfo } from "../../../sessions/source-info.js";
export type ThemeColor = "accent" | "border" | "borderAccent" | "borderMuted" | "success" | "error" | "warning" | "muted" | "dim" | "text" | "thinkingText" | "userMessageText" | "customMessageText" | "customMessageLabel" | "toolTitle" | "toolOutput" | "mdHeading" | "mdLink" | "mdLinkUrl" | "mdCode" | "mdCodeBlock" | "mdCodeBlockBorder" | "mdQuote" | "mdQuoteBorder" | "mdHr" | "mdListBullet" | "toolDiffAdded" | "toolDiffRemoved" | "toolDiffContext" | "syntaxComment" | "syntaxKeyword" | "syntaxFunction" | "syntaxVariable" | "syntaxString" | "syntaxNumber" | "syntaxType" | "syntaxOperator" | "syntaxPunctuation" | "thinkingOff" | "thinkingMinimal" | "thinkingLow" | "thinkingMedium" | "thinkingHigh" | "thinkingXhigh" | "bashMode";
export type ThemeBg = "selectedBg" | "userMessageBg" | "customMessageBg" | "toolPendingBg" | "toolSuccessBg" | "toolErrorBg";
type ColorMode = "truecolor" | "256color";
export declare class Theme {
    readonly name?: string;
    readonly sourcePath?: string;
    sourceInfo?: SourceInfo;
    private fgColors;
    private bgColors;
    private mode;
    constructor(fgColors: Record<ThemeColor, string | number>, bgColors: Record<ThemeBg, string | number>, mode: ColorMode, options?: {
        name?: string;
        sourcePath?: string;
        sourceInfo?: SourceInfo;
    });
    fg(color: ThemeColor, text: string): string;
    bg(color: ThemeBg, text: string): string;
    bold(text: string): string;
    italic(text: string): string;
    underline(text: string): string;
    inverse(text: string): string;
    strikethrough(text: string): string;
    getFgAnsi(color: ThemeColor): string;
    getBgAnsi(color: ThemeBg): string;
    getColorMode(): ColorMode;
    getThinkingBorderColor(level: "off" | "minimal" | "low" | "medium" | "high" | "xhigh"): (str: string) => string;
    getBashModeBorderColor(): (str: string) => string;
}
export declare function loadThemeFromPath(themePath: string, mode?: ColorMode): Theme;
export declare const theme: Theme;
export declare function setTheme(name: string, enableWatcher?: boolean): {
    success: boolean;
    error?: string;
};
export declare function stopThemeWatcher(): void;
/**
 * Highlight code with syntax coloring based on file extension or language.
 * Returns array of highlighted lines.
 */
export declare function highlightCode(code: string, lang?: string): string[];
/**
 * Get language identifier from file path extension.
 */
export declare function getLanguageFromPath(filePath: string): string | undefined;
export {};
