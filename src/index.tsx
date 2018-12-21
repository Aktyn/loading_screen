import * as React from 'react';
import { render } from 'react-dom';
import './styles/main.scss';
import ProgressBar from './progressbar';
import Music from './music';

render(<>
	<Music />
	<div id='logo'></div>
	<ProgressBar />
</>, document.getElementById('page'));