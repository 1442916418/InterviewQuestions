# HTML

## 1. 你做的页面在哪些流览器测试过？这些浏览器的内核分别是什么?
<details>
<summary>展开查看答案</summary>
<ul>
    <li>IE: trident内核</li>
    <li>Firefox：gecko内核</li>
    <li>Safari:webkit内核</li>
    <li>Opera:以前是presto内核，Opera现已改用Google Chrome的Blink内核</li>
    <li>Chrome:Blink(基于webkit，Google与Opera Software共同开发)</li>
</ul>
</details>  

## 2. 每个HTML文件里开头都有个很重要的东西，Doctype，知道这是干什么的吗？
<details>
<summary>展开查看答案</summary>
<p>
!DOCTYPE 声明位于文档最前面的位置，处于<html>标签之前。此标签可告知浏览器文档使用哪种HTML规范。（重点：告诉浏览器按照何种规范解析页面）</p>
</details>  

## 3. Quirks模式是什么？它和Standards模式有什么区别？
<details>
<summary>展开查看答案</summary>
<p>从IE6开始，引入了Standards模式，标准模式中，浏览器尝试给符合标准的文档在规范上的正确处理达到在指定浏览器中的程度。</p>
<p>在IE6之前CSS还不够成熟，所以IE5等之前的浏览器对CSS的支持很差，IE6将对CSS提供更好的支持，然而这时的问题就来了，因为有很多页面是基于旧的布局方式写的，而如果IE6支持CSS则将令这些页面显示不正常，如何在即保证不破坏现有页面，又提供新的渲染机制呢？
</p>
<p>在写程序时我们也会经常遇到这样的问题，如何保证原来的接口不变，又提供更强大的功能，尤其是新功能不兼容旧功能时。遇到这种问题时的一个常见做法是增加参数和分支，即当某个参数为真时，我们就使用新功能，而如果这个参数不为真时，就使用旧功能，这样就能不破坏原有的程序，又提供新功能。IE6也是类似这样做的，它将DTD当成了这个“参数”，因为以前的页面大家都不会去写DTD，所以IE6就假定 如果写了DTD，就意味着这个页面将采用对CSS支持更好的布局，而如果没有，则采用兼容之前的布局方式。这就是Quirks模式（怪癖模式，诡异模式，怪异模式）。
</p>
<p>区别：总体会有布局、样式解析和脚本执行三个方面的区别。</p>
<p>　盒模型：在W3C标准中，如果设置一个元素的宽度和高度，指的是元素内容的宽度和高度，而在Quirks 模式下，IE的宽度和高度还包含了padding和border。
<img src="https://user-gold-cdn.xitu.io/2019/4/27/16a5de8dddc60711?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"  />
</p>
<p>设置行内元素的高宽：在Standards模式下，给<span>等行内元素设置wdith和height都不会生效，而在quirks模式下，则会生效。</p>
<p>设置百分比的高度：在standards模式下，一个元素的高度是由其包含的内容来决定的，如果父元素没有设置百分比的高度，子元素设置一个百分比的高度是无效的用margin:0 auto设置水平居中：使用margin:0 auto在standards模式下可以使元素水平居中，但在quirks模式下却会失效。</p>
</details>  

## 4. div+css的布局较table布局有什么优点？
<details>
<summary>展开查看答案</summary>
<ul>
    <li>改版的时候更方便 只要改css文件。</li>
    <li>页面加载速度更快、结构化清晰、页面显示简洁。</li>
    <li>表现与结构相分离。</li>
    <li>易于优化（seo）搜索引擎更友好，排名更容易靠前。</li>
</ul>
</details>  

## 5.  img的alt与title有何异同？strong与em的异同？
<details>
<summary>展开查看答案</summary>
<ul>
    <li>alt:为不能显示图像时显示出来的提示文本。title:鼠标移入时显示的提示文本</li>
    <li>strong:粗体强调标签，强调，表示内容的重要性，em:斜体强调标签，更强烈强调，表示内容的强调点</li>
