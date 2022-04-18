import React from 'react';
import { Loader } from 'semantic-ui-react';
import { Dimmer } from 'semantic-ui-react';

const Spinner = () => {
	return (
		<Dimmer active>
			<Loader size='huge' content='Perparing chat ...' />
		</Dimmer>
	);
};

export default Spinner;
