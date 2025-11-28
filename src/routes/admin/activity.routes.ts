import { Router } from 'express';
import ActivityLogger from '../../utils/activityLogger';
import Logger from '../../utils/logger';

const router = Router();

// Get all activities với pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, category, status } = req.query;

    let activities;
    if (category) {
      activities = await ActivityLogger.getActivitiesByCategory(
        category as string,
        Number(limit)
      );
    } else {
      activities = await ActivityLogger.getFailedActivities();
    }

    res.json({
      success: true,
      data: activities,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error: any) {
    Logger.error(`Get activities failed: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user activity history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;

    const activities = await ActivityLogger.getUserActivityHistory(
      userId,
      Number(limit)
    );

    res.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    Logger.error(`Get user activities failed: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get failed activities
router.get('/failed', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const activities = await ActivityLogger.getFailedActivities(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error: any) {
    Logger.error(`Get failed activities failed: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get activities by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 100 } = req.query;

    const activities = await ActivityLogger.getActivitiesByCategory(
      category,
      Number(limit)
    );

    res.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    Logger.error(`Get activities by category failed: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;