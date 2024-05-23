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

import multer from 'multer'
import { uploadImageToSupabase } from './academic.service'
import { requireAdmin, requireUserAkademic } from '../../middleware/auth'
import { requiredUserAdministrasi } from '../../middleware/auth'
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

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

router.post('/',requireAdmin || requireUserAkademic,upload.single('image'), async (req: Request, res: Response) => {
  try {
    const newAcademicData: AcademicData = req.body

    // Pastikan userId telah ditetapkan dengan benar
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }
     const image = req.file
     let imageUrl: string = ''

     if (image) {
       imageUrl = await uploadImageToSupabase(image, userId)
       newAcademicData.image = imageUrl
     } else {
       logger.info('Image is not provided, continuing without it.')
       newAcademicData.image = ''
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

router.put('/:id',requireAdmin || requireUserAkademic,upload.single('image'), async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    const newAcademicData = req.body
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
      newAcademicData.image = imageUrl
    }
    const { error } = createAcademicValidation(newAcademicData)
    if (error) {
      logger.error(`Error validating academic data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editAcademicById(academicId, newAcademicData, userId)
    logger.info(`Edit academic with id ${academicId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing academic: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.patch('/:id',requireAdmin || requireUserAkademic,upload.single('image'), async (req: Request, res: Response) => {
  try {
    const academicId: string = req.params.id
    const newAcademicData = req.body
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
      newAcademicData.image = imageUrl
    }
    const { error } = createAcademicValidation(newAcademicData)
    if (error) {
      logger.error(`Error validating academic data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editAcademicById(academicId, newAcademicData, userId)
    logger.info(`Edit academic with id ${academicId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing academic: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

export default router
