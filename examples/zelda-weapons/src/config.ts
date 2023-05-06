import path from 'node:path'

export const config = {
  distFolder: path.resolve(__dirname, '../dist'),
  assetsFolder: path.resolve(__dirname, '../assets'),
  compressedFolder: path.resolve(__dirname, '../compressed'),
}
