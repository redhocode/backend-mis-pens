import prisma from '../../db'

interface AcademicData {
  id: string
  title: string
  date: string
  description: string
  link: string
  userId: string
  username?: string
}

interface Academic {
  id: string
  title: string
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

const insertAcademic = async (academicData: AcademicData): Promise<Academic> => {
  // const user = await prisma.user.findUnique({
  //     where: {
  //         id: academicData.userId,
  //     },
  // })
  const academic = await prisma.academic.create({
    data: {
      title: academicData.title,
      date: academicData.date,
      description: academicData.description,
      link: academicData.link,
      userId: academicData.userId
      // username: user?.username,
    }
  })
  return academic
}
const updateAcademic = async (id: string, academicData: AcademicData): Promise<Academic> => {
  const academic = await prisma.academic.update({
    where: {
      id
    },
    data: {
      title: academicData.title,
      date: academicData.date,
      description: academicData.description,
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
