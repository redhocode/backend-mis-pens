import Joi from 'joi'

import { UserData } from './user.repository'

export const createUserValidation = (playload: UserData) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  })
  return schema.validate(playload)
}

export const createSessionValidation = (playload: UserData) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
  })
  return schema.validate(playload)
}
export const refreshSessionValidation = (playload: UserData) => {
  const schema = Joi.object({
    refresh_token: Joi.string().required()
  })
  return schema.validate(playload)
}
