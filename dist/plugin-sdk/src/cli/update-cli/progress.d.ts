import type { UpdateRunResult, UpdateStepProgress } from "../../infra/update-runner.js";
import type { UpdateCommandOptions } from "./shared.js";
/** Convert updater failure reasons and stderr tails into operator-facing recovery hints. */
export declare function inferUpdateFailureHints(result: UpdateRunResult): string[];
/** Runner-facing progress callbacks plus terminal spinner cleanup. */
export type ProgressController = {
    progress: UpdateStepProgress;
    stop: () => void;
};
/** Create a progress adapter for the updater runner without coupling runner code to terminal UI. */
export declare function createUpdateProgress(enabled: boolean): ProgressController;
type PrintResultOptions = UpdateCommandOptions & {
    hideSteps?: boolean;
};
/** Render a completed updater run as JSON or terminal output. */
export declare function printResult(result: UpdateRunResult, opts: PrintResultOptions): void;
export {};
