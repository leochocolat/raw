<template>
    <div class="warning">
        <div class="container">
            <div class="heading">
                {{ locale === 'fr' ? 'Avertissement' : 'Warning' }}
            </div>
            <div class="paragraph">
                {{ data }}
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
