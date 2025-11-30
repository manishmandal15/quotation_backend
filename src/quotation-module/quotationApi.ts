// src/quotation-module/quotationApi.ts
import axios from "axios";

// ⚡ Backend port fixed
export const BASE_URL = "http://localhost:5001/api";

export async function getQuotationByNumber(quotationNo: string) {
  try {
    const res = await axios.get(
      `${BASE_URL}/quotations/get-by-number/${encodeURIComponent(quotationNo)}`
    );
    return res; // full Axios response, frontend will use res.data
  } catch (err: any) {
    console.error("Axios GET Error:", err.response || err.message);
    throw err; // allow component to handle error
  }
}
