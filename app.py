from flask import Flask, render_template, request, send_file
import qrcode
from io import BytesIO
from PIL import Image

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    qr_type = request.form.get("qr_type", "text")
    color = request.form.get("color") or "black"
    bg = request.form.get("bg") or "white"
    try:
        size = int(request.form.get("size") or 10)
    except ValueError:
        size = 10

    # Build payload based on type
    if qr_type == "text":
        data = request.form.get("text_data", "")
    elif qr_type == "url":
        data = request.form.get("url_data", "")
    elif qr_type == "wifi":
        ssid = request.form.get("ssid", "")
        pwd = request.form.get("password", "")
        sec = request.form.get("security", "WPA")
        data = f"WIFI:T:{sec};S:{ssid};P:{pwd};;"
    elif qr_type == "vcard":
        name = request.form.get("name", "")
        phone = request.form.get("phone", "")
        email = request.form.get("email", "")
        data = f"BEGIN:VCARD\nFN:{name}\nTEL:{phone}\nEMAIL:{email}\nEND:VCARD"
    elif qr_type == "email":
        to = request.form.get("email_to", "")
        sub = request.form.get("subject", "")
        msg = request.form.get("msg", "")
        data = f"mailto:{to}?subject={sub}&body={msg}"
    else:
        data = ""

    # Create QR
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=size,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color=color, back_color=bg).convert("RGBA")

    # Logo overlay (optional)
    logo_file = request.files.get("logo")
    if logo_file and logo_file.filename != "":
        try:
            logo = Image.open(logo_file.stream).convert("RGBA")
            # scale logo to ~20% of QR width
            qr_w, qr_h = img.size
            factor = 5
            max_logo_w = qr_w // factor
            logo.thumbnail((max_logo_w, max_logo_w), Image.ANTIALIAS)
            lx = (qr_w - logo.width) // 2
            ly = (qr_h - logo.height) // 2
            img.paste(logo, (lx, ly), logo)
        except Exception:
            pass  # silently ignore logo problems

    # Return PNG
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png", download_name="qr.png")

@app.route("/generate_svg", methods=["POST"])
def generate_svg():
    qr_type = request.form.get("qr_type", "text")
    # same data logic as PNG
    data = ... # same as previous QR payload logic
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(image_factory=qrcode.image.svg.SvgImage)
    buf = BytesIO()
    img.save(buf)
    buf.seek(0)
    return send_file(buf, mimetype="image/svg+xml", download_name="qr.svg")

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

   return send_file(...)
