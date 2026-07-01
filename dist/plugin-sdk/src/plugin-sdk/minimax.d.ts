type FacadeModule = {
    MINIMAX_DEFAULT_MODEL_ID: string;
    MINIMAX_DEFAULT_MODEL_REF: string;
    MINIMAX_TEXT_MODEL_REFS: readonly string[];
};
/** Default MiniMax text model id exposed by the bundled provider facade. */
export declare const MINIMAX_DEFAULT_MODEL_ID: FacadeModule["MINIMAX_DEFAULT_MODEL_ID"];
/** Default MiniMax provider/model reference used by config helpers. */
export declare const MINIMAX_DEFAULT_MODEL_REF: FacadeModule["MINIMAX_DEFAULT_MODEL_REF"];
/** MiniMax text model references advertised by the bundled provider facade. */
export declare const MINIMAX_TEXT_MODEL_REFS: FacadeModule["MINIMAX_TEXT_MODEL_REFS"];
export {};