</ul>
</details>  

## 6. 你能描述一下渐进增强和优雅降级之间的不同吗?
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
    <em>渐进增强</em><br />
    针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。
    </li>
    <li>
    <em>优雅降级</em><br />
    一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。
    </li>
    <li>
    <em>区别</em><br />
    优雅降级是从复杂的现状开始，并试图减少用户体验的供给，而渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要。<br />
    优雅降级”观点认为应该针对那些最高级、最完善的浏览器来设计网站。而将那些被认为“过时”或有功能缺失的浏览器下的测试工作安排在开发周期的最后阶段，并把测试对象限定为主流浏览器（如 IE、Mozilla 等）的前一个版本。在这种设计范例下，旧版的浏览器被认为仅能提供“简陋却无妨”的浏览体验。你可以做一些小的调整来适应某个特定的浏览器。但由于它们并非我们所关注的焦点，因此除了修复较大的错误之外，其它的差异将被直接忽略。<br />
    “渐进增强”观点则认为应关注于内容本身。内容是我们建立网站的诱因。有的网站展示它，有的则收集它，有的寻求，有的操作，还有的网站甚至会包含以上的种种，但相同点是它们全都涉及到内容。这使得“渐进增强”成为一种更为合理的设计范例。这也是它立即被 Yahoo! 所采纳并用以构建其“分级式浏览器支持”策略的原因所在。　<br />
    </li>
</ul>
</details>  

## 7. 请谈一下你对网页标准和标准制定机构重要性的理解。
<details>
<summary>展开查看答案</summary>
　（无标准答案）网页标准和标准制定机构都是为了能让web发展的更‘健康’，开发者遵循统一的标准，降低开发难度，开发成本，SEO也会更好做，也不会因为滥用代码导致各种BUG、安全问题，最终提高网站易用性。
</details>  

## 8. 请描述一下cookie，sessionStorage和localStorage的区别？
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
    <em>sessionStorage</em>
    <pre>sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。
    </li>
    <li>
    <em>Cookie</em>
    <pre>Web Storage的概p念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。但是Cookie也是不可以或缺的：cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生。
    </li>
</ul>
</details>  

## 9. 简述一下src与href的区别
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>src</em>
        <p>src用于替换当前元素</p>
        <p>
        src是source的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部。
        </p>
    </li>
    <li>
        <em>href</em>
        <p>href用于在当前文档和引用资源之间确立联系</p>
        <pre>href是Hypertext Reference的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加 link href="common.css" rel="stylesheet" 那么浏览器会识别该文档为css文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用link方式来加载css，而不是使用@import方式。
    </li>
</ul>
</details>  

## 10. 知道的网页制作会用到的图片格式有哪些
<details>
<summary>展开查看答案</summary>
<p> png-8，png-24，jpeg，gif，svg，webp，Apng </p>

<ul>
    <li>
        <em>webp</em>
        <p>
        WebP格式，谷歌（google）开发的一种旨在加快图片加载速度的图片格式。图片压缩体积大约只有JPEG的2/3，并能节省大量的服务器带宽资源和数据空间。Facebook Ebay等知名网站已经开始测试并使用WebP格式。在质量相同的情况下，WebP格式图像的体积要比JPEG格式图像小40%。
        </p>
    </li>
    <li>
        <em>Apng</em>
        <p>
        全称是“Animated Portable Network Graphics”,
        是PNG的位图动画扩展，可以实现png格式的动态图片效果。04年诞生，但一直得不到各大浏览器厂商的支持，直到日前得到 iOS safari 8的支持，有望代替GIF成为下一代动态图标准
        </p>
    </li>
</ul>
</details>  

## 11. 微格式
<details>
<summary>展开查看答案</summary>
微格式是一种让机器可读的语义化XHTML词汇的集合，是结构化数据的开放标准。是为特殊应用而制定的特殊格式。
<br />
优点：将智能数据添加到网页上，让网站内容在搜索引擎结果界面可以显示额外的提示
</details>  

