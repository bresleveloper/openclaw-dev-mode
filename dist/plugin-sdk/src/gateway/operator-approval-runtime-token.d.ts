/**
 * Returns the token used to authorize local operator-approval clients.
 */
export declare function getOperatorApprovalRuntimeToken(): string;
/**
 * Validates a presented loopback approval token without accepting empty or partial matches.
 */
export declare function isOperatorApprovalRuntimeToken(value: string | null | undefined): boolean;
