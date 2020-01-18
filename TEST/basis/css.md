# CSS

## 1. 盒模型
<details>
<summary>展开查看答案</summary>
标准盒模型（W3C盒模型）= margin(外边距) + border(边框) + padding(内边距) + content(内容)

标准盒模型 **宽度** = content(内容)  
IE盒模型 **宽度** = border(边框) + padding(内边距) + content(内容)
</details>

## 2. CSS3的新特性
<details>
<summary>展开查看答案</summary>
word-wrap 文字换行   <br /> 
text-overflow 超过指定容器的边界时如何显示  <br />
text-decoration 文字渲染  <br />
text-shadow文字阴影  <br />
gradient渐变效果  <br />
transition过渡效果 transition-duration：过渡的持续时间  <br />
transform拉伸，压缩，旋转，偏移等变换  <br />
animation动画  
</details>

## 3. CSS3选择器及优先级
<details>
<summary>展开查看答案</summary>
!important  >  <br />
内联样式style=""  >  <br />
ID选择器#id  >  <br />
类选择器/属性选择器/伪类选择器.class.active[href=""]  >  <br />
元素选择器/关系选择器/伪元素选择器html+div>span::after  >  <br />
通配符选择器*
</details>

## 4. BFC
<details>
<summary>展开查看答案</summary>
BFC（Block Formatting Context）格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。  

<h3>BFC应用</h3>

防止margin重叠
清除内部浮动
自适应两（多）栏布局
防止字体环绕

<h3>触发BFC条件</h3>

根元素
float的值不为none
overflow的值不为visible
display的值为inline-block、table-cell、table-caption
position的值为absolute、fixed

<h3>BFC的特性</h3>

内部的Box会在垂直方向上一个接一个的放置。
垂直方向上的距离由margin决定
bfc的区域不会与float的元素区域重叠。
计算bfc的高度时，浮动元素也参与计算
bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。
</details>  

## 5. div水平居中 
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
    行内元素
     <pre>
.parent {
    text-align: center;
}
    </pre>
    </li>
    <li>
    块级元素
    <pre>
.parent{
    margin: 0 auto;
}
    </pre>
    </li>
    <li>
        绝对定位定宽
         <pre>
.son {
    position: absolute;
    width: 宽度;
    left: 50%;
    margin-left: -0.5*宽度
}
        </pre>
    </li>
    <li>
        绝对定位不定宽
        <pre>
.son {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
}
        </pre>
    </li>
    <li>
    left/right: 0
    <pre>
.son {
    position: absolute;
    width: 宽度;
    left: 0;
    right: 0;
    margin: 0 auto;
}
    </pre>
    </li>
</ol>
</details>  

## 6. div垂直居中
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
    行内元素
    <pre>
.parent {
    height: 高度;
}
.son {
    line-height: 高度;
}
    </pre>
    </li>
    <li>
    table
    <pre>
.parent {
  display: table;
}
.son {
  display: table-cell;
  vertical-align: middle;
}
    </pre>
    </li>
    <li>
    flex
    <pre>
.parent {
    display: flex;
    align-items: center;
}
    </pre>
    </li>
    <li>
    绝对定位定高
    <pre>
.son {
    position: absolute;
    top: 50%;
    height: 高度;
    margin-top: -0.5高度;
}
    </pre>
    </li>
    <li>
    绝对定位不定高
    <pre>
.son {
    position: absolute;
    top: 50%;
    transform: translate( 0, -50%);
}
    </pre>
    </li>
    <li>
    top/bottom: 0;
    <pre>
.son {
    position: absolute;
    height: 高度;
    top: 0;
    bottom: 0;
    margin: auto 0;
}
    </pre>
    </li>
</ol>
</details>  

## 7. 绝对定位和相对定位
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
    absolute 绝对定位 相对于最近的已定位的祖先元素, 有已定位(指position不是static的元素)祖先元素, 以最近的祖先元素为参考标准。如果无已定位祖先元素, 以body元素为偏移参照基准, 完全脱离了标准文档流。
    </li>
    <li>
    fixed 固定定位的元素会相对于视窗来定位,这意味着即便页面滚动，它还是会停留在相同的位置。一个固定定位元素不会保留它原本在页面应有的空隙。
    </li>
    <li>
    共同点：改变行内元素的呈现方式，都脱离了文档流；不同点：absolute的”根元素“是可以设置的，fixed的“根元素”固定为浏览器窗口
    </li>
