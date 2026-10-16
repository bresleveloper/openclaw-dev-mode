import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/model-account-selection.d.ts
/** Configured preference only; provider failover can use a different account. */
declare const ChatAccountSelectionSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"automatic">;
  label: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"personal">;
  label: Type.TString;
  authProfileId: Type.TOptional<Type.TString>;
  source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"shared">;
  label: Type.TString;
  authProfileId: Type.TString;
  source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
}>]>;
type ChatAccountSelection = Static<typeof ChatAccountSelectionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/users.d.ts
declare const UsersListModelAccountsResultSchema: Type.TObject<{
  profileId: Type.TString;
  accounts: Type.TArray<Type.TObject<{
    authProfileId: Type.TString;
    provider: Type.TString;
    label: Type.TString;
    authType: Type.TUnion<[Type.TLiteral<"api_key">, Type.TLiteral<"oauth">, Type.TLiteral<"token">]>;
    selected: Type.TBoolean;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersSelectModelAccountResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersListAuthLinksResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersLinkAuthProfileResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersUnlinkAuthProfileResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersAuthConnectCatalogResultSchema: Type.TObject<{
  providers: Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    methods: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
declare const UsersAuthConnectStartResultSchema: Type.TObject<{
  connectId: Type.TString;
  expiresAtMs: Type.TInteger;
}>;
declare const UsersAuthConnectStatusResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  error: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"connected">;
  authProfileId: Type.TString;
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"exchange">, Type.TLiteral<"identity">, Type.TLiteral<"authority">, Type.TLiteral<"unavailable">]>;
}>]>;
type UsersListModelAccountsResult = Static<typeof UsersListModelAccountsResultSchema>;
type UsersSelectModelAccountResult = Static<typeof UsersSelectModelAccountResultSchema>;
type UsersAuthConnectStartResult = Static<typeof UsersAuthConnectStartResultSchema>;
type UsersAuthConnectCatalogResult = Static<typeof UsersAuthConnectCatalogResultSchema>;
type UsersAuthConnectStatusResult = Static<typeof UsersAuthConnectStatusResultSchema>;
type UsersListAuthLinksResult = Static<typeof UsersListAuthLinksResultSchema>;
type UsersLinkAuthProfileResult = Static<typeof UsersLinkAuthProfileResultSchema>;
type UsersUnlinkAuthProfileResult = Static<typeof UsersUnlinkAuthProfileResultSchema>;
declare const UsersGitHubAuthorizeStartResultSchema: Type.TObject<{
  requestId: Type.TString;
  userCode: Type.TString;
  verificationUri: Type.TLiteral<"https://github.com/login/device">;
  expiresInMs: Type.TInteger;
  pollAfterMs: Type.TInteger;
}>;
declare const PersonalGitHubStatusSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"connected">, Type.TLiteral<"disconnected">, Type.TLiteral<"unavailable">]>;
  generation: Type.TUnion<[Type.TString, Type.TNull]>;
  account: Type.TUnion<[Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
  }>, Type.TNull]>;
  accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
  refreshState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"refreshing">, Type.TLiteral<"expired">, Type.TLiteral<"failed">, Type.TLiteral<"not_applicable">]>;
  pending: Type.TUnion<[Type.TObject<{
    requestId: Type.TString;
    userCode: Type.TString;
    verificationUri: Type.TLiteral<"https://github.com/login/device">;
    expiresInMs: Type.TInteger;
    pollAfterMs: Type.TInteger;
  }>, Type.TNull]>;
}>;
declare const UsersGitHubAuthorizePollResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"slow_down">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"access_denied">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"incorrect_device_code">;
}>, Type.TObject<{
  status: Type.TLiteral<"network_error">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"setup_failed">]>;
}>, Type.TObject<{
  status: Type.TLiteral<"success">;
  personal: Type.TObject<{
    state: Type.TUnion<[Type.TLiteral<"connected">, Type.TLiteral<"disconnected">, Type.TLiteral<"unavailable">]>;
    generation: Type.TUnion<[Type.TString, Type.TNull]>;
    account: Type.TUnion<[Type.TObject<{
      accountId: Type.TInteger;
      login: Type.TString;
    }>, Type.TNull]>;
    accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
    refreshState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"refreshing">, Type.TLiteral<"expired">, Type.TLiteral<"failed">, Type.TLiteral<"not_applicable">]>;
    pending: Type.TUnion<[Type.TObject<{
      requestId: Type.TString;
      userCode: Type.TString;
      verificationUri: Type.TLiteral<"https://github.com/login/device">;
      expiresInMs: Type.TInteger;
      pollAfterMs: Type.TInteger;
    }>, Type.TNull]>;
  }>;
}>]>;
type PersonalGitHubStatus = Static<typeof PersonalGitHubStatusSchema>;
type UsersGitHubAuthorizeStartResult = Static<typeof UsersGitHubAuthorizeStartResultSchema>;
type UsersGitHubAuthorizePollResult = Static<typeof UsersGitHubAuthorizePollResultSchema>;
//#endregion
export { UsersGitHubAuthorizePollResult as a, UsersListAuthLinksResult as c, UsersUnlinkAuthProfileResult as d, ChatAccountSelection as f, UsersAuthConnectStatusResult as i, UsersListModelAccountsResult as l, UsersAuthConnectCatalogResult as n, UsersGitHubAuthorizeStartResult as o, UsersAuthConnectStartResult as r, UsersLinkAuthProfileResult as s, PersonalGitHubStatus as t, UsersSelectModelAccountResult as u };