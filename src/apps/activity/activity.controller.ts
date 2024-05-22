import express, { Request, Response } from 'express'
import {
  createActivity,
  deleteActivityById,
  editActivityById,
  getAllActivities,
  getActivityById
} from './actifity.service'
import { logger } from '../../utils/logger'
import { ActivityData } from './activity.repository'
import { storage } from '../../utils/multer'
import multer from 'multer'
import { requiredUserAdministrasi, requireUserAkademic, requireAdmin } from '../../middleware/auth'
import { createActivityValidation } from './activity.validation'
const router = express.Router()

const upload = multer({ storage: storage })

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
      return res.status(401).json({ status: false, message: 'Unauthorized' })
    }

    // Check if an image is uploaded
    const image = req.file
    if (image === undefined) {
      logger.info('Image is not provided, continuing without it.')
      // Jika image tidak ada, atur imageUrl menjadi null atau string kosong
      newActivityData.image = '' // Atau bisa juga null, tergantung preferensi Anda
    } else {
      const imageUrl = '/uploads/' + image.filename
      newActivityData.image = imageUrl
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
  const activityId: string = req.params.id
  const activityData = req.body

  if (!(activityData.image && activityData.description && activityData.title && activityData.date)) {
    logger.error('Some fields are missing')
    return res.status(400).send('Some fields are missing')
  }

  try {
    const activity = await editActivityById(activityId, activityData)
    logger.info(`Edit activity with id ${activityId} success`)
    res.send({
      data: activity,
      message: 'edit activity success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})

router.patch(
  '/:id',
  requireAdmin || requiredUserAdministrasi,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const activityId: string = req.params.id
      const activityData = req.body

      // Check if an image is uploaded
      const image = req.file
      if (image) {
        // Save the updated image URL to the activity data
        activityData.image = '/uploads/' + image.filename
      }

      const activity = await editActivityById(activityId, activityData)
      logger.info(`Edit activity with id ${activityId} success`)
      res.send({
        data: activity,
        message: 'edit activity success'
      })
    } catch (error: any) {
      logger.error(error)
      res.status(400).send(error.message)
    }
  }
)

export default router
