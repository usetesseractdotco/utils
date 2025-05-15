import bcrypt from 'bcryptjs'

export async function hashPassword(password: string, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds)
}
