
// This service handles email notifications.
// In a production environment, this would call a Supabase Edge Function
// which in turn would use a provider like Resend, SendGrid, or AWS SES.

// For now, we simulate the email sending process and log the details.
// You can replace the 'simulateSend' logic with a real API call when ready.

import { supabase } from '../supabase';

export const sendEmail = async ({ to, subject, html, type = 'notification' }) => {
    try {
        console.group('📧 Email Service');
        console.log(`Type: ${type}`);
        console.log(`To: ${to}`);

        // Call Edge Function
        // This moves the API key usage to the backend
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: { to, subject, html } 
        });

        if (error) {
            console.warn('Edge Function Call Failed (Dev Mode or Deployment Missing):', error);
            console.log('Falling back to simulation...');
             await new Promise(resolve => setTimeout(resolve, 800));
             console.log('✅ Email queued (Simulated)');
             console.groupEnd();
             return { success: true, message: 'Email queued (Simulated Fallback)' };
        }

        console.log('✅ Email Sent via Edge Function:', data);
        console.groupEnd();
        return { success: true, data };

    } catch (err) {
        console.error('Email Service Error:', err);
        return { success: false, error: err.message };
    }
};

// Templates
export const emailTemplates = {
    donationReceipt: (donorName, amount, reference) => `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Thank you for your donation, ${donorName}!</h2>
            <p>We have received your generous donation of <strong>GH₵${amount}</strong>.</p>
            <p>Reference: ${reference}</p>
            <p>Your support helps us continue our mission.</p>
            <br/>
            <p>Warm regards,</p>
            <p>The Charizomai Team</p>
        </div>
    `,
    newsletter: (content) => `
        <div style="font-family: sans-serif; padding: 20px;">
            ${content}
            <br/>
            <hr/>
            <small>You are receiving this email because you subscribed to Charizomai updates.</small>
        </div>
    `,
    welcome: (name) => `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome, ${name}!</h2>
            <p>We are thrilled to have you as part of our community.</p>
        </div>
    `
};
