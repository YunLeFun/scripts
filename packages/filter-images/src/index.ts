import path from 'node:path'
import fs from 'fs-extra'
import consola from 'consola'
import { config } from './config'

/**
 * Remove spaces and convert to lowercase
 * @param name
 * @returns
 */
function simplifyName(name: string) {
  return name.toLowerCase().trim().replace(/ {2}/g, '-').replace(/ /g, '-')
}

function getKeywords(filename: string) {
  const regex = /\[(.*?)\]/
  const matches = filename.match(regex)
  if (matches) {
    const keywords = matches[1].split('_')
    return keywords.map(i => simplifyName(i))
  }
  else {
    consola.error('No matches found', filename)
    return []
  }
}

export async function main() {
  const wordsTxt = await fs.readFile(path.resolve(config.assetsFolder, 'words.txt'), 'utf-8')
  let words = wordsTxt.split('\n').filter(Boolean)
    .map(i =>
      i.split(',').map(j =>
        simplifyName(j),
      ),
    )

  const files = await fs.readdir(config.sourceFolder)

  await fs.ensureDir(config.matchedFolder)
  await fs.ensureDir(config.notMatchedFolder)
  await fs.ensureDir(config.repeatedFolder)

  const matchedKeywords: string[][] = []

  files.forEach(async (filename) => {
    const keywords = getKeywords(filename)
    const matched = words.some(i => i.includes(keywords[0]) && i.includes(keywords[1]))

    if (matched) {
      // Remove the matched word
      words = words.filter(i => !(i.includes(keywords[0]) && i.includes(keywords[1])))

      // Check if the keywords are already matched
      // if (matchedKeywords.some(i => i.includes(keywords[0]) && i.includes(keywords[1]))) {
      //   consola.error('Not matched', filename)
      //   await fs.copyFile(
      //     path.resolve(config.sourceFolder, filename),
      //     path.resolve(config.repeatedFolder, filename),
      //   )
      //   return
      // }

      matchedKeywords.push(keywords)

      consola.success('Matched', filename)
      await fs.copyFile(
        path.resolve(config.sourceFolder, filename),
        path.resolve(config.matchedFolder, filename),
      )
    }
    else {
      consola.error('Not matched', filename)
      await fs.copyFile(
        path.resolve(config.sourceFolder, filename),
        path.resolve(config.notMatchedFolder, filename),
      )
    }
  })

  await fs.writeFile(path.resolve(config.assetsFolder, 'unmatched-words.txt'), words.join('\n'))
}

main()
