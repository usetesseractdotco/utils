import { z } from 'zod'

const oneUpperCaseLetterRegex = /[A-Z]/
const oneLowerCaseLetterRegex = /[a-z]/
const oneNumberRegex = /\d/
const oneSpecialCharacterRegex = /[!@#$%^&*]/

/**
 * Zod schema for validating passwords with the following requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 *
 * @type {z.ZodString}
 */
export const passwordSchema = z
  .string()
  .min(8, {
    message: 'The password is required and must be at least 8 characters long.',
  })
  .regex(oneUpperCaseLetterRegex, 'At least one uppercase letter is required')
  .regex(oneLowerCaseLetterRegex, 'At least one lowercase letter is required')
  .regex(oneNumberRegex, 'At least one number is required')
  .regex(oneSpecialCharacterRegex, 'At least one special character is required')
