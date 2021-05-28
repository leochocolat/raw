import * as THREE from 'three';

class AnimationComponent {
    constructor(options) {
        this.model = options.model;
        this.animations = options.animations;
        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this._setupMixer(options.skinnedMesh);

        if (this.animations.length > 0) {
            for (let index = 0; index < this.animations.length; index++) {
                const animation = this.animations[index];
                this._setupMultipleAnimations(animation, animation.name, index);
            }
        } else {
            this._setupSingleAnimation(this.animations, this.animations.name);
        }

        this._activateAllActions();
    }

    /**
     * Public
     */
    playAnimation(options) {
        this.currentAnim = options.animation.getClip();

        if (!options.loop) {
            options.animation.clampWhenFinished = true;
            options.animation.loop = THREE.LoopOnce;
        }

        this._setWeight(options.animation, 1.0);

        options.animation.paused = false;
        options.animation.play();
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

    setAnimationProgress(options) {
        options.animation.play();
        options.animation.paused = true;

        const duration = this.currentAnim ? this.currentAnim.duration : options.animation.getClip().duration;
        const progress = duration * options.progress;
        options.animation.time = progress;
    }

    getAnimationProgress(options) {
        return options.animation.time;
    }

    getCurrentAnim() {
        return this.currentAnim.name;
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

    _setupMultipleAnimations(action, actionName, animationNumber) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations[animationNumber]);
        this.actions.push(this.actionType[actionName]);
    }

    _setupSingleAnimation(action, actionName) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations);
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
            action.play();
            action.paused = true;
        });
    }
}

export default AnimationComponent;
