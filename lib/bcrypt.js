export async function getBcrypt() {
  const bcrypt = await import("bcrypt");
  return bcrypt.default || bcrypt;
}
