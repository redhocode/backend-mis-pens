import { hashPassword, checkPassword } from '../utils/hashing' // Sesuaikan dengan lokasi file hashing.ts
describe('Hashing', () => {
  const plainPassword = 'password123'
  let hashedPassword: string

  beforeAll(async () => {
    hashedPassword = await hashPassword(plainPassword)
  })

  it('Hashing password should return a string', () => {
    expect(hashedPassword).toBeDefined()
    expect(typeof hashedPassword).toBe('string')
  })

  it('Validating password should return true for correct password', async () => {
    const isValid = await checkPassword(plainPassword, hashedPassword)
    expect(isValid).toBe(true)
  })

  it('Validating password should return false for incorrect password', async () => {
    const isValid = await checkPassword('incorrectPassword', hashedPassword)
    expect(isValid).toBe(false)
  })
})
