import { AppConfig } from './../../app.config';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { hashPassword, isNonDevEnvironment } from './../../utils';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitAssignationService } from '../unit-srv';
import { UserDTO } from './../../dtos';
import { UserAuthEntity, UserEntity } from './../../entities';
import { UserInterface } from './../../shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private unitAssigService: UnitAssignationService,
    private logger: ILogger,
    @Inject(AppConfig.KEY)
    private config: ConfigType<typeof AppConfig>
  ) {}

  async findAll(): Promise<Partial<UserDTO>[]> {
    this.logger.debug('Getting all users...');
    const users = await this.userRepo.find({
      relations: { auth: true },
      where: { isActive: true },
    });

    return users.map((user) => this.cleanUpUser(user));
  }

  async findOne(
    id: string,
    cleanUp: { includeProfile: boolean; includeAuth: boolean } = {
      includeAuth: false,
      includeProfile: false,
    }
  ): Promise<Partial<UserDTO>> {
    this.logger.debug('Getting user...');
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { auth: true },
    });
    return this.cleanUpUser(user, cleanUp);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing user...');

    await this.unitAssigService.cancelCurrentAssignation({ userId: id });

    const user = await this.userRepo.findOne({ where: { id }, relations: { auth: true } });
    user.isActive = false;
    user.auth.forceLogout = true;

    const updated = await this.userRepo.save(user);

    return !!updated;
  }

  async create(user: UserDTO): Promise<Partial<UserDTO>> {
    this.logger.debug('Creating user...');
    delete user.id;
    if (!user.auth) {
      throw new NotFoundException('Auth information is required');
    }
    // Hash Password
    user.auth.password = hashPassword(user.auth.password);

    return this.cleanUpUser(await this.userRepo.save(user));
  }

  async update(user: UserInterface): Promise<Partial<UserDTO>> {
    this.logger.debug('Updating user...');

    if (!user.id) throw new BadRequestException('The user id was not provided');

    const existing = await this.userRepo.findOne({
      where: { id: user.id },
      relations: { auth: true },
    });

    if (!existing) throw new NotFoundException('The user was not found in the database');

    let updatedAuth = { ...existing.auth };
    // Validate if the password will be updated
    if (user.auth?.password) {
      user.auth.password = hashPassword(user.auth.password);
      user.auth.forceLogout = true;
      updatedAuth = { ...updatedAuth, ...user.auth };
    }

    const updated = { ...existing, ...user, auth: updatedAuth };

    return this.cleanUpUser(await this.userRepo.save(updated));
  }

  cleanUpUser(
    user: Partial<UserInterface>,
    cleanUp: { includeProfile: boolean; includeAuth: boolean } = {
      includeProfile: true,
      includeAuth: true,
    }
  ): Partial<UserDTO> {
    if (!cleanUp.includeAuth && isNonDevEnvironment(this.config.NODE_ENV)) {
      delete user.auth;
    }
    if (!cleanUp.includeProfile) delete user.profile;
    return user as Partial<UserDTO>;
  }
}
