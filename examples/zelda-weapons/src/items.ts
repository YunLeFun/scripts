import path from 'node:path'
import fs from 'fs-extra'
import { consola } from 'consola'
import { compressFileToJpg, imagePool } from '../../../packages/compress/squoosh/utils'
import { itemList } from './data'

const assetsFolder = path.resolve(__dirname, '../assets')
const compressedFolder = path.resolve(__dirname, '../compressed')
const distFolder = path.resolve(__dirname, '../dist')

async function getFiles(folder: string) {
  const files = await fs.readdir(folder)
  return files.filter(file => !file.startsWith('.'))
}

async function compress() {
  await fs.ensureDir(compressedFolder)
  const files = await getFiles(distFolder)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    const newPath = path.resolve(distFolder, file)
    await compressFileToJpg(newPath, compressedFolder)
    consola.success('compress', newPath)
  }
}

/**
 * simplify filename for dist folder and compress to jpg for compressed folder
 */
export async function main() {
  await fs.ensureDir(distFolder)

  const files = await getFiles(assetsFolder)

  await Promise.all(files.map(async (file, i) => {
    const filename = file.toLowerCase().replaceAll(' ', '-')
    const includeItems: string[] = []
    itemList.forEach((item) => {
      if (filename.includes(item.key))
        includeItems.push(item.key)
    })
    console.log(filename, includeItems)
    const oldPath = path.resolve(assetsFolder, file)

    if (includeItems.length !== 2) {
      consola.error('skip', filename, includeItems)
      return
    }

    const newPath = path.resolve(distFolder, includeItems.sort().join('_') + path.extname(file))

    if (fs.existsSync(newPath)) {
      consola.error('skip', newPath)
      return
    }

    console.log(i)
    return fs.copyFile(oldPath, newPath)
  }))

  await compress()
  imagePool.close()
}

main()
