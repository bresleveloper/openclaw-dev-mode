/** Command plus short description tuple used in help epilogues. */
export type HelpExample = readonly [command: string, description: string];
/** Render help examples in stacked or inline comment style. */
export declare function formatHelpExamples(examples: ReadonlyArray<HelpExample>, inline?: boolean): string;
