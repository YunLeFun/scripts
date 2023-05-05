import fs from 'fs-extra'
import { config } from './config'

export async function clean() {
  await fs.remove(config.distFolder)
}

clean()
