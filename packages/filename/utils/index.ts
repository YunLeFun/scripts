import consola from 'consola'

/**
 * Remove spaces and convert to lowercase
 * @param name
 * @returns
 */
export function simplifyName(name: string) {
  return name.toLowerCase().trim()
    .replace(/ {2}/g, '-').replace(/ /g, '-')
    .replace('(', '').replace(')', '')
}

/**
 * 获取 [] 中的字符
 * @param filename
 */
export function getKeyInfo(filename: string) {
  const regex = /\[(.*?)\]/
  const matches = filename.match(regex)
  if (matches) {
    return matches[1]
  }
  else {
    consola.error('No matches found', filename)
    return ''
  }
}

/**
 * @description [dice_Black iron pan_0.5] -> ['black-iron-pan', 'dice']
 * @param filename
 * @returns
 */
export function getKeywords(filename: string) {
  const info = getKeyInfo(filename)

  const keywords = info.split('_').filter(i => isNaN(parseFloat(i)))
  return keywords.map(i => simplifyName(i)).sort()
}
