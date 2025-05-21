import { Router } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { SubcategoryController } from './subcategory.controller';

const router = Router();

router.post('/create-subcategory', fileUploadHandler(), SubcategoryController.createSubcategory);
router.get('/', SubcategoryController.getAllSubcategories);
router.get('/subcategories-by-category/:id', SubcategoryController.getSubCategoriesByCategoryId);
router.get('/:id', SubcategoryController.getSubcategoryById);
router.patch('/:id', fileUploadHandler(), SubcategoryController.updateSubcategory);
router.delete('/:id', SubcategoryController.deleteSubcategory);

export const SubcategoryRoutes = router;
