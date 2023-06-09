const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('<p>Hello, Mavo!</p>');
});

app.post('/sms_callback', async (req, res) => {
  console.log(req.method);
  console.log(req.body);

  const fromNumber = req.body.from;
  const incomingMessage = req.body.text.trim().toLowerCase();

  let message;

  if (incomingMessage.includes('option1')) {
    message = 'You have chosen Option 1. Here is the information you requested.';
  } else if (incomingMessage.includes('option2')) {
    message = 'You have chosen Option 2. Here is the information you requested.';
  } else if (incomingMessage.includes('option3')) {
    message = 'You have chosen Option 3. Here is the information you requested.';
  } else {
    message = 'Please send a valid option. Available options: Option1, Option2, Option3';
  }

  const result = await sendMessage(fromNumber, message);
  console.log({result})
  res.status(201).send('Success');
});

const SANDBOX_API_KEY = '6472b4a2614c40222d035bd83f52c576376441eb2c2adf00fe90276b9ec9c709';

async function sendMessage(recipientPhoneNumber, message) {
  try {
    const response = await axios.post(
      'https://api.sandbox.africastalking.com/version1/messaging',
      {
        username: 'sandbox',
        to: recipientPhoneNumber,
        message: message,
        from: '48448',
      },
      {
        headers: {
          apiKey: SANDBOX_API_KEY,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Message sent successfully');
    console.log(response.data);
  } catch (error) {
    console.error(`Failed to send message. Status code: ${error.response.status}`);
    console.error(error.response.data);
  }
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
