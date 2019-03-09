import { Router } from 'express';
import { getTokenFromLogin, ILoginCredentials } from '../util/jwt';

const router = Router();

router.post('/signin', async (req, res) => {
    const token = await getTokenFromLogin(req.body as ILoginCredentials);

    if (!token) {
        res.status(401);
    }

    res.send({ token });
});

module.exports = router;