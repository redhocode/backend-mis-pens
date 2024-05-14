import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'

const deserializedToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')

  if (!accessToken) {
    return next()
  }

  // const token: any = verifyJwt(accessToken)
  const token: any = verifyJwt(accessToken)
  if (token.decoded && token.decoded.id) {
    // Set userId dari token ke objek req
    req.userId = token.decoded.id
    res.locals.user = token.decoded
    return next()
  }
  if (token.expired) {
    return next()
  }
  return next()
}

export default deserializedToken

// Definisikan properti userId di dalam objek Request
declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: any // Properti user dengan tipe data yang sesuai, misalnya { id: number }
    }
  }
}
