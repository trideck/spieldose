"use strict";

var vTemplateDashboard = function () {
    return `
    <!-- dashboard template inspired by daniel (https://github.com/dansup) -->
    <section v-show="section == '#/dashboard'" class="section" id="section-dashboard">
        <div class="columns is-mobile is-multiline">
            <spieldose-chart v-bind:type="'topTracks'" v-bind:title="'Top played tracks'"></spieldose-chart>
            <spieldose-chart v-bind:type="'topArtists'" v-bind:title="'Top artists'"></spieldose-chart>
            <spieldose-chart v-bind:type="'topGenres'" v-bind:title="'Top genres'"></spieldose-chart>
        </div>
        <div class="columns is-mobile is-multiline">
            <spieldose-chart-recent v-bind:type="'recentlyAdded'" v-bind:title="'Recently added'"></spieldose-chart-recent>
            <spieldose-chart-recent v-bind:type="'recentlyPlayed'" v-bind:title="'Recently played'"></spieldose-chart-recent>
            <div class="column is-one-third-desktop is-full-mobile">
                <section class="panel">
                    <p class="panel-heading"><span class="icon"><i v-if="xhr" class="fa fa-cog fa-spin fa-fw"></i><i v-else class="fa fa-line-chart"></i></span> Play stadistics</p>
                    <p class="panel-tabs">
                        <a class="is-active" href="#">by hour</a>
                        <a href="#" v-on:click.prevent="">by weekday</a>
                        <a href="#" v-on:click.prevent="">by month</a>
                        <a href="#" v-on:click.prevent="">by year</a>
                    </p>
                    <div class="panel-block">
                        <div id="chart3">
                            <canvas id="play_metrics_chart" width="400" height="105"></canvas>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </section>
    `;
}

var dashboard = Vue.component('spieldose-dashboard', {
    template: vTemplateDashboard(),
    data: function () {
        return ({
            xhr: false
        });
    },
    props: [
        'section',
    ], mounted: function () {
        /*
        var self = this;
        var d = {};
        self.xhr = true;
        jsonHttpRequest("POST", "/api/metrics/play_stats", d, function (httpStatusCode, response) {
            self.xhr = false;
            var d = [ 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for (var i = 0; i < response.metrics.length; i++) {
                d[response.metrics[i].hour] = response.metrics[i].total;
            }
            var ctx = document.getElementById("play_metrics_chart");
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                    datasets: [
                        {
                            "label": "by hour",
                            "data": d,
                            "fill": true,
                            "borderColor": "rgb(75, 192, 192)",
                            "lineTension": 0.1
                        }
                    ]
                }, options: {}
            });
        });
        */
    }, created: function () {
    }, methods: {
    }
});