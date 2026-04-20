const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StatusPayload {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  newStatus: string;
  items: { product_name: string; brand: string; quantity: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

function buildStatusEmailHtml(p: StatusPayload): string {
  const statusLabel = STATUS_LABELS[p.newStatus] || p.newStatus;
  const itemList = p.items.map((i) => `<li>${i.brand} – ${i.product_name} (×${i.quantity})</li>`).join("");

  const emoji = p.newStatus === "delivered" ? "🎉" : p.newStatus === "out_for_delivery" ? "🏍️" : p.newStatus === "shipped" ? "🚚" : "⚙️";

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
      <h1 style="font-size:22px;margin-bottom:4px">${emoji} Order ${statusLabel}</h1>
      <p style="color:#666;margin-top:0">Order <strong>${p.orderNumber}</strong></p>
      <p>Hi ${p.customerName},</p>
      <p>Your order status has been updated to <strong>${statusLabel}</strong>.</p>
      ${p.newStatus === "out_for_delivery" ? "<p>Your order is on its way! Please be available to receive it.</p>" : ""}
      ${p.newStatus === "delivered" ? "<p>Your order has been delivered. We hope you love your items! 💛</p>" : ""}
      <h3 style="font-size:14px;margin-top:20px">Items in this order:</h3>
      <ul style="color:#555;font-size:14px">${itemList}</ul>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="font-size:12px;color:#999">Maggs Trove – Thank you for shopping with us!</p>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: StatusPayload = await req.json();
    const apiKey = Deno.env.get("RESEND_API_KEY");

    if (!apiKey) {
      console.error("RESEND_API_KEY not set");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const statusLabel = STATUS_LABELS[payload.newStatus] || payload.newStatus;
    const html = buildStatusEmailHtml(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Maggs Trove <onboarding@resend.dev>",
        to: [payload.customerEmail],
        subject: `${statusLabel} – Order ${payload.orderNumber}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Resend error: ${err}`);
      return new Response(
        JSON.stringify({ success: false, error: err }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[STATUS EMAIL] Sent to ${payload.customerEmail} - ${statusLabel}`);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Status notification error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
