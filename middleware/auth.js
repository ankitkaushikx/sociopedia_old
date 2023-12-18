import JWT from "jsonwebtoken";
const { sign, verify } = JWT;
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("authorization");
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = JWT.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
