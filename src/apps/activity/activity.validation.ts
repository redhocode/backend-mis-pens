import Joi from 'joi'

import { ActivityData } from './activity.repository'

export const createActivityValidation = (playload: ActivityData) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    image: Joi.binary().optional(),
    link: Joi.string().optional(),
    userId: Joi.number().optional()
  })
  return schema.validate(playload)
}
