(function(window) {
  // 匿名函数立即执行
  var domJs = (function() {

    var readyList, readyState = false, DOMContentLoaded, document = window.document, rootDomJs,
    // domJs函数返回的是一个new对象 可以在它的上面定义静态方法，只有一份
    domJs = function(selector) {
      return new domJs.fn.init(selector);
    };

    domJs.fn = domJs.prototype = {
      constructor : domJs,
      init : function(selector) {

        // 验证是否传过来的seletor是function\
        // rootDomJs = domJs(document)
        // 实现调用方法：
        // domJs(function(){
        //   这里是匿名函数体
        // });
        if( typeof selector === "function") {
          return rootDomJs.ready(selector);
        }
        return this;
      },
      ready : function(fn) {
        // 当第一个函数加载起来时才会调用bindReady函数体，并且只调用一次
        domJs.bindReady();
        // 把fn都存到数组中
        readyList.done(fn);
      }
    };
    domJs.fn.init.prototype = domJs.fn;

    /////////////////////////////////////以下定义的方法都静态方式/////////////////////////////////////////////////////

    /*
    * Dom解析完成后执行，并且只执行一次
    */
    domJs.ready = function() {
      if(!!readyState) {
        return false;
      }
      readyState = true;
      readyList.actionCallBack();
    }

    domJs._Deferred = function() {
      var callback = [], deferred = {
        done : function(fn) {
          // 把所以加载到DomJs中的函数都放到callback数组中缓存
          callback.push(fn);
        },
        // 执行所以加载到DomJs对角中的函数
        actionCallBack : function() {
          for(var i = 0, len = callback.length; i < len; i++) {
            callback[i].call(this);
          }
        }
      }
      return deferred;
    }

    domJs.bindReady = function() {

      // 只执行一次
      if(readyList) {
        return;
      }
      // 第一次执行时
      readyList = domJs._Deferred();

      // 以下函数体只执行一次
      if(document.readyState === "complete") {
        return setTimeout(domJs.ready, 1);
      }

      if(document.addEventListener) {
        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
        window.addEventListener("load", domJs.ready, false);
      }

      if(document.attachEvent) {
        document.attachEvent("onreadystatechange", DOMContentLoaded);
        window.attachEvent("onload", domJs.ready);

      }
    }
    domJs.addEvent = function(el, type, fn) {

      if(window.addEventListener) {
        el.addEventListener(type, fn, false);
      } else if(window.attachEvent) {
        el.attachEvent("on" + type, fn);
      } else {
        el["on" + type] = fn;
      }
    }
    domJs.getId = function(id) {
      return document.getElementById(id);
    }
    // 定义DOMContentLoaded 当DOM解析完成后调用函数， 解除DOMContentLoaded绑定并且调用domJs.ready()
    if(document.addEventListener) {
      DOMContentLoaded = function() {
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        domJs.ready();
      };

    } else if(document.attachEvent) {
      DOMContentLoaded = function() {
        if(document.readyState === "complete") {
          document.detachEvent("onreadystatechange", DOMContentLoaded);
          domJs.ready();
        }
      };
    }

    // rootDomJs = domJs(document) 支持以下调用方式
    // 实现调用方法：
    // domJs(function(){
    //   这里是匿名函数体
    // });
    rootDomJs = domJs(document);

    return domJs;

  })();

  window.domJs = domJs;

})(window);

(function() {
  var animation = function(slider) {
    var slider = slider;
    var isStop = true;
    var _animation = function() {
      this.current = 1;
      this.moveStep = 1;
    }
    _animation.prototype = {
      constructor : _animation,
      action : function(fn) {
        var timer = null;
        var _this = this;
        var moveLang = 0;
        if(isStop) {
          (function _animation() {
            moveLang = slider.maxLang * (_this.current - 1 );
            if(_this.moveStep >= moveLang) {
              window.clearTimeout(timer);
              _this.moveStep = moveLang;
              isStop = true;
            } else {
              isStop = false;
              _this.moveStep = _this.moveStep + slider.moveStep;
              timer = window.setTimeout(arguments.callee, 1);
            }
            fn.call(_this, _this.moveStep);
          })();
        }
      },
      isStop : function() {
        return isStop;
      },
      clearAnimation : function() {
        this.current = 1;
        this.moveStep = 0;
      }
    }

    return new _animation();
  };

  window.animation = animation;
})();

(function(domJs) {

  var action = function(slider) {

    var timer = null;
    var stop = false;
    var step = slider.stepTime;
    var instance = instance || animation(slider);

    ////////////////////////////////////////////////////////////////////////////////////
    function action() {
      if(instance.isStop() && !stop) {

        if(instance.current == slider.count) {
          instance.clearAnimation();
        }

        instance.current = instance.current + 1;
        instance.action(function(left) {
          var ele = document.getElementById("oUlplay");
          ele.style.left = -left + "px";
        });

        timer = window.setTimeout(arguments.callee, step);
      } else {
        window.clearTimeout(timer);
      }
    }

    function startAction() {

      timer = window.setTimeout(action, step);
    }

    ////////////////////////////////////////////////////////////////////////////////////
    startAction();

    var eventStart = function() {
      stop = false;
      startAction();
    };
    var eventStop = function() {
      stop = true;
    };

    if(slider.addEvent && slider.addEvent.length == 2) {
      var sliderId = domJs.getId(slider.sliderBox);
      domJs.addEvent(sliderId, slider.addEvent[0], eventStop);
      domJs.addEvent(sliderId, slider.addEvent[1], eventStart);
    }
    return {
      start : function() {
        start();
      },
      stop : function() {
        stop();
      }
    }
  };

  var JshSlider = (function() {

    var JshSlider = function(slider) {

      return new JshSlider.fn.init(slider);
    };

    JshSlider.fn = JshSlider.prototype = {
      constructor : JshSlider,
      init : function(slider) {
        slider.moveStep = slider.width / slider.animationTime;
        slider.maxLang = slider.width;
        action(slider);
      }
    }

    return JshSlider;
  })();
  window.JshSlider = JshSlider;
})(domJs);

JshSlider({
  sliderBox : "playBox",
  addEvent : ["mouseover", "mouseout"],
  count : 4,
  width : 960,
  height : 400,
  name : "name1",
  stepTime : 1000,
  animationTime : 100
});
