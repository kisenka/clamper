function Clamper(options) {
    var that = this,
        option;

    if (typeof options == 'object') {
        for (option in options) {
            if (option in that) {
                that[option] = options[option];
            }
        }
    }

    that.init(options);
}

Clamper.prototype = {

    el: null,

    elStartPos: null,

    elMaxPos: null,

    limiter: null,

    limiterPos: null,

    emulator: null,

    states: {
        normal: 'clamp_normal',
        fixed: 'clamp_fixed',
        bottom: 'clamp_bottom'
    },

    init: function(options) {
        var that = this;

        that.elStartPos = that.getOffset(that.el);
        that.limiterPos = that.getOffset(that.limiter);
        that.el.style.width = that.el.offsetWidth + 'px';

        that.__createEmulator();

        $(window).scroll(function() {
            that.process();
        });
    },

    process: function() {
        var that = this,
            el = that.el,
            elWidth,
            elHeight,
            elStartPos,
            elMaxTopPos,
            limiter = that.limiter,
            limiterHeight,
            limiterPos,
            elMaxBottomPos,
            scrollTop,
            state;

        elWidth = el.offsetWidth;
        elHeight = el.offsetHeight;
        elStartPos = that.elStartPos;
        elMaxTopPos = elStartPos.top;
        limiterHeight = limiter.offsetHeight;
        limiterPos = that.limiterPos;
        elMaxBottomPos = limiterPos.top + limiterHeight;
        scrollTop = that.getScrollTop();

        if (scrollTop > elMaxTopPos) {
            if (scrollTop + elHeight > elMaxBottomPos) {
                state = 'bottom';
            }
            else {
                state = 'fixed';
            }
        }
        else {
            state = 'normal';
        }

        that.setState(state);
    },

    refresh: function() {
        var that = this;
    },

    getScrollTop: function() {
        return $(window).scrollTop();
    },

    getOffset: function(obj) {
        return $(obj).offset();
    },

    __createEmulator: function() {
        var that = this,
            el = that.el,
            elNext = el.nextSibling,
            elParent = el.parentNode,
            emulator;

        emulator = document.createElement('div');
        emulator.style.width = that.el.offsetWidth + 'px';
        emulator.style.height = that.el.offsetHeight + 'px';
        emulator.style.display = 'none';

        if (elNext) {
            elParent.insertBefore(emulator, elNext);
        } else {
            elParent.appendChild(emulator);
        }
        return emulator;
    },

    setState: function(state) {
        var that = this,
            states = that.states,
            $el = $(that.el);

        switch (state) {
            case 'fixed':
                $el.addClass(states.fixed)
                    .removeClass(states.top +' '+ states.bottom);
                break;

            case 'bottom':
                $el.addClass(states.bottom)
                    .removeClass(states.top +' '+ states.fixed);
                break;

            case 'normal':
            default:
                $el.addClass(states.top)
                    .removeClass(states.fixed +' '+ states.bottom);
                break;
        }
    }
};