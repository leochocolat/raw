<template>
    <div class="preloader-screens">

        <Cookies
            ref="screen0"
            class="screen"
            :class="activeIndex === 0 ? 'is-enable' : ''"
            :data="data.cookieMessage"
        />

        <Warning
            ref="screen1"
            class="screen"
            :class="activeIndex === 1 ? 'is-enable' : ''"
            :data="data.warning"
        />

        <Tutorial
            ref="screen2"
            class="screen"
            :class="activeIndex === 2 ? 'is-enable' : ''"
            :data="data.tutorial1"
        />

        <Tutorial
            ref="screen3"
            class="screen"
            :class="activeIndex === 3 ? 'is-enable' : ''"
            :data="data.tutorial2"
        />

        <Tutorial
            ref="screen4"
            class="screen"
            :class="activeIndex === 4 ? 'is-enable' : ''"
            :data="data.tutorial3"
        />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
