import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderPayload {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: { product_name: string; brand: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}

const ADMIN_EMAIL = "mosaichive@gmail.com";
const ADMIN_PHONE = "+233544909011";

function buildEmailHtml(payload: OrderPayload): string {
  const itemRows = payload.items
    .map(
      (i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.brand} – ${i.product_name}</td><td style="padding:8px;border-bottom:1px solid #eee">Size ${i.size} × ${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">GH₵${(i.price * i.quantity).toFixed(2)}</td></tr>`
    )
    .join("");

  const paymentLabels: Record<string, string> = {
    mobile_money: "Mobile Money",
    card: "Credit / Debit Card",
    cash: "Cash on Delivery",
  };

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
      <h1 style="font-size:22px;margin-bottom:4px">Order Confirmed ✓</h1>
      <p style="color:#666;margin-top:0">Order <strong>${payload.orderNumber}</strong></p>
      <p>Hi ${payload.customerName},</p>
      <p>Thank you for your order! Here's your summary:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:left">Details</th><th style="padding:8px;text-align:right">Price</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <table style="width:100%;margin:16px 0">
        <tr><td style="padding:4px 0;color:#666">Subtotal</td><td style="text-align:right">GH₵${payload.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Shipping</td><td style="text-align:right">${payload.shippingCost === 0 ? "FREE" : `GH₵${payload.shippingCost.toFixed(2)}`}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Payment</td><td style="text-align:right">${paymentLabels[payload.paymentMethod] || payload.paymentMethod}</td></tr>
        <tr style="font-weight:bold;font-size:16px"><td style="padding:8px 0;border-top:2px solid #222">Total</td><td style="text-align:right;border-top:2px solid #222">GH₵${payload.total.toFixed(2)}</td></tr>
      </table>
      <p style="color:#666;font-size:13px">Shipping to: ${payload.shippingAddress}</p>
      <p style="color:#666;font-size:13px;margin-top:24px">Estimated delivery: 3–7 business days</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="font-size:12px;color:#999">Maggs Trove – Thank you for shopping with us!</p>
    </div>
  `;
}

function buildSmsBody(payload: OrderPayload): string {
  const itemList = payload.items
    .map((i) => `${i.brand} ${i.product_name} (${i.size}) x${i.quantity}`)
    .join(", ");
  return `🛍️ New Order ${payload.orderNumber}\nCustomer: ${payload.customerName}\nItems: ${itemList}\nTotal: GH₵${payload.total.toFixed(2)}\nPayment: ${payload.paymentMethod}\nShip to: ${payload.shippingAddress}`;
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Maggs Trove <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error (${res.status}): ${err}`);
  }
  console.log(`[EMAIL] Sent to ${to}`);
}

async function sendWhatsApp(to: string, body: string): Promise<void> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  if (!accountSid || !authToken) throw new Error("Twilio credentials not set");

  // Twilio WhatsApp Sandbox number
  const fromAddr = "whatsapp:+14155238886";
  const toAddr = `whatsapp:${to}`;

  const params = new URLSearchParams();
  params.set("From", fromAddr);
  params.set("To", toAddr);
  params.set("Body", body);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio error (${res.status}): ${err}`);
  }
  console.log(`[WHATSAPP] Sent to ${to}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: OrderPayload = await req.json();
    const emailHtml = buildEmailHtml(payload);
    const smsBody = buildSmsBody(payload);
    const results: Record<string, string> = {};

    // 1. Email to customer
    try {
      await sendResendEmail(
        payload.customerEmail,
        `Order Confirmed – ${payload.orderNumber}`,
        emailHtml
      );
      results.customerEmail = "sent";
    } catch (e) {
      console.error("[EMAIL] Customer:", e.message);
      results.customerEmail = `failed: ${e.message}`;
    }

    // 2. Email to admin
    try {
      await sendResendEmail(
        ADMIN_EMAIL,
        `🛍️ New Order ${payload.orderNumber} – GH₵${payload.total.toFixed(2)}`,
        emailHtml
      );
      results.adminEmail = "sent";
    } catch (e) {
      console.error("[EMAIL] Admin:", e.message);
      results.adminEmail = `failed: ${e.message}`;
    }

    // 3. WhatsApp to admin
    try {
      await sendWhatsApp(ADMIN_PHONE, smsBody);
      results.adminWhatsApp = "sent";
    } catch (e) {
      console.error("[WHATSAPP] Admin:", e.message);
      results.adminWhatsApp = `failed: ${e.message}`;
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Order notification error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
