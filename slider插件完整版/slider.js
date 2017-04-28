/**
 * Created by Administrator on 2017/4/27 0027.
 */

/* 封装插件写法（如JQ） */
(function () {
    window.Slider = function Slider(argsJSON) {     //构造一个window下的Slider属性函数
        if(!argsJSON.ID){
            throw new Error('对不起，传入的参数中必须有ID');     //抛出错误
            return;
        }
        this.carousel = document.getElementById(argsJSON.ID);
        this._init();
        // console.log(this.carousel);     //1、打印出id为“你为carousel属性赋值的ID名”的DOM节点（未加入插件并实例化时，此值为null）
        // console.log('===================== 以上：打印出id为“carousel”的DOM节点');
        // // * 代表DOM所有的tagName
        // var elems = document.getElementsByTagName('*');
        // console.log(elems);     //2、打印出DOM所有的节点
        // console.log('===================== 以上：打印出DOM所有的节点');
        this.leftBtn = this._findClassName('leftBtn')[0];       //获取左按钮元素
        // console.log(this.leftBtn);      //3、打印出左按钮节点
        // console.log('===================== 以上：打印出左按钮节点');
        this.rightBtn = this._findClassName('rightBtn')[0];
        this.imageList = this._findClassName('imageList')[0];
        this.imageLis = this.imageList.getElementsByTagName('li');
        // console.log(this.imageLis);      //li数组
        this.interval = 30;
        this.idx = 0;
        this.autoplayinterval = argsJSON.autoplayinterval;
        this._autoplay();
        this._btnplay();
        //缓冲公式
        this.tween = function (t,b,c,d) {       //实现的是切换效果，这里的所有时间只跟切换效果时图的位置有关
            return c * t / d + b;       //返回的是：这一帧这张图所在的位置！
        };
    }  ;

    Slider.prototype._init = function () {
        this.carousel.innerHTML = ["<div class='btns'>",
            "<a href='javascript:;' class='leftBtn' id='leftBtn'>&lt;</a>",
            "<a href='javascript:;' class='rightBtn' id='rightBtn'>&gt;</a>",
            "</div>",
            "<div class='imageList'>",
            "<ul>",
            "<li class='first'><a href='#'><img src='images/0.jpg' alt='' /></a></li>",
            "<li><a href='#'><img src='images/1.jpg' alt='' /></a></li>",
            "<li><a href='#'><img src='images/2.jpg' alt='' /></a></li>",
            "<li><a href='#'><img src='images/3.jpg' alt='' /></a></li>",
            "</ul>",
            "</div>"].join('');     //html文档放入数组并转成字符串！
        // console.log(this.carousel);
    };
    
    //获取DOM
    //在原型上面加 _ 下划线是约定俗成的仅供内部调用
    Slider.prototype._findClassName = function (className) {
        var elems = this.carousel.getElementsByTagName('*');
        var arr = [];
        for(var i=0; i<elems.length; i++){
            //console.log(elems[i].className);        //4、打印D出id为“carousel”的DOM节点下所有的类名（没类名的就不打印）
            if(elems[i].nodeType == 1 && elems[i].className.indexOf(className) != -1){      // nodeType == 1为元素
                arr.push(elems[i]);
            }
        }
        //console.log('===================== 以上：打印D出id为“carousel”的DOM节点下所有的类名');
        return arr;
    };

    Slider.prototype._next = function () {
        // this.imageLis[0].style.left = '-600px';
        // this._animate(this.imageLis[0], 0, -600, 1000);
        // this._animate(this.imageLis[1], 600, 0, 1000);

        if(this.timer){     //当切换动画的定时器不为null，即正在切换时，“return”后面的程序都不执行，直接结束此“_next”函数
            return;     //满足if条件，return返回值，这个返回值是和函数的类型有关的，函数的类型是什么，他的返回值就是什么【return后面的语句不会执行，我们可以用“return;”来结束程序】
        }
        //当上一次切换动画结束后，我们再调用“_animate”函数进行下一组合图片的切换动画！
        var oldidx = this.idx;
        this.idx++;
        if(this.idx > this.imageLis.length - 1){
            this.idx = 0;
        }
        this._animate([{        // _next() 方法只针对两张图，所以只有两个对象，即两张图为一个组合，没有涉及的其他图动完后均不再动！
                'obj' : this.imageLis[oldidx],
                'start' : 0,
                'target' : -600
            },
            {
                'obj' : this.imageLis[this.idx],
                'start' : 600,
                'target' : 0
            }
        ],1000);        //这个切换动画一秒后结束！
    };

    Slider.prototype._animate = function (arr, time) {
        var self = this;
        var currentFrame = 0;
        var maxFame = parseInt(time / this.interval);   //总帧数
        // var totalVariation = target - start;    //最终位置-开始位置=总变化量
        this.timer = setInterval(function () {      //定时器1触发后影响的是：换图的方式是缓冲切换（即缓冲开始）
            currentFrame++;
            if(currentFrame >= maxFame){
                clearInterval(self.timer);
                self.timer = null;
            }
            for(var i=0; i<arr.length; i++){
                arr[i].obj.style.left = self.tween(currentFrame, arr[i].start, arr[i].target - arr[i].start, maxFame) + 'px';
            }

        },this.interval);       //this.interval影响的是缓冲切换的流畅度（越大越卡顿，越小越流畅），内置！
    };
    
    Slider.prototype._autoplay = function () {
        var self = this;
        this.timer2 = setInterval(function () {     //定时器2触发后影响的是：图要换了
            self._next();
        },this.autoplayinterval);       //this.autoplayinterval影响的是换图的间隔时间，由使用插件的人在外部设定！
    }

    /* 下面自己实现左右按钮 */
    Slider.prototype._btnplay = function () {
        var self = this;
        //左按钮，实现上一张
        this.leftBtn.onclick = function () {
            if(self.timer){     //当切换动画的定时器不为null，即正在切换时，“return”后面的程序都不执行，直接结束此“_next”函数
                return;     //满足if条件，return返回值，这个返回值是和函数的类型有关的，函数的类型是什么，他的返回值就是什么【return后面的语句不会执行，我们可以用“return;”来结束程序】
            }
            //当上一次切换动画结束后，我们再调用“_animate”函数进行下一组合图片的切换动画！
            var oldidx = self.idx;
            self.idx--;
            if(self.idx < 0){
                self.idx = self.imageLis.length-1;
            }
            self._animate([{        // _next() 方法只针对两张图，所以只有两个对象，即两张图为一个组合，没有涉及的其他图动完后均不再动！
                'obj' : self.imageLis[oldidx],
                'start' : 0,
                'target' : 600
            },
                {
                    'obj' : self.imageLis[self.idx],
                    'start' : -600,
                    'target' : 0
                }
            ],1000);        //这个切换动画一秒后结束！
        };
        this.leftBtn.onmouseover = function () {
            self._clearautoplay();
        };
        this.leftBtn.onmouseout = function () {
            self._autoplay();
        };
        
        //右按钮，实现下一张
        this.rightBtn.onclick = function () {
            self._next();
        };
        this.rightBtn.onmouseover = function () {
            self._clearautoplay();
        };
        this.rightBtn.onmouseout = function () {
            self._autoplay();
        };
    };

    Slider.prototype._clearautoplay = function () {
        clearInterval(this.timer2);
    };
   
})();