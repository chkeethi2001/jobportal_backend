import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "user","instructor","student","learner").required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

    
export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      statuscode: 400,
      message: error.details[0].message,
    });
  next();
};


export const validatelogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      statuscode: 400,
      message: error.details[0].message,
    });
  next();
};

