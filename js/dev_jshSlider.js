var console = console || {
  log : function() {
  }
};
console.log();
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
      this.moveWidth = slider.totalWidth;
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
    }, expStr = /[#\.]|^[\s]*|[\s]*$/gi;

    /*
     var jshSlider = JshSlider({
     sliderBox: "#oUlplays > li",
     switchBtn: ["#switchBtn > li", ".thistitle"],
     animation: [2000, 500],
     btnList: ["left","right","top","bottom"],
     auto:true
     });
     * */
    JshSlider.fn = JshSlider.prototype = {
      constructor : JshSlider,
      init : function(slider) {

        var that = this;
        this.timer = null;
        this.start = true;
        this.current = 0;
        this.speed = 1;
        this.sliderTimeStr = "jsh_" + parseInt(Math.random(100) * 100000);

        // 解析大图
        var arr = slider.sliderBox.split(/>/);
        this.idTag = arr[0].replace(expStr, "");
        this.subTag = arr[1].replace(expStr, "");
        this.ele = domJs.getId(this.idTag);

        this.Arrs = JshSlider.stringToTag(this.idTag, this.subTag);

        var boxTagArr = JshSlider.switchTagWrapper(JshSlider.stringToTag(this.idTag, this.subTag), true, this.sliderTimeStr);

        // 图片个数
        this.count = boxTagArr.length;
        // 设置图片大小
        slider.width = parseInt(JshSlider.css(boxTagArr[0], "width"));
        slider.height = parseInt(JshSlider.css(boxTagArr[0], "height"));

        // 解析按钮
        if(!!slider.switchBtn) {

          var btnArr = slider.switchBtn[0].split(/>/);
          var btnIdTag = btnArr[0].replace(expStr, "");
          var btnSubTag = btnArr[1].replace(expStr, "");
          this.btnTagArr = JshSlider.switchTagWrapper(JshSlider.stringToTag(btnIdTag, btnSubTag), false, null);
          this.selector = slider.switchBtn[1].replace(expStr, "");

          // 给切换按钮绑定点击事件
          for(var i = 0, len = this.btnTagArr.length; i < len; i++) {
            (function(that, i) {
              var obj = that["btnTagArr"][i];
              JshSlider.mouseover(that, obj);
              JshSlider.click(that, obj, function() {
                that.clickBtn(i + 1);
              });

            })(that, i);
          };
        }

        // 设置图片切换方向
        this.initDirection = slider.direction || "left";

        // 动画时长
        this.stepTimer = slider.animation && slider.animation[0] || 2000;
        this.animationTime = slider.animation && slider.animation[1] || 200;

        // 动画移动步长
        if(slider.style == "left") {
          slider.totalWidth = parseInt(JshSlider.css(boxTagArr[0], "width"));
        } else {
          this.ele.style.width = slider.width + "px";
          this.ele.style.height = (slider.height * 2) + "px";
          this.ele.style.left = "0px";
          this.ele.style.overflow = "hidden";
          slider.totalWidth = parseInt(JshSlider.css(boxTagArr[0], "height"));
        }

        this.moveStep = slider.moveStep = slider.totalWidth / (this.animationTime / 10);
        this.slider = slider;

        // 实例化动画
        this.instance = animation(slider);

        // 初始化对象；加载完毕后第一次执行
        this.timer = window.setTimeout(function() {
          that.startAction()
        }, 3000);

        // 鼠标移动到slider图片上时停止动画事件绑定
        if(!slider.mouseover) {
          JshSlider.mouseover(that, that.ele);
        }

        // 添加向左、向右按钮的mouseover、mouseout事件
        // 绑定向左向右事件
        if(slider.btnList && slider.btnList[0] && slider.btnList[1]) {
          JshSlider.mouseover(that, domJs.getId(slider.btnList[0]));
          JshSlider.mouseover(that, domJs.getId(slider.btnList[1]));

          JshSlider.click(that, domJs.getId(slider.btnList[0]), function() {
            that.clickBtn(that.current - 1, that.slider.btnList[1]);
          });
          JshSlider.click(that, domJs.getId(slider.btnList[1]), function() {
            that.clickBtn(that.current + 1, that.slider.btnList[0]);
          });
        }

        return this;
      },
      action : function(that) {
        if(that.instance.isStop()) {
          that.instance.action(function(moveX) {
            if(that.slider.style == "left") {
              var left = parseFloat(that.ele.style.left || 0);

              if(Math.abs(left) <= Math.abs(-that.moveStep) && that.direction == "right") {
                left = that.initLeftAction();

              } else if(Math.abs(left) >= (that.slider.width - that.moveStep) && that.direction == "left") {
                
                console.log("left");
                left = that.initRightAction();

              } else {
                left = (left + that.speed * moveX );
              }
              that.ele.style.left = left + "px";
            } else {
              var top = parseFloat(that.ele.style.top || 0);
              if(Math.abs(top) <= (-that.moveStep) && that.direction == "bottom") {
                top = that.initTopAction();
              } else if(Math.abs(top) >= (that.slider.height - that.moveStep) && that.direction == "top") {
                top = that.initBottomAction();
              } else {
                top = (top + that.speed * moveX );
              }
              that.ele.style.top = top + "px";
            }
          });

        }
      },
      initLeftAction : function() {
        return 0;
      },
      initRightAction : function() {
        
        
        var arr = this.Arrs;
        console.log(this.ele.children[0]);
        this.ele.insertBefore(arr[this.current], this.ele.children[0]);
        this.direction = this.initDirection;

        return 0;
      },
      initTopAction : function() {
        return 0;
      },
      initBottomAction : function() {
        var arr = JshSlider.stringToTag(this.idTag, this.subTag);
        var layer = arr[0].nextSibling;
        this.ele.insertBefore(arr[1], arr[0]);
        this.direction = this.initDirection;
        return 0;
      },
      startAction : function(num) {
        var that = this;
        that.num = num;
        (function action() {
          if(that.start) {
            var i = (that.initDirection == "right" || that.initDirection == "bottom" ) ? -1 : 1;
            that.clickBtn(that.current + i, that.initDirection);
          }
          this.timer = window.setTimeout(arguments.callee, that.stepTimer);
        })();
      },
      setClass : function(obj, className) {
        if(obj.className) {
          obj.className = className;
        } else {
          obj.setAttribute("class", className);
        }
      },
      addClass : function(i) {
        if(!this.btnTagArr)
          return this;
        var sliderButton = this.btnTagArr[i - 1];
        var className = sliderButton.className || sliderButton.getAttribute("class");
        className = className.replace(expStr, "") + " " + this.selector;

        this.setClass(sliderButton, className);
        return this;
      },
      removeClass : function() {

        if(!this.btnTagArr)
          return this;

        var className, sliderButton;
        //  图片切换时，小按钮也对应改变
        for(var i = 0, len = this.btnTagArr.length; i < len; i++) {
          sliderButton = this.btnTagArr[i];
          className = sliderButton.className || sliderButton.getAttribute("class");
          if(className.indexOf(this.selector) > -1) {
            className = className.replace(this.selector, "");
            this.setClass(sliderButton, className);
          }
        }
        return this;
      },
      moveStart : function() {
        this.start = true;
      },
      moveStop : function() {
        this.start = false;
      },
      leftAndRightDirection : function(num, dir) {

        var arr = JshSlider.stringToTag(this.idTag, this.subTag);

        var obj = null;



        var next;
        var direction = "left";
        var left = "0px";

        if("right" == dir) {
obj = this.Arrs[this.current];
          if(this.current <= 0) {
            this.current = this.count - 1;
          } else {
            this.current--;
          }
          next = this.Arrs[this.current];

          this.speed = 1;
          direction = dir;
          left = "-" + this.slider.width + "px";
          
          this.direction = direction;
        next.parentNode.style.left = left;
        next.parentNode.insertBefore(next, obj);

        } else if("left" == dir) {
                  console.log("当前位置：" + this.current);
                  
                  
         obj = this.Arrs[this.current];
         
           if ( this.current  > 3 ) {
            this.current = 0;
          } else {
            this.current++;
          }
          next = this.Arrs[this.current];
          
          console.log("下一个位置：" + this.current);
          
          this.speed = -1;
          direction = dir;
          left = "0px";
          
          
          this.direction = direction;
        next.parentNode.style.left = left;
        next.parentNode.insertBefore(next, obj);
        }

        

      },
      topAndBottomDirection : function(num, dir) {

        var arr = JshSlider.stringToTag(this.idTag, this.subTag);
        var next = null;
        var direction = "top";
        var top = null;

        if(this.current > num) {
          this.speed = 1;
          this.current--;
          direction = "bottom";
          top = "-" + this.slider.height + "px";
          next = arr[0];

        } else if(this.current < num) {
          this.speed = -1;
          this.current++;
          direction = "top";
          top = "0px";
          next = arr[1];
        }

        if(this.current <= 0) {
          this.current = this.count;
        } else if(this.current >= (this.count + 1)) {
          this.current = 1;
        }

        if(!dir) {
          this.current = num;
        }

        this.direction = direction;
        next.parentNode.style.top = top;

        // 获取当前Dom对象
        var obj = domJs.getId(this.sliderTimeStr + this.current);
        next.parentNode.insertBefore(obj, next);

      },
      clickBtn : function(num, dir) {
        if(this.current == num) {
          return;
        }
        //btnList: ["left","right"]
        if(this.slider.style == "left") {
          // 定义排序方向
          this.leftAndRightDirection(num, dir);
        } else if(this.slider.style == "top") {
          // 定义排序方向
          this.topAndBottomDirection(num, dir);
        }
        // 执行动画
        this.action(this);
        //执行切换按钮事件
        this.removeClass().addClass(this.current);
      }
    }
    JshSlider.fn.init.prototype = JshSlider.fn;

    ////////////////////////////////////// 以下是JshSlider static Method /////////////////////////////////////////////////
    JshSlider.css = function(obj, attr) {
      if(obj.currentStyle) {
        return obj.currentStyle[attr];
        //只适用于IE
      } else if(window.getComputedStyle) {

        return getComputedStyle(obj,false)[attr];
        //只适用于FF,Chrome,Safa
      }

      return obj.style[attr];
      //本人测试在IE和FF下没有用,chrome有用
    };
    JshSlider.stringToTag = function(idTag, subTag) {
      if(arguments.length != 2)
        return false;

      var returnArr = [], j = 1;
      var id = document.getElementById(idTag);
      var idChild = id && id.childNodes;

      for(var i = 0, tag, len = idChild.length; i < len; i++) {
        tag = idChild[i];
        if(subTag.toUpperCase() == tag.nodeName) {
          returnArr.push(tag);
          j++;
        }
      }

      return returnArr;
    };
    JshSlider.switchTagWrapper = function(arr, isSetId, sliderTimeStr) {
      var j = 1;
      for(var i = 0, tag, len = arr.length; i < len; i++) {
        tag = arr[i];
        if(isSetId) {
          tag.setAttribute("id", sliderTimeStr + j);
        }
        j++;
      }
      return arr;
    };
    // 事件绑定
    JshSlider.mouseover = function(that, id) {
      domJs.addEvent(id, "mouseover", function() {
        that.moveStop();
      });
      domJs.addEvent(id, "mouseout", function() {
        that.moveStart();
      });
    };
    JshSlider.click = function(that, id, fn) {
      domJs.addEvent(id, "click", function() {
        fn.call(that);
      });
    };
    return JshSlider;
  })();
  window.JshSlider = JshSlider;
})(domJs);

