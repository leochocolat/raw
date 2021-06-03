<template>
    <div class="block-quotes">

        <p class="heading">
            {{ data.fields.title }}
        </p>

        <div class="content">

            <ul class="quotes-list">

                <li v-for="(item, index) in data.fields.quotes" :key="index" class="quotes-list-item">
                    <BlockQuote :data="item.fields" />
                </li>

            </ul>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
