<template>
    <div class="preloader">

        <PreloaderScreens ref="preloaderScreens" />

        <div ref="loadingMessage" class="loading-message">
            {{ lang === 'fr' ? 'Chargement...' : 'Loading...' }}
        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
