<template>
    <div class="the-end">

        <div class="introduction">

            <h1 ref="introductionTitle" class="title">
                <RichText :document="data.introduction" />
            </h1>

        </div>

        <ul class="blocks-list">

            <li v-for="(item, index) in data.blocksQuotes" :key="index" ref="blocks" class="blocks-list-item">

                <BlockQuotes ref="blocksQuotes" :data="item" :class="index % 2 === 0 ? '' : 'right' " />

                <ImageWebGl ref="imageWebGl" :name="item.fields.imageName" :side="index % 2 === 0 ? 'left' : 'right'" />

            </li>

        </ul>

        <div class="conclusion">

            <div ref="conclusionContent" class="conclusion-content">
                <RichText :document="data.conclusion" />
            </div>

        </div>

        <div class="credits-container">

            <Credits ref="credits" :data="data.credits.fields" />

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
