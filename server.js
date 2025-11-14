const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const piClient = {
    appId: process.env.PI_APP_ID,
    secretKey: process.env.PI_SECRET_KEY,

    completePayment: async (data) => {
        console.log("Simulating Pi Payment Completion call:", data);

        // هذا هو المكان الذي يجب أن يتم فيه اتصال API الحقيقي بـ Pi Network
        // يتم إرسال المفتاح السري والموافقة على الدفع هنا
        return { success: true, payment: { identifier: data.paymentId, status: 'completed' } };
    }
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// نقطة النهاية (Endpoint) لإنهاء الدفع: https://[your-vercel-domain]/api/complete-payment
app.post('/api/complete-payment', async (req, res) => {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
        return res.status(400).json({ success: false, message: 'Missing paymentId or txid' });
    }

    try {
        const response = await piClient.completePayment({
            paymentId: paymentId,
            txid: txid,
        });

        res.json({ success: true, message: 'Payment success simulated on Vercel backend!', response });

    } catch (error) {
        console.error('Error completing payment:', error.message);
        res.status(500).json({ success: false, message: 'Failed to complete payment.', error: error.message });
    }
});

// نقطة نهاية اختبارية
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running successfully on Vercel', environment: process.env.NODE_ENV || 'development' });
});


// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`Pi Backend Server running on port ${PORT}`);
});

// (مهم جداً لـ Vercel)
module.exports = app;
