import { Router } from 'express'
import { registerUser, createSession, refreshToken, getAll, updateUser, deleteUser, logout } from './auth.contoller'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refreshToken)
AuthRouter.get('/', getAll)
AuthRouter.patch('/:id', updateUser)
AuthRouter.delete('/:id', deleteUser)
AuthRouter.post('/logout', logout)
