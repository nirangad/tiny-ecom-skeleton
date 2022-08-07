import axios from "axios";

export default async function fetchCurrentUser(req: any, res: any, next: any) {
  const getUserUrl = `${process.env.AUTH_SERVER}/auth/users/current`;
  console.log(
    `Get URL(fetchUser): ${process.env.AUTH_SERVER}/auth/users/current`
  );

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
