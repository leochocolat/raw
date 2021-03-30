<template>
    <div class="prototype" @click="clickHandler">
        <Warning
            ref="screen1"
            :class="activeIndex === 0 ? 'is-enable' : ''"
            :data="data.warning"
        />
        <Tutorial
            ref="screen2"
            :class="activeIndex === 1 ? 'is-enable' : ''"
            :data="data.tutorial1"
        />
        <Tutorial
            ref="screen3"
            :class="activeIndex === 2 ? 'is-enable' : ''"
            :data="data.tutorial2"
        />
        <Menu ref="screen4" :class="activeIndex === 3 ? 'is-enable' : ''" />
        <ScreenActive
            ref="screen5"
            :class="activeIndex === 4 ? 'is-enable' : ''"
        />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
