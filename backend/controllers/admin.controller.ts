import { ObjectId } from 'mongodb';
import {
	JsonController,
	Get,
	QueryParam,
	BadRequestError,
	UseAfter,
	Authorized,
	Params,
	Post,
	BodyParam,
	Param
} from 'routing-controllers';
import { BaseController } from './base.controller';
import { ValidationMiddleware } from '../middleware/validation';
import { Role } from '../../shared/user.enums';
import { User } from '../models/user';
import { escapeRegEx } from '../utils';

@JsonController('/api/admin')
@UseAfter(ValidationMiddleware)
export class AdminController extends BaseController {
	// TODO: Add tests
	@Get('/users')
	@Authorized([Role.ADMIN])
	async getUsers(@QueryParam('email') email: string = '') {
		const query = { email: new RegExp(escapeRegEx(email), 'i') };
		const results = await User.find(query)
			.limit(10)
			.exec();
		return results;
	}

	// TODO: Add tests
	@Post('/role')
	@Authorized([Role.ADMIN])
	async checkin(@BodyParam('email') email?: string, @BodyParam('role') r?: string) {
		if (!email) throw new BadRequestError('Please provide an email');
		
		const role: Role = Role[r];
		if (!role) throw new BadRequestError('Invalid Role');
		
		const user = await User.findOne({ email }).exec();
		if (!user) throw new BadRequestError(`There is no user with email: ${email}`);

		user.role = role;
		await user.save();
		return user;
	}
}
