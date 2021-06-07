<template>
    <div :class="`screen ${isComplete || isStopped ? 'is-complete' : ''} ${isDisable ? 'is-disable' : ''}`">

        <div class="container">

            <div class="time paragraph">
                {{ time }}
            </div>

            <div class="rewind-icon">
                <ArrowsRewind />
            </div>

            <Frame ref="frame" />

            <!-- Scene is not completed -->
            <div v-if="!isComplete && !isStopped" class="screen-footer">
                <div class="call-to-action">
                    <span>{{ callToAction[lang][0] }}<ArrowDown class="arrow-down" /> </span><br /><span>{{ callToAction[lang][1] }}</span>
                </div>
                <div class="name">
                    {{ data.name }}
                </div>
            </div>

            <!-- Displayed when the scenario is completed -->
            <div v-if="isComplete && (!isFullComplete && !isStopped)" class="message-complete">
                {{ lang === 'fr' ? 'Terminé' : 'Done' }}
            </div>

            <!-- Displayed when the scenario is completed -->
            <div v-if="isComplete && !isFullComplete && !isStopped" class="screen-footer">
                <div class="call-to-action">
                    <span>{{ resultTitle[lang] }}<ArrowDown class="arrow-down" /> </span><br /><span>{{ Math.round(censorshipFactor * 100) }}%</span>
                </div>
                <div class="name">
                    {{ data.name }}
                </div>
            </div>

            <!-- Displayed only when every scenerio is completed -->
            <Stats v-if="allowStats" :id="id" ref="stats" :data="data" />

            <!-- Displayed only when every scenerio is completed -->
            <div v-if="isFullComplete" class="screen-footer">
                <div class="call-to-action">
                </div>
                <div class="name">
                    <br>
                    {{ data.name }}
                </div>
            </div>

        </div>

        <!-- Link -->
        <nuxt-link
            v-if="!isDisable && !isComplete && !isStopped"
            :to="localePath(id)"
            class="link"
            @mouseenter.native="mouseenterHandler"
            @mouseleave.native="mouseleaveHandler"
        >
            {{ lang === 'fr' ? 'Entrer' : 'Enter' }}
        </nuxt-link>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
