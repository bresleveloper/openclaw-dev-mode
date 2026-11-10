import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{B as n,G as r,L as i,Q as a,R as o,S as s,T as c,U as l,V as u,W as d,X as f,Z as p,c as m,d as h,g,m as _,nt as v,q as y,r as b,s as x,t as S,u as C,v as w,w as T,z as E}from"./lit-runtime-DICwFbCm.js";import{ao as ee,do as D,fo as O}from"./ui-CFzBFVbW.js";import{d as k,l as te,n as ne,t as re,u as ie}from"./control-ui-boot-shared-K9iERa3k.js";var ae;function oe(){return(oe=e((()=>{D(),ae=class{constructor(e,t,n,r){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(e,t)=>{this.unsubscribe&&(this.unsubscribe!==t&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=e,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(e,t)),this.unsubscribe=t},this.host=e,t.context!==void 0){let e=t;this.context=e.context,this.callback=e.callback,this.subscribe=e.subscribe??!1}else this.context=t,this.callback=n,this.subscribe=r??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&=(this.unsubscribe(),void 0)}dispatchRequest(){this.host.dispatchEvent(new O(this.context,this.host,this.t,this.subscribe))}}})))()}function se({context:e,subscribe:t}){return(n,r)=>{typeof r==`object`?r.addInitializer((function(){new ae(this,{context:e,callback:e=>{n.set.call(this,e)},subscribe:t})})):n.constructor.addInitializer((n=>{new ae(n,{context:e,callback:e=>{n[r]=e},subscribe:t})}))}}function ce(){return(ce=e((()=>{oe()})))()}function le(e,t=!1){return t?{h:Number(e&pe),l:Number(e>>me&pe)}:{h:Number(e>>me&pe)|0,l:Number(e&pe)|0}}function ue(e,t=!1){let n=e.length,r=new Uint32Array(n),i=new Uint32Array(n);for(let a=0;a<n;a++){let{h:n,l:o}=le(e[a],t);[r[a],i[a]]=[n,o]}return[r,i]}function de(e,t,n,r){let i=he(n),a=ge(n);e.setUint32(t,r?a:i,r),e.setUint32(t+4,r?i:a,r)}function fe(e,t,n,r){let i=(t>>>0)+(r>>>0);return{h:e+n+(i/2**32|0)|0,l:i|0}}var pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe;function ke(){return(ke=e((()=>{pe=BigInt(2**32-1),me=BigInt(32),he=e=>e/2**32|0,ge=e=>e>>>0,_e=(e,t,n)=>e>>>n,ve=(e,t,n)=>e<<32-n|t>>>n,ye=(e,t,n)=>e>>>n|t<<32-n,be=(e,t,n)=>e<<32-n|t>>>n,xe=(e,t,n)=>e<<64-n|t>>>n-32,Se=(e,t,n)=>e>>>n-32|t<<64-n,Ce=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),we=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,Te=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),Ee=(e,t,n,r,i)=>t+n+r+i+(e/2**32|0)|0,De=(e,t,n,r,i)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(i>>>0),Oe=(e,t,n,r,i,a)=>t+n+r+i+a+(e/2**32|0)|0})))()}function Ae(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function je(e,t=``){if(typeof e!=`number`)throw TypeError(He(t)+`expected number, got `+typeof e);if(!Number.isSafeInteger(e)||e<0)throw RangeError(He(t)+`expected integer >= 0, got `+e);return e}function Me(e,t,n=``){if(Ae(e)&&(t===void 0||e.length===t))return e;t!==void 0&&je(t,`length`);let r=Ae(e),i=t===void 0?``:` of length ${t}`,a=r?`length=${e.length}`:`type=${typeof e}`,o=He(n)+`expected Uint8Array`+i+`, got `+a;throw r?RangeError(o):TypeError(o)}function Ne(e){if(typeof e!=`function`||typeof e.create!=`function`)throw TypeError(`expected hash wrapped by utils.createHasher`);if(je(e.outputLen),je(e.blockLen),e.outputLen<1||e.blockLen<1)throw Error(`hash blockLen / outputLen must be >= 1`)}function Pe(e,t=!0){if(e.destroyed)throw Error(`hash was destroyed`);if(t&&e.finished)throw Error(`digest() was already called`)}function Fe(e,t){Me(e,void 0,`output`);let n=t.outputLen;if(!(e.length>=n))throw RangeError(`"output" expected length >= `+n)}function Ie(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function Le(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function Re(e,t){return e<<32-t|e>>>t}function ze(e){if(Me(e),Ge)return e.toHex();let t=``;for(let n=0;n<e.length;n++)t+=Ke[e[n]];return t}function Be(e,t,n=`opts`){return We(e,`defaults`),t!==void 0&&We(t,n),Object.assign(Object.create(null),e,t)}function Ve(e,t={}){if(typeof e!=`function`)throw TypeError(`"hashCons" expected function, got type=`+typeof e);t=Be({},t,`info`);let n=(t,n)=>e(n).update(t).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.canXOF=r.canXOF,n.create=t=>e(t),Object.assign(n,t),Object.freeze(n)}var He,Ue,We,Ge,Ke,qe;function Je(){return(Je=e((()=>{He=e=>e?`"${e}" `:``,Ue=(e,t)=>{if(typeof e!=`object`||!e||Array.isArray(e))throw TypeError((t===`object`?``:`"${t}" `)+`expected object, got type=`+typeof e)},We=(e,t)=>{Ue(e,t);let n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==null)throw TypeError(`"${t}" expected plain object`);if(Object.hasOwn(e,`__proto__`))throw TypeError(`"${t}.__proto__" is not allowed`)},Ge=typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`,Ke=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`)),qe=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])})})))()}function Ye(e,t,n){return e&t^~e&n}function Xe(e,t,n){return e&t^e&n^t&n}var Ze,Qe,$e,et,tt;function nt(){return(nt=e((()=>{ke(),Je(),Ze=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,r){this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.buffer=new Uint8Array(e),this.view=Le(this.buffer)}update(e){Pe(this),Me(e);let{view:t,buffer:n,blockLen:r}=this,i=e.length,a=!1;for(let o=0;o<i;){let s=Math.min(r-this.pos,i-o);if(s===r){let t=Le(e);for(;r<=i-o;o+=r)this.process(t,o);a=!0;continue}n.set(o===0&&s===i?e:e.subarray(o,o+s),this.pos),this.pos+=s,o+=s,this.pos===r&&(this.process(t,0),this.pos=0,a=!0)}return this.length+=e.length,a&&this.roundClean(),this}digestInto(e){Pe(this),Fe(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,t.fill(0,a),this.padOffset>r-a&&(this.process(n,0),t.fill(0)),de(n,r-8,this.length*8,i),this.process(n,0),this.roundClean();let o=e===t?n:Le(e),s=this.outputLen,c=s/4,l=this.get();if(s%4||c>l.length)throw Error(`invalid outputLen`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneIntoMeta(e){let{buffer:t,length:n,finished:r,destroyed:i,pos:a}=this;return e.destroyed=i,e.finished=r,e.length=n,e.pos=a,a&&e.buffer.set(t),e}clone(){return this._cloneInto()}},Qe=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),$e=Uint32Array.from([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]),et=Uint32Array.from([3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]),tt=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209])})))()}var rt=t({_SHA224:()=>ct,_SHA256:()=>st,_SHA384:()=>gt,_SHA512:()=>ht,_SHA512_224:()=>yt,_SHA512_256:()=>bt,sha224:()=>St,sha256:()=>xt,sha384:()=>wt,sha512:()=>Ct,sha512_224:()=>Et,sha512_256:()=>Tt}),it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et;function Dt(){return(Dt=e((()=>{nt(),ke(),Je(),it=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),at=new Uint32Array(64),ot=class extends Ze{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),this._cloneIntoMeta(e)}process(e,t){for(let n=0;n<16;n++,t+=4)at[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=at[e-15],n=at[e-2],r=Re(t,7)^Re(t,18)^t>>>3,i=Re(n,17)^Re(n,19)^n>>>10;at[e]=i+at[e-7]+r+at[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=Re(o,6)^Re(o,11)^Re(o,25),u=l+t+Ye(o,s,c)+it[e]+at[e]|0,d=(Re(n,2)^Re(n,13)^Re(n,22))+Xe(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){Ie(at)}destroy(){this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),Ie(this.buffer)}},st=class extends ot{constructor(){super(32,Qe)}},ct=class extends ot{constructor(){super(28,$e)}},lt=ue(`0x428a2f98d728ae22.0x7137449123ef65cd.0xb5c0fbcfec4d3b2f.0xe9b5dba58189dbbc.0x3956c25bf348b538.0x59f111f1b605d019.0x923f82a4af194f9b.0xab1c5ed5da6d8118.0xd807aa98a3030242.0x12835b0145706fbe.0x243185be4ee4b28c.0x550c7dc3d5ffb4e2.0x72be5d74f27b896f.0x80deb1fe3b1696b1.0x9bdc06a725c71235.0xc19bf174cf692694.0xe49b69c19ef14ad2.0xefbe4786384f25e3.0x0fc19dc68b8cd5b5.0x240ca1cc77ac9c65.0x2de92c6f592b0275.0x4a7484aa6ea6e483.0x5cb0a9dcbd41fbd4.0x76f988da831153b5.0x983e5152ee66dfab.0xa831c66d2db43210.0xb00327c898fb213f.0xbf597fc7beef0ee4.0xc6e00bf33da88fc2.0xd5a79147930aa725.0x06ca6351e003826f.0x142929670a0e6e70.0x27b70a8546d22ffc.0x2e1b21385c26c926.0x4d2c6dfc5ac42aed.0x53380d139d95b3df.0x650a73548baf63de.0x766a0abb3c77b2a8.0x81c2c92e47edaee6.0x92722c851482353b.0xa2bfe8a14cf10364.0xa81a664bbc423001.0xc24b8b70d0f89791.0xc76c51a30654be30.0xd192e819d6ef5218.0xd69906245565a910.0xf40e35855771202a.0x106aa07032bbd1b8.0x19a4c116b8d2d0c8.0x1e376c085141ab53.0x2748774cdf8eeb99.0x34b0bcb5e19b48a8.0x391c0cb3c5c95a63.0x4ed8aa4ae3418acb.0x5b9cca4f7763e373.0x682e6ff3d6b2b8a3.0x748f82ee5defb2fc.0x78a5636f43172f60.0x84c87814a1f0ab72.0x8cc702081a6439ec.0x90befffa23631e28.0xa4506cebde82bde9.0xbef9a3f7b2c67915.0xc67178f2e372532b.0xca273eceea26619c.0xd186b8c721c0c207.0xeada7dd6cde0eb1e.0xf57d4f7fee6ed178.0x06f067aa72176fba.0x0a637dc5a2c898a6.0x113f9804bef90dae.0x1b710b35131c471b.0x28db77f523047d84.0x32caab7b40c72493.0x3c9ebe0a15c9bebc.0x431d67c49c100d4c.0x4cc5d4becb3e42b6.0x597f299cfc657e2a.0x5fcb6fab3ad6faec.0x6c44198c4a475817`.split(`.`).map(e=>BigInt(e))),ut=lt[0],dt=lt[1],ft=new Uint32Array(80),pt=new Uint32Array(80),mt=class extends Ze{Ah=0;Al=0;Bh=0;Bl=0;Ch=0;Cl=0;Dh=0;Dl=0;Eh=0;El=0;Fh=0;Fl=0;Gh=0;Gl=0;Hh=0;Hl=0;constructor(e,t){super(128,e,16,!1),this.Ah=t[0]|0,this.Al=t[1]|0,this.Bh=t[2]|0,this.Bl=t[3]|0,this.Ch=t[4]|0,this.Cl=t[5]|0,this.Dh=t[6]|0,this.Dl=t[7]|0,this.Eh=t[8]|0,this.El=t[9]|0,this.Fh=t[10]|0,this.Fl=t[11]|0,this.Gh=t[12]|0,this.Gl=t[13]|0,this.Hh=t[14]|0,this.Hl=t[15]|0}get(){let{Ah:e,Al:t,Bh:n,Bl:r,Ch:i,Cl:a,Dh:o,Dl:s,Eh:c,El:l,Fh:u,Fl:d,Gh:f,Gl:p,Hh:m,Hl:h}=this;return[e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h]}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.Ah=e|0,this.Al=t|0,this.Bh=n|0,this.Bl=r|0,this.Ch=i|0,this.Cl=a|0,this.Dh=o|0,this.Dl=s|0,this.Eh=c|0,this.El=l|0,this.Fh=u|0,this.Fl=d|0,this.Gh=f|0,this.Gl=p|0,this.Hh=m|0,this.Hl=h|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),this._cloneIntoMeta(e)}process(e,t){for(let n=0;n<16;n++,t+=4)ft[n]=e.getUint32(t),pt[n]=e.getUint32(t+=4);for(let e=16;e<80;e++){let t=ft[e-15]|0,n=pt[e-15]|0,r=ye(t,n,1)^ye(t,n,8)^_e(t,n,7),i=be(t,n,1)^be(t,n,8)^ve(t,n,7),a=ft[e-2]|0,o=pt[e-2]|0,s=ye(a,o,19)^xe(a,o,61)^_e(a,o,6),c=be(a,o,19)^Se(a,o,61)^ve(a,o,6),l=Te(i,c,pt[e-7],pt[e-16]),u=Ee(l,r,s,ft[e-7],ft[e-16]);ft[e]=u|0,pt[e]=l|0}let{Ah:n,Al:r,Bh:i,Bl:a,Ch:o,Cl:s,Dh:c,Dl:l,Eh:u,El:d,Fh:f,Fl:p,Gh:m,Gl:h,Hh:g,Hl:_}=this;for(let e=0;e<80;e++){let t=ye(u,d,14)^ye(u,d,18)^xe(u,d,41),v=be(u,d,14)^be(u,d,18)^Se(u,d,41),y=u&f^~u&m,b=d&p^~d&h,x=De(_,v,b,dt[e],pt[e]),S=Oe(x,g,t,y,ut[e],ft[e]),C=x|0,w=ye(n,r,28)^xe(n,r,34)^xe(n,r,39),T=be(n,r,28)^Se(n,r,34)^Se(n,r,39),E=n&i^n&o^i&o,ee=r&a^r&s^a&s;g=m|0,_=h|0,m=f|0,h=p|0,f=u|0,p=d|0,{h:u,l:d}=fe(c|0,l|0,S|0,C|0),c=o|0,l=s|0,o=i|0,s=a|0,i=n|0,a=r|0;let D=Ce(C,T,ee);n=we(D,S,w,E),r=D|0}({h:n,l:r}=fe(this.Ah|0,this.Al|0,n|0,r|0)),{h:i,l:a}=fe(this.Bh|0,this.Bl|0,i|0,a|0),{h:o,l:s}=fe(this.Ch|0,this.Cl|0,o|0,s|0),{h:c,l}=fe(this.Dh|0,this.Dl|0,c|0,l|0),{h:u,l:d}=fe(this.Eh|0,this.El|0,u|0,d|0),{h:f,l:p}=fe(this.Fh|0,this.Fl|0,f|0,p|0),{h:m,l:h}=fe(this.Gh|0,this.Gl|0,m|0,h|0),{h:g,l:_}=fe(this.Hh|0,this.Hl|0,g|0,_|0),this.set(n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_)}roundClean(){Ie(ft,pt)}destroy(){this.destroyed=!0,Ie(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}},ht=class extends mt{constructor(){super(64,tt)}},gt=class extends mt{constructor(){super(48,et)}},_t=Uint32Array.from([2352822216,424955298,1944164710,2312950998,502970286,855612546,1738396948,1479516111,258812777,2077511080,2011393907,79989058,1067287976,1780299464,286451373,2446758561]),vt=Uint32Array.from([573645204,4230739756,2673172387,3360449730,596883563,1867755857,2520282905,1497426621,2519219938,2827943907,3193839141,1401305490,721525244,746961066,246885852,2177182882]),yt=class extends mt{constructor(){super(28,_t)}},bt=class extends mt{constructor(){super(32,vt)}},xt=Ve(()=>new st,qe(1)),St=Ve(()=>new ct,qe(4)),Ct=Ve(()=>new ht,qe(3)),wt=Ve(()=>new gt,qe(2)),Tt=Ve(()=>new bt,qe(6)),Et=Ve(()=>new yt,qe(5))})))()}var Ot,kt;function At(){return(At=e((()=>{a(),u(),Ot={},kt=E(class extends n{constructor(){super(...arguments),this.ot=Ot}render(e,t){return t()}update(e,[t,n]){if(Array.isArray(t)){if(Array.isArray(this.ot)&&this.ot.length===t.length&&t.every((e,t)=>e===this.ot[t]))return f}else if(this.ot===t)return f;return this.ot=Array.isArray(t)?Array.from(t):t,this.render(t,n)}})})))()}function jt(){return(jt=e((()=>{At()})))()}var Mt,Nt;function Pt(){return(Pt=e((()=>{Mt=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},Nt=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}})))()}var Ft,It,Lt,Rt;function zt(){return(zt=e((()=>{a(),l(),o(),Pt(),u(),Ft=e=>!r(e)&&typeof e.then==`function`,It=1073741823,Lt=class extends i{constructor(){super(...arguments),this._$Cwt=It,this._$Cbt=[],this._$CK=new Mt(this),this._$CX=new Nt}render(...e){return e.find(e=>!Ft(e))??f}update(e,t){let n=this._$Cbt,r=n.length;this._$Cbt=t;let i=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){let o=t[e];if(!Ft(o))return this._$Cwt=e,o;e<r&&o===n[e]||(this._$Cwt=It,r=0,Promise.resolve(o).then(async e=>{for(;a.get();)await a.get();let t=i.deref();if(t!==void 0){let n=t._$Cbt.indexOf(o);n>-1&&n<t._$Cwt&&(t._$Cwt=n,t.setValue(e))}}))}return f}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},Rt=E(Lt)})))()}function Bt(){return(Bt=e((()=>{zt()})))()}function Vt(e){let t=`&`+e+`;`;Ht.innerHTML=t;let n=Ht.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`?!1:n!==t&&n}var Ht;function Ut(){return(Ut=e((()=>{Ht=document.createElement(`i`)})))()}function Wt(){}function Gt(){return(Gt=e((()=>{})))()}var Kt,qt,Jt;function Yt(){return(Yt=e((()=>{Kt=(e,t=[])=>({parts:(...n)=>{if(Jt(t))return Kt(e,n);throw Error(`createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?`)},extendWith:(...n)=>Kt(e,[...t,...n]),omit:(...n)=>Kt(e,t.filter(e=>!n.includes(e))),rename:e=>Kt(e,t),keys:()=>t,build:()=>[...new Set(t)].reduce((t,n)=>{let r=`data-${qt(e)}-${qt(n)}`;return Object.assign(t,{[n]:{selector:[`&[${r}]`,`& [${r}]`].join(`, `),attr:r,attrs:(e=``)=>({[r]:e})}})},{})}),qt=e=>e.replace(/([A-Z])([A-Z])/g,`$1-$2`).replace(/([a-z])([A-Z])/g,`$1-$2`).replace(/[\s_]+/g,`-`).toLowerCase(),Jt=e=>e.length===0})))()}var Xt,A;function Zt(){return(Zt=e((()=>{Yt(),Xt=Kt(`menu`).parts(`arrow`,`arrowTip`,`content`,`contextTrigger`,`indicator`,`item`,`itemGroup`,`itemGroupLabel`,`itemIndicator`,`itemText`,`positioner`,`separator`,`trigger`,`triggerItem`),A=Xt.build()})))()}function Qt(e){return e==null?[]:Array.isArray(e)?e:[e]}function $t(e,t,n={}){let{step:r=1,loop:i=!0}=n,a=t+r,o=e.length,s=o-1;return t===-1?r>0?0:s:a<0?i?s:0:a>=o?i?0:t>o?o:t:a}function en(e,t,n={}){return e[$t(e,t,n)]}function tn(e,t,n={}){let{step:r=1,loop:i=!0}=n;return $t(e,t,{step:-r,loop:i})}function nn(e,t,n={}){return e[tn(e,t,n)]}var rn,an;function on(){return(on=e((()=>{rn=e=>e[0],an=e=>e[e.length-1]})))()}var sn,cn;function ln(){return(ln=e((()=>{sn=Object.prototype.hasOwnProperty,cn=(e,t)=>{if(Object.is(e,t))return!0;if(e==null||t==null)return!1;if(typeof e.isEqual==`function`&&typeof t.isEqual==`function`)return e.isEqual(t);if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!cn(e[n],t[n]))return!1;return!0}if(typeof e!=`object`||typeof t!=`object`)return!1;let n=Object.keys(t);if(Object.keys(e).length!==n.length)return!1;for(let r=0;r<n.length;r++){let i=n[r];if(!sn.call(e,i)||!cn(e[i],t[i]))return!1}return!0}})))()}var un,dn,fn,j,pn,mn,hn,gn,_n,vn,yn,bn,xn;function Sn(){return(Sn=e((()=>{un=()=>!1,dn=e=>typeof e==`object`&&!!e,fn=e=>typeof e==`string`,j=e=>typeof e==`function`,pn=e=>e==null,mn=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),hn=e=>Object.prototype.toString.call(e),gn=Function.prototype.toString,_n=gn.call(Object),vn=e=>{if(!dn(e)||hn(e)!=`[object Object]`||xn(e))return!1;let t=Object.getPrototypeOf(e);if(t===null)return!0;let n=mn(t,`constructor`)&&t.constructor;return typeof n==`function`&&n instanceof n&&gn.call(n)==_n},yn=e=>typeof e==`object`&&!!e&&`$$typeof`in e&&`props`in e,bn=e=>typeof e==`object`&&!!e&&`__v_isVNode`in e,xn=e=>yn(e)||bn(e)})))()}var Cn,wn,Tn,En,Dn;function On(){return(On=e((()=>{Cn=(e,...t)=>(typeof e==`function`?e(...t):e)??void 0,wn=e=>e,Tn=e=>e(),En=()=>{},Dn=(...e)=>(...t)=>{e.forEach(function(e){e?.(...t)})}})))()}function kn(e){if(!vn(e)||e===void 0)return e;let t=Reflect.ownKeys(e).filter(e=>typeof e==`string`),n={};for(let r of t){let t=e[r];t!==void 0&&(n[r]=kn(t))}return n}function An(){return(An=e((()=>{Sn()})))()}function jn(...e){e.length===1?e[0]:e[1],e.length===2&&e[0]}function Mn(...e){e.length===1?e[0]:e[1],e.length===2&&e[0]}function Nn(e,t){if(e==null)throw Error(t())}function Pn(...e){let t={};for(let n of e){if(!n)continue;for(let e in t){if(e.startsWith(`on`)&&typeof t[e]==`function`&&typeof n[e]==`function`){t[e]=Dn(n[e],t[e]);continue}if(e===`className`||e===`class`){t[e]=Fn(t[e],n[e]);continue}if(e===`style`){t[e]=zn(t[e],n[e]);continue}if(e===`data-ownedby`){t[e]=In(t[e],n[e]);continue}t[e]=n[e]===void 0?t[e]:n[e]}for(let e in n)t[e]===void 0&&(t[e]=n[e]);let e=Object.getOwnPropertySymbols(n);for(let r of e)t[r]=n[r]}return t}var Fn,In,Ln,Rn,zn;function Bn(){return(Bn=e((()=>{On(),Sn(),Fn=(...e)=>e.map(e=>e?.trim?.()).filter(Boolean).join(` `),In=(...e)=>Array.from(new Set(Fn(...e).split(/\s+/).filter(Boolean))).join(` `),Ln=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g,Rn=e=>{let t={},n;for(;n=Ln.exec(e);)t[n[1]]=n[2];return t},zn=(e,t)=>{if(fn(e)){if(fn(t))return`${e};${t}`;e=Rn(e)}else fn(t)&&(t=Rn(t));return Object.assign({},e??{},t??{})}})))()}function Vn(){let e=new Map;return{claim(t){let n=Symbol(t);return e.set(t,n),n},isReplaced(t,n){return e.get(t)!==n}}}function Hn(e){return e.join(cr)}function Un(e){return e.includes(cr)}function Wn(e){return e.startsWith(lr)}function Gn(e){return e.startsWith(cr)}function Kn(e){return Wn(e)?e.slice(lr.length):e}function qn(e,t){return e?`${e}${cr}${t}`:t}function Jn(e){let t=new Map,n=new Map,r=(e,i)=>{t.set(e,i);let a=i.id;a&&(n.has(a)&&Mn(`[zag-js] Duplicate state id: "${a}"`),n.set(a,e));let o=i.states;if(o){Nn(i.initial,()=>`[zag-js] Compound state "${e}" has child states but no "initial" property`),i.initial in o||Mn(`[zag-js] Compound state "${e}" has initial "${String(i.initial)}" which is not a child state`);for(let[t,n]of Object.entries(o)){if(!n)continue;let i=qn(e,t);r(i,n)}}};for(let[t,n]of Object.entries(e.states))n&&r(t,n);return{index:t,idIndex:n}}function Yn(e){let t=dr.get(e);if(t)return t;let{index:n,idIndex:r}=Jn(e);return dr.set(e,n),fr.set(e,r),n}function Xn(e,t){return Yn(e),fr.get(e)?.get(t)}function Zn(e){return e?String(e).split(cr).filter(Boolean):[]}function Qn(e,t){let n=Yn(e),r=Zn(t),i=[],a=[];for(let e of r){a.push(e);let t=Hn(a),r=n.get(t);if(!r)break;i.push({path:t,state:r})}return un()&&Object.freeze(i),i}function $n(e,t){if(!t)return ur;let n=pr.get(e);n||pr.set(e,n=new Map);let r=n.get(t);return r||(r=Qn(e,t),n.set(t,r)),r}function er(e,t){let n=Yn(e),r=Zn(t);if(!r.length)return t;let i=[];for(let e of r){i.push(e);let r=Hn(i);if(!n.has(r))return t}let a=Hn(i),o=n.get(a);for(;o?.initial;){let e=`${a}${cr}${o.initial}`,t=n.get(e);if(!t)break;a=e,o=t}return a}function tr(e,t){return Yn(e).has(t)}function nr(e,t,n){let r=String(t);if(Wn(r)){let t=Kn(r),n=Xn(e,t);return Nn(n,()=>`[zag-js] Unknown state id: "${t}"`),er(e,n)}if(Gn(r)&&n)return er(e,qn(n,r.slice(1)));if(!Un(r)&&n){let t=Zn(n);for(let n=t.length-1;n>=1;n--){let i=qn(t.slice(0,n).join(cr),r);if(tr(e,i))return er(e,i)}if(tr(e,r))return er(e,r)}return er(e,r)}function rr(e,t,n){let r=$n(e,t);for(let e=r.length-1;e>=0;e--){let t=r[e]?.state.on?.[n];if(t)return{transitions:t,source:r[e]?.path}}return{transitions:e.on?.[n],source:void 0}}function ir(e,t,n,r){let i=t?$n(e,t):[],a=$n(e,n),o=0;for(;o<i.length&&o<a.length&&i[o]?.path===a[o]?.path;)o+=1;let s=i.slice(o).reverse(),c=a.slice(o),l=i[i.length-1]?.path===a[a.length-1]?.path;return r&&l&&(s=i.slice().reverse(),c=a.slice()),{exiting:s,entering:c}}function ar(e,t){return e?e===t||e.startsWith(`${t}${cr}`):!1}function or(e,t){let n=mr.get(e);n||mr.set(e,n=new Map);let r=n.get(t);if(!r){let i=new Set;for(let n of $n(e,t)){let e=n.state.tags;if(e)for(let t of e)i.add(t)}r=i,n.set(t,r)}return r}function sr(e,t,n){return or(e,t).has(n)}var cr,lr,ur,dr,fr,pr,mr;function hr(){return(hr=e((()=>{Sn(),cr=`.`,lr=`#`,ur=[],Object.freeze(ur),dr=new WeakMap,fr=new WeakMap,pr=new WeakMap,mr=new WeakMap})))()}function gr(){return{and:(...e)=>function(t){return e.every(e=>t.guard(e))},or:(...e)=>function(t){return e.some(e=>t.guard(e))},not:e=>function(t){return!t.guard(e)}}}function _r(e){return Yn(e),e}function vr(){return(vr=e((()=>{hr()})))()}var yr,br;function xr(){return(xr=e((()=>{yr=(e=>(e.NotStarted=`Not Started`,e.Started=`Started`,e.Stopped=`Stopped`,e))(yr||{}),br=`__init__`})))()}var Sr,Cr,wr;function Tr(){return(Tr=e((()=>{Sr=Object.defineProperty,Cr=(e,t,n)=>t in e?Sr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,wr=(e,t,n)=>Cr(e,typeof t==`symbol`?t:t+``,n)})))()}var Er,Dr,Or,M,kr;function Ar(){return(Ar=e((()=>{Er=(e,t)=>e.map((n,r)=>e[(Math.max(t,0)+r)%e.length]),Dr=()=>void 0,Or=e=>typeof e==`object`&&!!e,M=e=>e?``:void 0,kr=e=>e?`true`:void 0})))()}function jr(e){return[`html`,`body`,`#document`].includes(Wr(e))}function Mr(e){return e?Ir(e.getRootNode())===e:!1}function Nr(e){if(e==null||!F(e))return!1;try{return qr(e)&&e.selectionStart!=null||Xr.test(e.localName)||e.isContentEditable||e.getAttribute(`contenteditable`)===`true`||e.getAttribute(`contenteditable`)===``}catch{return!1}}function Pr(e,t){if(!e||!t||!F(e)||!Gr(t))return!1;if(F(t)&&e===t||e.contains(t))return!0;let n=t.getRootNode?.();if(n&&Kr(n)){let n=t;for(;n;){if(e===n)return!0;n=n.parentNode||n.host}}return!1}function N(e){return Hr(e)?e:Ur(e)?e.document:e?.ownerDocument??document}function Fr(e){return N(e).documentElement}function P(e){return Kr(e)?P(e.host):Hr(e)?e.defaultView??window:F(e)?e.ownerDocument?.defaultView??window:window}function Ir(e){let t=e.activeElement;for(;t?.shadowRoot;){let e=t.shadowRoot.activeElement;if(!e||e===t)break;t=e}return t}function Lr(e){if(Wr(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||Kr(e)&&e.host||Fr(e);return Kr(t)?t.host:t}function Rr(e){let t;try{if(t=e.getRootNode({composed:!0}),Hr(t)||Kr(t))return t}catch{}return e.ownerDocument??document}var zr,Br,Vr,F,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr;function I(){return(I=e((()=>{Ar(),zr=1,Br=9,Vr=11,F=e=>Or(e)&&e.nodeType===zr&&typeof e.nodeName==`string`,Hr=e=>Or(e)&&e.nodeType===Br,Ur=e=>Or(e)&&e===e.window,Wr=e=>F(e)?e.localName||``:`#document`,Gr=e=>Or(e)&&e.nodeType!==void 0,Kr=e=>Gr(e)&&e.nodeType===Vr&&`host`in e,qr=e=>F(e)&&e.localName===`input`,Jr=e=>!!e?.matches(`a[href]`),Yr=e=>F(e)?e.offsetWidth>0||e.offsetHeight>0||e.getClientRects().length>0:!1,Xr=/(textarea|select)/})))()}function Zr(e){return Qr.has(e)||Qr.set(e,P(e).getComputedStyle(e)),Qr.get(e)}var Qr;function $r(){return($r=e((()=>{I(),Qr=new WeakMap})))()}function ei(){return navigator.userAgentData?.platform??navigator.platform}function ti(){let e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(({brand:e,version:t})=>`${e}/${t}`).join(` `):navigator.userAgent}var ni,ri,ii,ai,oi,si,ci,li,ui,di;function fi(){return(fi=e((()=>{ni=()=>typeof document<`u`,ri=e=>ni()&&e.test(ei()),ii=e=>ni()&&e.test(ti()),ai=/^Mac/i,oi=/Firefox/i,si=/Android/i,ci=()=>ni()&&!!navigator.maxTouchPoints,li=()=>ri(ai),ui=()=>ii(oi),di=()=>ii(si)})))()}function pi(e,t){let n=new Set,r=Rr(e),i=e=>{let a=e.querySelectorAll(`[aria-controls]`);for(let e of a){if(e.getAttribute(`aria-expanded`)!==`true`)continue;let a=gi(e);for(let e of a){if(!e||n.has(e))continue;n.add(e);let a=r.getElementById(e);if(a){let e=a.getAttribute(`role`),n=a.getAttribute(`aria-modal`)===`true`;if(e&&hi(e)&&!n&&(a===t||a.contains(t)||i(a)))return!0}}}return!1};return i(e)}var mi,hi,gi;function _i(){return(_i=e((()=>{I(),mi=new Set([`menu`,`listbox`,`dialog`,`grid`,`tree`,`region`,`application`]),hi=e=>mi.has(e),gi=e=>e.getAttribute(`aria-controls`)?.split(` `)||[]})))()}function vi(e){return e.composedPath?.()??e.nativeEvent?.composedPath?.()}function L(e){return vi(e)?.[0]??e.target}function yi(e){let t=e.currentTarget;if(!t||!t.matches(`a[href], button[type='submit'], input[type='submit']`))return!1;let n=e.button===1,r=xi(e);return n||r}function bi(e){let t=e.currentTarget;if(!t)return!1;let n=t.localName;return e.altKey?n===`a`||n===`button`&&t.type===`submit`||n===`input`&&t.type===`submit`:!1}function xi(e){return li()?e.metaKey:e.ctrlKey}function Si(e){return e.key.length===1&&!e.ctrlKey&&!e.metaKey}function Ci(e){return e.pointerType===``&&e.isTrusted?!0:di()&&e.pointerType?e.type===`click`&&e.buttons===1:e.detail===0&&!e.pointerType}function wi(e,t={}){let{dir:n=`ltr`,orientation:r=`horizontal`}=t,i=e.key;return i=ki[i]??i,n===`rtl`&&r===`horizontal`&&i in Ai&&(i=Ai[i]),i}function Ti(e,t=`client`){let n=Oi(e)?e.touches[0]||e.changedTouches[0]:e;return{x:n[`${t}X`],y:n[`${t}Y`]}}var Ei,Di,Oi,ki,Ai,ji;function Mi(){return(Mi=e((()=>{fi(),Ei=e=>e.button===2||li()&&e.ctrlKey&&e.button===0,Di=e=>e.ctrlKey||e.altKey||e.metaKey,Oi=e=>`touches`in e&&e.touches.length>0,ki={Up:`ArrowUp`,Down:`ArrowDown`,Esc:`Escape`," ":`Space`,",":`Comma`,Left:`ArrowLeft`,Right:`ArrowRight`},Ai={ArrowLeft:`ArrowRight`,ArrowRight:`ArrowLeft`},ji=(e,t,n,r)=>{let i=typeof e==`function`?e():e;return i?.addEventListener(t,n,r),()=>{i?.removeEventListener(t,n,r)}}})))()}function R(e){let t=Fi.create();return t.request(e),t.cleanup}function Ni(e){let t=new Set;function n(e){let n=globalThis.requestAnimationFrame(e);t.add(()=>globalThis.cancelAnimationFrame(n))}return n(()=>n(e)),function(){t.forEach(e=>e())}}function Pi(e,t,n){let r=R(()=>{e.removeEventListener(t,i,!0),n()}),i=()=>{r(),n()};return e.addEventListener(t,i,{once:!0,capture:!0}),r}var Fi;function Ii(){return(Ii=e((()=>{Tr(),Fi=class e{constructor(){wr(this,`id`,null),wr(this,`fn_cleanup`),wr(this,`cleanup`,()=>{this.cancel()})}static create(){return new e}request(e){this.cancel(),this.id=globalThis.requestAnimationFrame(()=>{this.id=null,this.fn_cleanup=e?.()})}cancel(){this.id!==null&&(globalThis.cancelAnimationFrame(this.id),this.id=null),this.fn_cleanup?.(),this.fn_cleanup=void 0}isActive(){return this.id!==null}}})))()}function Li(e){let t=e.getAttribute(`tabindex`);return t?parseInt(t,10):NaN}function Ri(e){return qr(e)&&e.type===`radio`}function zi(e){if(!Ri(e)||!e.name||e.checked)return!0;let t=`input[type="radio"][name="${CSS.escape(e.name)}"]`,n=e.form??e.ownerDocument,r=Array.from(n.querySelectorAll(t)).filter(t=>t.form===e.form&&Hi(t)),i=r.find(e=>e.checked);return i?i===e:r[0]===e}function Bi(e,t){if(!t)return null;if(t===!0)return e.shadowRoot||null;let n=t(e);return(n===!0?e.shadowRoot:n)||null}function Vi(e,t,n){let r=[...e],i=[...e],a=new Set,o=new Map;e.forEach((e,t)=>o.set(e,t));let s=0;for(;s<i.length;){let e=i[s++];if(!e||a.has(e))continue;a.add(e);let c=Bi(e,t);if(c){let t=Array.from(c.querySelectorAll(Ji)).filter(n),a=o.get(e);if(a!==void 0){let e=a+1;r.splice(e,0,...t),t.forEach((t,n)=>{o.set(t,e+n)});for(let n=e+t.length;n<r.length;n++)o.set(r[n],n)}else{let e=r.length;r.push(...t),t.forEach((t,n)=>{o.set(t,e+n)})}i.push(...t)}}return r}function Hi(e){return!F(e)||e.closest(`[inert]`)?!1:e.matches(Ji)&&Yr(e)}function Ui(e,t={}){if(!e)return[];let{includeContainer:n,getShadowRoot:r}=t,i=Array.from(e.querySelectorAll(Ji));n&&Wi(e)&&i.unshift(e);let a=[];for(let e of i)if(Wi(e)){if(Ki(e)&&e.contentDocument){let t=e.contentDocument.body;a.push(...Ui(t,{getShadowRoot:r}));continue}a.push(e)}if(r){let e=Vi(a,r,Wi);return!e.length&&n?i:e}return!a.length&&n?i:a}function Wi(e){return F(e)&&e.tabIndex>0?!0:!Hi(e)||qi(e)?!1:zi(e)}function Gi(e,t={}){let n=Ui(e,t);return[n[0]||null,n[n.length-1]||null]}var Ki,qi,Ji;function Yi(){return(Yi=e((()=>{I(),Ki=e=>F(e)&&e.tagName===`IFRAME`,qi=e=>Li(e)<0,Ji=`input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), details > summary:first-of-type`})))()}function Xi(e){let{root:t,getInitialEl:n,filter:r,enabled:i=!0}=e;if(!i)return;let a=typeof n==`function`?n():n;return a||=t?.querySelector(`[data-autofocus],[autofocus]`),a||=Ui(t).filter(e=>!r||r(e)).find(e=>!e.hasAttribute(`data-no-autofocus`)),a||t||void 0}function Zi(e){let t=e.currentTarget;if(!t)return!1;let[n,r]=Gi(t);return!(Mr(n)&&e.shiftKey||Mr(r)&&!e.shiftKey||!n&&!r)}function Qi(){return(Qi=e((()=>{I(),Yi()})))()}function $i(e,t){if(!e)return;let{attributes:n,callback:r}=t,i=new(e.ownerDocument.defaultView||window).MutationObserver(e=>{for(let t of e)t.type===`attributes`&&t.attributeName&&n.includes(t.attributeName)&&r(t)});return i.observe(e,{attributes:!0,attributeFilter:n}),()=>i.disconnect()}function ea(e,t){let{defer:n}=t,r=n?R:e=>e(),i=[];return i.push(r(()=>{let n=typeof e==`function`?e():e;i.push($i(n,t))})),()=>{i.forEach(e=>e?.())}}function ta(){return(ta=e((()=>{Ii()})))()}function na(e){let t=()=>{let t=P(e);e.dispatchEvent(new t.MouseEvent(`click`))};ui()?Pi(e,`keyup`,t):queueMicrotask(t)}function ra(){return(ra=e((()=>{I(),fi(),Ii()})))()}function ia(e){let t=Lr(e);return jr(t)?N(t).body:F(t)&&aa(t)?t:ia(t)}function aa(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=P(e).getComputedStyle(e);return oa.test(t+r+n)&&!sa.has(i)}var oa,sa;function ca(){return(ca=e((()=>{I(),oa=/auto|scroll|overlay|hidden|clip/,sa=new Set([`inline`,`contents`])})))()}function la(e,t,n=da){return e.find(e=>n(e)===t)}function ua(e,t,n=da){let r=la(e,t,n);return r?e.indexOf(r):-1}var da;function fa(){return(fa=e((()=>{da=e=>e.id})))()}function pa(e){return e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth}function ma(e,t){let{rootEl:n,...r}=t||{};e&&n&&aa(n)&&pa(n)&&e.scrollIntoView(r)}function ha(){return(ha=e((()=>{ca()})))()}function ga(e,t,n,r=da){let i=n?ua(e,n,r):-1,a=n?Er(e,i):e;return t.length===1&&(a=a.filter(e=>r(e)!==n)),a.find(e=>ya(va(e),t))}var _a,va,ya;function ba(){return(ba=e((()=>{fa(),Ar(),_a=e=>e.split(``).map(e=>{let t=e.charCodeAt(0);return t>0&&t<128?e:t>=128&&t<=255?`/x${t.toString(16)}`.replace(`/`,`\\`):``}).join(``).trim(),va=e=>_a(e.dataset?.valuetext??e.textContent??``),ya=(e,t)=>e.trim().toLowerCase().startsWith(t.toLowerCase())})))()}function xa(e,t){if(!e)return Dr;let n=Object.keys(t).reduce((t,n)=>(t[n]=e.style.getPropertyValue(n),t),{});return Sa(n,t)?Dr:(Object.assign(e.style,t),()=>{Object.assign(e.style,n),e.style.length===0&&e.removeAttribute(`style`)})}function Sa(e,t){return Object.keys(e).every(n=>e[n]===t[n])}function Ca(){return(Ca=e((()=>{Ar()})))()}function wa(e,t){let{state:n,activeId:r,key:i,timeout:a=350,itemToId:o}=t,s=n.keysSoFar+i,c=s.length>1&&Array.from(s).every(e=>e===s[0])?s[0]:s,l=ga(e.slice(),c,r,o);function u(){clearTimeout(n.timer),n.timer=-1}function d(e){n.keysSoFar=e,u(),e!==``&&(n.timer=+setTimeout(()=>{d(``),u()},a))}return d(s),l}function Ta(e){return e.key.length===1&&!e.ctrlKey&&!e.metaKey}var Ea;function Da(){return(Da=e((()=>{ba(),Ea=Object.assign(wa,{defaultOptions:{keysSoFar:``,timer:-1},isValidEvent:Ta})})))()}function Oa(e,t,n){let{signal:r}=t;return[new Promise((t,i)=>{let a=setTimeout(()=>{i(Error(`Timeout of ${n}ms exceeded`))},n);r.addEventListener(`abort`,()=>{clearTimeout(a),i(new DOMException(`Promise aborted`,`AbortError`))}),e.then(e=>{r.aborted||(clearTimeout(a),t(e))}).catch(e=>{r.aborted||(clearTimeout(a),i(e))})}),()=>t.abort()]}function ka(e,t){let{timeout:n,rootNode:r}=t,i=P(r),a=N(r),o=new i.AbortController;return Oa(new Promise(t=>{let n=e();if(n){t(n);return}let r=new i.MutationObserver(()=>{let n=e();n&&n.isConnected&&(r.disconnect(),t(n))});r.observe(a.body,{childList:!0,subtree:!0})}),o,n)}function Aa(){return(Aa=e((()=>{I()})))()}function ja(e,t,n={}){let{defer:r,onMissing:i}=n,a=()=>typeof e==`function`?e():e,o=[],s=e=>{if(!e)return i?.();o.push(t(e))};if(!r)s(a());else{let e=!1;o.push(()=>{e=!0}),queueMicrotask(()=>{if(e)return;let t=a();if(t){s(t);return}o.push(R(()=>{e||s(a())}))})}return(...e)=>{o.forEach(t=>t?.(...e))}}function Ma(){return(Ma=e((()=>{Ii()})))()}function Na(e){let t=()=>e.getRootNode?.()??document,n=()=>N(t()),r=()=>n().defaultView??window,i=()=>Ir(t()),a=e=>t().getElementById(e),o=e=>t().querySelector(e)??null,s=e=>Array.from(t().querySelectorAll(e)),c=t=>`[${t.attr}="${e.id}"]`;return{...e,getRootNode:t,getDoc:n,getWin:r,getActiveElement:i,isActiveElement:Mr,getById:a,query:o,queryAll:s,selector:c}}function Pa(){return(Pa=e((()=>{I()})))()}function Fa(e,t){return{[La]:!0,deps:e,setup:t}}function Ia(e){return typeof e==`object`&&!!e&&La in e}var La;function Ra(){return(Ra=e((()=>{La=Symbol.for(`zag.watchEffect`)})))()}function za(e){let t={each(t){for(let n=0;n<e.frames?.length;n+=1){let r=e.frames[n];r&&t(r)}},addEventListener(e,n,r){return t.each(t=>{try{t.document.addEventListener(e,n,r)}catch{}}),()=>{try{t.removeEventListener(e,n,r)}catch{}}},removeEventListener(e,n,r){t.each(t=>{try{t.document.removeEventListener(e,n,r)}catch{}})}};return t}function Ba(e){let t=e.frameElement==null?null:e.parent;return{addEventListener:(e,n,r)=>{try{t?.addEventListener(e,n,r)}catch{}return()=>{try{t?.removeEventListener(e,n,r)}catch{}}},removeEventListener:(e,n,r)=>{try{t?.removeEventListener(e,n,r)}catch{}}}}function Va(e){for(let t of e)if(F(t)&&Hi(t))return!0;return!1}function Ha(e,t){if(!Xa(t)||!e)return!1;let n=e.getBoundingClientRect();return n.width===0||n.height===0?!1:n.top<=t.clientY&&t.clientY<=n.top+n.height&&n.left<=t.clientX&&t.clientX<=n.left+n.width}function Ua(e,t){return e.y<=t.y&&t.y<=e.y+e.height&&e.x<=t.x&&t.x<=e.x+e.width}function Wa(e,t){if(!t||!Xa(e))return!1;let n=t.scrollHeight>t.clientHeight,r=n&&e.clientX>t.offsetLeft+t.clientWidth,i=t.scrollWidth>t.clientWidth,a=i&&e.clientY>t.offsetTop+t.clientHeight;return Ua({x:t.offsetLeft,y:t.offsetTop,width:t.clientWidth+(n?16:0),height:t.clientHeight+(i?16:0)},{x:e.clientX,y:e.clientY})?r||a:!1}function Ga(e,t){let{exclude:n,onFocusOutside:r,onPointerDownOutside:i,onInteractOutside:a,defer:o,followControlledElements:s=!0}=t;if(!e)return;let c=N(e),l=P(e),u=za(l),d=Ba(l);function f(t,r){if(!F(r)||!r.isConnected||Pr(e,r)||Ha(e,t)||s&&pi(e,r))return!1;let i=c.querySelector(`[aria-controls~="${e.id}"]`);return i&&Wa(t,ia(i))||Wa(t,ia(e))?!1:!n?.(r)}let p=new Set,m=Kr(e?.getRootNode()),h=!1;function g(t){h=!0;let n=()=>{h=!1};c.addEventListener(`pointerup`,n,{once:!0}),l.addEventListener(`pointerup`,n,{once:!0});function r(n){let r=o&&!ci()?R:e=>e(),s=n??t,c=s?.composedPath?.()??[s?.target];r(()=>{let n=m?c[0]:L(t);if(e&&f(t,n)){if(i||a){let t=Dn(i,a);e.addEventListener(Ja,t,{once:!0})}qa(e,Ja,{bubbles:!1,cancelable:!0,detail:{originalEvent:s,contextmenu:Ei(s),focusable:Va(c),target:n}})}})}t.pointerType===`touch`?(p.forEach(e=>e()),p.add(ji(c,`click`,r,{once:!0})),p.add(d.addEventListener(`click`,r,{once:!0})),p.add(u.addEventListener(`click`,r,{once:!0}))):r()}let _=new Set,v=setTimeout(()=>{_.add(ji(c,`pointerdown`,g,!0)),_.add(d.addEventListener(`pointerdown`,g,!0)),_.add(u.addEventListener(`pointerdown`,g,!0))},0);function y(t){h||(o?R:e=>e())(()=>{let n=t?.composedPath?.()??[t?.target],i=m?n[0]:L(t);if(e&&f(t,i)){if(r||a){let t=Dn(r,a);e.addEventListener(Ya,t,{once:!0})}qa(e,Ya,{bubbles:!1,cancelable:!0,detail:{originalEvent:t,contextmenu:!1,focusable:Hi(i),target:i}})}})}return ci()||(_.add(ji(c,`focusin`,y,!0)),_.add(d.addEventListener(`focusin`,y,!0)),_.add(u.addEventListener(`focusin`,y,!0))),()=>{clearTimeout(v),p.forEach(e=>e()),_.forEach(e=>e())}}function Ka(e,t){let{defer:n}=t,r=n?R:e=>e(),i=[];return i.push(r(()=>{let n=typeof e==`function`?e():e;i.push(Ga(n,t))})),()=>{i.forEach(e=>e?.())}}function qa(e,t,n){let r=new(e.ownerDocument.defaultView||window).CustomEvent(t,n);return e.dispatchEvent(r)}var Ja,Ya,Xa;function Za(){return(Za=e((()=>{Mi(),I(),fi(),ca(),_i(),Yi(),Ii(),On(),Ja=`pointerdown.outside`,Ya=`focus.outside`,Xa=e=>`clientY`in e})))()}function Qa(e,t){return ji(N(e),`keydown`,e=>{e.key===`Escape`&&(e.isComposing||t?.(e))},{capture:!0})}function $a(){return($a=e((()=>{Mi(),I()})))()}function eo(e){let t=e.pointerBlocking;return typeof t==`function`?t():!!t}function to(e,t){e.snapshot=t,e.onLayerChange?.(t)}function no(e,t,n){let r=new(e.ownerDocument.defaultView||window).CustomEvent(t,{cancelable:!0,bubbles:!0,detail:n});return e.dispatchEvent(r)}function ro(e,t,n){e.addEventListener(t,n,{once:!0})}var io,ao,z;function oo(){return(oo=e((()=>{I(),Ii(),ln(),io=`layer:request-dismiss`,ao=0,z={layers:[],branches:[],recentlyRemoved:new Set,pendingReattach:new Map,count(){return this.layers.length},pointerBlockingLayers(){return this.layers.filter(eo)},topMostPointerBlockingLayer(){return[...this.pointerBlockingLayers()].slice(-1)[0]},hasPointerBlockingLayer(){return this.pointerBlockingLayers().length>0},isBelowPointerBlockingLayer(e){return this.indexOf(e)<(this.topMostPointerBlockingLayer()?this.indexOf(this.topMostPointerBlockingLayer()?.node):-1)},isTopMost(e){return this.layers[this.count()-1]?.node===e},layerFor(e){return this.layers.find(t=>t.node===e)},peerFor(e){for(let t=this.count()-1;t>=0;t--)if(this.layers[t].group===e)return this.layers[t]},isDescendantOf(e,t){if(!t)return!1;let n=new Set,r=e.parentId;for(;r&&!n.has(r);){if(r===t)return!0;n.add(r),r=this.layers.find(e=>e.id===r)?.parentId}return!1},depthOf(e){let t=new Set,n=0,r=e.parentId;for(;r&&!t.has(r);)n++,t.add(r),r=this.layers.find(e=>e.id===r)?.parentId;return n},getNestedLayers(e){let t=this.layerFor(e)?.id;return t?this.layers.filter(e=>this.isDescendantOf(e,t)).sort((e,t)=>this.depthOf(e)-this.depthOf(t)):[]},getLayersByType(e){return this.layers.filter(t=>t.type===e)},getNestedLayersByType(e,t){return this.getNestedLayers(e).filter(e=>e.type===t)},getParentLayerOfType(e,t){let n=new Set,r=this.layerFor(e)?.parentId;for(;r&&!n.has(r);){let e=this.layers.find(e=>e.id===r);if(!e)return;if(e.type===t)return e;n.add(r),r=e.parentId}},countNestedLayersOfType(e,t){return this.getNestedLayersByType(e,t).length},isInNestedLayer(e,t){return!!(this.getNestedLayers(e).some(e=>Pr(e.node,t))||this.recentlyRemoved.size>0)},isInBranch(e){return Array.from(this.branches).some(t=>Pr(t,e))},add(e){let t=this.indexOf(e.node),n=t===-1?void 0:this.layers[t],r=this.pendingReattach.get(e.node);if(n)e.id??=n.id,e.parentId=n.parentId;else if(r)e.id??=r.id,e.parentId=r.parentId;else{e.id??=`layer-${++ao}`;let t=e.group?this.peerFor(e.group):void 0;e.parentId=t?t.parentId:e.parentId??this.layers[this.count()-1]?.id}t!==-1&&this.layers.splice(t,1),r?(this.pendingReattach.delete(e.node),this.layers.splice(Math.min(r.index,this.count()),0,e)):this.layers.push(e),this.syncLayers()},addBranch(e){this.branches.push(e)},remove(e,t){let n=this.indexOf(e);if(n<0)return;let r=this.layers[n];t?.reattach?this.pendingReattach.set(e,{id:r.id,parentId:r.parentId,index:n}):(this.recentlyRemoved.add(e),Ni(()=>this.recentlyRemoved.delete(e)),this.getNestedLayers(e).forEach(t=>z.dismiss(t.node,e))),this.layers.splice(n,1),r.snapshot&&to(r,{...r.snapshot,active:!1,blocked:!1}),this.syncLayers()},removeBranch(e){let t=this.branches.indexOf(e);t>=0&&this.branches.splice(t,1)},syncLayers(){this.layers.forEach((e,t)=>{let n=z.getParentLayerOfType(e.node,e.type),r=z.countNestedLayersOfType(e.node,e.type),i={active:!0,type:e.type,index:t,nested:n!=null,hasNested:r>0,nestedCount:r,blocked:z.isBelowPointerBlockingLayer(e.node)};cn(e.snapshot,i)||to(e,i)})},indexOf(e){return this.layers.findIndex(t=>t.node===e)},dismiss(e,t){let n=this.indexOf(e);if(n===-1)return;let r=this.layers[n];ro(e,io,e=>{r.requestDismiss?.(e),e.defaultPrevented||r?.dismiss()}),no(e,io,{originalLayer:e,targetLayer:t,originalIndex:n,targetIndex:t?this.indexOf(t):-1}),this.syncLayers()},clear(){this.remove(this.layers[0].node)}}})))()}function so(e){let t=e.body;if(!t)return;let n=z.hasPointerBlockingLayer();if(n!==t.hasAttribute(`data-inert`)){if(n){lo.set(t,t.style.pointerEvents),queueMicrotask(()=>{z.hasPointerBlockingLayer()&&(t.style.pointerEvents=`none`,t.setAttribute(`data-inert`,``))});return}queueMicrotask(()=>{if(z.hasPointerBlockingLayer())return;let e=lo.get(t);e!==void 0&&(t.style.pointerEvents=e,lo.delete(t)),t.removeAttribute(`data-inert`),t.style.length===0&&t.removeAttribute(`style`)})}}function co(e,t){let n=N(e),r=[];return so(n),t?.forEach(e=>{let[t,n]=ka(()=>{let t=e();return F(t)?t:null},{timeout:1e3});t.then(e=>r.push(xa(e,{pointerEvents:`auto`}))),r.push(n)}),()=>{so(n),r.forEach(e=>e())}}var lo;function uo(){return(uo=e((()=>{I(),Ca(),Aa(),oo(),lo=new WeakMap})))()}function fo(e,t){let{onDismiss:n,onRequestDismiss:r,pointerBlocking:i,exclude:a,debug:o,type:s=`dialog`,group:c,onLayerChange:l}=t,u={dismiss:n,node:e,type:s,group:c,pointerBlocking:i,requestDismiss:r,onLayerChange:l};z.add(u);function d(r){let i=L(r.detail.originalEvent);z.isBelowPointerBlockingLayer(e)||z.isInBranch(i)||(t.onPointerDownOutside?.(r),t.onInteractOutside?.(r),!r.defaultPrevented&&(o&&console.log(`onPointerDownOutside:`,r.detail.originalEvent),n?.()))}function f(e){let r=L(e.detail.originalEvent);z.isInBranch(r)||(t.onFocusOutside?.(e),t.onInteractOutside?.(e),!e.defaultPrevented&&(o&&console.log(`onFocusOutside:`,e.detail.originalEvent),n?.()))}function p(r){z.isTopMost(e)&&(t.onEscapeKeyDown?.(r),!r.defaultPrevented&&n&&(r.preventDefault(),n()))}function m(n){let r=typeof a==`function`?a():a,i=Array.isArray(r)?r:[r],o=t.persistentElements?.map(e=>e()).filter(F);return o&&i.push(...o),i.some(e=>Pr(e,n))||z.isInNestedLayer(e,n)}let h=[eo(u)?co(e,t.persistentElements):void 0,Qa(e,p),Ka(e,{exclude:m,onFocusOutside:f,onPointerDownOutside:d,defer:t.defer})];return t=>{z.remove(e,{reattach:t===`restart`}),h.forEach(e=>e?.())}}function po(e,t){let{warnOnMissingNode:n=!0}=t;return ja(e,e=>fo(e,t),{defer:t.defer,onMissing:n?()=>jn("[@zag-js/dismissable] node is `null` or `undefined`"):void 0})}function mo(){return(mo=e((()=>{I(),Mi(),Ma(),Za(),$a(),oo(),uo()})))()}function ho(e){return{"data-nested":e?.active&&e.nested?e.type:void 0,"data-has-nested":e?.active&&e.hasNested?e.type:void 0}}function go(e,t={}){let n=e?.active===!0,r={"--layer-index":n?`${e.index}`:void 0,"--nested-layer-count":n?`${e.nestedCount}`:void 0,"--z-index":t.zIndex&&n?`var(--layer-index)`:void 0};return t.pointerEvents&&(r.pointerEvents=n?e.blocked?`none`:`auto`:void 0),r}function _o(e){return!(e.metaKey||!li()&&e.altKey||e.ctrlKey||e.key===`Control`||e.key===`Shift`||e.key===`Meta`)}function vo(e,t,n){let r=n?L(n):null,i=N(r),a=P(r),o=Ir(i);return e=e||o instanceof a.HTMLInputElement&&!ko.has(o?.type)||o instanceof a.HTMLTextAreaElement||o instanceof a.HTMLElement&&o.isContentEditable,!(e&&t===`keyboard`&&n instanceof a.KeyboardEvent&&!Reflect.has(Ro,n.key))}function yo(e,t){for(let n of Mo)n(e,t)}function bo(e){Fo=null,Po=!0,_o(e)&&(jo=`keyboard`,yo(`keyboard`,e))}function B(e){(e.type!==`pointermove`&&e.type!==`mousemove`||!e.isTrusted||Lo?.x!==e.clientX||Lo?.y!==e.clientY)&&(Lo={x:e.clientX,y:e.clientY},jo=`pointer`,(e.type===`mousedown`||e.type===`pointerdown`)&&(Fo=null,Po=!0,yo(`pointer`,e)))}function xo(e){if(Ci(e)){Fo=null,Po=!0,jo=`virtual`;return}Fo=null;let t=L(e),n=t?.closest(`label`),r=n?.control;if(!n||!r||r.matches(`:disabled`))return;let i=t?.closest(Ao);i&&n.contains(i)&&i!==r||r!==Ir(n.ownerDocument)&&(Fo=r)}function So(e){let t=L(e),n=t===Fo;if(Ur(t)){Io=!0;return}!Hr(t)&&e.isTrusted&&(!Po&&!n&&!Io&&(jo=`virtual`,yo(`virtual`,e)),Po=!1,Fo=null,Io=!1)}function Co(){Po=!1,Fo=null,Io=!0}function wo(e){if(typeof window>`u`||No.get(P(e)))return;let t=P(e),n=N(e),r=t.HTMLElement.prototype.focus;function i(){Po=!0,r.apply(this,arguments)}try{Object.defineProperty(t.HTMLElement.prototype,"focus",{configurable:!0,value:i})}catch{}n.addEventListener(`keydown`,bo,!0),n.addEventListener(`keyup`,bo,!0),n.addEventListener(`click`,xo,!0),t.addEventListener(`focus`,So,!0),t.addEventListener(`blur`,Co,!1),t.PointerEvent===void 0?(n.addEventListener(`mousedown`,B,!0),n.addEventListener(`mousemove`,B,!0),n.addEventListener(`mouseup`,B,!0)):(n.addEventListener(`pointerdown`,B,!0),n.addEventListener(`pointermove`,B,!0),n.addEventListener(`pointerup`,B,!0)),t.addEventListener(`beforeunload`,()=>{zo(e)},{once:!0}),No.set(t,{focus:r})}function To(){return jo}function Eo(e){jo=e,yo(e,null)}function Do(){return jo===`keyboard`||jo===`virtual`}function Oo(e={}){let{isTextInput:t,autoFocus:n,onChange:r,root:i}=e;wo(i),r?.({isFocusVisible:n||Do(),modality:jo});let a=(e,n)=>{vo(!!t,e,n)&&r?.({isFocusVisible:Do(),modality:e})};return Mo.add(a),()=>{Mo.delete(a)}}var ko,Ao,jo,Mo,No,Po,Fo,Io,Lo,Ro,zo;function Bo(){return(Bo=e((()=>{I(),Mi(),fi(),ko=new Set([`checkbox`,`radio`,`range`,`color`,`file`,`image`,`button`,`submit`,`reset`]),Ao=[`a[href]`,`audio[controls]`,`button`,`details`,`embed`,`iframe`,`img[controls]`,`img[usemap]`,`input`,`select`,`textarea`,`video[controls]`].join(`,`),jo=null,Mo=new Set,No=new Map,Po=!1,Fo=null,Io=!1,Lo=null,Ro={Tab:!0,Escape:!0},zo=(e,t)=>{let n=P(e),r=N(e);t&&r.removeEventListener(`DOMContentLoaded`,t);let i=No.get(n);if(i){try{Object.defineProperty(n.HTMLElement.prototype,"focus",{configurable:!0,value:i.focus})}catch{}r.removeEventListener(`keydown`,bo,!0),r.removeEventListener(`keyup`,bo,!0),r.removeEventListener(`click`,xo,!0),n.removeEventListener(`focus`,So,!0),n.removeEventListener(`blur`,Co,!1),n.PointerEvent===void 0?(r.removeEventListener(`mousedown`,B,!0),r.removeEventListener(`mousemove`,B,!0),r.removeEventListener(`mouseup`,B,!0)):(r.removeEventListener(`pointerdown`,B,!0),r.removeEventListener(`pointermove`,B,!0),r.removeEventListener(`pointerup`,B,!0)),No.delete(n)}}})))()}function Vo(e,t,n){return V(e,as(t,n))}function Ho(e,t){return typeof e==`function`?e(t):e}function Uo(e){return e.split(`-`)[0]}function Wo(e){return e.split(`-`)[1]}function Go(e){return e===`x`?`y`:`x`}function Ko(e){return e===`y`?`height`:`width`}function qo(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Jo(e){return Go(qo(e))}function Yo(e,t,n){n===void 0&&(n=!1);let r=Wo(e),i=Jo(e),a=Ko(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=es(o)),[o,es(o)]}function Xo(e){let t=es(e);return[Zo(e),t,Zo(t)]}function Zo(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}function Qo(e,t,n){switch(e){case`top`:case`bottom`:return n?t?ds:us:t?us:ds;case`left`:case`right`:return t?fs:ps;default:return[]}}function $o(e,t,n,r){let i=Wo(e),a=Qo(Uo(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(Zo)))),a}function es(e){let t=Uo(e);return ls[t]+e.slice(t.length)}function ts(e){return{top:e.top??0,right:e.right??0,bottom:e.bottom??0,left:e.left??0}}function ns(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:ts(e)}function rs(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}var is,as,V,os,ss,cs,ls,us,ds,fs,ps;function ms(){return(ms=e((()=>{is=[`top`,`right`,`bottom`,`left`],as=Math.min,V=Math.max,os=Math.round,ss=Math.floor,cs=e=>({x:e,y:e}),ls={left:`right`,right:`left`,bottom:`top`,top:`bottom`},us=[`left`,`right`],ds=[`right`,`left`],fs=[`top`,`bottom`],ps=[`bottom`,`top`]})))()}function hs(e,t,n){let{reference:r,floating:i}=e,a=qo(t),o=Jo(t),s=Ko(o),c=Uo(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}let m=Wo(t);return m&&(p[o]+=f*(m===`end`?1:-1)*(n&&l?-1:1)),p}async function gs(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Ho(t,e),p=ns(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=rs(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=rs(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}function _s(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function vs(e){return is.some(t=>e[t]>=0)}async function ys(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=Uo(n),s=Wo(n),c=qo(n)===`y`,l=Ts.has(o)?-1:1,u=a&&c?-1:1,d=Ho(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var bs,xs,Ss,Cs,ws,Ts,Es,Ds,Os,ks;function As(){return(As=e((()=>{ms(),bs=50,xs=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:gs},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=hs(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<bs&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=hs(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},Ss=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Ho(e,t)||{};if(l==null)return{};let d=ns(u),f={x:n,y:r},p=Jo(i),m=Ko(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],S=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),C=S?S[y]:0;(!C||!await(o.isElement==null?void 0:o.isElement(S)))&&(C=s.floating[y]||a.floating[m]);let w=b/2-x/2,T=C/2-h[m]/2-1,E=as(d[_],T),ee=as(d[v],T),D=C-h[m]-ee,O=C/2-h[m]/2+w,k=Vo(E,O,D),te=!c.arrow&&Wo(i)!=null&&O!==k&&a.reference[m]/2-(O<E?E:ee)-h[m]/2<0,ne=te?O<E?O-E:O-D:0;return{[p]:f[p]+ne,data:{[p]:k,centerOffset:O-k-ne,...te&&{alignmentOffset:ne}},reset:te}}}),Cs=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Ho(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=Uo(r),_=qo(o),v=Uo(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[es(o)]:Xo(o)),x=p!==`none`;!d&&x&&b.push(...$o(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=Yo(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===qo(t)||T.every(e=>qo(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=qo(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}},ws=function(e){return e===void 0&&(e={}),{name:`hide`,options:e,async fn(t){let{rects:n,platform:r}=t,{strategy:i=`referenceHidden`,...a}=Ho(e,t);switch(i){case`referenceHidden`:{let e=_s(await r.detectOverflow(t,{...a,elementContext:`reference`}),n.reference);return{data:{referenceHiddenOffsets:e,referenceHidden:vs(e)}}}case`escaped`:{let e=_s(await r.detectOverflow(t,{...a,altBoundary:!0}),n.floating);return{data:{escapedOffsets:e,escaped:vs(e)}}}default:return{}}}}},Ts=new Set([`left`,`top`]),Es=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await ys(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},Ds=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Ho(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=qo(i),p=Go(f),m=u[p],h=u[f],g=(e,t)=>Vo(t+d[e===`y`?`top`:`left`],t,t-d[e===`y`?`bottom`:`right`]);o&&(m=g(p,m)),s&&(h=g(f,h));let _=c.fn({...t,[p]:m,[f]:h});return{..._,data:{x:_.x-n,y:_.y-r,enabled:{[p]:o,[f]:s}}}}}},Os=function(e){return e===void 0&&(e={}),{options:e,fn(t){let{x:n,y:r,placement:i,rects:a,middlewareData:o}=t,{offset:s=0,mainAxis:c=!0,crossAxis:l=!0}=Ho(e,t),u={x:n,y:r},d=qo(i),f=Go(d),p=u[f],m=u[d],h=Ho(s,t),g=typeof h==`number`?{mainAxis:h,crossAxis:0}:{mainAxis:h.mainAxis??0,crossAxis:h.crossAxis??0};if(c){let e=f===`y`?`height`:`width`,t=a.reference[f]-a.floating[e]+g.mainAxis,n=a.reference[f]+a.reference[e]-g.mainAxis;p<t?p=t:p>n&&(p=n)}if(l){let e=f===`y`?`width`:`height`,t=Ts.has(Uo(i)),n=a.reference[d]-a.floating[e]+(t&&o.offset?.[d]||0)+(t?0:g.crossAxis),r=a.reference[d]+a.reference[e]+(t?0:o.offset?.[d]||0)-(t?g.crossAxis:0);m<n?m=n:m>r&&(m=r)}return{[f]:p,[d]:m}}}},ks=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){let{placement:n,rects:r,platform:i,elements:a}=t,{apply:o=()=>{},...s}=Ho(e,t),c=await i.detectOverflow(t,s),l=Uo(n),u=Wo(n),d=qo(n)===`y`,{width:f,height:p}=r.floating,m,h;l===`top`||l===`bottom`?(m=l,h=u===(await(i.isRTL==null?void 0:i.isRTL(a.floating))?`start`:`end`)?`left`:`right`):(h=l,m=u===`end`?`top`:`bottom`);let g=p-c.top-c.bottom,_=f-c.left-c.right,v=as(p-c[m],g),y=as(f-c[h],_),b=t.middlewareData.shift,x=!b,S=v,C=y;b!=null&&b.enabled.x&&(C=_),b!=null&&b.enabled.y&&(S=g),x&&!u&&(d?C=f-2*V(c.left,c.right):S=p-2*V(c.top,c.bottom)),await o({...t,availableWidth:C,availableHeight:S});let w=await i.getDimensions(a.floating);return f!==w.width||p!==w.height?{reset:{rects:!0}}:{}}}}})))()}function js(){return typeof window<`u`}function Ms(e){return Ps(e)?(e.nodeName||``).toLowerCase():`#document`}function H(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Ns(e){return((Ps(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function Ps(e){return js()?e instanceof Node||e instanceof H(e).Node:!1}function Fs(e){return js()?e instanceof Element||e instanceof H(e).Element:!1}function Is(e){return js()?e instanceof HTMLElement||e instanceof H(e).HTMLElement:!1}function Ls(e){return!js()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof H(e).ShadowRoot}function Rs(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Gs(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function zs(e){return/^(table|td|th)$/.test(Ms(e))}function Bs(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}function Vs(e){let t=Fs(e)?Gs(e):e;return $s(t.transform)||$s(t.translate)||$s(t.scale)||$s(t.rotate)||$s(t.perspective)||!Us()&&($s(t.backdropFilter)||$s(t.filter))||Zs.test(t.willChange||``)||Qs.test(t.contain||``)}function Hs(e){let t=qs(e);for(;Is(t)&&!Ws(t);){if(Vs(t))return t;if(Bs(t))return null;t=qs(t)}return null}function Us(){return ec??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),ec}function Ws(e){return/^(html|body|#document)$/.test(Ms(e))}function Gs(e){return H(e).getComputedStyle(e)}function Ks(e){return Fs(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function qs(e){if(Ms(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||Ls(e)&&e.host||Ns(e);return Ls(t)?t.host:t}function Js(e){let t=qs(e);return Ws(t)?(e.ownerDocument||e).body:Is(t)&&Rs(t)?t:Js(t)}function Ys(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Js(e),i=r===e.ownerDocument?.body,a=H(r);if(i){let e=Xs(a);return t.concat(a,a.visualViewport||[],Rs(r)?r:[],e&&n?Ys(e):[])}return t.concat(r,Ys(r,[],n))}function Xs(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}var Zs,Qs,$s,ec;function tc(){return(tc=e((()=>{Zs=/transform|translate|scale|rotate|perspective|filter/,Qs=/paint|layout|strict|content/,$s=e=>!!e&&e!==`none`})))()}function nc(e){let t=Gs(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=Is(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=os(n)!==a||os(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function rc(e){return Fs(e)?e:e.contextElement}function ic(e){let t=rc(e);if(!Is(t))return cs(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=nc(t),o=(a?os(n.width):n.width)/r,s=(a?os(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}function ac(e){let t=H(e);return!Us()||!t.visualViewport?Dc:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function oc(e,t,n){return t===void 0&&(t=!1),!!n&&t&&n===H(e)}function sc(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=rc(e),o=cs(1);t&&(r?Fs(r)&&(o=ic(r)):o=ic(e));let s=oc(a,n,r)?ac(a):cs(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a&&r){let e=H(a),t=Fs(r)?H(r):r,n=e,i=Xs(n);for(;i&&t!==n;){let e=ic(i),t=i.getBoundingClientRect(),r=Gs(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=H(i),i=Xs(n)}}return rs({width:u,height:d,x:c,y:l})}function cc(e,t){let n=Ks(e).scrollLeft;return t?t.left+n:sc(Ns(e)).left+n}function lc(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-cc(e,n),y:n.top+t.scrollTop}}function uc(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=Ns(r),s=t?Bs(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=cs(1),u=cs(0),d=Is(r);if((d||!a)&&((Ms(r)!==`body`||Rs(o))&&(c=Ks(r)),d)){let e=sc(r);l=ic(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?lc(o,c):cs(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function dc(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function fc(e){let t=Ks(e),n=e.ownerDocument.body,r=V(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),i=V(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight),a=-t.scrollLeft+cc(e),o=-t.scrollTop;return Gs(n).direction===`rtl`&&(a+=V(e.clientWidth,n.clientWidth)-r),{width:r,height:i,x:a,y:o}}function pc(e,t,n){n===void 0&&(n=`viewport`);let r=n===`layoutViewport`,i=H(e),a=Ns(e),o=i.visualViewport,s=a.clientWidth,c=a.clientHeight,l=0,u=0;if(o){let e=!Us()||t===`fixed`;r?e||(l=-o.offsetLeft,u=-o.offsetTop):(s=o.width,c=o.height,e&&(l=o.offsetLeft,u=o.offsetTop))}if(cc(a)<=0){let e=a.ownerDocument,t=e.body,n=getComputedStyle(t),r=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,i=Math.abs(a.clientWidth-t.clientWidth-r),o=getComputedStyle(a).scrollbarGutter===`stable both-edges`?i/2:i;o<=Oc&&(s-=o)}return{width:s,height:c,x:l,y:u}}function mc(e,t){let n=sc(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=ic(e);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function hc(e,t,n){let r;if(t===`viewport`||t===`layoutViewport`)r=pc(e,n,t);else if(t===`document`)r=fc(Ns(e));else if(Fs(t))r=mc(t,n);else{let n=ac(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return rs(r)}function gc(e,t){let n=t.get(e);if(n)return n;let r=Ys(e,[],!1).filter(e=>Fs(e)&&Ms(e)!==`body`),i=null,a=Gs(e).position===`fixed`,o=a?qs(e):e;for(;Fs(o)&&!Ws(o);){let e=Gs(o),t=Vs(o),n=i?i.position:a?`fixed`:``;!t&&(n===`fixed`||n===`absolute`&&e.position===`static`)?r=r.filter(e=>e!==o):i=e,o=qs(o)}return t.set(e,r),r}function _c(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Bs(t)?[]:gc(t,this._c):[].concat(n),r],o=hc(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=hc(t,a[e],i);s=V(n.top,s),c=as(n.right,c),l=as(n.bottom,l),u=V(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function vc(e){let{width:t,height:n}=nc(e);return{width:t,height:n}}function yc(e,t,n){let r=Is(t),i=Ns(t),a=n===`fixed`,o=sc(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=cs(0);if((r||!a)&&((Ms(t)!==`body`||Rs(i))&&(s=Ks(t)),r)){let e=sc(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}!r&&i&&(c.x=cc(i));let l=i&&!r&&!a?lc(i,s):cs(0);return{x:o.left+s.scrollLeft-c.x-l.x,y:o.top+s.scrollTop-c.y-l.y,width:o.width,height:o.height}}function bc(e){return Gs(e).position===`static`}function xc(e,t){if(!Is(e)||Gs(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return Ns(e)===n&&(n=n.ownerDocument.body),n}function Sc(e,t){let n=H(e);if(Bs(e))return n;if(!Is(e)){let t=qs(e);for(;t&&!Ws(t);){if(Fs(t)&&!bc(t))return t;t=qs(t)}return n}let r=xc(e,t);for(;r&&zs(r)&&bc(r);)r=xc(r,t);return r&&Ws(r)&&bc(r)&&!Vs(r)?n:r||Hs(e)||n}function Cc(e){return Gs(e).direction===`rtl`}function wc(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Tc(e,t,n){let r=null,i,a=Ns(e);function o(){var e;clearTimeout(i),(e=r)==null||e.disconnect(),r=null}function s(n,c){n===void 0&&(n=!1),c===void 0&&(c=1),o();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(n||t(),!f||!p)return;let m=ss(d),h=ss(a.clientWidth-(u+f)),g=ss(a.clientHeight-(d+p)),_=ss(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:V(0,as(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(!wc(l,e.getBoundingClientRect()))return s();if(n!==c){if(!y)return s();n?s(!1,n):i=setTimeout(()=>{s(!1,1e-7)},1e3)}y=!1}try{r=new IntersectionObserver(b,{...v,root:a.ownerDocument})}catch{r=new IntersectionObserver(b,v)}r.observe(e)}let c=H(e),l=()=>s(n);return c.addEventListener(`resize`,l),s(!0),()=>{c.removeEventListener(`resize`,l),o()}}function Ec(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=rc(e),u=i||a?[...l?Ys(l):[],...t?Ys(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n),a&&e.addEventListener(`resize`,n)});let d=l&&s?Tc(l,n,a):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?sc(e):null;c&&g();function g(){let t=sc(e);h&&!wc(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc,Rc;function zc(){return(zc=e((()=>{As(),ms(),tc(),Dc=cs(0),Oc=25,kc=async function(e){let t=this.getOffsetParent||Sc,n=this.getDimensions,r=await n(e.floating);return{reference:yc(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}},Ac={convertOffsetParentRelativeRectToViewportRelativeRect:uc,getDocumentElement:Ns,getClippingRect:_c,getOffsetParent:Sc,getElementRects:kc,getClientRects:dc,getDimensions:vc,getScale:ic,isElement:Fs,isRTL:Cc},jc=Es,Mc=Ds,Nc=Cs,Pc=ks,Fc=ws,Ic=Ss,Lc=Os,Rc=(e,t,n)=>{let r=new Map,i=n??{},a={...Ac,...i.platform,_c:r};return xs(e,t,{...i,platform:a})}})))()}function Bc(e=0,t=0,n=0,r=0){if(typeof DOMRect==`function`)return new DOMRect(e,t,n,r);let i={x:e,y:t,width:n,height:r,top:t,right:e+n,bottom:t+r,left:e};return{...i,toJSON:()=>i}}function Vc(e){if(!e)return Bc();let{x:t,y:n,width:r,height:i}=e;return Bc(t,n,r,i)}function Hc(e,t){let n=()=>{let n=e,r=t?.(n);return r||!n?Vc(r):n.getBoundingClientRect()};return{contextElement:F(e)?e:e?.contextElement,getBoundingClientRect:n,getClientRects:()=>F(e)&&!t?e.getClientRects():[n()]}}function Uc(){return(Uc=e((()=>{I()})))()}function Wc(e,t){return{name:`transformOrigin`,fn(n){let{elements:r,middlewareData:i,placement:a,rects:o,y:s}=n,c=a.split(`-`)[0],l=qc(c),u=i.arrow?.x||0,d=i.arrow?.y||0,f=t?.clientWidth||0,p=t?.clientHeight||0,m=u+f/2,h=d+p/2,g=Math.abs(i.shift?.y||0),_=o.reference.height/2,v=p/2,y=e.offset?.mainAxis??e.gutter,b=typeof y==`number`?y+v:y??v,x=g>b,S={top:`${m}px calc(100% + ${b}px)`,bottom:`${m}px ${-b}px`,left:`calc(100% + ${b}px) ${h}px`,right:`${-b}px ${h}px`}[c],C=`${m}px ${o.reference.y+_-s}px`,w=!!e.overlap&&l===`y`&&x;return r.floating.style.setProperty(Kc.transformOrigin.variable,w?C:S),{data:{transformOrigin:w?C:S}}}}}var Gc,Kc,qc,Jc,Yc;function Xc(){return(Xc=e((()=>{Gc=e=>({variable:e,reference:`var(${e})`}),Kc={arrowSize:Gc(`--arrow-size`),arrowSizeHalf:Gc(`--arrow-size-half`),arrowBg:Gc(`--arrow-background`),transformOrigin:Gc(`--transform-origin`),arrowOffset:Gc(`--arrow-offset`)},qc=e=>e===`top`||e===`bottom`?`y`:`x`,Jc={name:`rects`,fn({rects:e}){return{data:e}}},Yc=e=>{if(e)return{name:`shiftArrow`,fn({placement:t,middlewareData:n}){if(!n.arrow)return{};let{x:r,y:i}=n.arrow,a=t.split(`-`)[0];return Object.assign(e.style,{left:r==null?``:`${r}px`,top:i==null?``:`${i}px`,[a]:`calc(100% + ${Kc.arrowOffset.reference})`}),{}}}}})))()}function Zc(e){let[t,n]=e.split(`-`);return{side:t,align:n,hasAlign:n!=null}}function Qc(e){return e.split(`-`)[0]}function $c(e,t){let n=e.devicePixelRatio||1;return Math.round(t*n)/n}function el(e,t){return e!=null&&Math.abs(e-t)<.5}function tl(e){return typeof e==`function`?e():e===`clipping-ancestors`?`clippingAncestors`:e}function nl(e,t,n){let r=e||t.createElement(`div`);return Ic({element:r,padding:n.arrowPadding})}function rl(e,t){if(!pn(t.offset??t.gutter))return jc(({placement:n})=>{let r=(e?.clientHeight||0)/2,i=t.offset?.mainAxis??t.gutter,a=typeof i==`number`?i+r:i??r,{hasAlign:o}=Zc(n),s=o?void 0:t.shift;return kn({crossAxis:t.offset?.crossAxis??s,mainAxis:a,alignmentAxis:t.shift})})}function il(e){if(e.flip)return Nc(()=>{let t=tl(e.boundary);return{...t?{boundary:t}:void 0,padding:e.overflowPadding,fallbackPlacements:e.flip===!0?void 0:e.flip}})}function al(e){if(e.slide||e.overlap)return Mc(()=>{let t=tl(e.boundary);return{...t?{boundary:t}:void 0,mainAxis:e.slide,crossAxis:e.overlap,padding:e.overflowPadding,limiter:Lc()}})}function ol(e){if(e.sizeMiddleware===!1&&!e.sameWidth&&!e.fitViewport)return;let t,n,r,i;return Pc(()=>{let a=tl(e.boundary);return{padding:e.overflowPadding,...a?{boundary:a}:void 0,apply({elements:e,rects:a,availableHeight:o,availableWidth:s}){let c=e.floating,l=Math.round(a.reference.width),u=Math.round(a.reference.height);s=Math.floor(s),o=Math.floor(o),el(t,l)||(c.style.setProperty(`--reference-width`,`${l}px`),t=l),el(n,u)||(c.style.setProperty(`--reference-height`,`${u}px`),n=u),el(r,s)||(c.style.setProperty(`--available-width`,`${s}px`),r=s),el(i,o)||(c.style.setProperty(`--available-height`,`${o}px`),i=o)}}})}function sl(e){if(e.hideWhenDetached)return Fc(()=>({strategy:`referenceHidden`,boundary:tl(e.boundary)??`clippingAncestors`}))}function cl(e){return e?e===!0?{ancestorResize:!0,ancestorScroll:!0,elementResize:!0,layoutShift:!0}:e:{}}function ll(e,t){if(!e)return En;let n=new Map(t.map(t=>[t,e.style.getPropertyValue(t)]));return()=>{n.forEach((t,n)=>{t?e.style.setProperty(n,t):e.style.removeProperty(n)}),e.style.length===0&&e.removeAttribute(`style`)}}function ul(e){return e==null?null:F(e)?e:typeof e==`object`&&e&&`contextElement`in e&&e.contextElement?e.contextElement:e}function dl(e,t,n={}){let r=()=>(typeof t==`function`?t():t)??null,i=()=>{let t=typeof e==`function`?e():e;return n.getAnchorElement?.()??t},a=()=>{let e=i();return!e&&!n.getAnchorRect?null:Hc(e,n.getAnchorRect)},o=Object.assign({},pl,n),s=[],c=null,l=null,u,d;function f(e,t){u?.(),d?.(),c=e,l=t,u=o.restoreStyles?ll(e,ml):void 0,d=o.restoreStyles?ll(t,hl):void 0,s=[...o.middleware??[],rl(t,o),il(o),al(o),nl(t,e.ownerDocument,o),Yc(t),Wc({gutter:o.gutter,offset:o.offset,overlap:o.overlap},t),ol(o),sl(o),Jc]}let{placement:p,strategy:m,onComplete:h,onPositioned:g}=o,_,v,y=!1,b,x,S=En,C=cl(o.listeners);function w(){if(!o.listeners)return;let e=i(),t=a(),n=r();t&&n&&(ul(e)!==ul(b)||n!==x)&&(S(),b=e,x=n,S=Ec(t,n,E,C))}async function T(){w();let e=r();if(!e)return;let t=o.getArrowElement?.()??null;(e!==c||t!==l)&&(f(e,t),y=!1);let n=a();if(!n)return;let i=await Rc(n,e,{placement:p,middleware:s,strategy:m}),u=P(e),d=$c(u,i.x),g=$c(u,i.y);if(h?.({...i,x:d,y:g}),o.applyStyles!==!1&&(el(_,d)||(e.style.setProperty(`--x`,`${d}px`),_=d),el(v,g)||(e.style.setProperty(`--y`,`${g}px`),v=g),o.hideWhenDetached&&(i.middlewareData.hide?.referenceHidden?(e.style.setProperty(`visibility`,`hidden`),e.style.setProperty(`pointer-events`,`none`)):(e.style.removeProperty(`visibility`),e.style.removeProperty(`pointer-events`))),!y)){let t=e.firstElementChild;t&&(e.style.setProperty(`--z-index`,Zr(t).zIndex),y=!0)}}async function E(){n.updatePosition?(await n.updatePosition({updatePosition:T,floatingElement:r()}),g?.({placed:!0})):await T()}return E(),()=>{S(),d?.(),u?.(),g?.({placed:!1})}}function fl(e,t,n={}){let{defer:r,...i}=n,a=r?R:e=>e(),o=[];return o.push(a(()=>{o.push(dl(e,t,i))})),()=>{o.forEach(e=>e?.())}}var pl,ml,hl;function gl(){return(gl=e((()=>{zc(),$r(),I(),Ii(),An(),Sn(),On(),Uc(),Xc(),pl={strategy:`absolute`,placement:`bottom`,listeners:!0,restoreStyles:!1,applyStyles:!0,gutter:8,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,overflowPadding:8,arrowPadding:4},ml=[`transform`,`visibility`,`pointer-events`,`--x`,`--y`,`--z-index`,`--reference-width`,`--reference-height`,`--available-width`,`--available-height`,`--transform-origin`],hl=[`top`,`right`,`bottom`,`left`]})))()}function _l(e={}){let{placement:t,sameWidth:n,fitViewport:r,strategy:i=`absolute`}=e;return{arrow:{position:`absolute`,width:Kc.arrowSize.reference,height:Kc.arrowSize.reference,[Kc.arrowSizeHalf.variable]:`calc(${Kc.arrowSize.reference} / 2)`,[Kc.arrowOffset.variable]:`calc(${Kc.arrowSizeHalf.reference} * -1)`},arrowTip:{transform:t?vl[t.split(`-`)[0]]:void 0,background:Kc.arrowBg.reference,top:`0`,left:`0`,width:`100%`,height:`100%`,position:`absolute`,zIndex:`inherit`},floating:{position:i,isolation:`isolate`,minWidth:n?void 0:`max-content`,width:n?`var(--reference-width)`:void 0,maxWidth:r?`var(--available-width)`:void 0,maxHeight:r?`var(--available-height)`:void 0,pointerEvents:t?void 0:`none`,top:`0px`,left:`0px`,transform:`translate3d(var(--x, 0px), var(--y, -100vh), 0)`,zIndex:`var(--z-index)`}}}var vl;function yl(){return(yl=e((()=>{Xc(),vl={bottom:`rotate(45deg)`,left:`rotate(135deg)`,top:`rotate(225deg)`,right:`rotate(315deg)`}})))()}function bl(e,t){if(!e)return;let n=new(P(e)).CustomEvent(Xl,{detail:{value:t}});e.dispatchEvent(n)}function xl(e){let t=Tl(e);return U(e)??e.getDoc().getElementById(t)}function Sl(e,t){if(!F(e))return!1;for(let n in t){let r=t[n],i=xl(r.scope);if(i&&Pr(i,e))return!0;let a=r.refs.get(`children`);if(Object.keys(a).length>0&&Sl(e,a))return!0}return!1}var Cl,wl,Tl,El,Dl,Ol,kl,U,Al,jl,Ml,Nl,Pl,Fl,Il,Ll,Rl,zl,Bl,Vl,Hl,Ul,Wl,Gl,Kl,ql,Jl,Yl,Xl;function Zl(){return(Zl=e((()=>{I(),Da(),on(),Sn(),Zt(),Cl=(e,t)=>{let n=e.ids?.trigger;return n==null?t?`${e.id}:trigger:${t}`:`${e.id}:trigger`:j(n)?n(t):n},wl=(e,t)=>{let n=e.ids?.contextTrigger;return n==null?t?`${e.id}:ctx-trigger:${t}`:`${e.id}:ctx-trigger`:j(n)?n(t):n},Tl=e=>e.ids?.content??`${e.id}:content`,El=(e,t)=>e.ids?.group?.(t)??`${e.id}:group:${t}`,Dl=(e,t)=>`${e.id}:${t}`,Ol=e=>e?.dataset.value??null,kl=(e,t)=>e.ids?.groupLabel?.(t)??`${e.id}:group-label:${t}`,U=e=>e.query(e.selector(A.content)),Al=e=>e.query(e.selector(A.positioner)),jl=e=>e.query(e.selector(A.trigger)),Ml=(e,t)=>t?e.getById(t):null,Nl=(e,t,n)=>{let r=P(e);e.dispatchEvent(new r.CustomEvent(t,{detail:n}))},Pl=(e,t)=>t?e.query(`${e.selector(A.item)}[data-value="${t}"]`):null,Fl=e=>e.query(e.selector(A.arrow)),Il=e=>e.query(e.selector(A.contextTrigger)),Ll=e=>e.queryAll(e.selector(A.trigger)),Rl=e=>e.queryAll(e.selector(A.contextTrigger)),zl=e=>e.query(e.selector(A.triggerItem)),Bl=(e,t)=>t==null?jl(e)??zl(e)??Ll(e)[0]:e.query(`${e.selector(A.trigger)}[data-value="${t}"]`)??e.query(`${e.selector(A.triggerItem)}[data-value="${t}"]`),Vl=e=>{let t=`[data-menu-item="${CSS.escape(e.id)}"]:not([data-disabled])`,n=U(e);return n?Array.from(n.querySelectorAll(t)):[]},Hl=e=>rn(Vl(e)),Ul=e=>an(Vl(e)),Wl=(e,t)=>t?e.id===t||e.dataset.value===t:!1,Gl=(e,t)=>{let n=Vl(e);return en(n,n.findIndex(e=>Wl(e,t.value)),{loop:t.loop??t.loopFocus})},Kl=(e,t)=>{let n=Vl(e);return nn(n,n.findIndex(e=>Wl(e,t.value)),{loop:t.loop??t.loopFocus})},ql=(e,t)=>{let n=Vl(e),r=n.find(e=>Wl(e,t.value));return Ea(n,{state:t.typeaheadState,key:t.key,activeId:r?.id??null})},Jl=e=>F(e)&&(e.dataset.disabled===``||e.hasAttribute(`disabled`)),Yl=e=>!!e?.getAttribute(`role`)?.startsWith(`menuitem`)&&!!e?.hasAttribute(`data-controls`),Xl=`menu:select`})))()}function Ql(e){let{x:t,y:n,width:r,height:i}=e,a=t+r/2,o=n+i/2;return{x:t,y:n,width:r,height:i,minX:t,minY:n,maxX:t+r,maxY:n+i,midX:a,midY:o,center:eu(a,o)}}function $l(e){return{top:eu(e.minX,e.minY),right:eu(e.maxX,e.minY),bottom:eu(e.maxX,e.maxY),left:eu(e.minX,e.maxY)}}var eu;function tu(){return(tu=e((()=>{Object.freeze({x:0,y:0}),eu=(e,t)=>({x:e,y:t})})))()}function nu(e,t){let{top:n,right:r,left:i,bottom:a}=$l(Ql(e)),[o]=t.split(`-`);return{top:[i,n,r,a],right:[n,r,a,i],bottom:[n,i,a,r],left:[r,n,i,a]}[o]}function ru(e,t){let{x:n,y:r}=t,i=!1;for(let t=0,a=e.length-1;t<e.length;a=t++){let o=e[t].x,s=e[t].y,c=e[a].x,l=e[a].y;s>r!=l>r&&n<(c-o)*(r-s)/(l-s)+o&&(i=!i)}return i}function iu(){return(iu=e((()=>{tu()})))()}function au(e){let t=e.parent;for(;t&&t.context.get(`isSubmenu`);)t=t.refs.get(`parent`);t?.send({type:`CLOSE`})}function ou(e){let t=e;for(;t.context.get(`isSubmenu`);){let e=t.refs.get(`parent`);if(!e)break;t=e}let n=t.prop(`menubar`);return{rootEl:Ml(t.scope,n?.rootId),orientation:n?.orientation??`horizontal`}}function su(e,t){return e?ru(e,t):!1}function cu(e,t,n){let r=Object.keys(e).length>0;if(!t)return null;if(!r)return Dl(n,t);for(let n in e){let r=e[n],i=Cl(r.scope);if(i===t)return i}return Dl(n,t)}function lu(e,t){e&&(e.refs.set(`pointerRoutingLocked`,t),e.context.set(`pointerRoutingMode`,t?`locked`:`interactive`))}function uu(e){let t=e.context.get(`highlightedValue`);if(!t)return!1;let n=e.refs.get(`children`);for(let e in n){let r=n[e];if(r.state.hasTag(`open`)&&Cl(r.scope)===t)return!0}return!1}function du(e,t){e&&(e.refs.get(`pointerRoutingLocked`)||t&&uu(e)||lu(e,!1))}function fu(e){e&&(uu(e)||lu(e,!1))}function pu(){return(pu=e((()=>{iu(),Zl()})))()}function mu(e,t){let{context:n,send:r,state:i,computed:a,prop:o,scope:s}=e,c=n.get(`layer`),l=i.hasTag(`open`),u=n.get(`isSubmenu`),d=a(`isInMenubar`),f=n.get(`instant`),p=a(`menubarDisabled`),m=o(`menubar`)?.activeId,h=o(`menubar`)?.rootId,g=d&&o(`menubar`)?.orientation===`vertical`,_=a(`isTypingAhead`),v=o(`composite`),y=n.get(`currentPlacement`),b=y?Qc(y):void 0,x=n.get(`anchorPoint`),S=n.get(`highlightedValue`),C=n.get(`triggerValue`),w=_l({...o(`positioning`),placement:y});function T(e){return{id:Dl(s,e.value),disabled:!!e.disabled,highlighted:S===e.value}}function E(e={}){let{value:t}=e,n=t!=null&&C===t;return{value:t,current:n,open:t==null?l:l&&n,disabled:!!p}}function ee(){return{nested:!!c?.nested,hasNested:!!c?.hasNested}}function D(){return{open:l,nested:!!c?.nested,hasNested:!!c?.hasNested,placement:y,side:b}}function O(e){let t=e.valueText??e.value;return{...e,id:e.value,valueText:t}}function k(e){return{...T(O(e)),checked:!!e.checked}}function te(e){let{closeOnSelect:n,valueText:i,value:a}=e,o=T(e),c=Dl(s,a);return t.element({...A.item.attrs(s.id),id:c,role:`menuitem`,"aria-disabled":kr(o.disabled),"data-disabled":M(o.disabled),"data-highlighted":M(o.highlighted),"data-value":a,"data-valuetext":i,onDragStart(e){e.currentTarget.matches(`a[href]`)&&e.preventDefault()},onPointerMove(e){if(o.disabled||e.pointerType!==`mouse`||To()!==`pointer`)return;let t=e.currentTarget;if(o.highlighted)return;let i=Ti(e);r({type:`ITEM_POINTERMOVE`,id:c,target:t,closeOnSelect:n,point:i})},onPointerLeave(e){if(o.disabled||e.pointerType!==`mouse`||To()!==`pointer`)return;let t=e.currentTarget;r({type:`ITEM_POINTERLEAVE`,id:c,target:t,closeOnSelect:n})},onPointerDown(e){if(o.disabled)return;let t=e.currentTarget;r({type:`ITEM_POINTERDOWN`,target:t,id:c,closeOnSelect:n})},onClick(e){if(bi(e)||yi(e)||o.disabled)return;let t=e.currentTarget;r({type:`ITEM_CLICK`,target:t,id:c,value:a,closeOnSelect:n})}})}return{highlightedValue:S,open:l,setOpen(e){r({type:e?`OPEN`:`CLOSE`,replaces:`open`})},triggerValue:C,setTriggerValue(e){r({type:`TRIGGER_VALUE.SET`,value:e})},setHighlightedValue(e){r({type:`HIGHLIGHTED.SET`,value:e})},setParent(e){r({type:`PARENT.SET`,value:e,id:e.prop(`id`)})},setChild(e){r({type:`CHILD.SET`,value:e,id:e.prop(`id`)})},reposition(e={}){r({type:`POSITIONING.SET`,options:e})},addItemListener(e){let t=s.getById(e.id);if(!t)return;let n=()=>e.onSelect?.();return t.addEventListener(Xl,n),()=>t.removeEventListener(Xl,n)},getContextTriggerProps(e={}){let{value:n}=e,i=n!=null&&C===n,a=wl(s,n);return t.element({...A.contextTrigger.attrs(s.id),dir:o(`dir`),id:a,"data-value":n,"data-current":M(i),"data-state":l?`open`:`closed`,onPointerDown(e){if(e.pointerType===`mouse`)return;let t=Ti(e);r({type:`CONTEXT_MENU_START`,point:t,value:n})},onPointerCancel(e){e.pointerType!==`mouse`&&r({type:`CONTEXT_MENU_CANCEL`})},onPointerMove(e){e.pointerType!==`mouse`&&r({type:`CONTEXT_MENU_CANCEL`})},onPointerUp(e){e.pointerType!==`mouse`&&r({type:`CONTEXT_MENU_CANCEL`})},onContextMenu(e){let t=Ti(e);r({type:l&&n!=null&&!i?`TRIGGER_VALUE.SET`:`CONTEXT_MENU`,point:t,value:n}),e.preventDefault()},style:{WebkitTouchCallout:`none`,WebkitUserSelect:`none`,userSelect:`none`}})},getTriggerItemProps(e){let t=e.getTriggerProps();return Pn(te({value:t.id}),t)},getTriggerState:E,getTriggerProps(n={}){let{value:i}=n,a=E(n),{current:c}=a,f=Cl(s,i);return t.button({...u?A.triggerItem.attrs(s.id):A.trigger.attrs(s.id),role:d?`menuitem`:void 0,tabIndex:d?m===f?0:-1:void 0,disabled:a.disabled||void 0,"aria-disabled":a.disabled||void 0,"data-disabled":a.disabled?``:void 0,"data-placement":y,"data-side":b,type:`button`,dir:o(`dir`),id:f,...i!=null&&{"data-value":i,"data-current":M(c)},"aria-haspopup":v?`menu`:`dialog`,"aria-controls":Tl(s),"data-controls":Tl(s),"aria-expanded":a.open,"data-state":l?`open`:`closed`,onPointerMove(e){if(e.pointerType!==`mouse`||Jl(e.currentTarget)||!u)return;let t=Ti(e);r({type:`TRIGGER_POINTERMOVE`,target:e.currentTarget,point:t})},onPointerLeave(t){if(Jl(t.currentTarget)||t.pointerType!==`mouse`||!u)return;lu(e.refs.get(`parent`),!0);let n=Ti(t);r({type:`TRIGGER_POINTERLEAVE`,target:t.currentTarget,point:n})},onPointerDown(e){Jl(e.currentTarget)||Ei(e)||e.preventDefault()},onClick(e){e.defaultPrevented||Jl(e.currentTarget)||r({type:l&&i!=null&&!c?`TRIGGER_VALUE.SET`:`TRIGGER_CLICK`,target:e.currentTarget,value:i})},onPointerEnter(e){e.pointerType===`mouse`&&d&&!l&&(Jl(e.currentTarget)||Ml(s,h)?.dataset.hasOpenMenu===`true`&&r({type:`OPEN`,instant:!0}))},onBlur(){r({type:`TRIGGER_BLUR`})},onFocus(){r({type:`TRIGGER_FOCUS`})},onKeyDown(e){if(e.defaultPrevented)return;let t={Enter(){r({type:`ARROW_DOWN`,src:`enter`,value:i})},Space(){r({type:`ARROW_DOWN`,src:`space`,value:i})}};g?t.ArrowRight=()=>r({type:`ARROW_DOWN`,value:i}):(t.ArrowDown=()=>r({type:`ARROW_DOWN`,value:i}),t.ArrowUp=()=>r({type:`ARROW_UP`,value:i}));let n=t[wi(e,{orientation:g?`horizontal`:`vertical`,dir:o(`dir`)})];n&&(e.preventDefault(),n(e))}})},getIndicatorProps(){return t.element({...A.indicator.attrs(s.id),dir:o(`dir`),"data-state":l?`open`:`closed`})},getPositionerState:ee,getPositionerProps(){return t.element({...A.positioner.attrs(s.id),dir:o(`dir`),"data-instant":M(f),...ho(c),style:{...w.floating,...go(c,{zIndex:!0})}})},getArrowProps(){return t.element({...A.arrow.attrs(s.id),dir:o(`dir`),style:w.arrow})},getArrowTipProps(){return t.element({...A.arrowTip.attrs(s.id),dir:o(`dir`),style:w.arrowTip})},getContentState:D,getContentProps(){let i=D();return t.element({...A.content.attrs(s.id),id:Tl(s),"aria-label":o(`aria-label`),hidden:!i.open,"data-state":i.open?`open`:`closed`,"data-instant":M(f),role:v?`menu`:`dialog`,tabIndex:0,dir:o(`dir`),"aria-activedescendant":a(`highlightedId`)||void 0,"aria-labelledby":x?wl(s,C??void 0):Cl(s,C??void 0),"data-placement":i.placement,"data-side":i.side,...ho(c),style:{...go(c,{pointerEvents:!0})},onPointerEnter(e){e.pointerType===`mouse`&&r({type:`MENU_POINTERENTER`})},onKeyDown(t){if(t.defaultPrevented||!Pr(t.currentTarget,L(t)))return;let i=L(t);if(i?.closest(`[role=menu]`)!==t.currentTarget&&i!==t.currentTarget)return;if(t.key===`Tab`&&!Zi(t)){t.preventDefault();return}let a={ArrowDown(){r({type:`ARROW_DOWN`})},ArrowUp(){r({type:`ARROW_UP`})},ArrowLeft(){let t=ou(e);if(t.orientation===`vertical`){r({type:u?`ARROW_LEFT`:`CLOSE`});return}if(d&&t.rootEl){e.refs.set(`menubarCloseReason`,`list-navigation`),Nl(t.rootEl,`menu:focus-prev`);return}r({type:`ARROW_LEFT`})},ArrowRight(){let t=n.get(`highlightedValue`);if((t==null?null:Pl(s,t))?.getAttribute(`aria-haspopup`)===`menu`){r({type:`ARROW_RIGHT`});return}let i=ou(e);if(i.orientation===`horizontal`&&i.rootEl){e.refs.set(`menubarCloseReason`,`list-navigation`),Nl(i.rootEl,`menu:focus-next`);return}r({type:`ARROW_RIGHT`})},Enter(){r({type:`ENTER`})},Space(e){_?r({type:`TYPEAHEAD`,key:e.key}):a.Enter?.(e)},Home(){r({type:`HOME`})},End(){r({type:`END`})}},c=a[wi(t,{dir:o(`dir`)})];if(c){c(t),t.stopPropagation(),t.preventDefault();return}o(`typeahead`)&&Si(t)&&(Di(t)||Nr(i)||(r({type:`TYPEAHEAD`,key:t.key}),t.preventDefault()))}})},getSeparatorProps(){return t.element({...A.separator.attrs(s.id),role:`separator`,dir:o(`dir`),"aria-orientation":`horizontal`})},getItemState:T,getItemProps:te,getOptionItemState:k,getOptionItemProps(e){let{type:n,disabled:i,closeOnSelect:a}=e,c=O(e),l=k(e);return{...te(c),...t.element({"data-type":n,...A.item.attrs(s.id),dir:o(`dir`),"data-value":c.value,role:`menuitem${n}`,"aria-checked":!!l.checked,"data-state":l.checked?`checked`:`unchecked`,onClick(e){if(i||bi(e)||yi(e))return;let t=e.currentTarget;r({type:`ITEM_CLICK`,target:t,option:c,value:c.value,closeOnSelect:a})}})}},getItemIndicatorProps(e){let n=k(wn(e)),r=n.checked?`checked`:`unchecked`;return t.element({...A.itemIndicator.attrs(s.id),dir:o(`dir`),"data-disabled":M(n.disabled),"data-highlighted":M(n.highlighted),"data-state":mn(e,`checked`)?r:void 0,hidden:mn(e,`checked`)?!n.checked:void 0})},getItemTextProps(e){let n=k(wn(e)),r=n.checked?`checked`:`unchecked`;return t.element({...A.itemText.attrs(s.id),dir:o(`dir`),"data-disabled":M(n.disabled),"data-highlighted":M(n.highlighted),"data-state":mn(e,`checked`)?r:void 0})},getItemGroupLabelProps(e){return t.element({...A.itemGroupLabel.attrs(s.id),id:kl(s,e.htmlFor),dir:o(`dir`)})},getItemGroupProps(e){return t.element({id:El(s,e.id),...A.itemGroup.attrs(s.id),dir:o(`dir`),"aria-labelledby":kl(s,e.id),role:`group`})}}}function hu(){return(hu=e((()=>{Bn(),Ar(),Mi(),I(),Qi(),Bo(),yl(),On(),Sn(),Zt(),Zl(),pu()})))()}var W,gu,_u,vu,yu,bu;function xu(){return(xu=e((()=>{vr(),mo(),Mi(),ra(),I(),Da(),Qi(),ta(),Ii(),ha(),Bo(),gl(),iu(),ln(),Zt(),Zl(),pu(),{not:W,and:gu,or:_u}=gr(),vu=[{guard:`isOpenControlled`,actions:[`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setTriggerValue`,`invokeOnOpen`]}],yu=[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]}],bu=_r({props({props:e}){return{closeOnSelect:!0,typeahead:!0,composite:!0,loopFocus:!1,navigate(e){na(e.node)},...e,positioning:{placement:`bottom-start`,gutter:8,...e.positioning}}},initialState({prop:e}){return e(`open`)||e(`defaultOpen`)?`open`:`idle`},context({bindable:e,prop:t,scope:n}){return{layer:e(()=>({defaultValue:null})),highlightedValue:e(()=>({defaultValue:t(`defaultHighlightedValue`)||null,value:t(`highlightedValue`),onChange(e){t(`onHighlightChange`)?.({highlightedValue:e})}})),lastHighlightedValue:e(()=>({defaultValue:null})),currentPlacement:e(()=>({defaultValue:void 0})),intentPolygon:e(()=>({defaultValue:null})),anchorPoint:e(()=>({defaultValue:null,hash(e){return`x: ${e?.x}, y: ${e?.y}`}})),isSubmenu:e(()=>({defaultValue:!1})),triggerValue:e(()=>({defaultValue:t(`defaultTriggerValue`)??null,value:t(`triggerValue`),onChange(e){let r=t(`onTriggerValueChange`);r&&r({value:e,triggerElement:Bl(n,e)})}})),pointerRoutingMode:e(()=>({defaultValue:`interactive`})),instant:e(()=>({defaultValue:!1}))}},refs(){return{parent:null,children:{},pointerRoutingLocked:!1,typeaheadState:{...Ea.defaultOptions},positioningOverride:{},menubarCloseReason:null}},computed:{isRtl:({prop:e})=>e(`dir`)===`rtl`,isTypingAhead:({refs:e})=>e.get(`typeaheadState`).keysSoFar!==``,highlightedId:({context:e,scope:t,refs:n})=>cu(n.get(`children`),e.get(`highlightedValue`),t),isInMenubar:({prop:e})=>e(`menubar`)!=null,menubarDisabled:({prop:e})=>e(`menubar`)?.disabled??!1},effects:[`trackMenubarOpenRequest`],watch({track:e,action:t,context:n,prop:r}){e([()=>n.get(`isSubmenu`)],()=>{t([`setSubmenuPlacement`])}),e([()=>n.hash(`anchorPoint`)],()=>{n.get(`anchorPoint`)&&t([`reposition`])}),e([()=>r(`open`)],()=>{t([`toggleVisibility`])})},on:{"TRIGGER_VALUE.SET":{actions:[`setTriggerValue`,`setAnchorPoint`,`reposition`,`focusMenu`]},"PARENT.SET":{actions:[`setParentMenu`]},"CHILD.SET":{actions:[`setChildMenu`]},OPEN_AUTOFOCUS:[{guard:`isOpenControlled`,actions:[`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setTriggerValue`,`highlightFirstItem`,`invokeOnOpen`]}],"HIGHLIGHTED.RESTORE":{actions:[`restoreHighlightedItem`]},"HIGHLIGHTED.SET":{actions:[`setHighlightedItem`]},"HIGHLIGHTED.SUGGEST":{actions:[`suggestHighlightedItem`]}},states:{idle:{tags:[`closed`],on:{"CONTROLLED.OPEN":{target:`open`},"CONTROLLED.CLOSE":{target:`closed`},OPEN:vu,CONTEXT_MENU_START:{target:`opening:contextmenu`,actions:[`setAnchorPoint`,`setTriggerValue`]},CONTEXT_MENU:[{guard:`isOpenControlled`,actions:[`setAnchorPoint`,`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setAnchorPoint`,`setTriggerValue`,`invokeOnOpen`]}],TRIGGER_CLICK:[{guard:`isOpenControlled`,actions:[`invokeOnOpen`,`setTriggerValue`]},{target:`open`,actions:[`invokeOnOpen`,`setTriggerValue`]}],TRIGGER_FOCUS:{guard:W(`isSubmenu`),target:`closed`},TRIGGER_POINTERMOVE:{guard:`isSubmenu`,target:`opening`}}},"opening:contextmenu":{tags:[`closed`],effects:[`waitForLongPress`],on:{OPEN:vu,CLOSE:yu,"CONTROLLED.OPEN":{target:`open`,actions:[`reposition`]},"CONTROLLED.CLOSE":{target:`closed`,actions:[`focusTrigger`]},CONTEXT_MENU_CANCEL:[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]}],"LONG_PRESS.OPEN":[{guard:`isOpenControlled`,actions:[`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setTriggerValue`,`invokeOnOpen`,`reposition`]}]}},opening:{tags:[`closed`],effects:[`waitForOpenDelay`],on:{OPEN:vu,CLOSE:yu,"CONTROLLED.OPEN":{target:`open`},"CONTROLLED.CLOSE":{target:`closed`,actions:[`focusTrigger`]},BLUR:[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]}],TRIGGER_POINTERLEAVE:[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]}],"DELAY.OPEN":[{guard:`isOpenControlled`,actions:[`invokeOnOpen`]},{target:`open`,actions:[`invokeOnOpen`]}]}},closing:{tags:[`open`],effects:[`trackPointerMove`,`trackInteractOutside`,`waitForCloseDelay`],on:{OPEN:vu,CLOSE:yu,"CONTROLLED.OPEN":{target:`open`},"CONTROLLED.CLOSE":{target:`closed`,actions:[`focusParentMenu`,`restoreParentHighlightedItem`]},MENU_POINTERENTER:{target:`open`,actions:[`clearIntentPolygon`]},POINTER_MOVED_AWAY_FROM_SUBMENU:[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`focusParentMenu`,`restoreParentHighlightedItem`]}],"DELAY.CLOSE":[{guard:`isOpenControlled`,actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{target:`closed`,actions:[`focusParentMenu`,`restoreParentHighlightedItem`,`invokeOnClose`,`releaseParentRoutingLock`]}]}},closed:{tags:[`closed`],entry:[`setInstant`,`clearHighlightedItem`,`unlockParentOnClose`,`clearAnchorPoint`,`dispatchMenubarClose`],on:{OPEN:vu,"CONTROLLED.OPEN":[{guard:_u(`isOpenAutoFocusEvent`,`isArrowDownEvent`),target:`open`,actions:[`highlightFirstItem`]},{guard:`isArrowUpEvent`,target:`open`,actions:[`highlightLastItem`]},{target:`open`}],CONTEXT_MENU_START:{target:`opening:contextmenu`,actions:[`setAnchorPoint`,`setTriggerValue`]},CONTEXT_MENU:[{guard:`isOpenControlled`,actions:[`setAnchorPoint`,`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setAnchorPoint`,`setTriggerValue`,`invokeOnOpen`]}],TRIGGER_CLICK:[{guard:`isOpenControlled`,actions:[`invokeOnOpen`,`setTriggerValue`]},{target:`open`,actions:[`invokeOnOpen`,`setTriggerValue`]}],TRIGGER_POINTERMOVE:{guard:`isTriggerItem`,target:`opening`},TRIGGER_BLUR:{target:`idle`},ARROW_DOWN:[{guard:`isOpenControlled`,actions:[`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setTriggerValue`,`highlightFirstItem`,`invokeOnOpen`]}],ARROW_UP:[{guard:`isOpenControlled`,actions:[`setTriggerValue`,`invokeOnOpen`]},{target:`open`,actions:[`setTriggerValue`,`highlightLastItem`,`invokeOnOpen`]}]}},open:{tags:[`open`],effects:[`trackInteractOutside`,`trackFocusVisible`,`trackPositioning`,`scrollToHighlightedItem`,`trackMenubarSiblings`],entry:[`setInstant`,`focusMenu`,`unlockParentOnOpen`,`dispatchMenubarOpen`],on:{CLOSE:yu,"CONTROLLED.CLOSE":[{target:`closed`,guard:`isArrowLeftEvent`,actions:[`focusParentMenu`]},{target:`closed`,actions:[`focusTrigger`]}],TRIGGER_CLICK:[{guard:gu(W(`isTriggerItem`),`isOpenControlled`),actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{guard:W(`isTriggerItem`),target:`closed`,actions:[`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]}],CONTEXT_MENU:{actions:[`setAnchorPoint`,`setTriggerValue`,`focusMenu`]},ARROW_UP:{actions:[`highlightPrevItem`,`focusMenu`]},ARROW_DOWN:{actions:[`highlightNextItem`,`focusMenu`]},ARROW_LEFT:[{guard:gu(`isSubmenu`,`isOpenControlled`),actions:[`invokeOnClose`,`releaseParentRoutingLock`]},{guard:`isSubmenu`,target:`closed`,actions:[`focusParentMenu`,`invokeOnClose`,`releaseParentRoutingLock`]}],HOME:{actions:[`highlightFirstItem`,`focusMenu`]},END:{actions:[`highlightLastItem`,`focusMenu`]},ARROW_RIGHT:{guard:`isTriggerItemHighlighted`,actions:[`openSubmenu`]},ENTER:[{guard:`isTriggerItemHighlighted`,actions:[`openSubmenu`]},{actions:[`clickHighlightedItem`]}],ITEM_POINTERMOVE:[{guard:W(`isPointerRoutingLocked`),actions:[`setHighlightedItem`,`focusMenu`,`closeSiblingMenus`]},{actions:[`setLastHighlightedItem`,`closeSiblingMenus`]}],ITEM_POINTERLEAVE:{guard:gu(W(`isPointerRoutingLocked`),W(`isTriggerItem`)),actions:[`clearHighlightedItem`]},ITEM_CLICK:[{guard:gu(W(`isTriggerItemHighlighted`),W(`isHighlightedItemEditable`),`closeOnSelect`,`isOpenControlled`),actions:[`invokeOnSelect`,`setOptionState`,`closeRootMenu`,`invokeOnClose`,`releaseParentRoutingLock`]},{guard:gu(W(`isTriggerItemHighlighted`),W(`isHighlightedItemEditable`),`closeOnSelect`),target:`closed`,actions:[`invokeOnSelect`,`setOptionState`,`closeRootMenu`,`invokeOnClose`,`releaseParentRoutingLock`,`focusTrigger`]},{guard:gu(W(`isTriggerItemHighlighted`),W(`isHighlightedItemEditable`)),actions:[`invokeOnSelect`,`setOptionState`]},{actions:[`setHighlightedItem`]}],TRIGGER_POINTERMOVE:{guard:`isTriggerItem`,actions:[`setIntentPolygon`]},TRIGGER_POINTERLEAVE:{target:`closing`,actions:[`setIntentPolygon`]},ITEM_POINTERDOWN:{actions:[`setHighlightedItem`]},TYPEAHEAD:{actions:[`highlightMatchedItem`]},FOCUS_MENU:{actions:[`focusMenu`]},"POSITIONING.SET":{actions:[`reposition`]}}}},implementations:{guards:{closeOnSelect:({prop:e,event:t})=>!!(t?.closeOnSelect??e(`closeOnSelect`)),isTriggerItem:({event:e,computed:t})=>!t(`isInMenubar`)&&Yl(e.target),isTriggerItemHighlighted:({event:e,scope:t,computed:n})=>!!(e.target??t.getById(n(`highlightedId`)))?.hasAttribute(`data-controls`),isSubmenu:({context:e})=>e.get(`isSubmenu`),isPointerRoutingLocked:({refs:e})=>e.get(`pointerRoutingLocked`),isHighlightedItemEditable:({scope:e,computed:t})=>Nr(e.getById(t(`highlightedId`))),isOpenControlled:({prop:e})=>e(`open`)!==void 0,isArrowLeftEvent:({event:e})=>e.previousEvent?.type===`ARROW_LEFT`,isArrowUpEvent:({event:e})=>e.previousEvent?.type===`ARROW_UP`,isArrowDownEvent:({event:e})=>e.previousEvent?.type===`ARROW_DOWN`,isOpenAutoFocusEvent:({event:e})=>e.previousEvent?.type===`OPEN_AUTOFOCUS`},effects:{trackMenubarOpenRequest({scope:e,prop:t,send:n}){let r=Ml(e,t(`menubar`)?.rootId);if(!r)return;let i=Cl(e);return ji(r,`menubar:open-request`,e=>{e.detail?.triggerId===i&&n({type:`OPEN`,instant:!0})})},trackMenubarSiblings({scope:e,prop:t,send:n,refs:r}){let i=Ml(e,t(`menubar`)?.rootId);if(i)return ji(i,`menu:open`,t=>{t.detail?.menuId!==e.id&&(r.set(`menubarCloseReason`,`sibling-open`),n({type:`CLOSE`,src:`menubar-sibling-open`,restoreFocus:!1,instant:!0}))})},waitForOpenDelay({send:e}){let t=setTimeout(()=>{e({type:`DELAY.OPEN`})},200);return()=>clearTimeout(t)},waitForCloseDelay({send:e}){let t=setTimeout(()=>{e({type:`DELAY.CLOSE`})},100);return()=>clearTimeout(t)},waitForLongPress({send:e}){let t=setTimeout(()=>{e({type:`LONG_PRESS.OPEN`})},700);return()=>clearTimeout(t)},trackFocusVisible({scope:e}){return Oo({root:e.getRootNode?.()})},trackPositioning({context:e,prop:t,scope:n,refs:r}){if(Il(n)||Rl(n).length>0)return;let i={...t(`positioning`),...r.get(`positioningOverride`)};return e.set(`currentPlacement`,i.placement),fl(()=>Bl(n,e.get(`triggerValue`)),()=>Al(n),{getArrowElement:()=>Fl(n),...i,defer:!0,onComplete(t){e.set(`currentPlacement`,t.placement)}})},trackInteractOutside({refs:e,scope:t,prop:n,context:r,send:i}){let a=()=>U(t),o=!0,s=e=>Rl(t).some(t=>Pr(t,e));return po(a,{type:`menu`,group:n(`menubar`)?.rootId,onLayerChange(e){r.set(`layer`,e)},defer:!0,exclude:[jl(t),...Ll(t)].filter(Boolean),onInteractOutside:n(`onInteractOutside`),onRequestDismiss:n(`onRequestDismiss`),onFocusOutside(t){n(`onFocusOutside`)?.(t);let r=L(t.detail.originalEvent);if(s(r)){t.preventDefault();return}if(Sl(r,e.get(`children`))){t.preventDefault();return}},onEscapeKeyDown(t){n(`onEscapeKeyDown`)?.(t),r.get(`isSubmenu`)&&t.preventDefault(),au({parent:e.get(`parent`)})},onPointerDownOutside(e){n(`onPointerDownOutside`)?.(e);let t=L(e.detail.originalEvent);if(s(t)&&e.detail.contextmenu){e.preventDefault();return}o=!e.detail.focusable},onDismiss(){i({type:`CLOSE`,src:`interact-outside`,restoreFocus:o})}})},trackPointerMove({context:e,scope:t,send:n,refs:r}){let i=r.get(`parent`);if(!i)return;lu(i,!0);let a=t.getDoc();return ji(a,`pointermove`,t=>{su(e.get(`intentPolygon`),{x:t.clientX,y:t.clientY})||(n({type:`POINTER_MOVED_AWAY_FROM_SUBMENU`}),lu(i,!1))})},scrollToHighlightedItem({scope:e,computed:t}){let n=()=>{To()!==`pointer`&&ma(e.getById(t(`highlightedId`)),{rootEl:U(e),block:`nearest`})};return R(()=>{Eo(`virtual`),n()}),ea(()=>U(e),{defer:!0,attributes:[`aria-activedescendant`],callback:n})}},actions:{dispatchMenubarOpen({scope:e,prop:t}){let n=Ml(e,t(`menubar`)?.rootId);if(!n)return;let r={menuId:e.id,triggerId:jl(e)?.id};Nl(n,`menu:open`,r)},dispatchMenubarClose({scope:e,prop:t,refs:n}){let r=Ml(e,t(`menubar`)?.rootId);if(!r)return;let i=n.get(`menubarCloseReason`)??`close`;n.set(`menubarCloseReason`,null),Nl(r,`menu:close`,{menuId:e.id,reason:i})},setAnchorPoint({context:e,event:t}){e.set(`anchorPoint`,e=>cn(e,t.point)?e:t.point)},setSubmenuPlacement({context:e,computed:t,refs:n}){if(!e.get(`isSubmenu`))return;let r=t(`isRtl`)?`left-start`:`right-start`;n.set(`positioningOverride`,{placement:r,gutter:0})},reposition({context:e,scope:t,prop:n,event:r,refs:i}){let a=()=>Al(t),o=r.point??e.get(`anchorPoint`),s=o?()=>({width:0,height:0,...o}):void 0,c={...n(`positioning`),...i.get(`positioningOverride`)},l=r.value??e.get(`triggerValue`);fl(()=>Bl(t,l),a,{getArrowElement:()=>Fl(t),...c,defer:!0,getAnchorRect:s,...r.options??{},listeners:!1,onComplete(t){e.set(`currentPlacement`,t.placement)}})},setOptionState({event:e}){if(!e.option)return;let{checked:t,onCheckedChange:n,type:r}=e.option;r===`radio`?n?.(!0):r===`checkbox`&&n?.(!t)},clickHighlightedItem({scope:e,computed:t,prop:n,context:r}){let i=e.getById(t(`highlightedId`));if(!i||i.dataset.disabled)return;let a=r.get(`highlightedValue`);Jr(i)?n(`navigate`)?.({value:a,node:i,href:i.href}):queueMicrotask(()=>i.click())},setIntentPolygon({context:e,scope:t,event:n}){let r=U(t),i=e.get(`currentPlacement`);if(!r||!i)return;let a=nu(r.getBoundingClientRect(),i);if(!a)return;let o=Qc(i)===`right`?-5:5;e.set(`intentPolygon`,[{...n.point,x:n.point.x+o},...a])},clearIntentPolygon({context:e}){e.set(`intentPolygon`,null)},clearAnchorPoint({context:e}){e.set(`anchorPoint`,null)},unlockParentOnOpen({refs:e,context:t,scope:n}){let r=e.get(`parent`);if(t.get(`isSubmenu`)){let e=Cl(n);r?.send({type:`HIGHLIGHTED.SUGGEST`,value:e})}lu(r,!1)},unlockParentOnClose({refs:e,context:t}){du(e.get(`parent`),t.get(`isSubmenu`))},setHighlightedItem({context:e,event:t}){let n=t.value||Ol(t.target);e.set(`highlightedValue`,n)},clearHighlightedItem({context:e}){e.set(`highlightedValue`,null)},focusMenu({scope:e}){R(()=>{let t=U(e);Xi({root:t,enabled:!Pr(t,e.getActiveElement()),filter(e){return!e.role?.startsWith(`menuitem`)}})?.focus({preventScroll:!0})})},highlightFirstItem({context:e,scope:t}){(U(t)?queueMicrotask:R)(()=>{let n=Hl(t);n&&e.set(`highlightedValue`,Ol(n))})},highlightLastItem({context:e,scope:t}){(U(t)?queueMicrotask:R)(()=>{let n=Ul(t);n&&e.set(`highlightedValue`,Ol(n))})},highlightNextItem({context:e,scope:t,event:n,prop:r}){let i=Gl(t,{loop:n.loop,value:e.get(`highlightedValue`),loopFocus:r(`loopFocus`)});e.set(`highlightedValue`,Ol(i))},highlightPrevItem({context:e,scope:t,event:n,prop:r}){let i=Kl(t,{loop:n.loop,value:e.get(`highlightedValue`),loopFocus:r(`loopFocus`)});e.set(`highlightedValue`,Ol(i))},invokeOnSelect({context:e,prop:t,scope:n,event:r}){let i=r.value||Ol(r.target)||e.get(`highlightedValue`);i!=null&&(bl(Pl(n,i),i),t(`onSelect`)?.({value:i}))},focusTrigger({scope:e,context:t,event:n}){t.get(`isSubmenu`)||t.get(`anchorPoint`)||n.restoreFocus===!1||queueMicrotask(()=>{Bl(e,t.get(`triggerValue`))?.focus({preventScroll:!0})})},highlightMatchedItem({scope:e,context:t,event:n,refs:r}){let i=ql(e,{key:n.key,value:t.get(`highlightedValue`),typeaheadState:r.get(`typeaheadState`)});i&&t.set(`highlightedValue`,Ol(i))},setParentMenu({refs:e,event:t,context:n}){e.set(`parent`,t.value),n.set(`isSubmenu`,!0)},setChildMenu({refs:e,event:t}){let n=e.get(`children`);n[t.id]=t.value,e.set(`children`,n)},closeSiblingMenus({refs:e,event:t,scope:n}){let r=t.target;if(!Yl(r))return;let i=r?.getAttribute(A.triggerItem.attr),a=e.get(`children`);for(let e in a){if(e===i)continue;let r=a[e],o=r.context.get(`intentPolygon`);o&&t.point&&ru(o,t.point)||(U(n)?.focus({preventScroll:!0}),r.send({type:`CLOSE`}))}},closeRootMenu({refs:e}){au({parent:e.get(`parent`)})},openSubmenu({refs:e,scope:t,computed:n}){let r=t.getById(n(`highlightedId`))?.getAttribute(A.triggerItem.attr),i=e.get(`children`);(r?i[r]:null)?.send({type:`OPEN_AUTOFOCUS`})},focusParentMenu({refs:e}){e.get(`parent`)?.send({type:`FOCUS_MENU`})},setLastHighlightedItem({context:e,event:t}){e.set(`lastHighlightedValue`,Ol(t.target))},suggestHighlightedItem({context:e,event:t}){let n=t.value;if(n){if(e.get(`highlightedValue`)!=null){e.set(`lastHighlightedValue`,n);return}e.set(`highlightedValue`,n)}},restoreHighlightedItem({context:e}){let t=e.get(`lastHighlightedValue`);e.set(`lastHighlightedValue`,null),t&&e.set(`highlightedValue`,t)},restoreParentHighlightedItem({refs:e}){e.get(`parent`)?.send({type:`HIGHLIGHTED.RESTORE`})},invokeOnOpen({prop:e}){e(`onOpenChange`)?.({open:!0})},invokeOnClose({prop:e}){e(`onOpenChange`)?.({open:!1})},releaseParentRoutingLock({refs:e,context:t}){t.get(`isSubmenu`)&&fu(e.get(`parent`))},toggleVisibility({prop:e,event:t,send:n}){n({type:e(`open`)?`CONTROLLED.OPEN`:`CONTROLLED.CLOSE`,previousEvent:t})},setTriggerValue({context:e,event:t}){t.value!==void 0&&e.set(`triggerValue`,t.value)},setInstant({context:e,event:t}){e.set(`instant`,!!t.instant)}}}})})))()}function Su(e){return new Proxy({},{get(t,n){return n===`style`?t=>e({style:t}).style:e}})}var Cu,wu,G;function Tu(){return(Tu=e((()=>{Cu=Object.defineProperty,wu=(e,t,n)=>t in e?Cu(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,G=(e,t,n)=>wu(e,typeof t==`symbol`?t:t+``,n)})))()}var Eu,Du,Ou;function ku(){return(ku=e((()=>{Eu={onFocus:`onFocusin`,onBlur:`onFocusout`,onChange:`onInput`,onDoubleClick:`onDblclick`,htmlFor:`for`,className:`class`,defaultValue:`value`,defaultChecked:`checked`},Du=new Set([`viewBox`,`preserveAspectRatio`]),Ou=Su(e=>Object.entries(e).reduce((e,[t,n])=>{if(n===void 0)return e;t in Eu&&(t=Eu[t]);let r=Du.has(t)?t:t.toLowerCase();return e[r]=n,e},{}))})))()}function Au(){if(typeof globalThis<`u`)return globalThis;if(typeof self<`u`)return self;if(typeof window<`u`)return window;if(typeof global<`u`)return global}function ju(e,t){let n=Au();return n?(n[e]||(n[e]=t()),n[e]):t()}var Mu;function Nu(){return(Nu=e((()=>{Mu=ju(`__zag__refSet`,()=>new WeakSet)})))()}var Pu,Fu,Iu,Lu,Ru,zu,Bu;function Vu(){return(Vu=e((()=>{Nu(),Pu=e=>typeof e==`object`&&!!e&&`$$typeof`in e&&`props`in e,Fu=e=>typeof e==`object`&&!!e&&`__v_isVNode`in e,Iu=e=>typeof e==`object`&&!!e&&`nodeType`in e&&typeof e.nodeName==`string`,Lu=e=>Pu(e)||Fu(e)||Iu(e),Ru=e=>typeof e==`object`&&!!e,zu=e=>Ru(e)&&!Mu.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!Lu(e)&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!(e instanceof Promise)&&!(e instanceof File)&&!(e instanceof Blob)&&!(e instanceof AbortController),Bu=()=>!1})))()}function Hu(e={}){return qu(e)}function Uu(e,t,n){let r=Gu.get(e);Bu()&&!r&&console.warn(`Please use proxy object`);let i,a=[],o=r[3],s=!1,c=o(e=>{if(a.push(e),n){t(a.splice(0));return}i||=Promise.resolve().then(()=>{i=void 0,s&&t(a.splice(0))})});return s=!0,()=>{s=!1,c()}}function Wu(e){let t=Gu.get(e);Bu()&&!t&&console.warn(`Please use proxy object`);let[n,r,i]=t;return i(n,r())}var Gu,Ku,qu;function Ju(){return(Ju=e((()=>{ie(),Nu(),Vu(),Gu=ju(`__zag__proxyStateMap`,()=>new WeakMap),Ku=(e=Object.is,t=(e,t)=>new Proxy(e,t),n=new WeakMap,r=(e,t)=>{let r=n.get(e);if(r?.[0]===t)return r[1];let i=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return k(i,!0),n.set(e,[t,i]),Reflect.ownKeys(e).forEach(t=>{let n=Reflect.get(e,t);Mu.has(n)?(k(n,!1),i[t]=n):Gu.has(n)?i[t]=Wu(n):i[t]=n}),Object.freeze(i)},i=new WeakMap,a=[1,1],o=n=>{if(!Ru(n))throw Error(`object required`);let o=i.get(n);if(o)return o;let s=a[0],c=new Set,l=(e,t=++a[0])=>{s!==t&&(s=t,c.forEach(n=>n(e,t)))},u=a[1],d=(e=++a[1])=>(u!==e&&!c.size&&(u=e,p.forEach(([t])=>{let n=t[1](e);n>s&&(s=n)})),s),f=e=>(t,n)=>{let r=[...t];r[1]=[e,...r[1]],l(r,n)},p=new Map,m=(e,t)=>{if(Bu()&&p.has(e))throw Error(`prop listener already exists`);if(c.size){let n=t[3](f(e));p.set(e,[t,n])}else p.set(e,[t])},h=e=>{let t=p.get(e);t&&(p.delete(e),t[1]?.())},g=e=>(c.add(e),c.size===1&&p.forEach(([e,t],n)=>{if(Bu()&&t)throw Error(`remove already exists`);let r=e[3](f(n));p.set(n,[e,r])}),()=>{c.delete(e),c.size===0&&p.forEach(([e,t],n)=>{t&&(t(),p.set(n,[e]))})}),_=Array.isArray(n)?[]:Object.create(Object.getPrototypeOf(n)),v=t(_,{deleteProperty(e,t){let n=Reflect.get(e,t);h(t);let r=Reflect.deleteProperty(e,t);return r&&l([`delete`,[t],n]),r},set(t,n,r,a){let o=Reflect.has(t,n),s=Reflect.get(t,n,a);if(o&&(e(s,r)||i.has(r)&&e(s,i.get(r))))return!0;h(n),Ru(r)&&(r=te(r)||r);let c=r;if(!Object.getOwnPropertyDescriptor(t,n)?.set){!Gu.has(r)&&zu(r)&&(c=Hu(r));let e=!Mu.has(c)&&Gu.get(c);e&&m(n,e)}return Reflect.set(t,n,c,a),l([`set`,[n],r,s]),!0}});i.set(n,v);let y=[_,d,r,g];return Gu.set(v,y),Reflect.ownKeys(n).forEach(e=>{let t=Object.getOwnPropertyDescriptor(n,e);t.get||t.set?Object.defineProperty(_,e,t):v[e]=n[e]}),v})=>[o,Gu,Mu,e,t,zu,n,r,i,a],[qu]=Ku()})))()}function Yu(e){let t=e().value??e().defaultValue;e().debug&&console.log(`[bindable > ${e().debug}] initial`,t);let n=e().isEqual??Object.is,r=Hu({value:t}),i=()=>e().value!==void 0;return{initial:t,ref:r,get(){return i()?e().value:r.value},set(t){let a=i()?e().value:r.value,o=j(t)?t(a):t;e().debug&&console.log(`[bindable > ${e().debug}] setValue`,{next:o,prev:a}),i()||(r.value=o),n(o,a)||e().onChange?.(o,a)},invoke(t,n){e().onChange?.(t,n)},hash(t){return e().hash?.(t)??String(t)}}}function Xu(){return(Xu=e((()=>{Ju(),Sn(),Yu.cleanup=e=>{},Yu.ref=e=>{let t=e;return{get:()=>t,set:e=>{t=e}}}})))()}function Zu(e){let t={current:e};return{get(e){return t.current[e]},set(e,n){t.current[e]=n}}}function Qu(e,t){if(!vn(e)||!vn(t))return t===void 0?e:t;let n={...e};for(let r of Object.keys(t)){let i=t[r],a=e[r];i!==void 0&&(n[r]=vn(a)&&vn(i)?Qu(a,i):i)}return n}function $u(){return($u=e((()=>{Sn()})))()}var ed;function td(){return(td=e((()=>{Tu(),Ra(),Pa(),hr(),xr(),Ju(),An(),On(),ln(),Sn(),on(),Xu(),$u(),ed=class{constructor(e,t={}){G(this,`machine`,e),G(this,`scope`),G(this,`context`),G(this,`prop`),G(this,`state`),G(this,`refs`),G(this,`computed`),G(this,`event`,{type:``}),G(this,`previousEvent`,{type:``}),G(this,`effects`,new Map),G(this,`effectId`,0),G(this,`replaceTracker`,Vn()),G(this,`transition`,null),G(this,`cleanups`,[]),G(this,`subscriptions`,[]),G(this,`userPropsRef`),G(this,`getEvent`,()=>({...this.event,current:()=>this.event,previous:()=>this.previousEvent})),G(this,`getState`,()=>({...this.state,matches:(...e)=>e.some(e=>ar(this.state.get(),e)),hasTag:e=>sr(this.machine,this.state.get(),e)})),G(this,`debug`,(...e)=>{this.machine.debug&&console.log(...e)}),G(this,`notify`,()=>{this.publish()}),G(this,`send`,e=>{if(this.status!==yr.Started)return;let t=e?.replaces,n=t?this.replaceTracker.claim(t):void 0;queueMicrotask(()=>{if(!e||t&&n&&this.replaceTracker.isReplaced(t,n))return;this.previousEvent=this.event,this.event=e,this.debug(`send`,e);let r=this.state.get(),i=e.type,{transitions:a,source:o}=rr(this.machine,r,i),s=this.choose(a);if(!s)return;this.transition=s;let c=nr(this.machine,s.target??r,o);this.debug(`transition`,s),c===r?s.reenter?this.state.invoke(r,r):this.action(s.actions):this.state.set(c)})}),G(this,`action`,e=>{let t=j(e)?e(this.getParams()):e;if(!t)return;let n=t.map(e=>{let t=this.machine.implementations?.actions?.[e];return t||jn(`[zag-js] No implementation found for action "${JSON.stringify(e)}"`),t});for(let e of n)e?.(this.getParams())}),G(this,`guard`,e=>{if(j(e))return e(this.getParams());let t=this.machine.implementations?.guards?.[e];return t||jn(`[zag-js] No implementation found for guard "${JSON.stringify(e)}"`),t?.(this.getParams())}),G(this,`startEffects`,(e,t)=>{let n=j(t)?t(this.getParams()):t;if(n)for(let t of n){let n=this.machine.implementations?.effects?.[t];if(!n){jn(`[zag-js] No implementation found for effect "${JSON.stringify(t)}"`);continue}let r=n({...this.getParams(),watchEffect:Fa}),i=++this.effectId,a={id:i,path:e,cleanup:void 0};if(Ia(r)){a.deps=r.deps,a.setup=r.setup;let e=r.setup();a.cleanup=j(e)?e:void 0,a.values=r.deps.map(e=>e())}else j(r)&&(a.cleanup=r);this.effects.set(i,a)}}),G(this,`stopEffects`,e=>{for(let[t,n]of this.effects)n.path===e&&(n.cleanup?.(`exit`),this.effects.delete(t))}),G(this,`reconcileEffects`,()=>{for(let e of this.effects.values()){let t=e.deps;if(!t)continue;let n=t.map(e=>e());if(!n.some((t,n)=>!cn(e.values[n],t)))continue;e.values=n,e.cleanup?.(`restart`);let r=e.setup();e.cleanup=j(r)?r:void 0}}),G(this,`choose`,e=>Qt(e).find(e=>{let t=!e.guard;return fn(e.guard)?t=!!this.guard(e.guard):j(e.guard)&&(t=e.guard(this.getParams())),t})),G(this,`subscribe`,e=>(this.subscriptions.push(e),()=>{let t=this.subscriptions.indexOf(e);t>-1&&this.subscriptions.splice(t,1)})),G(this,`status`,yr.NotStarted),G(this,`publish`,()=>{this.callTrackers(),this.reconcileEffects(),this.subscriptions.forEach(e=>e(this.service))}),G(this,`trackers`,[]),G(this,`setupTrackers`,()=>{this.machine.watch?.(this.getParams())}),G(this,`callTrackers`,()=>{this.trackers.forEach(({deps:e,fn:t})=>{let n=e.map(e=>e());cn(t.prev,n)||(t(),t.prev=n)})}),G(this,`getParams`,()=>({state:this.getState(),context:this.context,event:this.getEvent(),prop:this.prop,send:this.send,action:this.action,guard:this.guard,track:(e,t)=>{t.prev=e.map(e=>e()),this.trackers.push({deps:e,fn:t})},refs:this.refs,computed:this.computed,flush:Tn,scope:this.scope,choose:this.choose})),this.userPropsRef={current:t};let{id:n,ids:r,getRootNode:i}=Cn(t);this.scope=Na({id:n,ids:r,getRootNode:i});let a=t=>{let n=Cn(this.userPropsRef.current);return(e.props?.({props:kn(n),scope:this.scope})??n)[t]};this.prop=a;let o=e.context?.({prop:a,bindable:Yu,scope:this.scope,flush(e){queueMicrotask(e)},getContext(){return s},getComputed(){return c},getRefs(){return l},getEvent:this.getEvent.bind(this)});o&&Object.values(o).forEach(e=>{let t=Uu(e.ref,()=>this.notify());this.cleanups.push(t)});let s={get(e){return o?.[e].get()},set(e,t){o?.[e].set(t)},initial(e){return o?.[e].initial},hash(e){let t=o?.[e].get();return o?.[e].hash(t)}};this.context=s;let c=t=>(Nn(e.computed,()=>`[zag-js] No computed object found on machine`),e.computed[t]({context:s,event:this.getEvent(),prop:a,refs:this.refs,scope:this.scope,computed:c}));this.computed=c;let l=Zu(e.refs?.({prop:a,context:s})??{});this.refs=l;let u=Yu(()=>({defaultValue:nr(e,e.initialState({prop:a})),onChange:(t,n)=>{let{exiting:r,entering:i}=ir(this.machine,n,t,this.transition?.reenter);r.forEach(e=>{this.stopEffects(e.path)}),r.forEach(e=>{this.action(e.state?.exit)}),this.action(this.transition?.actions),i.forEach(e=>{this.startEffects(e.path,e.state?.effects)}),n===`__init__`&&(this.action(e.entry),this.startEffects(br,e.effects)),i.forEach(e=>{this.action(e.state?.entry)})}}));this.state=u,this.cleanups.push(Uu(this.state.ref,()=>this.notify()))}updateProps(e){let t=this.userPropsRef.current;this.userPropsRef.current=()=>Qu(Cn(t),Cn(e)),this.notify()}start(){this.status=yr.Started,this.debug(`initializing...`),this.state.invoke(this.state.initial,br),this.setupTrackers()}stop(){this.effects.forEach(e=>e.cleanup?.(`exit`)),this.effects.clear(),this.transition=null,this.action(this.machine.exit),this.cleanups.forEach(e=>e()),this.cleanups=[],this.subscriptions=[],this.status=yr.Stopped,this.debug(`unmounting...`)}get service(){return{state:this.getState(),send:this.send,context:this.context,prop:this.prop,scope:this.scope,refs:this.refs,computed:this.computed,event:this.getEvent(),getStatus:()=>this.status}}}})))()}var nd,rd,id;function ad(){return(ad=e((()=>{nd={icon:`puzzle`,detailKeys:[`command`,`path`,`url`,`targetUrl`,`targetId`,`ref`,`element`,`node`,`nodeId`,`id`,`requestId`,`to`,`channelId`,`guildId`,`userId`,`name`,`query`,`pattern`,`messageId`]},rd=JSON.parse(`{"bash":{"icon":"squareTerminal","title":"Bash","detailKeys":["command"]},"computer":{"icon":"monitor","title":"Computer","detailKeys":["action","coordinate","text","node","nodeId","screenIndex"]},"mobile_ui":{"icon":"monitorSmartphone","title":"Mobile UI","detailKeys":["action","mobileAction","snapshotId","node","nodeId"]},"screen":{"icon":"monitor","title":"Screen","detailKeys":["action","sessionKey","dock"]},"theme":{"icon":"palette","title":"Theme","detailKeys":["action","id","mode"]},"terminal":{"icon":"squareTerminal","title":"Terminal","detailKeys":["action","sessionId","command","cwd"]},"portal":{"icon":"globe","title":"Portal","detailKeys":["action","port","id","title","path"]},"process":{"icon":"squareTerminal","title":"Process","detailKeys":["sessionId"]},"gateway_process":{"icon":"squareTerminal","title":"Background Shell","detailKeys":["action","sessionId"]},"read":{"icon":"fileText","title":"Read","detailKeys":["path"]},"write":{"icon":"edit","title":"Write","detailKeys":["path"]},"edit":{"icon":"penLine","title":"Edit","detailKeys":["path"]},"personal_instructions":{"icon":"penLine","title":"Personal Instructions","detailKeys":["action","agentId"],"actions":{"get":{"label":"read","detailKeys":["agentId"]},"set":{"label":"save","detailKeys":["agentId"]}}},"presence":{"icon":"radio","title":"Presence"},"attach":{"icon":"paperclip","title":"Attach","detailKeys":["path","url","fileName"]},"api":{"icon":"globe","title":"API","detailKeys":["url","endpoint","path","method","name"]},"browser":{"icon":"globe","title":"Browser","actions":{"status":{"label":"status"},"start":{"label":"start"},"stop":{"label":"stop"},"tabs":{"label":"tabs"},"open":{"label":"open","detailKeys":["targetUrl"]},"focus":{"label":"focus","detailKeys":["targetId"]},"close":{"label":"close","detailKeys":["targetId"]},"snapshot":{"label":"snapshot","detailKeys":["targetUrl","targetId","ref","element","format"]},"screenshot":{"label":"screenshot","detailKeys":["targetUrl","targetId","ref","element"]},"navigate":{"label":"navigate","detailKeys":["targetUrl","targetId"]},"console":{"label":"console","detailKeys":["level","targetId"]},"pdf":{"label":"pdf","detailKeys":["targetId"]},"upload":{"label":"upload","detailKeys":["paths","ref","inputRef","element","targetId"]},"dialog":{"label":"dialog","detailKeys":["accept","promptText","targetId"]},"act":{"label":"act","detailKeys":["request.kind","request.ref","request.selector","request.text","request.value"]}}},"canvas":{"icon":"image","title":"Canvas","actions":{"present":{"label":"present","detailKeys":["target","node","nodeId"]},"hide":{"label":"hide","detailKeys":["node","nodeId"]},"navigate":{"label":"navigate","detailKeys":["url","node","nodeId"]}}},"dashboard":{"icon":"layoutDashboard","title":"Dashboard","detailKeys":["action","tabId","name","title"]},"nodes":{"icon":"monitorSmartphone","title":"Nodes","actions":{"status":{"label":"status"},"describe":{"label":"describe","detailKeys":["node","nodeId"]},"pending":{"label":"pending"},"approve":{"label":"approve","detailKeys":["requestId"]},"reject":{"label":"reject","detailKeys":["requestId"]},"notify":{"label":"notify","detailKeys":["node","nodeId","title","body"]},"camera_snap":{"label":"camera snap","detailKeys":["node","nodeId","facing","deviceId"]},"camera_list":{"label":"camera list","detailKeys":["node","nodeId"]},"camera_clip":{"label":"camera clip","detailKeys":["node","nodeId","facing","duration","durationMs"]},"camera_ptz":{"label":"camera PTZ","detailKeys":["ptzOperation","node","nodeId","deviceId"]},"screen_record":{"label":"screen record","detailKeys":["node","nodeId","duration","durationMs","fps","screenIndex"]},"screen_snapshot":{"label":"screen snapshot","detailKeys":["node","nodeId","screenIndex","maxWidth"]}}},"cron":{"icon":"calendarClock","title":"Cron","actions":{"status":{"label":"status"},"list":{"label":"list"},"add":{"label":"add","detailKeys":["job.name","job.id","job.schedule","job.cron"]},"update":{"label":"update","detailKeys":["id"]},"remove":{"label":"remove","detailKeys":["id"]},"run":{"label":"run","detailKeys":["id"]},"runs":{"label":"runs","detailKeys":["id"]},"wake":{"label":"wake","detailKeys":["text","mode"]}}},"get_goal":{"icon":"target","title":"Get Goal","detailKeys":[]},"create_goal":{"icon":"target","title":"Create Goal","detailKeys":["objective","token_budget"]},"update_goal":{"icon":"target","title":"Update Goal","detailKeys":["status"]},"progress_card":{"icon":"listChecks","title":"Progress Card"},"ask_user":{"icon":"shieldQuestion","title":"Ask User","detailKeys":["questions.0.question"]},"secrets":{"icon":"key","title":"Secrets","detailKeys":["action","name","kind"]},"suggest_task":{"icon":"spark","title":"Suggest Task","detailKeys":["title","tldr","cwd"]},"dismiss_task":{"icon":"trash","title":"Dismiss Task","detailKeys":["task_id","reason"]},"skill_workshop":{"icon":"wrench","title":"Skill Workshop","detailKeys":["action","name","proposal_id"]},"openclaw":{"icon":"claw","title":"OpenClaw","detailKeys":["action","path","model"]},"gateway":{"icon":"plug","title":"Gateway","detailKeys":["action","path"]},"plugins":{"icon":"puzzle","title":"Plugins","detailKeys":["action","pluginId","packageName","query"]},"exec":{"icon":"squareTerminal","title":"Exec","detailKeys":["command"]},"tool_call":{"icon":"wrench","title":"Tool Call","detailKeys":[]},"dispatch_action":{"icon":"wrench","title":"Tool Call","detailKeys":[]},"tool_call_update":{"icon":"wrench","title":"Tool Call","detailKeys":[]},"session_status":{"icon":"barChart","title":"Session Status","detailKeys":["sessionKey","model"]},"github_publish":{"icon":"github","title":"GitHub Publish","detailKeys":["title"]},"github_identity_status":{"icon":"settings","title":"GitHub Identity Status","detailKeys":[]},"sessions":{"icon":"layers","title":"Session Settings","actions":{"patch":{"label":"update","detailKeys":["sessionKey","label","pinned","archived","model","thinkingLevel"]},"group_list":{"label":"groups"},"group_set":{"label":"set groups","detailKeys":["names"]},"group_rename":{"label":"rename group","detailKeys":["name","to"]},"group_delete":{"label":"delete group","detailKeys":["name"]}}},"sessions_list":{"icon":"layers","title":"Sessions","detailKeys":["kinds","label","agentId","search","limit","activeMinutes","includeDerivedTitles","includeLastMessage","messageLimit"]},"conversations_list":{"icon":"messageSquare","title":"Conversations","detailKeys":["channel","limit"]},"conversations_send":{"icon":"send","title":"Conversation Send","detailKeys":["conversationRef"]},"conversations_turn":{"icon":"arrowLeftRight","title":"Conversation Turn","detailKeys":["conversationRef","timeoutSeconds"]},"sessions_send":{"icon":"send","title":"Session Send","detailKeys":["label","sessionKey","agentId","timeoutSeconds"]},"sessions_history":{"icon":"fileText","title":"Session History","detailKeys":["sessionKey","limit","includeTools"]},"sessions_search":{"icon":"search","title":"Session Search","detailKeys":["query","sessionKey","limit"]},"transcripts":{"icon":"mic","title":"Transcripts","actions":{"start":{"label":"start","detailKeys":["sessionId","title","providerId","accountId","guildId","channelId","meetingUrl"]},"stop":{"label":"stop","detailKeys":["sessionId"]},"status":{"label":"status"},"import":{"label":"import","detailKeys":["sessionId","title","providerId","meetingUrl","speakerLabel"]},"summarize":{"label":"summarize","detailKeys":["sessionId"]}}},"sessions_spawn":{"icon":"bot","title":"Sub-agent","detailKeys":["label","taskName","agentId","model","thinking","runTimeoutSeconds","cleanup"]},"agents_wait":{"icon":"clock","title":"Wait for Agents","detailKeys":["ids","timeoutSeconds"]},"structured_output":{"icon":"fileText","title":"Structured Output","detailKeys":["result"]},"subagents":{"icon":"users","title":"Subagents","actions":{"list":{"label":"list","detailKeys":["recentMinutes"]},"kill":{"label":"kill","detailKeys":["target"]},"steer":{"label":"steer","detailKeys":["target"]}}},"agents_list":{"icon":"users","title":"Agents","detailKeys":[]},"memory_search":{"icon":"search","title":"Memory Search","detailKeys":["query"]},"memory_get":{"icon":"brain","title":"Memory Get","detailKeys":["path","from","lines"]},"skills_search":{"icon":"search","title":"Skill Search","detailKeys":["query"]},"skills_read":{"icon":"fileText","title":"Skill Read","detailKeys":["name"]},"web_search":{"icon":"search","title":"Web Search","detailKeys":["query","count"]},"web_fetch":{"icon":"globe","title":"Web Fetch","detailKeys":["url","extractMode","maxChars"]},"code_execution":{"icon":"braces","title":"Code Execution","detailKeys":["task"]},"decision_evaluate":{"icon":"shieldCheck","title":"Decision Evaluation","detailKeys":[]},"message":{"icon":"mail","title":"Message","actions":{"send":{"label":"send","detailKeys":["provider","to","media","replyTo","threadId"]},"poll":{"label":"poll","detailKeys":["provider","to","pollQuestion"]},"react":{"label":"react","detailKeys":["provider","to","messageId","emoji","remove"]},"reactions":{"label":"reactions","detailKeys":["provider","to","messageId","limit"]},"read":{"label":"read","detailKeys":["provider","to","limit"]},"edit":{"label":"edit","detailKeys":["provider","to","messageId"]},"delete":{"label":"delete","detailKeys":["provider","to","messageId"]},"pin":{"label":"pin","detailKeys":["provider","to","messageId"]},"unpin":{"label":"unpin","detailKeys":["provider","to","messageId"]},"list-pins":{"label":"list pins","detailKeys":["provider","to"]},"permissions":{"label":"permissions","detailKeys":["provider","channelId","to"]},"thread-create":{"label":"thread create","detailKeys":["provider","channelId","threadName"]},"thread-list":{"label":"thread list","detailKeys":["provider","guildId","channelId"]},"thread-reply":{"label":"thread reply","detailKeys":["provider","channelId","messageId"]},"search":{"label":"search","detailKeys":["provider","guildId","query"]},"sticker":{"label":"sticker","detailKeys":["provider","to","stickerId"]},"member-info":{"label":"member","detailKeys":["provider","guildId","userId"]},"role-info":{"label":"roles","detailKeys":["provider","guildId"]},"emoji-list":{"label":"emoji list","detailKeys":["provider","guildId"]},"emoji-upload":{"label":"emoji upload","detailKeys":["provider","guildId","emojiName"]},"sticker-upload":{"label":"sticker upload","detailKeys":["provider","guildId","stickerName"]},"role-add":{"label":"role add","detailKeys":["provider","guildId","userId","roleId"]},"role-remove":{"label":"role remove","detailKeys":["provider","guildId","userId","roleId"]},"channel-info":{"label":"channel","detailKeys":["provider","channelId"]},"channel-list":{"label":"channels","detailKeys":["provider","guildId"]},"voice-status":{"label":"voice","detailKeys":["provider","guildId","userId"]},"event-list":{"label":"events","detailKeys":["provider","guildId"]},"event-create":{"label":"event create","detailKeys":["provider","guildId","eventName"]},"timeout":{"label":"timeout","detailKeys":["provider","guildId","userId"]},"kick":{"label":"kick","detailKeys":["provider","guildId","userId"]},"ban":{"label":"ban","detailKeys":["provider","guildId","userId"]}}},"apply_patch":{"icon":"fileDiff","title":"Apply Patch","detailKeys":[]},"image":{"icon":"image","title":"Image","detailKeys":["path","paths","url","urls","prompt","model"]},"view_image":{"icon":"image","title":"View Image","detailKeys":["path","paths","url","urls","prompt","model"]},"image_generate":{"icon":"image","title":"Image Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","count","resolution","aspectRatio"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"music_generate":{"icon":"music","title":"Music Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","durationSeconds","format","instrumental"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"video_generate":{"icon":"play","title":"Video Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","durationSeconds","resolution","aspectRatio","audio","watermark"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"pdf":{"icon":"fileText","title":"PDF","detailKeys":["path","paths","url","urls","prompt","pageRange","model"]},"sessions_yield":{"icon":"pause","title":"Yield"},"tts":{"icon":"audioLines","title":"TTS","detailKeys":["text","channel"]}}`),id={version:1,fallback:nd,tools:rd}})))()}function od(e,t=!1){let n=e.length,r=0,i=``,a=0,o=16,s=0,c=0,l=0,u=0,d=0;function f(t,n){let i=0,a=0;for(;i<t||!n;){let t=e.charCodeAt(r);if(t>=48&&t<=57)a=a*16+t-48;else if(t>=65&&t<=70)a=a*16+t-65+10;else if(t>=97&&t<=102)a=a*16+t-97+10;else break;r++,i++}return i<t&&(a=-1),a}function p(e){r=e,i=``,a=0,o=16,d=0}function m(){let t=r;if(e.charCodeAt(r)===48)r++;else for(r++;r<e.length&&ld(e.charCodeAt(r));)r++;if(r<e.length&&e.charCodeAt(r)===46){if(r++,r<e.length&&ld(e.charCodeAt(r)))for(r++;r<e.length&&ld(e.charCodeAt(r));)r++;else return d=3,e.substring(t,r)}let n=r;if(r<e.length&&(e.charCodeAt(r)===69||e.charCodeAt(r)===101)){if(r++,(r<e.length&&e.charCodeAt(r)===43||e.charCodeAt(r)===45)&&r++,r<e.length&&ld(e.charCodeAt(r))){for(r++;r<e.length&&ld(e.charCodeAt(r));)r++;n=r}else d=3}return e.substring(t,n)}function h(){let t=``,i=r;for(;;){if(r>=n){t+=e.substring(i,r),d=2;break}let a=e.charCodeAt(r);if(a===34){t+=e.substring(i,r),r++;break}if(a===92){if(t+=e.substring(i,r),r++,r>=n){d=2;break}switch(e.charCodeAt(r++)){case 34:t+=`"`;break;case 92:t+=`\\`;break;case 47:t+=`/`;break;case 98:t+=`\b`;break;case 102:t+=`\f`;break;case 110:t+=`
`;break;case 114:t+=`\r`;break;case 116:t+=`	`;break;case 117:let e=f(4,!0);e>=0?t+=String.fromCharCode(e):d=4;break;default:d=5}i=r;continue}if(a>=0&&a<=31){if(cd(a)){t+=e.substring(i,r),d=2;break}d=6}r++}return t}function g(){if(i=``,d=0,a=r,c=s,u=l,r>=n)return a=n,o=17;let t=e.charCodeAt(r);if(sd(t)){do r++,i+=String.fromCharCode(t),t=e.charCodeAt(r);while(sd(t));return o=15}if(cd(t))return r++,i+=String.fromCharCode(t),t===13&&e.charCodeAt(r)===10&&(r++,i+=`
`),s++,l=r,o=14;switch(t){case 123:return r++,o=1;case 125:return r++,o=2;case 91:return r++,o=3;case 93:return r++,o=4;case 58:return r++,o=6;case 44:return r++,o=5;case 34:return r++,i=h(),o=10;case 47:let c=r-1;if(e.charCodeAt(r+1)===47){for(r+=2;r<n&&!cd(e.charCodeAt(r));)r++;return i=e.substring(c,r),o=12}if(e.charCodeAt(r+1)===42){r+=2;let t=n-1,a=!1;for(;r<t;){let t=e.charCodeAt(r);if(t===42&&e.charCodeAt(r+1)===47){r+=2,a=!0;break}r++,cd(t)&&(t===13&&e.charCodeAt(r)===10&&r++,s++,l=r)}return a||(r++,d=1),i=e.substring(c,r),o=13}return i+=String.fromCharCode(t),r++,o=16;case 45:if(i+=String.fromCharCode(t),r++,r===n||!ld(e.charCodeAt(r)))return o=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return i+=m(),o=11;default:for(;r<n&&_(t);)r++,t=e.charCodeAt(r);if(a!==r){switch(i=e.substring(a,r),i){case`true`:return o=8;case`false`:return o=9;case`null`:return o=7}return o=16}return i+=String.fromCharCode(t),r++,o=16}}function _(e){if(sd(e)||cd(e))return!1;switch(e){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function v(){let e;do e=g();while(e>=12&&e<=15);return e}return{setPosition:p,getPosition:()=>r,scan:t?v:g,getToken:()=>o,getTokenValue:()=>i,getTokenOffset:()=>a,getTokenLength:()=>r-a,getTokenStartLine:()=>c,getTokenStartCharacter:()=>a-u,getTokenError:()=>d}}function sd(e){return e===32||e===9}function cd(e){return e===10||e===13}function ld(e){return e>=48&&e<=57}var ud;function dd(){return(dd=e((()=>{(function(e){e[e.lineFeed=10]=`lineFeed`,e[e.carriageReturn=13]=`carriageReturn`,e[e.space=32]=`space`,e[e._0=48]=`_0`,e[e._1=49]=`_1`,e[e._2=50]=`_2`,e[e._3=51]=`_3`,e[e._4=52]=`_4`,e[e._5=53]=`_5`,e[e._6=54]=`_6`,e[e._7=55]=`_7`,e[e._8=56]=`_8`,e[e._9=57]=`_9`,e[e.a=97]=`a`,e[e.b=98]=`b`,e[e.c=99]=`c`,e[e.d=100]=`d`,e[e.e=101]=`e`,e[e.f=102]=`f`,e[e.g=103]=`g`,e[e.h=104]=`h`,e[e.i=105]=`i`,e[e.j=106]=`j`,e[e.k=107]=`k`,e[e.l=108]=`l`,e[e.m=109]=`m`,e[e.n=110]=`n`,e[e.o=111]=`o`,e[e.p=112]=`p`,e[e.q=113]=`q`,e[e.r=114]=`r`,e[e.s=115]=`s`,e[e.t=116]=`t`,e[e.u=117]=`u`,e[e.v=118]=`v`,e[e.w=119]=`w`,e[e.x=120]=`x`,e[e.y=121]=`y`,e[e.z=122]=`z`,e[e.A=65]=`A`,e[e.B=66]=`B`,e[e.C=67]=`C`,e[e.D=68]=`D`,e[e.E=69]=`E`,e[e.F=70]=`F`,e[e.G=71]=`G`,e[e.H=72]=`H`,e[e.I=73]=`I`,e[e.J=74]=`J`,e[e.K=75]=`K`,e[e.L=76]=`L`,e[e.M=77]=`M`,e[e.N=78]=`N`,e[e.O=79]=`O`,e[e.P=80]=`P`,e[e.Q=81]=`Q`,e[e.R=82]=`R`,e[e.S=83]=`S`,e[e.T=84]=`T`,e[e.U=85]=`U`,e[e.V=86]=`V`,e[e.W=87]=`W`,e[e.X=88]=`X`,e[e.Y=89]=`Y`,e[e.Z=90]=`Z`,e[e.asterisk=42]=`asterisk`,e[e.backslash=92]=`backslash`,e[e.closeBrace=125]=`closeBrace`,e[e.closeBracket=93]=`closeBracket`,e[e.colon=58]=`colon`,e[e.comma=44]=`comma`,e[e.dot=46]=`dot`,e[e.doubleQuote=34]=`doubleQuote`,e[e.minus=45]=`minus`,e[e.openBrace=123]=`openBrace`,e[e.openBracket=91]=`openBracket`,e[e.plus=43]=`plus`,e[e.slash=47]=`slash`,e[e.formFeed=12]=`formFeed`,e[e.tab=9]=`tab`})(ud||={})})))()}var K,fd,pd,md;function hd(){return(hd=e((()=>{K=Array(20).fill(0).map((e,t)=>` `.repeat(t)),fd=200,pd={" ":{"\n":Array(fd).fill(0).map((e,t)=>`
`+` `.repeat(t)),"\r":Array(fd).fill(0).map((e,t)=>`\r`+` `.repeat(t)),"\r\n":Array(fd).fill(0).map((e,t)=>`\r
`+` `.repeat(t))},"	":{"\n":Array(fd).fill(0).map((e,t)=>`
`+`	`.repeat(t)),"\r":Array(fd).fill(0).map((e,t)=>`\r`+`	`.repeat(t)),"\r\n":Array(fd).fill(0).map((e,t)=>`\r
`+`	`.repeat(t))}},md=[`
`,`\r`,`\r
`]})))()}function gd(e,t,n){let r,i,a,o,s;if(t){for(o=t.offset,s=o+t.length,a=o;a>0&&!bd(e,a-1);)a--;let c=s;for(;c<e.length&&!bd(e,c);)c++;i=e.substring(a,c),r=vd(i,n)}else i=e,r=0,a=0,o=0,s=e.length;let c=yd(n,e),l=md.includes(c),u=0,d=0,f;f=n.insertSpaces?K[n.tabSize||4]??_d(K[1],n.tabSize||4):`	`;let p=f===`	`?`	`:` `,m=od(i,!1),h=!1;function g(){if(u>1)return _d(c,u)+_d(f,r+d);let e=f.length*(r+d);return!l||e>pd[p][c].length?c+_d(f,r+d):e<=0?c:pd[p][c][e]}function _(){let e=m.scan();for(u=0;e===15||e===14;)e===14&&n.keepLines?u+=1:e===14&&(u=1),e=m.scan();return h=e===16||m.getTokenError()!==0,e}let v=[];function y(n,r,i){!h&&(!t||r<s&&i>o)&&e.substring(r,i)!==n&&v.push({offset:r,length:i-r,content:n})}let b=_();if(n.keepLines&&u>0&&y(_d(c,u),0,0),b!==17){let e=m.getTokenOffset()+a;y(f.length*r<20&&n.insertSpaces?K[f.length*r]:_d(f,r),a,e)}for(;b!==17;){let e=m.getTokenOffset()+m.getTokenLength()+a,t=_(),r=``,i=!1;for(;u===0&&(t===12||t===13);){let n=m.getTokenOffset()+a;y(K[1],e,n),e=m.getTokenOffset()+m.getTokenLength()+a,i=t===12,r=i?g():``,t=_()}if(t===2)b!==1&&d--,n.keepLines&&u>0||!n.keepLines&&b!==1?r=g():n.keepLines&&(r=K[1]);else if(t===4)b!==3&&d--,n.keepLines&&u>0||!n.keepLines&&b!==3?r=g():n.keepLines&&(r=K[1]);else{switch(b){case 3:case 1:d++,r=n.keepLines&&u>0||!n.keepLines?g():K[1];break;case 5:r=n.keepLines&&u>0||!n.keepLines?g():K[1];break;case 12:r=g();break;case 13:u>0?r=g():i||(r=K[1]);break;case 6:n.keepLines&&u>0?r=g():i||(r=K[1]);break;case 10:n.keepLines&&u>0?r=g():t===6&&!i&&(r=``);break;case 7:case 8:case 9:case 11:case 2:case 4:n.keepLines&&u>0?r=g():(t===12||t===13)&&!i?r=K[1]:t!==5&&t!==17&&(h=!0);break;case 16:h=!0}u>0&&(t===12||t===13)&&(r=g())}t===17&&(r=n.keepLines&&u>0?g():n.insertFinalNewline?c:``);let o=m.getTokenOffset()+a;y(r,e,o),b=t}return v}function _d(e,t){let n=``;for(let r=0;r<t;r++)n+=e;return n}function vd(e,t){let n=0,r=0,i=t.tabSize||4;for(;n<e.length;){let t=e.charAt(n);if(t===K[1])r++;else if(t===`	`)r+=i;else break;n++}return Math.floor(r/i)}function yd(e,t){for(let e=0;e<t.length;e++){let n=t.charAt(e);if(n===`\r`)return e+1<t.length&&t.charAt(e+1)===`
`?`\r
`:`\r`;if(n===`
`)return`
`}return e&&e.eol||`
`}function bd(e,t){return`\r
`.indexOf(e.charAt(t))!==-1}function xd(){return(xd=e((()=>{dd(),hd()})))()}function Sd(e,t=[],n=Td.DEFAULT){let r={type:`array`,offset:-1,length:-1,children:[],parent:void 0};function i(e){r.type===`property`&&(r.length=e-r.offset,r=r.parent)}function a(e){return r.children.push(e),e}Cd(e,{onObjectBegin:e=>{r=a({type:`object`,offset:e,length:-1,parent:r,children:[]})},onObjectProperty:(e,t,n)=>{r=a({type:`property`,offset:t,length:-1,parent:r,children:[]}),r.children.push({type:`string`,value:e,offset:t,length:n,parent:r})},onObjectEnd:(e,t)=>{i(e+t),r.length=e+t-r.offset,r=r.parent,i(e+t)},onArrayBegin:(e,t)=>{r=a({type:`array`,offset:e,length:-1,parent:r,children:[]})},onArrayEnd:(e,t)=>{r.length=e+t-r.offset,r=r.parent,i(e+t)},onLiteralValue:(e,t,n)=>{a({type:wd(e),offset:t,length:n,parent:r,value:e}),i(t+n)},onSeparator:(e,t,n)=>{r.type===`property`&&(e===`:`?r.colonOffset=t:e===`,`&&i(t))},onError:(e,n,r)=>{t.push({error:e,offset:n,length:r})}},n);let o=r.children[0];return o&&delete o.parent,o}function Cd(e,t,n=Td.DEFAULT){let r=od(e,!1),i=[],a=0;function o(e){return e?()=>a===0&&e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter()):()=>!0}function s(e){return e?t=>a===0&&e(t,r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter()):()=>!0}function c(e){return e?t=>a===0&&e(t,r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter(),()=>i.slice()):()=>!0}function l(e){return e?()=>{a>0?a++:e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter(),()=>i.slice())===!1&&(a=1)}:()=>!0}function u(e){return e?()=>{a>0&&a--,a===0&&e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter())}:()=>!0}let d=l(t.onObjectBegin),f=c(t.onObjectProperty),p=u(t.onObjectEnd),m=l(t.onArrayBegin),h=u(t.onArrayEnd),g=c(t.onLiteralValue),_=s(t.onSeparator),v=o(t.onComment),y=s(t.onError),b=n&&n.disallowComments,x=n&&n.allowTrailingComma;function S(){for(;;){let e=r.scan();switch(r.getTokenError()){case 4:C(14);break;case 5:C(15);break;case 3:C(13);break;case 1:b||C(11);break;case 2:C(12);break;case 6:C(16)}switch(e){case 12:case 13:b?C(10):v();break;case 16:C(1);break;case 15:case 14:break;default:return e}}}function C(e,t=[],n=[]){if(y(e),t.length+n.length>0){let e=r.getToken();for(;e!==17;){if(t.indexOf(e)!==-1){S();break}if(n.indexOf(e)!==-1)break;e=S()}}}function w(e){let t=r.getTokenValue();return e?g(t):(f(t),i.push(t)),S(),!0}function T(){switch(r.getToken()){case 11:let e=r.getTokenValue(),t=Number(e);isNaN(t)&&(C(2),t=0),g(t);break;case 7:g(null);break;case 8:g(!0);break;case 9:g(!1);break;default:return!1}return S(),!0}function E(){return r.getToken()===10?(w(!1),r.getToken()===6?(_(`:`),S(),O()||C(4,[],[2,5])):C(5,[],[2,5]),i.pop(),!0):(C(3,[],[2,5]),!1)}function ee(){d(),S();let e=!1;for(;r.getToken()!==2&&r.getToken()!==17;){if(r.getToken()===5){if(e||C(4,[],[]),_(`,`),S(),r.getToken()===2&&x)break}else e&&C(6,[],[]);E()||C(4,[],[2,5]),e=!0}return p(),r.getToken()===2?S():C(7,[2],[]),!0}function D(){m(),S();let e=!0,t=!1;for(;r.getToken()!==4&&r.getToken()!==17;){if(r.getToken()===5){if(t||C(4,[],[]),_(`,`),S(),r.getToken()===4&&x)break}else t&&C(6,[],[]);e?(i.push(0),e=!1):i[i.length-1]++,O()||C(4,[],[4,5]),t=!0}return h(),e||i.pop(),r.getToken()===4?S():C(8,[4],[]),!0}function O(){switch(r.getToken()){case 3:return D();case 1:return ee();case 10:return w(!0);default:return T()}}return S(),r.getToken()===17?n.allowEmptyContent?!0:(C(4,[],[]),!1):O()?(r.getToken()!==17&&C(9,[],[]),!0):(C(4,[],[]),!1)}function wd(e){switch(typeof e){case`boolean`:return`boolean`;case`number`:return`number`;case`string`:return`string`;case`object`:return e?Array.isArray(e)?`array`:`object`:`null`;default:return`null`}}var Td;function Ed(){return(Ed=e((()=>{dd(),(function(e){e.DEFAULT={allowTrailingComma:!1}})(Td||={})})))()}function Dd(e,t){return e.substring(0,t.offset)+t.content+e.substring(t.offset+t.length)}function Od(){return(Od=e((()=>{xd(),Ed()})))()}function kd(e,t,n){return gd(e,t,n)}function Ad(e,t){let n=t.slice(0).sort((e,t)=>{let n=e.offset-t.offset;return n===0?e.length-t.length:n}),r=e.length;for(let t=n.length-1;t>=0;t--){let i=n[t];if(i.offset+i.length<=r)e=Dd(e,i);else throw Error(`Overlapping edit`);r=i.offset}return e}var jd,Md,Nd,Pd,Fd;function Id(){return(Id=e((()=>{xd(),Od(),dd(),Ed(),jd=od,(function(e){e[e.None=0]=`None`,e[e.UnexpectedEndOfComment=1]=`UnexpectedEndOfComment`,e[e.UnexpectedEndOfString=2]=`UnexpectedEndOfString`,e[e.UnexpectedEndOfNumber=3]=`UnexpectedEndOfNumber`,e[e.InvalidUnicode=4]=`InvalidUnicode`,e[e.InvalidEscapeCharacter=5]=`InvalidEscapeCharacter`,e[e.InvalidCharacter=6]=`InvalidCharacter`})(Md||={}),(function(e){e[e.OpenBraceToken=1]=`OpenBraceToken`,e[e.CloseBraceToken=2]=`CloseBraceToken`,e[e.OpenBracketToken=3]=`OpenBracketToken`,e[e.CloseBracketToken=4]=`CloseBracketToken`,e[e.CommaToken=5]=`CommaToken`,e[e.ColonToken=6]=`ColonToken`,e[e.NullKeyword=7]=`NullKeyword`,e[e.TrueKeyword=8]=`TrueKeyword`,e[e.FalseKeyword=9]=`FalseKeyword`,e[e.StringLiteral=10]=`StringLiteral`,e[e.NumericLiteral=11]=`NumericLiteral`,e[e.LineCommentTrivia=12]=`LineCommentTrivia`,e[e.BlockCommentTrivia=13]=`BlockCommentTrivia`,e[e.LineBreakTrivia=14]=`LineBreakTrivia`,e[e.Trivia=15]=`Trivia`,e[e.Unknown=16]=`Unknown`,e[e.EOF=17]=`EOF`})(Nd||={}),Pd=Sd,(function(e){e[e.InvalidSymbol=1]=`InvalidSymbol`,e[e.InvalidNumberFormat=2]=`InvalidNumberFormat`,e[e.PropertyNameExpected=3]=`PropertyNameExpected`,e[e.ValueExpected=4]=`ValueExpected`,e[e.ColonExpected=5]=`ColonExpected`,e[e.CommaExpected=6]=`CommaExpected`,e[e.CloseBraceExpected=7]=`CloseBraceExpected`,e[e.CloseBracketExpected=8]=`CloseBracketExpected`,e[e.EndOfFileExpected=9]=`EndOfFileExpected`,e[e.InvalidCommentToken=10]=`InvalidCommentToken`,e[e.UnexpectedEndOfComment=11]=`UnexpectedEndOfComment`,e[e.UnexpectedEndOfString=12]=`UnexpectedEndOfString`,e[e.UnexpectedEndOfNumber=13]=`UnexpectedEndOfNumber`,e[e.InvalidUnicode=14]=`InvalidUnicode`,e[e.InvalidEscapeCharacter=15]=`InvalidEscapeCharacter`,e[e.InvalidCharacter=16]=`InvalidCharacter`})(Fd||={})})))()}var Ld,Rd,zd,Bd,Vd;function Hd(){return(Hd=e((()=>{Ld=[161,161,164,164,167,168,170,170,173,174,176,180,182,186,188,191,198,198,208,208,215,216,222,225,230,230,232,234,236,237,240,240,242,243,247,250,252,252,254,254,257,257,273,273,275,275,283,283,294,295,299,299,305,307,312,312,319,322,324,324,328,331,333,333,338,339,358,359,363,363,462,462,464,464,466,466,468,468,470,470,472,472,474,474,476,476,593,593,609,609,708,708,711,711,713,715,717,717,720,720,728,731,733,733,735,735,768,879,913,929,931,937,945,961,963,969,1025,1025,1040,1103,1105,1105,8208,8208,8211,8214,8216,8217,8220,8221,8224,8226,8228,8231,8240,8240,8242,8243,8245,8245,8251,8251,8254,8254,8308,8308,8319,8319,8321,8324,8364,8364,8451,8451,8453,8453,8457,8457,8467,8467,8470,8470,8481,8482,8486,8486,8491,8491,8531,8532,8539,8542,8544,8555,8560,8569,8585,8585,8592,8601,8632,8633,8658,8658,8660,8660,8679,8679,8704,8704,8706,8707,8711,8712,8715,8715,8719,8719,8721,8721,8725,8725,8730,8730,8733,8736,8739,8739,8741,8741,8743,8748,8750,8750,8756,8759,8764,8765,8776,8776,8780,8780,8786,8786,8800,8801,8804,8807,8810,8811,8814,8815,8834,8835,8838,8839,8853,8853,8857,8857,8869,8869,8895,8895,8978,8978,9312,9449,9451,9547,9552,9587,9600,9615,9618,9621,9632,9633,9635,9641,9650,9651,9654,9655,9660,9661,9664,9665,9670,9672,9675,9675,9678,9681,9698,9701,9711,9711,9733,9734,9737,9737,9742,9743,9756,9756,9758,9758,9792,9792,9794,9794,9824,9825,9827,9829,9831,9834,9836,9837,9839,9839,9886,9887,9919,9919,9926,9933,9935,9939,9941,9953,9955,9955,9960,9961,9963,9969,9972,9972,9974,9977,9979,9980,9982,9983,10045,10045,10102,10111,11094,11097,12872,12879,57344,63743,65024,65039,65533,65533,127232,127242,127248,127277,127280,127337,127344,127373,127375,127376,127387,127404,917760,917999,983040,1048573,1048576,1114109],Rd=[12288,12288,65281,65376,65504,65510],zd=[8361,8361,65377,65470,65474,65479,65482,65487,65490,65495,65498,65500,65512,65518],Bd=[32,126,162,163,165,166,172,172,175,175,10214,10221,10629,10630],Vd=[4352,4447,8986,8987,9001,9002,9193,9196,9200,9200,9203,9203,9725,9726,9748,9749,9776,9783,9800,9811,9855,9855,9866,9871,9875,9875,9889,9889,9898,9899,9917,9918,9924,9925,9934,9934,9940,9940,9962,9962,9970,9971,9973,9973,9978,9978,9981,9981,9989,9989,9994,9995,10024,10024,10060,10060,10062,10062,10067,10069,10071,10071,10133,10135,10160,10160,10175,10175,11035,11036,11088,11088,11093,11093,11904,11929,11931,12019,12032,12245,12272,12287,12289,12350,12353,12438,12441,12543,12549,12591,12593,12686,12688,12773,12783,12830,12832,12871,12880,42124,42128,42182,43360,43388,44032,55203,63744,64255,65040,65049,65072,65106,65108,65126,65128,65131,94176,94180,94192,94198,94208,101594,101631,101664,101760,101874,101888,102801,102816,102866,110576,110579,110581,110587,110589,110590,110592,110888,110898,110898,110928,110930,110933,110933,110948,110952,110960,111355,119552,119638,119648,119670,126980,126980,127183,127183,127374,127374,127377,127386,127406,127406,127488,127490,127504,127547,127552,127560,127568,127569,127584,127589,127744,127776,127789,127797,127799,127868,127870,127891,127904,127946,127951,127955,127968,127984,127988,127988,127992,128062,128064,128064,128066,128252,128255,128317,128331,128334,128336,128359,128378,128378,128405,128406,128420,128420,128507,128591,128640,128709,128716,128716,128720,128722,128725,128729,128732,128735,128747,128748,128756,128764,128986,128986,128992,129003,129008,129008,129292,129338,129340,129349,129351,129535,129648,129660,129664,129734,129736,129736,129740,129757,129759,129771,129775,129786,131072,196605,196608,262141]})))()}var Ud;function Wd(){return(Wd=e((()=>{Ud=(e,t)=>{let n=0,r=Math.floor(e.length/2)-1;for(;n<=r;){let i=Math.floor((n+r)/2),a=i*2;if(t<e[a])r=i-1;else if(t>e[a+1])n=i+1;else return!0}return!1}})))()}function Gd(e){let t=e[0],n=e[1];for(let r=0;r<e.length;r+=2){let i=e[r],a=e[r+1];if(qd>=i&&qd<=a)return[i,a];a-i>n-t&&(t=i,n=a)}return[t,n]}function Kd(e){return Xd(e)?`ambiguous`:Zd(e)?`fullwidth`:Qd(e)?`halfwidth`:$d(e)?`narrow`:ef(e)?`wide`:`neutral`}var qd,Jd,Yd,Xd,Zd,Qd,$d,ef;function tf(){return(tf=e((()=>{Hd(),Wd(),qd=19968,[Jd,Yd]=Gd(Vd),Xd=e=>e<161||e>1114109?!1:Ud(Ld,e),Zd=e=>e<12288||e>65510?!1:Ud(Rd,e),Qd=e=>e<8361||e>65518?!1:Ud(zd,e),$d=e=>e<32||e>10630?!1:Ud(Bd,e),ef=e=>e>=Jd&&e<=Yd?!0:e<4352||e>262141?!1:Ud(Vd,e)})))()}function nf(e){if(!Number.isSafeInteger(e))throw TypeError(`Expected a code point, got \`${typeof e}\`.`)}function rf(e){return nf(e),Kd(e)}function af(){return(af=e((()=>{tf()})))()}var of;function sf(){return(sf=e((()=>{of=class extends Event{constructor(){super(`wa-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var cf;function lf(){return(lf=e((()=>{y(),cf=v`
  :host {
    --arrow-color: black;
    --arrow-size: var(--wa-tooltip-arrow-size);
    --popup-border-width: 0px;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45) to calculate the length of the arrow after rotation.
     *
     * The diamond will be translated inward by --arrow-base-offset, the border thickness, to centralise it on
     * the inner edge of the popup border. This also means we need to increase the size of the arrow by the
     * same amount to compensate.
     *
     * A diamond shaped clipping mask is used to avoid overlap of popup content. This extends slightly inward so
     * the popup border is covered with no sub-pixel rounding artifacts. The diamond corners are mitred at 22.5º
     * to properly merge any arrow border with the popup border. The constant 1.4142 is derived from 1 + tan(22.5).
     *
     */
    --arrow-base-offset: var(--popup-border-width);
    --arrow-size-diagonal: calc((var(--arrow-size) + var(--arrow-base-offset)) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));
    --arrow-size-div: calc(var(--arrow-size-diagonal) * 2);
    --arrow-clipping-corner: calc(var(--arrow-base-offset) * 1.4142);

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);

    /* Clear UA styles for [popover] */
    :where(&) {
      inset: unset;
      padding: unset;
      margin: unset;
      width: unset;
      height: unset;
      color: unset;
      background: unset;
      border: unset;
      overflow: unset;
    }
  }

  .popup-fixed {
    position: fixed;
  }

  .popup:not(.popup-active) {
    display: none;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-size-div);
    height: var(--arrow-size-div);
    background: var(--arrow-color);
    z-index: 3;
    clip-path: polygon(
      var(--arrow-clipping-corner) 100%,
      var(--arrow-base-offset) calc(100% - var(--arrow-base-offset)),
      calc(var(--arrow-base-offset) - 2px) calc(100% - var(--arrow-base-offset)),
      calc(100% - var(--arrow-base-offset)) calc(var(--arrow-base-offset) - 2px),
      calc(100% - var(--arrow-base-offset)) var(--arrow-base-offset),
      100% var(--arrow-clipping-corner),
      100% 100%
    );
    rotate: 45deg;
  }

  :host([data-current-placement|='left']) .arrow {
    rotate: -45deg;
  }

  :host([data-current-placement|='right']) .arrow {
    rotate: 135deg;
  }

  :host([data-current-placement|='bottom']) .arrow {
    rotate: 225deg;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge-visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: 899;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }

  /* Built-in animations */
  .show {
    animation: show var(--show-duration) ease;
  }

  .hide {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .show-with-scale {
    animation: show-with-scale var(--show-duration) ease;
  }

  .hide-with-scale {
    animation: show-with-scale var(--hide-duration) ease reverse;
  }

  @keyframes show-with-scale {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
`})))()}var uf,df,ff,q,pf,mf,hf,gf;function _f(){return(_f=e((()=>{uf=Object.defineProperty,df=Object.getOwnPropertyDescriptor,ff=e=>{throw TypeError(e)},q=(e,t,n,r)=>{for(var i=r>1?void 0:r?df(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&uf(t,n,i),i},pf=(e,t,n)=>t.has(e)||ff(`Cannot `+n),mf=(e,t,n)=>(pf(e,t,`read from private field`),n?n.call(e):t.get(e)),hf=(e,t,n)=>t.has(e)?ff(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),gf=(e,t,n,r)=>(pf(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n)})))()}function vf(e){return e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}function yf(e){let{property:t,value:n,element:r}=e;if(n){let e=r.getAttribute(`style`)||``;e&&(e.match(xf)||(e+=`;`),e+=` `);let i=`${t}: ${n}`;return e.includes(i)?void 0:`${e}${i};`}return null}var bf,xf,Sf,Cf;function J(){return(J=e((()=>{_f(),y(),C(),bf=v`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,xf=/;\s+$/,Cf=class extends ee{constructor(){super(),hf(this,Sf,!1),this.initialReflectedProperties=new Map,this.didSSR=!!this.shadowRoot,this.customStates={set:(e,t)=>{if(this.internals?.states)try{t?this.internals.states.add(e):this.internals.states.delete(e)}catch(e){if(String(e).includes(`must start with '--'`))console.error(`Your browser implements an outdated version of CustomStateSet. Consider using a polyfill`);else throw e}},has:e=>{if(!this.internals?.states)return!1;try{return this.internals.states.has(e)}catch{return!1}}};try{this.internals=this.attachInternals()}catch{console.error(`Element internals are not supported in your browser. Consider using a polyfill`)}this.customStates.set(`wa-defined`,!0);let e=this.constructor;for(let[t,n]of e.elementProperties)n.default===`inherit`&&n.initial!==void 0&&typeof t==`string`&&this.customStates.set(`initial-${t}-${n.initial}`,!0)}static get styles(){return[bf,...Array.isArray(this.css)?this.css:this.css?[this.css]:[]]}connectedCallback(){super.connectedCallback(),this.didSSR||this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `)),this.didSSR&&this.updateComplete.then(()=>{this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `))})}attributeChangedCallback(e,t,n){mf(this,Sf)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),gf(this,Sf,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}firstUpdated(e){super.firstUpdated(e),this.didSSR&&this.shadowRoot?.querySelectorAll(`slot`).forEach(e=>{e.dispatchEvent(new Event(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))})}update(e){try{super.update(e)}catch(e){if(this.didSSR&&!this.hasUpdated){let t=new Event(`lit-hydration-error`,{bubbles:!0,composed:!0,cancelable:!1});t.error=e,this.dispatchEvent(t)}throw e}}setStyle(e,t){if(!this.style){let n=yf({property:vf(e),value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style[e]=t}setStyleProperty(e,t){if(!this.style){let n=yf({property:e,value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style.setProperty(e,t)}relayNativeEvent(e,t){e.stopImmediatePropagation(),this.dispatchEvent(new e.constructor(e.type,{...e,...t}))}},Sf=new WeakMap,q([g()],Cf.prototype,`dir`,2),q([g()],Cf.prototype,`lang`,2),q([g({type:Boolean,reflect:!0,attribute:`did-ssr`})],Cf.prototype,`didSSR`,2)})))()}function wf(...e){e.map(e=>{let t=e.$code.toLowerCase();Df.has(t)?Df.set(t,Object.assign(Object.assign({},Df.get(t)),e)):Df.set(t,e),Of||=e}),Tf()}function Tf(){jf&&(kf=document.documentElement.dir||`ltr`,Af=document.documentElement.lang||navigator.language),[...Ef.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var Ef,Df,Of,kf,Af,jf,Mf;function Nf(){return(Nf=e((()=>{if(Ef=new Set,Df=new Map,kf=`ltr`,Af=`en`,jf=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0,jf){let e=new MutationObserver(Tf);kf=document.documentElement.dir||`ltr`,Af=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}Mf=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Ef.add(this.host)}hostDisconnected(){Ef.delete(this.host)}dir(){return`${this.host.dir||kf}`.toLowerCase()}lang(){let e=`${this.host.lang||Af}`.toLowerCase().replace(/_/g,`-`);try{return new Intl.Locale(e),e}catch{return Of?Of.$code.toLowerCase():`en`}}getTranslationData(e){let t;try{t=new Intl.Locale(e.replace(/_/g,`-`))}catch{return{locale:void 0,language:``,region:``,primary:void 0,secondary:void 0}}let n=t.language.toLowerCase(),r=t.region?.toLowerCase()??``,i=Df.get(`${n}-${r}`),a=Df.get(n);return{locale:t,language:n,region:r,primary:i,secondary:a}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&Of&&Of[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(Of&&Of[e])i=Of[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}}})))()}var Pf,Ff;function If(){return(If=e((()=>{Nf(),Pf={$code:`en`,$name:`English`,$dir:`ltr`,allTagsRemoved:`All tags removed`,am:`AM`,autosizeColumn:`Autosize column`,captions:`Captions`,carousel:`Carousel`,chooseDate:`Choose date`,chooseDecade:`Choose decade`,chooseMonth:`Choose month`,chooseTime:`Choose time`,chooseYear:`Choose year`,clearEntry:`Clear entry`,clearFilter:`Clear filter`,clearSort:`Clear sort`,close:`Close`,closeCalendar:`Close calendar`,closeTimeInput:`Close time picker`,collapseRow:`Collapse row`,columnMenu:`Column options`,columnMovedToPosition:(e,t,n)=>`${e} moved to position ${t} of ${n}`,columns:`Columns`,compactPageXOfY:(e,t)=>`${e} of ${t}`,copied:`Copied`,copy:`Copy`,createOption:e=>`Create "${e}"`,currentlyPlaying:`currently playing`,currentValue:`Current value`,date:`Date`,datePickerKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the calendar.`,day:`Day`,dayPeriod:`AM/PM`,decrement:`Decrement`,deselectAllRows:`Deselect all rows`,dropFileHere:`Drop file here or click to browse`,dropFilesHere:`Drop files here or click to browse`,empty:`Empty`,endDate:`End date`,enterFullscreen:`Enter fullscreen`,error:`Error`,exitFullscreen:`Exit fullscreen`,expandRow:`Expand row`,filterByColumn:e=>`Filter by ${e}`,filterFrom:`From`,filterMax:`Max`,filterMin:`Min`,filterTo:`To`,firstPage:`First page`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hideColumn:`Hide column`,hidePassword:`Hide password`,hour:`Hour`,incompleteDate:`Enter a valid date.`,increment:`Increment`,jumpBackwardX:e=>`Jump back ${e} pages`,jumpForwardX:e=>`Jump forward ${e} pages`,lastPage:`Last page`,loading:`Loading`,minute:`Minute`,month:`Month`,moreOptions:`More Options`,mute:`Mute`,nextDecade:`Next decade`,nextMonth:`Next month`,nextPage:`Next page`,nextSlide:`Next slide`,nextVideo:`Next Video`,nextYear:`Next year`,noData:`No data`,noResults:`No matching results`,now:`Now`,numCharacters:e=>e===1?`1 character`:`${e} characters`,numCharactersRemaining:e=>e===1?`1 character remaining`:`${e} characters remaining`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,numRowsCopied:e=>e===1?`1 row copied`:`${e} rows copied`,numRowsSelected:e=>e===1?`1 row selected`:`${e} rows selected`,pageXOfY:(e,t)=>`Page ${e} of ${t}`,pagination:`Pagination`,pause:`Pause`,pauseAnimation:`Pause animation`,pictureInPicture:`Picture in picture`,pinLeft:`Pin left`,pinRight:`Pin right`,play:`Play`,playAnimation:`Play animation`,playbackSpeed:`Playback speed`,playlist:`Playlist`,pm:`PM`,previousDecade:`Previous decade`,previousMonth:`Previous month`,previousPage:`Previous page`,previousSlide:`Previous slide`,previousVideo:`Previous video`,previousYear:`Previous year`,progress:`Progress`,rangeTooLong:e=>e===1?`Select a range no longer than 1 day`:`Select a range no longer than ${e} days`,rangeTooShort:e=>e===1?`Select a range at least 1 day long`:`Select a range at least ${e} days long`,readonly:`Read-only`,remove:`Remove`,resetColumns:`Reset columns`,resize:`Resize`,resizeColumn:`Resize column`,rowsPerPage:`Rows per page`,scrollableRegion:`Scrollable region`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,search:`Search`,second:`Second`,seek:`Seek`,seekProgress:(e,t)=>`${e} of ${t}`,selectAColorFromTheScreen:`Select a color from the screen`,selectAllRows:`Select all rows`,selected:`Selected`,selectedDateLabel:e=>`Selected: ${e}`,selectedRangeLabel:e=>`Selected range: ${e}`,selectGroup:`Select group`,selectionCleared:`Selection cleared`,selectRow:`Select row`,showingNofMRows:(e,t)=>`Showing ${e} of ${t} rows`,showingXtoYofZ:(e,t,n)=>`${e}\u2013${t} of ${n}`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,sortAscending:`Sort ascending`,sortColumn:`Sort column`,sortDescending:`Sort descending`,startDate:`Start date`,tagAdded:e=>`${e} added`,tagAlreadyAdded:e=>`${e} is already added`,tagInputKeyboardHelp:`Press Backspace or Delete to remove this tag.`,tagRemoved:e=>`${e} removed`,time:`Time`,timeInputKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the time picker.`,today:`Today`,toggleColorFormat:`Toggle color format`,tooFewTags:e=>e===1?`Add at least 1 tag`:`Add at least ${e} tags`,tooManyTags:e=>e===1?`Add no more than 1 tag`:`Add no more than ${e} tags`,unmute:`Unmute`,unpin:`Unpin`,unpinColumn:`Unpin column`,videoPlayer:`Video player`,volume:`Volume`,year:`Year`,zoomIn:`Zoom in`,zoomOut:`Zoom out`},wf(Pf),Ff=Pf})))()}var Lf;function Rf(){return(Rf=e((()=>{If(),Nf(),Lf=class extends Mf{lang(){return this.host.didSSR&&!this.host.hasUpdated?this.host.lang||`en`:super.lang()}},wf(Ff)})))()}function zf(e){return Vf(e)}function Bf(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Vf(e){for(let t=e;t;t=Bf(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Bf(e);t;t=Bf(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||Vs(e)||t.tagName===`BODY`))return t}return null}function Hf(){return(Hf=e((()=>{tc()})))()}function Uf(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e instanceof Element:!0)}var Wf,Y;function Gf(){return(Gf=e((()=>{sf(),lf(),J(),Rf(),_f(),zc(),Hf(),y(),C(),x(),Wf=!!globalThis?.HTMLElement?.prototype.hasOwnProperty(`popover`),Y=class extends Cf{constructor(){super(...arguments),this.localize=new Lf(this),this.SUPPORTS_POPOVER=!1,this.active=!1,this.placement=`top`,this.boundary=`viewport`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl&&this.popup){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.SUPPORTS_POPOVER=Wf,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor==`string`){let e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchorEl=this.anchor instanceof Element||Uf(this.anchor)?this.anchor:this.querySelector(`[slot="anchor"]`);this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.start()}start(){if(!this.anchorEl||!this.active||!this.isConnected)return;this.cleanup?.(),this.cleanup=void 0,this.popup?.showPopover?.();let e=Ec(this.anchorEl,this.popup,()=>{this.reposition()});if(!this.active||!this.isConnected){e();return}this.cleanup=e}async stop(){return new Promise(e=>{this.popup?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl||!this.popup)return;let e=[jc({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(Pc({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``);let t;this.SUPPORTS_POPOVER&&!Uf(this.anchor)&&this.boundary===`scroll`&&(t=Ys(this.anchorEl).filter(e=>e instanceof Element)),this.flip&&e.push(Nc({boundary:this.flipBoundary||t,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(Mc({boundary:this.shiftBoundary||t,padding:this.shiftPadding})),this.autoSize?e.push(Pc({boundary:this.autoSizeBoundary||t,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(Ic({element:this.arrowEl,padding:this.arrowPadding}));let n=this.SUPPORTS_POPOVER?e=>Ac.getOffsetParent(e,zf):Ac.getOffsetParent;Rc(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.SUPPORTS_POPOVER?`absolute`:`fixed`,platform:{...Ac,getOffsetParent:n}}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-base-offset) - var(--arrow-size-diagonal))`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new of)}render(){return p`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${m({"popup-hover-bridge":!0,"popup-hover-bridge-visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        popover="manual"
        part="popup"
        class=${m({popup:!0,"popup-active":this.active,"popup-fixed":!this.SUPPORTS_POPOVER,"popup-has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?p`<div part="arrow" class="arrow" role="presentation"></div>`:``}
      </div>
    `}},Y.css=cf,q([h(`.popup`)],Y.prototype,`popup`,2),q([h(`.arrow`)],Y.prototype,`arrowEl`,2),q([g({attribute:!1,type:Boolean})],Y.prototype,`SUPPORTS_POPOVER`,2),q([g()],Y.prototype,`anchor`,2),q([g({type:Boolean,reflect:!0})],Y.prototype,`active`,2),q([g({reflect:!0})],Y.prototype,`placement`,2),q([g()],Y.prototype,`boundary`,2),q([g({type:Number})],Y.prototype,`distance`,2),q([g({type:Number})],Y.prototype,`skidding`,2),q([g({type:Boolean})],Y.prototype,`arrow`,2),q([g({attribute:`arrow-placement`})],Y.prototype,`arrowPlacement`,2),q([g({attribute:`arrow-padding`,type:Number})],Y.prototype,`arrowPadding`,2),q([g({type:Boolean})],Y.prototype,`flip`,2),q([g({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],Y.prototype,`flipFallbackPlacements`,2),q([g({attribute:`flip-fallback-strategy`})],Y.prototype,`flipFallbackStrategy`,2),q([g({type:Object})],Y.prototype,`flipBoundary`,2),q([g({attribute:`flip-padding`,type:Number})],Y.prototype,`flipPadding`,2),q([g({type:Boolean})],Y.prototype,`shift`,2),q([g({type:Object})],Y.prototype,`shiftBoundary`,2),q([g({attribute:`shift-padding`,type:Number})],Y.prototype,`shiftPadding`,2),q([g({attribute:`auto-size`})],Y.prototype,`autoSize`,2),q([g()],Y.prototype,`sync`,2),q([g({type:Object})],Y.prototype,`autoSizeBoundary`,2),q([g({attribute:`auto-size-padding`,type:Number})],Y.prototype,`autoSizePadding`,2),q([g({attribute:`hover-bridge`,type:Boolean})],Y.prototype,`hoverBridge`,2),Y=q([w(`wa-popup`)],Y)})))()}function Kf(){return(Kf=e((()=>{Gf(),lf(),J(),Rf(),If()})))()}var qf;function Jf(){return(Jf=e((()=>{qf=class extends Event{constructor(e){super(`wa-select`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}function*Yf(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*Yf(e.shadowRoot.activeElement)))}var Xf;function Zf(){return(Zf=e((()=>{y(),Xf=v`
  :host {
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);
    display: contents;
  }

  #menu {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;
    overflow: auto;
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;

    &.show {
      animation: show var(--show-duration) ease;
    }

    &.hide {
      animation: show var(--hide-duration) ease reverse;
    }

    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      display: block !important;
      margin: 0.25em 0 !important;
      padding: 0.25em 0.75em !important;
      color: var(--wa-color-text-quiet);
      font-family: var(--wa-font-family-body) !important;
      font-weight: var(--wa-font-weight-semibold) !important;
      font-size: var(--wa-font-size-smaller) !important;
    }

    ::slotted(wa-divider) {
      --spacing: 0.25em; /* Component-specific, left as-is */
    }
  }

  wa-popup[data-current-placement^='top'] #menu {
    transform-origin: bottom;
  }

  wa-popup[data-current-placement^='bottom'] #menu {
    transform-origin: top;
  }

  wa-popup[data-current-placement^='left'] #menu {
    transform-origin: right;
  }

  wa-popup[data-current-placement^='right'] #menu {
    transform-origin: left;
  }

  wa-popup[data-current-placement='left-start'] #menu {
    transform-origin: right top;
  }

  wa-popup[data-current-placement='left-end'] #menu {
    transform-origin: right bottom;
  }

  wa-popup[data-current-placement='right-start'] #menu {
    transform-origin: left top;
  }

  wa-popup[data-current-placement='right-end'] #menu {
    transform-origin: left bottom;
  }

  @keyframes show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var Qf;function $f(){return($f=e((()=>{Qf=class extends Event{constructor(){super(`wa-show`,{bubbles:!0,cancelable:!0,composed:!0})}}})))()}var ep;function tp(){return(tp=e((()=>{ep=class extends Event{constructor(e){super(`wa-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}var np;function rp(){return(rp=e((()=>{np=class extends Event{constructor(){super(`wa-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var ip;function ap(){return(ap=e((()=>{ip=class extends Event{constructor(){super(`wa-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}function op(e){sp(e),lp.push(e)}function sp(e){for(let t=lp.length-1;t>=0;t--)if(lp[t]===e){lp.splice(t,1);break}}function cp(e){return lp.length>0&&lp[lp.length-1]===e}var lp;function up(){return(up=e((()=>{lp=[]})))()}function dp(e=``){return`${e}${ne()}`}function fp(){return(fp=e((()=>{re()})))()}function pp(e,t){t in mp&&!hp.has(`${e}:${t}`)&&(hp.add(`${e}:${t}`),console.warn(`[${e}] size="${t}" is deprecated. Use size="${mp[t]}" instead. The long-form value will be removed in the next major version.`))}var mp,hp;function gp(){return(gp=e((()=>{mp={small:`s`,medium:`m`,large:`l`},hp=new Set})))()}var _p;function vp(){return(vp=e((()=>{y(),_p=v`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`})))()}async function yp(e,t){e.getAnimations(),e.classList.add(t),await new Promise(e=>requestAnimationFrame(()=>e()));let n=e.getAnimations().filter(e=>e instanceof CSSAnimation&&e.effect?.getComputedTiming().endTime!==1/0);await Promise.allSettled(n.map(e=>e.finished)),e.classList.remove(t)}function bp(){return(bp=e((()=>{})))()}function xp(e,t){let n={waitUntilFirstUpdate:!1,...t};return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}function Sp(){return(Sp=e((()=>{})))()}var Cp,X;function wp(){return(wp=e((()=>{Jf(),Zf(),$f(),tp(),rp(),ap(),up(),fp(),gp(),vp(),J(),Rf(),_f(),zc(),y(),C(),Cp=new Set,X=class extends Cf{constructor(){super(...arguments),this.localize=new Lf(this),this.userTypedQuery=``,this.activeSubmenus=[],this.open=!1,this.size=`m`,this.placement=`bottom-start`,this.distance=0,this.skidding=0,this.handleDocumentKeyDown=e=>{let t=this.localize.dir()===`rtl`;if(e.key===`Escape`&&this.open&&cp(this)){let t=this.getTrigger();e.preventDefault(),e.stopPropagation(),this.open=!1,t?.focus({preventScroll:!0});return}let n=[...Yf()].find(e=>e.localName===`wa-dropdown-item`),r=this.getCurrentSubmenuItem(),i=r?this.getSubmenuItems(r):this.getItems(),a=i.find(e=>e===n)??(n?void 0:i.find(e=>e.active)),o=a?i.indexOf(a):-1,s;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),s=o>0?i[o-1]:i[i.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),s=o!==-1&&o<i.length-1?i[o+1]:i[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&n&&a&&a.hasSubmenu){e.preventDefault(),e.stopPropagation(),a.submenuOpen=!0;return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&r){e.preventDefault(),e.stopPropagation(),r.closeSubmenu(),r.focus({preventScroll:!0});let t=this.getCurrentSubmenuItem();(t?this.getSubmenuItems(t,!0):this.getItems(!0)).forEach(e=>e.active=e===r);return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),s=e.key===`Home`?i[0]:i[i.length-1]),e.key===`Tab`&&(this.open=!1),e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)&&(clearTimeout(this.userTypedTimeout),this.userTypedTimeout=setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key,i.some(e=>{let t=(e.textContent||``).trim().toLowerCase(),n=this.userTypedQuery.trim().toLowerCase();return t.startsWith(n)?(s=e,!0):!1})),s){e.preventDefault(),e.stopPropagation(),i.forEach(e=>e.active=e===s),s.focus({preventScroll:!0}),s.scrollIntoView({block:`nearest`});return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&n&&a&&(e.preventDefault(),e.stopPropagation(),a.hasSubmenu?a.submenuOpen=!0:this.makeSelection(a,e))},this.handleDocumentPointerDown=e=>{e.composedPath().some(e=>e instanceof HTMLElement?e===this||e.closest(`wa-dropdown, [part="submenu"]`):!1)||(this.open=!1)},this.handleGlobalMouseMove=e=>{let t=this.activeSubmenus.at(-1),n=t?.item;if(!n?.submenuOpen||!n.submenuElement)return;let r=n.submenuElement.getBoundingClientRect(),i=this.localize.dir()===`rtl`,a=i?r.right:r.left,o=i?Math.max(e.clientX,a):Math.min(e.clientX,a),s=Math.max(r.top,Math.min(e.clientY,r.bottom));n.submenuElement.style.setProperty(`--safe-triangle-cursor-x`,`${o}px`),n.submenuElement.style.setProperty(`--safe-triangle-cursor-y`,`${s}px`);let c=e.composedPath(),l=n.matches(`:hover`),u=!!n.submenuElement?.matches(`:hover`),d=l||!!c.find(e=>e===n),f=u||!!c.find(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===n.submenuElement);!d&&!f&&setTimeout(()=>{this.activeSubmenus.includes(t)&&!n.matches(`:hover`)&&!n.submenuElement.matches(`:hover`)&&(n.submenuOpen=!1)},100)}}handleSizeChange(){pp(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.open&&this.updateMenuVisibility(!0)}disconnectedCallback(){super.disconnectedCallback(),this.menuTransition?.abort(),this.menu?.classList.remove(`show`,`hide`),this.popup&&(this.popup.active=!1),Cp.delete(this),clearInterval(this.userTypedTimeout),this.closeAllSubmenus(),sp(this)}firstUpdated(e){super.firstUpdated(e),this.syncAriaAttributes()}async updated(e){if(e.has(`open`)){let t=e.get(`open`);if(t===this.open||t===void 0&&this.open===!1)return;this.customStates.set(`open`,this.open),await this.updateMenuVisibility(this.open)}e.has(`size`)&&this.syncItemSizes()}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=e.shadowRoot?.querySelector(`slot[name="submenu"]`)||e.querySelector(`slot[name="submenu"]`);if(!n)return[];let r=n.assignedElements({flatten:!0}).filter(e=>e.localName===`wa-dropdown-item`);return t?r:r.filter(e=>!e.disabled)}syncItemSizes(){(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`).forEach(e=>e.size=this.size)}getCurrentSubmenuItem(){return this.activeSubmenus.at(-1)?.item}closeAllSubmenus(e=0){for(let{item:t,cleanup:n}of this.activeSubmenus.splice(e).reverse())n(),t.closeSubmenu()}getTrigger(){return this.querySelector(`[slot="trigger"]`)}async updateMenuVisibility(e){if(!this.isConnected||!this.popup||!this.menu||e&&!this.getTrigger())return;let t=e?new Qf:new ep({source:this});if(this.dispatchEvent(t),t.defaultPrevented){this.open=!e;return}if(!this.isConnected||this.open!==e||e&&Cp.has(this))return;this.menuTransition?.abort(),this.menuTransition=new AbortController;let{signal:n}=this.menuTransition,r=()=>!n.aborted&&this.isConnected&&this.open===e;e?(Cp.forEach(e=>e.open=!1),this.popup.active=!0,Cp.add(this),op(this),document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:n}),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,{signal:n}),document.addEventListener(`mousemove`,this.handleGlobalMouseMove,{signal:n})):(this.closeAllSubmenus(),Cp.delete(this),sp(this)),this.syncAriaAttributes(),this.menu.classList.remove(`show`,`hide`);let i=[...Yf()].pop();if(await this.menuAnimation,r()){if(this.menuAnimation=yp(this.menu,e?`show`:`hide`),e){if(await this.popup.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e())),!r())return;let e=this.getCurrentSubmenuItem(),t=e?this.getSubmenuItems(e,!0):this.getItems(!0),n=this.defaultSlot.assignedElements({flatten:!0}),a=e=>e instanceof HTMLElement&&e.closest(`wa-dropdown`)===this&&!e.matches(`:disabled, [disabled]`)&&n.some(t=>t.contains(e)),o=[...Yf()].find(a),s=o?void 0:[...this.querySelectorAll(`[autofocus]`)].find(e=>a(e)&&e.getClientRects().length>0),c=o??s??t.find(e=>!e.disabled);if(c&&(o||[...Yf()].pop()===i)&&(t.forEach(e=>e.active=e===c),c.localName===`wa-dropdown-item`&&(c.active=!0),o||c.focus({preventScroll:!0}),c.autofocus&&c.scrollIntoView({block:`nearest`})),!r())return}await this.menuAnimation,r()&&(e?this.dispatchEvent(new ip):(this.popup.active=!1,this.dispatchEvent(new np)))}}handleMenuClick(e){let t=e.target.closest(`wa-dropdown-item`);if(t&&!t.disabled){if(t.hasSubmenu){t.submenuOpen||=!0,e.stopPropagation();return}this.makeSelection(t,e)}}async handleMenuSlotChange(){let e=this.getItems(!0);await Promise.all(e.map(e=>e.updateComplete)),this.syncItemSizes();let t=e.some(e=>e.type===`checkbox`),n=e.some(e=>e.hasSubmenu);e.forEach((r,i)=>{r.setAttribute(`aria-posinset`,String(i+1)),r.setAttribute(`aria-setsize`,String(e.length)),r.active=i===0,r.checkboxAdjacent=t,r.submenuAdjacent=n})}handleTriggerClick(){this.open=!this.open}handleSubmenuOpening(e){e.stopPropagation();let t=e.composedPath(),n=t.slice(0,t.indexOf(this)).filter(e=>e instanceof HTMLElement&&e.localName===`wa-dropdown-item`).reverse();if(n.some(e=>!e.submenuOpen)){e.detail.item.closeSubmenu();return}let r=0;for(;r<n.length&&this.activeSubmenus[r]?.item===n[r];)r++;if(r!==n.length){this.closeAllSubmenus(r);for(let e of n.slice(r))this.activeSubmenus.push({item:e,cleanup:this.setupSubmenuPosition(e)})}}setupSubmenuPosition(e){let t=new AbortController,{signal:n}=t,r=Ec(e,e.submenuElement,()=>{this.positionSubmenu(e,()=>!n.aborted),this.updateSafeTriangleCoordinates(e)});return e.addEventListener(`submenu-closing`,()=>{let t=this.activeSubmenus.findIndex(t=>t.item===e);t!==-1&&this.closeAllSubmenus(t)},{signal:n}),e.submenuElement.querySelector(`slot[name="submenu"]`)?.addEventListener(`slotchange`,()=>this.processSubmenuItems(e),{signal:n}),this.processSubmenuItems(e),()=>{t.abort(),r()}}processSubmenuItems(e){let t=this.getSubmenuItems(e,!0),n=t.some(e=>e.hasSubmenu),r=t.some(e=>e.type===`checkbox`);t.forEach(e=>{e.submenuAdjacent=n,e.checkboxAdjacent=r})}positionSubmenu(e,t){if(!e.submenuElement)return;let n=this.localize.dir()===`rtl`?`left-start`:`right-start`;Rc(e,e.submenuElement,{placement:n,middleware:[jc({mainAxis:0,crossAxis:-5}),Nc({fallbackStrategy:`bestFit`}),Mc({padding:8,crossAxis:!0})]}).then(({x:n,y:r,placement:i})=>{t()&&(e.submenuElement.setAttribute(`data-placement`,i),Object.assign(e.submenuElement.style,{left:`${n}px`,top:`${r}px`}))})}updateSafeTriangleCoordinates(e){if(!e.submenuElement||!e.submenuOpen)return;if(document.activeElement?.matches(`:focus-visible`)){e.submenuElement.style.setProperty(`--safe-triangle-visible`,`none`);return}e.submenuElement.style.setProperty(`--safe-triangle-visible`,`block`);let t=e.submenuElement.getBoundingClientRect(),n=this.localize.dir()===`rtl`;e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-y`,`${t.top}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-y`,`${t.bottom}px`)}makeSelection(e,t){let n=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked);let r=new qf({item:e});this.dispatchEvent(r),r.defaultPrevented||(e.navigate(t),this.open=!1,n?.focus({preventScroll:!0}))}async syncAriaAttributes(){let e=this.getTrigger(),t;e&&(e.localName===`wa-button`?(await customElements.whenDefined(`wa-button`),await e.updateComplete,t=e.shadowRoot.querySelector(`[part~="base"]`)):t=e,t.hasAttribute(`id`)||t.setAttribute(`id`,dp(`wa-dropdown-trigger-`)),t.setAttribute(`aria-haspopup`,`menu`),t.setAttribute(`aria-expanded`,this.open?`true`:`false`),this.menu?.setAttribute(`aria-expanded`,`false`))}render(){let e=this.didSSR&&!this.hasUpdated?this.open:this.popup?.active;return p`
      <wa-popup
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        ?active=${e}
        flip
        flip-fallback-strategy="best-fit"
        shift
        shift-padding="10"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot
          name="trigger"
          slot="anchor"
          @click=${this.handleTriggerClick}
          @slotchange=${this.syncAriaAttributes}
        ></slot>
        <div
          id="menu"
          part="menu"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          @click=${this.handleMenuClick}
          @submenu-opening=${this.handleSubmenuOpening}
        >
          <slot @slotchange=${this.handleMenuSlotChange}></slot>
        </div>
      </wa-popup>
    `}},X.css=[_p,Xf],q([h(`slot:not([name])`)],X.prototype,`defaultSlot`,2),q([h(`#menu`)],X.prototype,`menu`,2),q([h(`wa-popup`)],X.prototype,`popup`,2),q([g({type:Boolean,reflect:!0})],X.prototype,`open`,2),q([g({reflect:!0})],X.prototype,`size`,2),q([xp(`size`)],X.prototype,`handleSizeChange`,1),q([g({reflect:!0})],X.prototype,`placement`,2),q([g({type:Number})],X.prototype,`distance`,2),q([g({type:Number})],X.prototype,`skidding`,2),X=q([w(`wa-dropdown`)],X)})))()}var Tp;function Ep(){return(Ep=e((()=>{y(),Tp=v`
  :host {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0.5em 1em;
    border-radius: var(--wa-border-radius-s);
    isolation: isolate;
    color: var(--wa-color-text-normal);
    line-height: var(--wa-line-height-condensed);
    cursor: pointer;
    transition:
      var(--wa-transition-fast) background-color var(--wa-transition-easing),
      var(--wa-transition-fast) color var(--wa-transition-easing);
  }

  @media (hover: hover) {
    :host(:hover:not(:state(disabled))) {
      background-color: var(--wa-color-neutral-fill-normal);
    }
  }

  :host(:state(submenu-open)) {
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:focus-visible) {
    z-index: 1;
    outline: var(--wa-focus-ring);
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:state(disabled)),
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Danger variant */
  :host([variant='danger']),
  :host([variant='danger']) #details {
    color: var(--wa-color-danger-on-quiet);
  }

  @media (hover: hover) {
    :host([variant='danger']:hover) {
      background-color: var(--wa-color-danger-fill-normal);
      color: var(--wa-color-danger-on-normal);
    }
  }

  :host([variant='danger']:state(submenu-open)),
  :host([variant='danger']:focus-visible) {
    background-color: var(--wa-color-danger-fill-normal);
    color: var(--wa-color-danger-on-normal);
  }

  :host([checkbox-adjacent]) {
    padding-inline-start: 2em;
  }

  /* Only add padding when item actually has a submenu */
  :host([submenu-adjacent]:not(:state(has-submenu))) #details {
    padding-inline-end: 0;
  }

  :host(:state(has-submenu)[submenu-adjacent]) #details {
    padding-inline-end: 1.75em;
  }

  /* The link only exists to be clicked programmatically. */
  #link {
    display: none;
  }

  #check {
    visibility: hidden;
    margin-inline-start: -1.5em;
    margin-inline-end: 0.5em;
    font-size: var(--wa-font-size-smaller);
  }

  :host(:state(checked)) #check {
    visibility: visible;
  }

  #icon ::slotted(*) {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-end: 0.75em !important;
    font-size: var(--wa-font-size-smaller);
  }

  #label {
    flex: 1 1 auto;
    min-width: 0;
  }

  #details {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: end;
    color: var(--wa-color-text-quiet);
    font-size: var(--wa-font-size-smaller) !important;
  }

  #details ::slotted(*) {
    margin-inline-start: 2em !important;
  }

  /* Submenu indicator icon */
  #submenu-indicator {
    position: absolute;
    inset-inline-end: 1em;
    color: var(--wa-color-neutral-on-quiet);
    font-size: var(--wa-font-size-smaller);
  }

  /* Flip chevron icon when RTL */
  :host(:dir(rtl)) #submenu-indicator {
    transform: scaleX(-1);
  }

  /* Submenu styles */
  #submenu {
    display: flex;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;

    /* Override default popover styles */
    &[popover] {
      margin: 0;
      inset: auto;
      padding: 0.25em;
      overflow: visible;
      border-radius: var(--wa-border-radius-m);
    }

    &.show {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease;
    }

    &.hide {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease reverse;
    }

    /* Submenu placement transform origins */
    &[data-placement^='top'] {
      transform-origin: bottom;
    }

    &[data-placement^='bottom'] {
      transform-origin: top;
    }

    &[data-placement^='left'] {
      transform-origin: right;
    }

    &[data-placement^='right'] {
      transform-origin: left;
    }

    &[data-placement='left-start'] {
      transform-origin: right top;
    }

    &[data-placement='left-end'] {
      transform-origin: right bottom;
    }

    &[data-placement='right-start'] {
      transform-origin: left top;
    }

    &[data-placement='right-end'] {
      transform-origin: left bottom;
    }

    /* Safe triangle styling */
    &::before {
      display: none;
      z-index: 9;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      content: '';
      clip-path: polygon(
        var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
        var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
        var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
      );
      pointer-events: auto; /* Enable mouse events on the triangle */
    }

    &[data-visible]::before {
      display: block;
    }
  }

  ::slotted(wa-dropdown-item) {
    font-size: inherit;
  }

  ::slotted(wa-divider) {
    --spacing: 0.25em;
  }

  @keyframes submenu-show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var Dp;function Op(){return(Op=e((()=>{Dp=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return this.host.childNodes?[...this.host.childNodes].some(e=>{if(e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===Node.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`wa-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1}):!1}hasNamedSlot(e){return this.host.querySelector?.(`:scope > [slot="${e}"]`)!==null}test(e,t){return t&&this.host.didSSR&&!this.host.hasUpdated?!!this.host[t]:e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){let e=this.host.shadowRoot;e&&`addEventListener`in e&&e.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){let e=this.host.shadowRoot;e&&`removeEventListener`in e&&e.removeEventListener(`slotchange`,this.handleSlotChange)}}})))()}var Z;function kp(){return(kp=e((()=>{Ep(),Op(),gp(),J(),_f(),y(),C(),S(),Z=class extends Cf{constructor(){super(...arguments),this.hasSlotController=new Dp(this,`[default]`,`start`,`end`),this.submenuGeneration=0,this.active=!1,this.variant=`default`,this.size=`m`,this.checkboxAdjacent=!1,this.submenuAdjacent=!1,this.type=`normal`,this.checked=!1,this.disabled=!1,this.submenuOpen=!1,this.hasSubmenu=!1,this.handleSlotChange=()=>{let e=this.hasSlotController.test(`submenu`);e||this.closeSubmenu(),this.hasSubmenu=e,this.updateHasSubmenuState(),this.hasSubmenu?(this.setAttribute(`aria-haspopup`,`menu`),this.setAttribute(`aria-expanded`,this.submenuOpen?`true`:`false`)):(this.removeAttribute(`aria-haspopup`),this.removeAttribute(`aria-expanded`))},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handlePointerEnter=e=>{e.pointerType===`mouse`&&this.hasSubmenu&&!this.disabled&&(this.submenuOpen=!0)}}handleSizeChange(){pp(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.addEventListener?.(`click`,this.handleHostClick),this.addEventListener?.(`pointerenter`,this.handlePointerEnter),this.shadowRoot?.addEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.addEventListener?.(`slotchange`,this.handleSlotChange)}disconnectedCallback(){super.disconnectedCallback(),this.submenuGeneration++,this.closeSubmenu();let e=this.submenuElement;e&&(e.classList.remove(`show`,`hide`),e.hidden=!0,e.removeAttribute(`data-visible`),e.hidePopover?.()),this.removeEventListener?.(`click`,this.handleHostClick),this.removeEventListener?.(`pointerenter`,this.handlePointerEnter),this.shadowRoot?.removeEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.removeEventListener?.(`slotchange`,this.handleSlotChange)}firstUpdated(e){super.firstUpdated(e),this.setAttribute(`tabindex`,`-1`),this.hasSubmenu=this.hasSlotController.test(`submenu`),this.updateHasSubmenuState()}updated(e){if(e.has(`active`)&&(this.setAttribute(`tabindex`,this.active?`0`:`-1`),this.customStates.set(`active`,this.active)),e.has(`checked`)&&(this.type===`checkbox`?this.setAttribute(`aria-checked`,this.checked?`true`:`false`):this.removeAttribute(`aria-checked`),this.customStates.set(`checked`,this.checked)),e.has(`disabled`)&&(this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.customStates.set(`disabled`,this.disabled)),e.has(`type`)&&(this.type===`checkbox`?(this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`)):(this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`))),(e.has(`href`)||e.has(`hasSubmenu`))&&this.customStates.set(`link`,this.isLink()),e.has(`submenuOpen`)){this.customStates.set(`submenu-open`,this.submenuOpen);let e=this.submenuAnimation;this.submenuAnimation=this.updateSubmenuVisibility(e)}}updateHasSubmenuState(){this.customStates.set(`has-submenu`,this.hasSubmenu)}async openSubmenu(){if(this.hasSubmenu&&this.submenuElement&&this.isConnected)return this.submenuOpen=!0,await this.updateComplete,this.submenuAnimation}async updateSubmenuVisibility(e){let t=this.submenuElement;if(this.submenuOpen||this.dispatchEvent(new Event(`submenu-closing`)),!this.hasSubmenu||!t||!this.isConnected){await e;return}let n=this.submenuOpen,r=++this.submenuGeneration,i=()=>r===this.submenuGeneration&&this.isConnected&&this.submenuOpen===n;if(t.classList.remove(`show`,`hide`),n){if(this.notifyParentOfOpening(),!i())return;t.showPopover?.(),t.hidden=!1,t.setAttribute(`data-visible`,``)}if(this.setAttribute(`aria-expanded`,String(n)),await e,await this.updateComplete,i()){if(n){let e=this.getSubmenuItems();e.forEach((e,t)=>e.active=t===0),e[0]?.focus({preventScroll:!0})}await yp(t,n?`show`:`hide`),i()&&(n||(t.hidden=!0,t.removeAttribute(`data-visible`),t.hidePopover?.()))}}notifyParentOfOpening(){let e=new CustomEvent(`submenu-opening`,{bubbles:!0,composed:!0,detail:{item:this}});this.dispatchEvent(e)}async closeSubmenu(){if(this.hasSubmenu&&this.submenuElement)return this.submenuOpen=!1,this.dispatchEvent(new Event(`submenu-closing`)),await this.updateComplete,this.submenuAnimation}isLink(){return!!this.href&&!this.hasSubmenu}navigate(e){let t=this.linkElement;this.isLink()&&!this.disabled&&t&&t.dispatchEvent(new MouseEvent(`click`,{bubbles:!1,cancelable:!0,composed:!1,altKey:e?.altKey??!1,ctrlKey:e?.ctrlKey??!1,metaKey:e?.metaKey??!1,shiftKey:e?.shiftKey??!1}))}getSubmenuItems(){return((this.submenuElement?.querySelector(`slot[name="submenu"]`))?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`&&!e.disabled)}render(){return p`
      ${this.href?p`
            <a
              id="link"
              href=${this.href}
              target=${b(this.target)}
              rel=${b(this.rel)}
              download=${b(this.download)}
              tabindex="-1"
              aria-hidden="true"
            ></a>
          `:``}
      ${this.type===`checkbox`?p`
            <wa-icon
              id="check"
              part="checkmark"
              exportparts="svg:checkmark__svg"
              library="system"
              name="check"
            ></wa-icon>
          `:``}

      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>

      <span id="label" part="label">
        <slot></slot>
      </span>

      <span id="details" part="details">
        <slot name="details"></slot>
      </span>

      ${this.hasSubmenu?p`
            <wa-icon
              id="submenu-indicator"
              part="submenu-icon"
              exportparts="svg:submenu-icon__svg"
              library="system"
              name="chevron-right"
            ></wa-icon>
          `:``}
      ${this.hasSubmenu?p`
            <div
              id="submenu"
              part="submenu"
              popover="manual"
              role="menu"
              tabindex="-1"
              aria-orientation="vertical"
              hidden
            >
              <slot name="submenu"></slot>
            </div>
          `:p`<slot name="submenu" hidden></slot>`}
    `}},Z.css=Tp,q([h(`#submenu`)],Z.prototype,`submenuElement`,2),q([h(`#link`)],Z.prototype,`linkElement`,2),q([g({type:Boolean})],Z.prototype,`active`,2),q([g({reflect:!0})],Z.prototype,`variant`,2),q([g({reflect:!0})],Z.prototype,`size`,2),q([xp(`size`)],Z.prototype,`handleSizeChange`,1),q([g({attribute:`checkbox-adjacent`,type:Boolean,reflect:!0})],Z.prototype,`checkboxAdjacent`,2),q([g({attribute:`submenu-adjacent`,type:Boolean,reflect:!0})],Z.prototype,`submenuAdjacent`,2),q([g()],Z.prototype,`value`,2),q([g({reflect:!0})],Z.prototype,`type`,2),q([g({type:Boolean})],Z.prototype,`checked`,2),q([g({type:Boolean,reflect:!0})],Z.prototype,`disabled`,2),q([g({type:Boolean,reflect:!0})],Z.prototype,`submenuOpen`,2),q([g({reflect:!0})],Z.prototype,`href`,2),q([g()],Z.prototype,`target`,2),q([g()],Z.prototype,`rel`,2),q([g()],Z.prototype,`download`,2),q([_()],Z.prototype,`hasSubmenu`,2),Z=q([w(`wa-dropdown-item`)],Z)})))()}var Ap;function jp(){return(jp=e((()=>{Ap=class extends Event{constructor(){super(`wa-error`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Mp;function Np(){return(Np=e((()=>{Mp=class extends Event{constructor(){super(`wa-load`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Pp;function Fp(){return(Fp=e((()=>{y(),Pp=v`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    /* NOTE: Avoid setting fill here. A stylesheet rule beats SVG presentation attributes, breaking stroke-based
       libraries like Lucide (fill="none" stroke="currentColor") and attribute-based mutators (issue #1733). The default
       library applies fill="currentColor" in its mutator instead. */
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`})))()}function Ip(){return zp.replace(/\/$/,``)}function Lp(e){Bp=e}function Rp(){if(!Bp){let e=document.querySelector(`[data-fa-kit-code]`);e&&Lp(e.getAttribute(`data-fa-kit-code`)||``)}return Bp}var zp,Bp;function Vp(){return(Vp=e((()=>{zp=``,Bp=``})))()}function Hp(e,t,n){let r=`solid`;return t===`chisel`&&(r=`chisel-regular`),t===`etch`&&(r=`etch-solid`),t===`graphite`&&(r=`graphite-thin`),t===`jelly`&&(r=`jelly-regular`,n===`duo-regular`&&(r=`jelly-duo-regular`),n===`fill-regular`&&(r=`jelly-fill-regular`)),t===`jelly-duo`&&(r=`jelly-duo-regular`),t===`jelly-fill`&&(r=`jelly-fill-regular`),t===`notdog`&&(n===`solid`&&(r=`notdog-solid`),n===`duo-solid`&&(r=`notdog-duo-solid`)),t===`notdog-duo`&&(r=`notdog-duo-solid`),t===`slab`&&((n===`solid`||n===`regular`)&&(r=`slab-regular`),n===`press-regular`&&(r=`slab-press-regular`)),t===`slab-press`&&(r=`slab-press-regular`),t===`slab-duo`&&(r=`slab-duo-regular`),t===`slab-press-duo`&&(r=`slab-press-duo-regular`),t===`thumbprint`&&(r=`thumbprint-light`),t===`utility`&&(r=`utility-semibold`),t===`utility-duo`&&(r=`utility-duo-semibold`),t===`utility-fill`&&(r=`utility-fill-semibold`),t===`whiteboard`&&(r=`whiteboard-semibold`),t===`mosaic`&&(r=`mosaic-solid`),t===`pixel`&&(r=`pixel-regular`),t===`vellum`&&(r=`vellum-solid`),t===`classic`&&(n===`thin`&&(r=`thin`),n===`light`&&(r=`light`),n===`regular`&&(r=`regular`),n===`solid`&&(r=`solid`)),t===`duotone`&&(n===`thin`&&(r=`duotone-thin`),n===`light`&&(r=`duotone-light`),n===`regular`&&(r=`duotone-regular`),n===`solid`&&(r=`duotone`)),t===`sharp`&&(n===`thin`&&(r=`sharp-thin`),n===`light`&&(r=`sharp-light`),n===`regular`&&(r=`sharp-regular`),n===`solid`&&(r=`sharp-solid`)),t===`sharp-duotone`&&(n===`thin`&&(r=`sharp-duotone-thin`),n===`light`&&(r=`sharp-duotone-light`),n===`regular`&&(r=`sharp-duotone-regular`),n===`solid`&&(r=`sharp-duotone-solid`)),t===`brands`&&(r=`brands`),r}function Up(e,t,n){let r=Hp(e,t,n),i=Ip();if(i)return`${i}/${r}/${e}.svg`;let a=Rp();return a.length>0?`https://ka-p.fontawesome.com/releases/v${Wp}/svgs/${r}/${e}.svg?token=${encodeURIComponent(a)}`:`https://ka-f.fontawesome.com/releases/v${Wp}/svgs/${r}/${e}.svg`}var Wp,Gp;function Kp(){return(Kp=e((()=>{Vp(),Wp=`7.3.0`,Gp={name:`default`,resolver:(e,t=`classic`,n=`solid`)=>Up(e,t,n),mutator:(e,t)=>{if(e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`),t?.family&&!e.hasAttribute(`data-duotone-initialized`)){let{family:n,variant:r}=t;if(n===`duotone`||n===`sharp-duotone`||n===`notdog-duo`||n===`notdog`&&r===`duo-solid`||n===`jelly-duo`||n===`jelly`&&r===`duo-regular`||n===`utility-duo`||n===`slab-duo`||n===`slab-press-duo`||n===`thumbprint`){let n=[...e.querySelectorAll(`path`)],r=n.find(e=>!e.hasAttribute(`opacity`)),i=n.find(e=>e.hasAttribute(`opacity`));if(!r||!i)return;if(r.setAttribute(`data-duotone-primary`,``),i.setAttribute(`data-duotone-secondary`,``),t.swapOpacity&&r&&i){let e=i.getAttribute(`opacity`)||`0.4`;r.style.setProperty(`--path-opacity`,e),i.style.setProperty(`--path-opacity`,`1`)}e.setAttribute(`data-duotone-initialized`,``)}}}}})))()}function qp(e){return`data:image/svg+xml,${encodeURIComponent(e)}`}var Jp,Yp;function Xp(){return(Xp=e((()=>{Jp={solid:{"arrow-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`,"arrow-up":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`,backward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>`,"backward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>`,"angles-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M77.3 256 214.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256zm192 0L406.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256z"/></svg>`,"angles-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.7 256 297.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L434.7 256zm-192 0L105.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256z"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,circle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,"closed-captioning":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>`,"closed-captioning-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>`,compress:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>`,ellipsis:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>`,"ellipsis-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`,expand:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>`,eyedropper:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,filter:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"/></svg>`,forward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,"file-audio":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,"file-code":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,"file-excel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,"file-image":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,"file-pdf":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,"file-powerpoint":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,"file-video":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,"file-word":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,"file-zipper":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,"forward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>`,gauge:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,gear:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,indeterminate:`<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,"magnifying-glass":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,minus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,pause:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,"picture-in-picture":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,"play-circle":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>`,plus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,"table-columns":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 128 0 0-256-128 0zm320 0l-128 0 0 256 128 0 0-256z"/></svg>`,thumbtack:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 10.3 134.1c37.1 21.2 65.8 56.4 78.2 99.7l3.8 13.4c2.8 9.7 .8 20-5.2 28.1S362 352 352 352L32 352c-10 0-19.5-4.7-25.5-12.7s-8-18.4-5.2-28.1L5 297.8c12.4-43.3 41-78.5 78.2-99.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 400l64 0 0 112c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-112z"/></svg>`,"up-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M406.6 502.6l96-96c9.2-9.2 11.9-22.9 6.9-34.9S492.9 352 480 352l-64 0 0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 320-64 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l96 96c12.5 12.5 32.8 12.5 45.3 0zM150.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 160 32 160l64 0 0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320 64 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-96-96z"/></svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,user:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,volume:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-low":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,xmark:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`},regular:{calendar:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>`,"circle-question":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,"circle-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,clock:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`}},Yp={name:`system`,resolver:(e,t=`classic`,n=`solid`)=>{let r=Jp[n][e]??Jp.regular[e]??Jp.regular[`circle-question`];return r?qp(r):``},mutator:e=>{e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`)}}})))()}function Zp(e){rm.add(e)}function Qp(e){rm.delete(e)}function $p(e){return nm.find(t=>t.name===e)}function em(){return tm}var tm,nm,rm;function im(){return(im=e((()=>{Kp(),Xp(),tm=`classic`,nm=[Gp,Yp],rm=new Set})))()}var am,om,sm,cm,Q;function lm(){return(lm=e((()=>{jp(),Np(),Fp(),J(),im(),_f(),y(),C(),c(),am=Symbol(),om=Symbol(),cm=new Map,Q=class extends Cf{constructor(){super(...arguments),this.svg=null,this.autoWidth=!1,this.swapOpacity=!1,this.label=``,this.library=`default`,this.rotate=0,this.resolveIcon=async(e,t)=>{let n;if(t?.spriteSheet){this.hasUpdated||await this.updateComplete,this.svg=p`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,await this.updateComplete;let n=this.shadowRoot.querySelector(`[part='svg']`);return typeof t.mutator==`function`&&t.mutator(n,this),this.svg}try{if(n=await fetch(e,{mode:`cors`}),!n.ok)return n.status===410?am:om}catch{return om}try{let e=document.createElement(`div`);e.innerHTML=await n.text();let t=e.firstElementChild;if(t?.tagName?.toLowerCase()!==`svg`)return am;sm||=new DOMParser;let r=sm.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return r?(r.part.add(`svg`),document.adoptNode(r)):am}catch{return am}}}connectedCallback(){super.connectedCallback(),Zp(this)}firstUpdated(e){super.firstUpdated(e),this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`),this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Qp(this)}async getIconSource(){let e=$p(this.library),t=this.family||em();if(this.name&&e){let n=this.canvas===`auto`||this.autoWidth,r;try{r=await e.resolver(this.name,t,this.variant,n)}catch{r=void 0}return{url:r,fromLibrary:!0}}return{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){let{url:e,fromLibrary:t}=await this.getIconSource(),n=t?$p(this.library):void 0;if(!e){this.svg=null;return}let r=cm.get(e);r||(r=this.resolveIcon(e,n),cm.set(e,r));let i=await r;if(i===om&&cm.delete(e),e===(await this.getIconSource()).url){if(d(i)){this.svg=i;return}switch(i){case om:case am:this.svg=null,this.dispatchEvent(new Ap);break;default:this.svg=i.cloneNode(!0),n?.mutator?.(this.svg,this),this.dispatchEvent(new Mp)}}}willUpdate(e){return this.style||this.setStyleProperty(`--rotate-angle`,`${this.rotate}deg`),super.willUpdate(e)}updated(e){super.updated(e);let t=$p(this.library);this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`);let n=this.shadowRoot?.querySelector(`svg`);n&&t?.mutator?.(n,this)}render(){return this.hasUpdated?this.svg:p`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`}},Q.css=Pp,q([_()],Q.prototype,`svg`,2),q([g({reflect:!0})],Q.prototype,`name`,2),q([g({reflect:!0})],Q.prototype,`family`,2),q([g({reflect:!0})],Q.prototype,`variant`,2),q([g({reflect:!0})],Q.prototype,`canvas`,2),q([g({attribute:`auto-width`,type:Boolean,reflect:!0})],Q.prototype,`autoWidth`,2),q([g({attribute:`swap-opacity`,type:Boolean,reflect:!0})],Q.prototype,`swapOpacity`,2),q([g()],Q.prototype,`src`,2),q([g()],Q.prototype,`label`,2),q([g({reflect:!0})],Q.prototype,`library`,2),q([g({type:Number,reflect:!0})],Q.prototype,`rotate`,2),q([g({type:String,reflect:!0})],Q.prototype,`flip`,2),q([g({type:String,reflect:!0})],Q.prototype,`animation`,2),q([xp(`label`)],Q.prototype,`handleLabelChange`,1),q([xp([`family`,`name`,`library`,`variant`,`src`,`autoWidth`,`canvas`,`swapOpacity`],{waitUntilFirstUpdate:!0})],Q.prototype,`setIcon`,1),Q=q([w(`wa-icon`)],Q)})))()}function um(){return(um=e((()=>{wp(),kp(),Ep(),Zf(),Gf(),lf(),vp(),lm(),Fp(),J(),Rf(),If()})))()}function dm(){return(dm=e((()=>{kp(),Ep(),lm(),Fp(),J()})))()}var fm;function pm(){return(pm=e((()=>{y(),fm=v`
  :host {
    --height: var(--wa-form-control-toggle-size);
    --width: calc(var(--height) * 1.75);
    --thumb-size: 0.75em;

    display: inline-flex;
    line-height: var(--wa-form-control-value-line-height);
  }

  label {
    position: relative;
    display: flex;
    align-items: center;
    font: inherit;
    color: var(--wa-form-control-value-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch {
    flex: 0 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--wa-form-control-background-color);
    border-color: var(--wa-form-control-border-color);
    border-radius: var(--height);
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
    transition-property: translate, background, border-color, box-shadow;
    transition-duration: var(--wa-transition-normal);
    transition-timing-function: var(--wa-transition-easing);
  }

  :host([did-ssr]:not(:defined)) .switch {
    transition-property: unset;
    transition-duration: unset;
    transition-timing-function: unset;
  }

  .switch .thumb {
    aspect-ratio: 1 / 1;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--wa-form-control-border-color);
    border-radius: 50%;
    translate: calc((var(--width) - var(--height)) / -2);
    transition: inherit;
  }
  .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / 2);
  }

  .input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Focus */
  label:not(.disabled) .input:focus-visible ~ [part~='control'] {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Checked */
  .checked .switch {
    background-color: var(--wa-form-control-activated-color);
    border-color: var(--wa-form-control-activated-color);
  }

  .checked .switch .thumb {
    background-color: var(--wa-color-surface-default);
    translate: calc((var(--width) - var(--height)) / 2);
  }
  .checked .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / -2);
  }

  /* Disabled */
  label:has(> :disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part~='label'] {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) [part~='label']::after {
    content: var(--wa-form-control-required-content);
    color: var(--wa-form-control-required-content-color);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }

  @media (forced-colors: active) {
    :checked:enabled + .switch:hover .thumb,
    :checked + .switch .thumb {
      background-color: ButtonText;
    }
  }
`})))()}var mm;function hm(){return(hm=e((()=>{y(),mm=v`
  :host {
    display: flex;
    flex-direction: column;
  }

  /* Treat wrapped labels, inputs, and hints as direct children of the host element */
  [part~='form-control'] {
    display: contents;
  }

  /* Label */
  :is([part~='form-control-label'], [part~='label']):has(*:not(:empty)),
  :is([part~='form-control-label'], [part~='label']).has-label {
    display: inline-flex;
    color: var(--wa-form-control-label-color);
    font-weight: var(--wa-form-control-label-font-weight);
    line-height: var(--wa-form-control-label-line-height);
    margin-block-end: 0.5em;
  }

  :host([required]) :is([part~='form-control-label'], [part~='label'])::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
    color: var(--wa-form-control-required-content-color);
  }

  /* Help text */
  [part~='hint'] {
    display: block;
    color: var(--wa-form-control-hint-color);
    font-weight: var(--wa-form-control-hint-font-weight);
    line-height: var(--wa-form-control-hint-line-height);
    margin-block-start: 0.5em;
    font-size: var(--wa-font-size-smaller);

    &:not(.has-slotted, .has-hint, .has-count) {
      display: none;
    }
  }
`})))()}var gm;function _m(){return(_m=e((()=>{gm=()=>({checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&(n.message=t.validationMessage),!(`validity`in t))return n.invalidKeys.push(`customError`),n;for(let e in t.validity){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}})})))()}var vm;function ym(){return(ym=e((()=>{vm=class extends Event{constructor(){super(`wa-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var bm,xm;function Sm(){return(Sm=e((()=>{ym(),J(),_f(),y(),C(),bm=()=>({observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys=[`customError`]),t}}),xm=class extends Cf{constructor(){super(),this.name=null,this.disabled=!1,this.required=!1,this.assumeInteractionOn=[`input`],this.validators=[],this.valueHasChanged=!1,this.hasInteracted=!1,this.customError=null,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new vm))},this.handleInteraction=e=>{let t=this.emittedEvents;t.includes(e.type)||t.push(e.type),t.length===this.assumeInteractionOn?.length&&(this.hasInteracted=!0)},`addEventListener`in this&&this.addEventListener(`invalid`,this.emitInvalid)}static get validators(){return[bm()]}static get observedAttributes(){let e=new Set(super.observedAttributes||[]);for(let t of this.validators)if(t.observedAttributes)for(let n of t.observedAttributes)e.add(n);return[...e]}connectedCallback(){super.connectedCallback(),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.updateValidity()}):this.updateValidity(),this.assumeInteractionOn.forEach(e=>{this.addEventListener?.(e,this.handleInteraction)})}firstUpdated(...e){super.firstUpdated(...e),this.updateValidity()}willUpdate(e){if(e.has(`customError`)&&(this.customError||=null,this.setCustomValidity(this.customError||``)),e.has(`value`)||e.has(`disabled`)||e.has(`defaultValue`)){let e=this.value;this.updateFormValue(e)}e.has(`disabled`)&&(this.customStates.set(`disabled`,this.disabled),(this.hasAttribute(`disabled`)||!this.matches(`:disabled`))&&this.toggleAttribute(`disabled`,this.disabled)),super.willUpdate(e),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>this.updateValidity()):this.updateValidity()}updateFormValue(e){if(Array.isArray(e)){if(this.name){let t=new FormData;for(let n of e)t.append(this.name,n);this.setValue(t,t)}}else this.setValue(e,e)}get labels(){return this.internals.labels}getForm(){return this.internals.form}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}get validationTarget(){return this.input||void 0}setValidity(...e){let t=e[0],n=e[1],r=e[2];r||=this.validationTarget,this.internals.setValidity(t,n,r||void 0),this.requestUpdate(`validity`),this.setCustomStates()}setCustomStates(){let e=!!this.required,t=this.internals.validity.valid,n=this.hasInteracted;this.customStates.set(`required`,e),this.customStates.set(`optional`,!e),this.customStates.set(`invalid`,!t),this.customStates.set(`valid`,t),this.customStates.set(`user-invalid`,!t&&n),this.customStates.set(`user-valid`,t&&n)}setCustomValidity(e){if(!e){this.customError=null,this.setValidity({});return}this.customError=e,this.setValidity({customError:!0},e,this.validationTarget)}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity()}):(this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity())}setValue(...e){let[t,n]=e;this.internals.setFormValue(t,n)}get allValidators(){let e=this.constructor.validators||[],t=this.validators||[];return[...e,...t]}resetValidity(){this.setCustomValidity(``),this.setValidity({})}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.resetValidity();return}let e=this.allValidators;if(!e?.length)return;let t={customError:!!this.customError},n=this.validationTarget||this.input||void 0,r=``;for(let n of e){let{isValid:e,message:i,invalidKeys:a}=n.checkValidity(this);e||(r||=i,a?.length>=0&&a.forEach(e=>t[e]=!0))}r||=this.validationMessage,this.setValidity(t,r,n)}},xm.formAssociated=!0,q([g({reflect:!0})],xm.prototype,`name`,2),q([g({type:Boolean})],xm.prototype,`disabled`,2),q([g({state:!0,attribute:!1})],xm.prototype,`valueHasChanged`,2),q([g({state:!0,attribute:!1})],xm.prototype,`hasInteracted`,2),q([g({attribute:`custom-error`,reflect:!0})],xm.prototype,`customError`,2),q([g({attribute:!1,state:!0,type:Object})],xm.prototype,`validity`,1)})))()}var $;function Cm(){return(Cm=e((()=>{pm(),hm(),_m(),Sm(),Op(),gp(),vp(),Rf(),_f(),y(),C(),x(),S(),s(),$=class extends xm{constructor(){super(...arguments),this.hasSlotController=new Dp(this,`hint`),this.localize=new Lf(this),this.title=``,this.name=null,this._value=this.getAttribute(`value`)??null,this.size=`m`,this.disabled=!1,this._checked=null,this.defaultChecked=this.hasAttribute(`checked`),this.required=!1,this.hint=``,this.withHint=!1}static get validators(){return[...super.validators,gm()]}get value(){return this._value??`on`}set value(e){this._value=e}handleSizeChange(){pp(this.localName,this.size)}get checked(){return this.valueHasChanged?!!this._checked:this._checked??this.defaultChecked}set checked(e){this._checked=!!e,this.valueHasChanged=!0}handleClick(){this.hasInteracted=!0,this.checked=!this.checked,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))})}handleKeyDown(e){let t=this.localize.dir()===`rtl`;e.key===`ArrowLeft`&&(e.preventDefault(),this.checked=t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))})),e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))}))}willUpdate(e){super.willUpdate(e),(e.has(`value`)||e.has(`checked`)||e.has(`defaultChecked`)||e.has(`disabled`))&&this.handleValueOrCheckedChange()}handleValueOrCheckedChange(){if(this.didSSR&&!this.hasUpdated){this.updateComplete.then(()=>{this.handleValueOrCheckedChange()});return}this.setValue(this.checked?this.value:null,this._value),this.updateValidity()}handleStateChange(){this.hasUpdated&&(this.input.checked=this.checked),this.customStates.set(`checked`,this.checked),this.updateValidity()}handleDisabledChange(){this.updateValidity()}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}setValue(e,t){if(!this.checked){this.internals.setFormValue(null,null);return}this.internals.setFormValue(e??`on`,t)}formResetCallback(){this._checked=null,super.formResetCallback(),this.handleValueOrCheckedChange()}render(){let e=this.hasSlotController.test(`hint`,`withHint`),t=this.hint?!0:!!e,n=this.didSSR&&!this.hasUpdated?this.checked:this.defaultChecked,r=this.didSSR&&!this.hasUpdated?null:T(this.checked);return p`
      <label
        part="base switch"
        class=${m({checked:this.checked,disabled:this.disabled})}
      >
        <input
          class="input"
          type="checkbox"
          title=${this.title}
          name=${b(this.name)}
          value=${b(this.value)}
          .checked=${b(r)}
          ?checked=${n}
          ?disabled=${this.disabled}
          ?required=${this.required}
          role="switch"
          aria-checked=${this.checked?`true`:`false`}
          aria-describedby="hint"
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch">
          <span part="thumb" class="thumb"></span>
        </span>

        <slot part="label" class="label"></slot>
      </label>

      <slot
        id="hint"
        name="hint"
        part="hint"
        class=${m({"has-slotted":t})}
        aria-hidden=${t?`false`:`true`}
        >${this.hint}</slot
      >
    `}},$.shadowRootOptions={...xm.shadowRootOptions,delegatesFocus:!0},$.css=[mm,_p,fm],q([h(`input[type="checkbox"]`)],$.prototype,`input`,2),q([g()],$.prototype,`title`,2),q([g({reflect:!0})],$.prototype,`name`,2),q([g({reflect:!0})],$.prototype,`value`,1),q([g({reflect:!0})],$.prototype,`size`,2),q([xp(`size`)],$.prototype,`handleSizeChange`,1),q([g({type:Boolean})],$.prototype,`disabled`,2),q([g({type:Boolean,attribute:!1})],$.prototype,`checked`,1),q([g({type:Boolean,attribute:`checked`,reflect:!0})],$.prototype,`defaultChecked`,2),q([g({type:Boolean,reflect:!0})],$.prototype,`required`,2),q([g({attribute:`hint`})],$.prototype,`hint`,2),q([g({attribute:`with-hint`,type:Boolean})],$.prototype,`withHint`,2),q([xp([`checked`,`defaultChecked`])],$.prototype,`handleStateChange`,1),q([xp(`disabled`,{waitUntilFirstUpdate:!0})],$.prototype,`handleDisabledChange`,1),$=q([w(`wa-switch`)],$),$.disableWarning?.(`change-in-update`)})))()}function wm(){return(wm=e((()=>{Cm(),pm(),hm(),Sm(),vp(),J(),Rf(),If()})))()}function Tm(){return Jm||=document.createElement(`div`).style}function Em(e){if(Xm[e])return Xm[e];let t=Tm();if(e in t)return Xm[e]=e;let n=e[0].toUpperCase()+e.slice(1),r=Ym.length;for(;r--;){let i=`${Ym[r]}${n}`;if(i in t)return Xm[e]=i}}function Dm(e,t){return parseFloat(t[Em(e)])||0}function Om(e,t,n=window.getComputedStyle(e)){let r=t===`border`?`Width`:``;return{left:Dm(`${t}Left${r}`,n),right:Dm(`${t}Right${r}`,n),top:Dm(`${t}Top${r}`,n),bottom:Dm(`${t}Bottom${r}`,n)}}function km(e,t,n){e.style[Em(t)]=n}function Am(e,t){km(e,`transition`,`${Em(`transform`)} ${t.duration}ms ${t.easing}`)}function jm(e,{x:t,y:n,scale:r,isSVG:i},a){if(km(e,`transform`,`scale(${r}) translate(${t}px, ${n}px)`),i&&qm){let t=window.getComputedStyle(e).getPropertyValue(`transform`);e.setAttribute(`transform`,t)}}function Mm(e){let t=e.parentNode;(!t||t.nodeType!==1)&&(t=document.documentElement);let n=window.getComputedStyle(e),r=window.getComputedStyle(t),i=e.getBoundingClientRect(),a=t.getBoundingClientRect();return{elem:{style:n,width:i.width,height:i.height,top:i.top,bottom:i.bottom,left:i.left,right:i.right,margin:Om(e,`margin`,n),border:Om(e,`border`,n)},parent:{style:r,width:a.width,height:a.height,top:a.top,bottom:a.bottom,left:a.left,right:a.right,padding:Om(t,`padding`,r),border:Om(t,`border`,r)}}}function Nm(e,t,n,r){Zm[e].split(` `).forEach(e=>{t.addEventListener(e,n,r)})}function Pm(e,t,n){Zm[e].split(` `).forEach(e=>{t.removeEventListener(e,n)})}function Fm(e,t){let n=e.length;for(;n--;)if(e[n].pointerId===t.pointerId)return n;return-1}function Im(e,t){let n;if(t.touches){n=0;for(let r of t.touches)r.pointerId=n++,Im(e,r);return}n=Fm(e,t),n>-1&&e.splice(n,1),e.push(t)}function Lm(e,t){if(t.touches){for(;e.length;)e.pop();return}let n=Fm(e,t);n>-1&&e.splice(n,1)}function Rm(e){e=e.slice(0);let t=e.pop(),n;for(;n=e.pop();)t={clientX:(n.clientX-t.clientX)/2+t.clientX,clientY:(n.clientY-t.clientY)/2+t.clientY};return t}function zm(e){if(e.length<2)return 0;let t=e[0],n=e[1];return Math.sqrt(Math.abs(n.clientX-t.clientX)**2+Math.abs(n.clientY-t.clientY)**2)}function Bm(e){let t=e;for(;t&&t.parentNode;){if(t.parentNode===document)return!0;t=t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}return!1}function Vm(e){return(e.getAttribute(`class`)||``).trim()}function Hm(e,t){return e.nodeType===1&&` ${Vm(e)} `.indexOf(` ${t} `)>-1}function Um(e,t){for(let n=e;n!=null;n=n.parentNode)if(Hm(n,t.excludeClass)||t.exclude.indexOf(n)>-1)return!0;return!1}function Wm(e){return Qm.test(e.namespaceURI)&&e.nodeName.toLowerCase()!==`svg`}function Gm(e){let t={};for(let n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function Km(e,t){if(!e)throw Error(`Panzoom requires an element as an argument`);if(e.nodeType!==1)throw Error(`Panzoom requires an element with a nodeType of 1`);if(!Bm(e))throw Error(`Panzoom should be called on elements that have been attached to the DOM`);t={...$m,...t};let n=Wm(e),r=e.parentNode;r.style.overflow=t.overflow,r.style.userSelect=`none`,r.style.touchAction=t.touchAction,(t.canvas?r:e).style.cursor=t.cursor,e.style.userSelect=`none`,e.style.touchAction=t.touchAction,km(e,`transformOrigin`,typeof t.origin==`string`?t.origin:n?`0 0`:`50% 50%`);function i(){r.style.overflow=``,r.style.userSelect=``,r.style.touchAction=``,r.style.cursor=``,e.style.cursor=``,e.style.userSelect=``,e.style.touchAction=``,km(e,`transformOrigin`,``)}function a(n={}){for(let e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);(n.hasOwnProperty(`cursor`)||n.hasOwnProperty(`canvas`))&&(r.style.cursor=e.style.cursor=``,(t.canvas?r:e).style.cursor=t.cursor),n.hasOwnProperty(`overflow`)&&(r.style.overflow=n.overflow),n.hasOwnProperty(`touchAction`)&&(r.style.touchAction=n.touchAction,e.style.touchAction=n.touchAction)}let o=0,s=0,c=1,l=!1;h(t.startScale,{animate:!1,force:!0}),setTimeout(()=>{m(t.startX,t.startY,{animate:!1,force:!0})});function u(t,n,r){if(r.silent)return;let i=new CustomEvent(t,{detail:n});e.dispatchEvent(i)}function d(t,r,i){let a={x:o,y:s,scale:c,isSVG:n,originalEvent:i};return requestAnimationFrame(()=>{typeof r.animate==`boolean`&&(r.animate?Am(e,r):km(e,`transition`,`none`)),r.setTransform(e,a,r),u(t,a,r),u(`panzoomchange`,a,r)}),a}function f(n,r,i,a){let l={...t,...a},u={x:o,y:s,opts:l};if(!a?.force&&(l.disablePan||l.panOnlyWhenZoomed&&c===l.startScale))return u;if(n=parseFloat(n),r=parseFloat(r),l.disableXAxis||(u.x=(l.relative?o:0)+n),l.disableYAxis||(u.y=(l.relative?s:0)+r),l.contain){let t=Mm(e),n=t.elem.width/c,r=t.elem.height/c,a=n*i,o=r*i,s=(a-n)/2,d=(o-r)/2;if(l.contain===`inside`){let e=(-t.elem.margin.left-t.parent.padding.left+s)/i,n=(t.parent.width-a-t.parent.padding.left-t.elem.margin.left-t.parent.border.left-t.parent.border.right+s)/i;u.x=Math.max(Math.min(u.x,n),e);let r=(-t.elem.margin.top-t.parent.padding.top+d)/i,c=(t.parent.height-o-t.parent.padding.top-t.elem.margin.top-t.parent.border.top-t.parent.border.bottom+d)/i;u.y=Math.max(Math.min(u.y,c),r)}else if(l.contain===`outside`){let e=(-(a-t.parent.width)-t.parent.padding.left-t.parent.border.left-t.parent.border.right+s)/i,n=(s-t.parent.padding.left)/i;u.x=Math.max(Math.min(u.x,n),e);let r=(-(o-t.parent.height)-t.parent.padding.top-t.parent.border.top-t.parent.border.bottom+d)/i,c=(d-t.parent.padding.top)/i;u.y=Math.max(Math.min(u.y,c),r)}}return l.roundPixels&&(u.x=Math.round(u.x),u.y=Math.round(u.y)),u}function p(n,r){let i={...t,...r},a={scale:c,opts:i};if(!r?.force&&i.disableZoom)return a;let o=t.minScale,s=t.maxScale;if(i.contain){let n=Mm(e),r=n.elem.width/c,i=n.elem.height/c;if(r>1&&i>1){let e=n.parent.width-n.parent.border.left-n.parent.border.right,a=n.parent.height-n.parent.border.top-n.parent.border.bottom,c=e/r,l=a/i;t.contain===`inside`?s=Math.min(s,c,l):t.contain===`outside`&&(o=Math.max(o,c,l))}}return a.scale=Math.min(Math.max(n,o),s),a}function m(e,t,r,i){let a=f(e,t,c,r);return o!==a.x||s!==a.y?(o=a.x,s=a.y,d(`panzoompan`,a.opts,i)):{x:o,y:s,scale:c,isSVG:n,originalEvent:i}}function h(e,t,n){let r=p(e,t),i=r.opts;if(!t?.force&&i.disableZoom)return;e=r.scale;let a=o,l=s;if(i.focal){let t=i.focal;a=(t.x/e-t.x/c+o*e)/e,l=(t.y/e-t.y/c+s*e)/e}let u=f(a,l,e,{relative:!1,force:!0});return o=u.x,s=u.y,c=e,d(`panzoomzoom`,i,n)}function g(e,n){let r={...t,animate:!0,...n};return h(c*Math.exp((e?1:-1)*r.step),r)}function _(e){return g(!0,e)}function v(e){return g(!1,e)}function y(t,r,i,a){let o=Mm(e),s={width:o.parent.width-o.parent.padding.left-o.parent.padding.right-o.parent.border.left-o.parent.border.right,height:o.parent.height-o.parent.padding.top-o.parent.padding.bottom-o.parent.border.top-o.parent.border.bottom},l=r.clientX-o.parent.left-o.parent.padding.left-o.parent.border.left-o.elem.margin.left,u=r.clientY-o.parent.top-o.parent.padding.top-o.parent.border.top-o.elem.margin.top;n||(l-=o.elem.width/c/2,u-=o.elem.height/c/2);let d={x:l/s.width*(s.width*t),y:u/s.height*(s.height*t)};return h(t,{...i,animate:!1,focal:d},a)}function b(e,n){e.preventDefault();let r={...t,...n,animate:!1},i=(e.deltaY===0&&e.deltaX?e.deltaX:e.deltaY)<0?1:-1,a=p(c*Math.exp(i*r.step/3),r).scale;return y(a,e,r,e)}function x(e){let n={...t,animate:!0,force:!0,...e};c=p(n.startScale,n).scale;let r=f(n.startX,n.startY,c,n);return o=r.x,s=r.y,d(`panzoomreset`,n)}let S,C,w,T,E,ee,D=[];function O(e){if(Um(e.target,t))return;Im(D,e),l=!0,t.handleStartEvent(e),S=o,C=s,u(`panzoomstart`,{x:o,y:s,scale:c,isSVG:n,originalEvent:e},t);let r=Rm(D);w=r.clientX,T=r.clientY,E=c,ee=zm(D)}function k(e){if(!l||S===void 0||C===void 0||w===void 0||T===void 0)return;Im(D,e);let n=Rm(D),r=D.length>1,i=c;r&&(ee===0&&(ee=zm(D)),i=p((zm(D)-ee)*t.step/80+E).scale,y(i,n,{animate:!1},e)),(!r||t.pinchAndPan)&&m(S+(n.clientX-w)/i,C+(n.clientY-T)/i,{animate:!1},e)}function te(e){D.length===1&&u(`panzoomend`,{x:o,y:s,scale:c,isSVG:n,originalEvent:e},t),Lm(D,e),l&&(l=!1,S=C=w=T=void 0)}let ne=!1;function re(){ne||(ne=!0,Nm(`down`,t.canvas?r:e,O),Nm(`move`,document,k,{passive:!0}),Nm(`up`,document,te,{passive:!0}))}function ie(){ne=!1,Pm(`down`,t.canvas?r:e,O),Pm(`move`,document,k),Pm(`up`,document,te)}return t.noBind||re(),{bind:re,destroy:ie,eventNames:Zm,getPan:()=>({x:o,y:s}),getScale:()=>c,getOptions:()=>Gm(t),handleDown:O,handleMove:k,handleUp:te,pan:m,reset:x,resetStyle:i,setOptions:a,setStyle:(t,n)=>km(e,t,n),zoom:h,zoomIn:_,zoomOut:v,zoomToPoint:y,zoomWithWheel:b}}var qm,Jm,Ym,Xm,Zm,Qm,$m;function eh(){return(eh=e((()=>{typeof window<`u`&&(window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),typeof window.CustomEvent!=`function`&&(window.CustomEvent=function(e,t){t||={bubbles:!1,cancelable:!1,detail:null};var n=document.createEvent(`CustomEvent`);return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n})),qm=typeof document<`u`&&!!document.documentMode,Ym=[`webkit`,`moz`,`ms`],Xm={},Zm={down:`mousedown`,move:`mousemove`,up:`mouseup mouseleave`},typeof window<`u`&&(typeof window.PointerEvent==`function`?Zm={down:`pointerdown`,move:`pointermove`,up:`pointerup pointerleave pointercancel`}:typeof window.TouchEvent==`function`&&(Zm={down:`touchstart`,move:`touchmove`,up:`touchend touchcancel`})),Qm=/^http:[\w\.\/]+svg$/,$m={animate:!1,canvas:!1,cursor:`move`,disablePan:!1,disableZoom:!1,disableXAxis:!1,disableYAxis:!1,duration:200,easing:`ease-in-out`,exclude:[],excludeClass:`panzoom-exclude`,handleStartEvent:e=>{e.preventDefault(),e.stopPropagation()},maxScale:4,minScale:.125,overflow:`hidden`,panOnlyWhenZoomed:!1,pinchAndPan:!1,relative:!1,setTransform:jm,startX:0,startY:0,startScale:1,step:.3,touchAction:`none`},Km.defaultOptions=$m})))()}export{Gt as $,J as A,Pd as B,$f as C,Rf as D,Gf as E,af as F,ku as G,id as H,Ad as I,bu as J,Ou as K,jd as L,_f as M,lf as N,If as O,rf as P,ru as Q,kd as R,Qf as S,Y as T,ed as U,ad as V,td as W,hu as X,mu as Y,iu as Z,ap as _,Ie as _t,um as a,Rt as at,ep as b,ce as bt,yp as c,At as ct,dp as d,rt as dt,Wt as et,up as f,Me as ft,ip as g,ze as gt,sp as h,Fe as ht,dm as i,zt as it,q as j,Cf as k,bp as l,Dt as lt,op as m,Ne as mt,eh as n,Ut as nt,Sp as o,jt as ot,cp as p,Pe as pt,xu as q,wm as r,Bt as rt,xp as s,kt as st,Km as t,Vt as tt,fp as u,xt as ut,np as v,Je as vt,Kf as w,tp as x,rp as y,se as yt,Id as z};
//# sourceMappingURL=control-ui-boot-shared-ChPl5g1n.js.map