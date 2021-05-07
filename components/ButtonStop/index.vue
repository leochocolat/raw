<template>
    <button class="button-stop" :class="isStopped ? 'is-stopped' : ''" @click="clickHandler">
        Stop
    </button>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
