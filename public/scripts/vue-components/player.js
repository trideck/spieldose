"use strict";

var vTemplatePlayer = function () {
    return `
    <div id="player" class="container is-fluid box">
        <p id="player-cover-header" v-if="playerData.isPlaying" class="title is-6 is-marginless has-text-centered has-text-light"><span class="icon is-small"><i class="fa fa-music" aria-hidden="true"></i></span> NOW PLAYING <span class="icon is-small"><i class="fa fa-music" aria-hidden="true"></i></span></p>
        <p id="player-cover-header" v-else-if="playerData.isPaused" class="title is-6 is-marginless has-text-centered has-text-light"><span class="icon is-small"><i class="fa fa-pause" aria-hidden="true"></i></span> PAUSED <span class="icon is-small"><i class="fa fa-pause" aria-hidden="true"></i></span></p>
        <p id="player-cover-header" v-else class="title is-6 is-marginless has-text-centered has-text-light"><span class="icon is-small"><i class="fa fa-stop" aria-hidden="true"></i></span> STOPPED <span class="icon is-small"><i class="fa fa-stop" aria-hidden="true"></i></span></p>
        <img id="player-cover" v-bind:src="coverSrc" />
        <div id="player-cover-footer">
            <p><span>{{ nowPlayingTitle }}</span> <span v-show="nowPlayingLength"> {{ nowPlayingLength }}</span></p>
            <p>
                <span v-if="nowPlayingArtist"><a class="title is-6 is-marginless has-text-centered has-text-light" v-if="nowPlayingArtist" v-bind:src="'#/artist/' + nowPlayingArtist ">{{ nowPlayingArtist }}</a></span>
                <span v-else></span>
                <span v-if="nowPlayingArtistAlbum">{{ nowPlayingArtistAlbum + nowPlayingYear  }}</span>
                <span v-else></span>
            </p>
        </div>
        <!--
            audio visualizer https://github.com/anonymousthing/audio-visualizer
        -->
        <canvas id="canvas" class="is-marginless is-paddingless"></canvas>
        <audio id="player-audio" ref="player" controls preload="none" class="is-marginless">
            <source v-bind:src="streamUrl" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <div id="player-controls" class="is-unselectable">
            <div class="columns">
                <div class="column is-2"><i v-on:click.prevent="playerData.loadRandomTracks(32);" title="refresh random playlist" class="fa fa-refresh fa-lg"></i></div>
                <div class="column is-2"><i title="shuffle" class="fa fa-random fa-lg" v-on:click.prevent="playerData.toggleShuffleMode();" v-bind:class="{ 'player-active-control': shuffle }"></i></div>
                <div class="column is-2"><i title="previous track" v-on:click.prevent="playerData.playPreviousTrack();" class="fa fa-backward fa-lg"></i></div>
                <div class="column is-2"><i title="next track" v-on:click.prevent="playerData.playNextTrack();" class="fa fa-forward fa-lg"></i></div>
                <div class="column is-2"><i title="mark as loved song" class="fa fa-heart fa-lg"></i></div>
                <div class="column is-2"><i title="download song" v-on:click.prevent="playerData.download();" class="fa fa-save fa-lg"></i></div>
            </div>
        </div>
        <spieldose-menu-component></spieldose-menu-component>
    </div>
    `;
}

var player = Vue.component('spieldose-player-component', {
    template: vTemplatePlayer(),
    data: function () {
        return ({
            playing: false,
            url: "",
            nowPlayingTrack: null,
            playList: [],
            repeat: false,
            shuffle: false,
            autoPlay: true,
        });
    },
    props: ['playerData'],
    computed: {
        isPlaying: function () {
            return (this.playerData.isPlaying || this.playerData.isPaused);
        },
        coverSrc: function () {
            if ((this.playerData.isPlaying || this.playerData.isPaused) && this.playerData.actualTrack.image) {
                return (this.playerData.actualTrack.image);
            } else {
                return ('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAIAAAAP3aGbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAhESURBVHhe7dCBAAAAAICg/akXKYQKAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBgwIABAwYMGDBQA1T5AAHVwlcsAAAAAElFTkSuQmCC');
            }
        },
        streamUrl: function () {
            if (this.playerData.isPlaying) {
                return ("/api/track/get/" + this.playerData.actualTrack.id);
            } else {
                return ("");
            }
        },
        nowPlayingTitle: function () {
            if (this.playerData.isPlaying || this.playerData.isPaused) {
                if (this.playerData.actualTrack.title) {
                    return (this.playerData.actualTrack.title);
                } else {
                    return("track title unknown");
                }
            } else {
                return ("track title");
            }
        },
        nowPlayingLength: function () {
            if (this.playerData.isPlaying || this.playerData.isPaused) {
                if (this.playerData.actualTrack.playtimeString) {
                    return ("(" + this.playerData.actualTrack.playtimeString + ")");
                } else {
                    return ("(00:00)");
                }
            } else {
                return("(track length)");
            }
        },
        nowPlayingArtist: function () {
            if (this.playerData.isPlaying || this.playerData.isPaused) {
                if (this.playerData.actualTrack.artist) {
                    return (this.playerData.actualTrack.artist);
                } else {
                    return ("artist unknown");
                }
            } else {
                return ("artist");
            }
        },
        nowPlayingArtistAlbum: function () {
            if (this.playerData.isPlaying || this.playerData.isPaused) {
                if (this.playerData.actualTrack.album) {
                    return (" / " + this.playerData.actualTrack.album);
                } else {
                    return ("album unknown");
                }
            } else {
                return("album");
            }
        },
        nowPlayingYear: function () {
            if (this.playerData.isPlaying || this.playerData.isPaused) {
                if (this.playerData.actualTrack.year) {
                    return (" (" + this.playerData.actualTrack.year + ")");
                } else {
                    return ("(year unknown)");
                }
            } else {
                return("(year)");
            }
        }
    },
    created: function () {
        var self = this;
    },
    mounted: function () {
        var self = this;
        this.$watch('streamUrl', function () {
            if (self.streamUrl) {
                self.$refs.player.pause();
                self.$refs.player.load();
                self.$refs.player.play();
                initializeVisualizer($("canvas#canvas")[0], $("audio#player-audio")[0]);
            } else {
                self.$refs.player.pause();
            }
        });
    }
});
