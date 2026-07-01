/** Minimal select-like params accepted by the prompt styler. */
type SelectParamsLike = {
    message: string;
    options: readonly object[];
};
/** Styling callbacks for prompt messages and hints. */
type PromptSelectStylers = {
    message: (value: string) => string;
    hint: (value: string) => string | undefined;
};
/** Return select params with styled prompt message and per-option hints. */
export declare function styleSelectParams<TParams extends SelectParamsLike>(params: TParams, stylers?: PromptSelectStylers): TParams;
export {};
