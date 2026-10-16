import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Iu as r,Lu as i,Tu as a,ju as o}from"./control-ui-core-bJHyI7AF.js";import{Ti as s,na as c,ra as l,wi as u}from"./control-ui-core-DNh4McGE.js";import{$ as d,X as f,Y as p,nt as m,ut as h}from"./lit-runtime-DyST807n.js";import{Xr as g,Zr as _,ii as v}from"./ui-DeikvIdP.js";import{N as y,O as b,_ as x,k as S}from"./config-runtime-BecGLziM.js";import{gn as C,s as w,u as T}from"./control-ui-boot-chat-DfNf0poH.js";import{n as E,r as D}from"./board-layout-BmeSfx17.js";function O(e){let t=k.safeParse(e);if(!t.success)throw new E(`invalid_operation`,`Website props must contain only a valid HTTPS url of at most 2048 characters`);let n=new URL(t.data.url);if(n.username||n.password)throw new E(`invalid_operation`,`Website URLs must not contain embedded credentials`);return t.data}var k;function A(){return(A=e((()=>{x(),D(),k=b({url:S().max(2048).pipe(y({protocol:/^https$/,normalize:!0}).max(2048))})})))()}var j,M;function N(){return(N=e((()=>{i(),j={board:{widget:{websiteOpen:`Open website`,websiteEmbedHint:`If this site does not load here, open it in a new tab.`,websiteSameOrigin:`Open this website in a new tab. Gateway and Control UI pages cannot be embedded in a website widget.`}}},M=Object.assign(()=>Object.assign(r.board.widget,j.board.widget),{catalog:j})})))()}var P;function F(){return(F=e((()=>{_(),p(),m(),A(),s(),w(),l(),n(),N(),a(),M(),P=class extends t{constructor(...e){super(...e),this.active=!0,this.activated=!1}willUpdate(){this.activated||=this.active}render(){if(!this.activated)return f;let e;try{e=new URL(O(this.widget?.props).url)}catch(e){return T(e)}let t=C(this.context?.gateway.connection.gatewayUrl??``,window.location.origin),n=new URL(t).hostname,r=e.hostname===window.location.hostname||e.hostname===n;return d`<div class="board-website">
      ${r?d`<p class="board-website__notice" role="alert">
              ${o(`board.widget.websiteSameOrigin`)}
            </p>`:d`<iframe
              class="board-website__frame"
              title=${this.widget?.title||o(`board.widget.kindWebsite`)}
              src=${e.href}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerpolicy="no-referrer"
            ></iframe>`}
      <div class="board-website__footer">
        <span class="board-website__origin">${e.host}</span>
        <a
          href=${e.href}
          target="_blank"
          rel="noopener noreferrer"
          title=${o(`board.widget.websiteEmbedHint`)}
        >
          ${o(`board.widget.websiteOpen`)}${c.externalLink}
        </a>
      </div>
    </div>`}},v([g({context:u,subscribe:!0})],P.prototype,`context`,void 0),v([h({attribute:!1})],P.prototype,`widget`,void 0),v([h({type:Boolean})],P.prototype,`active`,void 0),customElements.get(`openclaw-website-widget`)||customElements.define(`openclaw-website-widget`,P)})))()}F();
//# sourceMappingURL=website-DbQAiND9.js.map