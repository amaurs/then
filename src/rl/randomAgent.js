import { argMax, randomElement } from "./util"
import { Agent } from './agent'

class RandomAgent extends Agent {
    /**
     * Random behaviour.
     */
    tick(environment) {
        const state = environment.getState()
        console.log(state)
        const action = randomElement(
            this.epsilonGreedyPolicy(state, this.epsilon)
        )
        const stepRes = environment.tick(action)
        return { isDone: stepRes.isDone, reward: stepRes.reward }
    }
}

export { RandomAgent as Agent }
