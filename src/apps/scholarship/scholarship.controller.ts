// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response } from 'express'
import {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  deleteScholarshipById,
  editScholarshipById
} from './scholarship.service'
import { logger } from '../../utils/logger'
import { createScholarshipValidation } from './scholarship.validation'
import { ScholarshipData } from './scholarship.repository'
import { storage } from '../../utils/multer'
import multer from 'multer'
import { requiredUserAdministrasi, requireUserAkademic, requireAdmin } from '../../middleware/auth'
const router = express.Router()

const upload = multer({ storage: storage })
router.get('/', async (req: Request, res: Response) => {
  try {
    const scholarships = await getAllScholarships()
    logger.info('Get all scholarships success')
    res.status(200).send(scholarships)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const scholarshipId: string = req.params.id
    const scholarship = await getScholarshipById(scholarshipId)
    logger.info(`Get scholarship with id ${scholarshipId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: scholarship })
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.post('/', requireAdmin || requireUserAkademic, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const newScholarshipData: ScholarshipData = req.body

    // Pastikan userId telah ditetapkan dengan benar
    const userId: string = req.userId as string
    if (!userId) {
      return res.status(401).json({ status: false, message: 'Unauthorized' })
    }

    // Check if an image is uploaded
    const image = req.file
    if (image === undefined) {
      logger.info('Image is not provided, continuing without it.')
      // Jika image tidak ada, atur imageUrl menjadi null atau string kosong
      newScholarshipData.image = '' // Atau bisa juga null, tergantung preferensi Anda
    } else {
      const imageUrl = '/uploads/' + image.filename
      newScholarshipData.image = imageUrl
    }

    const { error } = createScholarshipValidation(newScholarshipData)
    if (error) {
      logger.error(`Error validating scholarship data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const scholarship = await createScholarship(newScholarshipData, userId)
    logger.info('Scholarship created successfully')
    res.status(200).send({ status: true, statusCode: 200, data: scholarship })
  } catch (error: any) {
    logger.error(`Error creating scholarship: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.delete('/:id', requireAdmin || requireUserAkademic, async (req: Request, res: Response) => {
  try {
    const scholarshipId: string = req.params.id
    await deleteScholarshipById(scholarshipId)
    logger.info(`Delete scholarship with id ${scholarshipId} success`)
    res.status(200).send(`Delete scholarship with id ${scholarshipId} success`)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.put('/:id', requireAdmin || requireUserAkademic, async (req: Request, res: Response) => {
  const scholarshipId: string = req.params.id
  const scholarshipData = req.body
  if (!(scholarshipData.image && scholarshipData.description && scholarshipData.title && scholarshipData.date)) {
    logger.error('Some fields are missing')
    return res.status(400).send('Some fields are missing')
  }
  try {
    const scholarship = await editScholarshipById(scholarshipId, scholarshipData)
    logger.info(`Edit scholarship with id ${scholarshipId} success`)
    res.send({
      data: scholarship,
      message: 'edit scholarship success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  requireAdmin || requireUserAkademic,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const scholarshipId: string = req.params.id
      const scholarshipData = req.body
      const image = req.file
      if (image) {
        scholarshipData.image = '/uploads/' + image.filename
      }
      const scholarship = await editScholarshipById(scholarshipId, scholarshipData)
      logger.info(`Edit scholarship with id ${scholarshipId} success`)
      res.send({
        data: scholarship,
        message: 'edit scholarship success'
      })
    } catch (error: any) {
      logger.error(error)
      res.status(400).send(error.message)
    }
  }
)

export default router
