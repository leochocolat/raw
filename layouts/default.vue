<template>
    <div class="default">
        <client-only>
            <Webgl v-if="!isPrototype && (isReady || isDebug)" />
        </client-only>

        <Preloader />

        <!-- i18n router link Example -->
        <!-- <nav>
            <nuxt-link :to="localePath('/')">Home</nuxt-link>
            <nuxt-link :to="localePath('about')">About</nuxt-link>
        </nav> -->

        <div class="main-container">
            <nuxt />
        </div>

        <TheFooter />
    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss"></style>
