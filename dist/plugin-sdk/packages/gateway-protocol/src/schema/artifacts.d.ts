import { Type } from "typebox";
/** Shared artifact filter payload used by list-style requests. */
export declare const ArtifactQueryParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Artifact lookup payload with a required artifact id plus optional scope filters. */
export declare const ArtifactGetParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    artifactId: Type.TString;
}>;
/** Public artifact metadata returned before or alongside download data. */
export declare const ArtifactSummarySchema: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
        mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
    }>;
}>;
/** List request payload for artifacts visible in the selected scope. */
export declare const ArtifactsListParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
}>;
/** List response containing artifact summaries only. */
export declare const ArtifactsListResultSchema: Type.TObject<{
    artifacts: Type.TArray<Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        title: Type.TString;
        mimeType: Type.TOptional<Type.TString>;
        sizeBytes: Type.TOptional<Type.TInteger>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        messageSeq: Type.TOptional<Type.TInteger>;
        source: Type.TOptional<Type.TString>;
        download: Type.TObject<{
            mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
        }>;
    }>>;
}>;
/** Get request payload for one artifact summary. */
export declare const ArtifactsGetParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    artifactId: Type.TString;
}>;
/** Get response containing one artifact summary. */
export declare const ArtifactsGetResultSchema: Type.TObject<{
    artifact: Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        title: Type.TString;
        mimeType: Type.TOptional<Type.TString>;
        sizeBytes: Type.TOptional<Type.TInteger>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        messageSeq: Type.TOptional<Type.TInteger>;
        source: Type.TOptional<Type.TString>;
        download: Type.TObject<{
            mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
        }>;
    }>;
}>;
/** Download request payload for one artifact. */
export declare const ArtifactsDownloadParamsSchema: Type.TObject<{
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    artifactId: Type.TString;
}>;
/** Download response, either inline base64 bytes, URL, or metadata for unsupported modes. */
export declare const ArtifactsDownloadResultSchema: Type.TObject<{
    artifact: Type.TObject<{
        id: Type.TString;
        type: Type.TString;
        title: Type.TString;
        mimeType: Type.TOptional<Type.TString>;
        sizeBytes: Type.TOptional<Type.TInteger>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        taskId: Type.TOptional<Type.TString>;
        messageSeq: Type.TOptional<Type.TInteger>;
        source: Type.TOptional<Type.TString>;
        download: Type.TObject<{
            mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
        }>;
    }>;
    encoding: Type.TOptional<Type.TLiteral<"base64">>;
    data: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
}>;
