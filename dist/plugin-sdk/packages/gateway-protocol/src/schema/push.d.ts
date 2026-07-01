import { Type } from "typebox";
/** Request payload for sending a test APNS notification to one node. */
export declare const PushTestParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    title: Type.TOptional<Type.TString>;
    body: Type.TOptional<Type.TString>;
    environment: Type.TOptional<Type.TString>;
}>;
/** Result payload from an APNS push test, including provider status and transport. */
export declare const PushTestResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    status: Type.TInteger;
    apnsId: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
    tokenSuffix: Type.TString;
    topic: Type.TString;
    environment: Type.TString;
    transport: Type.TString;
}>;
/** Empty request payload for fetching the Web Push VAPID public key. */
export declare const WebPushVapidPublicKeyParamsSchema: Type.TObject<{}>;
/** Browser Web Push subscription payload registered with the gateway. */
export declare const WebPushSubscribeParamsSchema: Type.TObject<{
    endpoint: Type.TString;
    keys: Type.TObject<{
        p256dh: Type.TString;
        auth: Type.TString;
    }>;
}>;
/** Browser Web Push endpoint removal payload. */
export declare const WebPushUnsubscribeParamsSchema: Type.TObject<{
    endpoint: Type.TString;
}>;
/** Request payload for sending a test Web Push notification to current subscriptions. */
export declare const WebPushTestParamsSchema: Type.TObject<{
    title: Type.TOptional<Type.TString>;
    body: Type.TOptional<Type.TString>;
}>;
/** Empty request type for fetching the Web Push VAPID public key. */
export type WebPushVapidPublicKeyParams = Record<string, never>;
/** Browser PushSubscription subset persisted by the gateway. */
export type WebPushSubscribeParams = {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
};
/** Browser PushSubscription endpoint removal request. */
export type WebPushUnsubscribeParams = {
    endpoint: string;
};
/** Optional title/body overrides for a Web Push test notification. */
export type WebPushTestParams = {
    title?: string;
    body?: string;
};
