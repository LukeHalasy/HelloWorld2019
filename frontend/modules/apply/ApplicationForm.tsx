import React, { Component } from 'react';
import {
	Gender,
	ethnicities,
	ClassYear,
	gradYears,
	Major,
	Referral,
	ShirtSize
} from '../../../shared/app.enums';
import { IApplication } from '../../@types';

type Props = {
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	disabled?: boolean;
} & IApplication;

export default class ApplicationForm extends Component<Props> {
	render() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<label htmlFor="gender">
					Gender{' '}
					<select
						required
						name="gender"
						onChange={this.props.onSelect}
						value={this.props.gender}
					>
						{Object.values(Gender).map(gender => (
							<option value={gender} key={gender}>
								{gender}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="ethnicity">
					Ethnicity{' '}
					<select
						required
						name="ethnicity"
						onChange={this.props.onSelect}
						value={this.props.ethnicity}
					>
						{ethnicities.map((ethnicity, i) => (
							<option value={ethnicity} key={ethnicity}>
								{ethnicity}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="classYear">
					Class Year{' '}
					<select
						required
						name="classYear"
						onChange={this.props.onSelect}
						value={this.props.classYear}
					>
						{Object.values(ClassYear).map(classYear => (
							<option value={classYear} key={classYear}>
								{classYear}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="graduationYear">
					Graduation Year{' '}
					<select
						required
						name="graduationYear"
						onChange={this.props.onSelect}
						value={this.props.graduationYear}
					>
						{gradYears.map((graduationYear, i) => (
							<option value={graduationYear} key={graduationYear}>
								{graduationYear}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="major">
					Major{' '}
					<select
						required
						name="major"
						onChange={this.props.onSelect}
						value={this.props.major}
					>
						{Object.values(Major).map(major => (
							<option value={major} key={major}>
								{major}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="referral">
					Referral{' '}
					<select
						required
						name="referral"
						onChange={this.props.onSelect}
						value={this.props.referral}
					>
						{Object.values(Referral).map(referral => (
							<option value={referral} key={referral}>
								{referral}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="hackathons">
					Hackathons{' '}
					<input
						required
						min="0"
						name="hackathons"
						type="number"
						onChange={this.props.onChange}
						value={this.props.hackathons}
					/>
				</label>
				<br />
				<label htmlFor="shirtSize">
					Shirt Size{' '}
					<select
						required
						name="shirtSize"
						onChange={this.props.onSelect}
						value={this.props.shirtSize}
					>
						{Object.values(ShirtSize).map(shirtSize => (
							<option value={shirtSize} key={shirtSize}>
								{shirtSize}
							</option>
						))}
					</select>
				</label>
				<br />
				<label htmlFor="dietaryRestrictions">
					Dietary Restrictions{' '}
					<input
						name="dietaryRestrictions"
						onChange={this.props.onChange}
						value={this.props.dietaryRestrictions}
					/>
				</label>
				<br />
				<label htmlFor="website">
					Website{' '}
					<input
						name="website"
						type="url"
						onChange={this.props.onChange}
						value={this.props.website}
					/>
				</label>
				<br />
				<label htmlFor="answer1">
					Answer 1
					<br />
					<textarea
						required
						name="answer1"
						value={this.props.answer1}
						onChange={this.props.onChange}
					/>
				</label>
				<br />
				<label htmlFor="answer2">
					Answer 2
					<br />
					<textarea
						required
						name="answer2"
						value={this.props.answer2}
						onChange={this.props.onChange}
					/>
				</label>
				<br />
				<input type="submit" value="Submit" />
			</form>
		);
	}
}
