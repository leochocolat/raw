<template>
    <div class="cookies">
        <div class="container">
            <div ref="paragraph" class="paragraph">
                {{ data }}
            </div>

            <button ref="button" class="button" @click="clickHandler">
                {{ lang === 'fr' ? `J'accepte` : 'Agreed' }}
            </button>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
