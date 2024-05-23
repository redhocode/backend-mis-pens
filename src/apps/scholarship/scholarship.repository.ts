import prisma from '../../db'

interface ScholarshipData {
  id: string
  title: string
  date: string
  description: string
  image: string
  userId: number
  username?: string
  link: string
  imageUrl: string
}

interface Scholarship {
  id: string
  title: string
  date: string
  image: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
  userId: string | null
  username: string | null
  link: string | null
}

const findScholarship = async (): Promise<Scholarship[]> => {
  const scholarships = await prisma.scholarship.findMany()
  return scholarships
}

const findScholarshipById = async (id: string): Promise<Scholarship | null> => {
  const scholarship = await prisma.scholarship.findUnique({
    where: {
      id
    }
  })
  return scholarship
}

const insertScholarship = async (scholarshipData: ScholarshipData, userId: string): Promise<Scholarship> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new Error('User not found')
    }
    const scholarship = await prisma.scholarship.create({
      data: {
        title: scholarshipData.title,
        date: scholarshipData.date,
        description: scholarshipData.description,
        image: scholarshipData.image,
        link: scholarshipData.link,
        userId: userId,
        username: user.username
      }
    })
    return scholarship
  } catch (error: any) {
    throw new Error(`Error inserting scholarship: ${error.message}`)
  }
}

const editScholarship = async (id: string, scholarshipData: ScholarshipData, userId: string): Promise<Scholarship> => {
  const scholarship = await prisma.scholarship.update({
    where: {
      id
    },
    data: {
      title: scholarshipData.title,
      date: scholarshipData.date,
      description: scholarshipData.description,
      image: scholarshipData.image,
      link: scholarshipData.link,
      userId: userId
    }
  })
  return scholarship
}

const deleteScholarship = async (id: string): Promise<void> => {
  await prisma.scholarship.delete({
    where: {
      id
    }
  })
}

export {
  findScholarship,
  findScholarshipById,
  insertScholarship,
  deleteScholarship,
  editScholarship,
  ScholarshipData,
  Scholarship
}
