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
  return res.json(); // unchanged
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
  if (!res.ok) {
    const errText = await res.text();
    console.error("API error response:", errText);  // ✅ add this
    throw new Error(`Error ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
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
  const text = await res.text();           // ✅ changed
  return text ? JSON.parse(text) : null;   // ✅ changed
};

export const apiDelete = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { Authorization: `Token ${getToken()}` },
  });
  if (res.status === 401) { handle401(); return; }
  return res.ok; // unchanged
};