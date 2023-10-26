import { AppConfig } from './../app.config';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from './../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AppConfig.KEY)
    private _config: ConfigType<typeof AppConfig>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOne({
      where: { username: payload.username, isActive: true },
      relations: { auth: true },
    });

    if (user && !user.auth.forceLogout) return { id: payload.sub, username: payload.username };

    throw new UnauthorizedException('Invalid Authorization');
  }
}
