import { comparePasswords } from './../../utils';
import { JwtTokenPayload, UserAuthInterface } from './../../shared';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserAuthEntity, UserEntity } from './../../entities';
import { UserLoginDTO } from './../../dtos';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private userAuthRepo: Repository<UserAuthEntity>,
    private logger: ILogger,
    private jwtService: JwtService
  ) {}

  // This is a public endpoint, it is the only one that does not needs guards
  async authenticate(authInfo: UserLoginDTO): Promise<UserAuthInterface> {
    this.logger.debug('Starting authentication process...');

    const user = await this.userRepo.findOne({
      where: { username: authInfo.username, isActive: true },
      relations: { auth: true },
    });

    const result = user && comparePasswords(authInfo.password, user.auth?.password);

    if (result) {
      const tokenPayload: Partial<JwtTokenPayload> = {
        username: user.username,
        sub: user.id,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(tokenPayload);

      user.auth.lastLogin = new Date();
      user.auth.forceLogout = false;
      await this.userAuthRepo.save(user.auth);
      return {
        id: user.id,
        accessToken,
      };
    } else {
      throw new ForbiddenException('Inactive user or incorrect password');
    }
  }
}
