import express, { Request, Response } from 'express'
import { getAllUsers, getUserById, createUser, deleteUserById, editUserById, createSession } from './user.service'
import { logger } from '../../utils/logger'
import { createUserValidation } from './user.validation'
import { hashPassword } from '../../utils/hashing'
import { createRefreshToken, signJwt } from '../../utils/jwt'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers()
    logger.info('Get all users success')
    res.status(200).send(users)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id
    const user = await getUserById(userId)
    logger.info(`Get user with id ${userId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: user })
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const newUserData = req.body
    const { error } = createUserValidation(newUserData)
    if (error) {
      logger.error(`Error validating user data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    // Hash password menggunakan fungsi yang sudah Anda buat
    const hashedPassword = await hashPassword(newUserData.password)

    // Buat objek user baru dengan password yang di-hash
    const user = await createUser({ ...newUserData, password: hashedPassword })
    // Autentikasi berhasil, buat token JWT
    const accessToken = signJwt({ userId: user.id }) // Menggunakan user.id sebagai payload
    const refreshToken = createRefreshToken({ userId: user.id }, process.env.JWT_REFRESH_EXPIRATION || '7d')
    logger.info('User created successfully')
    res.status(200).send({ status: true, statusCode: 200, data: { user, accessToken, refreshToken } })
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`)
    res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id
    await deleteUserById(userId)
    logger.info(`Delete user with id ${userId} success`)
    res.status(200).send(`Delete user with id ${userId} success`)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const userId: string = req.params.id
  const userData = req.body

  if (!(userData.name && userData.email && userData.password)) {
    logger.error('Some fields are missing')
    return res.status(400).send('Some fields are missing')
  }
  try {
    const user = await editUserById(userId, userData)
    logger.info(`Edit user with id ${userId} success`)
    res.send({
      data: user,
      message: 'edit user success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id
    const userData = req.body
    const user = await editUserById(userId, userData)
    logger.info(`Edit user with id ${userId} success`)
    res.send({
      data: user,
      message: 'edit user success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})
router.post('/login', async (req: Request, res: Response) => {
  try {
    const userData = req.body

    // Panggil fungsi untuk membuat sesi, termasuk pembuatan token
    const user = await createSession(userData)

    // Dalam createSession, token JWT sudah dibuat, cukup gunakan token yang sudah ada

    logger.info('User authenticated successfully')
    // Kembalikan data pengguna dan token dari hasil pemanggilan createSession
    res.status(200).send({ status: true, statusCode: 200, message: 'Login successful', data: user })
  } catch (error: any) {
    logger.error(`Error authenticating user: ${error.message}`)
    res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
})

// export default router;
