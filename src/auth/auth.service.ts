import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
  }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('user already exist');
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const currentDate = new Date();
    const oneMonthLater = new Date();
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
      phoneNumber,
      gender,
      subscriptionStartDate: currentDate.toISOString(),
      subscriptionEndDate: oneMonthLater.toISOString(),
    });

    return {
      message: 'created successfully',
      data: {
        firstName,
        email,
        lastName,
        _id: newUser._id,
      },
    };
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password');

    if (!existUser) {
      throw new BadRequestException('invalid credentials');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      throw new BadRequestException('invalid credentials');
    }

    const payload = {
      id: existUser._id,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { token };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
