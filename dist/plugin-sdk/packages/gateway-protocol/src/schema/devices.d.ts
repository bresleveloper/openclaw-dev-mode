import { Type } from "typebox";
/**
 * Device pairing and token-management protocol schemas.
 *
 * These payloads cross the gateway approval boundary, so request ids and device
 * ids stay explicit and feature handlers own the authorization checks.
 */
/** Lists pending and approved device pairing records. */
export declare const DevicePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending pairing request by request id. */
export declare const DevicePairApproveParamsSchema: Type.TObject<{
    requestId: Type.TString;
}>;
/** Rejects a pending pairing request by request id. */
export declare const DevicePairRejectParamsSchema: Type.TObject<{
    requestId: Type.TString;
}>;
/** Removes an approved or remembered device by device id. */
export declare const DevicePairRemoveParamsSchema: Type.TObject<{
    deviceId: Type.TString;
}>;
/** Rotates or issues a device token for a specific role/scope grant. */
export declare const DeviceTokenRotateParamsSchema: Type.TObject<{
    deviceId: Type.TString;
    role: Type.TString;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Revokes one role-bound device token grant. */
export declare const DeviceTokenRevokeParamsSchema: Type.TObject<{
    deviceId: Type.TString;
    role: Type.TString;
}>;
/** Event emitted when a client opens or refreshes a pairing request. */
export declare const DevicePairRequestedEventSchema: Type.TObject<{
    requestId: Type.TString;
    deviceId: Type.TString;
    publicKey: Type.TString;
    displayName: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    clientId: Type.TOptional<Type.TString>;
    clientMode: Type.TOptional<Type.TString>;
    role: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    remoteIp: Type.TOptional<Type.TString>;
    silent: Type.TOptional<Type.TBoolean>;
    isRepair: Type.TOptional<Type.TBoolean>;
    ts: Type.TInteger;
}>;
/** Event emitted after a pairing request is approved, rejected, or otherwise resolved. */
export declare const DevicePairResolvedEventSchema: Type.TObject<{
    requestId: Type.TString;
    deviceId: Type.TString;
    decision: Type.TString;
    ts: Type.TInteger;
}>;
