"use strict";
// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
// reusable
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProductById = exports.deleteProductById = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_repository_1 = require("./product.repository");
const producr_validation_1 = require("./producr.validation");
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, product_repository_1.findProducts)();
    return products;
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield (0, product_repository_1.findProductById)(id);
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
});
exports.getProductById = getProductById;
const createProduct = (newProductData) => __awaiter(void 0, void 0, void 0, function* () {
    // Validasi data produk menggunakan fungsi validasi
    const { error, value } = (0, producr_validation_1.createProductValidation)(newProductData);
    if (error) {
        // Jika terjadi kesalahan validasi, lemparkan error
        throw new Error(error.details[0].message);
    }
    // Jika data produk valid, lanjutkan dengan menyisipkan produk ke dalam database
    const product = yield (0, product_repository_1.insertProduct)(newProductData);
    return product;
});
exports.createProduct = createProduct;
const deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield getProductById(id);
    yield (0, product_repository_1.deleteProduct)(id);
});
exports.deleteProductById = deleteProductById;
const editProductById = (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
    yield getProductById(id);
    const product = yield (0, product_repository_1.editProduct)(id, productData);
    return product;
});
exports.editProductById = editProductById;
//# sourceMappingURL=product.service.js.map