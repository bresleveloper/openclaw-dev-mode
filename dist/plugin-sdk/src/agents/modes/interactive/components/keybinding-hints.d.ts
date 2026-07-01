/**
 * Utilities for formatting keybinding hints in the UI.
 */
import { type Keybinding } from "@earendil-works/pi-tui";
export declare function keyText(keybinding: Keybinding): string;
export declare function keyHint(keybinding: Keybinding, description: string): string;
