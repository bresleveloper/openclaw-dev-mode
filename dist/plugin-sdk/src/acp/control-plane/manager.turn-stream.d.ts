/** Normalizes ACP runtime turn event/result streams into manager-facing outcomes. */
import type { AcpRuntime, AcpRuntimeEvent, AcpRuntimeTurnInput } from "@openclaw/acp-core/runtime/types";
/** Mutable gate used to suppress late events after timeout/cancel races. */
type AcpTurnEventGate = {
    open: boolean;
};
/** Summary of whether a turn stream emitted user-visible output or terminal events. */
type AcpTurnStreamOutcome = {
    sawOutput: boolean;
    sawTerminalEvent: boolean;
};
/** Consumes runtime turn APIs and emits normalized events while tracking output/terminal state. */
export declare function consumeAcpTurnStream(params: {
    runtime: AcpRuntime;
    turn: AcpRuntimeTurnInput;
    eventGate: AcpTurnEventGate;
    onEvent?: (event: AcpRuntimeEvent) => Promise<void> | void;
    onOutputEvent?: (event: Extract<AcpRuntimeEvent, {
        type: "text_delta" | "tool_call";
    }>) => Promise<void> | void;
}): Promise<AcpTurnStreamOutcome>;
export {};
