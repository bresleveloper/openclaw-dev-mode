import { type MarkdownIR } from "./ir.js";
/** A rendered chunk paired with the Markdown IR slice that produced it. */
export type RenderedMarkdownChunk<TRendered> = {
    /** Rendered payload for this chunk after caller-specific escaping/link rewriting. */
    rendered: TRendered;
    /** Source IR slice used to produce the rendered payload. */
    source: MarkdownIR;
};
/** Inputs for chunking Markdown IR against the final rendered payload size. */
export type RenderMarkdownIRChunksWithinLimitOptions<TRendered> = {
    /** Parsed Markdown IR to split. */
    ir: MarkdownIR;
    /** Maximum measured size for each rendered chunk. */
    limit: number;
    /** Returns the size unit enforced by the target transport. */
    measureRendered: (rendered: TRendered) => number;
    /** Renders a candidate IR slice for measuring and final output. */
    renderChunk: (ir: MarkdownIR) => TRendered;
};
/** Chunks Markdown IR by rendered size while preserving styles, links, and whitespace. */
export declare function renderMarkdownIRChunksWithinLimit<TRendered>(options: RenderMarkdownIRChunksWithinLimitOptions<TRendered>): RenderedMarkdownChunk<TRendered>[];
