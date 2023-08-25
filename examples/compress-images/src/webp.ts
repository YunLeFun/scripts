import { resolve } from 'node:path'
import fs from 'fs-extra'
import consola from 'consola'
import { compressFileToWebp, imagePool } from '../../../packages/compress/squoosh'
import config from '../config'

/**
 * 遍历压缩文件夹
 * @param folder
 */
async function compressFolder(srcFolder: string, targetFolder: string) {
  const files = await fs.readdir(srcFolder, { withFileTypes: true, recursive: true })
  for (let index = 0; index < files.length; index++) {
    const file = files[index]
    const srcPath = resolve(srcFolder, file.name)
    const targetPath = resolve(targetFolder, file.name)

    if (file.isDirectory())
      await compressFolder(srcPath, targetPath)
    else
      await compressFileToWebp(srcPath, targetFolder)
  }
}

async function main() {
  // 清空目标文件夹
  fs.emptyDirSync(config.targetFolder)
  fs.ensureDirSync(config.targetFolder)

  consola.start('[Squoosh] compress:webp')
  await compressFolder(config.srcFolder, config.targetFolder)
  await imagePool.close()
}

main()