</ul>
</details>  

## 8.  Flex
<details>
<summary>展开查看答案</summary>
    <h3>
        采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称“项目”。
    </h3>

<h3><em>父元素属性</em></h3>
display  <br />
flex  <br />
定义了一个flex容器，它的直接子元素会接受这个flex环境  <br />

flex-direction<br />
row,row-reverse,column,column-reverse<br />
决定主轴的方向<br />

flex-wrap<br />
nowrap,wrap,wrap-reverse<br />
如果一条轴线排不下，如何换行<br />

flex-flow<br />
[flex-direction] , [flex-wrap]<br />
是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap<br />

justify-content<br />
flex-start,flex-end,center,space-between,space-around<br />
设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式<br />

align-items<br />
flex-start,flex-end,center,baseline,stretch<br />
设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式<br />  

<h3><em>子元素属性</em></h3>
order<br /> 
[int]<br /> 
默认情况下flex order会按照书写顺训呈现，可以通过order属性改变，数值小的在前面，还可以是负数。<br /> 

flex-grow<br /> 
[number]<br /> 
设置或检索弹性盒的扩展比率,根据弹性盒子元素所设置的扩展因子作为比率来分配剩余空间<br /> 

flex-shrink<br /> 
[number]<br /> 
设置或检索弹性盒的收缩比率,根据弹性盒子元素所设置的收缩因子作为比率来收缩空间<br /> 

flex-basis<br /> 
[length], auto<br /> 
设置或检索弹性盒伸缩基准值<br /> 

align-self<br /> 
auto,flex-start,flex-end,center,baseline,stretch<br /> 
设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式，可以覆盖父容器align-items的设置<br /> 
</details>  

## 9. 让元素消失
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
    opacity：0,该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定了一些事件，如click事件也能触发</li>
    <li>visibility:hidden,该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件</li>
    <li>display:none, 把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删掉</li>
    <li>z-index=-1置于其他元素下面</li>
</ol>
</details>  

## 10. 清除浮动
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
    在浮动元素后面添加 clear:both 的空 div 元素
    <pre>
&lt;div class="container"&gt;
    &lt;div class="left"&gt;&lt;/div&gt;
    &lt;div class="right"&gt;&lt/div&gt;
    &lt;div style="clear:both"&gt;&lt/div&gt;
&lt;/div&gt;  
    <pre>
    </li>
    <li>
    给父元素添加 overflow:hidden 或者 auto 样式，触发BFC
    <pre>
&lt;div class="container"&gt;
    &lt;div class="left"&gt;&lt;/div&gt;
    &lt;div class="right"&gt;&lt;/div&gt;
&lt;/div&gt;

.container{
    width: 300px;
    background-color: #aaa;
    overflow:hidden;
    zoom:1;   /*IE6*/
}
    <pre>
    </li>
    <li>
    使用伪元素，也是在元素末尾添加一个点并带有 clear: both 属性的元素实现的。
    <pre>
&lt;div class="container clearfix"&gt;
    &lt;div class="left"&gt;&lt;/div&gt;
    &lt;div class="right"&gt;&lt;/div&gt;
&lt;/div&gt;

.clearfix{
    zoom: 1; /*IE6*/
}
.clearfix:after{
    content: ".";
    height: 0;
    clear: both;
    display: block;
    visibility: hidden;
}
    <pre>
</ol>
</details>  

## 11. calc函数 
<details>
<summary>展开查看答案</summary>
<h3>calc函数是css3新增的功能，可以使用calc()计算border、margin、pading、font-size和width等属性设置动态值。</h3>
<pre>
#div1 {
    position: absolute;
    left: 50px;
    width: calc( 100% / (100px * 2) );
    //兼容写法
    width: -moz-calc( 100% / (100px * 2) );
    width: -webkit-calc( 100% / (100px * 2) );
    border: 1px solid black;
}
</pre>
注意点：
<ul>
    <li>需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px);</li>
    <li>calc()函数支持 "+", "-", "*", "/" 运算;</li>
    <li>对于不支持 calc() 的浏览器，整个属性值表达式将被忽略。不过我们可以对那些不支持 calc()的浏览器，使用一个固定值作为回退。</li>
