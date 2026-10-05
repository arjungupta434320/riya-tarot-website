import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, orderId, amount, items, status } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY set. Skipping email receipt.");
      return NextResponse.json({ success: true, message: "Skipped (No API Key)" });
    }

    const formattedAmount = Number(amount).toLocaleString('en-IN');
    const paymentMethodText = status === 'pending_cod' ? "Cash on Delivery" : "Online Payment (Razorpay)";

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-w-xl; margin: 0 auto; color: #4f4136; background-color: #faf9f6; padding: 40px; border: 1px solid #eaddd3;">
        <h1 style="text-align: center; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 30px; font-size: 24px;">RIYA TAROT CRYSTALS</h1>
        
        <p style="font-family: 'Arial', sans-serif; font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
        <p style="font-family: 'Arial', sans-serif; font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
          Thank you for your purchase! We have successfully received your order and are preparing your crystals with care and intention.
        </p>
        
        <div style="background-color: white; padding: 20px; border: 1px solid #eaddd3; margin-bottom: 30px;">
          <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eaddd3; padding-bottom: 10px;">Order Summary</h2>
          
          <div style="font-family: 'Arial', sans-serif; font-size: 14px;">
            <p><strong>Order Number:</strong> #${orderId.split('-')[0]}</p>
            <p><strong>Payment Method:</strong> ${paymentMethodText}</p>
            <p><strong>Total Amount:</strong> ₹${formattedAmount}</p>
          </div>
          
          <div style="margin-top: 20px; font-family: 'Arial', sans-serif; font-size: 14px;">
            <strong style="display: block; margin-bottom: 10px;">Items Ordered:</strong>
            <ul style="list-style-type: none; padding-left: 0;">
              ${items.map((item: any) => `
                <li style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed #eaddd3;">
                  ${item.quantity}x ${item.name} 
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <p style="font-family: 'Arial', sans-serif; font-size: 14px; text-align: center; margin-bottom: 30px;">
          You can track your order status at any time on our website using your email address.
        </p>

        <div style="text-align: center;">
          <a href="https://riyatarot.vercel.app/track" style="display: inline-block; background-color: #4f4136; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
            Track Your Order
          </a>
        </div>
        
        <p style="text-align: center; margin-top: 40px; font-size: 12px; font-family: 'Arial', sans-serif; color: #8e8071;">
          With love and light,<br>
          <strong>Riya Tarot Crystals</strong>
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Riya Tarot Crystals <orders@riyatarot.com>', // User will need to verify their domain on Resend
      to: email,
      subject: `Your Order Confirmation #${orderId.split('-')[0]} - Riya Tarot Crystals`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
