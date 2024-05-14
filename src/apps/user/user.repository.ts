import prisma from '../../db'

export interface UserData {
  username: string
  password: string
  role?: string
}

export interface User {
  id: String
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const findUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany()
  return users
}

const findUsersById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })
  return user
}

const insertUser = async (userData: UserData, accessToken: string): Promise<User> => {
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password
    }
  })
  return user
}

const editUser = async (id: string, userData: UserData): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id
    },
    data: {
      username: userData.username,
      password: userData.password
    }
  })
  return user
}

const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: {
      id
    }
  })
}
const findUserByusername = async (username: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })
  return user
}
// const saveAccessToken = async (userId: number, accessToken: string): Promise<void> => {
//     try {
//         await prisma.user.update({
//             where: { id: userId }, // Gunakan ID pengguna untuk menemukan pengguna yang sesuai
//             data: { accessToken } // Update kolom accessToken dengan nilai baru
//         });
//     } catch (error: any) {
//         throw new Error(`Error saving access token: ${error.message}`);
//     }
// };

export {
  findUserByusername,
  findUsers,
  findUsersById,
  editUser,
  deleteUser
  // saveAccessToken
}
