import { Router } from 'express';
import { AuthService, IAuthCredentials } from '../../services';
import { Container } from 'typedi';

const authService = Container.get(AuthService);

const router = Router();

export default router.post('/signin', async (req, res) => {
    try {
        const token = await authService.authenticate(req.body as IAuthCredentials);
        res.send({ token });
    } catch(e) {
        res.status(401);
        res.json({error: e.toString()});
    }
});
