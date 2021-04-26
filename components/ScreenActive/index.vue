<template>
    <div class="screen-active">
        <Screen id="bar" class="screen" :data="sceneEntries['bar']" />
        <Censorship class="image-blur" :data="sceneEntries['hallway']" />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
