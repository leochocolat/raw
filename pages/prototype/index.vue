<template>
    <div class="page-home">

        <Menu
            ref="menu"
            :data="home.fields"
            :scene-entries="sceneEntries"
        />

        <TheEnd v-if="isComplete || isStopped" :data="home.fields.sectionEnd.fields" :scene-entries="sceneEntries" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
