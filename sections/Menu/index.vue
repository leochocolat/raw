<template>
    <div class="menu">
        <div class="screens-container">
            <Screen
                :id="sceneEntries['hallway'].id"
                ref="screen0"
                :data="sceneEntries['hallway']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['library'].id"
                ref="screen1"
                :data="sceneEntries['library']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['supermarket'].id"
                ref="screen2"
                :data="sceneEntries['supermarket']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['bar'].id"
                ref="screen3"
                :data="sceneEntries['bar']"
                class="screen"
            />
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
