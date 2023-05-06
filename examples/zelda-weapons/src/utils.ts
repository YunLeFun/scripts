import path from 'node:path'
import fs from 'fs-extra'
import { getKeywords, simplifyName } from '../../../packages/filename/utils'

/**
 * sword
 * @param filename
 * @returns
 */
export function getWeaponType(filename: string) {
  const regex = /](.*?),/
  const matches = filename.match(regex)
  if (matches)
    return simplifyName(matches[1]).split('_')[0]

  else
    return ''
}

export function simplifyFileName(filename: string) {
  const type = getWeaponType(filename)
  const keywords = getKeywords(filename)

  const ext = path.extname(filename)

  return `${type}.${keywords.join('_')}${ext}`
}

export async function getFiles(folder: string) {
  const files = await fs.readdir(folder)
  return files.filter(file => !file.startsWith('.'))
}
