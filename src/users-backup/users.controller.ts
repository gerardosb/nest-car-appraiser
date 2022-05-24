import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Post('/signup')
    createUser(@Body() body:CreateUserDto){
        this.usersService.create(body.email, body.password)
    }

    @Get()
    getUsers(){
        return this.usersService.getAll()
    }
}
