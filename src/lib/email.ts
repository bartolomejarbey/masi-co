/**
 * Transactional email with Resend
 * When RESEND_API_KEY is not set, emails are logged to console.
 */

type OrderConfirmationParams = {
  to: string;
  orderNumber: string;
  firstName: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; unit: string }>;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  bankTransferSPD?: string;
  qrCodeUrl?: string;
};

const PAYMENT_LABELS: Record<string, string> = {
  cash_on_delivery: "Dobírka (hotovost při převzetí)",
  meal_vouchers: "Stravenky při převzetí",
  online_card: "Online kartou (Comgate)",
  bank_transfer: "Bankovním převodem",
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(amount);
}

function buildOrderConfirmationHTML(params: OrderConfirmationParams): string {
  const itemRows = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity} ${item.unit}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.unitPrice * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const bankSection =
    params.paymentMethod === "bank_transfer" && params.qrCodeUrl
      ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px">
          <p style="margin:0 0 8px;font-weight:600">Platební údaje:</p>
          <p style="margin:0">Číslo účtu: 43-2367040227/0100</p>
          <p style="margin:0">VS: ${params.orderNumber.replace(/\D/g, "")}</p>
          <p style="margin:0">Částka: ${formatPrice(params.total)}</p>
          <p style="margin:16px 0 8px;font-weight:600">QR kód pro platbu:</p>
          <img src="${params.qrCodeUrl}" alt="QR platba" width="180" height="180" />
        </div>`
      : "";

  return `
<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #CC1939">
    <h1 style="margin:0;color:#CC1939;font-size:24px">MASI-CO</h1>
    <p style="margin:4px 0 0;color:#666;font-size:13px">maso s respektem</p>
  </div>

  <div style="padding:24px 0">
    <h2 style="margin:0 0 8px">Potvrzení objednávky ${params.orderNumber}</h2>
    <p>Dobrý den, ${params.firstName},</p>
    <p>děkujeme za Vaši objednávku. Níže najdete přehled objednaných položek.</p>

    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left;font-size:13px">Položka</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px">Množství</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px">Cena</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px;font-weight:700;font-size:15px">Celkem (orientačně)</td>
          <td style="padding:12px;font-weight:700;text-align:right;font-size:15px;color:#CC1939">${formatPrice(params.total)}</td>
        </tr>
      </tfoot>
    </table>

    <p><strong>Způsob platby:</strong> ${PAYMENT_LABELS[params.paymentMethod] || params.paymentMethod}</p>
    <p><strong>Doručení:</strong> Vlastní rozvoz — ${params.shippingAddress}</p>

    ${bankSection}

    <p style="margin-top:24px;padding:16px;background:#fffbeb;border-radius:8px;font-size:13px;color:#92400e">
      Cena je orientační — konečná cena odpovídá skutečné navážené hmotnosti. Přesnou částku vám potvrdíme při zpracování objednávky.
    </p>
  </div>

  <div style="border-top:1px solid #e5e7eb;padding:16px 0;text-align:center;font-size:12px;color:#9ca3af">
    <p>Masi-co s.r.o. | Jana Zajíce 563/20, 170 00 Praha 7</p>
    <p>objednavky@masi-co.com | +420 222 533 001</p>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmation(params: OrderConfirmationParams): Promise<void> {
  const html = buildOrderConfirmationHTML(params);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[EMAIL] Resend not configured — logging email to console");
    console.log(`[EMAIL] To: ${params.to}`);
    console.log(`[EMAIL] Subject: Potvrzení objednávky ${params.orderNumber}`);
    console.log(`[EMAIL] Items: ${params.items.length}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "MASI-CO <objednavky@masi-co.com>",
      to: [params.to],
      subject: `Potvrzení objednávky ${params.orderNumber}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[EMAIL] Resend error:", err);
  }
}
