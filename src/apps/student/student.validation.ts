import Joi from 'joi'
import { createStudent } from './student.service'
import { StudentData } from './student.repository'

export const createStudentValidation = (playload: StudentData) => {
  const schema = Joi.object({
    nrp: Joi.number().required(),
    name: Joi.string().required(),
    major: Joi.string().required(),
    year: Joi.number().required(),
    semester: Joi.number().required(),
    status: Joi.string().required(),
    ipk: Joi.number().optional(),
    userId: Joi.string().optional(),
    image: Joi.binary().allow('').optional(),
    receivedAwardId: Joi.string().allow('').optional(),
    receivedAwardName: Joi.string().allow('').optional()
  })
  return schema.validate(playload)
}
