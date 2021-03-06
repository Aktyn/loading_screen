import * as React from 'react';
import { render } from 'react-dom';
import ProgressBar from './progressbar';
import Music from './music';
import Cursor from './cursor';

//@ts-ignore
import './styles/main.scss';

render(<>
	<Music />
	<div id='logo'></div>
	<ProgressBar />
	<div id='discord_link' title='DISCORD.IO/IN2RP' >{
		'DISCORD.IO/IN2RP'.split('').map((letter, i) => <span key={i}>{letter}</span>)
	}</div>
	<Cursor />
</>, document.getElementById('page'));