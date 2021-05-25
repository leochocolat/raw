<template>
    <div class="menu">
        <div class="screens-container">
            <div class="vertical"></div>
            <div class="horizontal"></div>
            <Screen
                :id="sceneEntries['hallway'].id"
                :data="sceneEntries['hallway']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['library'].id"
                :data="sceneEntries['library']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['supermarket'].id"
                :data="sceneEntries['supermarket']"
                class="screen"
            />
            <Screen
                :id="sceneEntries['bar'].id"
                :data="sceneEntries['bar']"
                class="screen"
            />
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
