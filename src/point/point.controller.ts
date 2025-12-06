import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PointService } from './point.service';
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreatePointDto } from './dto/create.dto';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import {
  PaginatedPointResponse,
  PointResponse,
} from './swagger/point.response';
import { DeleteResponse } from './swagger/delete.response';
import { UpdatePointDto } from './dto/update.dto';
import { GetAllPointsDto } from './dto/get-all-points.dto';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('/')
  @ApiOperation({ summary: 'create a new point' })
  @ApiBody({
    type: CreatePointDto,
  })
  @ApiOkResponse({
    type: PointResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  async create(@Body() data: CreatePointDto) {
    return this.pointService.create(data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get a point by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: PointResponse,
  })
  async getPoint(@Param('id') id: string) {
    return this.pointService.getPointById(id);
  }

  @Get('/')
  @ApiOperation({ summary: 'get all points' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: PaginatedPointResponse,
  })
  async getAllPoints(@Query() query: GetAllPointsDto) {
    return this.pointService.getAllPoints(query);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete a point by id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: DeleteResponse,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async deletePoint(@Param('id') id: string) {
    return this.pointService.deletePointById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'update a point by id' })
  @ApiBody({
    type: UpdatePointDto,
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: PointResponse,
  })
  @UseGuards(AuthGuard, AdminGuard)
  async updatePoint(@Param('id') id: string, @Body() data: UpdatePointDto) {
    return this.pointService.updatePointById(id, data);
  }
}
