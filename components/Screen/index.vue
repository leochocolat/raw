<template>
    <div
        class="screen"
        @mouseenter="mouseenterHandler"
        @mouseleave="mouseleaveHandler"
        @click="clickHandler"
    >
        <div class="container">
            <div class="time paragraph">
                {{ time }}
            </div>
            <Frame ref="frame" />
            <div class="screen-footer">
                <div class="call-to-action">
                    <span>
                        {{ callToAction[lang][0]
                        }}<ArrowDown class="arrow-down" /> </span
                    ><br /><span>{{ callToAction[lang][1] }}</span>
                </div>
                <div class="name">
                    {{ data.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
