import { t as collectZalouserSecurityAuditFindings } from "./security-audit-Cp8xYbha.mjs";
import { S as waitForZaloQrLogin, a as listZaloGroupMembers, c as logoutZaloProfile, g as sendZaloReaction, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, x as startZaloQrLogin } from "./zalo-js-CarmVXWA.mjs";
import { n as sendMessageZalouser } from "./send-pZM09l4B.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
// extensions/zalouser/src/probe.ts
async function probeZalouser(profile, timeoutMs) {
	return await runChannelProbe(timeoutMs ? resolveTimerTimeoutMs(timeoutMs, 1e3, 1e3) : void 0, async () => {
		const user = await getZaloUserInfo(profile);
		return user ? {
			ok: true,
			user
		} : {
			ok: false,
			error: "Not authenticated"
		};
	}, (error) => ({
		ok: false,
		error: formatErrorMessage(error)
	}));
}
export { collectZalouserSecurityAuditFindings, getZaloUserInfo, listZaloFriendsMatching, listZaloGroupMembers, listZaloGroupsMatching, logoutZaloProfile, probeZalouser, sendMessageZalouser, sendZaloReaction, startZaloQrLogin, waitForZaloQrLogin };
