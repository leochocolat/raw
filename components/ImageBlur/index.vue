<template>
    <div class="blur">
        <div class="imageContainer">
            <img
                ref="image"
                src="https://i.picsum.photos/id/692/600/700.jpg?hmac=jmB3mH356VFvuJbVxDtTZfr-9aPpwJg4XEfFhohU7oU"
                alt=""
            />
        </div>

        <div ref="container" class="vote__container">
            <div ref="" class="caption">
                Comment montreriez-vous cette image ?
            </div>
            <div class="control">
                <span ref="cursor" class="cursor"></span>
            </div>
            <span class="value">{{ blurElm.blurValue }}</span>
            <div ref="submitVoteBtn" class="submitBtn">Valider</div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
