import bcrypt from 'bcryptjs'

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The plain text password to hash
 * @param {number} saltRounds - The number of salt rounds to use (default: 10)
 * @returns {Promise<string>} A promise that resolves to the hashed password
 */
export async function hashPassword(password: string, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds)
}
