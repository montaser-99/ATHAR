import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type HttpRequest = { path: string };
type HttpResponse = {
  status(code: number): HttpResponse;
  json(body: unknown): void;
};

@Catch()
export class DirectoryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<HttpResponse>();
    const request = context.getRequest<HttpRequest>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const code =
      status === HttpStatus.BAD_REQUEST
        ? 'VALIDATION_ERROR'
        : status === HttpStatus.NOT_FOUND
          ? 'NOT_FOUND'
          : 'INTERNAL_ERROR';
    const message =
      status === HttpStatus.BAD_REQUEST
        ? 'تحقق من بيانات البحث وحاول مرة أخرى.'
        : status === HttpStatus.NOT_FOUND
          ? 'المنصة غير متاحة.'
          : 'تعذر إكمال الطلب الآن.';
    response
      .status(status)
      .json({ error: { code, message }, path: request.path });
  }
}
