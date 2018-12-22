import * as React from 'react';

interface CursorState {
	x: number;
    y: number;
}

export default class ProgressBar extends React.Component<any, CursorState> {
    state: CursorState = {
        x: 0,
        y: 0
    };

	constructor(props: any) {
		super(props);

        window.addEventListener('mousemove', this.onMouseMove.bind(this), true);
	}

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e: MouseEvent) {
        this.setState({
            x: e.clientX,
            y: e.clientY
        });
    }

	render() {
		return <div className='cursor' style={{
            left: this.state.x,
            top: this.state.y
        }}></div>;
	}
}