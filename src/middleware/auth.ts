import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'
import { UserData, ValidationRequest } from '../apps/user/user'
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(403).send({ message: 'User information is missing or invalid' })
  }
  next()
}

export const accessValidation = (req: Request, res: Response, next: NextFunction) => {
  const validationReq = req as ValidationRequest
  const { authorization } = validationReq.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized: Access token is missing or invalid'
    })
  }

  const token = authorization.split(' ')[1] // Mengambil token dari header Authorization

  const jwtVerification = verifyJwt(token)

  if (!jwtVerification.valid) {
    if (jwtVerification.expired) {
      return res.status(401).json({
        message: 'Unauthorized: Token expired'
      })
    } else {
      return res.status(401).json({
        message: 'Unauthorized: Invalid access token'
      })
    }
  }

  if (typeof jwtVerification.decoded !== 'string') {
    // Jika dekoded tidak berupa string, maka berisi data pengguna
    const userData = jwtVerification.decoded as UserData
    // Menetapkan nilai userId dan username ke dalam objek permintaan
    validationReq.userId = userData.userId
    validationReq.username = userData.username
  }

  next()
}
