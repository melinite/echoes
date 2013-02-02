define(["jquery","underscore","backbone"],function(e,t,n){var r=n.View.extend({el:"#youtube-player-container",events:{"click .show-player":"show","click .pause":"pause","click .play":"playVideo","click .volume-down":"decreaseVolume","click .volume-up":"increaseVolume","mouseout .volume-down":"hideVolume","mouseout .volume-up":"hideVolume","mouseover .volume-down":"showVolume","mouseover .volume-up":"showVolume","mouseover .volume-meter":"showVolume"},initialize:function(){this.model.on("change:play",this.play,this),this.model.on("change:mediaOptions",this.onMediaOptionsChange,this),this.model.youtube().get("info").on("change:title",this.renderTitle,this),this.model.youtube().get("playlist").on("change:items",this.renderPlaylistInfo,this),this.visibile=!1,window.onYouTubeIframeAPIReady=t.bind(this.createPlayer,this);var e=require(["http://www.youtube.com/iframe_api?&ghost="],function(){});this.$title=this.$(".yt-media-title"),this.$info=this.$(".track-info"),this.$playlist=this.$(".playlist-info")},onPlaylistItemClick:function(t){t.preventDefault();var n=e(t.target).data("index");this.$playlist.find(".active").removeClass("active"),e(t.target).parent().addClass("active"),this.player.playVideoAt(n)},createPlayer:function(){this.player=new YT.Player("player",{height:"270",width:"300",playlist:"",playerVars:{autoplay:1,enablejsapi:1},events:{onReady:e.proxy(this.onPlayerReady,this),onStateChange:e.proxy(this.onPlayerStateChange,this)}})},renderPlaylistInfo:function(e,n){var r=e.get("id");this.mediaOptions=this.model.get("mediaOptions");var i=this.mediaOptions?parseInt(this.mediaOptions.index,10):0,s=t.map(n,function(e,t){var n='<li class="'+(t===i?"active":"")+" track-"+t+'"><a class="ellipsis" href="#play/playlist/'+r+"/"+t+'">'+(t+1)+". "+e.video.title+"</a></li>";return n});this.$playlist.html(s.join(""))},renderTitle:function(e){var t=e.get("description");t=t.replace(/([0-9][0-9]:[0-9][0-9])/gim,"\n$1","gim"),this.$title.html(e.get("title")),this.$info.html(t)},onPlayerReady:function(){this.queue&&this.play(this.queue)},onPlayerStateChange:function(e){var t=this.model.get("mediaOptions").type==="playlist"||!1,n;e.data===YT.PlayerState.PAUSED&&this.toggleNowPlaying(!1),e.data===YT.PlayerState.PLAYING&&(t&&(n=this.player.getPlaylistIndex(),this.model.set("mediaId",this.player.getPlaylist()[n]),this.model.fetchPlaylistInfo(),this.updateIndex(n)),this.model.fetchCurrentMediaInfo(),this.toggleNowPlaying(!0))},play:function(e){var t=e.get("mediaId"),n=e.get("mediaOptions");if(!this.player||!this.player.loadVideoById){this.show(),this.queue=e;return}this.player.stopVideo(),this.player.clearVideo&&this.player.clearVideo(),this.playMedia(t,n),this.$el.addClass("yt-playing"),this.show(null,"show")},onMediaOptionsChange:function(e,t){this.updateIndex(t.index||0),this.player&&this.player.playVideoAt(parseInt(t.index,10))},updateIndex:function(e){this.$playlist.find(".active").removeClass("active").end().find(".track-"+e).addClass("active"),this.model.set("currentIndex",e)},playMedia:function(e,n){var r=t.isObject(e)?e.id:e,i=n&&n.playlistId?n.playlistId:r,s=n.index?parseInt(n.index,10):0;n&&n.type==="playlist"?(this.player&&this.player.getPlaylistId()!==null&&this.player.playVideoAt(s),this.player.loadPlaylist({list:i,index:s,playlist:"playlist"})):this.player.loadVideoById(r)},playPlaylist:function(e){this.player.loadPlaylist(e)},pause:function(e){e.preventDefault(),this.player.pauseVideo()},playVideo:function(e){e&&e.preventDefault(),this.player.playVideo()},decreaseVolume:function(e){e&&e.preventDefault(),this.updateVolume(this.player.getVolume()-5)},increaseVolume:function(e){e&&e.preventDefault(),this.updateVolume(this.player.getVolume()+5)},updateVolume:function(e){e<0&&(e=0),e>=100&&(e=100),this.player.setVolume(e),this.showVolume(),this.$el.find(".volume-meter").html(Math.round(Math.abs(e)))},hideVolume:function(e){this.$el.addClass("hide-volume")},showVolume:function(e){this.$el.removeClass("hide-volume")},toggleNowPlaying:function(e){this.$el.toggleClass("yt-playing",e)},show:function(e,t){e&&e.preventDefault(),!this.visible||t==="show"?(this.$el.addClass("show-youtube-player"),this.visible=!0):this.hide(e)},hide:function(e){e&&e.preventDefault(),this.$el.removeClass("show-youtube-player"),this.visible=!1}});return r});