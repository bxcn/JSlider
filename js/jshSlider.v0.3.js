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
var list = null;
(function() {
  var animationSort = function(way) {
    var animationSort = function(way) {
      this.way = way;
    }
    animationSort.prototype = {
      constructor : animationSort,
      action : function(current, toCurrent) {
        this["action"+this.way](current, toCurrent);
      },
      sort : [0, 1, 2, 3],
      actionLeft : function(current, toCurrent) {
        current = current;
        toCurrent = toCurrent;

        var one = list.eq(current);
        var two = list.eq(toCurrent);
        one.after(two);
      }
    }
    return new animationSort(way);
  };
  window.animationSort = animationSort;
})();

domJs(function() {
  // list = $("#oUlplays").find("li");
  // animationSort("Left").action(4,3);
  // animationSort("Left").action(3,4);
  // animationSort("Left").action(2,3);
});

(function() {
  var animation = function(slider) {
    var _animation = function(slider) {
      this.slider = slider;
      this.stop = true;
      this.moveWidth = 960;
    }
    _animation.prototype = {
      constructor : _animation,
      action : function(fn) {
        var moveStep = 0;
        var timer = null;
        var _this = this;
        if(this.stop) {
          (function _animation() {

            moveStep += slider.moveStep;

            if(moveStep >= _this.moveWidth) {
              _this.stop = true;
              window.clearTimeout(timer);
              _this.moveStep = _this.moveWidth;
              //console.log(_this.moveWidth);
            } else {
              _this.stop = false;
              timer = window.setTimeout(arguments.callee, 10);
            }
            fn.call(_this, slider.moveStep);
          })();
        }
      },
      isStop : function() {
        return this.stop;
      }
    }

    return new _animation(slider);
  };

  window.animation = animation;
})();

(function(domJs) {

  var action = function(slider) {

    var timer = null;
    var stop = false;
    var step = slider.stepTime;
    var instance = instance || animation(slider);
    var ele = document.getElementById(slider.moverBox);
    var speed = 1;
    var current = 0;
    var autoPlay = true;
    var _num = 0;
    ////////////////////////////////////////////////////////////////////////////////////
    function startAction() {
      (function action() {
        if(stop) {
          window.clearTimeout(timer);
        } else {

          if(instance.isStop()) {

            if(autoPlay) {
              speed = -1;
              current = current + 1;
              instance.moveWidth = 960;

            } else {
                 instance.moveWidth = Math.abs(current - _num) * 960;
                 current = _num;
            }
            if(current >= slider.count+1) {
                console.log(current)
                current = 1;
                ele.style.left = "0px";
            }

            instance.action(function(left) {
            
              var _left = parseFloat(ele.style.left || 0);
              ele.style.left = (_left + speed * left ) + "px";
            });
            
            
          }
          timer = window.setTimeout(arguments.callee, step);

        }
      })();
    }

    ////////////////////////////////////////////////////////////////////////////////////
    instance.moveWidth = 960;
    timer = window.setTimeout(startAction, step);
    var eventStart = function() {
      stop = false;
      autoPlay = true;
      timer = window.setTimeout(startAction, step);
    };
    var eventStop = function() {
      stop = true;
      autoPlay = false;
      window.clearTimeout(timer);
    };

    if(slider.addEvent && slider.addEvent.length == 2) {
      var sliderId = domJs.getId(slider.sliderBox);
      domJs.addEvent(sliderId, slider.addEvent[0], eventStop);
      domJs.addEvent(sliderId, slider.addEvent[1], eventStart);
    }
    var tag = function(num) {
      
      if(current == num) {
        return;
      }
      if((current < num && speed > 0) || ( current > num && speed < 0 )) {
        speed *= -1;
      }
      _num = num;

      stop = false;
      startAction();
      stop = true;
    };

    return {
      start : function() {
        eventStart();
      },
      stop : function() {
        eventStop();
      },
      tag : function(num) {

        tag(num);
      }
    }
  };

  var JshSlider = (function() {

    var JshSlider = function(slider) {

      return new JshSlider.fn.init(slider);
    };

    JshSlider.fn = JshSlider.prototype = {
      constructor : JshSlider,
      action : null,
      init : function(slider) {
        slider.moveStep = slider.width / (slider.animationTime / 10);
        slider.maxLang = slider.width;
        this.action = action(slider);
        return this;
      },
      tag : function(num) {

        this.action.tag(num);
        return this;
      }
    }
    JshSlider.fn.init.prototype = JshSlider.fn;
    return JshSlider;
  })();
  window.JshSlider = JshSlider;
})(domJs);

var jshSlider = JshSlider({
  sliderBox : "playBox",
  moverBox : "oUlplay",
  addEvent : ["mouseover", "mouseout"],
  count : 4,
  width : 960,
  height : 400,
  name : "name1",
  stepTime : 2000,
  animationTime : 100
});
// JshSlider({
// sliderBox : "playBoxs",
// moverBox : "oUlplays",
// addEvent : ["mouseover", "mouseout"],
// count : 4,
// width : 960,
// height : 400,
// name : "name1",
// stepTime : 500,
// animationTime : 200
// });

function tagShow(num) {
  jshSlider.tag(num);
}
