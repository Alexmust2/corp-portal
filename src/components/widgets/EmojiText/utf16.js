export function toUtf16Array(s) {
    let i = 0;
    let len = s.length;
    let chars = [];
    while (i < len) {
      let s1 = s.charCodeAt(i++);
      if (s1 < 0xd800 || s1 > 0xdfff) {
        chars.push(s1);
        continue;
      } else {
        let s2 = s.charCodeAt(i++);
        let a = (s1 - 0xd800) << 10;
        let b = s2 - 0xdc00;
        chars.push(0x10000 + a + b);
      }
    }
    return chars;
  }
  
  export function fromUtf16Array(a) {
    let chars = [];
    a.forEach(u => {
      if (u < 0x10000 && (u < 0xd800 || u >= 0xe000)) chars.push(u);
      else {
        u -= 0x10000;
        let a = u >> 10;
        let b = u & 0x3ff;
        chars.push(0xd800 + a, 0xdc00 + b);
      }
    });
    return chars.map(c => String.fromCharCode(c)).join("");
  }
  