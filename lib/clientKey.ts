import { v4 as uuidv4 } from "uuid";

export function generateClientKey() {
  return uuidv4();
}

export function getClientKeyFromLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    console.error("localStorage is not defined");
    return null;
  }

  return localStorage.getItem("clientKey");
}

export function getClientKeyFromSession(session) {
  return session.clientKey || generateClientKey();
}

export function setClientKeyToLocalStorage(clientKey) {
  if (typeof window === "undefined" || !window.localStorage) {
    console.error("localStorage is not defined");
    return;
  }

  localStorage.setItem("clientKey", clientKey);
}

export function initializeClientKey() {
  if (typeof window === "undefined" || !window.localStorage) {
    console.error("localStorage is not defined");
    return;
  }

  let clientKey = localStorage.getItem("clientKey");
  if (!clientKey) {
    clientKey = generateClientKey();
    localStorage.setItem("clientKey", clientKey);
  }
}
