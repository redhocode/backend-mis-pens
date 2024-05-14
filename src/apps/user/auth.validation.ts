import Joi from 'joi'
import UserType from './auth.type'

export const createUserValidation = (playload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  })
  return schema.validate(playload)
}
export const createSessionValidation = (playload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(playload)
}

export const refreshSessionValidation = (playload: UserType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })
  return schema.validate(playload)
}
