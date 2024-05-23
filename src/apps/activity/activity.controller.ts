import express, { Request, Response } from 'express'
import {
  createActivity,
  deleteActivityById,
  editActivityById,
  getAllActivities,
  getActivityById,
  uploadImageToSupabase
} from './actifity.service'
import { logger } from '../../utils/logger'
import { ActivityData } from './activity.repository'
import { storage } from '../../utils/multer'
import multer from 'multer'
import { requiredUserAdministrasi, requireUserAkademic, requireAdmin } from '../../middleware/auth'
import { createActivityValidation } from './activity.validation'
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await getAllActivities()
    logger.info('Get all activities success')
    res.status(200).send(activities)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activityId: string = req.params.id
    const activity = await getActivityById(activityId)
    logger.info(`Get activity with id ${activityId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: activity })
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.post('/', requireAdmin || requiredUserAdministrasi, upload.single('image'), async (req, res) => {
  try {
    const newActivityData: ActivityData = req.body
    const userId = req.userId // Ensure userId has been correctly set in the authentication middleware

    if (!userId) {
      throw new Error('User ID is not valid.')
    }

   const image = req.file
   let imageUrl: string = ''

   if (image) {
     imageUrl = await uploadImageToSupabase(image, userId)
     newActivityData.image = imageUrl
   } else {
     logger.info('Image is not provided, continuing without it.')
     newActivityData.image = ''
   }

    const { error} = createActivityValidation(newActivityData)
    if (error) {
      logger.error(`Error validation Activity data: ${error.details[0].message}`)
      return res.status(422).json({ status: false, message: error.details[0].message })
    }
    // Create a new activity using the service
    const activity = await createActivity(newActivityData, userId)
    logger.info('Create new activity success')
    // Send the response with the updated activity data
    return res.status(201).json({ status: true, data: activity })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: false, message: 'Internal server error' })
  }
})

router.delete('/:id', requireAdmin || requiredUserAdministrasi, async (req: Request, res: Response) => {
  try {
    const activityId: string = req.params.id
    await deleteActivityById(activityId)
    logger.info(`Delete activity with id ${activityId} success`)
    res.status(200).send(`Delete activity with id ${activityId} success`)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.put('/:id', async (req: Request, res: Response) => {

  try{
  const activityId: string = req.params.id
  const newActivityData = req.body
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
      newActivityData.image = imageUrl
    }
    const { error } = createActivityValidation(newActivityData)
    if (error) {
      logger.error(`Error validatin Activity data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editActivityById(activityId, newActivityData, userId)
    logger.info(`Edit activity with id ${activityId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing activity: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
})

router.patch(
  '/:id',
  requireAdmin || requiredUserAdministrasi,
  upload.single('image'),
  async (req: Request, res: Response) => {
   try{
  const activityId: string = req.params.id
  const newActivityData = req.body
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
      newActivityData.image = imageUrl
    }
    const { error } = createActivityValidation(newActivityData)
    if (error) {
      logger.error(`Error validating Activity data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }
    const academic = await editActivityById(activityId, newActivityData, userId)
    logger.info(`Edit activity with id ${activityId} success`)
    res.status(200).send({ status: true, statusCode: 200, data: academic })
  } catch (error: any) {
    logger.error(`Error editing activity: ${error.message}`)
    res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' })
  }
  }
)

export default router
