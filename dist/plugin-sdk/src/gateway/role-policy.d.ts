declare const GATEWAY_ROLES: readonly ["operator", "node"];
/** Gateway connection roles used before method-level operator scope checks. */
export type GatewayRole = (typeof GATEWAY_ROLES)[number];
/** Parses the untrusted role claim from connect params into the closed role set. */
export declare function parseGatewayRole(roleRaw: unknown): GatewayRole | null;
/** Operators using shared auth may connect before device identity is established. */
export declare function roleCanSkipDeviceIdentity(role: GatewayRole, sharedAuthOk: boolean): boolean;
/** Keeps node-originated notifications off the operator RPC surface, and vice versa. */
export declare function isRoleAuthorizedForMethod(role: GatewayRole, method: string): boolean;
export {};
