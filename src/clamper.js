// TODO: optimize onscroll event
// TODO: refresh method

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

    scope: null,

    scopePos: null,

    emulator: null,

    cssClasses: {
        elem: 'clamper',
        emulator: 'clamper-emulator',
        state_normal: 'state_normal',
        state_fixed: 'state_fixed',
        state_bottom: 'state_bottom'
    },

    currentState: null,

    init: function(options) {
        var that = this;

        // preparing
        that.__prepare();

        that.process();

        $(window).scroll(function() {
            that.process();
        });
    },

    __prepare: function() {
        var that = this,
            emulator;

        // needed for fixed state
        that.elem.style.width = that.elem.offsetWidth + 'px';

        // add an clamper CSS class name
        $(that.elem).addClass(that.cssClasses.elem);

        // initial settings
        that.elemStartPos = that.__getOffset(that.elem);
        that.scopePos = that.__getOffset(that.scope);

        emulator = that.__createEmulator();
        that.emulator = emulator;
    },

    __getScrollTop: function() {
        return $(window).scrollTop();
    },

    __getOffset: function(obj) {
        return $(obj).offset();
    },

    __createEmulator: function() {
        var that = this,
            elem = that.elem,
            elemNext = elem.nextSibling,
            elemParent = elem.parentNode,
            emulator;

        emulator = document.createElement('div');
        emulator.className = that.cssClasses.emulator;
        emulator.style.width = that.elem.offsetWidth + 'px';
        emulator.style.height = that.elem.offsetHeight + 'px';
        emulator.style.display = 'none';
        emulator.style.visibility = 'visible';
        emulator.style.float = $(elem).css('float');

        if (elemNext) {
            elemParent.insertBefore(emulator, elemNext);
        } else {
            elemParent.appendChild(emulator);
        }
        return emulator;
    },

    process: function() {
        var that = this,
            elem = that.elem,
            elemWidth,
            elemHeight,
            elemStartPos,
            elemMaxTopPos,
            limiter = that.scope,
            limiterHeight,
            limiterPos,
            elemMaxBottomPos,
            scrollTop,
            state;

        elemWidth = elem.offsetWidth;
        elemHeight = elem.offsetHeight;
        elemStartPos = that.elemStartPos;
        elemMaxTopPos = elemStartPos.top;
        limiterHeight = limiter.offsetHeight;
        limiterPos = that.scopePos;
        elemMaxBottomPos = limiterPos.top + limiterHeight;
        scrollTop = that.__getScrollTop();

        if (scrollTop > elemMaxTopPos) {
            if (scrollTop + elemHeight > elemMaxBottomPos) {
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

    setState: function(state) {
        var that = this,
            cssClasss,
            $el, $emulator;

        if (that.currentState == state) {
            return false;
        }

        cssClasss = that.cssClasses;
        $el = $(that.elem);
        $emulator = $(that.emulator);

        switch (state) {
            case 'fixed':
                $el.addClass(cssClasss.state_fixed)
                    .removeClass(cssClasss.state_normal +' '+ cssClasss.state_bottom);

                $emulator.addClass(cssClasss.state_fixed)
                    .removeClass(cssClasss.state_normal +' '+ cssClasss.state_bottom)
                    .show();
                break;

            case 'bottom':
                $el.addClass(cssClasss.state_bottom)
                    .removeClass(cssClasss.state_normal +' '+ cssClasss.state_fixed);

                $emulator.addClass(cssClasss.state_bottom)
                    .removeClass(cssClasss.state_normal +' '+ cssClasss.state_fixed)
                    .show();
                break;

            case 'normal':
            default:
                $el.addClass(cssClasss.state_normal)
                    .removeClass(cssClasss.state_fixed +' '+ cssClasss.state_bottom);

                $emulator.addClass(cssClasss.state_normal)
                    .removeClass(cssClasss.state_fixed +' '+ cssClasss.state_bottom)
                    .hide();
                break;
        }

        that.currentState = state;
    }
};