## 12. 缓存处理
<details>
<summary>展开查看答案</summary>
dns缓存，cdn缓存，浏览器缓存，服务器缓存
</details>  

## 13. 图片优化
<details>
<summary>展开查看答案</summary>

<ul>
    <li>图片懒加载，在页面上的未可视区域可以添加一个滚动条事件，判断图片位置与浏览器顶端的距离与页面的距离，如果前者小于后者，优先加载</li>
    <li>如果为幻灯片、相册等，可以使用图片预加载技术，将当前展示图片的前一张和后一张优先下载。</li>
    <li>如果图片为css图片，可以使用CSSsprite，SVGsprite，Iconfont、Base64等技术。</li>
    <li>如果图片过大，可以使用特殊编码的图片，加载时会先加载一张压缩的特别厉害的缩略图，以提高用户体验。</li>
    <li>如果图片展示区域小于图片的真实大小，则因在服务器端根据业务需要先行进行图片压缩，图片压缩后大小与展示一致。 </li>
</ul>
</details>  

## 14. 你如何理解HTML结构的语义化
<details>
<summary>展开查看答案</summary>
<ul>
    <li>去掉或样式丢失的时候能让页面呈现清晰的结构</li>
    <li>见名知意</li>
</ul>
</details>  

## 15. SEO
<details>
<summary>展开查看答案</summary>
<ul>
    <li>合理的标签使用</li>
    <li>...</li>
</ul>
</details>  

## 16. 写HTML代码时应注意什么
<details>
<summary>展开查看答案</summary>
<ul>
    <li>尽可能少的使用无语义的标签div和span</li>
    <li>在语义不明显时，既可以使用div或者p时，尽量用p, 因为p在默认情况下有上下间距，对兼容特殊终端有利；</li>
    <li>不要使用纯样式标签，如：b、font、u等，改用css设置</li>
    <li>需要强调的文本，可以包含在strong或者em标签中（浏览器预设样式，能用CSS指定就不用他们），strong默认样式是加粗（不要用b），em是斜体（不用i）</li>
    <li>使用表格时，标题要用caption，表头用thead，主体部分用tbody包围，尾部用tfoot包围。表头和一般单元格要区分开，表头用th，单元格用td；</li>
    <li>表单域要用fieldset标签包起来，并用legend标签说明表单的用途；</li>
    <li>每个input标签对应的说明文本都需要使用label标签，并且通过为input设置id属性，在lable标签中设置for来让说明文本和相对应的input关联起来。</li>
</ul>
</details>  

## 17. doctype作用？严格模式和混杂模式如何区分，他们有何意义？
<details>
<summary>展开查看答案</summary>
<!DOCTYPE> 声明位于文档中的最前面的位置，处于 <html> 标签之前。此标签可告知浏览器文档使用哪种 HTML 或 XHTML 规范。<br />
<b>严格模式：</b>又称标准模式，是指浏览器按照 W3C 标准解析代码<br />
<b>混杂模式：</b>又称怪异模式或兼容模式，是指浏览器用自己的方式解析代码。<br />
<b>如何区分：</b>浏览器解析时到底使用严格模式还是混杂模式，与网页中的 DTD 直接相关。<br />
<ul>
    <li>如果文档包含严格的 DOCTYPE ，那么它一般以严格模式呈现。
    </li>
    <li>包含过渡 DTD 和 URI 的 DOCTYPE ，也以严格模式呈现，但有过渡 DTD 而没有 URI （统一资源标识符，就是声明最后的地址）会导致页面以混杂模式呈现。
    </li>
    <li>DOCTYPE 不存在或形式不正确会导致文档以混杂模式呈现。</li>
    <li>HTML5 没有 DTD ，因此也就没有严格模式与混杂模式的区别，HTML5 有相对宽松的语法，实现时，已经尽可能大的实现了向后兼容。（ HTML5 没有严格和混杂之分）</li>
