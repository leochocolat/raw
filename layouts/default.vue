<template>
    <div class="default">

        <!-- WebGL -->
        <client-only>
            <Webgl />
        </client-only>

        <!-- Canvas Sizer -->
        <div ref="canvasSizeHelper" class="canvas-size-helper js-canvas-size-helper"></div>

        <!-- Nuxt App -->
        <Nuxt />

        <!-- Preloader -->
        <Preloader ref="preloader" />

        <!-- Footer -->
        <TheFooter ref="footer" />

        <StopOverlay :data="globalCopy.stopConfirmation" />
    </div>
</template>

<script src="./default/script.js"></script>
<style src="./default/style.scss" lang="scss"></style>
