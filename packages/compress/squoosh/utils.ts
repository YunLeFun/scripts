import fs from 'node:fs/promises'
import { ImagePool } from '@squoosh/lib'

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
