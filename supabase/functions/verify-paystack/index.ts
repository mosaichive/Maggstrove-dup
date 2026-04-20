import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, reference, email, amount, currency, metadata } = await req.json();
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    const publicKey = Deno.env.get("PAYSTACK_PUBLIC_KEY");

    if (!secretKey) {
      return new Response(JSON.stringify({ error: "Paystack not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return public key for frontend inline popup
    if (action === "get_config") {
      return new Response(JSON.stringify({ publicKey }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize a transaction
    if (action === "initialize") {
      const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to pesewas
          currency: currency || "GHS",
          channels: ["mobile_money", "card"],
          metadata: metadata || {},
        }),
      });
      const initData = await initRes.json();

      if (initData.status) {
        return new Response(JSON.stringify({
          access_code: initData.data.access_code,
          reference: initData.data.reference,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: initData.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify a transaction
    if (action === "verify") {
      if (!reference) {
        return new Response(JSON.stringify({ error: "Missing reference" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      const data = await verifyRes.json();

      if (data.status && data.data?.status === "success") {
        return new Response(JSON.stringify({
          verified: true,
          amount: data.data.amount / 100,
          currency: data.data.currency,
          reference: data.data.reference,
          channel: data.data.channel,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        verified: false,
        message: data.data?.gateway_response || "Verification failed",
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
