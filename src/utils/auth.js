import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch {
    return null;
  }
}

export function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  } catch {
    return null;
  }
}
