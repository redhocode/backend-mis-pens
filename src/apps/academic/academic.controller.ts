import express, { Request, Response } from 'express'
import {
  getAllAcademic,
  getAcademicById,
  createAcademic,
  deleteAcademicById,
  editAcademicById
} from './academic.service'
import { logger } from '../../utils/logger'
import { createAcademicValidation } from './academic.validation'
import { AcademicData } from './academic.repository'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const academic = await getAllAcademic()
    logger.info('Get all academic success')
    res.status(200).send(academic)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    const academic = await getAcademicById(academicId)
    logger.info(`Get academic with id ${academicId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const newAcademicData: AcademicData = req.body

    // Pastikan userId telah ditetapkan dengan benar
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }
    const { error } = createAcademicValidation(newAcademicData)
    if (error) {
      logger.error(`Error validating academic data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await createAcademic(newAcademicData, userId)
    logger.info('Academic created successfully')
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error creating academic: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    await deleteAcademicById(academicId)
    logger.info(`Delete academic with id ${academicId} success`)
    res.status(200).send(`Delete academic with id ${academicId} success`)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    const newAcademicData = req.body
    const { error } = createAcademicValidation(newAcademicData)
    if (error) {
      logger.error(`Error validating academic data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editAcademicById(academicId, newAcademicData)
    logger.info(`Edit academic with id ${academicId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing academic: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    const newAcademicData = req.body
    const { error } = createAcademicValidation(newAcademicData)
    if (error) {
      logger.error(`Error validating academic data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editAcademicById(academicId, newAcademicData)
    logger.info(`Edit academic with id ${academicId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing academic: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

export default router
