import path from 'node:path'
import fs from 'fs-extra'
import { ImagePool } from '@squoosh/lib'
import consola from 'consola'

export const imagePool = new ImagePool(2)

export async function compress(filename: string) {
  const imagePath = `${filename}`
  const file = await fs.readFile(imagePath)
  const image = imagePool.ingestImage(file)

  await image.decoded // Wait until the image is decoded before running preprocessors.

  // default
  const preprocessOptions = {}
  await image.preprocess(preprocessOptions)

  const encodeOptions = {
    mozjpeg: {
      quality: 90,
    },
  }
  await image.encode(encodeOptions)

  const rawEncodedImage = image.encodedWith.mozjpeg?.binary
  return rawEncodedImage
}

/**
 * 根据名称判断是否为图片
 * @param filename
 */
export function isImage(filename: string) {
  const suffixNames = ['png', 'jpg', 'jpeg']

  for (let i = 0; i < suffixNames.length; i++) {
    const suffix = suffixNames[i]
    if (filename.endsWith(suffix))
      return true
  }

  return false
}

export function filter(filename: string) {
  return !filename.startsWith('.') && isImage(filename)
}

/**
 * Compress file to jpg
 * @param file
 */
export async function compressFileToJpg(filepath: string, targetFolder?: string) {
  if (!filter(filepath))
    return

  consola.start('[Squoosh] compress', filepath)
  const raw = await compress(filepath)
  if (!raw)
    return

  if (targetFolder) {
    const filename = path.basename(filepath)
    const fileArray = filename.split('.')
    fileArray.pop()
    fileArray.push('jpg')

    const targetFilename = fileArray.join('.')
    await fs.outputFile(`${targetFolder}/${targetFilename}`, raw, {})

    consola.success(`[Squoosh] compress ${targetFilename}`)
  }
}
