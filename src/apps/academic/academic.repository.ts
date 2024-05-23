import prisma from '../../db'

interface AcademicData {
  id: string
  title: string
  date: string
  description: string
  image: string 
  link: string
  userId: string
  username?: string
  imageUrl: string

}

interface Academic {
  id: string
  title: string
  image: string | null
  date: string | null
  description: string | null
  link: string | null
  createdAt: Date
  updatedAt: Date
  userId: string | null
  
}

const findAcademics = async (): Promise<Academic[]> => {
  const academics = await prisma.academic.findMany()
  return academics
}

const insertAcademic = async (academicData: AcademicData, userId: string): Promise<Academic> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      throw new Error('User not found')
    }
    const academic = await prisma.academic.create({
      data: {
        title: academicData.title,
        date: academicData.date,
        description: academicData.description,
        image: academicData.image,
        link: academicData.link,
        userId: userId,
        username: user.username
      }
    })
    return academic
  } catch (error) {
    throw new Error(`Error inserting academic: ${error}`)
  }
}
const updateAcademic = async (id: string, academicData: AcademicData, userId: string): Promise<Academic> => {
  const academic = await prisma.academic.update({
    where: {
      id
    },
    data: {
      title: academicData.title,
      date: academicData.date,
      image: academicData.image,
      description: academicData.description,
      userId: userId,
      link: academicData.link
    }
  })
  return academic
}

const deleteAcademic = async (id: string): Promise<Academic> => {
  const academic = await prisma.academic.delete({
    where: {
      id
    }
  })
  return academic
}

const findAcademicById = async (id: string): Promise<Academic | null> => {
  const academic = await prisma.academic.findUnique({
    where: {
      id
    }
  })
  return academic
}

export { findAcademics, insertAcademic, updateAcademic, deleteAcademic, findAcademicById, AcademicData, Academic }
