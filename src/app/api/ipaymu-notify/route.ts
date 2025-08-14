// File: src/app/api/ipaymu-notify/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await request.json();
    const { reference_id, status } = body;

    if (!reference_id || !status) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    if (status === 'berhasil') {
      const supabase = createClient();

      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'success' })
        .eq('reference_id', reference_id)
        .select('*, profiles(email)') // Ambil juga email pengguna
        .single();

      if (updateError || !order) {
        console.error('Failed to update order status:', updateError);
        return NextResponse.json({ success: false, message: 'Order not found or failed to update' }, { status: 404 });
      }

      // Kosongkan keranjang pengguna
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', order.user_id);

      if (deleteError) {
        console.error('Failed to clear cart:', deleteError);
      }

      // LANGKAH BARU: Kirim email konfirmasi
      try {
        await resend.emails.send({
          from: 'Zayro Store <onboarding@resend.dev>',
          // @ts-expect-error
          to: order.profiles.email,
          subject: `Konfirmasi Pesanan #${order.reference_id}`,
          react: OrderConfirmationEmail({
            referenceId: order.reference_id,
            totalPrice: order.total_price,
            // @ts-expect-error
            orderItems: order.order_items,
          }),
        });
        console.log("Confirmation email sent successfully.");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
