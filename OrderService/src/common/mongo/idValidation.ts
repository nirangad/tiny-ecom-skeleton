export default function validateId(req: any, res: any, next: any) {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.json({ status: 0, message: "Unsupported ID" });
  }
  next();
  return;
}
