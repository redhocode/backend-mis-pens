import Joi from 'joi'

import { ActivityData } from './activity.repository'

export const createActivityValidation = (playload: ActivityData) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    image: Joi.binary().allow('').optional(),
    link: Joi.string().allow('').optional(),
    userId: Joi.number().optional(),
    imageUrl: Joi.string().allow('').optional()
  })
  return schema.validate(playload)
}
