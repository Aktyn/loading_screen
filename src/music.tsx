import * as React from 'react';
const YTPlayer = require('yt-player');

interface PlayerState {
    muted: boolean;
}

export default class extends React.Component<any, PlayerState> {

    state: PlayerState = {
        muted: true
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

        this.player.setVolume(60);
        this.player.load('1nQkCfkRVus', true);
         
        /*player.on('playing', () => {
            console.log(player.getDuration()); // => 351.521
        });*/
	}

    switchPlaying() {
        if(this.player.isMuted())
            this.player.unMute();
        else
            this.player.mute();
        this.setState({muted: this.player.isMuted()});
    }

	render() {
		return <>
           <div className="videoContainer">
                <div className="videoContainer__video" id='youtube_bg'></div>
            </div>
           <div id='playpause_btn' className={this.state.muted ? 'on' : 'off'} 
               onClick={this.switchPlaying.bind(this)}></div>
       </>;
	}
}