import * as React from 'react';

interface LoadingState {
	progress: number;
}

export default class ProgressBar extends React.Component<any, LoadingState> {
    private static SEG_COUNT = 20;
    
	state: LoadingState = {
		progress: 0
	};

    private visible_progress = 0;
    private updateInterval: NodeJS.Timeout | number;

	constructor(props: any) {
		super(props);

        //fake progess
        /*let p=0;
        setInterval(() => {
            p+=(Math.random()*Math.random()*5.0);
            if(p > 100)
                p = 100;
            this.updateProgress(p);
        }, 100);*/

        this.updateInterval = setInterval(() => {
            if(this.state.progress > this.visible_progress)
                this.visible_progress += 1;
        }, 1000 / 20);
	}

	onUpdate(e: MessageEvent) {
        try {
            //@ts-ignore
            let handler = handlers[e.data.eventName];

            if(handler) {
        		handler(e.data);
        		this.updateProgress(GetTotalProgress());
            }
        }
        catch(e) {
            console.log(e.message);
        }
	}

	componentDidMount() {
		window.addEventListener('message', this.onUpdate.bind(this));
	}

	componentWillUnmount() {
        clearInterval(this.updateInterval as number);
		window.removeEventListener('message', this.onUpdate.bind(this));
	}

    updateProgress(percent: number) {
        this.setState({
            progress: Math.max( this.state.progress, percent|0 )
        });
    }

	render() {
		return <div className='progressbar_container'>
            <div className='percent_top'></div>
            <div className='progressbar_border'></div>
            <div className='progressbar'>
                {new Array(ProgressBar.SEG_COUNT).fill(0).map((s, i) => {
                    return <span 
                        key={i} 
                        className={this.visible_progress/100*ProgressBar.SEG_COUNT > i ? 'on' : ''}>
                       </span>;
                })}
            </div>
            <div className='percent_bottom'></div>
            <div className='progresscircle'></div>
            <div className='progresspercent'>{this.visible_progress}%</div>
		</div>;
	}
}

var types = [
    "INIT_CORE",
    "INIT_BEFORE_MAP_LOADED",
    "MAP",
    "INIT_AFTER_MAP_LOADED",
    "INIT_SESSION"
];

//var stateCount = 4;
var states: {[index: string]: any} = {};

const progressBars: {[index: string]: {enabled: boolean}} = {
    "INIT_CORE": {
        enabled: false, //NOTE: Disabled because INIT_CORE seems to not get called properly. (race condition).
    },

    "INIT_BEFORE_MAP_LOADED": {
        enabled: true,
    },

    "MAP": {
        enabled: true,
    },

    "INIT_AFTER_MAP_LOADED": {
        enabled: true,
    },

    "INIT_SESSION": {
        enabled: true,
    }
};

var handlers = {
    startInitFunction(data: MessageEvent) {
        //Create a entry for every type.
        if(states[data.type] == null) {
            states[data.type] = {};
            states[data.type].count = 0;
            states[data.type].done = 0;   
        }
    },

    startInitFunctionOrder(data: MessageEvent) {
        //Collect the total count for each type.
        if(states[data.type] != null)
        	//@ts-ignore
            states[data.type].count += data.count;
    },

    initFunctionInvoked(data: MessageEvent) {
        //Increment the done accumulator based on type.
        if(states[data.type] != null)
            states[data.type].done++;
    },

    startDataFileEntries(data: MessageEvent) {
        //Manually add the MAP type.
        states["MAP"] = {};
        //@ts-ignore
        states["MAP"].count = data.count;
        states["MAP"].done = 0; 
    },

    performMapLoadFunction(data: MessageEvent) {
        //Increment the map done accumulator.
        states["MAP"].done++;
    }
};

//Get the progress of a specific type. (See types array).
function GetTypeProgress(type: string) {
    if(states[type] != null) {
        var doneCount = states[type].done;
        var totalCount = states[type].count;

        if(doneCount <= 0 || isNaN(doneCount) || 
           totalCount <= 0 || isNaN(totalCount))
        {
            return 0;
        }

        var progress = states[type].done / states[type].count;
        return Math.round(progress * 100);
    }

    return 0;
}

//Get the total progress for all the types.
function GetTotalProgress() {
    var totalProgress = 0;
    var totalStates = 0;
    
    for(var i = 0; i < types.length; i++) {
        var key = types[i];
        if(progressBars[key].enabled) {
            totalProgress += GetTypeProgress(key);
            totalStates++;
        }
    }

    if(totalProgress <= 0 || isNaN(totalProgress) || totalStates <= 0 || isNaN(totalStates) )
        return 0;

    return Math.round(totalProgress / totalStates);
}