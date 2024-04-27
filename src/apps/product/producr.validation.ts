import Joi from "joi";
interface ProductData {
  name: string;
  description: string;
  image: string;
  price: number;
}
export const createProductValidation = (playload: ProductData)=> {
   const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
    });
    return schema.validate(playload);
};