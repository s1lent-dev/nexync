import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';


const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE  || '1d';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || 'http://localhost:3000/auth/google/callback'; 
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_REDIRECT_URL = process.env.GITHUB_REDIRECT_URL || 'http://localhost:3000/auth/github/callback';
const OAUTH_SESSION_SECRET = process.env.OAUTH_SESSION_SECRET || 'secret';


const POSTGRES_URI = process.env.POSTGRES_URI || 'postgres://postgres:password@localhost:5432/db';


const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';


const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'kafka';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'test';
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || 'test-group';
const KAFKA_PARTITION = process.env.KAFKA_PARTITIONS || 0;


const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';


const MAIL_SERVICE = process.env.MAIL_SERVICE || 'gmail';
const MAIL_HOST = process.env.MAIL_HOST || 'smtp.gmail.com';
const MAIL_PORT = process.env.MAIL_PORT || 465;
const MAIL_USER = process.env.MAIL_USER || '';
const MAIL_PASS = process.env.MAIL_PASS || '';
const MAIL_FROM = process.env.MAIL_FROM || 'no-reply@localhost';


const HTTP_STATUS_OK = process.env.HTTP_STATUS_OK || 200;
const HTTP_STATUS_CREATED = process.env.HTTP_STATUS_CREATED || 201;
const HTTP_STATUS_ACCEPTED = process.env.HTTP_STATUS_ACCEPTED || 202;
const HTTP_STATUS_NO_CONTENT = process.env.HTTP_STATUS_NO_CONTENT || 204;

const HTTP_STATUS_BAD_REQUEST = process.env.HTTP_STATUS_BAD_REQUEST || 400;
const HTTP_STATUS_UNAUTHORIZED = process.env.HTTP_STATUS_UNAUTHORIZED || 401;
const HTTP_STATUS_FORBIDDEN = process.env.HTTP_STATUS_FORBIDDEN || 403;
const HTTP_STATUS_NOT_FOUND = process.env.HTTP_STATUS_NOT_FOUND || 404;
const HTTP_STATUS_METHOD_NOT_ALLOWED = process.env.HTTP_STATUS_METHOD_NOT_ALLOWED || 405;
const HTTP_STATUS_CONFLICT = process.env.HTTP_STATUS_CONFLICT || 409;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = process.env.HTTP_STATUS_UNPROCESSABLE_ENTITY || 422;
const HTTP_STATUS_TOO_MANY_REQUESTS = process.env.HTTP_STATUS_TOO_MANY_REQUESTS || 429;

const HTTP_STATUS_INTERNAL_SERVER_ERROR = process.env.HTTP_STATUS_INTERNAL_SERVER_ERROR || 500;
const HTTP_STATUS_NOT_IMPLEMENTED = process.env.HTTP_STATUS_NOT_IMPLEMENTED || 501;
const HTTP_STATUS_BAD_GATEWAY = process.env.HTTP_STATUS_BAD_GATEWAY || 502;
const HTTP_STATUS_SERVICE_UNAVAILABLE = process.env.HTTP_STATUS_SERVICE_UNAVAILABLE || 503;
const HTTP_STATUS_GATEWAY_TIMEOUT = process.env.HTTP_STATUS_GATEWAY_TIMEOUT || 504;


export {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URL,
  OAUTH_SESSION_SECRET,
  POSTGRES_URI,
  REDIS_PORT,
  REDIS_HOST,
  KAFKA_CLIENT_ID,
  KAFKA_BROKER,
  KAFKA_TOPIC,
  KAFKA_GROUP_ID,
  KAFKA_PARTITION,
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_USER,
  RABBITMQ_PASS,
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_ACCEPTED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
  HTTP_STATUS_TOO_MANY_REQUESTS,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_IMPLEMENTED,
  HTTP_STATUS_BAD_GATEWAY,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
  HTTP_STATUS_GATEWAY_TIMEOUT
};