</ul>
</details>  

## 18. HTML5为什么只需要写 !DOCTYPE
<details>
<summary>展开查看答案</summary>
<p><!DOCTYPE> 声明不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。</p>
<p>在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。</p>
<p>HTML5 不基于 SGML，所以不需要引用 DTD。</p>
</details>  

## 19. 行内元素、块级元素、空(void)元素有哪些
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>块状元素</em>
        <p>div、p、h1、h6、ol、ul、dl、table、address、blockquote 、form </p>
    </li>
    <li>
        <em>内联元素</em>
        <p>a、span、br、i、em、strong、label、q、var、cite、code</p>
    </li>
    <li>
        <em>空元素</em>
        <p>br、hr、img、input、link、meta</p>
    </li>
</ul>
</details>  

## 20.  iframe有哪些缺点？
<details>
<summary>展开查看答案</summary>

<ul>
    <li>
        <em>优点</em>
        <ol>
            <li>iframe能够原封不动的把嵌入的网页展现出来。</li>
            <li>如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。</li>
            <li>网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。</li>
            <li>如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。</li>
        </ol>
    </li>
    <li>
        <em>缺点</em>
        <ol>
            <li>会产生很多页面，不容易管理。</li>
            <li>iframe框架结构有时会让人感到迷惑，如果框架个数多的话，可能会出现上下、左右滚动条，会分散访问者的注意力，用户体验度差</li>
            <li>代码复杂，无法被一些搜索引擎索引到，这一点很关键，现在的搜索引擎爬虫还不能很好的处理iframe中的内容，所以使用iframe会不利于搜索引擎优化。</li>
            <li>很多的移动设备（PDA 手机）无法完全显示框架，设备兼容性差。</li>
            <li>.iframe框架页面会增加服务器的http请求，对于大型网站是不可取的</li>
        </ol>
    </li>
</ul>

</details>  

## 21. label的作用是什么？是怎么用的？
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
        <p>例子1: 点击" 用户名:" 就可以定位光标到输入框</p>
        <p>FOR 属性:表示Label 标签要绑定的HTML 元素，你点击这个标签的时候，所绑定的元素将获取焦点。</p>
<pre>
&lt;form&gt;&lt;label for="myid "&gt;用户名:&lt;/label&gt;
&lt;input type="text" id="myid" /&gt;&lt;/form&gt;
</pre>
    </li>
    <li>
        <p>例子2: 点击" 用户名:" 或按键alt+1, 都可以定位光标到输入框</p>
        <p>ACCESSKEY 属性:表示访问Label 标签所绑定的元素的热键，当您按下热键，所绑定的元素将获取焦点</p>
        <p>ACCESSKEY 局限性:accessKey 属性所设置的快捷键不能与浏览器的快捷键冲突，否则将优先激活浏览器的快捷键。</p>
<pre>
&lt;form&gt;&lt;label for="myid  accesskey="1" "&gt;用户名:&lt;/label&gt;
&lt;input type="text" id="myid" tabindex="1" /&gt;&lt;/form&gt;
</pre>
    </li>
</ol>
</details>  

## 22. HTML5的form如何关闭自动完成功能？
<details>
<summary>展开查看答案</summary>
<p>HTML的输入框可以拥有自动完成的功能，当你往输入框输入内容的时候，浏览器会从你以前的同名输入框的历史记录中查找出类似的内容并列在输入框下面，这样就不用全部输入进去了，直接选择列表中的项目就可以了。但有时候我们希望关闭输入框的自动完成功能，例如当用户输入内容的时候，我们希望使用AJAX技术从数据库搜索并列举而不是在用户的历史记录中搜索。
</p>
<p>关闭输入框的自动完成功能有3种方法：</p>
<ol>
    <li>在IE的Internet选项菜单里的内容--自动完成里面设置</li>
    <li>设置form的autocomplete为"on"或者"off"来开启或者关闭自动完成功能</li>
    <li>设置输入框的autocomplete为"on"或者"off"来开启或者关闭该输入框的自动完成功能</li>
