<template>
    <div class="input-censorship" :class="isOffRange ? 'is-off-range' : ''">

        <!-- Label -->
        <div class="label">
            <ArrowDown class="arrow-down" /><br>
            {{ label1 }}

            <div ref="successMessage" class="success-message-container">
                <div class="success-message-content">
                    <span>{{ successMessage[lang] }}</span>
                    <span>[{{ Math.round(newCensorshipFactor * 100) }}%]</span>
                </div>
            </div>
        </div>

        <div ref="range" class="censorship-range">

            <div ref="censorshipContainer" class="censorship-progress-container">
                <!-- <div class="censorship-progress" :style="`width: ${clampedDragPosition}px;`"></div> -->
                <div class="censorship-progress" :style="`width: calc(${dragRelativePosition} * 100%)`"></div>
            </div>

            <div ref="rangeLimit" class="range-limit" :style="`width: ${(maxRange * 2) * 100}%; left: ${minFactor * 100}%`">
                <Frame />
                <span class="current-censorship"> {{ Math.round(newCensorshipFactor * 100) }}%</span>
            </div>

            <div ref="cursor" class="cursor" :style="`transform: translateX(${dragPosition}px)`">
                <CursorCensorship />
            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
