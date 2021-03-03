import * as THREE from 'three';

class AnimationComponent {
    constructor(model) {
        this.model = model;
        this.animations = this.model.animations;
        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this._setupMixer();

        for (let index = 0; index < this.model.animations.length; index++) {
            const animation = this.model.animations[index];
            this._setupAnimations(animation, animation.name, index);
        }

        this._activateAllActions();
    }

    _setupMixer() {
        this.mixer = new THREE.AnimationMixer(this.model.scene);
    }

    _setupAnimations(action, actionName, animationNumber) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations[animationNumber]);
        this.actions.push(this.actionType[actionName]);
    }

    _activateAllActions(action, actionWeight) {
        this.actions.forEach((action) => {
            this._setWeight(action, 1.0);
        });
    }

    pauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = true;
        });
    }

    unPauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = false;
        });
    }

    _setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    playAnimation(action) {
        this.currentAnim = action.getClip().name;

        action.play();
    }

    pauseAnimation(action) {
        action.pause();
    }

    animFade(startAction, endAction, defaultDuration, notRestarting) {
        if (notRestarting) {
            endAction.loop = THREE.LoopOnce;
            endAction.clampWhenFinished = true;
        }

        this.unPauseAllActions();
        this.setWeight(endAction, 1);
        endAction.time = 0;
        startAction.crossFadeTo(endAction, defaultDuration, true);

        this.playAnimation(endAction);
    }

    getCurrentAnim() {
        return this.currentAnim;
    }

    update(delta) {
        this.mixer.update(delta);
    }
}

export default AnimationComponent;
