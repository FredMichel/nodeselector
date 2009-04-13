var ns = function () {};
ns.addLibs = function () {
    if (typeof(document.body) == "undefined" || document.body == null) {
        setTimeout(ns.addLibs, 100);
        return;
    }

    node = document.createElement("script");
    node.src = "http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js";
    document.body.appendChild(node);
    ns.nodeSelector();
} 

ns.nodeSelector = function () {  
    if (typeof($) == "undefined" || $("*") == null) {
        setTimeout(ns.nodeSelector, 100);
        return;
    }

    // Adding $.log
    if (window.console == undefined) { window.console = {log:function(){}}; };

    var mouseover = function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        if (typeof e.css("outline") != "undefined") {
            e.data("saved", {"outline" : e.css("outline")});
            e.css("outline", "red solid medium");
        } else {
            e.data("saved", {"backgroundColor" : e.css("backgroundColor")});
            e.css("backgroundColor", "#0cf");
        }
    };
    var mouseout = function(ev) {
        ev.stopPropagation();
        var e = $(ev.target);
        save = e.data("saved");
        if (typeof(save) == "undefined") return;
        e.removeData("saved");
        for (var i in save) {
            e.css(i, save[i]);
        }
    };
    var click =  function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var e = $(ev.target);
        var xpath = getXpath(ev.target);
        console.log(xpath);

        if (typeof(nsDoneURL) != "undefined") {
            if (nsDoneURL.indexOf("?") == -1) nsDoneURL += "?";
            else nsDoneURL += "&";

            var url = $.param({
                "xpath" : xpath, 
                "referer" : window.location.href
            });
            url = nsDoneURL + url;
            console.log(url);
            window.location = url;
            return false;
        }

        var node = $("#hover");
        if (node.size() == 0)  {
            $(document.body).append("<div id='hover'></div>");
            var node = $("#hover");
            node
            .css("position", "absolute")
            .css("display", "inline")
            .css('border', '1px solid black')
            .css('backgroundColor', 'white')
            .css('padding', '2px')
            .css('width', 'auto') 
            .css("zIndex", 255)
            .click(function(ev) { ev.stopPropagation() });
        }
       
        node.html(xpath); 
        node.animate({
            'top' : (e.offset().top) + "px",
            'left': (e.offset().left) + "px"
        }, 250);
    };
    // $(document).ready(function () {
        $("*").each(function() {
            $(this)
            .mouseover(mouseover)
            .mouseout(mouseout)
            .click(click);
        });
    // });
    
    $(document).keydown(function(e) {
        if (e.keyCode == undefined && e.charCode != undefined) e.keyCode = e.charCode;
        // Escape key
        if (e.keyCode == 27) {
            $("*").each(function(i) {
                $(this)
                .mouseout()
                .unbind("mouseover", mouseover)
                .unbind("mouseout", mouseout)
                .unbind("click", click);
            });
            $("#hover").css("display", "none");
        }
    });

    function getXpath(e) {
        var xpath = "";
    
        while (e.nodeName.toLowerCase() != "html") {
            var node = e.nodeName.toLowerCase();
            var id = e.id;
            if (id != undefined && id != null && id != "") {
                xpath = "//" + node + "[@id='" + id + "']" + xpath;
                return xpath;
            }
            var parent = e.parentNode;
            var children = $(parent).find(node);
            if (children.size() > 1) {
                var good = false;
                children.each(function(i) {
                    if (this == e) {
                        node = node + "[" + (i+1) + "]";
                        good = true;
                        return false;
                    }
                });
                if (! good) {
                    console.log("Can't find child, something is wrong with your dom : " + node);
                    return FALSE;
                }
            }
            xpath = "/" + node + xpath;
            e = parent;
        }
        xpath = "/html" + xpath;
        return xpath;
    }
}
ns.addLibs();
