<template>
    <button class="button-sound" @click="clickHandler">
        {{ soundLabel[lang] }}
        <span class="state" :class="isMuted ? 'is-muted' : ''">
            {{ isMuted ? 'off' : 'on' }}
        </span>
    </button>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
