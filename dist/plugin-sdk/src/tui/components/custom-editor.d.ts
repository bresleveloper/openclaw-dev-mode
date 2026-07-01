import { Editor } from "@earendil-works/pi-tui";
/** Editor with OpenClaw TUI shortcuts layered on top of pi-tui text editing. */
export declare class CustomEditor extends Editor {
    onEscape?: () => void;
    onCtrlC?: () => void;
    onCtrlD?: () => void;
    onCtrlG?: () => void;
    onCtrlL?: () => void;
    onCtrlO?: () => void;
    onCtrlP?: () => void;
    onCtrlT?: () => void;
    onShiftTab?: () => void;
    onAltEnter?: () => void;
    onAltUp?: () => void;
    /** Dispatches TUI shortcuts before falling back to normal editor input handling. */
    handleInput(data: string): void;
}
