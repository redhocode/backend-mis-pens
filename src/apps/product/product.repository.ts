import prisma from '../../db'

interface Product {
  id: number
  name: string
  description: string | null // Sesuaikan dengan tipe data yang dikembalikan oleh Prisma
  image: string
  price: number
  createdAt: Date
  updatedAt: Date
}

interface ProductData {
  name: string
  description: string
  image: string
  price: number
}

const findProducts = async (): Promise<Product[]> => {
  const products = await prisma.product.findMany()
  return products
}

const findProductById = async (id: number): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })
  return product
}

const insertProduct = async (productData: ProductData): Promise<Product> => {
  const product = await prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      image: productData.image,
      price: productData.price
    }
  })
  return product
}

const deleteProduct = async (id: number): Promise<void> => {
  await prisma.product.delete({
    where: {
      id
    }
  })
}

const editProduct = async (id: number, productData: ProductData): Promise<Product> => {
  const product = await prisma.product.update({
    where: {
      id
    },
    data: {
      description: productData.description,
      image: productData.image,
      name: productData.name,
      price: productData.price
    }
  })
  return product
}

export { Product, ProductData, findProducts, findProductById, insertProduct, deleteProduct, editProduct }
