/**
 * Comgate payment gateway integration
 * Docs: https://help.comgate.cz/docs/api-protokol
 */

const COMGATE_API_URL = "https://payments.comgate.cz/v1.0";

type ComgateConfig = {
  merchant: string;
  secret: string;
  test: boolean;
};

function getConfig(): ComgateConfig {
  return {
    merchant: process.env.COMGATE_MERCHANT_ID || "",
    secret: process.env.COMGATE_SECRET || "",
    test: process.env.COMGATE_TEST_MODE === "true",
  };
}

export function isComgateConfigured(): boolean {
  const cfg = getConfig();
  return Boolean(cfg.merchant && cfg.secret);
}

type CreatePaymentParams = {
  orderId: string;
  orderNumber: string;
  totalCZK: number;
  email: string;
  label?: string;
};

type CreatePaymentResult =
  | { ok: true; transId: string; redirectUrl: string }
  | { ok: false; error: string };

export async function createComgatePayment(
  params: CreatePaymentParams
): Promise<CreatePaymentResult> {
  const cfg = getConfig();
  if (!cfg.merchant || !cfg.secret) {
    return { ok: false, error: "Comgate není nakonfigurován." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const body = new URLSearchParams({
    merchant: cfg.merchant,
    secret: cfg.secret,
    test: cfg.test ? "true" : "false",
    country: "CZ",
    price: String(Math.round(params.totalCZK * 100)),
    curr: "CZK",
    label: params.label || `Objednávka ${params.orderNumber}`,
    refId: params.orderId,
    email: params.email,
    prepareOnly: "true",
    url_paid: `${siteUrl}/api/comgate/callback`,
    url_cancelled: `${siteUrl}/api/comgate/callback`,
    url_pending: `${siteUrl}/api/comgate/callback`,
    method: "ALL",
    lang: "cs",
  });

  const res = await fetch(`${COMGATE_API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  const parsed = Object.fromEntries(new URLSearchParams(text));

  if (parsed.code !== "0") {
    return { ok: false, error: parsed.message || "Comgate chyba" };
  }

  return {
    ok: true,
    transId: parsed.transId,
    redirectUrl: `https://payments.comgate.cz/client/instructions/index?id=${parsed.transId}`,
  };
}

type ComgateStatus = "PAID" | "CANCELLED" | "PENDING" | "AUTHORIZED";

type GetStatusResult =
  | { ok: true; status: ComgateStatus; refId: string }
  | { ok: false; error: string };

export async function getComgateStatus(transId: string): Promise<GetStatusResult> {
  const cfg = getConfig();

  const body = new URLSearchParams({
    merchant: cfg.merchant,
    secret: cfg.secret,
    transId,
  });

  const res = await fetch(`${COMGATE_API_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  const parsed = Object.fromEntries(new URLSearchParams(text));

  if (parsed.code !== "0") {
    return { ok: false, error: parsed.message || "Comgate status chyba" };
  }

  return {
    ok: true,
    status: parsed.status as ComgateStatus,
    refId: parsed.refId,
  };
}
