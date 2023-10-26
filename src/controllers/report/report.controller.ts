import { AdminRoles, HeaderEnum, TechServiceReportInterface, UnitFuelingReportInterface, UnitServiceReportInterface } from './../../shared';
import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateRoles, ValidateUserGuard } from './../../auth';
import { ReportParamsDTO, ValidateByUserDTO } from './../../dtos';
import { ReportService } from './../../services';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
@ValidateRoles(...AdminRoles)
@Controller('report/generate')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('')
  generateReport(
    @Headers() headers: ValidateByUserDTO,
    @Body() payload: ReportParamsDTO
  ): Promise<UnitFuelingReportInterface[] | UnitServiceReportInterface[] | TechServiceReportInterface[] | string> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.reportService.generate(payload, userId);
  }
}
