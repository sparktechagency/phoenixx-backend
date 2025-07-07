import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { FAQRoutes } from '../app/modules/faqs/faq.route';
import { PrivacyPolicyRoutes } from '../app/modules/privacy-policy/pp.route';
import { TermsAndConditionsRoutes } from '../app/modules/terms-and-conditions/tc.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { SubcategoryRoutes } from '../app/modules/subcategory/subcategory.route';
import { AboutUsRoutes } from '../app/modules/about-us/about-us.route';
import { PostRoutes } from '../app/modules/post/post.route';
import { CommentRoutes } from '../app/modules/comments/comment.route';
import { FeedbackRoutes } from '../app/modules/feedback/feedback.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { ReportRoutes } from '../app/modules/report/report.route';
import { SavePostRoutes } from '../app/modules/save-post/save-post.route';
import { FaqCategoryRoutes } from '../app/modules/faqCategory/faqCategory.route';
import { AnnouncementSliderRouter } from '../app/modules/announcementSlider/announcementSlider.route';
import { NotificationRouter } from '../app/modules/notification/notification.route';
import { ContactUsRoutes } from '../app/modules/contact-us/contact-us.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { SubscriptionRoute } from '../app/modules/subscription/subscription.route';
import { WebsiteLogoRoutes } from '../app/modules/websiteLogo/websiteLogo.route';

const router = express.Router();

const apiRoutes = [
      {
            path: '/users',
            route: UserRoutes,
      },
      {
            path: '/auth',
            route: AuthRoutes,
      },
      {
            path: '/categories',
            route: CategoryRoutes,
      },
      {
            path: '/subcategories',
            route: SubcategoryRoutes,
      },

      {
            path: '/posts',
            route: PostRoutes,
      },
      {
            path: '/comments',
            route: CommentRoutes,
      },
      {
            path: '/reports',
            route: ReportRoutes,
      },
      {
            path: '/save-post',
            route: SavePostRoutes,
      },
      {
            path: '/packages',
            route: PackageRoutes,
      },
      {
            path: '/subscriptions',
            route: SubscriptionRoute,
      },
      {
            path: '/chats',
            route: ChatRoutes,
      },
      {
            path: '/messages',
            route: MessageRoutes,
      },
      {
            path: '/feedbacks',
            route: FeedbackRoutes,
      },
      {
            path: '/faq-categories',
            route: FaqCategoryRoutes,
      },
      {
            path: '/faqs',
            route: FAQRoutes,
      },

      {
            path: '/announcement-slider',
            route: AnnouncementSliderRouter,
      },

      {
            path: '/contact-us',
            route: ContactUsRoutes,
      },

      {
            path: '/about-us',
            route: AboutUsRoutes,
      },

      {
            path: '/privacy-policy',
            route: PrivacyPolicyRoutes,
      },
      {
            path: '/terms-and-conditions',
            route: TermsAndConditionsRoutes,
      },
      {
            path: '/notifications',
            route: NotificationRouter,
      },

      {
            path: '/dashboard',
            route: DashboardRoutes,
      },

      {
            path: '/website-logo',
            route: WebsiteLogoRoutes,
      },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
