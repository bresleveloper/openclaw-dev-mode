import { Type } from "typebox";
/**
 * Channel and Talk protocol schemas.
 *
 * Talk schemas are consumed by browser realtime clients, gateway relay sessions,
 * and channel adapters, so the mode/transport/brain unions below are shared
 * API vocabulary rather than provider-local implementation details.
 */
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
export declare const TalkModeParamsSchema: Type.TObject<{
    enabled: Type.TBoolean;
    phase: Type.TOptional<Type.TString>;
}>;
/** Reads Talk configuration; secrets are included only for trusted callers. */
export declare const TalkConfigParamsSchema: Type.TObject<{
    includeSecrets: Type.TOptional<Type.TBoolean>;
}>;
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
export declare const TalkSpeakParamsSchema: Type.TObject<{
    text: Type.TString;
    voiceId: Type.TOptional<Type.TString>;
    modelId: Type.TOptional<Type.TString>;
    outputFormat: Type.TOptional<Type.TString>;
    speed: Type.TOptional<Type.TNumber>;
    rateWpm: Type.TOptional<Type.TInteger>;
    stability: Type.TOptional<Type.TNumber>;
    similarity: Type.TOptional<Type.TNumber>;
    style: Type.TOptional<Type.TNumber>;
    speakerBoost: Type.TOptional<Type.TBoolean>;
    seed: Type.TOptional<Type.TInteger>;
    normalize: Type.TOptional<Type.TString>;
    language: Type.TOptional<Type.TString>;
    latencyTier: Type.TOptional<Type.TInteger>;
}>;
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
export declare const TalkEventSchema: Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
    sessionId: Type.TString;
    turnId: Type.TOptional<Type.TString>;
    captureId: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    timestamp: Type.TString;
    mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
    transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
    brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
    provider: Type.TOptional<Type.TString>;
    final: Type.TOptional<Type.TBoolean>;
    callId: Type.TOptional<Type.TString>;
    itemId: Type.TOptional<Type.TString>;
    parentId: Type.TOptional<Type.TString>;
    payload: Type.TUnknown;
}>;
/** Creates a browser-facing Talk client session. */
export declare const TalkClientCreateParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    provider: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    vadThreshold: Type.TOptional<Type.TNumber>;
    silenceDurationMs: Type.TOptional<Type.TInteger>;
    prefixPaddingMs: Type.TOptional<Type.TInteger>;
    reasoningEffort: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
    transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
    brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
}>;
/** Tool-call request from a browser/client session back into the agent runtime. */
export declare const TalkClientToolCallParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    callId: Type.TString;
    name: Type.TString;
    args: Type.TOptional<Type.TUnknown>;
    relaySessionId: Type.TOptional<Type.TString>;
}>;
/** Agent run identity returned after accepting a Talk client tool call. */
export declare const TalkClientToolCallResultSchema: Type.TObject<{
    runId: Type.TString;
    idempotencyKey: Type.TString;
}>;
/** Text steering request for a Talk session bound to an agent turn. */
export declare const TalkClientSteerParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    text: Type.TString;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Result of applying agent control to an embedded or reply-backed Talk run. */
export declare const TalkAgentControlResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    mode: Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>;
    sessionKey: Type.TString;
    sessionId: Type.TOptional<Type.TString>;
    active: Type.TBoolean;
    queued: Type.TOptional<Type.TBoolean>;
    aborted: Type.TOptional<Type.TBoolean>;
    target: Type.TOptional<Type.TUnion<[Type.TLiteral<"embedded_run">, Type.TLiteral<"reply_run">]>>;
    reason: Type.TOptional<Type.TString>;
    message: Type.TString;
    speak: Type.TBoolean;
    show: Type.TBoolean;
    suppress: Type.TBoolean;
    providerResult: Type.TOptional<Type.TObject<{
        status: Type.TLiteral<"cancelled">;
        message: Type.TString;
    }>>;
    enqueuedAtMs: Type.TOptional<Type.TNumber>;
    deliveredAtMs: Type.TOptional<Type.TNumber>;
}>;
/** Joins an existing managed-room Talk session. */
export declare const TalkSessionJoinParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    token: Type.TString;
}>;
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
export declare const TalkSessionCreateParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    provider: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    vadThreshold: Type.TOptional<Type.TNumber>;
    silenceDurationMs: Type.TOptional<Type.TInteger>;
    prefixPaddingMs: Type.TOptional<Type.TInteger>;
    reasoningEffort: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
    transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
    brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
    ttlMs: Type.TOptional<Type.TInteger>;
}>;
/** Appends base64 audio to an active Talk session. */
export declare const TalkSessionAppendAudioParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    audioBase64: Type.TString;
    timestamp: Type.TOptional<Type.TNumber>;
}>;
/** Starts or advances a Talk turn within a session. */
export declare const TalkSessionTurnParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    turnId: Type.TOptional<Type.TString>;
}>;
/** Cancels the active or named Talk turn. */
export declare const TalkSessionCancelTurnParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    turnId: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
}>;
/** Cancels currently streaming Talk output without necessarily ending the turn. */
export declare const TalkSessionCancelOutputParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    turnId: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
}>;
/** Submits a tool result back to a Talk provider session. */
export declare const TalkSessionSubmitToolResultParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    callId: Type.TString;
    result: Type.TUnknown;
    options: Type.TOptional<Type.TObject<{
        suppressResponse: Type.TOptional<Type.TBoolean>;
        willContinue: Type.TOptional<Type.TBoolean>;
    }>>;
}>;
/** Steers a managed Talk session by session id rather than transcript key. */
export declare const TalkSessionSteerParamsSchema: Type.TObject<{
    sessionId: Type.TString;
    sessionKey: Type.TOptional<Type.TString>;
    text: Type.TString;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Closes a gateway-managed Talk session. */
export declare const TalkSessionCloseParamsSchema: Type.TObject<{
    sessionId: Type.TString;
}>;
/** Empty request payload for reading configured Talk provider capabilities. */
export declare const TalkCatalogParamsSchema: Type.TObject<{}>;
/** Provider, mode, transport, and audio-format catalog returned to clients. */
export declare const TalkCatalogResultSchema: Type.TObject<{
    modes: Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
    transports: Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
    brains: Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
    speech: Type.TObject<{
        activeProvider: Type.TOptional<Type.TString>;
        providers: Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
            configured: Type.TBoolean;
            models: Type.TOptional<Type.TArray<Type.TString>>;
            voices: Type.TOptional<Type.TArray<Type.TString>>;
            defaultModel: Type.TOptional<Type.TString>;
            modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
            transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
            brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
            inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            supportsBrowserSession: Type.TOptional<Type.TBoolean>;
            supportsBargeIn: Type.TOptional<Type.TBoolean>;
            supportsToolCalls: Type.TOptional<Type.TBoolean>;
            supportsVideoFrames: Type.TOptional<Type.TBoolean>;
            supportsSessionResumption: Type.TOptional<Type.TBoolean>;
        }>>;
    }>;
    transcription: Type.TObject<{
        activeProvider: Type.TOptional<Type.TString>;
        providers: Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
            configured: Type.TBoolean;
            models: Type.TOptional<Type.TArray<Type.TString>>;
            voices: Type.TOptional<Type.TArray<Type.TString>>;
            defaultModel: Type.TOptional<Type.TString>;
            modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
            transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
            brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
            inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            supportsBrowserSession: Type.TOptional<Type.TBoolean>;
            supportsBargeIn: Type.TOptional<Type.TBoolean>;
            supportsToolCalls: Type.TOptional<Type.TBoolean>;
            supportsVideoFrames: Type.TOptional<Type.TBoolean>;
            supportsSessionResumption: Type.TOptional<Type.TBoolean>;
        }>>;
    }>;
    realtime: Type.TObject<{
        activeProvider: Type.TOptional<Type.TString>;
        providers: Type.TArray<Type.TObject<{
            id: Type.TString;
            label: Type.TString;
            configured: Type.TBoolean;
            models: Type.TOptional<Type.TArray<Type.TString>>;
            voices: Type.TOptional<Type.TArray<Type.TString>>;
            defaultModel: Type.TOptional<Type.TString>;
            modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
            transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
            brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
            inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
                encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
                sampleRateHz: Type.TInteger;
                channels: Type.TInteger;
            }>>>;
            supportsBrowserSession: Type.TOptional<Type.TBoolean>;
            supportsBargeIn: Type.TOptional<Type.TBoolean>;
            supportsToolCalls: Type.TOptional<Type.TBoolean>;
            supportsVideoFrames: Type.TOptional<Type.TBoolean>;
            supportsSessionResumption: Type.TOptional<Type.TBoolean>;
        }>>;
    }>;
}>;
/** Session creation result with transport-specific ids and credentials. */
export declare const TalkSessionCreateResultSchema: Type.TObject<{
    sessionId: Type.TString;
    provider: Type.TOptional<Type.TString>;
    mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
    transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
    brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
    relaySessionId: Type.TOptional<Type.TString>;
    transcriptionSessionId: Type.TOptional<Type.TString>;
    handoffId: Type.TOptional<Type.TString>;
    roomId: Type.TOptional<Type.TString>;
    roomUrl: Type.TOptional<Type.TString>;
    token: Type.TOptional<Type.TString>;
    audio: Type.TOptional<Type.TUnknown>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    expiresAt: Type.TOptional<Type.TNumber>;
}>;
/** Result for a Talk turn request, optionally including emitted events. */
export declare const TalkSessionTurnResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    turnId: Type.TOptional<Type.TString>;
    events: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
        sessionId: Type.TString;
        turnId: Type.TOptional<Type.TString>;
        captureId: Type.TOptional<Type.TString>;
        seq: Type.TInteger;
        timestamp: Type.TString;
        mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
        transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
        brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
        provider: Type.TOptional<Type.TString>;
        final: Type.TOptional<Type.TBoolean>;
        callId: Type.TOptional<Type.TString>;
        itemId: Type.TOptional<Type.TString>;
        parentId: Type.TOptional<Type.TString>;
        payload: Type.TUnknown;
    }>>>;
}>;
/** Managed-room record returned to clients after joining an existing Talk session. */
export declare const TalkSessionJoinResultSchema: Type.TObject<{
    id: Type.TString;
    roomId: Type.TString;
    roomUrl: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TOptional<Type.TString>;
    channel: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    provider: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
    transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
    brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
    createdAt: Type.TNumber;
    expiresAt: Type.TNumber;
    room: Type.TObject<{
        activeClientId: Type.TOptional<Type.TString>;
        activeTurnId: Type.TOptional<Type.TString>;
        recentTalkEvents: Type.TArray<Type.TObject<{
            id: Type.TString;
            type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
            sessionId: Type.TString;
            turnId: Type.TOptional<Type.TString>;
            captureId: Type.TOptional<Type.TString>;
            seq: Type.TInteger;
            timestamp: Type.TString;
            mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
            transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
            brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
            provider: Type.TOptional<Type.TString>;
            final: Type.TOptional<Type.TBoolean>;
            callId: Type.TOptional<Type.TString>;
            itemId: Type.TOptional<Type.TString>;
            parentId: Type.TOptional<Type.TString>;
            payload: Type.TUnknown;
        }>>;
    }>;
}>;
/** Generic success result for Talk session lifecycle calls. */
export declare const TalkSessionOkResultSchema: Type.TObject<{
    ok: Type.TBoolean;
}>;
/** Union of all browser Talk session setup payloads. */
export declare const TalkClientCreateResultSchema: Type.TUnion<[Type.TObject<{
    provider: Type.TString;
    transport: Type.TLiteral<"webrtc">;
    clientSecret: Type.TString;
    offerUrl: Type.TOptional<Type.TString>;
    offerHeaders: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
    provider: Type.TString;
    transport: Type.TLiteral<"provider-websocket">;
    protocol: Type.TString;
    clientSecret: Type.TString;
    websocketUrl: Type.TString;
    audio: Type.TObject<{
        inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        inputSampleRateHz: Type.TInteger;
        outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        outputSampleRateHz: Type.TInteger;
    }>;
    initialMessage: Type.TOptional<Type.TUnknown>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
    provider: Type.TString;
    transport: Type.TLiteral<"gateway-relay">;
    relaySessionId: Type.TString;
    audio: Type.TObject<{
        inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        inputSampleRateHz: Type.TInteger;
        outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        outputSampleRateHz: Type.TInteger;
    }>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
    provider: Type.TString;
    transport: Type.TLiteral<"managed-room">;
    roomUrl: Type.TString;
    token: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    voice: Type.TOptional<Type.TString>;
    expiresAt: Type.TOptional<Type.TNumber>;
}>]>;
/** Full Talk config read result, including related session/UI context. */
export declare const TalkConfigResultSchema: Type.TObject<{
    config: Type.TObject<{
        talk: Type.TOptional<Type.TObject<{
            provider: Type.TOptional<Type.TString>;
            providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
                apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
                    source: Type.TLiteral<"env">;
                    provider: Type.TString;
                    id: Type.TString;
                }>, Type.TObject<{
                    source: Type.TLiteral<"file">;
                    provider: Type.TString;
                    id: Type.TUnsafe<string>;
                }>, Type.TObject<{
                    source: Type.TLiteral<"exec">;
                    provider: Type.TString;
                    id: Type.TString;
                }>]>]>>;
            }>>>;
            realtime: Type.TOptional<Type.TObject<{
                provider: Type.TOptional<Type.TString>;
                providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
                    apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
                        source: Type.TLiteral<"env">;
                        provider: Type.TString;
                        id: Type.TString;
                    }>, Type.TObject<{
                        source: Type.TLiteral<"file">;
                        provider: Type.TString;
                        id: Type.TUnsafe<string>;
                    }>, Type.TObject<{
                        source: Type.TLiteral<"exec">;
                        provider: Type.TString;
                        id: Type.TString;
                    }>]>]>>;
                }>>>;
                model: Type.TOptional<Type.TString>;
                speakerVoice: Type.TOptional<Type.TString>;
                speakerVoiceId: Type.TOptional<Type.TString>;
                voice: Type.TOptional<Type.TString>;
                instructions: Type.TOptional<Type.TString>;
                mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
                transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
                brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
            }>>;
            resolved: Type.TOptional<Type.TObject<{
                provider: Type.TString;
                config: Type.TObject<{
                    apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
                        source: Type.TLiteral<"env">;
                        provider: Type.TString;
                        id: Type.TString;
                    }>, Type.TObject<{
                        source: Type.TLiteral<"file">;
                        provider: Type.TString;
                        id: Type.TUnsafe<string>;
                    }>, Type.TObject<{
                        source: Type.TLiteral<"exec">;
                        provider: Type.TString;
                        id: Type.TString;
                    }>]>]>>;
                }>;
            }>>;
            consultThinkingLevel: Type.TOptional<Type.TString>;
            consultFastMode: Type.TOptional<Type.TBoolean>;
            speechLocale: Type.TOptional<Type.TString>;
            interruptOnSpeech: Type.TOptional<Type.TBoolean>;
            silenceTimeoutMs: Type.TOptional<Type.TInteger>;
        }>>;
        session: Type.TOptional<Type.TObject<{
            mainKey: Type.TOptional<Type.TString>;
        }>>;
        ui: Type.TOptional<Type.TObject<{
            seamColor: Type.TOptional<Type.TString>;
        }>>;
    }>;
}>;
/** Text-to-speech result with encoded audio and provider output metadata. */
export declare const TalkSpeakResultSchema: Type.TObject<{
    audioBase64: Type.TString;
    provider: Type.TString;
    outputFormat: Type.TOptional<Type.TString>;
    voiceCompatible: Type.TOptional<Type.TBoolean>;
    mimeType: Type.TOptional<Type.TString>;
    fileExtension: Type.TOptional<Type.TString>;
}>;
/** Channel status request, optionally probing one channel before returning. */
export declare const ChannelsStatusParamsSchema: Type.TObject<{
    probe: Type.TOptional<Type.TBoolean>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TString>;
}>;
/**
 * Per-account status snapshot for channel docking.
 *
 * This is intentionally schema-light so new channel-specific metadata can ship
 * without a gateway protocol update; known fields stay documented for UI use.
 */
