// jslint.com configuration options. See: http://www.jslint.com/lint.html
/*jslint
adsafe: false,bitwise: true,browser: false,cap: false,confusion: true,continue: true,debug: true,devel: true,eqeq: false,es5: false,evil: false,forin: false,fragment: false,indent: 2,maxerr: 50,maxlen: 80,newcap: true,node: false,nomen: true,on: false,passfail: false,plusplus: true,rhino: false,safe: false,sloppy: false,sub: false,undef: true,unparam: false,vars: false,white: false,widget: false, windows: false,*/
/*global
document: true, window: true, Date: true, $:true, Mustache: true,
Notifier: true
*/

function WheelAccordionView(contentDomID, scrollDomID, topics) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function () {
    self.contentDomID = contentDomID;
    self.scrollDomID = scrollDomID;
    self.topcis = topics;
    self.currentY = 0;

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
    console.log("udpate");
    var $container = $('#' + self.contentDomID),
      containerCSS = 'height:' + ($(window).height()-200) + 'px; width:' + $(window).width() + 'px; overflow:hidden; z-index:3; position:fixed; left: 0px; top: 200px;';
    $container.attr('style', containerCSS);
    self.windowHeight = $(window).height();
  };

  self.onScroll = function (event) {
    
    var maxY = 30000 - self.windowHeight,
      currentY = window.pageYOffset;

    var calc = function (itemNum, maxItems, maxHeight, currentY) {
      var lowerBoundary,
        itemStartY,
        currentHeight,
        currentHeightBefore,
        currentPosY,
        defaultSpacing,
        query;

      defaultSpacing = 20;
      lowerBoundary = (((itemNum - 1) / maxItems) * maxHeight);
      itemStartY = ((itemNum / maxItems) * maxHeight);
      
      currentPosY = 0;
      query = "#" + self.contentDomID + " > div:nth-child(" + itemNum + ")";
      queryBefore = "#" + self.contentDomID + " > div:nth-child(" + (itemNum - 1) + ")";
      currentHeight = $(query + ' > div').height();
      currentHeightBefore = $(queryBefore + ' > div').height();
      //console.log(query);
      var y = 0;
      var yoffset = 0;
      var deg = (itemNum % 2 === 0)? ('rotateZ(-2deg)'): ('rotateZ(2deg)');
      if (currentY > lowerBoundary && currentY < itemStartY) {
        // active
        y = (itemNum * defaultSpacing) + yoffset;
      } else if (currentY > (itemStartY)) {
        // above active
        y = (itemNum * defaultSpacing) + yoffset;
      } else {
        // below active
        y = (((itemNum) * defaultSpacing)) + currentHeightBefore + yoffset;
        if (y + (currentY - lowerBoundary) > 0) {
          y = y - (y + (currentY - lowerBoundary));
        }
        deg = (itemNum % 2 === 0)? ('rotateZ(2deg)'): ('rotateZ(-2deg)');

      }
      var translate = 'translate3d(-20px, ' + y + 'px, 0px)';
      $(query).attr('style', '-webkit-transform:' + translate + deg + ';');
    };
    
    for (var i = 1; i <= self.itemCount; i++) {
      calc(i, self.itemCount, maxY, currentY);
    }
  };

  self.init();
};






$(function () {
  console.log("READY");
  var accordion = new WheelAccordionView('container', 'scrollcontainer', []);
  accordion.draw();


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

  $('a.play').live('click', function () {
    $video = $(this).parent().parent().parent().parent().next('video');
    videoId = $video.attr('id');
    player = VideoJS.setup(videoId);
    $video.css('visibility', 'visible');
    player.play();
    
    return false;
  });
  $('video').live('click', function () {
    $video.css('visibility', 'hidden');
    player.pause();
    return false;
  });
});
