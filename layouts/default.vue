<template>
    <div class="default">
        <Webgl v-if="isReady" />
        <Preloader />
        <!-- <nav>
            <nuxt-link :to="localePath('/')">Home</nuxt-link>
            <nuxt-link :to="localePath('about')">About</nuxt-link>
        </nav> -->
        <nuxt v-if="isReady" />
    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss"></style>
