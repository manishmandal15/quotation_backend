import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

export async function getQuotationByNumber(quotationNo: string) {
  const res = await axios.get(`${BASE_URL}/quotations/get-by-number/${encodeURIComponent(quotationNo)}`);
  return res.data;
}
