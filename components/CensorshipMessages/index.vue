<template>
    <div ref="container" class="censorship-messages">

        <div ref="square" class="square"></div>

        <div ref="listContainer" class="list-container">

            <ul v-for="(list, index) in listAmountArray" :key="index" ref="list" class="messages-list">
                <li v-for="(item, id) in messages" ref="listItem" :key="id" class="messages-list-item" :class="item.delta < 0 ? 'left' : 'right' ">
                    {{ item.content[lang] }} <br>
                    <span class="id">#{{ userId(id) }}</span>
                </li>
            </ul>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
