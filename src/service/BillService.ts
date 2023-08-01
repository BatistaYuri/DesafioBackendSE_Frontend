import { Bill, Payment } from "@/models/types";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

export function getPayments(
  bill: Bill | null,
  company: string | null
): Promise<{ payments: Payment[] }> {
  return api
    .post<{ response: Payment }>(`/bill?companyPayment=${company}`, bill)
    .then((response) => {
      return { payments: response.data };
    })
    .catch((e) => {
      return e;
    });
}
