/** Controller for terminal progress state. */
export type OscProgressController = {
    setIndeterminate: (label: string) => void;
    setPercent: (label: string, percent: number) => void;
    clear: () => void;
};
/** Return true when the terminal is known to support OSC progress messages. */
export declare function supportsOscProgress(env: NodeJS.ProcessEnv, isTty: boolean): boolean;
/** Create a progress controller, returning no-op methods on unsupported terminals. */
export declare function createOscProgressController(params: {
    env: NodeJS.ProcessEnv;
    isTty: boolean;
    write: (chunk: string) => void;
}): OscProgressController;