</ul>
</details>  

## 12. 移动端rem
<details>
<summary>展开查看答案</summary>
em官方定义『The font size of the root element』，即根元素的字体大小。rem是一个相对的CSS单位，1rem等于html元素上font-size的大小。所以，我们只要设置html上font-size的大小，就可以改变1rem所代表的大小。

<pre>
(function () {
    var html = document.documentElement;
    function onWindowResize() {
        html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
})();
</pre>
</details>  

## 13. 移动端1px
<details>
<summary>展开查看答案</summary>
一般来说，在PC端浏览器中，设备像素比（dpr）等于1，1个css像素就代表1个物理像素；但是在retina屏幕中，dpr普遍是2或3，1个css像素不再等于1个物理像素，因此比实际设计稿看起来粗不少。
<ol>
    <li>
        伪元素+scale
    <pre>
.box{
    width: 100%;
    height: 1px;
    margin: 20px 0;
    position: relative;
}
.box::after{
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
    transform-origin: 0 0; 
    background: red;
}

&lt;div class="box"&gt;&lt;/div&gt;
    </pre>
    </li>
    <li>
    border-image
    <pre>
div{
    border-width: 1px 0px;
    -webkit-border-image: url(border.png) 2 0 stretch;
    border-image: url(border.png) 2 0 stretch;
}
    </pre>
    </li>
</ol>
</details>  

## 14. 两边宽度固定中间自适应的三栏布局
<details>
<summary>展开查看答案</summary>
圣杯布局和双飞翼布局是前端工程师需要日常掌握的重要布局方式。两者的功能相同，都是为了实现一个两侧宽度固定，中间宽度自适应的三栏布局。
<ul>
    <li>
        圣杯布局
    <pre>
body{
    min-width: 550px;
}
#container{
    padding-left: 200px;
    padding-right: 150px;
}
#container .column{
    float: left;
}
#center{
    width: 100%;
}
#left{
    width: 200px;
    margin-left: -100%;
    position: relative;
    right: 200px;
}
#right{
    width: 150px;
    margin-right: -150px;
}

&lt;div id="container"&gt;
    &lt;div id="center" class="column"&gt;center&lt;/div&gt;
    &lt;div id="left" class="column"&gt;left&lt;/div&gt;
    &lt;div id="right" class="column"&gt;right&lt;/div&gt;
&lt;/div&gt;
    </pre>
    </li>
    <li>
    双飞翼布局
    <pre>
body {
    min-width: 500px;
}
#container {
    width: 100%;
}
.column {
    float: left;
}
#center {
    margin-left: 200px;
    margin-right: 150px;
}
#left {
    width: 200px;
    margin-left: -100%;
}
#right {
    width: 150px;
    margin-left: -150px;
}

&lt;div id="container" class="column"&gt;
    &lt;div d="center"&gt;center&lt;/div&gt;
&lt;/div&gt;
&lt;div id="left" class="column"&gt;left&lt;/div&gt;
&lt;div id="right" class="column"&gt;right&lt;/div&gt;
    </pre>
    </li>
</ul>
</details>  

## 15. 伪类和伪元素
<details>
<summary>展开查看答案</summary>
css引入伪类和伪元素概念是为了格式化文档树以外的信息。也就是说，伪类和伪元素都是用来修饰不在文档树中的部分。

