/**
 * QR platba ve formátu SPD (Short Payment Descriptor)
 * Spec: https://qr-platba.cz/pro-vyvojare/specifikace-formatu/
 */

type QRPaymentParams = {
  amount: number;
  orderNumber: string;
  message?: string;
};

const BANK_IBAN = "CZ4301000000432367040227";
const BANK_BIC = "KOMBCZPPXXX";
const BENEFICIARY_NAME = "Masi-co s.r.o.";

export function generateSPDString(params: QRPaymentParams): string {
  const parts = [
    "SPD*1.0",
    `ACC:${BANK_IBAN}+${BANK_BIC}`,
    `AM:${params.amount.toFixed(2)}`,
    "CC:CZK",
    `X-VS:${params.orderNumber.replace(/\D/g, "")}`,
    `MSG:${params.message || `Objednavka ${params.orderNumber}`}`,
    `RN:${BENEFICIARY_NAME}`,
  ];

  return parts.join("*");
}

export function getQRCodeUrl(spdString: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(spdString)}`;
}
