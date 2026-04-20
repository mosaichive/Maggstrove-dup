const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderPayload {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string | null;
  items: { product_name: string; brand: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  fulfillmentType?: "delivery" | "pickup";
}

type NotificationResult = Record<string, string>;

const ADMIN_EMAIL = Deno.env.get("ORDER_ADMIN_EMAIL") ?? "mosaichive@gmail.com";
const ADMIN_PHONE = Deno.env.get("ORDER_ADMIN_PHONE") ?? "+233544909011";
const EMAIL_FROM = Deno.env.get("RESEND_FROM_EMAIL") ?? "Maggs Trove <onboarding@resend.dev>";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function humanizePaymentMethod(paymentMethod: string): string {
  const labelMap: Record<string, string> = {
    "cash_on_delivery": "Cash on Delivery",
    "paystack:mobile_money": "Paystack Mobile Money",
    "paystack:card": "Paystack Card",
    "paystack:bank_transfer": "Paystack Bank Transfer",
  };

  if (labelMap[paymentMethod]) {
    return labelMap[paymentMethod];
  }

  if (paymentMethod.startsWith("paystack:")) {
    const channel = paymentMethod.replace("paystack:", "").replaceAll("_", " ");
    return `Paystack ${channel.replace(/\b\w/g, (char) => char.toUpperCase())}`;
  }

  return paymentMethod.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizePhoneNumber(phone?: string | null): string | null {
  if (!phone) return null;

  const strippedPrefix = phone.startsWith("whatsapp:") ? phone.slice("whatsapp:".length) : phone;
  const cleaned = strippedPrefix.replace(/[^\d+]/g, "");

  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return `+${cleaned.slice(1).replace(/\D/g, "")}`;

  const digits = cleaned.replace(/\D/g, "");

  if (digits.startsWith("233")) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+233${digits.slice(1)}`;
  if (digits.length === 9) return `+233${digits}`;
  if (digits.length >= 10) return `+${digits}`;

  return null;
}

function buildLineItemsHtml(payload: OrderPayload): string {
  return payload.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.brand)} - ${escapeHtml(item.product_name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">Size ${escapeHtml(item.size)} x ${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">GHc${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`,
    )
    .join("");
}

function buildCustomerEmailHtml(payload: OrderPayload): string {
  const paymentLabel = humanizePaymentMethod(payload.paymentMethod);
  const lineItems = buildLineItemsHtml(payload);
  const fulfillmentLabel = payload.fulfillmentType === "pickup" ? "Store Pickup" : "Delivery";

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
      <h1 style="font-size:22px;margin-bottom:4px">Order Confirmed</h1>
      <p style="color:#666;margin-top:0">Order <strong>${escapeHtml(payload.orderNumber)}</strong></p>
      <p>Hi ${escapeHtml(payload.customerName)},</p>
      <p>Thank you for your order. We have received it and will contact you shortly.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:left">Details</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${lineItems}</tbody>
      </table>
      <table style="width:100%;margin:16px 0">
        <tr><td style="padding:4px 0;color:#666">Fulfillment</td><td style="text-align:right">${escapeHtml(fulfillmentLabel)}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Subtotal</td><td style="text-align:right">GHc${payload.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Shipping</td><td style="text-align:right">${payload.shippingCost === 0 ? "FREE" : `GHc${payload.shippingCost.toFixed(2)}`}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Payment</td><td style="text-align:right">${escapeHtml(paymentLabel)}</td></tr>
        <tr style="font-weight:bold;font-size:16px"><td style="padding:8px 0;border-top:2px solid #222">Total</td><td style="text-align:right;border-top:2px solid #222">GHc${payload.total.toFixed(2)}</td></tr>
      </table>
      <p style="color:#666;font-size:13px">Address: ${escapeHtml(payload.shippingAddress)}</p>
      <p style="color:#666;font-size:13px;margin-top:24px">If you have any questions, reply to this email and our team will help.</p>
    </div>
  `;
}

function buildAdminEmailHtml(payload: OrderPayload): string {
  const paymentLabel = humanizePaymentMethod(payload.paymentMethod);
  const lineItems = buildLineItemsHtml(payload);

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#222">
      <h1 style="font-size:22px;margin-bottom:4px">New Order Received</h1>
      <p style="color:#666;margin-top:0">Order <strong>${escapeHtml(payload.orderNumber)}</strong></p>
      <table style="width:100%;margin:16px 0;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#666">Customer</td><td style="text-align:right">${escapeHtml(payload.customerName)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="text-align:right">${escapeHtml(payload.customerEmail)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="text-align:right">${escapeHtml(payload.customerPhone ?? "Not provided")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Payment</td><td style="text-align:right">${escapeHtml(paymentLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Ship To</td><td style="text-align:right">${escapeHtml(payload.shippingAddress)}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:left">Details</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${lineItems}</tbody>
      </table>
      <table style="width:100%;margin:16px 0">
        <tr><td style="padding:4px 0;color:#666">Subtotal</td><td style="text-align:right">GHc${payload.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#666">Shipping</td><td style="text-align:right">${payload.shippingCost === 0 ? "FREE" : `GHc${payload.shippingCost.toFixed(2)}`}</td></tr>
        <tr style="font-weight:bold;font-size:16px"><td style="padding:8px 0;border-top:2px solid #222">Total</td><td style="text-align:right;border-top:2px solid #222">GHc${payload.total.toFixed(2)}</td></tr>
      </table>
    </div>
  `;
}

function buildCustomerSmsBody(payload: OrderPayload): string {
  return `Maggs Trove: your order ${payload.orderNumber} for GHc${payload.total.toFixed(2)} was received. Payment: ${humanizePaymentMethod(payload.paymentMethod)}. We will contact you soon.`;
}

function buildAdminSmsBody(payload: OrderPayload): string {
  return `New order ${payload.orderNumber}. ${payload.customerName}, ${payload.customerPhone ?? "no phone"}, GHc${payload.total.toFixed(2)}, ${humanizePaymentMethod(payload.paymentMethod)}.`;
}

function buildAdminCallTwiml(payload: OrderPayload): string {
  const paymentLabel = humanizePaymentMethod(payload.paymentMethod);
  return `<Response><Say voice="alice">New Maggs Trove order received. Order number ${escapeXml(payload.orderNumber)}. Customer ${escapeXml(payload.customerName)}. Total ${payload.total.toFixed(2)} Ghana cedis. Payment method ${escapeXml(paymentLabel)}. Please review the admin dashboard.</Say></Response>`;
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error (${response.status}): ${await response.text()}`);
  }
}

async function sendTwilioFormRequest(path: string, params: URLSearchParams): Promise<void> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");

  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set");
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Twilio error (${response.status}): ${await response.text()}`);
  }
}

