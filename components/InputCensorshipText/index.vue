<template>
    <div class="input-censorship-text">

        <!-- Label -->
        <div class="label">
            <ArrowDown class="arrow-down" /><br>
            <label for="censorship-text">{{ label2 }}</label>
        </div>

        <div class="text-area-container">

            <textarea
                id="censorship-text"
                ref="textarea"
                rows="1"
                name="censorship-text"
                autocomplete="off"
                class="text-area"
                :placeholder="scene.instruction2"
                @input="inputHandler"
                @keydown="textareaKeydownHandler"
            >
            </textarea>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
