import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../../db'

interface Student {
  id: string
  nrp: number
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
}

export interface StudentData {
  id: string
  nrp: number
  name: string
  major: string
  year: number
  semester: number
  status: string
  ipk: Decimal
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

const insertStudent = async (studentData: StudentData): Promise<Student> => {
  // Pastikan userId ada dalam data mahasiswa

  const student = await prisma.student.create({
    data: {
      nrp: studentData.nrp,
      name: studentData.name,
      major: studentData.major,
      ipk: studentData.ipk,
      year: studentData.year,
      semester: studentData.semester,
      status: studentData.status
    }
  })
  return student
}

const editStudent = async (id: string, studentData: StudentData): Promise<Student> => {
  const student = await prisma.student.update({
    where: {
      id
    },
    data: {
      nrp: studentData.nrp,
      name: studentData.name,
      major: studentData.major,
      year: studentData.year,
      semester: studentData.semester,
      status: studentData.status,
      ipk: studentData.ipk
    }
  })
  return student
}

const deleteStudent = async (id: string): Promise<void> => {
  await prisma.student.delete({
    where: {
      id
    }
  })
}

export { Student, findStudents, findStudentsById, insertStudent, editStudent, deleteStudent }
