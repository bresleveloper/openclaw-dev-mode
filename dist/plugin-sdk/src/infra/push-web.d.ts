type WebPushSubscription = {
    subscriptionId: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAtMs: number;
    updatedAtMs: number;
};
type VapidKeyPair = {
    publicKey: string;
    privateKey: string;
    subject: string;
};
type WebPushSendResult = {
    ok: boolean;
    subscriptionId: string;
    statusCode?: number;
    error?: string;
};
export declare function resolveVapidKeys(baseDir?: string): Promise<VapidKeyPair>;
type RegisterWebPushParams = {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    baseDir?: string;
};
export declare function registerWebPushSubscription(params: RegisterWebPushParams): Promise<WebPushSubscription>;
export declare function listWebPushSubscriptions(baseDir?: string): Promise<WebPushSubscription[]>;
export declare function clearWebPushSubscriptionByEndpoint(endpoint: string, baseDir?: string): Promise<boolean>;
type WebPushPayload = {
    title: string;
    body?: string;
    tag?: string;
    url?: string;
};
export declare function broadcastWebPush(payload: WebPushPayload, baseDir?: string): Promise<WebPushSendResult[]>;
export {};
