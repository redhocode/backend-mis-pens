import Joi from 'joi'

import { AcademicData } from './academic.repository'

export const createAcademicValidation = (playload: AcademicData) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    link: Joi.string().allow('').optional(),
    userId: Joi.string().optional()
  })
  return schema.validate(playload)
}
