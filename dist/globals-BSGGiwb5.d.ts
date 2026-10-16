//#region src/globals.d.ts
declare function shouldLogVerbose(): boolean;
declare function logVerbose(message: string): void;
type ThemeFormatter = (value: string) => string;
declare const success: ThemeFormatter;
declare const warn: ThemeFormatter;
declare const info: ThemeFormatter;
declare const danger: ThemeFormatter;
//#endregion
export { success as a, shouldLogVerbose as i, info as n, warn as o, logVerbose as r, danger as t };