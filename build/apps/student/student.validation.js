"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const createStudentValidation = (playload) => {
    const schema = joi_1.default.object({
        nrp: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        major: joi_1.default.string().required(),
        year: joi_1.default.number().required(),
        semester: joi_1.default.number().required(),
        status: joi_1.default.string().required(),
        ipk: joi_1.default.number().optional(),
        userId: joi_1.default.string().optional(),
    });
    return schema.validate(playload);
};
exports.createStudentValidation = createStudentValidation;
//# sourceMappingURL=student.validation.js.map