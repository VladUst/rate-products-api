import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './user.model';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			login: dto.login,
			passwordHash: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async findUser(login: string) {
		return this.userModel.findOne({ login }).exec();
	}

	async validateUser(login: string, password: string): Promise<Pick<UserDocument, 'login'>> {
		const user = await this.findUser(login);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return {
			login: user.login,
		};
	}

	async login(login: string) {
		const payload = { login };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
