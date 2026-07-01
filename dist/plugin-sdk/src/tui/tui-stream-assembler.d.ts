/** Assembles assistant stream deltas and final messages into stable TUI display text. */
export declare class TuiStreamAssembler {
    private runs;
    private getOrCreateRun;
    private updateRunState;
    /** Ingests a streaming delta and returns updated display text only when it changed. */
    ingestDelta(runId: string, message: unknown, showThinking: boolean): string | null;
    /** Finalizes a run, combines any error text, and drops stored stream state. */
    finalize(runId: string, message: unknown, showThinking: boolean, errorMessage?: string): string;
    /** Drops stored stream state for an aborted or discarded run. */
    drop(runId: string): void;
}
