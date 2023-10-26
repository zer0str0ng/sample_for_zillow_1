import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UnitEntity } from './../entities';
import { UnitInterface } from './../shared';

const validateOdometer = (lastOdometer: number, newOdometer: number, maxChange: number): void => {
  if (newOdometer <= lastOdometer || (maxChange && newOdometer - lastOdometer > maxChange)) {
    const maxChangeMsg = maxChange ? `, max change allowed: [${maxChange}]` : '';
    throw new BadRequestException(`The provided odometer [${newOdometer}] is invalid, current unit odometer: [${lastOdometer}]${maxChangeMsg}`);
  }
};

export const getUnitAndValidateOdometer = async (unitId: string, newOdometer: number, maxKilometers: number, unitRepo: Repository<UnitEntity>): Promise<UnitInterface> => {
  const unit = await unitRepo.findOne({
    where: { id: unitId },
  });

  if (!unit) throw new NotFoundException('The provided unit does not exists');

  validateOdometer(unit.odometer, newOdometer, maxKilometers);

  return unit;
};

export const getUnitPerformance = (oldOdometer: number, newOdometer: number, liters: number): number => {
  return (newOdometer - oldOdometer) / liters;
};
