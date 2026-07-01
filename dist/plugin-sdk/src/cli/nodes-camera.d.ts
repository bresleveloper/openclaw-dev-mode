/** Camera orientation accepted by node camera commands. */
export type CameraFacing = "front" | "back";
/** Validated still-image payload from `nodes camera snap`. */
export type CameraSnapPayload = {
    format: string;
    base64?: string;
    url?: string;
    width: number;
    height: number;
};
/** Validated video payload from `nodes camera clip`. */
export type CameraClipPayload = {
    format: string;
    base64?: string;
    url?: string;
    durationMs: number;
    hasAudio: boolean;
};
/** Validate and normalize an unknown camera still-image payload. */
export declare function parseCameraSnapPayload(value: unknown): CameraSnapPayload;
/** Validate and normalize an unknown camera clip payload. */
export declare function parseCameraClipPayload(value: unknown): CameraClipPayload;
/** Build a deterministic temp path for a camera artifact. */
export declare function cameraTempPath(opts: {
    kind: "snap" | "clip";
    facing?: CameraFacing;
    ext: string;
    tmpDir?: string;
    id?: string;
}): string;
/** Download a node-hosted media URL to disk after HTTPS, host, redirect, and size checks. */
export declare function writeUrlToFile(filePath: string, url: string, opts: {
    expectedHost: string;
}): Promise<{
    path: string;
    bytes: number;
}>;
/** Decode a base64 media payload to disk with preflight and post-decode size checks. */
export declare function writeBase64ToFile(filePath: string, base64: string, opts?: {
    maxBytes?: number;
}): Promise<{
    path: string;
    bytes: number;
}>;
/** Require the node remote IP needed to validate URL-backed camera payloads. */
export declare function requireNodeRemoteIp(remoteIp?: string): string;
/** Write either a URL-backed or base64-backed camera payload to disk. */
export declare function writeCameraPayloadToFile(params: {
    filePath: string;
    payload: {
        url?: string;
        base64?: string;
    };
    expectedHost?: string;
    invalidPayloadMessage?: string;
}): Promise<void>;
/** Write a camera clip payload to a generated temp file and return its path. */
export declare function writeCameraClipPayloadToFile(params: {
    payload: CameraClipPayload;
    facing: CameraFacing;
    tmpDir?: string;
    id?: string;
    expectedHost?: string;
}): Promise<string>;
