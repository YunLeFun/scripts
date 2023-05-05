import path from 'node:path'
import fs from 'fs-extra'
import { compressFileToJpg } from '../../../packages/compress/squoosh/utils'
import { simplifyFileName } from './utils'

const assetsFolder = path.resolve(__dirname, '../assets')
const compressedFolder = path.resolve(__dirname, '../compressed')
const distFolder = path.resolve(__dirname, '../dist')

/**
 * simplify filename for dist folder and compress to jpg for compressed folder
 */
export async function main() {
  await fs.ensureDir(distFolder)
  await fs.ensureDir(compressedFolder)

  const files = await fs.readdir(assetsFolder)

  files.map(async (file) => {
    return new Promise((resolve, reject) => {
      const oldPath = path.resolve(assetsFolder, file)
      const newPath = path.resolve(distFolder, simplifyFileName(file))

      try {
        Promise.all([fs.copyFile(oldPath, newPath), compressFileToJpg(newPath, compressedFolder)]).then(() => {
          resolve(newPath)
        })
      }
      catch (e) {
        reject(e)
      }
    })
  })

  await Promise.all(files)
}

main()
