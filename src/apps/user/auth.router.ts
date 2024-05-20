import { Router } from 'express'
import { registerUser, createSession, refreshToken, getAll, updateUser, deleteUser, logout } from './auth.contoller'
import { requireAdmin } from '../../middleware/auth'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refreshToken)
AuthRouter.get('/', requireAdmin, getAll)
AuthRouter.patch('/:id', updateUser)
AuthRouter.delete('/:id', deleteUser)
AuthRouter.post('/logout', logout)
