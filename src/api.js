// src/api.js
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token");

const handle401 = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export const apiGet = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Token ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) { handle401(); return; }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

export const apiPost = async (endpoint, body) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handle401(); return; }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

export const apiPut = async (endpoint, body) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handle401(); return; }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

export const apiDelete = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { Authorization: `Token ${getToken()}` },
  });
  if (res.status === 401) { handle401(); return; }
  return res.ok;
};
