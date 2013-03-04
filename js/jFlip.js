/*
 * jFlip plugin for jQuery v0.4 (28/2/2009)
 * 
 * A plugin to make a page flipping gallery    
 *
 * Copyright (c) 2008-2009 Renato Formato (rformato@gmail.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *    
 */
;(function($){
    var Flip = function(canvas,width,height,images,opts) {
      //private vars
      opts = $.extend({background:"green",cornersTop:true,scale:"noresize"},opts);
      var obj = this,
      el = canvas.prev(),
      index = 0,
      init = false,
      background = opts.background,
      cornersTop = opts.cornersTop,
      gradientColors = opts.gradientColors || ['#4F2727','#FF8F8F','#F00'],
      curlSize = opts.curlSize || 0.1,
      scale = opts.scale,
      patterns = [],
      canvas2 = canvas.clone(),
      ctx2 = $.browser.msie?null:canvas2[0].getContext("2d"),
      canvas = $.browser.msie?$(G_vmlCanvasManager.initElement(canvas[0])):canvas,
      ctx = canvas[0].getContext("2d"),
      loaded = 0;
      var images = images.each(function(i){
        if(patterns[i]) return;
        var img = this;
        img.onload = function() {
          var r = 1;
          if(scale!="noresize") {
            var rx = width/this.width,
            ry = height/this.height;
            if(scale=="fit")
              r = (rx<1 || ry<1)?Math.min(rx,ry):1;
            if(scale=="fill") {
              r = Math.min(rx,ry);
            }
          };
          $(img).data("flip.scale",r);
          patterns[i] = ctx.createPattern(img,"no-repeat");
          loaded++;
          if(loaded==images.length && !init) {
            init = true;
            draw();
          }
        };
        if(img.complete)
          window.setTimeout(function(){img.onload()},10);
      }).get();
      var
        width = width,height = height,mX = width,mY = height,
        basemX = mX*(1-curlSize), basemY = mY*curlSize,sideLeft = false,
        off = $.browser.msie?canvas.offset():null,
        onCorner = false,
        curlDuration=400,curling = false,
        animationTimer,startDate,
        flipDuration=700,flipping = false,baseFlipX,baseFlipY,
        lastmX,lastmY,
        inCanvas = false,
        mousedown = false,
        dragging = false;
      
      $(window).scroll(function(){
              //off = canvas.offset(); //update offset on scroll
      });
      
      //IE can't handle correctly mouseenter and mouseleave on VML 
      var c = $.browser.msie?(function(){
          var div = $("<div>").width(width).height(height).css({position:"absolute",cursor:"default",zIndex:1}).appendTo("body");
          //second hack for IE7 that can't handle correctly mouseenter and mouseleave if the div has no background color 
          if(parseInt($.browser.version)==7)
            div.css({opacity:0.000001,background:"#FFF"});
          var positionDiv = function() {
            off = canvas.offset();
            return div.css({left:off.left+'px',top:off.top+'px'});
          }
          $(window).resize(positionDiv);
          return positionDiv();
      })():canvas;
      c.mousemove(function(e){
        //track the mouse
        /*
        if(!off) off = canvas.offset(); //safari can't calculate correctly offset at DOM ready
        mX = e.clientX-off.left;
        mY = e.clientY-off.top;
        window.setTimeout(draw,0);
        return;
        */
        if(!off)
          off = canvas.offset(); //safari can't calculate correctly offset at DOM ready
        
        if(mousedown && onCorner) {
          if(!dragging) {
            dragging = true;
            window.clearInterval(animationTimer);
          }
          mX = !sideLeft?e.pageX-off.left:width-(e.pageX-off.left);
          mY = cornersTop?e.pageY-off.top:height-(e.pageY-off.top);
          window.setTimeout(draw,0);
          return false;        
        }
        
        lastmX = e.pageX||lastmX, lastmY = e.pageY||lastmY;
        if(!flipping) {
          sideLeft = (lastmX-off.left)<width/2;
          //cornersTop = (lastmY-off.top)<height/2;
        }
        if(!flipping && 
          ((lastmX-off.left)>basemX || (lastmX-off.left)<(width-basemX)) && 
          ((cornersTop && (lastmY-off.top)<basemY) || (!cornersTop && (lastmY-off.top)>(height-basemY)))) {
          if(!onCorner) {
            onCorner= true;
            c.css("cursor","pointer");          
          }
        } else {
          if(onCorner) {
            onCorner= false;
            c.css("cursor","default");
          }
        };
        return false;
      }).bind("mouseenter",function(e){
        inCanvas = true;
        if(flipping) return;
        window.clearInterval(animationTimer);
        startDate = new Date().getTime();
        animationTimer = window.setInterval(cornerCurlIn,10);
        return false;
      }).bind("mouseleave",function(e){
        inCanvas = false;
        dragging = false;
        mousedown = false;
        if(flipping) return;
        window.clearInterval(animationTimer);
        startDate = new Date().getTime();
        animationTimer = window.setInterval(cornerCurlOut,10);
        return false;
      }).click(function(){
        if(onCorner && !flipping) {
          flipping = true;
          c.triggerHandler("mousemove");
          window.clearInterval(animationTimer);
          startDate = new Date().getTime();
          baseFlipX = mX;
          baseFlipY = mY;
          animationTimer = window.setInterval(flip,10);
          index += sideLeft?-1:1;
          if(index<0) index = images.length-1;
          if(index==images.length) index = 0;
          el.trigger("flip.jflip",[index,images.length]);
        }
        return false;
      }).mousedown(function(){
        dragging = false;
        mousedown = true;
        return false;
      }).mouseup(function(){
        mousedown = false;
        return false;
      });
      
      var flip = function() {
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=flipDuration) {
          window.clearInterval(animationTimer);
          if(sideLeft) {
            images.unshift(images.pop());
            patterns.unshift(patterns.pop());
          } else {
            images.push(images.shift());
            patterns.push(patterns.shift());          
          }
          mX = width;
          mY = height; 
          draw();
          flipping = false;
          //init corner move if still in Canvas
          if(inCanvas) {
            startDate = new Date().getTime();
            animationTimer = window.setInterval(cornerCurlIn,10);
            c.triggerHandler("mousemove");
          } 
          return;
        }
        //da mX a -width  (mX+width) in duration millisecondi 
        mX = baseFlipX-2*(width)*delta/flipDuration;
        mY = baseFlipY+2*(height)*delta/flipDuration;
        draw();
      },
      cornerMove =  function() {
        var date = new Date(),delta = date.getTime()-startDate;
        
        mX = basemX+Math.sin(Math.PI*2*delta/1000);
        mY = basemY+Math.cos(Math.PI*2*delta/1000);
        drawing = true;
        window.setTimeout(draw,0);
      },
      cornerCurlIn = function() {
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=curlDuration) {
          window.clearInterval(animationTimer);
          startDate = new Date().getTime();
          animationTimer = window.setInterval(cornerMove,10);        
        }      
        mX = width-(width-basemX)*delta/curlDuration;
        mY = basemY*delta/curlDuration;
        draw();    
      },
      cornerCurlOut = function() {
        var date = new Date(),delta = date.getTime()-startDate;
        if(delta>=curlDuration) {
          window.clearInterval(animationTimer);
        }      
        mX = basemX+(width-basemX)*delta/curlDuration;
        mY = basemY-basemY*delta/curlDuration;
        draw();    
      },
      curlShape = function(m,q) {
        //cannot draw outside the viewport because of IE blurring the pattern
        var intyW = m*width+q,intx0 = -q/m;
        if($.browser.msie) {
          intyW = Math.round(intyW);
          intx0 = Math.round(intx0);
        };
        ctx.beginPath();
        ctx.moveTo(width,Math.min(intyW,height));
        ctx.lineTo(width,0);
        ctx.lineTo(Math.max(intx0,0),0);
        if(intx0<0) {
          ctx.lineTo(0,Math.min(q,height));
          if(q<height) {
            ctx.lineTo((height-q)/m,height);
          }
          ctx.lineTo(width,height);
        } else {
          if(intyW<height)
            ctx.lineTo(width,intyW);
          else {
            ctx.lineTo((height-q)/m,height);
            ctx.lineTo(width,height);
          }
        }
      },
      draw = function() {
        if(!init) return;
        if($.browser.msie)
          ctx.clearRect(0,0,width,height);

        ctx.fillStyle = background;
        ctx.fillRect(0,0,width,height);
        var img = images[0], r = $(img).data("flip.scale");
        if($.browser.msie) {
          ctx.fillStyle = patterns[0];
          ctx.fillStyle.width2 = ctx.fillStyle.width*r;
          ctx.fillStyle.height2 = ctx.fillStyle.height*r;
          ctx.fillRect(0,0,width,height);
        } else {
          ctx.drawImage(img,(width-img.width*r)/2,(height-img.height*r)/2,img.width*r,img.height*r);
        }
        
        if(mY && mX!=width) {
          
          var m = 2,
              q = (mY-m*(mX+width))/2;
              m2 = mY/(width-mX),
              q2 = mX*m2;
          if(m==m2) return;

          var sx=1,sy=1,tx=0,ty=0;
          ctx.save();
          if(sideLeft) {
            tx = width;
            sx = -1;
          }
          if(!cornersTop) {
            ty = height;
            sy = -1;
          }
          ctx.translate(tx,ty);
          ctx.scale(sx,sy);
          //draw page flip
          //intx,inty is the intersection between the line of the curl and the line
          //from the canvas corner to the curl point 
          var intx = (q2-q)/(m-m2);
          var inty = m*intx+q;
          //y=m*x+mY-m*mX line per (mX,mY) parallel to the curl line
          //y=-x/m+inty+intx/m line perpendicular to the curl line
          //intersection x between the 2 lines = int2x
          //y of perpendicular for the intersection x = int2y 
          //opera do not fill a shape if gradient is finished
          var int2x = (2*inty+intx+2*m*mX-2*mY)/(2*m+1);
          var int2y = -int2x/m+inty+intx/m;
          var d = Math.sqrt(Math.pow(intx-int2x,2)+Math.pow(inty-int2y,2));
          var stopHighlight = Math.min(d*0.5,30);
          
          var c;
          if(!($.browser.mozilla && parseFloat($.browser.version)<1.9)) {
            c = ctx;
          } else {
            c = ctx2;
            c.clearRect(0,0,width,height);
            c.save();
            c.translate(1,0); //the curl shapes do not overlap perfeclty
          }
          var gradient = c.createLinearGradient(intx,inty,int2x,int2y);
          gradient.addColorStop(0, gradientColors[0]);
          gradient.addColorStop(stopHighlight/d, gradientColors[1]);
          gradient.addColorStop(1, gradientColors[2]);
          c.fillStyle = gradient;
          c.beginPath();
          c.moveTo(-q/m,0);
          c.quadraticCurveTo((-q/m+mX)/2+0.02*mX,mY/2,mX,mY);
          c.quadraticCurveTo((width+mX)/2,(m*width+q+mY)/2-0.02*(height-mY),width,m*width+q);
          if(!($.browser.mozilla && parseFloat($.browser.version)<1.9)) {
            c.fill();
          } else {
            //for ff 2.0 use a clip region on a second canvas and copy all its content (much faster)
            c.save();
            c.clip();
            c.fillRect(0,0,width,height);
            c.restore();
            ctx.drawImage(canvas2[0],0,0);
            c.restore();          
          }
          //can't understand why this doesn't work on ff 2, fill is slow
          /*
          ctx.save();
          ctx.clip();
          ctx.fillRect(0,0,width,height);
          ctx.restore();
          */
          gradient = null;
                    
          //draw solid color background
          ctx.fillStyle = background;
          curlShape(m,q);
          ctx.fill();

          //draw back image
          curlShape(m,q);
          //safari and opera delete the path when doing restore
          if(!$.browser.safari && !$.browser.opera)
           ctx.restore();          

          var img = sideLeft?images[images.length-1]:images[1];
          r = $(img).data("flip.scale");
          if($.browser.msie) {
            //excanvas does not support clip
            ctx.fillStyle = sideLeft?patterns[patterns.length-1]:patterns[1];
            //hack to scale the pattern on IE (modified excanvas)
            ctx.fillStyle.width2 = ctx.fillStyle.width*r;
            ctx.fillStyle.height2 = ctx.fillStyle.height*r;
            ctx.fill();
          } else {
            ctx.save();
            ctx.clip();
            //safari and opera delete the path when doing restore
            //at this point we have not reverted the trasform
            if($.browser.safari || $.browser.opera) {
              //revert transform
              ctx.scale(1/sx,1/sy);
              ctx.translate(-tx,-ty);
            }            

            ctx.drawImage(img,(width-img.width*r)/2,(height-img.height*r)/2,img.width*r,img.height*r);

            //ctx.drawImage(img,(width-img.width)/2,(height-img.height)/2);
            ctx.restore();
            if($.browser.safari || $.browser.opera) 
              ctx.restore()
          }
        }   
      }
    }

    $.fn.jFlip = function(width,height,opts){
      return this.each(function() {
        $(this).wrap("<div class='flip_gallery'>");
        var images = $(this).find("img");
        //cannot hide because explorer does not give the image dimensions if hidden
        var canvas = $(document.createElement("canvas")).attr({width:width,height:height}).css({margin:0,width:width+"px",height:height+"px"})
        $(this).css({position:"absolute",left:"-9000px",top:"-9000px"}).after(canvas);
        new Flip($(this).next(),width || 300,height || 300,images,opts);
      });
    };
    
})(jQuery);