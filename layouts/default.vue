<template>
    <div class="default">

        <!-- Canvas Sizer -->
        <div ref="canvasSizeHelper" class="canvas-size-helper"></div>

        <!-- WebGL -->
        <client-only>
            <Webgl />
        </client-only>

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
