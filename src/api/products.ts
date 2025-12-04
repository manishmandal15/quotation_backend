import axios from "axios";
import { BASE_URL } from "./config";

// Normal JSON requests
export const ProductsAPI = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: { "Content-Type": "application/json" },
});

// For image upload (multipart)
export const ProductsUploadAPI = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: { "Content-Type": "multipart/form-data" },
});
