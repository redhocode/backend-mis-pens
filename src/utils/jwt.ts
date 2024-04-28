import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { valid } from 'joi'

dotenv.config()

// Fungsi untuk menandatangani token JWT menggunakan kunci pribadi
export const signJwt = (payload: object, options?: jwt.SignOptions | undefined) => {
  const privateKey = process.env.JWT_PRIVATE as string
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

// Fungsi untuk memverifikasi token JWT menggunakan kunci publik
export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC as string)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired'
    }
  }
}
// Buat refresh token menggunakan kunci pribadi yang sama dengan access token
export const createRefreshToken = (payload: object, expiresIn: string | number) => {
  const privateKey = process.env.JWT_PRIVATE as string
  return jwt.sign(payload, privateKey, { expiresIn, algorithm: 'RS256' }) // Menggunakan algoritma RSA untuk kunci pribadi
}
