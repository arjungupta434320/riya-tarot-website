export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { amount } = await request.json();
    
    const keyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Missing Razorpay keys" }), { status: 500 });
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      })
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
