import os
import resend
from typing import Optional

resend.api_key = os.getenv("RESEND_API_KEY", "")

RESORT_NAME = "Caribou Log Cabin Resort"
FROM_EMAIL = os.getenv("FROM_EMAIL", "reservations@cariboulogcabin.ca")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@cariboulogcabin.ca")


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
    """Send confirmation email to guest and notification to admin."""
    if not resend.api_key:
        print("RESEND_API_KEY not set — skipping email")
        return

    notes_html = f"<p><strong>Special Requests:</strong> {notes}</p>" if notes else ""

    guest_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: Georgia, serif; background: #fdf8f0; margin: 0; padding: 0; }}
        .wrapper {{ max-width: 600px; margin: 0 auto; background: white; }}
        .header {{ background: #7c3c18; color: white; padding: 32px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 26px; letter-spacing: 1px; }}
        .header p {{ margin: 8px 0 0; color: #f4dba8; font-size: 14px; }}
        .body {{ padding: 32px; }}
        .greeting {{ font-size: 18px; color: #3a2e1e; margin-bottom: 16px; }}
        .details-box {{ background: #fdf8f0; border: 1px solid #ecc06d; border-radius: 8px; padding: 20px; margin: 20px 0; }}
        .detail-row {{ display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f4dba8; font-size: 14px; color: #5a3d28; }}
        .detail-row:last-child {{ border-bottom: none; font-weight: bold; font-size: 15px; color: #7c3c18; }}
        .info-block {{ background: #f0f7f0; border-left: 4px solid #2d8c2d; padding: 14px 18px; border-radius: 4px; margin: 20px 0; font-size: 14px; color: #1f7020; }}
        .footer {{ background: #4c3425; color: #c1a67f; text-align: center; padding: 20px; font-size: 12px; }}
        .footer a {{ color: #ecc06d; }}
        .badge {{ display: inline-block; background: #ecc06d; color: #5a3d28; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px; }}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="badge"> Booking Confirmed</div>
          <h1>{RESORT_NAME}</h1>
          <p>Desbarats Ontario, Canada</p>
        </div>
        <div class="body">
          <p class="greeting">Dear {guest_name},</p>
          <p style="color:#5a3d28;line-height:1.6;">
            Your reservation has been confirmed and we're excited to welcome you to the Caribou Log Cabin Resort! 
            Please keep this email for your records.
          </p>
          <div class="details-box">
            <div class="detail-row"><span>Booking ID</span><span>#{booking_id}</span></div>
            <div class="detail-row"><span>Cabin</span><span>{cabin_name}</span></div>
            <div class="detail-row"><span>Check-in</span><span>{start_date} at 3:00 PM</span></div>
            <div class="detail-row"><span>Check-out</span><span>{end_date} at 11:00 AM</span></div>
            <div class="detail-row"><span>Duration</span><span>{nights} nights</span></div>
            <div class="detail-row"><span>Total Paid</span><span>${total_price:.2f} CAD</span></div>
          </div>
          {notes_html}
          <div class="info-block">
            A 50% deposit has been charged to your card.<br>
            The remaining balance will be collected on arrival.
          </div>
          <div class="info-block" style="background:#fff8e8;border-color:#ecc06d;color:#7c3c18;">
            <br>
            Questions? Call us at (705) 257-5434
          </div>
          <p style="color:#5a3d28;font-size:14px;line-height:1.6;margin-top:24px;">
            Pack layers, bring bug spray in summer, and prepare for the best stargazing of your life.
          </p>
          <p style="color:#5a3d28;font-size:14px;">Warm regards,<br><strong>The Caribou Log Cabin Team</strong></p>
        </div>
        <div class="footer">
          <p>© {RESORT_NAME} · Desbarats Ontario, Canada</p>
          <p>info@cariboulogcabin.ca ·  (705)257-5434</p>
        </div>
      </div>
    </body>
    </html>
    """

    admin_html = f"""
    <h2>New Booking — #{booking_id}</h2>
    <table>
      <tr><td><b>Guest</b></td><td>{guest_name}</td></tr>
      <tr><td><b>Email</b></td><td>{guest_email}</td></tr>
      <tr><td><b>Phone</b></td><td>{phone}</td></tr>
      <tr><td><b>Cabin</b></td><td>{cabin_name}</td></tr>
      <tr><td><b>Check-in</b></td><td>{start_date}</td></tr>
      <tr><td><b>Check-out</b></td><td>{end_date}</td></tr>
      <tr><td><b>Nights</b></td><td>{nights}</td></tr>
      <tr><td><b>Total</b></td><td>${total_price:.2f}</td></tr>
      {"<tr><td><b>Notes</b></td><td>" + notes + "</td></tr>" if notes else ""}
    </table>
    """

    try:
        # Guest email
        resend.Emails.send({
            "from": f"{RESORT_NAME} <{FROM_EMAIL}>",
            "to": [guest_email],
            "subject": f" Booking Confirmed — {cabin_name} | {RESORT_NAME}",
            "html": guest_html,
        })

        # Admin notification
        resend.Emails.send({
            "from": f"{RESORT_NAME} <{FROM_EMAIL}>",
            "to": [ADMIN_EMAIL],
            "subject": f"New Booking #{booking_id} — {guest_name} — {cabin_name}",
            "html": admin_html,
        })

        print(f"✓ Confirmation emails sent for booking #{booking_id}")
    except Exception as e:
        print(f"  Email send failed: {e}")
