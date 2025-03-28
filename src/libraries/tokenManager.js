// para generar el token de usuario
import jwt from "jsonwebtoken";

export const genarateToken = (id, name) => {
  const expiresIn = 1000 * 60 * 60;
  try {
    const token = jwt.sign({ id, name }, process.env.SECRET_JWT_KEY, {
      expiresIn,
    });
    return { token, expiresIn };
  } catch (error) {
    const msg = error.message;
  }
};
