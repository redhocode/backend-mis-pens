import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../../db'

interface Student {
  id: string
  nrp: BigInt
  name: string
  major: string
  ipk: Decimal
  year: number
  semester: number
  status: string
  createdAt: Date
  updatedAt: Date
  userId: string | null
  username: string | null
  image: string | null
  receivedAwardId: string | null
  receivedAwardName: string | null
}

export interface StudentData {
  id: string
  nrp: string
  name: string
  major: string
  year: string
  semester: string
  status: string
  ipk: string
  image: string
}

const findStudents = async (): Promise<Student[]> => {
  const students = await prisma.student.findMany()
  return students
}

const findStudentsById = async (id: string): Promise<Student | null> => {
  const student = await prisma.student.findUnique({
    where: {
      id
    }
  })
  return student
}

const insertStudent = async (studentData: StudentData, userId: string, receivedAwardId: string): Promise<Student> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new Error('User not found')
    }

    // Mengambil data beasiswa berdasarkan receivedAwardId
    let scholarshipTitle: string | null = null
    // Jika receivedAwardId tidak kosong, ambil data beasiswa
    if (receivedAwardId) {
      const scholarship = await prisma.scholarship.findUnique({
        where: {
          id: receivedAwardId
        }
      })

      if (!scholarship) {
        throw new Error('Scholarship not found')
      }
      scholarshipTitle = scholarship.title
    }

    // Mengonversi nilai string menjadi integer di sisi backend
    const parsedYear = parseInt(studentData.year)
    const parsedSemester = parseInt(studentData.semester)

    const student = await prisma.student.create({
      data: {
        nrp: parseInt(studentData.nrp), // Mengonversi nrp dari string menjadi integer
        name: studentData.name,
        major: studentData.major,
        year: parsedYear,
        semester: parsedSemester,
        status: studentData.status,
        ipk: parseFloat(studentData.ipk),
        image: studentData.image,
        userId: userId,
        username: user.username,
        receivedAwardId: receivedAwardId || null,
        receivedAwardName: scholarshipTitle
      }
    })
    return student
  } catch (error: any) {
    throw new Error(`Error inserting student: ${error.message}`)
  }
}

const editStudent = async (
  id: string,
  studentData: StudentData,
  userId: string,
  receivedAwardId: string
): Promise<Student> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new Error('User not found')
    }

    // Mengambil data beasiswa berdasarkan receivedAwardId
    let scholarshipTitle: string | null = null
    // Jika receivedAwardId tidak kosong, ambil data beasiswa
    if (receivedAwardId) {
      const scholarship = await prisma.scholarship.findUnique({
        where: {
          id: receivedAwardId
        }
      })

      if (!scholarship) {
        throw new Error('Scholarship not found')
      }
      scholarshipTitle = scholarship.title
    }

    // Mengonversi nilai string menjadi integer di sisi backend
    const parsedYear = parseInt(studentData.year)
    const parsedSemester = parseInt(studentData.semester)

    // Update student data
    const student = await prisma.student.update({
      where: {
        id: id // Ensure to use the id parameter to locate the student
      },
      data: {
        nrp: parseInt(studentData.nrp), // Convert nrp from string to integer
        name: studentData.name,
        major: studentData.major,
        year: parsedYear,
        semester: parsedSemester,
        status: studentData.status,
        ipk: parseFloat(studentData.ipk), // Ensure IPK is a float
        image: studentData.image,
        userId: userId,
        username: user.username,
        receivedAwardId: receivedAwardId || null,
        receivedAwardName: scholarshipTitle
      }
    })
    return student
  } catch (error: any) {
    throw new Error(`Error updating student: ${error.message}`)
  }
}

const deleteStudent = async (id: string): Promise<void> => {
  await prisma.student.delete({
    where: {
      id
    }
  })
}

export { Student, findStudents, findStudentsById, insertStudent, editStudent, deleteStudent }
