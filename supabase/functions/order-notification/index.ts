const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

async function sendEmail(apiKey, from, to, subject, html) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from,
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  if (!response.ok) {
    throw new Error("Resend error (" + response.status + "): " + await response.text());
  }
}

Deno.serve(async function (req) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const payload = await req.json();
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("RESEND_FROM_EMAIL") || "Maggs Trove <onboarding@resend.dev>";
    const adminEmail = Deno.env.get("ORDER_ADMIN_EMAIL") || "mosaichive@gmail.com";

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "RESEND_API_KEY not set"
      }), {
        status: 500,
        headers,
      });
    }

    const orderNumber = payload.orderNumber || "UNKNOWN";
    const customerEmail = payload.customerEmail;
    const customerName = payload.customerName || "Customer";
    const total = Number(payload.total || 0).toFixed(2);
    const paymentMethod = payload.paymentMethod || "unknown";
    const shippingAddress = payload.shippingAddress || "Not provided";

    const customerHtml =
      "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222\">" +
      "<h1>Order Confirmed</h1>" +
      "<p>Hi " + customerName + ",</p>" +
      "<p>Thank you for your order.</p>" +
      "<p><strong>Order Number:</strong> " + orderNumber + "</p>" +
      "<p><strong>Total:</strong> GHc" + total + "</p>" +
      "<p><strong>Payment:</strong> " + paymentMethod + "</p>" +
      "<p><strong>Shipping Address:</strong> " + shippingAddress + "</p>" +
      "</div>";

    const adminHtml =
      "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222\">" +
      "<h1>New Order Received</h1>" +
      "<p><strong>Order Number:</strong> " + orderNumber + "</p>" +
      "<p><strong>Customer:</strong> " + customerName + "</p>" +
      "<p><strong>Customer Email:</strong> " + (customerEmail || "none") + "</p>" +
      "<p><strong>Total:</strong> GHc" + total + "</p>" +
      "<p><strong>Payment:</strong> " + paymentMethod + "</p>" +
      "<p><strong>Shipping Address:</strong> " + shippingAddress + "</p>" +
      "</div>";

    const results = {};

    if (customerEmail) {
      await sendEmail(
        apiKey,
        from,
        customerEmail,
        "Order Confirmed - " + orderNumber,
        customerHtml
      );
      results.customerEmail = "sent";
    } else {
      results.customerEmail = "skipped: no customer email";
    }

    await sendEmail(
      apiKey,
      from,
      adminEmail,
      "New Order - " + orderNumber,
      adminHtml
    );
    results.adminEmail = "sent";

    return new Response(JSON.stringify({
      success: true,
      results: results
    }), {
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), {
      status: 500,
      headers,
    });
  }
});
