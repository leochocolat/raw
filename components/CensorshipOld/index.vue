<template>
    <div class="censorship" :class="isComplete ? 'is-complete' : ''">
        <div class="container">
            <div class="image-container">
                <img
                    ref="image"
                    src="https://i.picsum.photos/id/692/600/700.jpg?hmac=jmB3mH356VFvuJbVxDtTZfr-9aPpwJg4XEfFhohU7oU"
                    alt=""
                    :style="`filter: blur(${newCensorshipFactor * 10}px)`"
                />
            </div>

            <div ref="container" class="vote-container">
                <div class="caption">
                    {{ data.callToAction }}
                </div>
                <div class="control">
                    <span ref="cursor" class="cursor"></span>
                </div>
                <span class="value">{{ newCensorshipFactor.toFixed(2) }}</span>
                <div class="message">
                    {{ isSent ? 'success' : '' }}
                </div>
                <button
                    ref="buttonSubmit"
                    class="button-submit"
                    :disabled="isSent"
                    @click="clickSubmitHandler"
                >
                    {{ lang === 'fr' ? 'Valider' : 'Submit' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
