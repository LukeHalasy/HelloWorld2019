import 'jest';
import * as supertest from 'supertest';
import { generateUser, generateApplication, generateUsers } from '../helper';
import Server from '../../server';
import { Role } from '../../../shared/user.enums';
import { IUserModel, User } from '../../models/user';
import { IApplicationModel } from '../../models/application';
import { ObjectId } from 'bson';

let server: Server;
let request: supertest.SuperTest<supertest.Test>;
let users: { user: IUserModel; token: string }[];
let user: { user: IUserModel; token: string };

describe('Suite: /api/exec -- Integration', () => {
	beforeEach(async () => {
		await Server.createInstance().then(s => {
			server = s;
			request = supertest(s.app);
		});
		await server.mongoose.connection.dropDatabase();

		users = await Promise.all<{ user: IUserModel; token: string }>(
			generateUsers(6).map(u =>
				request
					.post('/api/auth/signup')
					.send(u)
					.then(response => response.body.response)
			)
		);

		user = users[0];
	});

	afterEach(() => server.mongoose.disconnect());

	describe('Check in users', () => {
		it('Fails to checkin because unauthorized', async () => {
			const {
				body: { error },
				status
			} = await request.post(`/api/exec/checkin/${user.user._id}`);

			expect(status).toEqual(401);
			expect(error).toEqual('You must be logged in!');
		});

		it('Fails to checkin because insufficient permissions', async () => {
			const {
				body: { error },
				status
			} = await request
				.post(`/api/exec/checkin/${user.user._id}`)
				.auth(user.token, { type: 'bearer' });

			expect(status).toEqual(401);
			expect(error).toEqual('Insufficient permissions');
		});

		it('Fails to checkin non existant user', async () => {
			user.user = await User.findByIdAndUpdate(
				user.user._id,
				{ $set: { role: Role.EXEC } },
				{ new: true }
			);

			const {
				body: { error },
				status
			} = await request
				.post(`/api/exec/checkin/${new ObjectId()}`)
				.auth(user.token, { type: 'bearer' });

			expect(status).toEqual(400);
			expect(error).toEqual('User does not exist');
		});

		it('Fails to checkin non existant user', async () => {
			user.user = await User.findByIdAndUpdate(
				user.user._id,
				{ $set: { role: Role.EXEC } },
				{ new: true }
			);

			const checkedinUser = users[1].user;

			const {
				body: { response },
				status
			} = await request
				.post(`/api/exec/checkin/${checkedinUser._id}`)
				.auth(user.token, { type: 'bearer' });

			expect(status).toEqual(200);
			expect(response).toBeTruthy();
			expect(response).toEqual(
				expect.objectContaining({
					...checkedinUser,
					updatedAt: response.updatedAt,
					checkedin: true
				})
			);
		});
	});
});
