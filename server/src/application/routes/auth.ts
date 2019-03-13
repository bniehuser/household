import { Router } from 'express';
import { getTokenFromLogin, ILoginCredentials } from '../../services/jwt';

const router = Router();

export default router.post('/signin', async (req, res) => {
    const token = await getTokenFromLogin(req.body as ILoginCredentials);

    if (!token) {
        res.status(401);
    }

    res.send({ token });
});
