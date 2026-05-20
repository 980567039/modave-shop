// 记录用户活动日志
import logActivityMiddleware from "@/app/middleware/logActivityMiddleware";

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      res.status(201).json({ success: true, message: 'Activity logged' });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default logActivityMiddleware('CREATE')(handler);