<ul>
    <li>
        <em>伪类</em><br />
        伪类存在的意义是为了通过选择器找到那些不存在DOM树中的信息以及不能被常规CSS选择器获取到的信息。
        <ol>
            <li>获取不存在与DOM树中的信息。比如a标签的:link、visited等，这些信息不存在与DOM树结构中，只能通过CSS选择器来获取；</li>
            <li>获取不能被常规CSS选择器获取的信息。比如：要获取第一个子元素，我们无法用常规的CSS选择器获取，但可以通过 :first-child 来获取到。</li>
        </ol><br />
        <img src="https://user-gold-cdn.xitu.io/2019/12/12/16ef8eecad4f1adb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="伪类" title="伪类"/>
    </li>
    <li>
          <em>伪元素</em><br />
          <p>
          伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。常见的伪元素有：::before，::after，::first-line，::first-letter，::selection、::placeholder等
          </p>
    </li>
    <li>
        <em>::after和:after的区别</em><br />
        <p>
        在实际的开发工作中，我们会看到有人把伪元素写成:after，这实际是 CSS2 与 CSS3新旧标准的规定不同而导致的。
        CSS2 中的伪元素使用1个冒号，在 CSS3 中，为了区分伪类和伪元素，规定伪元素使用2个冒号。所以，对于 CSS2 标准的老伪元素，比如:first-line，:first-letter，:before，:after，写一个冒号浏览器也能识别，但对于 CSS3 标准的新伪元素，比如::selection，就必须写2个冒号了。
        </p>
    </li>
</ul>
</details>  

## 16. CSS画圆半圆扇形三角梯形
<details>
<summary>展开查看答案</summary>
<pre>
div{
    margin: 50px;
    width: 100px;
    height: 100px;
    background: red;
}
/* 半圆 */
.half-circle{
    height: 50px;
    border-radius: 50px 50px 0 0;
}
/* 扇形 */
.sector{
    border-radius: 100px 0 0;
}
/* 三角 */
.triangle{
    width: 0px;
    height: 0px;
    background: none;
    border: 50px solid red;
    border-color: red transparent transparent transparent;
}
/* 梯形 */
.ladder{
    width: 50px;
    height: 0px;
    background: none;
    border: 50px solid red;
    border-color: red transparent transparent transparent;
}
</pre>
</details>  

## 17. css3实现0.5px的细线？
<details>
<summary>展开查看答案</summary>
<pre>
/* css */
.line {
    position: relative;
}
.line:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: #000000;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
}

/* html */
&lt;div class="line"&gt;&lt;/div&gt;
</pre>
</details>  

## 18. css禁用鼠标事件
<details>
<summary>展开查看答案</summary>
<pre>
.disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
</pre>
</details>  

## 19. 实现条纹网格的方式
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
    nth-child(even/odd)
    <pre>
// odd表示基数，此时选中基数行的样式，even表示偶数行
.row:nth-child(odd){
    background: #eee;
}
    </pre>
    </li>
    <li>
     nth-of-type(odd)
    <pre>
.row:nth-of-type(odd){
    background: #eee;
}
    </pre>
    </li>
    <li> 
渐变实现linear-gradient
    <pre>
.stripe-bg{
  padding: .5em;
  line-height: 1.5em;
  background: beige;
  background-size: auto 3em;
  background-origin: content-box;
  background-image: linear-gradient(rgba(0,0,0,.2) 50%, transparent 0);
}
    </pre>
    </li>
</ol>
</details>  

