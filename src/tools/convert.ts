const dict = {
  '\'': { uey: 'ئ', uyy: '\'', uly: '\'' },
  a: { uey: 'ا', uyy: 'a', uly: 'a' },
  e: { uey: 'ە', uyy: 'ə', uly: 'e' },
  b: { uey: 'ب', uyy: 'b', uly: 'b' },
  p: { uey: 'پ', uyy: 'p', uly: 'p' },
  t: { uey: 'ت', uyy: 't', uly: 't' },
  j: { uey: 'ج', uyy: 'j', uly: 'j' },
  ch: { uey: 'چ', uyy: 'q', uly: 'ch' },
  x: { uey: 'خ', uyy: 'h', uly: 'x' },
  d: { uey: 'د', uyy: 'd', uly: 'd' },
  r: { uey: 'ر', uyy: 'r', uly: 'r' },
  z: { uey: 'ز', uyy: 'z', uly: 'z' },
  zh: { uey: 'ژ', uyy: 'ⱬ', uly: 'zh' },
  s: { uey: 'س', uyy: 's', uly: 's' },
  sh: { uey: 'ش', uyy: 'x', uly: 'sh' },
  gh: { uey: 'غ', uyy: 'ƣ', uly: 'gh' },
  f: { uey: 'ف', uyy: 'f', uly: 'f' },
  q: { uey: 'ق', uyy: 'ⱪ', uly: 'q' },
  k: { uey: 'ك', uyy: 'k', uly: 'k' },
  g: { uey: 'گ', uyy: 'g', uly: 'g' },
  ng: { uey: 'ڭ', uyy: 'ng', uly: 'ng' },
  l: { uey: 'ل', uyy: 'l', uly: 'l' },
  m: { uey: 'م', uyy: 'm', uly: 'm' },
  n: { uey: 'ن', uyy: 'n', uly: 'n' },
  h: { uey: 'ھ', uyy: 'ⱨ', uly: 'h' },
  o: { uey: 'و', uyy: 'o', uly: 'o' },
  u: { uey: 'ۇ', uyy: 'u', uly: 'u' },
  oe: { uey: 'ۆ', uyy: 'ɵ', uly: 'ö' },
  ue: { uey: 'ۈ', uyy: 'ü', uly: 'ü' },
  w: { uey: 'ۋ', uyy: 'w', uly: 'w' },
  ee: { uey: 'ې', uyy: 'e', uly: 'ë' },
  i: { uey: 'ى', uyy: 'i', uly: 'i' },
  y: { uey: 'ي', uyy: 'y', uly: 'y' },

  ',': { uey: '،', uyy: ',', uly: ',' },
  '-': { uey: 'ـ', uyy: '-', uly: '-' },
  ';': { uey: '؛', uyy: ';', uly: ';' },
  '?': { uey: '؟', uyy: '?', uly: '?' }
} as const

type ScriptType = keyof typeof dict.a

export function convert (str: string, from: ScriptType, to: ScriptType) {
  if (from === to) return str
  const strArr = [...str]
  const ret = strArr.map((v, i) => {
    let extraPrefix = '' // Used for hemze
    let isUpper = false
    let matcher = v
    if (from === 'uly' && matcher === 'é') matcher = 'ë' // Old style
    if (to === 'uey') { // Add hemze for initial vowels
      matcher = matcher.toLowerCase()
      if (
        i === 0 ||
        (
          strArr[i - 1].toLowerCase() === strArr[i - 1].toUpperCase() && strArr[i - 1] !== '' &&
          strArr[i - 1] !== '\''
        )
      ) {
        if (['a', 'e', 'i', 'o', 'u', 'ə', 'ɵ', 'ö', 'ü', 'ë'].indexOf(matcher) > -1) extraPrefix = 'ئ'
      }
    } else { // Record upper case letters for later recovery
      if (matcher !== matcher.toLowerCase()) isUpper = true
      matcher = matcher.toLowerCase()
    }
    if (strArr[i + 1]) { // Match diphthongs
      if (from === 'uly') {
        if (v.toLowerCase() === 'c' && strArr[i + 1].toLowerCase() === 'h') { matcher = 'ch'; strArr[i + 1] = '' }
        if (v.toLowerCase() === 'z' && strArr[i + 1].toLowerCase() === 'h') { matcher = 'zh'; strArr[i + 1] = '' }
        if (v.toLowerCase() === 's' && strArr[i + 1].toLowerCase() === 'h') { matcher = 'sh'; strArr[i + 1] = '' }
        if (v.toLowerCase() === 'g' && strArr[i + 1].toLowerCase() === 'h') { matcher = 'gh'; strArr[i + 1] = '' }
        if (v.toLowerCase() === 'n' && strArr[i + 1].toLowerCase() === 'g') { matcher = 'ng'; strArr[i + 1] = '' }
        if (v.toLowerCase() === 'n' && strArr[i + 1] === '\'' && strArr[i + 2] && strArr[i + 2].toLowerCase() === 'g' && to === 'uey') { // deal with ng'h and n'gh
          console.log('delete \'', from, to)
          strArr[i + 1] = ''
        }
      }
      if (from === 'uyy') {
        if (v.toLowerCase() === 'n' && strArr[i + 1].toLowerCase() === 'g') { matcher = 'ng'; strArr.splice(i + 1, 1) }
        if (v.toLowerCase() === 'n' && strArr[i + 1] === '\'' && strArr[i + 2] && strArr[i + 2].toLowerCase() === 'g' && to === 'uey') { // deal with ng'h and n'gh
          console.log('delete \'')
          strArr[i + 1] = ''
        }
      }
    }
    for (const [index, item] of Object.entries(dict)) { // Perform dict matching
      if (item[from] === matcher) return extraPrefix + (isUpper ? item[to].toUpperCase() : item[to])
    }
    return v
  })
  ret.map((v, i) => { // Delete extra (')s
    if (v === '\'' && (i === 0 || ret[i - 1].toUpperCase() === ret[i - 1].toLowerCase())) {
      ret.splice(i, 1)
    }
  })
  // console.log(ret)
  return ret.join('')
}
