import prisma from '../../db'

interface Activity {
  id: string
  title: string
  date: string | null
  description: string | null
  link: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  userId: string | null
  username: string | null // Menyimpan username pengguna// Tambahkan field username
}

interface ActivityData {
  id: string
  title: string
  date: string
  image: string
  description: string
  link: string
  userId: string
  username?: string
  imageUrl: string
}

const findActifitys = async (): Promise<Activity[]> => {
  const activities = await prisma.activity.findMany()
  return activities
}

const findActifitysById = async (id: string): Promise<Activity | null> => {
  const activity = await prisma.activity.findUnique({
    where: {
      id
    }
  })
  return activity
}

const insertActivity = async (activityData: ActivityData, userId: string): Promise<Activity> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const activity = await prisma.activity.create({
      data: {
        title: activityData.title,
        date: activityData.date,
        description: activityData.description,
        image: activityData.image,
        link: activityData.link,
        userId: userId,
        username: user.username
      }
    })

    return activity
  } catch (error: any) {
    throw new Error(`Error inserting activity: ${error.message}`)
  }
}

const editActivity = async (id: string, activityData: ActivityData, userId: string): Promise<Activity> => {
  const activity = await prisma.activity.update({
    where: {
      id
    },
    data: {
      title: activityData.title,
      date: activityData.date,
      image: activityData.image,
      userId: userId,
      description: activityData.description,
      link: activityData.link
    }
  })
  return activity
}

const deleteActivity = async (id: string): Promise<void> => {
  await prisma.activity.delete({
    where: {
      id
    }
  })
}

export { findActifitys, findActifitysById, insertActivity, editActivity, deleteActivity, Activity, ActivityData }
