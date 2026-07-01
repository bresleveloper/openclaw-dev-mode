/** Normalize capability/command lists for node approval-surface comparison. */
export declare function normalizeNodeApprovalSurfaceList(value: readonly string[] | undefined): string[];
/** Compare capability/command surfaces as normalized sets, ignoring order and duplicates. */
export declare function sameNodeApprovalSurfaceSet(left: readonly string[] | undefined, right: readonly string[] | undefined): boolean;
/** Compare node permission maps deterministically so key order cannot trigger repairs. */
export declare function sameNodePermissionSurface(left: Record<string, boolean> | undefined, right: Record<string, boolean> | undefined): boolean;
