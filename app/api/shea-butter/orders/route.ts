import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST create new order (public)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    });

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_whatsapp,
      notes,
      items,
      total_amount,
    } = body;

    // Validate required fields
    if (!customer_email || !customer_whatsapp || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert order into database
    const { data: order, error: orderError } = await supabase
      .from('shea_butter_orders')
      .insert({
        customer_name,
        customer_email,
        customer_whatsapp,
        notes,
        items,
        total_amount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insertion error:', orderError);
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    // Send email notification to business
    try {
      const itemsHTML = items
        .map(
          (item: any) => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px; text-align: left;">${item.product_name}</td>
              <td style="padding: 12px; text-align: center;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `
        )
        .join('');

      await resend.emails.send({
        from: 'JoyAlure Store <orders@joyalure.com>',
        to: 'contact@joyallure.com',
        subject: '🎉 New Shea Butter Order Received!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Order</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                            🎉 New Order Received!
                          </h1>
                          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">
                            Order ID: ${order.id}
                          </p>
                        </td>
                      </tr>

                      <!-- Customer Info -->
                      <tr>
                        <td style="padding: 40px;">
                          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                            Customer Information
                          </h2>
                          
                          <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                            <tr>
                              <td style="color: #6b7280; font-weight: 600; width: 150px;">Name:</td>
                              <td style="color: #1f2937;">${customer_name || 'Not provided'}</td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-weight: 600;">Email:</td>
                              <td style="color: #1f2937;">
                                <a href="mailto:${customer_email}" style="color: #10b981; text-decoration: none;">
                                  ${customer_email}
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-weight: 600;">WhatsApp:</td>
                              <td style="color: #1f2937;">
                                <a href="https://wa.me/${customer_whatsapp.replace(/[^0-9]/g, '')}" style="color: #10b981; text-decoration: none;">
                                  ${customer_whatsapp}
                                </a>
                              </td>
                            </tr>
                            ${notes ? `
                            <tr>
                              <td style="color: #6b7280; font-weight: 600; vertical-align: top;">Notes:</td>
                              <td style="color: #1f2937; background-color: #f9fafb; padding: 10px; border-radius: 8px;">
                                ${notes}
                              </td>
                            </tr>
                            ` : ''}
                          </table>

                          <!-- Order Items -->
                          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
                            Order Details
                          </h2>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                            <thead>
                              <tr style="background-color: #f9fafb;">
                                <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Product</th>
                                <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Qty</th>
                                <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Price</th>
                                <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemsHTML}
                            </tbody>
                            <tfoot>
                              <tr style="background-color: #ecfdf5;">
                                <td colspan="3" style="padding: 16px; text-align: right; font-weight: bold; color: #1f2937; font-size: 18px;">
                                  Total Amount:
                                </td>
                                <td style="padding: 16px; text-align: right; font-weight: bold; color: #10b981; font-size: 24px;">
                                  $${total_amount.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>

                          <!-- Action Buttons -->
                          <div style="text-align: center; margin-top: 30px;">
                            <a href="https://wa.me/${customer_whatsapp.replace(/[^0-9]/g, '')}" 
                               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; margin-right: 10px;">
                              📱 Contact on WhatsApp
                            </a>
                            <a href="mailto:${customer_email}" 
                               style="display: inline-block; background-color: #f3f4f6; color: #1f2937; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; border: 2px solid #e5e7eb;">
                              📧 Send Email
                            </a>
                          </div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                          <p style="color: #6b7280; margin: 0; font-size: 14px;">
                            Order placed on ${new Date().toLocaleString('en-US', { 
                              dateStyle: 'full', 
                              timeStyle: 'short' 
                            })}
                          </p>
                          <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
                            JoyAlure Shea Butter Store • Premium Natural Skincare
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET all orders (admin only)
export async function GET() {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: orders, error: ordersError } = await supabase
      .from('shea_butter_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      return NextResponse.json(
        { error: ordersError.message },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: stats } = await supabase
      .from('shea_butter_order_stats')
      .select('*')
      .single();

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from('shea_butter_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
