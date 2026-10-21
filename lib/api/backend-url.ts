import "server-only";

export function getBackendUrl() {
  const backendUrl = process.env.BACKEND_URL ?? process.env.BCKEND_URL;
  return backendUrl?.replace(/\/+$/, "");
}
