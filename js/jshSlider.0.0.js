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
                  moveLang = slider.maxLang * ( _this.current - 1 );
                  if (_this.moveStep >= moveLang ) {
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
            clearAnimation: function() {
              this.current = 1;
              this.moveStep = 0;
            }
          }

          return new _animation();
        };
        var _slider_ = null;
        var stop = false;
        var start = function( ) {
          
            fn(_slider_);
           stop = flase;
        }

        var stop = function(  ) {
          stop = true;
        }
        
        window.start = start;
        window.stop = stop;

        var instance = null;

        var fn = function(_slider) {

          instance = instance || animation(_slider);
          
          var timer = null;
          function _animation() {

            if(instance.isStop()) {
              if(instance.current == _slider.count) {
                // window.clearTimeout(timer);
                instance.clearAnimation();
              }
              instance.current = instance.current + 1;
              instance.action(function(left) {
                var ele = document.getElementById("oUlplay");
                ele.style.left = -left + "px";
              });
              timer = window.setTimeout(arguments.callee, _slider.stepTime);
            }
            
            if ( stop ) {
              window.clearTimeout(timer);
            };
            
          };

          timer = window.setTimeout(_animation, _slider.stepTime);
        }
        var JshSlider = (function() {

          var JshSlider = function(slider) {

            return new JshSlider.fn.init(slider);
          };

          JshSlider.fn = JshSlider.prototype = {
            constructor : JshSlider,
            init : function(_slider) {
              _slider.moveStep = _slider.width / _slider.animationTime;
              _slider.maxLang = _slider.width;
              fn(_slider);
              _slider_ = _slider;
            }
          }

          return JshSlider;
        })();

        window.JshSlider = JshSlider;

      })();
      JshSlider({
        count : 4,
        width : 960,
        height : 400,
        name : "name1",
        stepTime : 1000,
        animationTime : 100
      });
      
      function over( num ) {
        window.stop();
      }
      function out( num ) {
        window.start();
      }