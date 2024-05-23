// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response } from 'express'
import {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  deleteScholarshipById,
  editScholarshipById,
  uploadImageToSupabase
} from './scholarship.service'
import { logger } from '../../utils/logger'
import { createScholarshipValidation } from './scholarship.validation'
import { ScholarshipData } from './scholarship.repository'
import { storage } from '../../utils/multer'
import multer from 'multer'
import { requiredUserAdministrasi, requireUserAkademic, requireAdmin } from '../../middleware/auth'
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Multer
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

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const newScholarshipData: ScholarshipData = req.body

   const userId: string = req.userId as string

    if (!userId) {
      throw new Error('User ID is not valid.')
    }

    const image = req.file
    let imageUrl: string = ''

    if (image) {
      imageUrl = await uploadImageToSupabase(image, userId)
      newScholarshipData.image = imageUrl
    } else {
      logger.info('Image is not provided, continuing without it.')
      newScholarshipData.image = ''
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

router.delete('/:id',  async (req: Request, res: Response) => {
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

router.put('/:id', async (req: Request, res: Response) => {
  try{
  const scholarshipId: string = req.params.id
  const newScholarshipData = req.body
  const image = req.file
  // Ensure userId is set
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }

    // Jika ada file gambar yang diunggah, update path gambar dalam data mahasiswa
    if (image) {
      // Upload new image to Supabase or any other storage
      const imageUrl = await uploadImageToSupabase(image, userId)
      newScholarshipData.image = imageUrl
    }
    const { error } = createScholarshipValidation(newScholarshipData)
    if (error) {
      logger.error(`Error validating scholarship data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editScholarshipById(scholarshipId, newScholarshipData, userId)
    logger.info(`Edit Scholarship with id ${scholarshipId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing Scholarship: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.patch(
  '/:id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const scholarshipId: string = req.params.id
      const newScholarshipData = req.body
      const image = req.file
      // Ensure userId is set
      const userId: string = req.userId as string
      if (!userId) {
        throw new Error('User ID is not valid.')
      }

      // Jika ada file gambar yang diunggah, update path gambar dalam data mahasiswa
      if (image) {
        // Upload new image to Supabase or any other storage
        const imageUrl = await uploadImageToSupabase(image, userId)
        newScholarshipData.image = imageUrl
      }
      const { error } = createScholarshipValidation(newScholarshipData)
      if (error) {
        logger.error(`Error validating scholarship data: ${error.message}`)
        return res.status(422).send({ status: false, statusCode: 422, message: error.message })
      }
      const academic = await editScholarshipById(scholarshipId, newScholarshipData, userId)
      logger.info(`Edit Scholarship with id ${scholarshipId} success`)
      res.status(200).send({ status: true, statusCode: 200, data: academic })
    } catch (error: any) {
      logger.error(`Error editing Scholarship: ${error.message}`)
      res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
    }
  }
)

export default router
