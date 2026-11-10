import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ia as t,ot as n,st as r}from"./control-ui-core-BATTP0p-.js";import{Gl as i,Kl as a,ql as o}from"./control-ui-core-BKhTeqAN.js";import{a as s,o as c}from"./login-runtime-NnAlZaKE.js";var l;function u(){return(u=e((()=>{l=`<main class="unsupported-browser" aria-labelledby="unsupported-browser-title" tabindex="-1">
  <div class="unsupported-browser__panel">
    <p class="unsupported-browser__brand">OpenClaw</p>
    <h1 id="unsupported-browser-title" data-copy="title"></h1>
    <p data-copy="description"></p>
    <ul>
      <li data-copy="apple"></li>
      <li data-copy="browsers"></li>
    </ul>
    <div data-native-action hidden>
      <p data-copy="native"></p>
      <button type="button" data-copy="open" data-new-tab-action></button>
      <p role="status" aria-live="polite"></p>
    </div>
  </div>
</main>
`})))()}function d(){c();let e=new DOMParser().parseFromString(l,`text/html`).querySelector(`main`),n,a=e.querySelector(`[role="status"]`),s=()=>{let t={title:o(`login.unsupportedBrowser.title`),description:o(`login.unsupportedBrowser.description`),apple:o(`login.unsupportedBrowser.apple`),browsers:o(`login.unsupportedBrowser.browsers`),native:o(`login.unsupportedBrowser.native`),open:o(`login.unsupportedBrowser.open`),opened:o(`login.unsupportedBrowser.opened`),failed:o(`login.unsupportedBrowser.failed`)};for(let n of e.querySelectorAll(`[data-copy]`))n.textContent=t[n.dataset.copy??``]??``;a.textContent=n?t[n]??``:``};s(),i.subscribe(s),t()?.webkit?.messageHandlers?.openclawLink&&(e.querySelector(`[data-native-action]`).hidden=!1,e.querySelector(`button`).addEventListener(`click`,()=>{n=r(window.location.href)?`opened`:`failed`,s()})),document.body.replaceChildren(e),window.dispatchEvent(new Event(`openclaw-control-ui-rendered`)),e.focus()}function f(){return(f=e((()=>{a(),s(),n(),u()})))()}f();export{d as showUnsupportedBrowser};
//# sourceMappingURL=unsupported-browser-BYk-pguy.js.map