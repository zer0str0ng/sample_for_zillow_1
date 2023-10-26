import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClientEntity } from './../../entities';
import { ClientInterface } from './../../shared';
import { ClientSearchParamsDTO } from 'src/dtos';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { ID_AND_NAME_OBJ } from './../../utils';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepo: Repository<ClientEntity>,
    private logger: ILogger
  ) {}

  findAll(params: ClientSearchParamsDTO): Promise<ClientInterface[]> {
    this.logger.debug('Getting all clients...');

    let where: FindOptionsWhere<ClientEntity> | FindOptionsWhere<ClientEntity>[] = { isActive: true };

    if (params.param?.length)
      where = [
        { name: Like(`%${params.param}%`), isActive: true },
        { account: Like(`%${params.param}%`), isActive: true },
      ];

    return this.clientRepo.find({ select: { createdUser: ID_AND_NAME_OBJ, updatedUser: ID_AND_NAME_OBJ }, relations: { createdUser: true, updatedUser: true }, where });
  }

  findOne(id: string): Promise<ClientInterface> {
    this.logger.debug('Getting client...');
    return this.clientRepo.findOne({
      select: { createdUser: ID_AND_NAME_OBJ, updatedUser: ID_AND_NAME_OBJ },
      where: { id },
      relations: { createdUser: true, updatedUser: true },
    });
  }

  async create(client: ClientInterface): Promise<ClientInterface> {
    this.logger.debug('Creating client...');
    delete client.id;

    await this.validateAccount(client);

    return this.clientRepo.save(client);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing client...');

    const deleted = await this.clientRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async update(client: ClientInterface): Promise<ClientInterface> {
    this.logger.debug('Updating client...');

    if (!client.id) throw new BadRequestException('The client id was not provided');

    const existingClient = await this.clientRepo.findOne({
      where: { id: client.id },
    });

    if (!existingClient) throw new NotFoundException('The client was not found in the database');

    await this.validateAccount(client);

    // Set deactivation date as current if not remove deactivation date
    if (existingClient.monitoringFlag && !client.monitoringFlag) client.deactivationDate = new Date();
    else if (client.monitoringFlag) client.deactivationDate = null;

    const updated = { ...existingClient, ...client };

    return this.clientRepo.save(updated);
  }

  // If passing the account, the account shouldn't already exist for another user
  async validateAccount(client: ClientInterface) {
    const where: FindOptionsWhere<ClientEntity> = { account: client.account, isActive: true };
    if (client.id) {
      where.id = Not(client.id);
    }
    if (client.account?.length) {
      const existingAccount = await this.clientRepo.findOne({
        where,
      });

      if (existingAccount) throw new BadRequestException(`The account can not be used as it is already set for: ${existingAccount.name}`);
    }
  }
}
