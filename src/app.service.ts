import { Injectable } from "@nestjs/common";
@Injectable()
export class AppService {
  constructor() {}
  getHello() {
    return {
      data: "Hello to a new nestjs now World!",
      success: true,
      meta: {
        pages: 10,
      },
    };
  }
}
