/*!
TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function CodePointCount(e){let t=0,n=0,r=0;for(;n<e.length;){let i=e.charCodeAt(n++)>>10;t+=+((r<<8|i)!=13879),r=i}return t}var e=(()=>{let check_0=e=>typeof e==`object`&&!!e&&!Array.isArray(e)&&`type`in e&&`id`in e&&Object.getOwnPropertyNames(e).length===2&&typeof e.type==`string`&&e.type===`profile`&&typeof e.id==`string`&&(e.id.length>=2||e.id.length>=1&&CodePointCount(e.id)>=1)||typeof e==`object`&&!!e&&!Array.isArray(e)&&`type`in e&&`id`in e&&Object.getOwnPropertyNames(e).length===2&&typeof e.type==`string`&&e.type===`agent`&&typeof e.id==`string`&&(e.id.length>=2||e.id.length>=1&&CodePointCount(e.id)>=1)||typeof e==`object`&&!!e&&!Array.isArray(e)&&`type`in e&&`pluginId`in e&&`domain`in e&&`idKind`in e&&`id`in e&&Object.getOwnPropertyNames(e).length===5&&typeof e.type==`string`&&e.type===`remote`&&typeof e.pluginId==`string`&&(e.pluginId.length>=2||e.pluginId.length>=1&&CodePointCount(e.pluginId)>=1)&&typeof e.domain==`string`&&(e.domain.length>=2||e.domain.length>=1&&CodePointCount(e.domain)>=1)&&typeof e.idKind==`string`&&(e.idKind.length>=2||e.idKind.length>=1&&CodePointCount(e.idKind)>=1)&&typeof e.id==`string`&&(e.id.length>=2||e.id.length>=1&&CodePointCount(e.id)>=1)||typeof e==`object`&&!!e&&!Array.isArray(e)&&`type`in e&&`pluginId`in e&&`accountId`in e&&`senderKind`in e&&`id`in e&&Object.getOwnPropertyNames(e).length===5&&typeof e.type==`string`&&e.type===`observation`&&(typeof e.pluginId==`string`&&(e.pluginId.length>=2||e.pluginId.length>=1&&CodePointCount(e.pluginId)>=1)||e.pluginId===null)&&(typeof e.accountId==`string`&&(e.accountId.length>=2||e.accountId.length>=1&&CodePointCount(e.accountId)>=1)||e.accountId===null)&&(typeof e.senderKind==`string`&&e.senderKind===`human`||typeof e.senderKind==`string`&&e.senderKind===`bot`||typeof e.senderKind==`string`&&e.senderKind===`unknown`)&&typeof e.id==`string`&&(e.id.length>=2||e.id.length>=1&&CodePointCount(e.id)>=1)||typeof e==`object`&&!!e&&!Array.isArray(e)&&`type`in e&&`actorType`in e&&`source`in e&&`id`in e&&Object.getOwnPropertyNames(e).length===4&&typeof e.type==`string`&&e.type===`legacy`&&typeof e.actorType==`string`&&(typeof e.source==`string`||e.source===null)&&typeof e.id==`string`;return e=>check_0(e)})();export{e as t};