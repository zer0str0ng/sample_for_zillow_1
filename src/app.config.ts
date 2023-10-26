import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const AppConfig = registerAs('AppConfig', () => ({
  API_KEY: process.env.API_KEY,
  APP_SECRET: process.env.APP_SECRET,
  AZURE_STORAGE_ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT,
  AZURE_STORAGE_CONTAINER: process.env.AZURE_STORAGE_CONTAINER,
  AZURE_STORAGE_SAS_KEY: process.env.AZURE_STORAGE_SAS_KEY,
  CURRENT_DATE_FOR_TESTING: process.env.CURRENT_DATE_FOR_TESTING || null,
  FUELING_MAX_KILOMETERS_DIFFERENCE_ALLOWED: parseInt(process.env.FUELING_MAX_KILOMETERS_DIFFERENCE_ALLOWED, 10),
  GOOGLE_MAPS_URL: process.env.GOOGLE_MAPS_URL || 'https://www.google.com/maps/@<%=coords%>,18z',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_SECRET: process.env.JWT_SECRET,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_URL: process.env.MYSQL_URL,
  MYSQL_USERNAME: process.env.MYSQL_USERNAME,
  NODE_ENV: process.env.NODE_ENV,
  UNIT_SERVICE_ALERT_CRON: process.env.UNIT_SERVICE_ALERT_CRON,
}));

export const AppConfigSchema = Joi.object({
  API_KEY: Joi.string().required(),
  APP_SECRET: Joi.string().required(),
  AZURE_STORAGE_ACCOUNT: Joi.string().required(),
  AZURE_STORAGE_CONTAINER: Joi.string().required(),
  AZURE_STORAGE_SAS_KEY: Joi.string().required(),
  FUELING_MAX_KILOMETERS_DIFFERENCE_ALLOWED: Joi.number().required(),
  GOOGLE_MAPS_URL: Joi.string().optional(),
  JWT_EXPIRATION: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_PORT: Joi.string().required(),
  MYSQL_URL: Joi.string().required(),
  MYSQL_USERNAME: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  UNIT_SERVICE_ALERT_CRON: Joi.string().required(),
});
