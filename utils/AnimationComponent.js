import * as THREE from 'three';

class AnimationComponent {
    constructor(model, skinnedMesh) {
        this.model = model;
        this.animations = this.model.animations;
        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this._setupMixer(skinnedMesh);

        for (let index = 0; index < this.animations.length; index++) {
            const animation = this.animations[index];
            this._setupAnimations(animation, animation.name, index);
        }

        this._activateAllActions();
    }

    /**
     * Public
     */
    playAnimation(options) {
        this.currentAnim = options.animation.getClip().name;
        options.animation.play();
        if (options.loopOnce) {
            options.animation.clampWhenFinished = true;
            options.animation.loop = THREE.LoopOnce;
        }
    }

    pauseAnimation(action) {
        action.pause();
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

    /**
     * Private
     */

    _setupMixer(skinnedMesh) {
        this.mixer = new THREE.AnimationMixer(skinnedMesh || this.model.scene);
    }

    _setupAnimations(action, actionName, animationNumber) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations[animationNumber]);
        this.actions.push(this.actionType[actionName]);
    }

    _setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    _activateAllActions(action, actionWeight) {
        this.actions.forEach((action) => {
            this._setWeight(action, 1.0);
        });
    }
}

export default AnimationComponent;
