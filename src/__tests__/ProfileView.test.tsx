import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import ProfileView, { user } from '../views/profileView/ProfileView';

const setup = async () => {
	const utils = render(<ProfileView />);
	const form = await utils.findByTestId('form');
	const name = await utils.findByTestId('name');
	const degree = await utils.findByTestId('degree');
	const year = await utils.findByTestId('year');
	const tagline = await utils.findByTestId('tagline');
    const description = await utils.findByTestId('description');
    
return {
        form,
		name,
		degree,
        year,
        tagline,
        description,
		...utils,
	};
};

describe('ProfileView />', () => {
	test('should display a blank login form', async () => {
		const { form } = await setup();

		expect(form).toHaveFormValues({
			name: '',
			degree: '',
			year: '',
			tagline: '',
			description: '',
		});
	});

	test('name should update when value updates', async () => {
		const { name } = await setup();

		fireEvent.change(name, { target: { value: 'name' } });

		expect(name).toHaveValue('name');
    });
    
    test('degree should update when value updates', async () => {
		const { degree } = await setup();

		fireEvent.change(degree, { target: { value: 'Muu' } });

		expect(degree).toHaveValue('Muu');
    });
    
    test('year should update when value updates', async () => {
		const { year } = await setup();

		fireEvent.change(year, { target: { value: 'Bak 2.' } });

		expect(year).toHaveValue('Bak 2.');
    });
    
    test('tagline should update when value updates', async () => {
		const { tagline } = await setup();

		fireEvent.change(tagline, { target: { value: 'tagline' } });

		expect(tagline).toHaveValue('tagline');
    });
    
    test('description should update when value updates', async () => {
		const { description } = await setup();

		fireEvent.change(description, { target: { value: 'description' } });

		expect(description).toHaveValue('description');
    });
});
