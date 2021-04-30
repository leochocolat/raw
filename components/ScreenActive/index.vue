<template>
    <div class="screen-active">

        <div class="container">

            <div class="time paragraph">
                {{ time }}
            </div>

            <Frame ref="frame" />

            <div class="screen-footer">
                <div class="call-to-action">
                    <span>Censure</span>
                </div>
                <div class="name">
                    {{ scene.name }}
                </div>
            </div>

            <Censorship class="censorship" :data="scene" />

        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
