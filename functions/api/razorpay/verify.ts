export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    
    const keySecret = env.RAZORPAY_KEY_SECRET;
    
    // Generate signature using Web Crypto API (Cloudflare Workers supported)
    const encoder = new TextEncoder();
    const data = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (generatedSignature === razorpay_signature) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: "Invalid signature" }), { status: 400 });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
