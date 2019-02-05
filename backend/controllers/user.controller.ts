import { ObjectId } from 'mongodb';
import { User, UserDto, IUserModel } from '../models/user';
import { userMatches, multer } from '../utils';
import {
	JsonController,
	Get,
	QueryParam,
	Param,
	BadRequestError,
	Put,
	Body,
	UseBefore,
	CurrentUser,
	UnauthorizedError,
	UseAfter,
	Post
} from 'routing-controllers';
import { BaseController } from './base.controller';
import { ValidationMiddleware } from '../middleware/validation';
import { ApplicationDto, Application } from '../models/application';

@JsonController('/api/users')
@UseAfter(ValidationMiddleware)
export class UserController extends BaseController {
	@Get('/')
	async getAll(@QueryParam('sortBy') sortBy?: string, @QueryParam('order') order?: number) {
		order = order === 1 ? 1 : -1;
		sortBy = sortBy || 'createdAt';

		let contains = false;
		User.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'createdAt';

		const results = await User.find()
			.sort({ [sortBy]: order })
			.lean()
			.exec();

		return { users: results };
	}

	@Get('/:id')
	async getById(@Param('id') id: string) {
		if (!ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');
		const user = await User.findById(id)
			.lean()
			.exec();
		if (!user) throw new BadRequestError('User does not exist');
		return user;
	}

	@Put('/:id')
	@UseBefore(multer.any())
	async updateById(
		@Param('id') id: string,
		@Body() userDto: UserDto,
		@CurrentUser({ required: true }) currentUser: IUserModel
	) {
		if (!ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');
		if (!userMatches(currentUser, id))
			throw new UnauthorizedError('You are unauthorized to edit this profile');
		let user = await User.findById(id, '+password').exec();
		if (!user) throw new BadRequestError('User not found');

		user = await User.findByIdAndUpdate(id, userDto, { new: true })
			.lean()
			.exec();
		return user;
	}

	@Post('/:id/apply')
	@UseBefore(multer.any())
	async apply(
		@Param('id') id: string,
		@Body() applicationDto: ApplicationDto,
		@CurrentUser({ required: true }) currentUser: IUserModel
	) {
		if (!ObjectId.isValid(id)) throw new BadRequestError('Invalid user ID');
		const user = await User.findById(id).exec();
		if (!user) throw new BadRequestError('User not found');
		if (!userMatches(currentUser, id))
			throw new UnauthorizedError('You are unauthorized to edit this application');

		const app = await Application.findOneAndUpdate(
			{ user },
			{ ...applicationDto, user: currentUser },
			{
				upsert: true,
				setDefaultsOnInsert: true,
				new: true
			}
		)
			.populate('user')
			.exec();
		return app;
	}
}
