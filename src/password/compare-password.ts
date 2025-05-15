import bcrypt from 'bcryptjs'

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} password - The plain text password to check
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword)
}
