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

    elem: null,

    elemStartPos: null,

    elemMaxPos: null,

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

        that.elemStartPos = that.getOffset(that.elem);
        that.limiterPos = that.getOffset(that.limiter);
        that.elem.style.width = that.elem.offsetWidth + 'px';

        that.__createEmulator();

        that.process();

        $(window).scroll(function() {
            that.process();
        });
    },

    process: function() {
        var that = this,
            elem = that.elem,
            elemWidth,
            elemHeight,
            elemStartPos,
            elemMaxTopPos,
            limiter = that.limiter,
            limiterHeight,
            limiterPos,
            elMaxBottomPos,
            scrollTop,
            state;

        elemWidth = elem.offsetWidth;
        elemHeight = elem.offsetHeight;
        elemStartPos = that.elemStartPos;
        elemMaxTopPos = elemStartPos.top;
        limiterHeight = limiter.offsetHeight;
        limiterPos = that.limiterPos;
        elMaxBottomPos = limiterPos.top + limiterHeight;
        scrollTop = that.getScrollTop();

        if (scrollTop > elemMaxTopPos) {
            if (scrollTop + elemHeight > elMaxBottomPos) {
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
            el = that.elem,
            elNext = el.nextSibling,
            elParent = el.parentNode,
            emulator;

        emulator = document.createElement('div');
        emulator.style.width = that.elem.offsetWidth + 'px';
        emulator.style.height = that.elem.offsetHeight + 'px';
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
            $el = $(that.elem);

        switch (state) {
            case 'fixed':
                $el.addClass(states.fixed)
                    .removeClass(states.normal +' '+ states.bottom);
                break;

            case 'bottom':
                $el.addClass(states.bottom)
                    .removeClass(states.normal +' '+ states.fixed);
                break;

            case 'normal':
            default:
                $el.addClass(states.normal)
                    .removeClass(states.fixed +' '+ states.bottom);
                break;
        }
    }
};