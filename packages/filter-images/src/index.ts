import path from 'node:path'
import fs from 'fs-extra'
import consola from 'consola'
import * as pc from 'picocolors'
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
    return keywords.map(i => simplifyName(i)).sort()
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
      ).sort(),
    )

  const files = await fs.readdir(config.sourceFolder)

  await fs.ensureDir(config.matchedFolder)
  await fs.ensureDir(config.notMatchedFolder)
  await fs.ensureDir(config.repeatedFolder)

  const matchedKeywords: string[][] = []

  let order = 1
  files.forEach(async (filename, i) => {
    const keywords = getKeywords(filename)
    const matched = words.some(i => i.join(',') === keywords.join(','))

    if (matched) {
      // Remove the matched word
      words = words.filter((i) => {
        return !(i.join(',') === keywords.join(','))
      })

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
      // console.log(i, order, keywords)

      consola.success(pc.cyan(i), 'Matched', pc.green(keywords.toString()), filename)
      await fs.copyFile(
        path.resolve(config.sourceFolder, filename),
        path.resolve(config.matchedFolder, filename),
      )
      order += 1
    }
    else {
      consola.error(pc.cyan(i), 'Not matched', pc.yellow(keywords.toString()), filename)
      await fs.copyFile(
        path.resolve(config.sourceFolder, filename),
        path.resolve(config.notMatchedFolder, filename),
      )
    }
  })

  await fs.writeFile(path.resolve(config.assetsFolder, 'unmatched-words.txt'), words.join('\n'))
}

main()
