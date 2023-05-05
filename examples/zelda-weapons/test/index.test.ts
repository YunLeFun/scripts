import { describe, expect, test } from 'vitest'
import { simplifyFileName } from '../src/utils'

describe('zelda-weapons', () => {
  test('simplify filename', () => {
    expect(simplifyFileName('61127-2530291012-[guitar_ice cream_0.5]sword, Battlefield and Sky Background, purism, ue 5, a computer reandering, octane render, wide shot, mini.png')).toBe('sword.guitar_ice-cream.png')
  })
})
