import path from 'node:path'
import { getKeywords } from '../../../packages/filename/utils'

/**
 * sword
 * @param filename
 * @returns
 */
export function getWeaponType(filename: string) {
  const regex = /](.*?),/
  const matches = filename.match(regex)
  if (matches)
    return matches[1]

  else
    return ''
}

export function simplifyFileName(filename: string) {
  const type = getWeaponType(filename)
  const keywords = getKeywords(filename)

  const ext = path.extname(filename)

  return `${type}.${keywords.join('_')}${ext}`
}
