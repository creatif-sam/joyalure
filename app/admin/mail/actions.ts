"use server";

import { Resend } from 'resend';
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCampaignAction(campaignId: string, recipientGroup: string) {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  try {
    // 1. Fetch Campaign Data (Including the stored custom emails)
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (fetchError || !campaign) throw new Error("Campaign record not found.");

    // 2. Resolve Audience Logic
    let recipients: string[] = [];
    
    // Check if it's a custom group AND we have emails in the DB for this campaign
    if (recipientGroup === 'custom' || campaign.recipient_type === 'custom') {
      const emailSource = campaign.emails; // Use the DB column
      if (!emailSource) throw new Error("Custom recipient list is empty in database.");
      
      recipients = emailSource
        .split(',')
        .map((e: string) => e.trim())
        .filter((e: string) => e.includes('@'));
    } else {
      // Default to newsletter subscribers
      const { data: subs } = await supabase.from('newsletter_subscribers').select('email');
      recipients = subs?.map(s => s.email) || [];
    }

    if (recipients.length === 0) throw new Error("No valid recipients found for this broadcast.");

    // 3. Execute Resend Broadcast
    // Note: Resend Free Tier limit is usually 50 recipients per 'to' array
    const { data, error: resendError } = await resend.emails.send({
      from: 'Joyalure <editorial@gen116.com>', 
      to: recipients,
      subject: campaign.subject,
      html: campaign.body,
    });

    if (resendError) throw resendError;

    // 4. Update Database Lifecycle
    await supabase
      .from('campaigns')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', campaignId);

    return { success: true, message: `Successfully broadcasted to ${recipients.length} recipients.` };

  } catch (error: any) {
    console.error("Critical Action Error:", error);
    return { success: false, error: error.message };
  }
}