import path from 'node:path'
import fs from 'fs-extra'
import { consola } from 'consola'
import { compressFileToJpg, imagePool } from '../../../packages/compress/squoosh/utils'
import { itemList } from './data'

const assetsFolder = path.resolve(__dirname, '../assets')
const compressedFolder = path.resolve(__dirname, '../compressed')
const distFolder = path.resolve(__dirname, '../dist')
const repeatedFolder = path.resolve(__dirname, '../repeated')

async function getFiles(folder: string) {
  const files = await fs.readdir(folder)
  return files.filter(file => !file.startsWith('.'))
}

async function compress() {
  await fs.ensureDir(compressedFolder)
  await fs.ensureDir(repeatedFolder)
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

  const itemsSet = new Set<string>()
  itemList.forEach((x) => {
    itemList.forEach((y) => {
      if (x.key !== y.key)
        itemsSet.add([x.key, y.key].sort().join('_'))
    })
  })

  await Promise.all(files.map(async (file, _i) => {
    const filename = file.toLowerCase().replaceAll(' ', '-')
    const includeItems: string[] = []
    itemList.forEach((item) => {
      if (filename.includes(item.key))
        includeItems.push(item.key)
    })
    const oldPath = path.resolve(assetsFolder, file)

    if (includeItems.length !== 2) {
      consola.error('skip', filename, includeItems)
      return
    }

    const newFilename = includeItems.sort().join('_')
    const newPath = path.resolve(distFolder, newFilename + path.extname(file))

    if (fs.existsSync(oldPath) && fs.existsSync(newPath)) {
      consola.error('skip', newPath)
      await fs.copyFile(oldPath, path.resolve(repeatedFolder, newFilename + path.extname(file)))
      return
    }

    if (!itemsSet.has(newFilename))
      consola.error(newFilename)

    itemsSet.delete(newFilename)

    await fs.copyFile(oldPath, newPath)
    return true
  }))

  await compress()
  imagePool.close()

  // eslint-disable-next-line no-console
  console.log(itemsSet)
}

main()
