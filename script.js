// script.js - simple UI switcher
function switchType() {
  const type = document.getElementById('qr_type').value;
  const boxes = ['text_box', 'url_box', 'wifi_box', 'vcard_box', 'email_box'];
  boxes.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
  });
  const show = document.getElementById(type + '_box');
  if (show) show.classList.remove('hidden');
}

// initialize correct box on page load
document.addEventListener('DOMContentLoaded', function() {
  switchType();
});

function switchType() {
const type = document.getElementById('qr_type').value;
const boxes = ['text_box', 'url_box', 'wifi_box', 'vcard_box', 'email_box'];
boxes.forEach(id => document.getElementById(id).classList.add('hidden'));
const show = document.getElementById(type + '_box');
if (show) show.classList.remove('hidden');
}


document.addEventListener('DOMContentLoaded', function() {
switchType();
const form = document.getElementById('qrForm');
const preview = document.getElementById('qrPreview');
const downloadArea = document.getElementById('downloadArea');
const downloadBtn = document.getElementById('downloadBtn');


form.addEventListener('submit', async function(e) {
e.preventDefault();


const formData = new FormData(form);
const response = await fetch('/generate', {
method: 'POST',
body: formData
});


if (response.ok) {
const blob = await response.blob();
const url = URL.createObjectURL(blob);


// Show preview
preview.src = url;
preview.classList.remove('hidden');
preview.classList.add('animate-pop');


// Show download button
downloadBtn.href = url;
downloadArea.classList.remove('hidden');
downloadArea.classList.add('animate-pop');
} else {
alert('Failed to generate QR code');
}
});
});
// After fetching PNG blob, also show SVG button
document.getElementById('downloadSvgBtn').classList.remove('hidden');
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(formData.get('text_data') || formData.get('url_data') || '');
    alert('Copied to clipboard!');
});
copyBtn.classList.remove('hidden');
['text_data', 'url_data'].forEach(id => {
    const input = document.querySelector(`[name="${id}"]`);
    input.addEventListener('input', () => form.requestSubmit());
});
// Detect selected type
let type = document.getElementById("qrType").value;
let qrData = "";

// EVENT QR
if (type === "event") {
    let title = document.getElementById("eventTitle").value;
    let start = document.getElementById("eventStart").value.replace(/[-:]/g,"");
    let end = document.getElementById("eventEnd").value.replace(/[-:]/g,"");
    let loc = document.getElementById("eventLocation").value;

    qrData =
      `BEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${start}\nDTEND:${end}\nLOCATION:${loc}\nEND:VEVENT`;

}

// LOCATION QR
else if (type === "location") {
    let lat = document.getElementById("latitude").value;
    let lon = document.getElementById("longitude").value;
    qrData = `https://maps.google.com/?q=${lat},${lon}`;
}

// PHONE CALL QR
else if (type === "phone") {
    let number = document.getElementById("phoneNumber").value;
    qrData = `tel:${number}`;
}

// SMS QR
else if (type === "sms") {
    let number = document.getElementById("smsNumber").value;
    let msg = document.getElementById("smsMessage").value;
    qrData = `SMSTO:${number}:${msg}`;
}
document.getElementById("qrType").addEventListener("change", function () {
    let type = this.value;

    document.querySelectorAll("#eventFields, #locationFields, #phoneFields, #smsFields").forEach(div => {
        div.classList.add("hidden");
    });

    if (type === "event") document.getElementById("eventFields").classList.remove("hidden");
    if (type === "location") document.getElementById("locationFields").classList.remove("hidden");
    if (type === "phone") document.getElementById("phoneFields").classList.remove("hidden");
    if (type === "sms") document.getElementById("smsFields").classList.remove("hidden");
});

