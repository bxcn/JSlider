(function(window) {
  // 匿名函数立即执行
  var domJs = domJs || (function() {

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

(function(domJs) {

  var animation = function(slider) {
    var animation = function(slider) {
      this.slider = slider;
      this.stop = true;
      this.moveWidth = slider.width;
    }
    animation.prototype = {
      constructor : animation,
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

    return new animation(slider);
  };

  var domJs = domJs;
  var JshSlider = (function() {

    var JshSlider = function(slider) {
      return new JshSlider.fn.init(slider);
    }

    JshSlider.fn = JshSlider.prototype = {
      constructor : JshSlider,
      init : function(slider) {

        var that = this;
        that.timer = null;
        that.start = true;
        that.current = 0;
        that.speed = 1;
        that.width = slider.width;
        that.count = slider.count;

        that.stepTimer = slider.stepTime || 2000;
        ;
        that.animationTime = slider.animationTime || 200;

        that.ele = document.getElementById(slider.moverBox);
        that.id = document.getElementById(slider.sliderBox);

        that.moveStep = slider.width / (that.animationTime / 10);
        slider.moveStep = that.moveStep

        that.slider = slider;

        that.instance = animation(slider);

        this.timer = window.setTimeout(function() {
          that.startAction()
        }, 3000);

        if(!slider.mouseover) {
          this.mouseover(this, that.id);
        }

        if(slider.left && slider.right) {
          this.mouseover(this, domJs.getId(slider.left));
          this.mouseover(this, domJs.getId(slider.right));
        }

        return this;
      },
      action : function(that) {
        if(that.instance.isStop()) {
          that.instance.action(function(moveX) {
            var left = parseFloat(that.ele.style.left || 0);
            if((that.width * that.count - that.moveStep) <= Math.abs(left)) {
              left = 0;
              that.current = 0;
              that.btnList(that.current);
            } else {
              left = (left + that.speed * moveX );
            }
            that.ele.style.left = left + "px";
          });

        }
      },
      startAction : function(num) {
        var that = this;
        that.num = num;
        (function action() {
          if(that.start) {
            that.speed = -1;
            that.current = that.current + 1;
            that.instance.moveWidth = 960;
            that.btnList(that.current);
            that.action(that);
          }
          this.timer = window.setTimeout(arguments.callee, that.stepTimer);
        })();
      },
      loadBtnArr : function() {
        var list = document.getElementById("playBox").getElementsByTagName("li");
        var btnArr = [];
        for(var i = 0, len = list.length; i < len; i++) {
          var className = list[i] && (list[i].className || list[i].getAttribute("class")) || "";
          if(className.indexOf(this.slider.item) > -1) {
            btnArr.push(list[i]);
          }
        }
        return btnArr;
      },
      btnReady : true,
      btnArray : [],
      btnList : function(current) {

        var className, btn;
        current = current || this.current;
        if(this.btnReady) {
          this.btnArray = this.loadBtnArr();
          this.btnReady = false;
        }

        for(var i = 0, len = this.btnArray.length; i < len; i++) {

          btn = this.btnArray[i];
          className = btn.className || btn.getAttribute("class");

          if(i == current) {
            className = className + " " + this.slider.on;
          } else {
            className = className.replace(this.slider.on, "");
          }
          if ( btn.className ) {
            btn.className = className;
          } else {
            btn.setAttribute("class", className);
          }
        }

      },
      moveStart : function() {
        this.start = true;
      },
      moveStop : function() {
        this.start = false;
      },
      mouseover : function(that, id) {

        domJs.addEvent(id, "mouseover", function() {
          that.moveStop();
        });
        domJs.addEvent(id, "mouseout", function() {
          that.moveStart();
        });
      },
      click : function(num) {

        if(this.current == num || num < 0) {
          return;
        }
        if((this.current < num && this.speed > 0) || (this.current > num && this.speed < 0 )) {
          this.speed *= -1;
        }

        this.instance.moveWidth = Math.abs(this.current - num) * 960;
        this.current = num;

        this.btnList();
        this.action(this);
      },
      left : function() {
        this.click(this.current - 1);
      },
      right : function() {
        this.click(this.current + 1);
      }
    }
    JshSlider.fn.init.prototype = JshSlider.fn;
    return JshSlider;
  })();
  window.JshSlider = JshSlider;
})(domJs);

