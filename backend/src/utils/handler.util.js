import { HTTP_STATUS } from '../common/http-status.common.js';
import { TypeToken } from '../common/type.common.js';

export const wrapRequestHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message, success: false });
    }
  };
};

export const checkTypeToken = (type) => {
  switch (type) {
    case TypeToken.RESET:
      return process.env.SEND_EMAIL_SECRET_KEY;
    case TypeToken.REGISTER:
      return process.env.SECRET_KEY_REGISTER;
    case TypeToken.LOGIN:
    default:
      return process.env.SECRET_KEY;
  }
};
