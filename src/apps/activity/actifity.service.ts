import { findActifitys, findActifitysById, insertActivity, deleteActivity, editActivity } from './activity.repository'
import { ActivityData, Activity } from './activity.repository'
import { supabase } from '../../utils/supabase'
import { v4 as uuidv4 } from 'uuid'
import { createActivityValidation } from './activity.validation'
const getAllActivities = async (): Promise<Activity[]> => {
  const activities = await findActifitys()
  return activities
}

const getActivityById = async (id: string): Promise<Activity | null> => {
  const activity = await findActifitysById(id)
  if (!activity) {
    throw new Error('Activity not found')
  }
  return activity
}

const createActivity = async (newActivityData: ActivityData, userId: string): Promise<Activity> => {
  // Lakukan validasi data aktivitas di sini
  // Misalnya, menggunakan fungsi createActivityValidation
  const { error, value } = createActivityValidation(newActivityData)
  if (error) {
    throw new Error(error.details[0].message)
  }
  const id = uuidv4()
  const activity = await insertActivity({ ...newActivityData, id }, userId)
  return activity
}

const deleteActivityById = async (id: string): Promise<void> => {
  const activity = await getActivityById(id)
  if (!activity) {
    throw new Error('Activity not found')
  }
  await deleteActivity(activity.id)
}

const editActivityById = async (id: string, activityData: ActivityData, userId: string): Promise<Activity> => {
  // Lakukan validasi data aktivitas di sini
  // Misalnya, menggunakan fungsi editActivityValidation
 const { error, value } = createActivityValidation(activityData)
 if (error) {
   throw new Error(error.details[0].message)
 }
  await getActivityById(id)
  const activity = await editActivity(id, activityData, userId)
  return activity
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


export { getAllActivities, getActivityById, createActivity, deleteActivityById, editActivityById }
