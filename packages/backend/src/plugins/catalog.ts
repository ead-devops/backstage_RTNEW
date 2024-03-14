import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

import { ProductEntitiesProcessor } from "@internal/backstage-plugin-custom-entity-backend";
import { ConfluenceUpdateProcess } from "@internal/backstage-plugin-confluence-calalog-backend";


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addProcessor(new ProductEntitiesProcessor());
  builder.addProcessor(new ConfluenceUpdateProcess(env.config));

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
