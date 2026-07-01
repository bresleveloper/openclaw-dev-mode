import { ADMIN_SCOPE, APPROVALS_SCOPE, PAIRING_SCOPE, READ_SCOPE, TALK_SECRETS_SCOPE, WRITE_SCOPE, type OperatorScope } from "./operator-scopes.js";
export { ADMIN_SCOPE, APPROVALS_SCOPE, PAIRING_SCOPE, READ_SCOPE, TALK_SECRETS_SCOPE, WRITE_SCOPE, type OperatorScope, };
/** Default scopes granted to CLI/operator clients when no narrower local policy is known. */
export declare const CLI_DEFAULT_OPERATOR_SCOPES: OperatorScope[];
/** Returns true when a method requires the approvals operator scope. */
export declare function isApprovalMethod(method: string): boolean;
/** Returns true when a method is reserved for node-role clients instead of operators. */
export declare function isNodeRoleMethod(method: string): boolean;
/** Returns true when a method requires admin operator scope. */
export declare function isAdminOnlyMethod(method: string): boolean;
/** Resolves the required static operator scope for a gateway method, if one exists. */
export declare function resolveRequiredOperatorScopeForMethod(method: string): OperatorScope | undefined;
/** Returns the narrowest known operator scopes needed to call a gateway method. */
export declare function resolveLeastPrivilegeOperatorScopesForMethod(method: string, params?: unknown): OperatorScope[];
/** Checks whether a presented operator scope set authorizes a gateway method call. */
export declare function authorizeOperatorScopesForMethod(method: string, scopes: readonly string[], params?: unknown): {
    allowed: true;
} | {
    allowed: false;
    missingScope: OperatorScope;
};
/** Checks a method registry's already-resolved static scope against presented operator scopes. */
export declare function authorizeOperatorScopesForRequiredScope(requiredScope: OperatorScope, scopes: readonly string[]): {
    allowed: true;
} | {
    allowed: false;
    missingScope: OperatorScope;
};
/** Returns true when a method has any core, node, dynamic, reserved, or plugin scope policy. */
export declare function isGatewayMethodClassified(method: string): boolean;
