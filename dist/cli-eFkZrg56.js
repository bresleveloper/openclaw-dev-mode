import "./paths-BJV7vkaX.js";
import "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./thinking-BYwvlJ3S.js";
import { Ot as loadOpenClawPlugins } from "./reply-CLjug3BF.js";
import { d as resolveDefaultAgentId, u as resolveAgentWorkspaceDir } from "./agent-scope-BJ-A8vSB.js";
import { t as createSubsystemLogger } from "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import { in as loadConfig } from "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./dock-Comp2gJ6.js";
import "./message-channel-DQep2kbh.js";
import "./send-wAjeRso3.js";
import "./plugins-C0pOwMtf.js";
import "./sessions-HiopsrVS.js";
import "./audio-transcription-runner-D-V7O4fK.js";
import "./image-C-Zw0oaM.js";
import "./models-config-BEpJKGMR.js";
import "./pi-embedded-helpers-CVA4fQUQ.js";
import "./sandbox-CoGpmvXW.js";
import "./tool-catalog-DE9Q8xiB.js";
import "./chrome-tXGLEhE5.js";
import "./tailscale-Cb--SHEE.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./auth-32YLiXaF.js";
import "./server-context-CpZq_krd.js";
import "./frontmatter-BNgDHC-E.js";
import "./env-overrides-Dsk7pgN4.js";
import "./path-alias-guards-C7fuvY3a.js";
import "./skills-C12GSy0o.js";
import "./paths-Ds-H_wj4.js";
import "./redact-BuHVrHGi.js";
import "./errors-lgWRdCyT.js";
import "./fs-safe-ByGe0qYX.js";
import "./proxy-env-Ce3yMsLG.js";
import "./image-ops-CVsEAuQZ.js";
import "./store-BCGAnbcB.js";
import "./ports-BFNjqMt6.js";
import "./trash-kZ6uvO8p.js";
import "./server-middleware-Cel4wU9c.js";
import "./accounts-82c5Tbng.js";
import "./accounts-CvmhVLij.js";
import "./logging-T8IDvLh2.js";
import "./accounts-CoSHDMaf.js";
import "./send-DTPMdtCD.js";
import "./paths-CrgdtCHd.js";
import "./chat-envelope-DyXtQzoD.js";
import "./tool-images-BkNIdbzz.js";
import "./tool-display-C6selhgh.js";
import "./fetch-guard-NL9A0Guz.js";
import "./api-key-rotation-DwF99nSy.js";
import "./local-roots-C8vp-IWv.js";
import "./model-catalog-W6R6I2rN.js";
import "./proxy-fetch-WnO0dYIx.js";
import "./tokens-B1O6Fibu.js";
import "./deliver-BdAuZ8ch.js";
import "./commands-Bf8GhDBS.js";
import "./commands-registry-BcRgECpc.js";
import "./client-CaaDgxx2.js";
import "./call-Ch1eylWu.js";
import "./pairing-token-BiCaqjaN.js";
import "./with-timeout-BFfaJzQ8.js";
import "./diagnostic-CZz9fkS3.js";
import "./send-gvtxjkVN.js";
import "./pi-model-discovery-DN1_rbg1.js";
import "./exec-approvals-allowlist-DMGPrtps.js";
import "./exec-safe-bin-runtime-policy-C8qGqATK.js";
import "./ir-DfVgSQsI.js";
import "./render-DMmq5MTs.js";
import "./target-errors-BxXAk4rN.js";
import "./channel-selection-CH-IC7Wc.js";
import "./plugin-auto-enable-EN1mZ2vU.js";
import "./send-Q_YARaI5.js";
import "./outbound-attachment-Z9x6X-hu.js";
import "./fetch-D56Oi7TD.js";
import "./delivery-queue-Cb689DYG.js";
import "./send-BK2IjrDj.js";
import "./pairing-store-lwllLpUz.js";
import "./read-only-account-inspect-C0vtmV0V.js";
import "./channel-activity-BU6JWzbE.js";
import "./tables-RZo-0M8D.js";
import "./proxy-i4Vk7UXO.js";
import "./timeouts-WPVgOKHt.js";
import "./skill-commands-CrvFkN8J.js";
import "./workspace-dirs-QH37roq1.js";
import "./runtime-config-collectors-BgRo9iWt.js";
import "./command-secret-targets-B22Udz2k.js";
import "./session-cost-usage-B6JvTk-n.js";
import "./onboard-helpers-XgRedRg8.js";
import "./prompt-style-DwgYrBLh.js";
import "./pairing-labels-CTP_Cum6.js";
import "./memory-cli-C6trfVLZ.js";
import "./manager-DhJPwx7R.js";
import "./query-expansion-DukPwnJT.js";
import "./links-D4VD_bBP.js";
import "./cli-utils-dheMMb8l.js";
import "./help-format-AqVUaAli.js";
import "./progress-CcxlwGsg.js";
import "./exec-approvals-Cmf_ppYW.js";
import "./nodes-screen-DCTx-sg3.js";
import "./system-run-command-Dz2MJO0p.js";
import "./server-lifecycle-CN-LjJB7.js";
import "./stagger-DqGaRx1m.js";
//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function registerPluginCliCommands(program, cfg) {
	const config = cfg ?? loadConfig();
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	const registry = loadOpenClawPlugins({
		config,
		workspaceDir,
		logger
	});
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}
//#endregion
export { registerPluginCliCommands };
