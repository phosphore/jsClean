# jsClean
Unpacker/deobfuscator for javascript sources.


Usage example: `node jsClean.js inputfile.js --expandArray`.


The `--expandArray` is optional: running it without this argument will decode the strings in a readable way and format the code, but won't relocate the strings array in the input source. See below example.

Taken this source:

```javascript
var _0xae17=["\x6E\x65\x78\x74\x4E\x65\x77\x73","\x67\x65\x74\x49\x74\x65\x6D","\x73\x65\x74\x49\x74\x65\x6D", ""]; //more...
if(localStorage[_0xae17[1]](_0xae17[0])==undefined){localStorage[_0xae17[2]](_0xae17[0],0);} ;var valuta=_0xae17[3];var coefficient=0.1;chrome[_0xae17[17]][_0xae17[16]]({method:_0xae17[4],key:_0xae17[5]},function (_0xec46x3){valuta=_0xec46x3[_0xae17[6]];if(valuta==_0xae17[7]){chrome[_0xae17[17]][_0xae17[16]]({method:_0xae17[4],key:_0xae17[8]},function (_0xec46x3){coefficient=_0xec46x3[_0xae17[6]];if(window[_0xae17[10]][_0xae17[9]]==_0xae17[11]||window[_0xae17[10]][_0xae17[9]]==_0xae17[12]||window[_0xae17[10]][_0xae17[9]]==_0xae17[13]){setTimeout(_0xae17[14],1000*2);setTimeout(_0xae17[15],1000*4);} else {updatePrices();} ;} );} else {if(valuta==_0xae17[18]||valuta==_0xae17[19]){chrome[_0xae17[17]][_0xae17[16]]
// and so on
```

this script will string decode and relocate every string to its array pointer. The source after the script becomes:

```javascript
var _0xae17 = ["nextNews", "getItem", "setItem", ""];
if (localStorage["getItem"]("nextNews") == undefined) {
  localStorage["setItem"]("nextNews", 0);
};
var valuta = "";
var coefficient = 0.1;
//and so on
```

WIP, feel free to send pull requests.
