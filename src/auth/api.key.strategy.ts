import { AppConfig } from './../app.config';
import { ConfigType } from '@nestjs/config';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { ILogger } from './../logger';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(
    @Inject(AppConfig.KEY)
    private _config: ConfigType<typeof AppConfig>,
    private logger: ILogger
  ) {
    super({ header: 'x-api-key', prefix: '' }, true, (apikey: string, done: (result: boolean) => any) => {
      const isApiKey = _config.API_KEY === apikey;
      if (!isApiKey) this.logger.warn(`User tried to access forbidden [invalid apiKey] resource: [${apikey}]`);
      return done(isApiKey);
    });
  }
}
