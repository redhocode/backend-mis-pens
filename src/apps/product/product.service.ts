// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
// reusable

import {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} from "./product.repository";
import { ProductData, Product } from "./product.repository";
import { createProductValidation } from "./producr.validation";
const getAllProducts = async (): Promise<Product[]> => {
  const products = await findProducts();
  return products;
};

const getProductById = async (id: number): Promise<Product> => {
  const product = await findProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const createProduct = async (newProductData: ProductData): Promise<Product> => {
  // Validasi data produk menggunakan fungsi validasi
  const { error, value } = createProductValidation(newProductData);
  if (error) {
    // Jika terjadi kesalahan validasi, lemparkan error
    throw new Error(error.details[0].message);
  }

  // Jika data produk valid, lanjutkan dengan menyisipkan produk ke dalam database
  const product = await insertProduct(newProductData);
  return product;
};

const deleteProductById = async (id: number): Promise<void> => {
  await getProductById(id);
  await deleteProduct(id);
};

const editProductById = async (id: number, productData: ProductData): Promise<Product> => {
  await getProductById(id);
  const product = await editProduct(id, productData);
  return product;
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
};
