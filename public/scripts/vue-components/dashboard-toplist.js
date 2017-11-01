"use strict";

var vTemplateDashboardTopList = function () {
    return `
    <div class="column is-one-third-desktop is-full-mobile">
        <section class="panel chart">
            <p class="panel-heading"><span class="icon"><i v-if="xhr" class="fa fa-cog fa-spin fa-fw"></i><i v-else class="fa fa-list"></i></span> {{ title }}</p>
            <p class="panel-tabs">
                <a href="#" v-bind:class="{ 'is-active' : interval == 0 }" v-on:click.prevent="changeInterval(0)">All Time</a>
                <a href="#" v-bind:class="{ 'is-active' : interval == 1 }" v-on:click.prevent="changeInterval(1)">Past week</a>
                <a href="#" v-bind:class="{ 'is-active' : interval == 2 }" v-on:click.prevent="changeInterval(2)">Past month</a>
                <a href="#" v-bind:class="{ 'is-active' : interval == 3 }" v-on:click.prevent="changeInterval(3)">Past semester</a>
                <a href="#" v-bind:class="{ 'is-active' : interval == 4 }" v-on:click.prevent="changeInterval(4)">Past Year</a>
            </p>
            <div class="panel-block">
                <ol v-if="items.length > 0">
                    <li class="is-small" v-if="type == 'topTracks'" v-for="item, i in items">{{ item.title + (item.artist ? " / " + item.artist: "") }}</li>
                    <li class="is-small" v-if="type == 'topArtists'" v-for="item, i in items">{{ item.artist }}</li>
                    <li class="is-small" v-if="type == 'topGenres'" v-for="item, i in items">{{ item.genre }}</li>
                </ol>
            </div>
        </section>
    </div>
    `;
}

/* app chart (test) component */
var dashboardToplist = Vue.component('spieldose-dashboard-toplist', {
    template: vTemplateDashboardTopList(),
    data: function () {
        return ({
            xhr: false,
            iconClass: 'fa-pie-chart',
            interval: 0,
            items: []
        });
    },
    created: function () {
        this.loadChartData();
    }, methods: {
        loadChartData: function () {
            var self = this;
            self.items = [];
            var url = null;
            var d = {};
            switch (this.interval) {
                case 0:
                    break;
                case 1:
                    d.fromDate = moment().subtract(7, 'days').format('YYYYMMDD');
                    d.toDate = moment().format('YYYYMMDD');
                    break;
                case 2:
                    d.fromDate = moment().subtract(1, 'months').format('YYYYMMDD');
                    d.toDate = moment().format('YYYYMMDD');
                    break;
                case 3:
                    d.fromDate = moment().subtract(6, 'months').format('YYYYMMDD');
                    d.toDate = moment().format('YYYYMMDD');
                    break;
                case 4:
                    d.fromDate = moment().subtract(1, 'year').format('YYYYMMDD');
                    d.toDate = moment().format('YYYYMMDD');
                    break;
            }
            self.xhr = true;
            switch (this.type) {
                case "topTracks":
                    jsonHttpRequest("POST", "/api/metrics/top_played_tracks", d, function (httpStatusCode, response) {
                        self.items = response.metrics;
                        self.xhr = false;
                    });
                    break;
                case "topArtists":
                    jsonHttpRequest("POST", "/api/metrics/top_artists", d, function (httpStatusCode, response) {
                        self.items = response.metrics;
                        self.xhr = false;
                    });
                    break;
                case "topGenres":
                    jsonHttpRequest("POST", "/api/metrics/top_genres", d, function (httpStatusCode, response) {
                        self.items = response.metrics;
                        self.xhr = false;
                    });
                    break;
            }
        }, changeInterval: function (i) {
            this.interval = i;
            this.loadChartData();
        }
    },
    props: ['type', 'title']
});