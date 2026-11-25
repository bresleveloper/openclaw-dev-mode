import { t as inspectSlackAccount } from "./.setup/account-inspect-DgQgj0wk.mjs";
// extensions/slack/account-inspect-api.ts
function inspectSlackReadOnlyAccount(cfg, accountId) {
	return inspectSlackAccount({
		cfg,
		accountId
	});
}
export { inspectSlackReadOnlyAccount };
