import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import "./users-7cqSxgr5.js";
import "./openclaw-state-db.generated-CriCmxNW.js";
import "kysely";
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
type UserProfileIdentity = {
  profileId: string;
  role: string | null;
  githubLogin?: string | null;
  aliases: ReadonlySet<string>;
};
//#endregion
export { PluginGatewayAccessPolicy as i, GatewayAccessGrantRef as n, PluginGatewayAccessAuthority as r, UserProfileIdentity as t };