import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t}from"./worker-chunk-CCW8mP6B.mjs";import{n}from"./worker-chunk-CxTYO89b.mjs";import{r}from"./worker-chunk-Cr04ZyS0.mjs";import{i,t as a}from"./worker-chunk-B1YzM0QK.mjs";import{n as o,o as s}from"./worker-chunk-jJ7GrUO9.mjs";function logGatewayReady(e,t=`gateway ready`){e.getReadiness().ready&&e.log.info(t)}function logGatewaySidecarsReady(e){e.startupTrace?.detail(`sidecars.ready`,[[`loadedPluginCount`,e.loadedPluginCount],[`postReadySidecarCount`,e.postReadySidecarCount]]),e.startupTrace?.mark(`sidecars.ready`),logGatewayReady(e)}var c=e((()=>{}));function isSystemCaWarmupMessage(e){if(!e||typeof e!=`object`||Array.isArray(e))return!1;let t=e;return t.ok===!0?typeof t.certificateCount==`number`:t.ok===!1&&typeof t.error==`string`}async function warmMacOSSystemCaOffMainThread(e={}){let n=e.env??process.env;if((e.platform??process.platform)!==`darwin`||e.env===void 0&&e.platform===void 0&&r(n))return;let i;try{i=(e.createWorker??o)(u,{eval:!0})}catch(n){let r=t(n,`ERR_ACCESS_DENIED`)?`Node denied worker-thread permission`:`worker creation failed: ${a(n)}`;e.log?.warn(`macOS CA warmup skipped because ${r}; trust settings will load lazily`);return}await new Promise(t=>{let n=!1,r=e.timeoutMs??l,settle=(r,o=!1)=>{n||(n=!0,clearTimeout(a),i.removeAllListeners(),i.once(`error`,()=>{}),o&&i.terminate().catch(()=>{}),r&&e.log?.warn(r),t())};i.once(`message`,e=>{if(!isSystemCaWarmupMessage(e)){settle(`macOS CA warmup returned an invalid result; gateway startup will continue and trust settings will load lazily`,!0);return}if(!e.ok){settle(`macOS CA warmup failed: ${e.error}; gateway startup will continue and trust settings will load lazily`,!0);return}settle()}),i.once(`error`,e=>{settle(`macOS CA warmup worker failed: ${e.message}; gateway startup will continue and trust settings will load lazily`)}),i.once(`exit`,e=>{settle(`macOS CA warmup worker exited before replying (code ${e}); gateway startup will continue and trust settings will load lazily`)});let a=setTimeout(()=>{settle(`macOS CA warmup timed out after ${r}ms; gateway startup will continue and trust settings will load lazily`,!0)},r);a.unref?.(),i.unref()})}function beginMacOSSystemCaWarmupOnce(e={}){return d??=warmMacOSSystemCaOffMainThread(e)}var l,u,d,f=e((()=>{n(),i(),s(),l=1e4,u=String.raw`
  const { getCACertificates } = require("node:tls");
  const { parentPort } = require("node:worker_threads");

  try {
    const certificateCount = getCACertificates("default").length;
    parentPort.postMessage({ ok: true, certificateCount });
  } catch (error) {
    parentPort.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    parentPort.close();
  }
`}));export{logGatewaySidecarsReady as a,logGatewayReady as i,f as n,c as r,beginMacOSSystemCaWarmupOnce as t};