// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya

import {
  findScholarship,
  findScholarshipById,
  insertScholarship,
  deleteScholarship,
  editScholarship
} from './scholarship.repository'
import { ScholarshipData, Scholarship } from './scholarship.repository'
import { createScholarshipValidation } from './scholarship.validation'
import { v4 as uuidv4 } from 'uuid'
const getAllScholarships = async (): Promise<Scholarship[]> => {
  const scholarships = await findScholarship()
  if (!scholarships) {
    throw new Error('Scholarship not found')
  }
  return scholarships
}

const getScholarshipById = async (id: string): Promise<Scholarship> => {
  const scholarship = await findScholarshipById(id)
  if (!scholarship) {
    throw new Error('Scholarship not found')
  }
  return scholarship
}

const createScholarship = async (newScholarshipData: ScholarshipData, userId: string): Promise<Scholarship> => {
  const { error, value } = createScholarshipValidation(newScholarshipData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  // Menghasilkan UUID atau nanoid
  const id = uuidv4() // Menggunakan UUID
  // const id = nanoid(); // Menggunakan nanoid
  const scholarship = await insertScholarship({ ...newScholarshipData, id }, userId)
  return scholarship
}
const deleteScholarshipById = async (id: string): Promise<void> => {
  const scholarship = await getScholarshipById(id)
  await deleteScholarship(scholarship.id)
}
const editScholarshipById = async (id: string, newScholarshipData: ScholarshipData): Promise<Scholarship> => {
  const { error, value } = createScholarshipValidation(newScholarshipData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  const scholarship = await editScholarship(id, newScholarshipData)
  return scholarship
}
export { getAllScholarships, getScholarshipById, createScholarship, deleteScholarshipById, editScholarshipById }
