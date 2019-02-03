import React, { Component, FormEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { signUp, sendFlashMessage } from '../redux/actions';
import { ILoginResponse, ICreateUser } from '../@types';

type Props = {
	signup: (body: ICreateUser) => Promise<ILoginResponse>;
};

class SignupPage extends Component<Props> {
	state = {
		name: '',
		email: '',
		password: '',
		passwordConfirm: ''
	};

	onChange = (e: ChangeEvent<HTMLInputElement>) =>
		this.setState({ [e.target.name]: e.target.value });

	onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { name, email, password, passwordConfirm } = this.state;
		if (!name || !email || !password || !passwordConfirm) return;
		try {
			const user = await this.props.signup(this.state);
			Router.push('/');
			console.log('New User:', user);
		} catch (error) {
			console.error('Error creating user', error);
		}
	};

	render() {
		const { name, email, password, passwordConfirm } = this.state;
		return (
			<div>
				Signup Page
				<br />
				<form onSubmit={this.onSubmit}>
					<label>
						Name:
						<input name="name" value={name} onChange={this.onChange} />
					</label>
					<br />
					<label>
						Email:
						<input name="email" value={email} onChange={this.onChange} />
					</label>
					<br />
					<label>
						Password:
						<input
							type="password"
							name="password"
							value={password}
							onChange={this.onChange}
						/>
					</label>
					<br />
					<label>
						Password Comfirm:
						<input
							type="password"
							name="passwordConfirm"
							value={passwordConfirm}
							onChange={this.onChange}
						/>
					</label>
					<br />
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(
	mapStateToProps,
	{ signup: signUp, flash: sendFlashMessage }
)(SignupPage);
