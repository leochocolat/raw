<template>
    <div class="prototype" @click="clickHandler">
        <Warning ref="screen1" :data="data.warning" />
        <Tutorial ref="screen2" :data="data.tutorial1" />
        <Tutorial ref="screen3" :data="data.tutorial2" />
        <Menu ref="screen4" />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
