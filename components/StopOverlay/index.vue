<template>
    <div class="stop-overlay">

        <div class="container">

            <Frame class="frame" />

            <RichText class="text" :document="data" />

            <div ref="buttonContainer" class="buttons-container">
                <button class="button" @click="clickYesHandler">
                    {{ lang === 'fr' ? 'Oui' : 'Yes' }}
                </button>
                <button class="button" @click="clickNoHandler">
                    {{ lang === 'fr' ? 'Non' : 'No' }}
                </button>
            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
