// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response } from "express";
import { getAllProducts, getProductById, createProduct, deleteProductById, editProductById } from "./product.service";
import { logger } from "../../utils/logger";
import { createProductValidation } from "./producr.validation";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    logger.info("Get all products success");
    res.status(200).send(products);
  } catch (err:any) {
    logger.error(err);
    res.status(400).send(err.message);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.id);
    const product = await getProductById(productId);
    logger.info(`Get product with id ${productId} success`);
    res.status(200).send({status:true,statusCode:200,data:product});
  } catch (err: any) {
    logger.error(err);
    res.status(400).send(err.message);
  }
});

router.post("/", async (req: Request, res: Response) => {
 try {
    const newProductData = req.body;

    // Lakukan validasi pada data produk
    const { error } = createProductValidation(newProductData);
    if (error) {
      // Jika validasi gagal, kirimkan respon dengan status 422 dan pesan kesalahan
      logger.error(`Error validating product data: ${error.message}`);
      return res.status(422).send({ status: false, statusCode: 422, message: error.message });
    }

    // Jika validasi berhasil, lanjutkan dengan membuat produk baru
    const product = await createProduct(newProductData);
    logger.info("Product created successfully");

    // Kirimkan respon dengan status 200 dan data produk yang berhasil dibuat
    res.status(200).send({ status: true, statusCode: 200, data: product });
  } catch (error: any) {
    // Tangani kesalahan yang terjadi
    logger.error(`Error creating product: ${error.message}`);
    res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.id);
    await deleteProductById(productId);
    logger.info(`Delete product with id ${productId} success`);
    res.send("product deleted");
  } catch (error: any) {
    logger.error(error);
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const productId: number = parseInt(req.params.id);
  const productData = req.body;

  if (!(productData.image && productData.description && productData.name && productData.price)) {
    logger.error("Some fields are missing");
    return res.status(400).send("Some fields are missing");
  }

  try {
    const product = await editProductById(productId, productData);
    logger.info(`Edit product with id ${productId} success`);
    res.send({
      data: product,
      message: "edit product success",
    });
  } catch (error: any) {
    logger.error(error);
    res.status(400).send(error.message);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.id);
    const productData = req.body;
    const product = await editProductById(productId, productData);
    logger.info(`Edit product with id ${productId} success`);
    res.send({
      data: product,
      message: "edit product success",
    });
  } catch (err : any) {
    logger.error(err);
    res.status(400).send(err.message);
  }
});

export default router;