export declare const ChannelAccountSnapshotSchema: Type.TObject<{
    accountId: Type.TString;
    name: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    configured: Type.TOptional<Type.TBoolean>;
    linked: Type.TOptional<Type.TBoolean>;
    running: Type.TOptional<Type.TBoolean>;
    connected: Type.TOptional<Type.TBoolean>;
    reconnectAttempts: Type.TOptional<Type.TInteger>;
    lastConnectedAt: Type.TOptional<Type.TInteger>;
    lastError: Type.TOptional<Type.TString>;
    healthState: Type.TOptional<Type.TString>;
    lastStartAt: Type.TOptional<Type.TInteger>;
    lastStopAt: Type.TOptional<Type.TInteger>;
    lastInboundAt: Type.TOptional<Type.TInteger>;
    lastOutboundAt: Type.TOptional<Type.TInteger>;
    lastTransportActivityAt: Type.TOptional<Type.TInteger>;
    busy: Type.TOptional<Type.TBoolean>;
    activeRuns: Type.TOptional<Type.TInteger>;
    lastRunActivityAt: Type.TOptional<Type.TInteger>;
    lastProbeAt: Type.TOptional<Type.TInteger>;
    mode: Type.TOptional<Type.TString>;
    dmPolicy: Type.TOptional<Type.TString>;
    allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
    tokenSource: Type.TOptional<Type.TString>;
    botTokenSource: Type.TOptional<Type.TString>;
    appTokenSource: Type.TOptional<Type.TString>;
    baseUrl: Type.TOptional<Type.TString>;
    allowUnmentionedGroups: Type.TOptional<Type.TBoolean>;
    cliPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    dbPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    port: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    probe: Type.TOptional<Type.TUnknown>;
    audit: Type.TOptional<Type.TUnknown>;
    application: Type.TOptional<Type.TUnknown>;
}>;
/** UI label and icon metadata for one channel. */
export declare const ChannelUiMetaSchema: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    detailLabel: Type.TString;
    systemImage: Type.TOptional<Type.TString>;
}>;
/** Event-loop health snapshot included with channel status responses. */
export declare const ChannelEventLoopHealthSchema: Type.TObject<{
    degraded: Type.TBoolean;
    reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
    intervalMs: Type.TInteger;
    delayP99Ms: Type.TNumber;
    delayMaxMs: Type.TNumber;
    utilization: Type.TNumber;
    cpuCoreRatio: Type.TNumber;
}>;
/** Full channel status result for dashboard and operator diagnostics. */
export declare const ChannelsStatusResultSchema: Type.TObject<{
    ts: Type.TInteger;
    channelOrder: Type.TArray<Type.TString>;
    channelLabels: Type.TRecord<"^.*$", Type.TString>;
    channelDetailLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    channelSystemImages: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    channelMeta: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        detailLabel: Type.TString;
        systemImage: Type.TOptional<Type.TString>;
    }>>>;
    channels: Type.TRecord<"^.*$", Type.TUnknown>;
    channelAccounts: Type.TRecord<"^.*$", Type.TArray<Type.TObject<{
        accountId: Type.TString;
        name: Type.TOptional<Type.TString>;
        enabled: Type.TOptional<Type.TBoolean>;
        configured: Type.TOptional<Type.TBoolean>;
        linked: Type.TOptional<Type.TBoolean>;
        running: Type.TOptional<Type.TBoolean>;
        connected: Type.TOptional<Type.TBoolean>;
        reconnectAttempts: Type.TOptional<Type.TInteger>;
        lastConnectedAt: Type.TOptional<Type.TInteger>;
        lastError: Type.TOptional<Type.TString>;
        healthState: Type.TOptional<Type.TString>;
        lastStartAt: Type.TOptional<Type.TInteger>;
        lastStopAt: Type.TOptional<Type.TInteger>;
        lastInboundAt: Type.TOptional<Type.TInteger>;
        lastOutboundAt: Type.TOptional<Type.TInteger>;
        lastTransportActivityAt: Type.TOptional<Type.TInteger>;
        busy: Type.TOptional<Type.TBoolean>;
        activeRuns: Type.TOptional<Type.TInteger>;
        lastRunActivityAt: Type.TOptional<Type.TInteger>;
        lastProbeAt: Type.TOptional<Type.TInteger>;
        mode: Type.TOptional<Type.TString>;
        dmPolicy: Type.TOptional<Type.TString>;
        allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
        tokenSource: Type.TOptional<Type.TString>;
        botTokenSource: Type.TOptional<Type.TString>;
        appTokenSource: Type.TOptional<Type.TString>;
        baseUrl: Type.TOptional<Type.TString>;
        allowUnmentionedGroups: Type.TOptional<Type.TBoolean>;
        cliPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        dbPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        port: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        probe: Type.TOptional<Type.TUnknown>;
        audit: Type.TOptional<Type.TUnknown>;
        application: Type.TOptional<Type.TUnknown>;
    }>>>;
    channelDefaultAccountId: Type.TRecord<"^.*$", Type.TString>;
    eventLoop: Type.TOptional<Type.TObject<{
        degraded: Type.TBoolean;
        reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
        intervalMs: Type.TInteger;
        delayP99Ms: Type.TNumber;
        delayMaxMs: Type.TNumber;
        utilization: Type.TNumber;
        cpuCoreRatio: Type.TNumber;
    }>>;
    partial: Type.TOptional<Type.TBoolean>;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Logs out one channel account. */
export declare const ChannelsLogoutParamsSchema: Type.TObject<{
    channel: Type.TString;
    accountId: Type.TOptional<Type.TString>;
}>;
/** Stops one channel account runtime. */
export declare const ChannelsStopParamsSchema: Type.TObject<{
    channel: Type.TString;
    accountId: Type.TOptional<Type.TString>;
}>;
/** Starts one channel account runtime. */
export declare const ChannelsStartParamsSchema: Type.TObject<{
    channel: Type.TString;
    accountId: Type.TOptional<Type.TString>;
}>;
/** Starts browser/web login for a channel account. */
export declare const WebLoginStartParamsSchema: Type.TObject<{
    force: Type.TOptional<Type.TBoolean>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    verbose: Type.TOptional<Type.TBoolean>;
    accountId: Type.TOptional<Type.TString>;
}>;
/** Waits for web login completion or the next QR code. */
export declare const WebLoginWaitParamsSchema: Type.TObject<{
    timeoutMs: Type.TOptional<Type.TInteger>;
    accountId: Type.TOptional<Type.TString>;
    currentQrDataUrl: Type.TOptional<Type.TString>;
}>;
