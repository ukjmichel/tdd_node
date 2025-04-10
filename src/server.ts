import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
