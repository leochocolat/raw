<template>
    <div class="the-end">

        <div class="introduction">

            <h1 class="title">
                <RichText :document="data.introduction" />
            </h1>

        </div>

        <ul class="blocks-list">

            <li v-for="(item, index) in data.blocksQuotes" :key="index" class="blocks-list-item">

                <BlockQuotes :data="item" :class="index % 2 === 0 ? '' : 'right' " />

            </li>

        </ul>

        <div class="conclusion">

            <div class="conclusion-content">
                <RichText :document="data.conclusion" />
            </div>

        </div>

        <div class="credits-container">

            <Credits :data="data.credits.fields" />

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
