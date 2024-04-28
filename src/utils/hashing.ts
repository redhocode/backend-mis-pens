import bcrypt from 'bcrypt'

/**
 * Hash a password
 * @param password The password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  } catch (error: any) {
    throw new Error('Error hashing password: ' + error.message)
  }
}

/**
 * Check if a password matches the user's password hash
 * @param password The password to compare
 * @param userPassword The hashed user password
 * @returns True if the passwords match, false otherwise
 */
export const checkPassword = async (password: string, userPassword: string): Promise<boolean> => {
  try {
    const passwordMatch = await bcrypt.compare(password, userPassword)
    return passwordMatch
  } catch (error: any) {
    throw new Error('Error comparing passwords: ' + error.message)
  }
}
