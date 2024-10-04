import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc().getContext();
    // 🔊 Example only - Should eventually send to a logging service
    // console.log('Raw request:', request);

    return next.handle().pipe(
      tap((data) => console.log('Response:', data))
    );
  }
}