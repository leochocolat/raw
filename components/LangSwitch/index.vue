<template>
    <div class="lang-switch">
        <div class="container">
            <nuxt-link :to="switchLocalePath('fr')" class="link">
                Fr
            </nuxt-link><span class="pipe">|</span><nuxt-link
                :to="switchLocalePath('en')"
                class="link"
            >&nbsp;En
            </nuxt-link>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
