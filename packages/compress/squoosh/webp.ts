import path from 'node:path'
import fs from 'fs-extra'

import { consola } from 'consola'
import { green, yellow } from 'picocolors'
import { compress, filter } from './utils'

/**
 * Compress file to webp
 * @param file
 */
export async function compressFileToWebp(filepath: string, targetFolder?: string) {
  if (!filter(filepath))
    return

  consola.start('[Squoosh] compress', yellow(filepath))
  const raw = await compress(filepath, 'webp', {
    webp: {
      quality: 90,
    },
  })
  if (!raw)
    return

  if (targetFolder) {
    const filename = path.basename(filepath)
    const fileArray = filename.split('.')
    fileArray.pop()
    fileArray.push('webp')

    const targetFilename = fileArray.join('.')
    await fs.outputFile(`${targetFolder}/${targetFilename}`, raw, {})

    consola.success(`[Squoosh] compress ${green(path.resolve(targetFolder, targetFilename))}`)
  }
}
