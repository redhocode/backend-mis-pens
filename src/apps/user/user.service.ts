// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya

import { findUsers, findUsersById, editUser, deleteUser, findUserByusername } from './user.repository'

import { UserData, User } from './user.repository'
import { createSessionValidation, createUserValidation } from './user.validation'
import { checkPassword, hashPassword } from '../../utils/hashing'
import { logger } from '../../utils/logger'
import { signJwt } from '../../utils/jwt'
import { createRefreshToken } from '../../utils/jwt'
import prisma from '../../db'
const getAllUsers = async (): Promise<User[]> => {
  const users = await findUsers()
  return users
}

const getUserById = async (id: string): Promise<User> => {
  const user = await findUsersById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

const createUser = async (userData: UserData): Promise<User> => {
  const { error, value } = createUserValidation(userData)
  if (error) {
    throw new Error(error.details[0].message)
  }

  try {
    // Menggunakan password yang sudah di-hash
    // value.password = await hashPassword(value.password)

    // Mengembalikan data user yang baru saja dibuat
    return value.password
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const editUserById = async (id: string, userData: UserData): Promise<User> => {
  const { error, value } = createUserValidation(userData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  const user = await editUser(id, userData)
  return user
}

const deleteUserById = async (id: string): Promise<void> => {
  await getUserById(id)
  await deleteUser(id)
}
/**
 * @param  {UserData} userData
 * @return {Promise<User>}
 */
const createSession = async (userData: UserData): Promise<User> => {
  const { error, value } = createSessionValidation(userData)
  if (error) {
    throw new Error('Invalid input data')
  }
  try {
    // Cari pengguna berdasarkan nama pengguna
    const user = await findUserByusername(value.username)
    if (!user) {
      throw new Error('User not found')
    }

    // Periksa apakah kata sandi cocok
    if (!user.password) {
      throw new Error('User password is null or undefined')
    }
    const isPasswordValid = await checkPassword(value.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    // Autentikasi berhasil, kembalikan data pengguna yang diotentikasi
    const accessToken = signJwt({ userId: user.id })

    // Buat refresh token
    const refreshToken = createRefreshToken({ userId: user.id }, process.env.JWT_REFRESH_EXPIRATION || '7d')

    // Kembalikan pengguna bersama dengan token
    return { ...user }
  } catch (error: any) {
    console.error('Authentication failed:', error)
    throw new Error('Authentication failed: ' + error.message)
  }
}

export { createSession, getAllUsers, getUserById, createUser, editUserById, deleteUserById }
