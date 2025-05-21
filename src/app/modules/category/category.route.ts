import { Router } from 'express';
import { CategoryController } from './category.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.post('/create-category', fileUploadHandler(), CategoryController.createCategory);
router.get('/:id', CategoryController.getCategoryById);
router.patch('/:id', fileUploadHandler(), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export const CategoryRoutes = router;
