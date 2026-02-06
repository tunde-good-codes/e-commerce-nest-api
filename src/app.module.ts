import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CategoryModule, ProductsModule],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
