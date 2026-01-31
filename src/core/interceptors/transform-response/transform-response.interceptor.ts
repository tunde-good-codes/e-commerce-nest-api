import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // before route handler  ... .pipe to alter route handler
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            data: [],
          };
        }
        if (response.data && response.success && response.meta) {
          return {
            data: response.data,
            success: response.success,
            meta: response.meta,
          };
        }
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: response,
        };
      })
    );
  }
}
