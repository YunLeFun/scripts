import { consola } from 'consola'
import { yellow } from 'picocolors'
import { compress, filter, outputCompressedFile } from './utils'

/**
 * Compress file to webp
 * @param file
 * @todo
 */
export async function compressFileToPng(filepath: string, targetFolder?: string) {
  if (!filter(filepath))
    return

  consola.start('[Squoosh] compress', yellow(filepath))
  const raw = await compress(filepath, 'webp', {
    // oxipng: {
    //   level: 6,
    // },
  })
  if (!raw)
    return

  if (targetFolder)
    outputCompressedFile('webp', filepath, raw, targetFolder)
}
