const axios = require('axios');
// const AppDataSource = require('../config/data-source');

function expireAt(addition) {
    const now = new Date();
    
    // konversi ke localtime (UTC+7)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localtime = new Date(utc + ((process.env.LOCALTIME || 8) * 60 * 60000));

    localtime.setMinutes(localtime.getMinutes() + addition);

    const pad = n => String(n).padStart(2, '0');

    return `${localtime.getFullYear()}-${pad(localtime.getMonth()+1)}-${pad(localtime.getDate())}T${pad(localtime.getHours())}:${pad(localtime.getMinutes())}:${pad(localtime.getSeconds())}Z`;
}

exports.createQR = async (req, res) => {
    // take id from selling and total_price from selling as cost
    const {id, cost } = req.body;

    const referenceId = `${id}_${Date.now()}_app`;

    const postData = {
        reference_id: referenceId,
        type: 'DYNAMIC',
        currency: 'IDR',
        amount: Number(cost),
        expires_at: expireAt(5)
    };

    console.log(postData);

    try {
        const apiKey = process.env.XENDIT_AUTHORIZATION;

        const response = await axios.post(
            'https://api.xendit.co/qr_codes',
            postData, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(apiKey).toString('base64'),
                    'api-version': '2022-07-31',
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(response.status).json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message
        });
    }
}