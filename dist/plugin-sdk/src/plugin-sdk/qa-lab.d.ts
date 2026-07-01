type FacadeModule = {
    isQaLabCliAvailable: () => boolean;
    registerQaLabCli: (program: unknown) => void;
};
/** Register QA Lab CLI commands when the bundled QA Lab facade is present. */
export declare const registerQaLabCli: FacadeModule["registerQaLabCli"];
/** Returns whether the QA Lab CLI facade can be loaded in this package build. */
export declare const isQaLabCliAvailable: FacadeModule["isQaLabCliAvailable"];
export {};
