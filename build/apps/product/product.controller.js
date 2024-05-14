"use strict";
// Layer untuk handle request dan response
// Biasanya juga handle validasi body
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
const express_1 = __importDefault(require("express"));
const product_service_1 = require("./product.service");
const logger_1 = require("../../utils/logger");
const producr_validation_1 = require("./producr.validation");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_service_1.getAllProducts)();
        logger_1.logger.info('Get all products success');
        res.status(200).send(products);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const product = yield (0, product_service_1.getProductById)(productId);
        logger_1.logger.info(`Get product with id ${productId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: product });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProductData = req.body;
        // Lakukan validasi pada data produk
        const { error } = (0, producr_validation_1.createProductValidation)(newProductData);
        if (error) {
            // Jika validasi gagal, kirimkan respon dengan status 422 dan pesan kesalahan
            logger_1.logger.error(`Error validating product data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        // Jika validasi berhasil, lanjutkan dengan membuat produk baru
        const product = yield (0, product_service_1.createProduct)(newProductData);
        logger_1.logger.info('Product created successfully');
        // Kirimkan respon dengan status 200 dan data produk yang berhasil dibuat
        res.status(200).send({ status: true, statusCode: 200, data: product });
    }
    catch (error) {
        // Tangani kesalahan yang terjadi
        logger_1.logger.error(`Error creating product: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        yield (0, product_service_1.deleteProductById)(productId);
        logger_1.logger.info(`Delete product with id ${productId} success`);
        res.send('product deleted');
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    const productData = req.body;
    if (!(productData.image && productData.description && productData.name && productData.price)) {
        logger_1.logger.error('Some fields are missing');
        return res.status(400).send('Some fields are missing');
    }
    try {
        const product = yield (0, product_service_1.editProductById)(productId, productData);
        logger_1.logger.info(`Edit product with id ${productId} success`);
        res.send({
            data: product,
            message: 'edit product success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const productData = req.body;
        const product = yield (0, product_service_1.editProductById)(productId, productData);
        logger_1.logger.info(`Edit product with id ${productId} success`);
        res.send({
            data: product,
            message: 'edit product success'
        });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
exports.default = router;
//# sourceMappingURL=product.controller.js.map