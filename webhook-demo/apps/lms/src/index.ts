import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.LMS_PORT || 3001;

app.use(cors());
app.use(express.json());

type Event = 'purchase' | 'lesson completed';

type Webhook = {
  id: string;
  url: string;
  token: string;
  event: Event;
};

type Payload = {
  id: string;
  name: string;
  email: string;
  course: string;
};

const db: Webhook[] = [];

app.get('/', (req, res) => {
  return res.json({ message: 'OK' });
});

app.post('/api/register-webhook', (req, res) => {
  const { url, token, event } = req.body;

  db.push({
    id: Date.now().toString(),
    url,
    token,
    event,
  });

  console.log('DB', db);

  return res.json({ message: 'OK' });
});

app.post('/api/purchase', (req, res) => {
  const { name, email, course } = req.body;
  // initial purchase processing

  // sending webhooks
  const payload: Payload = {
    id: Date.now().toString(),
    name,
    email,
    course,
  };

  const webhooks = db.filter((webhook) => webhook.event === 'purchase');

  // async
  sendWebhooks(webhooks, payload).then(() => {
    console.log('Webhooks sent.');
  });

  return res.json({ message: 'Course purchase succesful.' });
});

async function sendWebhooks(webhooks: Webhook[], payload: Payload) {
  for (const webhook of webhooks) {
    // todo: handle errors, implement retry mechanism
    await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Webhook-Token': webhook.token,
      },
      body: JSON.stringify(payload),
    });
  }
}

app.listen(PORT, () => {
  console.log(`LMS server is running on port ${PORT}`);
});
