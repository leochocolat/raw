<template>
    <div class="preloader-screens">

        <Cookies
            ref="cookies"
            class="screen"
            :class="activeIndex === 0 ? 'is-enable' : ''"
            :data="data.cookieMessage"
        />

        <Context
            v-for="(item, index) in data.context"
            :key="index"
            ref="context"
            class="screen"
            :data="item"
        />

        <Warning
            ref="warning"
            class="screen"
            :data="data.warning"
        />

        <Tutorial
            ref="intro"
            class="screen"
            :data="data.tutorial1"
        />

        <Tutorial
            ref="instructions"
            class="screen"
            :data="data.tutorial2"
        />

        <Tutorial
            ref="stop"
            class="screen"
            :data="data.tutorial3"
        />

        <ScreenLogo
            ref="screenLogo"
            class="screen"
        />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
