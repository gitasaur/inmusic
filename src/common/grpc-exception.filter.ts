import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Prisma } from '@prisma/client';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name); // Add a logger

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(`Prisma Error: ${exception.message}`, exception.stack);

      switch (exception.code) {
        case 'P2002': // Unique constraint failed
          throw new RpcException({
            code: status.ALREADY_EXISTS,
            message: `Duplicate entry: ${exception.meta?.target || 'Unknown field'}`,
          });
        case 'P2025': // Record not found
          throw new RpcException({
            code: status.NOT_FOUND,
            message: `Record not found`,
          });
        default:
          throw new RpcException({
            code: status.INTERNAL,
            message: `Prisma error: ${exception.message}`,
          });
      }
    } else if (exception instanceof RpcException) {
      this.logger.error(`gRPC Error: ${exception.message}`, exception.stack);
      throw exception;
    } else {
      this.logger.error(`Internal Server Error: ${exception.message}`, exception.stack);
      throw new RpcException({
        code: status.INTERNAL,
        message: `Internal server error: ${exception.message || 'Unknown error'}`,
      });
    }
  }
}
