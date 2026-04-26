import os
import resend
from typing import Optional
 
resend.api_key = os.getenv("RESEND_API_KEY", "")
 
RESORT_NAME = "Caribou Log Cabin Resort"
FROM_EMAIL = os.getenv("FROM_EMAIL", "cariboulogcabinresort@gmail.com")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "cariboulogcabinresort@gmail.com")
SITE_URL = os.getenv("FRONTEND_URL", "https://caribou-resort1.onrender.com")
 
 
def send_booking_confirmation(
    guest_name: str,
    guest_email: str,
    cabin_name: str,
    start_date: str,
    end_date: str,
    nights: int,
    total_price: float,
    booking_id: int,
    phone: str,
    notes: Optional[str] = None,
):
    if not resend.api_key:
        print("RESEND_API_KEY not set — skipping email")
        return
 
    notes_row = f"""
    <tr>
      <td style="padding:10px 0;color:#888;font-size:14px;border-bottom:1px solid #f0ece4;">Special Requests</td>
      <td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0ece4;text-align:right;">{notes}</td>
    </tr>
    """ if notes else ""
 
    guest_html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f2ed;font-family:'Georgia',serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ed;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
 
            <!-- Header -->
            <tr>
              <td style="background:#0f2035;padding:32px 40px;text-align:center;">
                <p style="margin:0 0 4px 0;color:#8aaece;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Desbarats, Ontario</p>
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:normal;letter-spacing:1px;">Caribou Log Cabin Resort</h1>
              </td>
            </tr>
 
            <!-- Confirmation badge -->
            <tr>
              <td style="background:#163c5e;padding:16px 40px;text-align:center;">
                <p style="margin:0;color:#ffffff;font-size:14px;letter-spacing:1px;">
                  ✓ &nbsp; Your booking is confirmed
                </p>
              </td>
            </tr>
 
            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 24px;">
                <p style="margin:0 0 8px;color:#0f2035;font-size:22px;">Hi {guest_name},</p>
                <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.7;">
                  We look forward to welcoming you to {cabin_name}. Your stay is confirmed and full payment has been processed.
                </p>
 
                <!-- Booking details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0d4;margin-bottom:24px;">
                  <tr>
                    <td style="background:#faf8f4;padding:14px 20px;">
                      <p style="margin:0;color:#0f2035;font-size:16px;font-weight:bold;">{cabin_name}</p>
                      <p style="margin:4px 0 0;color:#888;font-size:13px;">Caribou Log Cabin Resort · Desbarats, Ontario</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:10px 0;color:#888;font-size:14px;border-bottom:1px solid #f0ece4;">Check-in</td>
                          <td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0ece4;text-align:right;color:#0f2035;">{start_date} &nbsp;·&nbsp; 3:00 PM</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;color:#888;font-size:14px;border-bottom:1px solid #f0ece4;">Check-out</td>
                          <td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0ece4;text-align:right;color:#0f2035;">{end_date} &nbsp;·&nbsp; 11:00 AM</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;color:#888;font-size:14px;border-bottom:1px solid #f0ece4;">Duration</td>
                          <td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0ece4;text-align:right;color:#0f2035;">{nights} night{"s" if nights > 1 else ""}</td>
                        </tr>
                        {notes_row}
                        <tr>
                          <td style="padding:14px 0 10px;color:#0f2035;font-size:15px;font-weight:bold;">Total Paid</td>
                          <td style="padding:14px 0 10px;font-size:15px;font-weight:bold;text-align:right;color:#0f2035;">${total_price:.2f} CAD</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
 
                <!-- Info box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;border-left:3px solid #163c5e;margin-bottom:24px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 6px;color:#0f2035;font-size:14px;font-weight:bold;">Good to know</p>
                      <p style="margin:0;color:#666;font-size:13px;line-height:1.7;">
                        Check-in is at 3:00 PM and check-out is at 11:00 AM.<br>
                        Firewood is available on site for $10 per crate and propane for $30 per tank.<br>
                        Dogs are welcome — please keep them on a leash in common areas.
                      </p>
                    </td>
                  </tr>
                </table>
 
                <!-- Contact -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f2035;margin-bottom:8px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="margin:0 0 4px;color:#8aaece;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Questions?</p>
                      <p style="margin:0;color:#ffffff;font-size:14px;">
                        Call us at <strong>(705) 257-5434</strong> or email <strong>cariboulogcabinresort@gmail.com</strong>
                      </p>
                    </td>
                  </tr>
                </table>
 
                <p style="color:#666;font-size:14px;line-height:1.7;margin-top:24px;">
                  We look forward to seeing you soon.<br>
                  <strong style="color:#0f2035;">The Caribou Log Cabin Team</strong>
                </p>
              </td>
            </tr>
 
            <!-- Footer -->
            <tr>
              <td style="background:#f5f2ed;padding:20px 40px;text-align:center;border-top:1px solid #e8e0d4;">
                <p style="margin:0;color:#aaa;font-size:12px;">
                  239 Carter Side Rd, Desbarats, Ontario &nbsp;·&nbsp; (705) 257-5434<br>
                  cariboulogcabinresort@gmail.com
                </p>
              </td>
            </tr>
 
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """
 
    admin_html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;padding:20px;background:#f5f5f5;">
      <div style="max-width:500px;background:white;padding:24px;border:1px solid #ddd;">
        <h2 style="margin:0 0 16px;color:#0f2035;">New Booking</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Guest</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{guest_name}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Email</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{guest_email}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Phone</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Cabin</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{cabin_name}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Check-in</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{start_date}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Check-out</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{end_date}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;border-bottom:1px solid #f0f0f0;">Nights</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0f0f0;text-align:right;">{nights}</td></tr>
          <tr><td style="padding:10px 0;color:#0f2035;font-weight:bold;font-size:14px;">Total</td><td style="padding:10px 0;font-weight:bold;font-size:14px;text-align:right;">${total_price:.2f} CAD</td></tr>
          {"<tr><td style='padding:8px 0;color:#666;font-size:14px;'>Notes</td><td style='padding:8px 0;font-size:14px;text-align:right;'>" + notes + "</td></tr>" if notes else ""}
        </table>
      </div>
    </body>
    </html>
    """
 
    try:
        resend.Emails.send({
            "from": f"{RESORT_NAME} <{FROM_EMAIL}>",
            "to": [guest_email],
            "subject": f"Booking Confirmed — {cabin_name} | Caribou Log Cabin Resort",
            "html": guest_html,
        })
 
        resend.Emails.send({
            "from": f"{RESORT_NAME} <{FROM_EMAIL}>",
            "to": [ADMIN_EMAIL],
            "subject": f"New Booking — {guest_name} — {cabin_name}",
            "html": admin_html,
        })
 
        print(f"✓ Confirmation emails sent for booking #{booking_id}")
    except Exception as e:
        print(f"  Email send failed: {e}")