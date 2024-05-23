// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response, NextFunction } from 'express'
import { getAllStudents, getStudentById, createStudent, deleteStudentById, editStudentById } from './student.service'
import { logger } from '../../utils/logger'
import { createStudentValidation } from './student.validation'
import { accessValidation, requireAdmin, requireUser } from '../../middleware/auth'
import { StudentData } from './student.repository'
import { storage } from '../../utils/multer'
import multer from 'multer'
import { uploadImageToSupabase } from './student.service'
const router = express.Router()
const upload = multer({ storage: storage })
router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents()
    logger.info('Get all students success')
    res.status(200).send(students)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const studentId: string = req.params.id
    const student = await getStudentById(studentId)
    logger.info(`Get student with id ${studentId} success`)
    res.status(200).send(student)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

router.post('/', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const newStudentData: StudentData = req.body

    // Ensure userId is valid
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }

    // Get receivedAwardId from request body
    const receivedAwardId: string = req.body.receivedAwardId || ''

    // Check if receivedAwardId is provided
    if (receivedAwardId === undefined) {
      logger.info('Received Award ID is not provided, continuing without it.')
    }

    let imageUrl: string = '' // Initialize imageUrl variable with an empty string

    // Check if image is uploaded
    const image = req.file
    if (image === undefined) {
      logger.info('Image is not provided, continuing without it.')
      newStudentData.image = '' // Or set it to null, depending on your preference
    } else {
      // Upload image to Supabase
      const uploadedImageUrl = await uploadImageToSupabase(image)
      // Assign the result to imageUrl if it's not null
      if (uploadedImageUrl !== null) {
        imageUrl = uploadedImageUrl
      } else {
        logger.error('Error uploading image to Supabase')
        // Handle the error, for example by returning an error response
        return res.status(500).send({ status: false, message: 'Error uploading image to Supabase' })
      }
    }

    newStudentData.image = imageUrl

    // Validate student data
    const { error } = createStudentValidation(newStudentData)
    if (error) {
      logger.error(`Error validating student data: ${error.message}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error.message })
    }

    // Create student
    const student = await createStudent(newStudentData, userId, receivedAwardId)
    logger.info('Student created successfully')
    res.status(200).send({ status: true, statusCode: 200, data: student })
  } catch (error: any) {
    logger.error(`Error creating student: ${error.message}`)
    res.status(400).send({ status: false, statusCode: 400, message: error.message })
  }
})


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const studentId: string = req.params.id
    await deleteStudentById(studentId)
    logger.info(`Delete student with id ${studentId} success`)
    res.status(200).send(`Delete student with id ${studentId} success`)
  } catch (err: any) {
    logger.error(err)
    res.status(400).send(err.message)
  }
})

// router.put('/:id', async (req: Request, res: Response) => {
//   const studentId: string = req.params.id
//   const studentData = req.body

//   if (!studentData.name && studentData.major && studentData.year && studentData.semester && studentData.status) {
//     logger.error('Some fields are missing')
//     return res.status(400).send('Some fields are missing')
//   }
//   try {
//     const student = await editStudentById(studentId, studentData)
//     logger.info(`Edit student with id ${studentId} success`)
//     res.send({
//       data: student,
//       message: 'edit student success'
//     })
//   } catch (error: any) {
//     logger.error(error)
//     res.status(400).send(error.message)
//   }
// })

router.patch('/:id', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const studentId: string = req.params.id
    const studentData: StudentData = req.body
    const image = req.file

    // Assuming `req.userId` contains the logged-in user information
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }

    // Mendapatkan receivedAwardId dari body request, jika ada
    const receivedAwardId: string = req.body.receivedAwardId || ''

    // Jika ada file gambar yang diunggah, update path gambar dalam data mahasiswa
    if (image) {
      studentData.image = '/uploads/' + image.filename
    }

    // Panggil fungsi editStudentById untuk mengedit mahasiswa berdasarkan ID
    const student = await editStudentById(studentId, studentData, userId, receivedAwardId)

    logger.info(`Edit student with id ${studentId} success`)

    // Kirim respons dengan data mahasiswa yang telah diubah
    res.send({
      data: student,
      message: 'Edit student success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send({ message: error.message })
  }
})

export default router
