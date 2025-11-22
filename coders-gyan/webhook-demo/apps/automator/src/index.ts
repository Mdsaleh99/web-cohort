import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

type Payload = {
  id: string;
  name: string;
  email: string;
  course: string;
};

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '',
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.use(express.json());
const secret = 'somesecret';

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

app.post('/webhook', (req, res) => {
  // console.log('headers', req.headers);
  // todo: move this secret to .env, don't do this in production.
  if (req.headers['x-webhook-token'] !== secret) {
    return res.status(401).json({ message: 'token mismatch.' });
  }

  const { id, name, email, course } = req.body;
  // create discord invite
  // send email to the student

  console.log(`Invite sent to ${name} on ${email} for course ${course}`);

  return res.json({ message: 'OK' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
