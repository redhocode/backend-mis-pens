import { v4 as uuidv4 } from 'uuid' // Import untuk menghasilkan UUID
import { nanoid } from 'nanoid' // Import untuk menghasilkan nanoid
import { findStudents, findStudentsById, insertStudent, deleteStudent, editStudent } from './student.repository'
import { StudentData, Student } from './student.repository'
import { createStudentValidation } from './student.validation'
import { supabase } from '../../utils/supabase'
import { decode } from 'base64-arraybuffer'
const getAllStudents = async (): Promise<Student[]> => {
  const students = await findStudents()
  return students
}

const getStudentById = async (id: string): Promise<Student | null> => {
  // Menggunakan tipe data string untuk UUID atau nanoid
  const student = await findStudentsById(id)
  return student
}

const createStudent = async (
  newStudentData: StudentData,
  userId: string,
  receivedAwardId: string
): Promise<Student> => {
  const { error, value } = createStudentValidation(newStudentData)
  if (error) {
    throw new Error(error.details[0].message)
  }

  // Menghasilkan UUID atau nanoid
  const id = uuidv4() // Menggunakan UUID
  // const id = nanoid(); // Menggunakan nanoid

  const student = await insertStudent({ ...newStudentData, id }, userId, receivedAwardId)
  return student
}

const deleteStudentById = async (id: string): Promise<void> => {
  // Menggunakan tipe data string untuk UUID atau nanoid
  await deleteStudent(id)
}

const editStudentById = async (
  id: string,
  studentData: StudentData,
  userId: string,
  receivedAwardId: string
): Promise<Student> => {
  const student = await findStudentsById(id)
  if (!student) {
    throw new Error('Student not found')
  }
  const updatedStudent = await editStudent(id, studentData, userId, receivedAwardId)
  return updatedStudent
}
const uploadImageToSupabase = async (file: Express.Multer.File, userId: string): Promise<string> => {
 try {
   // Convert file buffer to ArrayBuffer
   const fileArrayBuffer = file.buffer

   // Upload the file to Supabase storage
   const { data, error } = await supabase.storage.from('images').upload(userId + '/'+uuidv4(), fileArrayBuffer, {
     contentType: file.mimetype
   })

   if (error) {
     throw new Error(`Error uploading image to Supabase: ${error.message}`)
   }

   // Get the public URL of the uploaded file
   const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(data.path)

   if (!publicUrlData) {
     throw new Error('Error getting public URL of the uploaded image')
   }

   return publicUrlData.publicUrl
 } catch (error: any) {
   throw new Error(`Error uploading image to Supabase: ${error.message}`)
 }
}
  
export { getAllStudents, getStudentById, createStudent, deleteStudentById, editStudentById, uploadImageToSupabase }
