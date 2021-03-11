<template>
    <div class="imageblur">
        <img
            src="https://i.picsum.photos/id/692/600/700.jpg?hmac=jmB3mH356VFvuJbVxDtTZfr-9aPpwJg4XEfFhohU7oU"
            alt=""
        />
        <img
            src="https://i.picsum.photos/id/1018/600/700.jpg?hmac=3DoUFqEWtTk1fxub3ABBymYGlfiXOC52wMLmnx1K1MQ"
            alt=""
        />
        <div ref="container" class="blur__container">
            <div class="control"></div>
            <span ref="cursor" class="cursor"></span>
            <span class="value">{{ blurValue }}</span>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
