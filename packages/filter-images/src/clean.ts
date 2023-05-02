import fs from 'fs-extra'
import { config } from './config'

export async function clean() {
  await fs.remove(config.matchedFolder)
  await fs.remove(config.notMatchedFolder)
  await fs.remove(config.repeatedFolder)
}

clean()