async function sendSms(to: string, body: string): Promise<void> {
  const from = Deno.env.get("TWILIO_SMS_FROM");
  if (!from) throw new Error("TWILIO_SMS_FROM not set");

  const params = new URLSearchParams();
  params.set("From", from);
  params.set("To", to);
  params.set("Body", body);

  await sendTwilioFormRequest("Messages.json", params);
}

async function sendWhatsApp(to: string, body: string): Promise<void> {
  const from = Deno.env.get("TWILIO_WHATSAPP_FROM");
  if (!from) throw new Error("TWILIO_WHATSAPP_FROM not set");

  const params = new URLSearchParams();
  params.set("From", from);
  params.set("To", `whatsapp:${to}`);
  params.set("Body", body);

  await sendTwilioFormRequest("Messages.json", params);
}

async function sendCall(to: string, twiml: string): Promise<void> {
  const from = Deno.env.get("TWILIO_CALL_FROM");
  if (!from) throw new Error("TWILIO_CALL_FROM not set");

  const params = new URLSearchParams();
  params.set("From", from);
  params.set("To", to);
  params.set("Twiml", twiml);

  await sendTwilioFormRequest("Calls.json", params);
}

async function captureResult(results: NotificationResult, key: string, action: () => Promise<void>) {
  try {
    await action();
    results[key] = "sent";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${key}]`, message);
    results[key] = `failed: ${message}`;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json() as OrderPayload;
    const results: NotificationResult = {};
    const adminPhone = normalizePhoneNumber(ADMIN_PHONE);
    const customerPhone = normalizePhoneNumber(payload.customerPhone);
    const customerEmailHtml = buildCustomerEmailHtml(payload);
    const adminEmailHtml = buildAdminEmailHtml(payload);
    const customerSmsBody = buildCustomerSmsBody(payload);
    const adminSmsBody = buildAdminSmsBody(payload);
    const adminCallTwiml = buildAdminCallTwiml(payload);

    await captureResult(results, "customerEmail", async () => {
      if (!payload.customerEmail) throw new Error("Customer email is missing");
      await sendResendEmail(payload.customerEmail, `Order Confirmed - ${payload.orderNumber}`, customerEmailHtml);
    });

    await captureResult(results, "customerSms", async () => {
      if (!customerPhone) throw new Error("Customer phone is missing or invalid");
      await sendSms(customerPhone, customerSmsBody);
    });

    await captureResult(results, "adminEmail", async () => {
      await sendResendEmail(
        ADMIN_EMAIL,
        `New Order ${payload.orderNumber} - GHc${payload.total.toFixed(2)}`,
        adminEmailHtml,
      );
    });

    await captureResult(results, "adminSms", async () => {
      if (!adminPhone) throw new Error("Admin phone is missing or invalid");
      await sendSms(adminPhone, adminSmsBody);
    });

    await captureResult(results, "adminWhatsApp", async () => {
      if (!adminPhone) throw new Error("Admin phone is missing or invalid");
      await sendWhatsApp(adminPhone, adminSmsBody);
    });

    await captureResult(results, "adminCall", async () => {
      if (!adminPhone) throw new Error("Admin phone is missing or invalid");
      await sendCall(adminPhone, adminCallTwiml);
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Order notification error:", message);

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
