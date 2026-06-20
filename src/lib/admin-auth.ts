import { useEffect, useState } from "react";

const SESSION_KEY = "kc_admin_session_v1";
const AUTH_EVENT = "kc-auth-change";

// Hardcoded master admin credentials.
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "kashmir2026";

const isClient = typeof window !== "undefined";

export function isAuthed(): boolean {
  if (!isClient) return false;
  return localStorage.getItem(SESSION_KEY) === "1";
}

export function login(username: string, password: string): boolean {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(SESSION_KEY, "1");
    window.dispatchEvent(new Event(AUTH_EVENT));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuth(): { ready: boolean; authed: boolean } {
  const [state, setState] = useState({ ready: false, authed: false });
  useEffect(() => {
    setState({ ready: true, authed: isAuthed() });
    const onChange = () => setState({ ready: true, authed: isAuthed() });
    window.addEventListener(AUTH_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(AUTH_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return state;
}
