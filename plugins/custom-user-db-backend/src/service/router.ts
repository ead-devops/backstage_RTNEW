import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { applyDatabaseMigrations } from '../database/migrations';
import { getUsers, insertuser, UserEntityData } from './user-data-helper';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {

  const { logger, database } = options;
  const dbClient = await database.getClient();

  await applyDatabaseMigrations(dbClient);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/hello', (_, response) => {
    logger.info('Get hello request!');
    response.send({ status: 'hello' });
  });

  router.get('/', async (_, response) => {
    const items = await getUsers(dbClient);
    response.send(items);
  });

  router.post('/', async (request, response) => {
    const data = request.body as UserEntityData;
    await insertuser(dbClient, data);

    response.send({ result: 'success' });
  });

  router.use(errorHandler());
  return router;
}
