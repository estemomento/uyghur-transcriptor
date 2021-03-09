const dict = [
  { uey: 'ئ', uyy: '\'', uly: '\'' },
  { uey: 'ا', uyy: 'a', uly: 'a' },
  { uey: 'ە', uyy: 'ə', uly: 'e' },
  { uey: 'ب', uyy: 'b', uly: 'b' },
  { uey: 'پ', uyy: 'p', uly: 'p' },
  { uey: 'ت', uyy: 't', uly: 't' },
  { uey: 'ج', uyy: 'j', uly: 'j' },
  { uey: 'چ', uyy: 'q', uly: 'ch' },
  { uey: 'خ', uyy: 'h', uly: 'x' },
  { uey: 'د', uyy: 'd', uly: 'd' },
  { uey: 'ر', uyy: 'r', uly: 'r' },
  { uey: 'ز', uyy: 'z', uly: 'z' },
  { uey: 'ژ', uyy: 'ⱬ', uly: 'zh' },
  { uey: 'س', uyy: 's', uly: 's' },
  { uey: 'ش', uyy: 'x', uly: 'sh' },
  { uey: 'غ', uyy: 'ƣ', uly: 'gh' },
  { uey: 'ف', uyy: 'f', uly: 'f' },
  { uey: 'ق', uyy: 'ⱪ', uly: 'q' },
  { uey: 'ك', uyy: 'k', uly: 'k' },
  { uey: 'گ', uyy: 'g', uly: 'g' },
  { uey: 'ڭ', uyy: 'ng', uly: 'ng' },
  { uey: 'ل', uyy: 'l', uly: 'l' },
  { uey: 'م', uyy: 'm', uly: 'm' },
  { uey: 'ن', uyy: 'n', uly: 'n' },
  { uey: 'ھ', uyy: 'ⱨ', uly: 'h' },
  { uey: 'و', uyy: 'o', uly: 'o' },
  { uey: 'ۇ', uyy: 'u', uly: 'u' },
  { uey: 'ۆ', uyy: 'ɵ', uly: 'ö' },
  { uey: 'ۈ', uyy: 'ü', uly: 'ü' },
  { uey: 'ۋ', uyy: 'w', uly: 'w' },
  { uey: 'ې', uyy: 'e', uly: 'ë' },
  { uey: 'ى', uyy: 'i', uly: 'i' },
  { uey: 'ي', uyy: 'y', uly: 'y' },

  { uey: '،', uyy: ',', uly: ',' },
  { uey: 'ـ', uyy: '-', uly: '-' }
] as const

type ScriptType = keyof typeof dict[0]

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
    for (const item of dict) { // Perform dict matching
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
