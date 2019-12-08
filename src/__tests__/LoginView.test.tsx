import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import LoginView from '../views/login/LoginView';

const setup = async () => {
	const utils = render(<LoginView />);
	const form = await utils.findByTestId('login-form');
	const email = await utils.findByTestId('email');
	const password = await utils.findByTestId('password');
	return {
		email,
		password,
		form,
		...utils,
	};
};

describe('<LoginView />', () => {
	test('should display a blank login form', async () => {
		const { form } = await setup();

		expect(form).toHaveFormValues({
			email: '',
			password: '',
		});
	});

	test('username should update when value updates', async () => {
		const { form, email, password } = await setup();

		fireEvent.change(email, { target: { value: 'email' } });

		expect(email).toHaveValue('email');
	});
});
