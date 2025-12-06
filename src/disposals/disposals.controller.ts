import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DisposalsService } from './disposals.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateDisposalDto } from './dto/create-disposal.dto';
import { DisposalResponse } from './swagger/disposals.response';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('disposals')
export class DisposalsController {
  constructor(private readonly disposalsService: DisposalsService) {}

  @Post('/')
  @ApiOperation({ summary: 'Record a waste disposal' })
  @ApiOkResponse({
    type: DisposalResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createDisposal(@Body() data: CreateDisposalDto) {
    return this.disposalsService.createDisposal(data);
  }
}
