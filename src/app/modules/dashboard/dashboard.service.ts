import { Post } from '../post/post.model';
import { User } from '../user/user.model';

const getDashboardStats = async () => {
      const totalPost = await Post.countDocuments({ status: 'active' });
      const totalUsers = await User.countDocuments({ status: 'active' });
      return {
            totalUsers,
            totalPost,
            totalRevenue: 0,
      };
};
const getMonthlyUsers = async (year: string) => {
      const defaultYear = new Date().getFullYear();
      const startDate = new Date(`${year || defaultYear}-01-01`);
      const endDate = new Date(`${year || defaultYear}-12-31`);

      console.log(startDate, endDate);

      const monthlyUsers = await User.aggregate([
            {
                  $match: {
                        status: 'active',
                        createdAt: {
                              $gte: startDate,
                              $lt: endDate,
                        },
                  },
            },
            {
                  $group: {
                        _id: { month: { $month: '$createdAt' } },
                        count: { $sum: 1 },
                  },
            },
      ]);

      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const formattedMonthlyUsers: { [key: string]: number } = monthNames.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
      }, {} as { [key: string]: number });
      monthlyUsers.forEach((item) => {
            const month = monthNames[item._id.month - 1];
            formattedMonthlyUsers[month] = item.count;
      });
      return formattedMonthlyUsers;
};

export const DashboardService = {
      getDashboardStats,
      getMonthlyUsers,
};
