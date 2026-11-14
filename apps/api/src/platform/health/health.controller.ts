import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('healthz')
  getHealth(): { status: 'ok'; service: 'athar-api' } {
    return { status: 'ok', service: 'athar-api' };
  }
}
