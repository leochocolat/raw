<template>
    <div class="default">

        <!-- Canvas Sizer -->
        <div ref="canvasSizeHelper" class="canvas-size-helper"></div>

        <!-- WebGL -->
        <client-only>
            <!-- <Webgl v-if="!isPrototype && (isReady || isDebug)" /> -->
            <!-- <Webgl v-if="(isReady || isDebug)" /> -->
            <Webgl />
        </client-only>

        <!-- Nuxt App -->
        <Nuxt />

        <!-- Preloader -->
        <Preloader ref="preloader" />

        <TheFooter ref="footer" />
    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss"></style>

<!-- i18n router link Example -->
<!-- <nav>
    <nuxt-link :to="localePath('/')">Home</nuxt-link>
    <nuxt-link :to="localePath('about')">About</nuxt-link>
</nav> -->
