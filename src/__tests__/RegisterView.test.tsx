import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import RegisterView from '../views/register/RegisterView';

const setup = async () => {
    const utils = render(<RegisterView />);
	const role = await utils.findByTestId('role');
	const form = await utils.findByTestId('register-form');
	const email = await utils.findByTestId('email');
	const password = await utils.findByTestId('password');
	const confirmationPassword = await utils.findByTestId('confirmation-password');
	return {
        role,
		email,
		password,
        form,
        confirmationPassword
		...utils,
	};
};

describe('<RegisterView />', () => {
	test('should display a blank register form', async () => {
		const { form } = await setup();

		expect(form).toHaveFormValues({
            role: 'MENTOR',
            email: '',
            password: '',
            confirmationPassword: '',
		});
	});

	test('email should update when value updates', async () => {
		const { email } = await setup();

		fireEvent.change(email, { target: { value: 'email' } });

		expect(email).toHaveValue('email');
    });
    
    test('password should update when value updates', async () => {
		const { password } = await setup();

		fireEvent.change(password, { target: { value: 'password' } });

		expect(password).toHaveValue('password');
    });
    
    test('confirmation password should update when value updates', async () => {
		const { confirmationPassword } = await setup();

		fireEvent.change(confirmationPassword, { target: { value: 'confirmation-password' } });

		expect(confirmationPassword).toHaveValue('confirmation-password');
	});
});
