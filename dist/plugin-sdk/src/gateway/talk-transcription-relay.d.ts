import type { RealtimeTranscriptionProviderPlugin } from "../plugins/types.js";
import type { RealtimeTranscriptionProviderConfig } from "../realtime-transcription/provider-types.js";
import type { GatewayRequestContext } from "./server-methods/shared-types.js";
type CreateTalkTranscriptionRelaySessionParams = {
    context: GatewayRequestContext;
    connId: string;
    provider: RealtimeTranscriptionProviderPlugin;
    providerConfig: RealtimeTranscriptionProviderConfig;
};
type TalkTranscriptionRelaySessionResult = {
    provider: string;
    mode: "transcription";
    transport: "gateway-relay";
    transcriptionSessionId: string;
    audio: {
        inputEncoding: "g711_ulaw";
        inputSampleRateHz: 8000;
    };
    expiresAt: number;
};
/** Creates a transcription relay session and returns its browser audio contract. */
export declare function createTalkTranscriptionRelaySession(params: CreateTalkTranscriptionRelaySessionParams): TalkTranscriptionRelaySessionResult;
/** Streams one base64-encoded audio frame into the owning transcription relay. */
export declare function sendTalkTranscriptionRelayAudio(params: {
    transcriptionSessionId: string;
    connId: string;
    audioBase64: string;
}): void;
/** Commits the current transcription turn and closes the relay. */
export declare function stopTalkTranscriptionRelaySession(params: {
    transcriptionSessionId: string;
    connId: string;
}): void;
/** Cancels the active transcription turn and closes the relay. */
export declare function cancelTalkTranscriptionRelayTurn(params: {
    transcriptionSessionId: string;
    connId: string;
    reason?: string;
}): void;
/** Clears process-local transcription relays between tests. */
export declare function clearTalkTranscriptionRelaySessionsForTest(): void;
export {};
