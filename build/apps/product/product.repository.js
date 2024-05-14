"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProduct = exports.deleteProduct = exports.insertProduct = exports.findProductById = exports.findProducts = void 0;
const db_1 = __importDefault(require("../../db"));
const findProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany();
    return products;
});
exports.findProducts = findProducts;
const findProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.default.product.findUnique({
        where: {
            id
        }
    });
    return product;
});
exports.findProductById = findProductById;
const insertProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.default.product.create({
        data: {
            name: productData.name,
            description: productData.description,
            image: productData.image,
            price: productData.price
        }
    });
    return product;
});
exports.insertProduct = insertProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.product.delete({
        where: {
            id
        }
    });
});
exports.deleteProduct = deleteProduct;
const editProduct = (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield db_1.default.product.update({
        where: {
            id
        },
        data: {
            description: productData.description,
            image: productData.image,
            name: productData.name,
            price: productData.price
        }
    });
    return product;
});
exports.editProduct = editProduct;
//# sourceMappingURL=product.repository.js.map