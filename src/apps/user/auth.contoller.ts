import { Request, Response } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from './auth.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../../utils/logger'
import { checkPassword, hashPassword } from '../../utils/hashing'
import { createUser, deleteUserById, editUserById, findUserById, findUserByUsername, getAllUsers } from './auth.service'
import UserType from './auth.type'
import { signJwt, verifyJwt } from '../../utils/jwt'
export const registerUser = async (req: Request, res: Response) => {
  const id = uuidv4()
  const { error, value } = createUserValidation(req.body)
  if (error) {
    logger.error(`error validating user data: ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    // Hashing the password before saving it
    const hashedPassword = await hashPassword(value.password, 10) // 10 is the saltRounds
    value.password = hashedPassword

    await createUser(value)
    return res.status(200).send({ status: true, statusCode: 200, message: 'User created successfully' })
  } catch (err: any) {
    logger.error(`Error creating user: ${err.message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: err.message })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)

  if (error) {
    logger.error(`Error validating user data: ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const user: any = await findUserByUsername(value.username)

    if (user === null) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'User not found' })
    }

    const isValid = await checkPassword(value.password, user.password)

    if (!isValid) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid credentials' })
    }

    const accessToken = signJwt({ ...user }, { expiresIn: '1h' })
    const refreshToken = signJwt({ ...user }, { expiresIn: '7d' })
    //console.log('Respons login:', { accessToken, refreshToken })
    logger.info('Login successful')

    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Login successful', data: { accessToken, refreshToken } })
  } catch (error: any) {
    logger.error(`Error finding user: ${error.message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body)

  if (error) {
    logger.error(`error validating user data: ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    const { decoded }: any = verifyJwt(value.refreshToken)
    const user = await findUserByUsername(decoded.username)
    if (!user) return false

    const accessToken = signJwt({ ...user }, { expiresIn: '1d' })
    return res.status(200).send({ status: true, statusCode: 200, message: 'Refresh successful', data: { accessToken } })
  } catch (error: any) {
    logger.error(`Error finding user: ${error.message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers()
    logger.info('Get all users success')
    res.status(200).send(users)
  } catch (error: any) {
    logger.error(`Error finding users: ${error.message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await findUserByUsername(req.params.username)
    return res.status(200).send({ status: true, statusCode: 200, data: user })
  } catch (error: any) {
    logger.error(`Error finding user: ${error.message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const user = await findUserById(userId)
    if (!user) {
      return res.status(404).send({ status: false, statusCode: 404, message: 'User not found' })
    }
    await deleteUserById(userId)
    return res.status(200).send({ status: true, statusCode: 200, message: 'User deleted successfully' })
  } catch (error: any) {
    logger.error(`Error deleting user: ${error.message}`)
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const user = await findUserById(userId)
    if (!user) {
      return res.status(404).send({ status: false, statusCode: 404, message: 'User not found' })
    }
    const updatedUser = await editUserById(userId, req.body)
    return res.status(200).send({ status: true, statusCode: 200, data: updatedUser })
  } catch (error: any) {
    logger.error(`Error updating user: ${error.message}`)
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
}
export const logout = async (req: Request, res: Response) => {
  try {
    // Menghapus access token dari sisi klien (misalnya, cookie atau local storage)
    res.clearCookie('access_token') // Contoh jika menggunakan cookie

    // Jika access token disimpan dalam database, hapus token tersebut dari database
    // Misalnya, jika Anda memasukkan token ke dalam daftar token yang valid, Anda dapat menghapusnya dari daftar.
    // Namun, perhatikan bahwa pendekatan ini tidak menangani token yang sudah kadaluwarsa.

    logger.info('Logout successful')

    return res.status(200).send({ status: true, statusCode: 200, message: 'Logout successful' })
  } catch (error: any) {
    logger.error(`Error during logout: ${error.message}`)
    return res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
}
