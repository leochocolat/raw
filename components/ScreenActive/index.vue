<template>
    <div class="screen-active">
        <Screen id="hallway" class="screen" :data="sceneEntries['hallway']" />
        <Censorship class="image-blur" :data="sceneEntries['hallway']" />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
