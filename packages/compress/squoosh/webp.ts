import fs from 'fs-extra'

import { consola } from 'consola'
import { compress, filter, imagePool } from './utils'
import config from './config'

async function run() {
  consola.start('[Squoosh] compress:webp')
  const files = await fs.readdir(config.srcFolder)

  for (let index = 0; index < files.length; index++) {
    const filename = files[index]

    if (!filter(filename))
      continue

    consola.start('[Squoosh] compress', filename)

    const raw = await compress(`${config.srcFolder}/${filename}`, 'webp', {
      webp: {
        quality: 90,
      },
    })
    if (!raw)
      continue

    const fileArray = filename.split('.')
    fileArray.pop()
    fileArray.push('webp')
    const targetFilename = fileArray.join('.')
    await fs.outputFile(`${config.targetFolder}/${targetFilename}`, raw, {})
    consola.success(`[Squoosh] compress ${targetFilename}`)
  }

  await imagePool.close()
}

run()
