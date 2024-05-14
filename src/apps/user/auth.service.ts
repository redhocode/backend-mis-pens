import UserType from './auth.type'
import prisma from '../../db'
import { createUserValidation } from './auth.validation'

export const createUser = async (userData: UserType) => {
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password,
      role: userData.role
    }
  })
  return user
}

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  return user
}
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    // Handle error jika terjadi kesalahan saat mengakses database
    console.error('Error while getting all users:', error)
    throw error // Anda dapat menangani atau melemparkan error sesuai kebutuhan aplikasi
  }
}

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })
  return user
}

export const deleteUserById = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id
    }
  })
  return user
}

export const editUserById = async (id: string, userData: UserType) => {
  const user = await prisma.user.update({
    where: {
      id
    },
    data: {
      ...userData
    }
  })
  return user
}

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })
  return user
}
