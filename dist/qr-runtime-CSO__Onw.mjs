import{n as createLazyPromise}from"./lazy-promise-CismJCQR.mjs";
//!src/media/qr-runtime.ts
const loadQrCodeRuntime=createLazyPromise(()=>import(`qrcode`).then(e=>e.default??e));export{loadQrCodeRuntime as t};