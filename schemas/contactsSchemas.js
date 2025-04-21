import Joi from "joi";

/**
 * acceptable:
 * 
 * +380931112233
 * +1 (800) 555-1234
 * +49 151 12345678
 * 067-123-4567
 * 093 123 45 67
 */
const phonePattern =  new RegExp("^\\+?[\\d\\s\\-()]{10,20}$");

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(phonePattern).optional(),
    favorite: Joi.boolean().optional(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().regex(phonePattern).optional(),
    favorite: Joi.boolean().optional(),
})

export const favoriteContactSchema = Joi.object({
    favorite: Joi.boolean().required()
})