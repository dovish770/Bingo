interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export const implementToken = (token: string): void => {
    document.cookie = `Token=${token}; path=/; max-age=3600; SameSite=None; Secure`;
};

export const getCookieValue = (cookieName: string): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");

    if (key === cookieName) {
        console.log("value", value);
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const getUserIdFromToken = (): string | null => {
  try {
    const token = getCookieValue("Token");
    if (!token) {
      console.warn("No token found in cookies");
      return null;
    }

    const [, payload] = token.split(".");
    if (!payload) {
      console.warn("Invalid token structure");
      return null;
    }

    const decodedPayload = JSON.parse(atob(payload)) as DecodedToken;

    return decodedPayload.userId || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getToken = () => {
  console.log(document.cookie); 
  return document.cookie
      .split("; ")
      .find(row => row.startsWith("Token="))
      ?.split("=")[1];
};