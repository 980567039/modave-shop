import connectDB from "@/lib/db";
import UserActivity from "@/models/UserActivity";

const logActivityMiddleware = (activityType) => (handler) => async (req, res) => {
  await connectDB();

  const { userId } = req.body; // Assuming userId is in the request body
  const activity = {
    userId: userId || 'unknown',
    activityType,
    activityDetails: `Performed ${req.method} on ${req.url}`,
    endpoint: req.url,
    method: req.method,
    requestData: req.body,
  };

  await UserActivity.create(activity);

  return handler(req, res);
};

export default logActivityMiddleware;
