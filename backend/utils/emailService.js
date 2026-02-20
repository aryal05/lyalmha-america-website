import nodemailer from 'nodemailer'

// Create transporter - configure with your email service
// For production, use environment variables for credentials
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not configured. Emails will be logged to console.')
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail
    }
  })
}

// Send membership confirmation email
export const sendMembershipConfirmationEmail = async (memberData) => {
  const { email, first_name, last_name, membership_token, membership_type, membership_fee } = memberData

  const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0a3161 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .token-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; }
    .token { font-size: 24px; font-weight: bold; color: #0a3161; letter-spacing: 2px; }
    .payment-info { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #ddd; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .highlight { color: #c4161c; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 Welcome to Lyaymha America Guthi!</h1>
      <p style="margin: 10px 0 0 0;">Life Membership Registration Confirmation</p>
    </div>
    <div class="content">
      <h2>Dear ${first_name} ${last_name},</h2>
      <p>Thank you for registering for <strong>Life Membership</strong> with Lyaymha America Guthi (LAG)!</p>
      
      <div class="token-box">
        <p style="margin: 0 0 10px 0; color: #666;">Your Membership Token:</p>
        <div class="token">${membership_token}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Please save this token for your records</p>
      </div>

      <div class="payment-info">
        <h3 style="margin-top: 0; color: #0a3161;">📱 Payment Information</h3>
        <p><strong>Membership Type:</strong> ${membership_type === 'family' ? 'Family' : 'Individual'}</p>
        <p><strong>Membership Fee:</strong> <span class="highlight">$${membership_fee}</span></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
        <p><strong>Payment Method:</strong> Zelle</p>
        <p><strong>Zelle Email ID:</strong> <span class="highlight">lyaymhaAmerica@gmail.com</span></p>
        <p style="font-size: 12px; color: #666;">Please include your membership token (${membership_token}) in the payment memo.</p>
      </div>

      <p>We are thrilled to have you as part of our community dedicated to preserving and promoting newari culture and heritage in America.</p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>With warm regards,<br>
      <strong>Lyaymha America Guthi (LAG) Team</strong></p>
    </div>
    <div class="footer">
      <p>Lyaymha America Guthi | Preserving newari Culture & Heritage</p>
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
`

  const transporter = createTransporter()

  if (!transporter) {
    // Log email to console if not configured
    console.log('📧 ═══════════════════════════════════════════════════')
    console.log('📧 MEMBERSHIP CONFIRMATION EMAIL (Not Sent - No Config)')
    console.log('📧 To:', email)
    console.log('📧 Subject: Welcome to Lyaymha America Guthi - Life Membership Confirmation')
    console.log('📧 Token:', membership_token)
    console.log('📧 Membership Type:', membership_type)
    console.log('📧 Fee: $' + membership_fee)
    console.log('📧 ═══════════════════════════════════════════════════')
    return { success: true, simulated: true }
  }

  try {
    const mailOptions = {
      from: `"Lyaymha America Guthi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Lyaymha America Guthi - Life Membership Confirmation',
      html: emailContent
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Membership confirmation email sent to:', email, 'MessageId:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('📧 Error sending membership email:', error)
    return { success: false, error: error.message }
  }
}

export default { sendMembershipConfirmationEmail }
