<template>
    <div class="menu">
        <div class="screens-container">
            <Screen
                v-for="(item, key) in sceneEntries"
                :id="item.id"
                :key="key"
                :data="item"
                class="screen"
            />

            <!-- <Screen
                class="screen"
                :name="locale === 'fr' ? 'Couloir' : 'Hallway'"
            />
            <Screen
                class="screen"
                :name="locale === 'fr' ? 'Supermarché' : 'Supermarket'"
            />
            <Screen
                class="screen"
                :name="locale === 'fr' ? 'Bibliothèque' : 'Library'"
            /> -->
            <!-- <Screen class="screen" :name="locale === 'fr' ? 'Bar' : 'Bar'" /> -->
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
