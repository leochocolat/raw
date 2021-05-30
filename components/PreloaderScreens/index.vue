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
            :class="activeIndex === (index + 1) ? 'is-enable' : ''"
            :data="item"
        />

        <Warning
            ref="warning"
            class="screen"
            :class="activeIndex === data.context.length + 1 ? 'is-enable' : ''"
            :data="data.warning"
        />

        <Tutorial
            ref="intro"
            class="screen"
            :class="activeIndex === data.context.length + 2 ? 'is-enable' : ''"
            :data="data.tutorial1"
        />

        <Tutorial
            ref="instructions"
            class="screen"
            :class="activeIndex === data.context.length + 3 ? 'is-enable' : ''"
            :data="data.tutorial2"
        />

        <Tutorial
            ref="stop"
            class="screen"
            :class="activeIndex === data.context.length + 4 ? 'is-enable' : ''"
            :data="data.tutorial3"
        />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
