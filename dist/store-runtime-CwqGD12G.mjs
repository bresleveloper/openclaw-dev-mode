import { s as nativePluginBindings } from "./loader-runtime-load-DzFljQbT.mjs";
//#region src/agents/auth-profiles/store-runtime.ts
const { createAuthProfileStoreReadScope, createAuthProfileStoreReadScopeAsync, updateAuthProfileStoreWithLock, loadAuthProfileStore, loadAuthProfileStoreForRuntimeAsync, prepareAuthProfileProvider, findPersistedAuthProfileCredentialAsync, prepareAuthProfileCredentialRead, resolvePersistedAuthProfileOwnerAgentDirAsync, loadAuthProfileStoreForSecretsRuntimeAsync, loadAuthProfileStoreWithoutExternalProfilesAsync, ensureAuthProfileStoreAsync, ensureAuthProfileStoreWithoutExternalProfilesAsync, ensureAuthProfileStoreForLocalUpdateAsync, saveAuthProfileStoreWithPreparedOwner, saveAuthProfileStoreIfPersistenceSnapshotMatches } = nativePluginBindings.authStore;
/**
* @deprecated Await loadAuthProfileStoreForRuntimeAsync from openclaw/plugin-sdk/agent-runtime
* with readOnly: true and allowKeychainPrompt: false. Supported through 2026-12-31.
*/
const loadAuthProfileStoreForSecretsRuntime = nativePluginBindings.authStore.loadAuthProfileStoreForSecretsRuntime;
/**
* @deprecated Use updateAuthProfileStoreWithLock from openclaw/plugin-sdk/provider-auth.
* Supported through 2026-12-31.
*/
const saveAuthProfileStore = nativePluginBindings.authStore.saveAuthProfileStore;
/** @deprecated Use loadAuthProfileStoreForRuntimeAsync. Supported through 2026-12-31. */
const loadAuthProfileStoreForRuntime = nativePluginBindings.authStore.loadAuthProfileStoreForRuntime;
/** @deprecated Use loadAuthProfileStoreWithoutExternalProfilesAsync. Supported through 2026-12-31. */
const loadAuthProfileStoreWithoutExternalProfiles = nativePluginBindings.authStore.loadAuthProfileStoreWithoutExternalProfiles;
/** @deprecated Use ensureAuthProfileStoreAsync. Supported through 2026-12-31. */
const ensureAuthProfileStore = nativePluginBindings.authStore.ensureAuthProfileStore;
/** @deprecated Use ensureAuthProfileStoreWithoutExternalProfilesAsync. Supported through 2026-12-31. */
const ensureAuthProfileStoreWithoutExternalProfiles = nativePluginBindings.authStore.ensureAuthProfileStoreWithoutExternalProfiles;
/** @deprecated Use ensureAuthProfileStoreForLocalUpdateAsync. Supported through 2026-12-31. */
const ensureAuthProfileStoreForLocalUpdate = nativePluginBindings.authStore.ensureAuthProfileStoreForLocalUpdate;
//#endregion
export { updateAuthProfileStoreWithLock as C, saveAuthProfileStoreWithPreparedOwner as S, prepareAuthProfileCredentialRead as _, ensureAuthProfileStoreForLocalUpdate as a, saveAuthProfileStore as b, ensureAuthProfileStoreWithoutExternalProfilesAsync as c, loadAuthProfileStoreForRuntime as d, loadAuthProfileStoreForRuntimeAsync as f, loadAuthProfileStoreWithoutExternalProfilesAsync as g, loadAuthProfileStoreWithoutExternalProfiles as h, ensureAuthProfileStoreAsync as i, findPersistedAuthProfileCredentialAsync as l, loadAuthProfileStoreForSecretsRuntimeAsync as m, createAuthProfileStoreReadScopeAsync as n, ensureAuthProfileStoreForLocalUpdateAsync as o, loadAuthProfileStoreForSecretsRuntime as p, ensureAuthProfileStore as r, ensureAuthProfileStoreWithoutExternalProfiles as s, createAuthProfileStoreReadScope as t, loadAuthProfileStore as u, prepareAuthProfileProvider as v, saveAuthProfileStoreIfPersistenceSnapshotMatches as x, resolvePersistedAuthProfileOwnerAgentDirAsync as y };
