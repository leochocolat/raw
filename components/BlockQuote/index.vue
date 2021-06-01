<template>
    <div class="block-quote">

        <div class="header">

            <div class="title">
                {{ data.authorName }},<br>
                {{ data.authorProfession }}
            </div>

            <div class="line"></div>

        </div>

        <RichText class="text" :document="data.content" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
