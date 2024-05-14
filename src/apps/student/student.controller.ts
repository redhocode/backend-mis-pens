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

    // Pastikan userId telah ditetapkan dengan benar
    const userId: string = req.userId as string
    if (!userId) {
      throw new Error('User ID is not valid.')
    }
    // Mendapatkan receivedAwardId dari body request, jika ada
    const receivedAwardId: string = req.body.receivedAwardId
    // Lakukan pengecekan apakah receivedAwardId ada atau tidak
    if (receivedAwardId === undefined) {
      logger.info('Received Award ID is not provided, continuing without it.')
    }
    // if (!receivedAwardId) {
    //   throw new Error('Received Award ID is required.')
    // }
    const image = req.file
    // Lakukan pengecekan apakah image ada atau tidak
    if (image === undefined) {
      logger.info('Image is not provided, continuing without it.')
      // Jika image tidak ada, atur imageUrl menjadi null atau string kosong
      newStudentData.image = '' // Atau bisa juga null, tergantung preferensi Anda
    } else {
      const imageUrl = '/uploads/' + image.filename
      newStudentData.image = imageUrl
    }
    const { error } = createStudentValidation(newStudentData)
    if (receivedAwardId !== undefined) {
      const { error } = createStudentValidation(newStudentData)
      if (error) {
        logger.error(`Error validating student data: ${error.message}`)
        return res.status(422).send({ status: false, statusCode: 422, message: error.message })
      }
    }

    const student = await createStudent(newStudentData, userId, receivedAwardId || '')
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

router.put('/:id', async (req: Request, res: Response) => {
  const studentId: string = req.params.id
  const studentData = req.body

  if (!studentData.name && studentData.major && studentData.year && studentData.semester && studentData.status) {
    logger.error('Some fields are missing')
    return res.status(400).send('Some fields are missing')
  }
  try {
    const student = await editStudentById(studentId, studentData)
    logger.info(`Edit student with id ${studentId} success`)
    res.send({
      data: student,
      message: 'edit student success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})

router.patch('/:id',requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const studentId: string = req.params.id
    const studentData = req.body
    const image = req.file

    // Jika ada file gambar yang diunggah, update path gambar dalam data mahasiswa
    if (image) {
      studentData.image = '/uploads/' + image.filename
    }

    // Panggil fungsi editStudentById untuk mengedit mahasiswa berdasarkan ID
    const student = await editStudentById(studentId, studentData)

    logger.info(`Edit student with id ${studentId} success`)

    // Kirim respons dengan data mahasiswa yang telah diubah
    res.send({
      data: student,
      message: 'Edit student success'
    })
  } catch (error: any) {
    logger.error(error)
    res.status(400).send(error.message)
  }
})


export default router
