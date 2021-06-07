<template>
    <div class="preloader">

        <PreloaderScreens v-if="isFontReady" ref="preloaderScreens" :key="key" :data="data" />

        <div ref="loadingMessage" class="loading-message">
            {{ lang === 'fr' ? 'Chargement...' : 'Loading...' }}
        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