## 20. css禁止用户选择
<details>
<summary>展开查看答案</summary>
<pre>
body{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</pre>
</details>  

## 21. 经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用hack的技巧 ？
<details>
<summary>展开查看答案</summary>
<ol>
    <li>png24位的图片在iE6浏览器上出现背景，解决方案是做成PNG8.</li>
    <li>浏览器默认的margin和padding不同。解决方案是加一个全局的*{margin:0;padding:0;}来统一。</li>
    <li>
        IE6双边距bug:块属性标签float后，又有横行的margin情况下，在ie6显示margin比设置的大。
        浮动ie产生的双倍距离 #box{ float:left; width:10px; margin:0 0 0 100px;}
        这种情况之下IE会产生20px的距离，解决方案是在float的标签样式控制中加入 ——_display:inline;将其转化为行内属性。(_这个符号只有ie6会识别)
        渐进识别的方式，从总体中逐渐排除局部。
        首先，巧妙的使用“\9”这一标记，将IE游览器从所有情况中分离出来。
        接着，再次使用“+”将IE8和IE7、IE6分离开来，这样IE8已经独立识别。
<pre>
/*css*/
.bb{
background-color:red;/所有识别/
background-color:#00deff\9; /IE6、7、8识别/
+background-color:#a200ff;/IE6、7识别/
_background-color:#1e0bd1;/IE6识别/
}
</pre>
    </li>
    <li>
    IE下,可以使用获取常规属性的方法来获取自定义属性, 也可以使用getAttribute()获取自定义属性; Firefox下,只能使用getAttribute()获取自定义属性。 解决方法:统一通过getAttribute()获取自定义属性
    </li>
    <li>
    IE下,even对象有x,y属性,但是没有pageX,pageY属性; Firefox下,event对象有pageX,pageY属性,但是没有x,y属性
    </li>
    <li>
    解决方法：（条件注释）缺点是在IE浏览器下可能会增加额外的HTTP请求数。
    </li>
    <li>
    Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示, 可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。
    </li>
    <li>
    超链接访问过后hover样式就不出现了 被点击访问过的超链接样式不在具有hover和active了解决方法是改变CSS属性的排列顺序: L-V-H-A : a:link {} a:visited {} a:hover {} a:active {}
    </li>
</ol>
</details>  

## 22. CSS优化、提高性能的方法有哪些？
<details>
<summary>展开查看答案</summary>
<ol>
    <li>关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）；</li>
    <li>如果规则拥有 ID 选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）； </li>
    <li> 提取项目的通用公有样式，增强可复用性，按模块编写组件；</li>
    <li>增强项目的协同开发性、可维护性和可扩展性; </li>
    <li>使用预处理工具或构建工具（gulp对css进行语法检查、自动补前缀、打包压缩、自动优雅降级）；</li>
</ol>
</details>  

## 23.  如何修改chrome记住密码后自动填充表单的黄色背景 ？
<details>
<summary>展开查看答案</summary>
<pre>
 input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: rgb(250, 255, 189); /* #FAFFBD; */
    background-image: none;
    color: rgb(0, 0, 0);
  }
</pre>
</details>  

## 24.  让页面里的字体变清晰，变细用CSS怎么做？
<details>
<summary>展开查看答案</summary>
<pre>
-webkit-font-smoothing: antialiased;
</pre>
</details>  

## 25. 让overflow:scroll平滑滚动？
<details>
<summary>展开查看答案</summary>
<pre>
-webkit-overflow-scrolling: touch;
</pre>
</details>  

## 26. button注意事项
<details>
<summary>展开查看答案</summary>
<pre>
&lt;button&gt;&lt;/button&gt;元素一定要写上type属性不然会默认提交表单，出现想不到的bug
</pre>
</details>  

## 27. 移动端html标签几个体验优化
<details>
<summary>展开查看答案</summary>
<pre>
html,body{
overflow: hidden;/*手机上写overflow-x:hidden;会有兼容性问题，如果子级如果是绝对定位有运动到屏幕外的话ios7系统会出现留白*/
-webkit-overflow-scrolling:touch;/*流畅滚动,ios7下会有滑一下滑不动的情况，所以需要写上*/
position:realtive;/*直接子级如果是绝对定位有运动到屏幕外的话，会出现留白*/
}
</pre>
</details>  

## 28. 手机上的多行省略
<details>
<summary>展开查看答案</summary>
<pre>
.overflow-hidden{
    display: box !important;
    display: -webkit-box !important;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;/*第几行出现省略号*/
    /*text-align:justify;不能和溢出隐藏的代码一起写，会有bug*/
}
</pre>
</details>  

## 29. 长时间按住页面闪退
<details>
<summary>展开查看答案</summary>
<pre>
.element {
    -webkit-touch-callout: none;
}
</pre>
</details>  

## 30. 改变输入框内提示文字颜色
<details>
<summary>展开查看答案</summary>
<pre>
::-webkit-input-placeholder { /* WebKit browsers */
    color: #999; }
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #999; }
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #999; }
:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #999; }
input:focus::-webkit-input-placeholder{ color:#999; }
</pre>
</details>  

## 31. 消除transtration闪屏
<details>
<summary>展开查看答案</summary>
<pre>
消除transition闪屏
.css {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
}
</pre>
</details>  

## 32. 
<details>
<summary>展开查看答案</summary>
</details>  