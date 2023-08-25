import fs from 'fs-extra'

import { consola } from 'consola'
import config from '../config'
import { compress, filter, imagePool } from '../../../packages/compress/squoosh'

async function run() {
  const files = await fs.readdir(config.srcFolder)

  for (let index = 0; index < files.length; index++) {
    const filename = files[index]

    if (!filter(filename))
      continue

    consola.start('[Squoosh] compress', filename)

    const raw = await compress(`${config.srcFolder}/${filename}`)
    if (!raw)
      continue

    const fileArray = filename.split('.')
    fileArray.pop()
    fileArray.push('jpg')
    const targetFilename = fileArray.join('.')
    await fs.outputFile(`${config.targetFolder}/${targetFilename}`, raw, {})
    consola.success(`[Squoosh] compress ${targetFilename}`)
  }

  await imagePool.close()
}

run()
