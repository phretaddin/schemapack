!function t(r,e,n){function i(f,u){if(!e[f]){if(!r[f]){var a="function"==typeof require&&require
if(!u&&a)return a(f,!0)
if(o)return o(f,!0)
var s=Error("Cannot find module '"+f+"'")
throw s.code="MODULE_NOT_FOUND",s}var h=e[f]={exports:{}}
r[f][0].call(h.exports,function(t){var e=r[f][1][t]
return i(e?e:t)},h,h.exports,t,r,e,n)}return e[f].exports}for(var o="function"==typeof require&&require,f=0;f<n.length;f++)i(n[f])
return i}({1:[function(t,r,e){"use strict"
function n(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=0,e=t.length;e>r;++r)a[r]=t[r],s[t.charCodeAt(r)]=r
s["-".charCodeAt(0)]=62,s["_".charCodeAt(0)]=63}function i(t){var r,e,n,i,o,f,u=t.length
if(u%4>0)throw Error("Invalid string. Length must be a multiple of 4")
o="="===t[u-2]?2:"="===t[u-1]?1:0,f=new h(3*u/4-o),n=o>0?u-4:u
var a=0
for(r=0,e=0;n>r;r+=4,e+=3)i=s[t.charCodeAt(r)]<<18|s[t.charCodeAt(r+1)]<<12|s[t.charCodeAt(r+2)]<<6|s[t.charCodeAt(r+3)],f[a++]=i>>16&255,f[a++]=i>>8&255,f[a++]=255&i
return 2===o?(i=s[t.charCodeAt(r)]<<2|s[t.charCodeAt(r+1)]>>4,f[a++]=255&i):1===o&&(i=s[t.charCodeAt(r)]<<10|s[t.charCodeAt(r+1)]<<4|s[t.charCodeAt(r+2)]>>2,f[a++]=i>>8&255,f[a++]=255&i),f}function o(t){return a[t>>18&63]+a[t>>12&63]+a[t>>6&63]+a[63&t]}function f(t,r,e){for(var n,i=[],f=r;e>f;f+=3)n=(t[f]<<16)+(t[f+1]<<8)+t[f+2],i.push(o(n))
return i.join("")}function u(t){for(var r,e=t.length,n=e%3,i="",o=[],u=16383,s=0,h=e-n;h>s;s+=u)o.push(f(t,s,s+u>h?h:s+u))
return 1===n?(r=t[e-1],i+=a[r>>2],i+=a[r<<4&63],i+="=="):2===n&&(r=(t[e-2]<<8)+t[e-1],i+=a[r>>10],i+=a[r>>4&63],i+=a[r<<2&63],i+="="),o.push(i),o.join("")}e.toByteArray=i,e.fromByteArray=u
var a=[],s=[],h="undefined"!=typeof Uint8Array?Uint8Array:Array
n()},{}],2:[function(t,r,e){(function(r){"use strict"
function n(){try{var t=new Uint8Array(1)
return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(r){return!1}}function i(){return f.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function o(t,r){if(i()<r)throw new RangeError("Invalid typed array length")
return f.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r),t.__proto__=f.prototype):(null===t&&(t=new f(r)),t.length=r),t}function f(t,r,e){if(!(f.TYPED_ARRAY_SUPPORT||this instanceof f))return new f(t,r,e)
if("number"==typeof t){if("string"==typeof r)throw Error("If encoding is specified then the first argument must be a string")
return h(this,t)}return u(this,t,r,e)}function u(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number')
return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?g(t,r,e,n):"string"==typeof r?c(t,r,e):p(t,r)}function a(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number')}function s(t,r,e,n){return a(r),0>=r?o(t,r):void 0!==e?"string"==typeof n?o(t,r).fill(e,n):o(t,r).fill(e):o(t,r)}function h(t,r){if(a(r),t=o(t,0>r?0:0|y(r)),!f.TYPED_ARRAY_SUPPORT)for(var e=0;r>e;++e)t[e]=0
return t}function c(t,r,e){if(("string"!=typeof e||""===e)&&(e="utf8"),!f.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding')
var n=0|w(r,e)
return t=o(t,n),t.write(r,e),t}function l(t,r){var e=0|y(r.length)
t=o(t,e)
for(var n=0;e>n;n+=1)t[n]=255&r[n]
return t}function g(t,r,e,n){if(r.byteLength,0>e||r.byteLength<e)throw new RangeError("'offset' is out of bounds")
if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds")
return r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n),f.TYPED_ARRAY_SUPPORT?(t=r,t.__proto__=f.prototype):t=l(t,r),t}function p(t,r){if(f.isBuffer(r)){var e=0|y(r.length)
return t=o(t,e),0===t.length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||H(r.length)?o(t,0):l(t,r)
if("Buffer"===r.type&&W(r.data))return l(t,r.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function y(t){if(t>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes")
return 0|t}function b(t){return+t!=t&&(t=0),f.alloc(+t)}function w(t,r){if(f.isBuffer(t))return t.length
if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength
"string"!=typeof t&&(t=""+t)
var e=t.length
if(0===e)return 0
for(var n=!1;;)switch(r){case"ascii":case"binary":case"raw":case"raws":return e
case"utf8":case"utf-8":case void 0:return q(t).length
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e
case"hex":return e>>>1
case"base64":return Z(t).length
default:if(n)return q(t).length
r=(""+r).toLowerCase(),n=!0}}function d(t,r,e){var n=!1
if((void 0===r||0>r)&&(r=0),r>this.length)return""
if((void 0===e||e>this.length)&&(e=this.length),0>=e)return""
if(e>>>=0,r>>>=0,r>=e)return""
for(t||(t="utf8");;)switch(t){case"hex":return Y(this,r,e)
case"utf8":case"utf-8":return T(this,r,e)
case"ascii":return I(this,r,e)
case"binary":return S(this,r,e)
case"base64":return U(this,r,e)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return C(this,r,e)
default:if(n)throw new TypeError("Unknown encoding: "+t)
t=(t+"").toLowerCase(),n=!0}}function v(t,r,e){var n=t[r]
t[r]=t[e],t[e]=n}function E(t,r,e,n){function i(t,r){return 1===o?t[r]:t.readUInt16BE(r*o)}var o=1,f=t.length,u=r.length
if(void 0!==n&&(n=(n+"").toLowerCase(),"ucs2"===n||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1
o=2,f/=2,u/=2,e/=2}for(var a=-1,s=e;f>s;++s)if(i(t,s)===i(r,-1===a?0:s-a)){if(-1===a&&(a=s),s-a+1===u)return a*o}else-1!==a&&(s-=s-a),a=-1
return-1}function A(t,r,e,n){e=+e||0
var i=t.length-e
n?(n=+n,n>i&&(n=i)):n=i
var o=r.length
if(o%2!==0)throw Error("Invalid hex string")
n>o/2&&(n=o/2)
for(var f=0;n>f;++f){var u=parseInt(r.substr(2*f,2),16)
if(isNaN(u))return f
t[e+f]=u}return f}function B(t,r,e,n){return G(q(r,t.length-e),t,e,n)}function m(t,r,e,n){return G(X(r),t,e,n)}function O(t,r,e,n){return m(t,r,e,n)}function _(t,r,e,n){return G(Z(r),t,e,n)}function R(t,r,e,n){return G(J(r,t.length-e),t,e,n)}function U(t,r,e){return 0===r&&e===t.length?K.fromByteArray(t):K.fromByteArray(t.slice(r,e))}function T(t,r,e){e=Math.min(t.length,e)
for(var n=[],i=r;e>i;){var o=t[i],f=null,u=o>239?4:o>223?3:o>191?2:1
if(e>=i+u){var a,s,h,c
switch(u){case 1:128>o&&(f=o)
break
case 2:a=t[i+1],128===(192&a)&&(c=(31&o)<<6|63&a,c>127&&(f=c))
break
case 3:a=t[i+1],s=t[i+2],128===(192&a)&&128===(192&s)&&(c=(15&o)<<12|(63&a)<<6|63&s,c>2047&&(55296>c||c>57343)&&(f=c))
break
case 4:a=t[i+1],s=t[i+2],h=t[i+3],128===(192&a)&&128===(192&s)&&128===(192&h)&&(c=(15&o)<<18|(63&a)<<12|(63&s)<<6|63&h,c>65535&&1114112>c&&(f=c))}}null===f?(f=65533,u=1):f>65535&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f),n.push(f),i+=u}return P(n)}function P(t){var r=t.length
if($>=r)return String.fromCharCode.apply(String,t)
for(var e="",n=0;r>n;)e+=String.fromCharCode.apply(String,t.slice(n,n+=$))
return e}function I(t,r,e){var n=""
e=Math.min(t.length,e)
for(var i=r;e>i;++i)n+=String.fromCharCode(127&t[i])
return n}function S(t,r,e){var n=""
e=Math.min(t.length,e)
for(var i=r;e>i;++i)n+=String.fromCharCode(t[i])
return n}function Y(t,r,e){var n=t.length;(!r||0>r)&&(r=0),(!e||0>e||e>n)&&(e=n)
for(var i="",o=r;e>o;++o)i+=z(t[o])
return i}function C(t,r,e){for(var n=t.slice(r,e),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1])
return i}function L(t,r,e){if(t%1!==0||0>t)throw new RangeError("offset is not uint")
if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function x(t,r,e,n,i,o){if(!f.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance')
if(r>i||o>r)throw new RangeError('"value" argument is out of bounds')
if(e+n>t.length)throw new RangeError("Index out of range")}function M(t,r,e,n){0>r&&(r=65535+r+1)
for(var i=0,o=Math.min(t.length-e,2);o>i;++i)t[e+i]=(r&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function D(t,r,e,n){0>r&&(r=4294967295+r+1)
for(var i=0,o=Math.min(t.length-e,4);o>i;++i)t[e+i]=r>>>8*(n?i:3-i)&255}function k(t,r,e,n,i,o){if(e+n>t.length)throw new RangeError("Index out of range")
if(0>e)throw new RangeError("Index out of range")}function j(t,r,e,n,i){return i||k(t,r,e,4,3.4028234663852886e38,-3.4028234663852886e38),Q.write(t,r,e,n,23,4),e+4}function V(t,r,e,n,i){return i||k(t,r,e,8,1.7976931348623157e308,-1.7976931348623157e308),Q.write(t,r,e,n,52,8),e+8}function N(t){if(t=F(t).replace(tt,""),t.length<2)return""
for(;t.length%4!==0;)t+="="
return t}function F(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function z(t){return 16>t?"0"+t.toString(16):t.toString(16)}function q(t,r){r=r||1/0
for(var e,n=t.length,i=null,o=[],f=0;n>f;++f){if(e=t.charCodeAt(f),e>55295&&57344>e){if(!i){if(e>56319){(r-=3)>-1&&o.push(239,191,189)
continue}if(f+1===n){(r-=3)>-1&&o.push(239,191,189)
continue}i=e
continue}if(56320>e){(r-=3)>-1&&o.push(239,191,189),i=e
continue}e=(i-55296<<10|e-56320)+65536}else i&&(r-=3)>-1&&o.push(239,191,189)
if(i=null,128>e){if((r-=1)<0)break
o.push(e)}else if(2048>e){if((r-=2)<0)break
o.push(e>>6|192,63&e|128)}else if(65536>e){if((r-=3)<0)break
o.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(1114112>e))throw Error("Invalid code point")
if((r-=4)<0)break
o.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return o}function X(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e))
return r}function J(t,r){for(var e,n,i,o=[],f=0;f<t.length&&!((r-=2)<0);++f)e=t.charCodeAt(f),n=e>>8,i=e%256,o.push(i),o.push(n)
return o}function Z(t){return K.toByteArray(N(t))}function G(t,r,e,n){for(var i=0;n>i&&!(i+e>=r.length||i>=t.length);++i)r[i+e]=t[i]
return i}function H(t){return t!==t}var K=t("base64-js"),Q=t("ieee754"),W=t("isarray")
e.Buffer=f,e.SlowBuffer=b,e.INSPECT_MAX_BYTES=50,f.TYPED_ARRAY_SUPPORT=void 0!==r.TYPED_ARRAY_SUPPORT?r.TYPED_ARRAY_SUPPORT:n(),e.kMaxLength=i(),f.poolSize=8192,f._augment=function(t){return t.__proto__=f.prototype,t},f.from=function(t,r,e){return u(null,t,r,e)},f.TYPED_ARRAY_SUPPORT&&(f.prototype.__proto__=Uint8Array.prototype,f.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&f[Symbol.species]===f&&Object.defineProperty(f,Symbol.species,{value:null,configurable:!0})),f.alloc=function(t,r,e){return s(null,t,r,e)},f.allocUnsafe=function(t){return h(null,t)},f.allocUnsafeSlow=function(t){return h(null,t)},f.isBuffer=function(t){return!(null==t||!t._isBuffer)},f.compare=function(t,r){if(!f.isBuffer(t)||!f.isBuffer(r))throw new TypeError("Arguments must be Buffers")
if(t===r)return 0
for(var e=t.length,n=r.length,i=0,o=Math.min(e,n);o>i;++i)if(t[i]!==r[i]){e=t[i],n=r[i]
break}return n>e?-1:e>n?1:0},f.isEncoding=function(t){switch((t+"").toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0
default:return!1}},f.concat=function(t,r){if(!W(t))throw new TypeError('"list" argument must be an Array of Buffers')
if(0===t.length)return f.alloc(0)
var e
if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length
var n=f.allocUnsafe(r),i=0
for(e=0;e<t.length;++e){var o=t[e]
if(!f.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers')
o.copy(n,i),i+=o.length}return n},f.byteLength=w,f.prototype._isBuffer=!0,f.prototype.swap16=function(){var t=this.length
if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits")
for(var r=0;t>r;r+=2)v(this,r,r+1)
return this},f.prototype.swap32=function(){var t=this.length
if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits")
for(var r=0;t>r;r+=4)v(this,r,r+3),v(this,r+1,r+2)
return this},f.prototype.toString=function(){var t=0|this.length
return 0===t?"":0===arguments.length?T(this,0,t):d.apply(this,arguments)},f.prototype.equals=function(t){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer")
return this===t?!0:0===f.compare(this,t)},f.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES
return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},f.prototype.compare=function(t,r,e,n,i){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer")
if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),0>r||e>t.length||0>n||i>this.length)throw new RangeError("out of range index")
if(n>=i&&r>=e)return 0
if(n>=i)return-1
if(r>=e)return 1
if(r>>>=0,e>>>=0,n>>>=0,i>>>=0,this===t)return 0
for(var o=i-n,u=e-r,a=Math.min(o,u),s=this.slice(n,i),h=t.slice(r,e),c=0;a>c;++c)if(s[c]!==h[c]){o=s[c],u=h[c]
break}return u>o?-1:o>u?1:0},f.prototype.indexOf=function(t,r,e){if("string"==typeof r?(e=r,r=0):r>2147483647?r=2147483647:-2147483648>r&&(r=-2147483648),r>>=0,0===this.length)return-1
if(r>=this.length)return-1
if(0>r&&(r=Math.max(this.length+r,0)),"string"==typeof t&&(t=f.from(t,e)),f.isBuffer(t))return 0===t.length?-1:E(this,t,r,e)
if("number"==typeof t)return f.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,t,r):E(this,[t],r,e)
throw new TypeError("val must be string, number or Buffer")},f.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},f.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0
else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0
else{if(!isFinite(r))throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")
r=0|r,isFinite(e)?(e=0|e,void 0===n&&(n="utf8")):(n=e,e=void 0)}var i=this.length-r
if((void 0===e||e>i)&&(e=i),t.length>0&&(0>e||0>r)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds")
n||(n="utf8")
for(var o=!1;;)switch(n){case"hex":return A(this,t,r,e)
case"utf8":case"utf-8":return B(this,t,r,e)
case"ascii":return m(this,t,r,e)
case"binary":return O(this,t,r,e)
case"base64":return _(this,t,r,e)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,r,e)
default:if(o)throw new TypeError("Unknown encoding: "+n)
n=(""+n).toLowerCase(),o=!0}},f.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}}
var $=4096
f.prototype.slice=function(t,r){var e=this.length
t=~~t,r=void 0===r?e:~~r,0>t?(t+=e,0>t&&(t=0)):t>e&&(t=e),0>r?(r+=e,0>r&&(r=0)):r>e&&(r=e),t>r&&(r=t)
var n
if(f.TYPED_ARRAY_SUPPORT)n=this.subarray(t,r),n.__proto__=f.prototype
else{var i=r-t
n=new f(i,void 0)
for(var o=0;i>o;++o)n[o]=this[o+t]}return n},f.prototype.readUIntLE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i
return n},f.prototype.readUIntBE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t+--r],i=1;r>0&&(i*=256);)n+=this[t+--r]*i
return n},f.prototype.readUInt8=function(t,r){return r||L(t,1,this.length),this[t]},f.prototype.readUInt16LE=function(t,r){return r||L(t,2,this.length),this[t]|this[t+1]<<8},f.prototype.readUInt16BE=function(t,r){return r||L(t,2,this.length),this[t]<<8|this[t+1]},f.prototype.readUInt32LE=function(t,r){return r||L(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},f.prototype.readUInt32BE=function(t,r){return r||L(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},f.prototype.readIntLE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i
return i*=128,n>=i&&(n-=Math.pow(2,8*r)),n},f.prototype.readIntBE=function(t,r,e){t=0|t,r=0|r,e||L(t,r,this.length)
for(var n=r,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i
return i*=128,o>=i&&(o-=Math.pow(2,8*r)),o},f.prototype.readInt8=function(t,r){return r||L(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},f.prototype.readInt16LE=function(t,r){r||L(t,2,this.length)
var e=this[t]|this[t+1]<<8
return 32768&e?4294901760|e:e},f.prototype.readInt16BE=function(t,r){r||L(t,2,this.length)
var e=this[t+1]|this[t]<<8
return 32768&e?4294901760|e:e},f.prototype.readInt32LE=function(t,r){return r||L(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},f.prototype.readInt32BE=function(t,r){return r||L(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},f.prototype.readFloatLE=function(t,r){return r||L(t,4,this.length),Q.read(this,t,!0,23,4)},f.prototype.readFloatBE=function(t,r){return r||L(t,4,this.length),Q.read(this,t,!1,23,4)},f.prototype.readDoubleLE=function(t,r){return r||L(t,8,this.length),Q.read(this,t,!0,52,8)},f.prototype.readDoubleBE=function(t,r){return r||L(t,8,this.length),Q.read(this,t,!1,52,8)},f.prototype.writeUIntLE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1
x(this,t,r,e,i,0)}var o=1,f=0
for(this[r]=255&t;++f<e&&(o*=256);)this[r+f]=t/o&255
return r+e},f.prototype.writeUIntBE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1
x(this,t,r,e,i,0)}var o=e-1,f=1
for(this[r+o]=255&t;--o>=0&&(f*=256);)this[r+o]=t/f&255
return r+e},f.prototype.writeUInt8=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,1,255,0),f.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},f.prototype.writeUInt16LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):M(this,t,r,!0),r+2},f.prototype.writeUInt16BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,65535,0),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):M(this,t,r,!1),r+2},f.prototype.writeUInt32LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):D(this,t,r,!0),r+4},f.prototype.writeUInt32BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,4294967295,0),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):D(this,t,r,!1),r+4},f.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1)
x(this,t,r,e,i-1,-i)}var o=0,f=1,u=0
for(this[r]=255&t;++o<e&&(f*=256);)0>t&&0===u&&0!==this[r+o-1]&&(u=1),this[r+o]=(t/f>>0)-u&255
return r+e},f.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1)
x(this,t,r,e,i-1,-i)}var o=e-1,f=1,u=0
for(this[r+o]=255&t;--o>=0&&(f*=256);)0>t&&0===u&&0!==this[r+o+1]&&(u=1),this[r+o]=(t/f>>0)-u&255
return r+e},f.prototype.writeInt8=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,1,127,-128),f.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),0>t&&(t=255+t+1),this[r]=255&t,r+1},f.prototype.writeInt16LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):M(this,t,r,!0),r+2},f.prototype.writeInt16BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,2,32767,-32768),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):M(this,t,r,!1),r+2},f.prototype.writeInt32LE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,2147483647,-2147483648),f.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):D(this,t,r,!0),r+4},f.prototype.writeInt32BE=function(t,r,e){return t=+t,r=0|r,e||x(this,t,r,4,2147483647,-2147483648),0>t&&(t=4294967295+t+1),f.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):D(this,t,r,!1),r+4},f.prototype.writeFloatLE=function(t,r,e){return j(this,t,r,!0,e)},f.prototype.writeFloatBE=function(t,r,e){return j(this,t,r,!1,e)},f.prototype.writeDoubleLE=function(t,r,e){return V(this,t,r,!0,e)},f.prototype.writeDoubleBE=function(t,r,e){return V(this,t,r,!1,e)},f.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&e>n&&(n=e),n===e)return 0
if(0===t.length||0===this.length)return 0
if(0>r)throw new RangeError("targetStart out of bounds")
if(0>e||e>=this.length)throw new RangeError("sourceStart out of bounds")
if(0>n)throw new RangeError("sourceEnd out of bounds")
n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e)
var i,o=n-e
if(this===t&&r>e&&n>r)for(i=o-1;i>=0;--i)t[i+r]=this[i+e]
else if(1e3>o||!f.TYPED_ARRAY_SUPPORT)for(i=0;o>i;++i)t[i+r]=this[i+e]
else Uint8Array.prototype.set.call(t,this.subarray(e,e+o),r)
return o},f.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var i=t.charCodeAt(0)
256>i&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string")
if("string"==typeof n&&!f.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t=255&t)
if(0>r||this.length<r||this.length<e)throw new RangeError("Out of range index")
if(r>=e)return this
r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0)
var o
if("number"==typeof t)for(o=r;e>o;++o)this[o]=t
else{var u=f.isBuffer(t)?t:q(""+new f(t,n)),a=u.length
for(o=0;e-r>o;++o)this[o+r]=u[o%a]}return this}
var tt=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":1,ieee754:3,isarray:4}],3:[function(t,r,e){e.read=function(t,r,e,n,i){var o,f,u=8*i-n-1,a=(1<<u)-1,s=a>>1,h=-7,c=e?i-1:0,l=e?-1:1,g=t[r+c]
for(c+=l,o=g&(1<<-h)-1,g>>=-h,h+=u;h>0;o=256*o+t[r+c],c+=l,h-=8);for(f=o&(1<<-h)-1,o>>=-h,h+=n;h>0;f=256*f+t[r+c],c+=l,h-=8);if(0===o)o=1-s
else{if(o===a)return f?NaN:(g?-1:1)*(1/0)
f+=Math.pow(2,n),o-=s}return(g?-1:1)*f*Math.pow(2,o-n)},e.write=function(t,r,e,n,i,o){var f,u,a,s=8*o-i-1,h=(1<<s)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,g=n?0:o-1,p=n?1:-1,y=0>r||0===r&&0>1/r?1:0
for(r=Math.abs(r),isNaN(r)||r===1/0?(u=isNaN(r)?1:0,f=h):(f=Math.floor(Math.log(r)/Math.LN2),r*(a=Math.pow(2,-f))<1&&(f--,a*=2),r+=f+c>=1?l/a:l*Math.pow(2,1-c),r*a>=2&&(f++,a/=2),f+c>=h?(u=0,f=h):f+c>=1?(u=(r*a-1)*Math.pow(2,i),f+=c):(u=r*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[e+g]=255&u,g+=p,u/=256,i-=8);for(f=f<<i|u,s+=i;s>0;t[e+g]=255&f,g+=p,f/=256,s-=8);t[e+g-p]|=128*y}},{}],4:[function(t,r,e){var n={}.toString
r.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},{}],5:[function(t,r,e){"use strict"
function n(t,r){var e=Object.keys(V)
if(e.indexOf(r)<0)throw new TypeError("Underlying type does not exist. Typo?")
j[t]=r}function i(t){var r=Object.keys(V),e=t.trim().toLowerCase()
if(j.hasOwnProperty(e)&&(e=j[e]),-1===r.indexOf(e))throw new TypeError("Invalid data type for schema: "+t+" -> "+e)
return e}function o(t){k=t}function f(t){var r=t.trim().toLowerCase(),e=["ascii","utf8","utf16le","ucs2","base64","binary","hex"]
if(!(e.indexOf(r)>-1))throw new TypeError("String encoding not available")
D=r}function u(t,r){for(;t>127;)r[X.byteOffset++]=127&t|128,t>>=7
r[X.byteOffset++]=127&t}function a(t,r){u(t<<1^t>>31,r)}function s(t){var r,e=0,n=0
do r=t[X.byteOffset++],e|=(127&r)<<7*n,n++
while(128&r)
return e}function h(t){var r=s(t)
return r>>>1^-(1&r)}function c(t,r){var e=M.byteLength(t||"",D)
u(e,r),X.byteOffset+=r.write(t||"",X.byteOffset,e,D)}function l(t){var r=s(t),e=t.toString(D,X.byteOffset,X.byteOffset+r)
return X.byteOffset+=r,e}function g(t,r){var e=t.length
u(e,r),t.copy(r,X.byteOffset),X.byteOffset+=e}function p(t){var r=s(t),e=z(r)
return t.copy(e,0,X.byteOffset,X.byteOffset+r),X.byteOffset+=r,e}function y(t,r){switch(t){case"boolean":return"bag.byteOffset = wBuffer.writeUInt8("+r+" ? 1 : 0, bag.byteOffset, true);"
case"int8":return"bag.byteOffset = wBuffer.writeInt8("+r+", bag.byteOffset, true);"
case"uint8":return"bag.byteOffset = wBuffer.writeUInt8("+r+", bag.byteOffset, true);"
case"int16":return"bag.byteOffset = wBuffer.writeInt16BE("+r+", bag.byteOffset, true);"
case"uint16":return"bag.byteOffset = wBuffer.writeUInt16BE("+r+", bag.byteOffset, true);"
case"int32":return"bag.byteOffset = wBuffer.writeInt32BE("+r+", bag.byteOffset, true);"
case"uint32":return"bag.byteOffset = wBuffer.writeUInt32BE("+r+", bag.byteOffset, true);"
case"float32":return"bag.byteOffset = wBuffer.writeFloatBE("+r+", bag.byteOffset, true);"
case"float64":return"bag.byteOffset = wBuffer.writeDoubleBE("+r+", bag.byteOffset, true);"
case"string":return"bag.writeString("+r+", wBuffer);"
case"varuint":return"bag.writeVarUInt("+r+", wBuffer);"
case"varint":return"bag.writeVarInt("+r+", wBuffer);"
case"buffer":return"bag.writeBuffer("+r+", wBuffer);"}}function b(t){return 0>=t?1:Math.floor(Math.log(t)/Math.log(128))+1}function w(t){return b(t<<1^t>>31)}function d(t,r,e,n,i){var o=1>=n?r:r+"xn",f=void 0===i?"ref"+o+".length":i,u="j"+r
return"for (var "+u+"="+(t.length-1)+";"+u+"<"+f+";"+u+"++) { "+e+"}"}function v(t){return"byteC+=bag.getVarUIntByteLength(ref"+t+".length);"}function E(t){return"bag.writeVarUInt(ref"+t+".length,wBuffer);"}function A(t){return"var "+t+"=bag.readVarUInt(buffer);"}function B(t,r,e,n){return"var ref"+t+"="+n+"; ref"+r+"["+e+"]=ref"+t+";"}function m(t,r,e){return"var ref"+t+"=ref"+r+"["+e+"];"}function O(t,r,e,n,i,o,f,u){var a=(C(o,r),C(o,e)),s=t?"j"+e:n
o[o.length-1]+=m(r+"xn",a,s),f[f.length-1]+=B(r+"xn",a,s,i),u[u.length-1]+=m(r+"xn",a,s)}function _(t,r,e,n,i){if(typeof t!==r)throw new TypeError(t+" does not match the type of "+r)
if(void 0!==e&&e>t)throw new TypeError(t+" is less than minimum allowed value of "+e+" for schema type "+i)
if(void 0!==n&&t>n)throw new TypeError(t+" is greater than maximum allowed value of "+n+" for schema type "+i)}function R(t){var r="bag.throwTypeError("+t+",'Buffer or Uint8Array');"
return"if ("+t+" instanceof Uint8Array === false && "+t+" instanceof Buffer === false){"+r+"}"}function U(t,r){var e="bag.throwTypeError("+t+",'"+r+"');"
return"if (typeof("+t+") !== '"+r+"'){"+e+"}"}function T(t,r,e,n){var i="bag.throwTypeError("+t+",'number',"+r+","+e+",'"+n+"');"
return"if (typeof("+t+") !== 'number'||"+t+"<"+r+"||"+t+">"+e+"){"+i+"}"}function P(t,r){var e=3.4028234663852886e38
switch(t){case"boolean":return U(r,"boolean")
case"int8":return T(r,-128,127,"int8")
case"uint8":return T(r,0,255,"uint8")
case"int16":return T(r,-32768,32767,"int16")
case"uint16":return T(r,0,65535,"uint16")
case"int32":return T(r,-2147483648,2147483647,"int32")
case"uint32":return T(r,0,4294967295,"uint32")
case"float32":return T(r,-e,e,"float32")
case"float64":return T(r,-Number.MAX_VALUE,Number.MAX_VALUE,"float64")
case"string":return U(r,"string")
case"varuint":return T(r,0,2147483647,"varuint")
case"varint":return T(r,-1073741824,1073741823,"varint")
case"buffer":return R(r)}}function I(t,r,e,n){var i="ref"+r+e
return(n?P(t,i):"")+y(t,i)}function S(t,r,e){return"ref"+r+e+"="+V[t]}function Y(t,r,e){var n=N.hasOwnProperty(t)
return n?"byteC+="+N[t]+";":"byteC+=bag.dynamicByteCounts['"+t+"'](ref"+r+e+");"}function C(t,r){return t.length<=2&&t[t.length-1].length<=0?r:r+"xn"}function L(t,r){function e(t,y){a++
var b=Object.keys(t)
b.sort(function(t,r){return r>t?-1:t>r?1:0})
for(var w=a,_=0;_<b.length;_++){var R=b[_],U=t[R]
y&&(R=+R)
var T="number"==typeof R?R:"'"+R+"'",P=U.constructor===Array?"[]":"{}",L=y&&_>=b.length-1
if(L&&(s.push(""),h.push(""),c.push("")),U.constructor===Array){var x=a+1,M=s.length<=1?x:x+"xn",D="arrLen"+a
1===s.length&&(u+=m(x,w,T),o+=B(x,w,T,"[]"))
var k=E(M),j=A(D),V=v(M)
O(L,x,w,T,P,s,h,c),e(U,!0),l=k+d(U,x,s.pop()+l,s.length),g=j+d(U,x,h.pop()+g,s.length,D),p=V+d(U,x,c.pop()+p,s.length),1===s.length&&(n+=l,l="",o+=g,g="",f+=p,p="")}else if("object"==typeof U){var x=a+1
1===s.length&&(u+=m(x,w,T),o+=B(x,w,T,"{}")),O(L,x,w,T,P,s,h,c),e(U,!1)}else{var N=y?"":"["+T+"]",F=i(U)
t[R]=F
var M=C(s,w)
if(y&&(M+=L?"[j"+w+"]":"["+_+"]"),s[s.length-1]+=I(F,M,N,r),h[h.length-1]+=S(F,M,N),c[c.length-1]+=Y(F,M,N),s.length>1)continue
var z=y?w+"["+_+"]":w
n+=I(F,z,N,r),o+=S(F,z,N),f+=Y(F,z,N)}}}var n="bag.byteOffset=0;",o="var ref1={}; bag.byteOffset=0;",f="",u="var ref1=json;",a=0,s=[""],h=[""],c=[""],l="",g="",p=""
t={a:t},e(t,!1),f="var byteC=0;".concat(f,"var wBuffer=bag.allocUnsafe(byteC);"),n=u.concat(f,n,"return wBuffer;"),o=o.concat("return ref1['a'];")
var y=Function("json","bag",n),b=Function("buffer","bag",o)
return[y,b]}function x(t,r){var e=L(t,void 0===r?k:r),n=e[0],i=e[1]
return{encode:function(t){var r={a:t}
return n(r,X)},decode:function(t){var r=M.isBuffer(t)?t:q(t)
return i(r,X)}}}var M=t("buffer").Buffer,D="utf8",k=!0,j={},V={"boolean":"!!buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",int8:"buffer.readInt8(bag.byteOffset, true); bag.byteOffset += 1;",uint8:"buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",int16:"buffer.readInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",uint16:"buffer.readUInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",int32:"buffer.readInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",uint32:"buffer.readUInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",float32:"buffer.readFloatBE(bag.byteOffset, true); bag.byteOffset += 4;",float64:"buffer.readDoubleBE(bag.byteOffset, true); bag.byteOffset += 8;",string:"bag.readString(buffer);",varuint:"bag.readVarUInt(buffer);",varint:"bag.readVarInt(buffer);",buffer:"bag.readBuffer(buffer);"},N={"boolean":1,int8:1,uint8:1,int16:2,uint16:2,int32:4,uint32:4,float32:4,float64:8},F={string:function(t){var r=M.byteLength(t,D)
return b(r)+r},varuint:function(t){return b(t)},varint:function(t){return w(t)},buffer:function(t){var r=t.length
return b(r)+r}},z=M.allocUnsafe?function(t){return M.allocUnsafe(t)}:function(t){return new M(t)},q=M.from?function(t){return M.from(t)}:function(t){return new M(t)},X={}
X.allocUnsafe=z,X.getVarUIntByteLength=b,X.dynamicByteCounts=F,X.readVarUInt=s,X.readVarInt=h,X.writeVarUInt=u,X.writeVarInt=a,X.readString=l,X.writeString=c,X.readBuffer=p,X.writeBuffer=g,X.throwTypeError=_,X.byteOffset=0,n("bool","boolean"),r.exports=e={build:x,addTypeAlias:n,setStringEncoding:f,setValidateByDefault:o},window.schemapack=r.exports},{buffer:2}]},{},[5])
