const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// POST /api/qrcode { text: "..." }
app.post('/api/qrcode', async (req, res) => {
  try {
    const { text, options } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'يرجى إرسال حقل text كنص.' });
    }

    // خيارات اختيارية
    const qroptions = {
      errorCorrectionLevel: (options && options.errorCorrectionLevel) || 'M',
      type: 'image/png',
      width: (options && options.width) || 300,
      margin: (options && options.margin) || 1,
    };

    const dataUrl = await QRCode.toDataURL(text, qroptions);
    // نرجع data URL مباشر
    res.json({ ok: true, dataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء توليد QR.' });
  }
});

app.listen(PORT, () => {
  console.log(`QR backend running on http://localhost:${PORT}`);
});
