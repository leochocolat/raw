<template>
    <div class="warning">
        <div class="container">
            <div ref="heading" class="heading">
                {{ locale === 'fr' ? 'Avertissement' : 'Warning' }}
            </div>
            <div ref="paragraph" class="paragraph">
                {{ data }}
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
