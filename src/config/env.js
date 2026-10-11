const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

// 로컬 외에 접속을 허용할 프런트엔드 주소 (쉼표로 여러 개 지정 가능)
const defaultAllowedOrigins = ['https://todo-firebase-weld.vercel.app'];

module.exports = {
  // Render 등 배포 환경은 PORT(대문자)를 지정합니다.
  port: process.env.PORT || process.env.port || 5000,
  mongoUri: process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI,
  localMongoUri: 'mongodb://127.0.0.1:27017/todo-backend',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : defaultAllowedOrigins,
};