</ol>
</details>  

## 23. 实现不用 border 画出1px高的线
<details>
<summary>展开查看答案</summary>
<pre>
&lt;div style="height:1px;overflow:hidden;background:red"&gt;&lt;/div&gt;
</pre>
</details>  

## 24. title 与h1 的区别，b 与 strong的区别，i 与 em的区别
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em> b和strong的区别</em>
        <p>
        盲人朋友使用阅读设备阅读网络时：strong会重读，b不会<br />两者虽然在网页中显示效果一样，但实际目的不同。<br />b这个标签对应 bold，即文本加粗，其目的仅仅是为了加粗显示文本，是一种样式／风格需求；<br />strong这个标签意思是加强字符的语气，表示该文本比较重要，提醒读者／终端注意。为了达到这个目的，浏览器等终端将其加粗显示；<br />总结：b为了加粗而加粗，strong为了标明重点而加粗，也可以用其它方式来强调，比如下划线，比如字体加大，比如红色，等等，可以通过css来改变strong的具体表现。
        </p>
    </li>
    <li>
        <em>i和em的区别</em>
        <p>I是Italic(斜体)，而em是emphasize(强调)。</p>
    </li>
    <li>
        <em>title与h1的联系</em>
        <p>从网站角度看，title 更重于网站信息。title 可以直接告诉搜索引擎和用户这个网站是关于什么主题和内容的。</p>
        <p>从文章角度看，h1则是用于概括文章主题。用户进入内容页，想看到的当然就是文章的内容，h1文章标题就是最重要的。文章标题最好只有一个，多个h1会导致搜索引擎不知道这个页面哪个标题内容最重要，导致淡化这个页面的标题和关键词，起不到突出主题的效果</p>
        <p>区别：h1突出文章主题，面对用户，更突出其视觉效果，突出网站标题或关键字用title。一篇文章，一个页面最好只用一个h1，多个h1会稀释主题。一个网站可以有多个title,最好一个单页用一个title，以便突出网站页面主体信息，从seo看，title权重比h1高，适用性比h1广。标记了h1的文字页面给予的权重会比页面内其他权重高很多。一个好的网站是h1和title并存，既突出h1文章主题，又突出网站主题和关键字。达到双重优化网站的效果。
        </p>
    </li>
</ul>
</details>  

## 25. 用一个div模拟textarea的实现
<details>
<summary>展开查看答案</summary>
<pre>
&lt;div contenteditable="true"&gt;&lt;/div&gt;

*{            
    padding: 0;            
    margin: 0;        
}        
div{            
    width: 400px;            
    min-height: 100px;            
    max-height: 300px;            
    _height: 100px; /* IE6 */            
    margin-left: auto;            
    margin-right: auto;            
    padding: 3px;            
    outline: 0;            
    border: 1px solid #a0b3d6;            
    font-size: 12px;            
    word-wrap: break-word;            
    overflow-x: hidden;            
    overflow-y: auto;/* 超过最大的高度就出现滚动条 */            
    _overflow-y: visible;        
}    
</pre>
<p>HTML 5 全局 contenteditable 属性</p>
<pre>
&lt;element contenteditable="value"&gt;
true	规定可以编辑元素内容。
false	规定无法编辑元素内容。
classname	继承父元素的 contenteditable 属性。
</pre>
</details>  

## 26. 网页验证码是干什么用的？是为了解决什么安全问题？
<details>
<summary>展开查看答案</summary>
<p>可以防止：恶意破解密码、刷票、论坛灌水，有效防止某个黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试，实际上用验证码是现在很多网站通行的方式，我们利用比较简易的方式实现了这个功能。这个问题可以由计算机生成并评判，但是必须只有人类才能解答。由于计算机无法解答CAPTCHA的问题，所以回答出问题的用户就可以被认为是人类。</p>
</details>  

##  
<details>
<summary>展开查看答案</summary>
</details>  

