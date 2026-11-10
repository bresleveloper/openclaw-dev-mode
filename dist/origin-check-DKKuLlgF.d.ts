import { M as OpenClawConfig, Mn as GatewayOperatorRoleDefinition } from "./types-D7I_F5Ux.js";
import { n as UserProfile } from "./users-Dh_AKtru.js";
import "./openclaw-state-db.generated-D9YhbPU3.js";
import { u as GatewayIngressPrincipal } from "./gateway-ingress.types-DxDLpuun.js";
import { SqlBool } from "kysely";
import { IncomingMessage } from "node:http";
//#region src/plugins/gateway-access-policy.types.d.ts
type GatewayAccessGrantRef = Readonly<{
  pluginId: string;
  grantId: string;
}>;
/** Additional access held by an authenticated person, independent of a transport. */
type PluginGatewayAccessAuthority = Readonly<{
  /** Stable UUID for one uninterrupted grant, if the policy supports durable requests. */
  grantId?: string;
  assertCurrent: () => void;
  signal: AbortSignal;
}>;
type GatewayAccessPolicyContext = {
  config: OpenClawConfig;
  /** The person's effective operator role explicitly names this policy's plugin. */
  requiredByRole: boolean;
  profile: {
    profileId: string;
    emails: readonly string[];
    githubAccountIds?: readonly number[];
    assignedRole: string | null;
  };
};
type PluginGatewayAccessPolicy = {
  /** Return no authority when inapplicable; an explicit role binding still requires authority. */
  authorize: (context: GatewayAccessPolicyContext) => PluginGatewayAccessAuthority | undefined;
  /**
   * Check the original grant even if the current role is exempt. Return undefined
   * only for a definitively ended grant; throw while its state is unavailable.
   */
  resume?: (context: GatewayAccessPolicyContext & {
    grantId: string;
  }) => PluginGatewayAccessAuthority | undefined;
};
//#endregion
//#region src/state/user-profiles.types.d.ts
type UserProfileDisplay = Pick<UserProfile, "id" | "displayName" | "hasAvatar"> & {
  avatarRevision: string;
};
type UserProfileAuthority = {
  profileId: string;
  role: string | null;
  githubLogin?: string | null;
  aliases: string[];
  display: UserProfileDisplay;
};
type UserProfileIdentity = Omit<UserProfileAuthority, "aliases" | "display"> & {
  aliases: ReadonlySet<string>;
};
//#endregion
//#region src/gateway/operator-access-policy.types.d.ts
type GatewayOperatorAccessAuthority = PluginGatewayAccessAuthority & {
  readonly gatewayAccessGrant?: GatewayAccessGrantRef | null;
};
//#endregion
//#region src/gateway/operator-role-actor.d.ts
/** Host-minted role authority; never accepted from Gateway wire params.
    Leaf contract: both ws-types and server-methods/shared-types embed it in
    client `internal` state, so it must not import either hub. */
type GatewayOperatorRoleActor = {
  kind: "system";
} | {
  kind: "operator";
  profileId: string;
};
//#endregion
//#region src/gateway/server/client-identity-types.d.ts
/** Server-attested identity facts shared by RPC and transport client records. */
type GatewayAuthenticatedUserProfile = {
  profileId: string;
  displayName: string | null;
  avatarRevision: string;
  hasAvatar: boolean;
  updatedAt: number;
};
type RemoteIngressPrincipalSnapshot = Readonly<{
  bindingId: string;
  authenticatedUserProfile: GatewayAuthenticatedUserProfile;
  preparedSessionProfile: UserProfileIdentity;
  operatorRoleActor: GatewayOperatorRoleActor;
  operatorRolePolicy?: GatewayOperatorRoleDefinition;
  operatorAccessAuthority?: GatewayOperatorAccessAuthority | null;
  scopes: string[];
  signal: AbortSignal;
  assertCurrent(): void;
}>;
/** Core-retained grant authority; browser headers cannot create this context. */
type RemoteControlUiIngressContext = Readonly<{
  pluginId: string;
  audienceId: string;
  publicOrigin: string;
  sandboxOrigin: string;
  principal: GatewayIngressPrincipal;
  operatorScopeCeiling: readonly string[];
  resolvePrincipal(): RemoteIngressPrincipalSnapshot;
  frameAncestors: readonly string[];
  signal: AbortSignal;
  assertCurrent(): void;
}>;
type GatewayWsBrowserOrigin = {
  requestHost?: string;
  origin?: string;
  isLocalClient?: boolean;
  remoteControlUiIngress?: RemoteControlUiIngressContext;
};
//#endregion
//#region src/gateway/origin-check.d.ts
/** Return the request Origin only when the Gateway's canonical browser policy accepts it. */
declare function resolveAcceptedBrowserOrigin(params: {
  req: IncomingMessage;
  cfg?: OpenClawConfig;
}): string | undefined;
//#endregion
export { RemoteIngressPrincipalSnapshot as a, UserProfileIdentity as c, RemoteControlUiIngressContext as i, GatewayAccessGrantRef as l, GatewayAuthenticatedUserProfile as n, GatewayOperatorRoleActor as o, GatewayWsBrowserOrigin as r, GatewayOperatorAccessAuthority as s, resolveAcceptedBrowserOrigin as t, PluginGatewayAccessPolicy as u };