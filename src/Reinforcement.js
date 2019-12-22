import React from 'react';
import Board from './rl/Board.js';
import './rl/game.css';

import { Environment, map} from './rl/windyGridworld.js';
import Controller from './rl/controller';
import { Agent } from './rl/sarsaAgent.js';

const environment = new Environment(map.height, 
                                    map.width, 
                                    map.boardPlan,
                                    map.wind,
                                    map.agent,
                                    map.goal)

const agent = new Agent(environment.getNumberOfActions(), environment.getNumberOfStates());

const controller = new Controller(environment, agent)

export default class Reinforcement extends React.Component{
    constructor(props) {
        super(props);
        const epsilon = 0.1;
        const alpha = 0.8;
        const gamma = 0.4;
        this.state = {
            started : false,
            board : controller.toBoard(),
            controller : controller,
            epsilon : epsilon,
            gamma : gamma,
            alpha : alpha,
            wins : 0,
            crashes : 0,
            episodes : 0,
            episodeDuration : 0, 
            data: [{episode:0,duration:0},{episode:0,duration:0}],
        }
        this.handleEpsilonChange = this.handleEpsilonChange.bind(this);
        this.handleAlphaChange = this.handleAlphaChange.bind(this);
        this.handleGammaChange = this.handleGammaChange.bind(this);

    }
    init(){
        const epsilon = .1;
        this.setState({
            started : false,
            epsilon : epsilon,
            wins : 0,
            crashes : 0,
            episodes : 0,
            episodeDuration : 0,})
    }
    componentDidMount() {
        console.log("Did Mount")
        this.start()
    }

    componentDidUpdate() {
        console.log("Did Update")
        
    }

    tick() {
        let stepRes = controller.tick();
        this.setState({episodeDuration: this.state.episodeDuration + 1});
        if(stepRes.isDone) {
            this.setState({episodes: this.state.episodes + 1});
            controller.initEpisode();
            let newData = this.state.data.slice();
            newData.push({episode : this.state.episodes, duration: this.state.episodeDuration});
            this.setState({data: newData});
            
            this.setState({episodeDuration: 0});
        }
        this.setState({board: controller.toBoard()});
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
        this.setState({started: false})
    }
    start() {
        this.setState({started: true})
        this.timerID = setInterval(
            () => this.tick(), 
        50
        );
        controller.toActionMap()
    }
    stop() {
        clearInterval(this.timerID);
    }
    handleEpsilonChange(event) {
        this.setState({epsilon: event.target.value});
        controller.setEpsilon(this.state.epsilon);
    }
    handleAlphaChange(event) {
        this.setState({alpha: event.target.value});
        controller.setAlpha(this.state.alpha);
    }
    handleGammaChange(event) {
        this.setState({gamma: event.target.value});
        controller.setGamma(this.state.gamma);
    }
    render() {
        return  <div className="container">
                    <div className="board">
                        <Board board={controller.toBoard()}/>
                    </div>
                </div>
    }
}
