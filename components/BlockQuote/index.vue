<template>
    <div class="block-quote">

        <div class="header">

            <div ref="title" class="title">
                {{ data.authorName }},<br>
                {{ data.authorProfession }}
            </div>

            <div ref="line" class="line"></div>

        </div>

        <RichText ref="text" class="text" :document="data.content" />

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
