import express, { Request, Response, NextFunction } from 'express'
import prisma from '../../db'
import { logger } from '../../utils/logger'
import { createUserValidation } from './user.validation'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { signJwt, verifyJwt } from '../../utils/jwt'

const router = express.Router()

export interface UserData {
  id: string
  username: string
  password: string
  userId: string
  role?: string // Tambahkan bidang role sebagai opsional
}

export interface ValidationRequest extends Request {
  username: string
  userData: UserData
}

// Middleware untuk pengaturan sesi
export const accessValidation = (req: Request, res: Response, next: NextFunction) => {
  const validationReq = req as ValidationRequest
  const { authorization } = validationReq.headers

  console.log('Authorization header:', authorization) // Log Authorization header

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Missing or invalid access token')
    return res.status(401).json({
      message: 'Unauthorized: Access token is missing or invalid'
    })
  }

  const token = authorization.split(' ')[1] // Mengambil token dari header Authorization
  console.log('Token:', token) // Log token

  const jwtVerification = verifyJwt(token)
  console.log('JWT verification:', jwtVerification) // Log JWT verification result

  if (!jwtVerification.valid) {
    if (jwtVerification.expired) {
      console.log('Token expired')
      return res.status(401).json({
        message: 'Unauthorized: Token expired'
      })
    } else {
      console.log('Invalid access token')
      return res.status(401).json({
        message: 'Unauthorized: Invalid access token'
      })
    }
  }

  if (typeof jwtVerification.decoded !== 'string') {
    validationReq.userData = jwtVerification.decoded as UserData
  }

  next()
}

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.body.role // Pastikan Anda mengambil peran pengguna dari objek userData yang sesuai dengan token
  if (userRole !== 'admin') {
    console.log('User does not have admin role')
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to access this resource'
    })
  }
  next()
}
// Middleware untuk mengotorisasi pengguna berdasarkan peran
interface CustomRequest extends Request {
  userData: UserData
}
export const authorize = (allowedRoles: string[], userData: UserData) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const userRole = req.userData.role // Ambil peran pengguna dari data pengguna yang disimpan dalam JWT

    // Periksa apakah peran pengguna memiliki izin untuk mengakses sumber daya
    if (typeof userRole === 'string' && allowedRoles.includes(userRole)) {
      // Jika pengguna memiliki izin, lanjutkan ke middleware berikutnya
      next()
    } else {
      // Jika pengguna tidak memiliki izin, kirim respons error
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' })
    }
  }
}
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query
    let result

    if (search) {
      result = await prisma.user.findMany({
        where: {
          username: {
            contains: search.toString()
          }
        },
        select: {
          id: true,
          username: true,
          role: true
        }
      })
    } else {
      result = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          role: true
        }
      })
    }

    logger.info('Get all users success')

    res.json(result)
  } catch (error) {
    logger.error(`Error occurred while fetching user list: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
    next(error)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4()
    const { error } = createUserValidation(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    const { username, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await prisma.user.create({
      data: {
        id,
        username,
        role,
        password: hashedPassword
      }
    })
    logger.info('User created successfully')
    res.json(result)
  } catch (error) {
    console.error(`Error occurred while creating user: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
    next(error)
  }
})

router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { username } = req.body
    const result = await prisma.user.update({
      where: { id: userId },
      data: { username: username }
    })
    logger.info('User updated successfully')
    res.json(result)
  } catch (error) {
    console.error(`Error occurred while updating user: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const { username } = req.body
    const result = await prisma.user.update({
      where: { id: userId },
      data: { username: username }
    })
    logger.info('User updated successfully')
    res.json(result)
  } catch (error) {
    console.error(`Error occurred while updating user: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const result = await prisma.user.delete({
      where: { id: userId }
    })
    logger.info('User deleted successfully')
    res.json(result)
  } catch (error) {
    console.error(`Error occurred while deleting user: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    if (!user) {
      logger.info('User not found')
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!user.password) {
      logger.info('Password not set')
      return res.status(404).json({
        message: 'Password not set'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role // Menyertakan peran pengguna dalam payload JWT
      }

      const accessToken = signJwt(payload, { expiresIn: '7d' })

      res.setHeader('Authorization', `Bearer ${accessToken}`)

      logger.info(`User ${username} authenticated successfully`)

      return res.json({
        data: {
          id: user.id,
          name: user.username,
          role: user.role
        },
        accessToken: accessToken,
        message: 'User authenticated'
      })
    } else {
      logger.info('Wrong password')
      return res.status(403).json({
        message: 'Wrong password'
      })
    }
  } catch (error) {
    console.error(`Error occurred while authenticating user: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Logout successful' })
    logger.info('User logged out successfully')
  } catch (error) {
    logger.error(`Error occurred during logout: ${error}`)
    console.error(`Error occurred during logout: ${error}`)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// export default router
