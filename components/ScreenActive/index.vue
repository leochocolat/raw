<template>
    <div class="screen-active">
        <Screen
            class="screen"
            :name="locale === 'fr' ? 'Couloir' : 'Hallway'"
        />
        <ImageBlur class="image-blur" />
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
