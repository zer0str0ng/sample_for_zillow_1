import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserInterface, UserProfileSourceEnum } from './../../shared';
import { UserProfileDTO } from './../../dtos';
import { UserService } from './../../services';

@Injectable()
export class UserProfileService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async getUserProfile(id: string, source: string): Promise<UserProfileDTO> {
    const user = (await this.userService.findOne(id, {
      includeAuth: false,
      includeProfile: true,
    })) as UserInterface;

    if (!user) throw new NotFoundException('The user was not found in the database');

    const userProfile: UserProfileDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      cellphone: user.cellphone,
      profile: source === UserProfileSourceEnum.WEB ? user.profile.webApp ?? null : user.profile.mobileApp ?? null,
      roles: user.roles,
    };

    return userProfile;
  }

  async updateUserProfile(userProfile: UserProfileDTO, source: string): Promise<UserProfileDTO> {
    if (!userProfile.id) throw new BadRequestException('The user profile id was not provided');

    const user = (await this.userService.findOne(userProfile.id, {
      includeAuth: false,
      includeProfile: true,
    })) as UserInterface;

    if (!user) throw new NotFoundException('The user was not found in the database');

    const newProfile = source === UserProfileSourceEnum.WEB ? { webApp: userProfile.profile } : { mobileApp: userProfile.profile };

    const updatedUser = {
      id: user.id,
      name: user.name,
      profile: { ...user.profile, ...newProfile },
    } as UserInterface;

    this.userService.update(updatedUser);

    return { ...updatedUser, username: user.username, roles: user.roles };
  }
}
