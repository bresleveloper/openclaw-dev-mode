/**
 * Live-session model switch control-flow error.
 * Carries the requested provider/model/auth-profile selection out of live
 * session setup code without treating the switch as a failure.
 */
type LiveSessionModelSelection = {
    provider: string;
    model: string;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
};
/** Control-flow error used to request a live session model switch. */
export declare class LiveSessionModelSwitchError extends Error {
    provider: string;
    model: string;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
    constructor(selection: LiveSessionModelSelection);
}
export {};
