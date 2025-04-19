import Joi from "joi";

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const subscriptionUserSchema = Joi.object({
    email: Joi.string().email().required(),
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});