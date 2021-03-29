<template>
    <div class="default">
        <client-only>
            <Webgl v-if="!isPrototype && (isReady || isDebug)" />
        </client-only>

        <Preloader />

        <!-- <nav>
            <nuxt-link :to="localePath('/')">Home</nuxt-link>
            <nuxt-link :to="localePath('about')">About</nuxt-link>
        </nav> -->

        <nuxt />
    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss"></style>
