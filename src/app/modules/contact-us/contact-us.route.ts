import { Router } from 'express';
import { ContactUsController } from './contact-us.controller';

const router = Router();

router.post('/create-contact-us', ContactUsController.createContactUs);
router.get('/', ContactUsController.getContactUs);

export const ContactUsRoutes = router;
