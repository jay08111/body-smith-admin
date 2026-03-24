import { __DEV__ } from "@/config/vars";
import DOMPurify from "dompurify";

export const verifyToken = (token: string | null) => {
  if (!token) {
    return false;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    if (!payload) {
      return false;
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    if (__DEV__) {
      // console.log("Token payload:", payload);
    }

    return true;
  } catch {
    return false;
  }
};

export const parseToken = (token: string | null) => {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) {
      return null;
    }

    return JSON.parse(atob(parts[1])) ?? null;
  } catch {
    return null;
  }
};

export const sanitizeHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ["script", "style"],
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "src",
      "allow",
      "allowfullscreen",
      "frameborder",
      "target",
      "width",
      "height",
      "title",
    ],
  });
};
