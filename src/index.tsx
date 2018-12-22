import * as React from 'react';
import { render } from 'react-dom';
import './styles/main.scss';
import ProgressBar from './progressbar';
import Music from './music';
import Cursor from './cursor';

render(<>
	<Music />
	<div id='logo'></div>
	<ProgressBar />
	<Cursor />
</>, document.getElementById('page'));