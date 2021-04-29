<template>
    <div class="screen-active">
        <Screen :id="scene.id" class="screen" :data="scene" />
        <Censorship class="image-blur" :data="scene" />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
