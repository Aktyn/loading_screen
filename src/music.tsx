import * as React from 'react';
const YTPlayer = require('yt-player');

const VOLUMEBAR_WIDTH = 140;
const DEFAULT_VOLUME = 33;

interface PlayerState {
    muted: boolean;
    volume: number;
}

export default class extends React.Component<any, PlayerState> {

    state: PlayerState = {
        muted: false,
        volume: DEFAULT_VOLUME
    };

    private player: any;

	constructor(props: any) {
		super(props);
	}

	componentDidMount() {
		this.player = new YTPlayer('#youtube_bg', {
            //'width': 1,
            //'height': 1,
            'autoplay': 1,
            'controls': 0,
            // 'disablekb': 1,
            // 'enablejsapi': 1,
        });

        this.player.setVolume(DEFAULT_VOLUME);
        this.player.load('1nQkCfkRVus', true);
         
        /*player.on('playing', () => {
            console.log(player.getDuration()); // => 351.521
        });*/
	}

    switchPlaying() {
        if(this.state.muted)
            this.player.unMute();
        else
            this.player.mute();
        this.setState({muted: !this.state.muted});
    }

    onVolumeChanged(factor: number) {
        if(this.state.muted)
            return;
        let new_volume = Math.min(100, Math.max(0, this.state.volume + factor));
        this.player.setVolume(new_volume);
        this.setState({volume: new_volume});
    }

	render() {
		return <>
           <div className="videoContainer">
                <div className="videoContainer__video" id='youtube_bg'></div>
            </div>
            <div id='playpause_btn' className={this.state.muted ? 'off' : 'on'} 
               onClick={this.switchPlaying.bind(this)}></div>
            <VolumeBar volume={this.state.volume} muted={this.state.muted}
                volumeChangeCallback={this.onVolumeChanged.bind(this)} />
       </>;
	}
}

interface VolumeBarProps {
    muted: boolean;
    volume: number;//0 - 100
    volumeChangeCallback: (factor: number) => void;
}

class VolumeBar extends React.Component<VolumeBarProps> {
    private static barTransition = 'width 0.6s ease-in-out';

    static defaultProps = {
        muted: false
    };

    private bar: HTMLDivElement | null = null;
    private inner_bar: HTMLSpanElement | null = null;

    private changing = false;

    constructor(props: VolumeBarProps) {
        super(props);
        window.addEventListener('mouseup', this.onVolumeChangeCanceled.bind(this), false);
        window.addEventListener('mousemove', this.updateVolume.bind(this), false);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.onVolumeChangeCanceled.bind(this));
        window.removeEventListener('mousemove', this.updateVolume.bind(this));
    }

    private updateVolume(e: MouseEvent) {
        if(!this.changing || this.bar === null)
            return;
        
        let x = e.clientX - this.bar.getBoundingClientRect().left;

        this.props.volumeChangeCallback( (x / VOLUMEBAR_WIDTH * 100) - this.props.volume );
    }

    private onVolumeChangeStarted(e: React.MouseEvent<HTMLDivElement>) {
        this.changing = true;
        if(this.inner_bar) this.inner_bar.style.transition = 'none';
        this.updateVolume(e.nativeEvent);
    }

    private onVolumeChangeCanceled() {
        this.changing = false;
        if(this.inner_bar) this.inner_bar.style.transition = VolumeBar.barTransition;
    }

    render() {
        let current_volume = this.props.muted ? 0 : VOLUMEBAR_WIDTH*this.props.volume/100.0;
        return <div className='volume_bar'>
            <button onClick={() => this.props.volumeChangeCallback(-10)}>&#8722;</button>
            <div ref={(element) => this.bar = element}
                className='bar_container' style={{width: `${VOLUMEBAR_WIDTH}px`}} 
                onMouseDown={(e) => this.onVolumeChangeStarted(e)}>
                <span ref={(element) => this.inner_bar = element}
                    style={{
                        width: `${current_volume}px`,
                        transition: VolumeBar.barTransition
                    }}></span>
            </div>
            <button onClick={() => this.props.volumeChangeCallback(10)}>+</button>
        </div>;
    }
}