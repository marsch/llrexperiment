// jslint.com configuration options. See: http://www.jslint.com/lint.html
/*jslint
adsafe: false,bitwise: true,browser: false,cap: false,confusion: true,continue: true,debug: true,devel: true,eqeq: false,es5: false,evil: false,forin: false,fragment: false,indent: 2,maxerr: 50,maxlen: 80,newcap: true,node: false,nomen: true,on: false,passfail: false,plusplus: true,rhino: false,safe: false,sloppy: false,sub: false,undef: true,unparam: false,vars: false,white: false,widget: false, windows: false,*/
/*global
document: true, window: true, Date: true, $:true, Mustache: true,
Notifier: true
*/

function WheelAccordionView(contentDomID, scrollDomID, css3d) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.contentDomID = contentDomID;
    self.scrollDomID = scrollDomID;
    self.currentY = 0;
    self.css3d = css3d;

    // cache items 
    self.itemCount = 0;
    self.windowHeight = 0;

    
  };

  self.draw = function () {
    var $container = $('#' + self.contentDomID);

    self.updateContainerCSS();
    $(window).resize(_.bind(self.updateContainerCSS, self));
    $(window).bind('scroll', _.bind(self.onScroll, self));
    self.itemCount = $container.find('div').size();
  };

  self.updateContainerCSS = function () {
    var offset = 20;
    console.log('udpate');
    var $container = $('#' + self.contentDomID),
      containerCSS = 'height:' + ($(window).height()-offset) + 'px;';
    $container.attr('style', containerCSS);
    self.windowHeight = $(window).height();
  };

  self.onScroll = function (event) {
    console.log('on scroll');
    var maxY = 20000 - self.windowHeight,
      currentY = window.pageYOffset,
      calc;

    calc = function (itemNum, maxItems, maxHeight, currentY) {
      var lowerBoundary,
        itemStartY,
        currentHeight,
        currentHeightBefore,
        currentPosY,
        defaultSpacing,
        query,
        y,
        yoffset,
        deg,
        translate,
        positioningOffset = 0; //to tie the bottom more upper

      defaultSpacing = 20;
      lowerBoundary = (((itemNum - 1) / maxItems) * maxHeight);
      itemStartY = ((itemNum / maxItems) * maxHeight);
      
      currentPosY = 0;
      query = '#' + self.contentDomID + ' > div:nth-child(' + itemNum + ')';
      queryBefore = '#' + self.contentDomID + ' > div:nth-child(' + (itemNum - 1) + ')';
      currentHeight = $(query + ' > div').height();
      currentHeightBefore = $(queryBefore + ' > div').height();
      //console.log(query);
      y = 0;
      yoffset = 0;
      

      if (self.css3d) {
        deg = (itemNum % 2 === 0) ? ('rotateZ(2deg)') : ('rotateZ(-2deg)');
      } else {
        deg = (itemNum % 2 === 0) ? ('rotate(2deg)') : ('rotate(-2deg)');
      }
      if (currentY > lowerBoundary && currentY < itemStartY) {
        // active
        y = (itemNum * defaultSpacing) + yoffset;
      } else if (currentY > (itemStartY)) {
        // above active
        y = (itemNum * defaultSpacing) + yoffset;
      } else {
        // below active
        y = (((itemNum) * defaultSpacing)) + currentHeightBefore + yoffset - positioningOffset;
        if (y + (currentY - lowerBoundary) > 0) {
          y = y - (y + (currentY - lowerBoundary));
        }

        if (self.css3d) {
          deg = (itemNum % 2 === 0) ? ('rotateZ(2deg)') : ('rotateZ(-2deg)');
        } else {
          deg = (itemNum % 2 === 0) ? ('rotate(2deg)') : ('rotate(-2deg)');
        }
      }

      if (self.css3d) {
        translate = 'translate3D(20px, ' + y + 'px, 0px) ';
      } else {
        translate = 'translate(20px, ' + y + 'px) ';
      }
      $(query).attr('style', '-webkit-transform:' + translate + deg + ';' + ' -moz-transform:' + translate + deg + ';');
    };
    
    for (var i = 1; i <= self.itemCount; i++) {
      calc(i, self.itemCount, maxY, currentY);
    }
  };

  self.init();
};






$(function () {
  console.log('READY');
  if (Modernizr.csstransforms &&
      Modernizr.csstransitions &&
      Modernizr.csstransforms3d) {
    var accordion = new WheelAccordionView('container', 'scrollcontainer', true);
    accordion.draw();
  } else if (Modernizr.csstransforms &&
             Modernizr.csstransitions) {
    var accordion = new WheelAccordionView('container', 'scrollcontainer', false);
    accordion.draw();
  } else {
    alert('wrong browser, need support for css transitions and transformations');
  }
  

$('html,body').animate({scrollTop: 1170}, 1000);

  $('.arrow').live('click', function () {
    $current = $(this).parent().parent().find('li.active');
    $bg = $(this).parent().parent().parent();
    if($(this).hasClass('next')) {
      if ($current.next('li').length > 0) {
        $page = $current.next('li');
        $bg.animate({'margin-left': '-=1283px'}, 500);
      }
    } else {
      if ($current.prev('li').length > 0) {
        $page = $current.prev('li');
        $bg.animate({'margin-left': '+=1283px'}, 500);
      }
    }
    $current.slideUp(400, function () {
      $current.show().removeClass('active');
    });
    $page.addClass('active').hide().slideDown(600, function () {
    
    });
    return false;
  });
  $('.blocklink').live('click', function () {
    $current = $(this).parent().parent().parent().find('li.active');
    $bg = $(this).parent().parent().parent();
    if($(this).hasClass('next')) {
      if ($current.next('li').length > 0) {
        $page = $current.next('li');
        $bg.animate({'margin-left': '-=1283px'}, 500);
      }
    } else {
      if ($current.prev('li').length > 0) {
        $page = $current.prev('li');
        $bg.animate({'margin-left': '+=1283px'}, 500);
      }
    }
    $current.slideUp(400, function () {
      $current.show().removeClass('active');
    });
    $page.addClass('active').hide().slideDown(600, function () {
    
    });
    return false;
  });
  $('a.play').live('click', function () {
    $video = $(this).parent().parent().parent().parent().find('video');
    videoId = $video.attr('id');
    player = VideoJS.setup(videoId);
    $video.css('visibility', 'visible');
    player.play();
    
    return false;
  });
  $('video').live('click', function () {
    $video.css('visibility', 'hidden');
    $video.css('display', 'none');
    player.pause();
    return false;
  });
});
