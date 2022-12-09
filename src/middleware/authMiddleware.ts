import { UnauthorizedError } from '../exeptions/exeptions';
import jwt from 'jsonwebtoken';

export default function JWTverify(req, res, done) {
  console.log(req);

  if (req.method === 'OPTIONS') {
    done(new Error('Missing user in request body'));
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return done(new UnauthorizedError());
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    done();
  } catch (e) {
    console.log(e);

    return done(new Error(e));
  }
}
