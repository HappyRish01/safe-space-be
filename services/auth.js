import jwt from "jsonwebtoken";


const JWT_PASSWORD = "topserretnigga"

export function setUser(user) {
  // Full user object in payload after reduce the payload
  if (!user) {
    return null
  }
  const payload = {
    id: user.id,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_PASSWORD ,{
    expiresIn: "24h"
  });
}

export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_PASSWORD);
  } catch (e) {
    return null;
  }
}
