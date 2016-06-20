$(function() {
    var sourceArr = [
        'images/bg_1.png',
        'images/gear_lg.png',
        'images/gear_md.png',
        'images/gear_sm.png',
        'images/milestone.png',
        'images/roll_film.png',
        'images/title_1.png',
        'images/door_1.png',
        'images/doorframe_1.png',
        'images/gif_title_1.png',
        'images/illustration_1.gif',
        'images/hand.png',
        'images/title_2.png',
        'images/door_2.png',
        'images/doorframe_2.png',
        'images/gif_title_2.png',
        'images/illustration_2.gif'
    ];
    var sourceArr2 = [
        'images/title_3.png',
        'images/door_3.png',
        'images/doorframe_3.png',
        'images/gif_title_3.png',
        'images/illustration_3.gif',
        'images/title_4.png',
        'images/door_4.png',
        'images/doorframe_4.png',
        'images/gif_title_4.png',
        'images/illustration_4.gif',
        'images/airplane.png',
        'images/invitation_1.png',
        'images/invitation_2.png',
        'images/invitation_3.png',
        'images/invitation_4.png',
        'images/invitation.png',
        'images/time_address.png',
        'images/btn_share.png',
        'images/btn_back.png',
        'images/bg_2.jpg'
    ];
    new mo.Loader(sourceArr, {
        loadType: 1,
        onLoading: function (count, total) {
            var percentage = parseInt(count / total * 100);
            progress(percentage);
        },
        onComplete: function (time) {
            progress(100);
            var $loading = $('#loading'),
                $wrapper = $('#wrapper');
            $wrapper.html($('#tpl').html());
            $loading.removeClass('active');
            setTimeout(function() {
                $loading.addClass('hide');
                $wrapper.addClass('active');
                $wrapper.find('.page-2').css('background-image', 'url(images/illustration_1.gif)');
                $wrapper.find('.page-4').css('background-image', 'url(images/illustration_2.gif)');
                initListener();
                setTimeout(function () {
                    $wrapper.find('.page-1 .hand').addClass('moving');
                }, 2000);
            }, 300);

            new mo.Loader(sourceArr2, {
                loadType: 1,
                onComplete: function (time) {
                    $wrapper.find('.page-6').css('background-image', 'url(images/illustration_3.gif)');
                    $wrapper.find('.page-8').css('background-image', 'url(images/illustration_4.gif)');
                }
            });
        }
    });

    var flipTimeout;
    var handTimeout;

    // 进度
    function progress(percentage) {
        $('#load_text').text(percentage + '%');
    }

    // 返回角度
    function getSlideAngle(dx, dy) {
      return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    function getSlideDirection(startX, startY, endX, endY) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;

        // 如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }
        var angle = getSlideAngle(dx, dy);
        if (angle >= -45 && angle < 45) {
            result = 4;
        } else if (angle >= 45 && angle < 135) {
            result = 1;
        } else if (angle >= -135 && angle < -45) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    }

    // 初始化事件监听
    function initListener () {
        var $container = $('#container'),
            $audio = $('#audio'),
            $music = $('#music'),
            audio = $audio[0];
        audio.src = 'bgm.mp3';
        audio.play();

        var startX,
            startY,
            moveEndX,
            moveEndY;

        $container.on('touchstart', function (e) {
            e.preventDefault();
            startX = e.changedTouches[0].pageX,
            startY = e.changedTouches[0].pageY;
        });
        $container.on('touchmove', function (e) {
            e.preventDefault();
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
        });
        $container.on('touchend', function (e) {
            var $gear_wrap = $('#gear_wrap'),
                $gear_progress = $('#gear_progress'),
                $oldActive = $container.find('.active'),
                $newActive;

            var direction = getSlideDirection(startX, startY, moveEndX, moveEndY);
            switch (direction) {
            case 0:
                return;
            // 向上、向左
            case 1:
            case 3:
                var next = $oldActive.data('next');
                $newActive = $('.' + next);
                break;
            // 向下、向右
            case 2:
            case 4:
                var prev = $oldActive.data('prev');
                if (prev == null || prev == 'null') {
                    return;
                }
                $newActive = $('.' + prev);
                break;
            default:
                return;
            }

            clearTimeout(flipTimeout);
            clearTimeout(handTimeout);

            var isDoor = $oldActive.data('door');
            if (isDoor) {
                var $door = $oldActive.find('.door');
                switch (direction) {
                // 向上
                case 1:
                    $door.css('top', '-15%');
                    break;
                // 向下
                case 2:
                    $door.css('top', '49%');
                    break;
                // 向左
                case 3:
                    $door.css('left', '-34%');
                    break;
                // 向右
                case 4:
                    $door.css('left', '36%');
                    break;
                }
                setTimeout(function () {
                    flipPage($oldActive, $newActive, $gear_wrap, $gear_progress);
                }, 500);
            } else {
                flipPage($oldActive, $newActive, $gear_wrap, $gear_progress);
            }
        });

        // 播放背景音乐
        $audio.on('play', function (e) {
            $music.addClass('playing')
        });
        $audio.on('pause', function (e) {
            $music.removeClass('playing')
        });
        $music.on('touchstart', function (e) {
            $music.hasClass('playing') ? audio.pause() : audio.play();
        });

        // 拆开邀请函
        $('#invitation').on('touchstart', function (e) {
            $(this).addClass('hide');
            $('#time_address').removeClass('hide');
        });

        // 分享发布会
        $('#btn_share').on('touchstart', function (e) {
            $('#share_wrap').removeClass('hide');
        });
        $('#share_wrap').on('touchstart', function (e) {
            $(this).addClass('hide');
        });

        // 返回观看
        $('#btn_back').on('touchstart', function (e) {
            var $end_wrap = $('#end_wrap'),
                $firstPage = $container.find('.page-1');
            $end_wrap.removeClass('active');
            $firstPage.removeClass('hide');
            $('#gear_progress').css('margin-left', '0%');
            $('#milestone').text('2008');
            $('#invitation').removeClass('hide');
            $('#time_address').addClass('hide');
            setTimeout(function () {
                $firstPage.addClass('active');
                $end_wrap.addClass('hide');
            }, 500);
            setTimeout(function () {
                $end_wrap.find('.airplane').removeClass('fly-up flying');
                $end_wrap.find('.invitation-sm, .invitation').removeClass('flying');
                $end_wrap.find('.btn').removeClass('active');
            }, 4000);
        });
    }

    // 翻页
    function flipPage($oldActive, $newActive, $gear_wrap, $gear_progress) {
        if (!$oldActive.hasClass('end')) {
            $gear_wrap.removeClass('pause');
        }
        $oldActive.removeClass('active');
        $newActive.removeClass('hide');
        $oldActive.find('.hand').removeClass('moving');
        $newActive.find('.hand').removeClass('moving');

        $('#milestone').text($newActive.data('year') || '');
        var left = $newActive.data('left');
        if (left) {
            $gear_progress.css('margin-left', left);
        }

        flipTimeout = setTimeout(function () {
            $gear_wrap.addClass('pause');
            $oldActive.addClass('hide');
            $newActive.addClass('active');
            $('#container').find('.door').removeAttr('style');
            handTimeout = setTimeout(function () {
                $newActive.find('.hand').addClass('moving');
            }, $newActive.data('door') ? 2000 : 4000);

            if ($newActive.hasClass('end-wrap')) {
                var $airplane = $newActive.find('.airplane');
                $airplane.addClass('fly-up');
                setTimeout(function () {
                    $airplane.removeClass('fly-up').addClass('flying');
                    var $invitation1 = $newActive.find('.invitation-1');
                    var $invitation2 = $newActive.find('.invitation-2');
                    var $invitation3 = $newActive.find('.invitation-3');
                    var $invitation4 = $newActive.find('.invitation-4');
                    $newActive.find('.invitation-1').addClass('fly-down');
                    setTimeout(function () {
                        $invitation1.removeClass('fly-down').addClass('flying');
                    }, 1000);
                    setTimeout(function () {
                        $newActive.find('.invitation-2').addClass('fly-down');
                        setTimeout(function () {
                            $invitation2.removeClass('fly-down').addClass('flying');
                        }, 1000);
                    }, 600);
                    setTimeout(function () {
                        $newActive.find('.invitation-3').addClass('fly-down');
                        setTimeout(function () {
                            $invitation3.removeClass('fly-down').addClass('flying');
                        }, 1000);
                    }, 1200);
                    setTimeout(function () {
                        $newActive.find('.invitation-4').addClass('fly-down');
                        setTimeout(function () {
                            $invitation4.removeClass('fly-down').addClass('flying');
                        }, 1000);
                    }, 1800);
                    setTimeout(function () {
                        $('#invitation').addClass('fly-in');
                        setTimeout(function () {
                            $('#invitation').removeClass('fly-in').addClass('flying');
                        }, 1000);
                    }, 2300);
                    setTimeout(function () {
                        $('#end_wrap').find('.btn').addClass('active');
                    }, 3300);
                }, 1600);
            }
        }, 500);
    }
});