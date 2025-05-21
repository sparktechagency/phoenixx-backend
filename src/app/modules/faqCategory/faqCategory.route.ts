import { Router } from 'express';
import { FaqCategoryController } from './faqCategory.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post('/create', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqCategoryController.createFaqCategory);
router.get('/', FaqCategoryController.getAllFaqCategories);
router.get('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqCategoryController.getFaqCategoryById);
router.patch('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqCategoryController.updateFaqCategory);
router.delete('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqCategoryController.deleteFaqCategory);

export const FaqCategoryRoutes = router;
