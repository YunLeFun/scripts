import path from 'node:path'

export const config = {
  assetsFolder: path.resolve(__dirname, '../assets'),
  sourceFolder: path.resolve(__dirname, '../assets/sword01'),
  matchedFolder: path.resolve(__dirname, '../matched'),
  notMatchedFolder: path.resolve(__dirname, '../unmatched'),
  repeatedFolder: path.resolve(__dirname, '../repeated'),
}
