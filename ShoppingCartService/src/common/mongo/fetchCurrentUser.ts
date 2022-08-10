import axios from "axios";

export default async function fetchCurrentUser(req: any, res: any, next: any) {
  const getUserUrl = `http://${process.env.AUTH_SERVICE_NAME}:${process.env.AUTH_SERVER_PORT}/auth/users/current`;
  if (!req.user || !req.user.email) {
    return res.status(401).json({ status: 0, message: "Unauthorized" });
  }

  const response = await axios.get(getUserUrl, {
    headers: {
      authorization: req.headers["authorization"],
      "accept-language": req.headers["accept-language"],
    },
  });
  req.currentUser = response.data.message;
  next();
  return;
}
