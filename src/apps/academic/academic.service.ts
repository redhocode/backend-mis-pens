import { findAcademics, insertAcademic, updateAcademic, deleteAcademic, findAcademicById } from './academic.repository'
import { AcademicData, Academic } from './academic.repository'
import { createAcademicValidation } from './academic.validation'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../../utils/supabase'
const getAllAcademic = async (): Promise<Academic[]> => {
  const academics = await findAcademics()
  if (!academics) {
    throw new Error('Academic not found')
  }
  return academics
}
const getAcademicById = async (id: string): Promise<Academic> => {
  const academic = await findAcademicById(id)
  if (!academic) {
    throw new Error('Academic not found')
  }
  return academic
}
const createAcademic = async (newAcademicData: AcademicData, userId: string): Promise<Academic> => {
  const { error, value } = createAcademicValidation(newAcademicData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  const id = uuidv4()
  const academic = await insertAcademic({ ...newAcademicData, id }, userId)
  return academic
}

const deleteAcademicById = async (id: string): Promise<void> => {
  const academic = await findAcademicById(id)
  if (!academic) {
    throw new Error('Academic not found')
  }
  await deleteAcademic(id)
}

const editAcademicById = async (id: string, newAcademicData: AcademicData, userId: string): Promise<Academic> => {
  await findAcademicById(id)
  const academic = await updateAcademic(id, newAcademicData, userId)
  return academic
}
export const uploadImageToSupabase = async (file: Express.Multer.File, userId: string): Promise<string> => {
  try {
    // Convert file buffer to ArrayBuffer
    const fileArrayBuffer = file.buffer

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage.from('images').upload(userId + '/' + uuidv4(), fileArrayBuffer, {
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

export { getAllAcademic, createAcademic, deleteAcademicById, editAcademicById, getAcademicById }
