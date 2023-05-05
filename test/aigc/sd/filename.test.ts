import { describe, expect, test } from 'vitest'
import { getKeywords } from '../../../packages/filename/utils'

// /\[(\w+)(?:_(\d+\.\d+))?_(\w+)(?:_(\d+\.\d+))?\]/

describe('getKeywords', () => {
  test('should return keywords', () => {
    expect(
      getKeywords('62102-2367167509-[dice_Black iron pan_0.5]sword, Battlefield and Sky Background, purism, ue 5, a computer reandering, octane render, wide shot, m.png',
      )).toStrictEqual(['black-iron-pan', 'dice'])

    expect(
      getKeywords('62102-2367167509-[dice_0.5_Black iron pan]sword, Battlefield and Sky Background, purism, ue 5, a computer reandering, octane render, wide shot, m.png',
      )).toStrictEqual(['black-iron-pan', 'dice'])

    expect(
      getKeywords('62102-2367167509-[dice_Black iron pan]sword, Battlefield and Sky Background, purism, ue 5, a computer reandering, octane render, wide shot, m.png',
      )).toStrictEqual(['black-iron-pan', 'dice'])
  })
})
