// src/App.jsx
import { useState } from "react";
import axios from "axios";
import "./index.css"; // تأكد إنك تستورد ملف الستايل

export default function App() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!text.trim()) return alert("اكتب نص أو رابطٍ أولا");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/qrcode", { text });
      setQr(res.data.dataUrl);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إنشاء QR");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <h1 className="title">مولد QR Code</h1>
          <p className="subtitle">حوّل أي نص أو رابط إلى QR بسرعة وسهولة</p>
        </header>

        <main className="card">
          <label className="field">
            <textarea
              className="input"
              rows={4}
              placeholder="اكتب النص أو الرابط هنا..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir="rtl"
            />
          </label>

          <div className="actions">
            <button className="btn primary" onClick={generateQR} disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء QR"}
            </button>

            <button
              className="btn outline"
              onClick={() => { setText(""); setQr(null); }}
            >
              مسح
            </button>

            {qr && (
              <button className="btn ghost" onClick={downloadQR}>
                تحميل PNG
              </button>
            )}
          </div>

          {qr && (
            <div className="preview">
              <div className="preview-card">
                <img src={qr} alt="QR" className="qr-img" />
                <a href={qr} target="_blank" rel="noreferrer" className="link">
                  فتح في تبويب جديد
                </a>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <small>صَنَعت بكل ❤ — React + Vite + Express</small>
        </footer>
      </div>
      <div className="bg-decor"></div>
    </div>
  );
}
