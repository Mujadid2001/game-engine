export class StateMachine {
  constructor(initialState = 'idle') {
    this.currentState = initialState;
    this.previousState = null;
    this.states = new Map();
    this.transitions = new Map();
    this.stateTime = 0;
  }

  addState(name, onEnter = null, onUpdate = null, onExit = null) {
    this.states.set(name, { onEnter, onUpdate, onExit });
  }

  addTransition(fromState, toState, condition) {
    const key = fromState;
    if (!this.transitions.has(key)) {
      this.transitions.set(key, []);
    }
    this.transitions.get(key).push({ toState, condition });
  }

  setState(newState) {
    if (newState === this.currentState) return;

    const oldState = this.states.get(this.currentState);
    const nextState = this.states.get(newState);

    if (!nextState) {
      console.warn(`State "${newState}" does not exist`);
      return;
    }

    // Exit old state
    if (oldState && oldState.onExit) {
      oldState.onExit();
    }

    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateTime = 0;

    // Enter new state
    if (nextState.onEnter) {
      nextState.onEnter();
    }
  }

  update(deltaTime, entity, world) {
    this.stateTime += deltaTime;

    // Check transitions
    const transitions = this.transitions.get(this.currentState);
    if (transitions) {
      for (const transition of transitions) {
        if (transition.condition(entity, world)) {
          this.setState(transition.toState);
          break;
        }
      }
    }

    // Update current state
    const state = this.states.get(this.currentState);
    if (state && state.onUpdate) {
      state.onUpdate(deltaTime, entity, world);
    }
  }
}
