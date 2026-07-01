import type { GatewayWsClient } from "./server/ws-types.js";
/** Connected node session advertised over Gateway websocket. */
export type NodeSession = {
    nodeId: string;
    connId: string;
    client: GatewayWsClient;
    clientId?: string;
    clientMode?: string;
    displayName?: string;
    platform?: string;
    version?: string;
    coreVersion?: string;
    uiVersion?: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    remoteIp?: string;
    declaredCaps: string[];
    caps: string[];
    declaredCommands: string[];
    commands: string[];
    declaredPermissions?: Record<string, boolean>;
    permissions?: Record<string, boolean>;
    pathEnv?: string;
    connectedAtMs: number;
};
/** Result payload returned from node.invoke. */
type NodeInvokeResult = {
    ok: boolean;
    payload?: unknown;
    payloadJSON?: string | null;
    error?: {
        code?: string;
        message?: string;
    } | null;
};
/** Connectivity probe result for a registered node. */
type NodeConnectivityResult = {
    ok: true;
} | {
    ok: false;
    error: {
        code: string;
        message: string;
    };
};
declare const SERIALIZED_EVENT_PAYLOAD: unique symbol;
export type SerializedEventPayload = {
    readonly json: string;
    readonly [SERIALIZED_EVENT_PAYLOAD]: true;
};
/** Serialize an event payload once so fanout can reuse the same JSON string. */
export declare function serializeEventPayload(payload: unknown): SerializedEventPayload | null;
/** Registry of currently connected Gateway nodes. */
export declare class NodeRegistry {
    private nodesById;
    private nodesByConn;
    private pendingInvokes;
    private authorizedSystemRunEvents;
    /** Register a websocket client as the current connection for its node id. */
    register(client: GatewayWsClient, opts: {
        remoteIp?: string | undefined;
    }): NodeSession;
    /** Unregister one connection and reject invokes tied to that connection. */
    unregister(connId: string): string | null;
    /** List connected node sessions. */
    listConnected(): NodeSession[];
    /** Return a connected node session by node id. */
    get(nodeId: string): NodeSession | undefined;
    /** Probe websocket liveness with ping/pong when the socket supports it. */
    checkConnectivity(nodeId: string, timeoutMs?: number): Promise<NodeConnectivityResult>;
    updateSurface(nodeId: string, surface: {
        caps?: readonly string[];
        commands: readonly string[];
        permissions?: Record<string, boolean> | undefined;
    }): NodeSession | null;
    invoke(params: {
        nodeId: string;
        command: string;
        params?: unknown;
        timeoutMs?: number;
        idempotencyKey?: string;
    }): Promise<NodeInvokeResult>;
    /** Authorize an inbound system.run event against a recently issued node invoke. */
    authorizeSystemRunEvent(params: {
        nodeId: string;
        connId?: string;
        runId?: string;
        sessionKey: string;
        terminal: boolean;
    }): boolean;
    private rememberAuthorizedSystemRunEvent;
    private forgetAuthorizedSystemRunEvent;
    private authorizedSystemRunEventExpiresAt;
    private matchAuthorizedSystemRunEvent;
    private matchSingleAuthorizedSystemRunEvent;
    private authorizedSystemRunSessionMatches;
    private allowsLegacyMacRunIdFallback;
    private pruneAuthorizedSystemRunEvents;
    private authorizedSystemRunEventKey;
    handleInvokeResult(params: {
        id: string;
        nodeId: string;
        connId: string | undefined;
        ok: boolean;
        payload?: unknown;
        payloadJSON?: string | null;
        error?: {
            code?: string;
            message?: string;
        } | null;
    }): boolean;
    sendEvent(nodeId: string, event: string, payload?: unknown): boolean;
    sendEventRaw(nodeId: string, event: string, payloadJSON?: SerializedEventPayload | null): boolean;
    private sendEventInternal;
    private sendEventRawInternal;
    private sendEventToSession;
    private rejectSlowNodeSocket;
}
export {};
