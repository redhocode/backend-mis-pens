import { findActifitys, findActifitysById, insertActivity, deleteActivity, editActivity } from './activity.repository'
import { ActivityData, Activity } from './activity.repository'

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

  const activity = await insertActivity(newActivityData, userId)
  return activity
}

const deleteActivityById = async (id: string): Promise<void> => {
  const activity = await getActivityById(id)
  if (!activity) {
    throw new Error('Activity not found')
  }
  await deleteActivity(activity.id)
}

const editActivityById = async (id: string, activityData: ActivityData): Promise<Activity> => {
  // Lakukan validasi data aktivitas di sini
  // Misalnya, menggunakan fungsi editActivityValidation

  await getActivityById(id)
  const activity = await editActivity(id, activityData)
  return activity
}

export { getAllActivities, getActivityById, createActivity, deleteActivityById, editActivityById }
