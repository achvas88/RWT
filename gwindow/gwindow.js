/* 
 * GWindow
 * DHTML Dockable Window Class, v0.3
 * 
 * (c) 2006, Serkan Girgin
 * 
 * Details and latest version at:
 * http://www.cografiveri.com/gwindow
 * 
 * This script is distributed under the GNU Lesser General Public License.
 * Read the entire license text here: http://www.gnu.org/licenses/lgpl.html   
 */ 
 
/* Changelog:
 * 2007.02.03: createTitlebarIcon: second parameter renamed
 * 2007.04.23: updateWindowDocked: updateWindow() is added below line 472
 * 2007.04.27: updateWindowDocked: combined updateWindow call for position/size change   
/*
 * Utility Functions
 */
function addEvent(element,eventtype,callback,useCapture) {
  if (element.addEventListener){
    element.addEventListener(eventtype,callback,useCapture);
    return(true);
  } else if (element.attachEvent){
    var result = element.attachEvent("on"+eventtype,callback); 
	  return(result);
  } else return(false);
} 

/*
 * GMouseListener Functions
 */
function GMouseListener()
{
	var m_buttons = new Array("L",navigator.userAgent.toLowerCase().indexOf("msie") > -1 ? "L" : "M","R",null,"M");
	var m_handlers = new Array();
	var m_last_event = null;
	var m_is_enabled = true;

	/*
	 * Private Functions
	 */
	function asNumber(value) {
		var i = parseInt(value);
		return(isNaN(i) ? null : i);
	}
	
	function getPositionX(obj) {
		var x = obj.offsetLeft;
		while (obj = obj.offsetParent) x += obj.offsetLeft+(obj.clientLeft ? obj.clientLeft : obj.style ? asNumber(obj.style.borderLeftWidth) : 0);
		return(x);
	}

	function getPositionY(obj) {
		var y = obj.offsetTop;
		while (obj = obj.offsetParent) y += obj.offsetTop+(obj.clientTop ? obj.clientTop : obj.style ? asNumber(obj.style.borderTopWidth) : 0);
		return(y);
	}
		
	function commonListener(e)
	{
		if (!m_is_enabled) return;
		if (!e) e = window.event;
		if (e.type == "mousemove" && m_last_event && m_last_event.screenX == e.screenX && m_last_event.screenY == e.screenY) return;
		var me = {};
		me.type = e.type;
		me.client = this;
		me.button = m_buttons[e.button];
		me.screenX = e.screenX;
		me.screenY = e.screenY;
		me.pageX = e.pageX ? e.pageX : e.clientX + document.documentElement.scrollLeft;
		me.pageY = e.pageY ? e.pageY : e.clientY + document.documentElement.scrollTop;
		me.clientX = me.pageX - getPositionX(this);
		me.clientY = me.pageY - getPositionY(this);
		
		var minx = this.clientLeft ? this.clientLeft : this.style ? asNumber(this.style.borderLeftWidth) : 0;
		var miny = this.clientTop ? this.clientTop : this.style ? asNumber(this.style.borderTopWidth) : 0;
		me.x = (me.clientX >= minx && me.clientX < minx+this.clientWidth) ? me.clientX-minx+this.scrollLeft : null;
		me.y = (me.clientY >= miny && me.clientY < miny+this.clientHeight) ? me.clientY-miny+this.scrollTop : null;
		if (me.x == null) me.y = null; else if (me.y == null) me.x = null;		 
		
		var same_client = (m_last_event && m_last_event.client == me.client);
		me.deltaX = same_client ? me.screenX-m_last_event.screenX : 0;
		me.deltaY = same_client ? me.screenY-m_last_event.screenY : 0;

		m_last_event = me;
		for (var i = 0; i < m_handlers.length; i++) if (m_handlers[i].element == this && m_handlers[i].eventtype == e.type) {
			var temp_me = {};
			var callbacks = m_handlers[i].callbacks.concat();
			var propagate = true;
			for (var n = 0; n < callbacks.length; n++) {
				for (prop in me) temp_me[prop] = me[prop]
				if (callbacks[n](temp_me) == false) propagate = false;
			}
			if (!propagate) {
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.returnValue = false;
				e.cancelBubble = true;
			}
			return(propagate);
		}
	}

	/*
	 * Public Functions
	 */
	this.addListener = function(element,type,callback) {
		for (var i = 0; i < m_handlers.length; i++) if (m_handlers[i].element == element && m_handlers[i].eventtype == type) {
			for (var n = 0; n < m_handlers[i].callbacks.length; n++) if (m_handlers[i].callbacks[n] == callback) return;
			m_handlers[i].callbacks.push(callback);
			return;
		}
		m_handlers.push({element:element,eventtype:type,callbacks:new Array(callback)});
		if (element.addEventListener) element.addEventListener(type,commonListener,false);
		else element["on"+type] = commonListener;
	}

	this.removeListener = function(element,type,callback) {
		for (var i = 0; i < m_handlers.length; i++) if (m_handlers[i].element == element && m_handlers[i].eventtype == type) {
			for (var n = 0; n < m_handlers[i].callbacks.length; n++) if (m_handlers[i].callbacks[n] == callback) {
				m_handlers[i].callbacks.splice(n,1);
				if (!m_handlers[i].callbacks.length) {
					m_handlers.splice(i,1);
					if (element.removeEventListener) element.removeEventListener(type,commonListener,false);
					else element["on"+type] = null;
				}
				return;
			}
		}
	}

	this.enable = function(bool) { 
		m_is_enabled = bool; 
	}
	
	this.isEnabled = function() { 
		return(m_is_enabled); 
	}
}

/*
 * GWindow Functions
 */
function GWindow(m_eContainer,m_title,m_user_constants)
{
	GWindow.NEVER = "never";
	GWindow.UNDOCKED = "undocked";
	GWindow.DOCKED = "docked";
	GWindow.ALWAYS = "always";
	
	GWindow.BODY = "body";
	GWindow.TITLEBAR = "titlebar";
	GWindow.BOTH = "both";

	GWindow.AUTO = "auto";
	GWindow.HIDDEN = "hidden";
	
	var m_basic_zlimit = {min: 1000,max:30000};
	var m_ontop_zlimit = {min:30000,max:32765};

	var m_self = this;
	var m_baseURL = getBaseURL("gwindow.js");
	var m_constants = {
		resize: "Resize",
		resize_vertical: "Resize vertically",
		resize_horizontal: "Resize horizontally",
		restore: "Restore",
		minimize: "Minimize",
		dock: "Dock",
		undock: "Undock",
		close: "Close"
	}; 
	
	var m_border = {0:1, 1:1};
	var m_icon_size = {0:16, 1:16};
	var m_titlebar_h = {0:20, 1:20};
	var m_titlebar_border = {0:1, 1:1};
	var m_statusbar_h = {0:20, 1:20};
	var m_statusbar_border = {0:1, 1:1};
	var m_resize_w = {0:3, 1:3};
	var m_resize_border = {0:1, 1:1};

	var m_show_titlebar = GWindow.ALWAYS;
	var m_show_statusbar = GWindow.NEVER;
	var m_show_icon = GWindow.ALWAYS;

	var m_movable = true;
	var m_move_type = GWindow.TITLEBAR;
	var m_dockable = true;
	var m_closable = GWindow.NEVER;
	var m_minimizable = GWindow.UNDOCKED;
	var m_resizable_h = GWindow.UNDOCKED;
	var m_resizable_v = GWindow.UNDOCKED;
	var m_alwaysontop = false;
	var m_preserve_body_size = GWindow.NEVER;
	
	var m_eActive = null;
	var m_eAnchor = null;

	var m_ml = new GMouseListener();
	
	var m_dock_status = GWindow.UNDOCKED;
	var m_dock_interval = 1000;
	var m_dock_interval_id = null;

	var m_is_visible = true;
	var m_is_enabled = true;
	var m_is_closed = false;
	var m_is_minimized = {0:false, 1:false};
	var m_is_moving = false;
	var m_is_resizing = false;
	
	var m_x = {0:0, 1:0};
	var m_y = {0:0, 1:0};
	var m_w = {0:null, 1:null};
	var m_h = {0:null, 1:null};

	var m_minw = {0:0,1:0};
	var m_minh = {0:0,1:0};
	var m_maxw = {0:5000,1:5000};
	var m_maxh = {0:5000,1:5000};

	var m_status_text = "";
	var m_body_overflow = {0:"hidden",1:"auto"};
	
	/*
	 * Private Utility Functions
	 */
	function getBaseURL(src) {
		// Get script base path
		var elements = document.getElementsByTagName('script');
		var baseURL = "";
		for (var i = 0; i < elements.length; i++) if (elements[i].src && elements[i].src.indexOf(src) != -1) {
			baseURL = elements[i].src.substring(0, elements[i].src.lastIndexOf('/'));
			break;
		}
		// Get document base path
		var documentURL = document.location.href;
		if (documentURL.indexOf('?') != -1) documentURL = documentURL.substring(0, documentURL.indexOf('?'));
		documentURL = documentURL.substring(0, documentURL.lastIndexOf('/'));
	
		// If not HTTP absolute
		if (baseURL.indexOf('://') == -1 && baseURL.charAt(0) != '/') baseURL = documentURL + "/" + baseURL;
		return(baseURL+"/");
	}
	
	function asPixel(value) {
		return(value+"px");
	}
	
	function showElement(element,bool) {
		element.style.display = bool ? "" : "none";
	}

	function moveElement(element,x,y) {
		element.style.left = asPixel(x);
		element.style.top = asPixel(y);
	}
		
	function resizeElement(element,w,h) {
		var resized = false;
		w = asPixel(w);
		if (element.style.width != w) resized = true;
		element.style.width = w;
		h = asPixel(h);
		if (element.style.height != h) resized = true;
		element.style.height = h;
		return(resized);
	}

	function getZIndex(element) {
		var z = element ? parseInt(element.style.zIndex) : 0;
		return(isNaN(z) ? 0 : z);
	}

	/*
	 * Private Window Functions
	 */
	function getWindows() {
		var list = new Array();
		var elements = document.getElementsByTagName("div");
		for (var i = 0; i < elements.length; i++) {
			var div = elements[i];
			if ((" "+div.className+" ").indexOf("gwindow") != -1 && div.gwindow instanceof GWindow) list.push(div.gwindow);
		}
		return(list);
	}
	 
	function getConstant(key) {
		return(m_constants[key] ? m_constants[key] : key);
	}
	
	function getIndex(dock_status) {
		if (dock_status == undefined) dock_status = m_dock_status;
		return(dock_status == GWindow.DOCKED ? 0 : 1);
	}
	
	function isActive(status,dock_status) {
		if (dock_status == undefined) dock_status = m_dock_status;
		return(status == GWindow.ALWAYS || (status != GWindow.NEVER && status == dock_status));
	}
	                  
	function calculateStatus(bool,status,dock_status) {
		if (dock_status == undefined) dock_status = m_dock_status;
		if (bool) {
			if (status == GWindow.NEVER) status = dock_status; else 
			if (status != GWindow.ALWAYS && status != dock_status) status = GWindow.ALWAYS;
		} else {
			if (status == dock_status) status = GWindow.NEVER; else
			if (status == GWindow.ALWAYS) status = (dock_status == GWindow.DOCKED ? GWindow.UNDOCKED : GWindow.DOCKED);
		}
		return(status);
	}

	function createTitlebarIcon(icon_name,floatType,title) {
		var e = document.createElement("img");
		e.src = m_baseURL+"images/"+icon_name;
		e.className = "gbutton";
		e.style.padding = "1px";
		e.style.borderWidth = "0px";
		e.style.cursor = "default";
		e.style.cssFloat = e.style.styleFloat = floatType;
		if (title) {
			e.title = title;
			e.onmouseover = function() {
				e.style.padding = "0px";
				e.style.borderWidth = "1px";
			};
			e.onmouseout = function() {
				e.style.padding = "1px";
				e.style.borderWidth = "0px";
			};
		}
		m_eTitlebar.appendChild(e);
		return(e);
	}
	
	function getMaximumZIndex() {
		var zlimit = m_alwaysontop ? m_ontop_zlimit : m_basic_zlimit;
		var zmax = zlimit.min;
		var list = getWindows();
		for (var i = 0; i < list.length; i++) {
			var zindex = getZIndex(list[i].getElement());
			if (zindex >= zlimit.min && zindex < zlimit.max) zmax = Math.max(zmax,zindex);
		}
		return(zmax);
	}

	function resizeWindowForTitlebarDeltaWidth(dw,dock_status) {
		dw -= m_self.getWidth(dock_status)-m_self.getAllowableMinWidth(dock_status);
		if (dw < 0) dw = 0;
		if (dw > 0) {
			if (!m_self.isResizableH(dock_status) || !m_self.isAllowableDeltaWidth(dw,dock_status)) return(false);
			m_w[getIndex(dock_status)] += dw;
			if (m_self.isDocked()) updateAnchor();
		}
		return(true);
	}
		
	function resizeWindowForDeltaSize(dw,dh,dock_status) {
		var resize = false;
		var is_allowable = m_self.isAllowableDeltaSize(dw,dh,dock_status) && (!dw || m_self.isResizableH(dock_status)) && (!dh || m_self.isResizableV(dock_status));
		if (m_self.isPreservingBodySize(dock_status)) resize = is_allowable ? true : false;
		if (!resize && (dh > m_self.getBodyHeight(dock_status) || dw > m_self.getBodyWidth(dock_status))) resize = true;
		if (resize) {
			if (!is_allowable) return(false);
			var index = getIndex(dock_status);
			m_w[index] += dw;
			m_h[index] += dh;
			if (m_self.isDocked()) updateAnchor()
		}
		return(true);			
	}
	
	function updateBarText(element,text,maxw) {
		element.innerHTML = text;
		if (element.offsetWidth > maxw) element.innerHTML += "...";
		while (element.offsetWidth > maxw) {
			element.innerHTML = element.innerHTML.substring(0,element.innerHTML.length-4)+"...";
			if (element.innerHTML.length < 4) {
				element.innerHTML = "";
				return;
			}
		}
	}	
	
	function updateStatusbar() {
		var index = getIndex();
		updateBarText(m_eStatusText,m_status_text,m_w[index]-2*m_border[index]);
		m_eStatusText.style.marginTop = asPixel(Math.round((m_statusbar_h[index]-m_eStatusText.offsetHeight)/2));
	}
	
	function updateTitlebar() {
		var index = getIndex();
		m_eMinimize.src = m_baseURL+"images/"+(m_self.isMinimized() ? "icon_restore.png" : "icon_minimize.png");
		m_eMinimize.title = getConstant(m_self.isMinimized() ? "restore" : "minimize");
		m_eDock.src = m_baseURL+"images/"+(m_self.isDocked() ? "icon_undock.png" : "icon_dock.png");
		m_eDock.title = getConstant(m_self.isDocked() ? "undock" : "dock");		
		var list = {1:m_eIcon,2:m_eMinimize,3:m_eClose,4:m_eDock};
		for (var i in list) list[i].width = list[i].height = m_icon_size[index];
		showElement(m_eIcon,m_self.isIconVisible());
		showElement(m_eMinimize,m_self.isMinimizable());
		showElement(m_eClose,m_self.isClosable());
		showElement(m_eDock,m_self.isDockable());
		updateBarText(m_eTitle,m_title,m_w[index]-2*m_border[index]-m_self.getMinTitlebarWidth());
		var list = m_eTitlebar.childNodes;
		for (var i = 0; i < list.length; i++) list[i].style.marginTop = asPixel(Math.round((m_titlebar_h[index]-list[i].offsetHeight)/2));
	}
	
	function updateWindow() {
		updateTitlebar(); // First pass
		var index = getIndex();
		var minimized = m_self.isMinimized();
		var w = minimized ? m_self.getPreferredMinWidth()-2*m_border[index] : m_w[index]-2*m_border[index];
		var h = minimized ? m_titlebar_h[index] : m_h[index]-2*m_border[index]; 
		if (resizeElement(m_eWindow,w,h) && m_self.onResize) m_self.onResize(m_w[index],m_h[index],m_is_resizing);
		m_eWindow.style.borderWidth = asPixel(m_border[index]);
		moveElement(m_eWindow,m_x[index],m_y[index]);
		m_eBody.style.display = minimized ? "none" : "";		
		m_eBody.style.overflow = m_body_overflow[index];
		resizeElement(m_eTitlebar,w-2,m_titlebar_h[index]);
		m_eTitlebar.style.borderBottomWidth = asPixel(m_titlebar_border[index]);
		var visible = m_self.isTitlebarVisible();
		showElement(m_eTitlebar,visible);
		updateTitlebar(); // Second pass		
		if (minimized) return;
		var top = 0;
		if (visible) top += m_titlebar_h[index]+m_titlebar_border[index];
		var size = m_self.getBodySize();
		if (resizeElement(m_eBody,size.w,size.h) && m_self.onBodyResize) m_self.onBodyResize(size.w,size.h,m_is_resizing);
		moveElement(m_eBody,0,top);
		var resizableV = m_self.isResizableV();
		var resizableH = m_self.isResizableH();
		resizeElement(m_eResizeH,m_resize_w[index],size.h+(m_self.isStatusbarVisible() ? m_statusbar_h[index]+m_statusbar_border[index] : 0)+(resizableV ? m_resize_border[index] : 0));
		m_eResizeH.style.borderLeftWidth = asPixel(m_resize_border[index]);
		moveElement(m_eResizeH,size.w,top);
		showElement(m_eResizeH,resizableH);
		top += size.h;
		resizeElement(m_eStatusbar,size.w,m_statusbar_h[index]);
		m_eStatusbar.style.borderTopWidth = asPixel(m_statusbar_border[index]);
		moveElement(m_eStatusbar,0,top);
		visible = m_self.isStatusbarVisible();
		showElement(m_eStatusbar,visible);
		updateStatusbar();
		if (visible) top += m_statusbar_h[index]+m_statusbar_border[index];
		resizeElement(m_eResizeV,size.w+(resizableH ? m_resize_border[index] : 0),m_resize_w[index]);
		m_eResizeV.style.borderTopWidth = asPixel(m_resize_border[index]);
		moveElement(m_eResizeV,0,top);
		showElement(m_eResizeV,resizableV);
		resizeElement(m_eResize,m_resize_w[index],m_resize_w[index]);
		moveElement(m_eResize,size.w+m_resize_border[index],top+m_resize_border[index]);
		showElement(m_eResize,resizableH && resizableV);
	}
	
	function updateWindowDocked() {
		if (m_eWindow.parentNode != m_eAnchor.parentNode) m_eAnchor.parentNode.appendChild(m_eWindow);
		var x = m_eAnchor.offsetLeft;
		var y = m_eAnchor.offsetTop;
		var w = m_eAnchor.offsetWidth;
		var h = m_eAnchor.offsetHeight;
		if (w < m_self.getAllowableMinWidth() || h < m_self.getAllowableMinHeight()) {
			m_self.setDockable(true);
			m_self.dock(false);
			return;
		}	
		var index = getIndex();
		var update = false;
		if (m_x[index] !== x || m_y[index] !== y) {
			m_x[index] = x;
			m_y[index] = y;
			moveElement(m_eBody,x,y);
			update = true;
		}
		if (m_w[index] !== w || m_h[index] !== h) {
			m_w[index] = w;
			m_h[index] = h;
			update = true;
		}
		if (update) updateWindow();
	}

	function updateAnchor() {
		var w = m_self.getWidth();
		var list = {1:"paddingLeft",2:"paddingRight",3:"borderLeftWidth",4:"borderRightWidth"};
		for (var i in list) if (m_eAnchor.style[list[i]]) w -= parseInt(m_eAnchor.style[list[i]]);
		m_eAnchor.style.width = asPixel(w);
		var h = m_self.getHeight();
		list = {1:"paddingTop",2:"paddingBottom",3:"borderTopWidth",4:"borderBottomWidth"};
		for (var i in list) if (m_eAnchor.style[list[i]]) h -= parseInt(m_eAnchor.style[list[i]]);
		m_eAnchor.style.height = asPixel(h);
	}
			
	function updateMoveListeners(type) {
		m_ml.removeListener(m_eTitlebar,"mousedown",mouseListener);
		m_ml.removeListener(m_eBody,"mousedown",mouseListener);
		if (m_self.isDocked()) return;
		var movable = (type == GWindow.TITLEBAR || type == GWindow.BOTH);
		if (movable) m_ml.addListener(m_eTitlebar,"mousedown",mouseListener);
		m_eTitlebar.style.cursor = movable ? "move" : "default";
		movable = (type == GWindow.BODY || type == GWindow.BOTH);
		if (movable) m_ml.addListener(m_eBody,"mousedown",mouseListener);
		m_eBody.style.cursor = movable ? "move" : "default";	
	}
	
	function mouseListener(e) {
		var index = getIndex();
		switch (e.type) {
		case 'mousedown':
			if (e.button != "L") return;
			m_self.moveToTop();
			m_eActive = e.client;
			m_ml.addListener(document,"mousemove",mouseListener);
			m_ml.addListener(document,"mouseup",mouseListener);
			document.onselectstart = function() {return(false);};
			document.body.style.cursor = e.client.style.cursor;
			if (m_eActive == m_eBody || m_eActive == m_eTitlebar) m_is_moving = true; else {
				m_is_resizing = true;
				if (m_self.isDocked()) clearInterval(m_dock_interval_id);
			}
			break;
		case 'mouseup':
			if (!m_eActive) return;
			m_ml.removeListener(document,"mousemove",mouseListener);
			m_ml.removeListener(document,"mouseup",mouseListener);
			document.onselectstart = function() {return(true);};
			document.body.style.cursor = "default";
			if (m_eActive == m_eBody || m_eActive == m_eTitlebar) {
				m_is_moving = false
				if (m_self.onMove) m_self.onMove(m_x[index],m_y[index],false); 
			} else {
				m_is_resizing = false;
				if (m_self.onResize) m_self.onResize(m_w[index],m_h[index],false);
				if (m_self.onBodyResize) m_self.onBodyResize(m_self.getBodyWidth(),m_self.getBodyHeight(),false);
				if (m_self.isDocked()) m_dock_interval_id = setInterval(updateWindowDocked,m_dock_interval);
			}
			m_eActive = null;
			break;
		case 'mousemove':
			switch (m_eActive) {
				case m_eBody: 
				case m_eTitlebar: m_self.move(m_x[index]+e.deltaX,m_y[index]+e.deltaY); break; 
				case m_eResize: 	m_self.setSize(m_w[index]+e.deltaX,m_h[index]+e.deltaY); break;
				case m_eResizeV: 	m_self.setSize(m_w[index],m_h[index]+e.deltaY); break;
				case m_eResizeH: 	m_self.setSize(m_w[index]+e.deltaX,m_h[index]); break;
			}
			break;
		}
		return(false); // prevent propagation
	}
	
	/*
	 * Window Functions
	 */
	this.isVisible = function() { 
		return(m_is_visible); 
	}

	this.show = function(bool) {
		if (!this.isEnabled()) return(false);
		if (m_is_visible == bool) return(true);
		m_is_visible = bool;
		m_eWindow.style.display = bool ? "" : "none";
		if (bool && this.onShow) this.onShow(); else if (!bool && this.onHide) this.onHide();
		return(true);
	}
		
	this.isEnabled = function() { 
		return(m_is_enabled); 
	}

	this.enable = function(bool) {
		if (m_is_closed == true) return(false);
		if (m_is_enabled == bool) return(true);
		m_ml.enable(bool);
		m_is_enabled = bool;
		showElement(m_eCurtain,!bool);
		if (bool && this.onEnable) this.onEnable(); else if (!bool && this.onDisable) this.onDisable();
		return(true);
	}

	this.getElement = function() {
		return(m_eWindow);
	}

	this.getBodyElement = function() {
		return(m_eBody);
	}
	
	this.getContainer = function() {
		return(m_eContainer);
	}

	/*
	 * Close Functions
	 */
	this.isClosable = function(dock_status) {
		return(isActive(m_closable,dock_status));
	}

	this.getClosable = function() {
		return(m_closable);
	}
	
	this.setClosable = function(bool,dock_status) { 
		if (!this.isEnabled()) return(false);
		if (this.isClosable(dock_status) == bool) return(true);
		if (bool && !resizeWindowForTitlebarDeltaWidth(this.getIconSize(dock_status)+2,dock_status)) return(false);
		m_closable = calculateStatus(bool,m_closable,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}

	this.close = function() {
		if (!this.isEnabled() || !this.isClosable()) return(false);
		this.show(false);
		this.enable(false);
		if (this.onClose) this.onClose();
		m_is_closed = true;
		return(true);
	}	
		
	/*
	 * Minimize Functions
	 */
	this.isMinimized = function(dock_status) { 
		return(m_is_minimized[getIndex(dock_status)]); 
	}

	this.isMinimizable = function(dock_status) {
		return(isActive(m_minimizable,dock_status));
	}

	this.getMinimizable = function() { 
		return(m_minimizable); 
	}
		
	this.setMinimizable = function(bool,dock_status) { 
		if (!this.isEnabled()) return(false);
		if (this.isMinimizable(dock_status) == bool) return(true);
		if (bool && !resizeWindowForTitlebarDeltaWidth(this.getIconSize(dock_status)+2,dock_status)) return(false);
		m_minimizable = calculateStatus(bool,m_minimizable,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.minimize = function(bool,dock_status) {
		if (bool == undefined) bool = true;
		if (!this.isEnabled() || !this.isMinimizable(dock_status)) return(false);
		if (this.isMinimized(dock_status) == bool) return(true);
		m_is_minimized[getIndex(dock_status)] = bool;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		if (bool && this.onMinimize) this.onMinimize(); else if (!bool && this.onRestore) this.onRestore();
	}
	
	/*
	 * Move Functions
	 */
	this.getX = function(dock_status) {
		return(m_x[getIndex(dock_status)]);
	}
	
	this.getY = function(dock_status) {
		return(m_y[getIndex(dock_status)]);
	}
	
	this.getPosition = function(dock_status) {
		var pos = {};
		pos.x = this.getX(dock_status);
		pos.y = this.getY(dock_status);
		return(pos);		
	}
	
	this.isMovable = function() { 
		return(m_movable); 
	}

	this.getMoveType = function() { 
		return(m_move_type); 
	}

	this.setMoveType = function(type) {
		if (!this.isEnabled() || this.isDocked()) return(false);
		if (type == m_move_type) return(true);
		m_move_type = type;
		updateMoveListeners(m_move_type);
		return(true);
	}
	
	this.setMovable = function(bool,type) {
		if (!this.isEnabled()) return(false);
		if (this.isMovable() == bool) return(true);
		if (type) m_move_type = type;
		m_movable = bool;
		updateMoveListeners(bool ? m_move_type : null);
	}
	
	this.move = function(x,y) {
		if (!this.isEnabled() || !this.isMovable()) return(false);
		var index = getIndex(GWindow.UNDOCKED);
		if (m_x[index] == x && m_y[index] == y) return(true);
		if (this.onMove(x,y,m_is_moving) == false) return(false);
		m_x[index] = x;
		m_y[index] = y;
		if (!this.isDocked()) moveElement(m_eWindow,x,y);
		return(true);
	}
		
	/*
	 * Docking Functions
	 */
	this.isDockable = function() { 
		return(m_dockable); 
	}

	this.isDocked = function() { 
		return(m_dock_status == GWindow.DOCKED); 
	}

	this.getAnchor = function() { 
		return(m_eAnchor); 
	}	

	this.setAnchor = function(anchor) {
		if (!this.isEnabled()) return(false);
		if (m_eAnchor == anchor) return(true);
		if (this.isDocked() && (this.getAllowableMinWidth() > m_eAnchor.offsetWidth || this.getAllowableMinHeight() > m_eAnchor.offsetHeight)) return(false);			
		m_eAnchor = anchor;
		if (this.isDocked()) updateWindowDocked();
		return(true);
	}
	
	this.setDockable = function(bool) { 
		if (!this.isEnabled()) return(false);
		if (this.isDockable() == bool) return(true);
		if (bool && !resizeWindowForTitlebarDeltaWidth(this.getIconSize()+2)) return(false);
		m_dockable = bool;
		updateWindow();
		return(true);
	}
		
	this.dock = function(bool,interval) {
		if (!this.isEnabled() || !this.isDockable() || !m_eAnchor) return(false);
		if (this.isDocked() == bool) return(true);
		if (bool && (this.getAllowableMinWidth(GWindow.DOCKED) > m_eAnchor.offsetWidth || this.getAllowableMinHeight(GWindow.DOCKED) > m_eAnchor.offsetHeight)) return(false);
		m_dock_status = bool ? GWindow.DOCKED : GWindow.UNDOCKED;
		if (bool) {
			var index = getIndex();
			m_x[index] = m_y[index] = m_w[index] = m_h[index] = null;
			if (interval) m_dock_interval = interval;
			m_dock_interval_id = setInterval(updateWindowDocked,m_dock_interval);
			updateWindowDocked();
			if (this.onDock) this.onDock();
		} else {
			clearInterval(m_dock_interval_id);
			m_eContainer.appendChild(m_eWindow);
			this.moveToTop();
			updateWindow();
			if (this.onUndock) this.onUndock();
		}
		updateMoveListeners(bool ? null : m_move_type);
	}
	
	/*
	 * On-top Functions
	 */
	this.moveToTop = function() {
		if (!this.isEnabled() || this.isDocked()) return(false);
		var zmax = getMaximumZIndex();
		var zlimit = m_alwaysontop ? m_ontop_zlimit : m_basic_zlimit;
		var zindex = getZIndex(m_eWindow);
		if (zindex == zmax) return(true);
		m_eWindow.style.zIndex = zlimit.max;
		var list = getWindows();
		for (var i = 0; i < list.length; i++) {
			var element = list[i].getElement();
			var z = getZIndex(element);
			if (z > zindex && z >= zlimit.min && z < zlimit.max) element.style.zIndex = z-1;
		}
		m_eWindow.style.zIndex = zmax;
	}	

	this.isAlwaysOnTop = function() { 
		return(m_alwaysontop); 
	}
	
	this.alwaysOnTop = function(bool) {
		if (!this.isEnabled()) return;
		if (m_alwaysontop == bool) return;
		this.moveToTop();
		m_alwaysontop = bool;
		this.moveToTop();
	}

	/*
	 * Icon Functions
	 */
	this.isIconVisible = function(dock_status) {
		return(isActive(m_show_icon,dock_status));
	}
	
	this.getIconSize = function(dock_status) {
		return(m_icon_size[getIndex(dock_status)]);
	}
	
	this.setIconSize = function(size,resize_titlebar,dock_status) {
		if (!this.isEnabled() || !this.isTitlebarVisible(dock_status)) return(false);
		var index = getIndex(dock_status);
		if (m_icon_size[index] == size) return(true);
		var d = size-m_icon_size[index];
		var num_icons = 0;
		if (this.isIconVisible(dock_status)) num_icons++;
		if (this.isMinimizable(dock_status)) num_icons++;
		if (this.isClosable(dock_status)) num_icons++;
		if (this.isDockable(dock_status)) num_icons++;
		if (!resizeWindowForTitlebarDeltaWidth(d*num_icons,dock_status)) return(false);
		if (resize_titlebar && resizeWindowForDeltaSize(0,d,dock_status)) m_titlebar_h[index] += d;
		m_icon_size[index] = size;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.setIcon = function(icon_url) {
		if (!this.isEnabled()) return(false);
		m_eIcon.src = icon_url;
		updateTitlebar();
		return(true);
	}

	this.showIcon = function(bool,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.isIconVisible(dock_status) == bool) return(true);
		if (bool && !resizeWindowForTitlebarDeltaWidth(this.getIconSize()+2,dock_status)) return(false);
		m_show_icon = calculateStatus(bool,m_show_icon,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
		
	/*
	 * Size Functions
	 */
	this.getWidth = function(dock_status) {
		return(m_w[getIndex(dock_status)]);
	}
	
	this.getHeight = function(dock_status) {
		return(m_h[getIndex(dock_status)]);
	}
	
	this.getSize = function(dock_status) {
		var size = {};
		size.w = this.getWidth(dock_status);
		size.h = this.getHeight(dock_status);
		return(size);
	}
	
	this.getBodyWidth = function(dock_status) {
		var index = getIndex(dock_status);
		var w = m_w[index];
		w -= 2*m_border[index];
		if (this.isResizableH(dock_status)) w -= m_resize_w[index]+m_resize_border[index];
		return(w);
	}	
	
	this.getBodyHeight = function(dock_status) {
		return(this.getHeight(dock_status)-this.getAllowableMinHeight(dock_status));
	}
	
	this.getBodySize = function(dock_status) {
		var size = {};
		size.w = this.getBodyWidth(dock_status);
		size.h = this.getBodyHeight(dock_status);
		return(size);
	}
	
	this.getMinWidth = function(dock_status) {
		return(m_minw[getIndex(dock_status)]);
	}
	
	this.getMinHeight = function(dock_status) {
		return(m_minh[getIndex(dock_status)]);
	}
	
	this.getMinSize = function(dock_status) {
		var size = {};
		size.w = this.getMinWidth(dock_status);
		size.h = this.getMinHeight(dock_status);
		return(size);
	}
	
	this.getMaxWidth = function(dock_status) {
		return(m_maxw[getIndex(dock_status)]);
	}
	
	this.getMaxHeight = function(dock_status) {
		return(m_maxh[getIndex(dock_status)]);
	}
	
	this.getMaxSize = function(dock_status) {
		var size = {};
		size.w = this.getMaxWidth(dock_status);
		size.h = this.getMaxHeight(dock_status);
		return(size);
	}

	this.isAllowableWidth = function(w,dock_status) {
		var minw = Math.max(this.getMinWidth(dock_status),this.getAllowableMinWidth(dock_status));
		return(w >= minw && w <= this.getMaxWidth(dock_status));
	}
	        
	this.isAllowableHeight = function(h,dock_status) {
		var minh = Math.max(this.getMinHeight(dock_status),this.getAllowableMinHeight(dock_status));
		return(h >= minh && h <= this.getMaxHeight(dock_status));
	}
	
	this.isAllowableSize = function(w,h,dock_status) {
		return(this.isAllowableWidth(w,dock_status) && this.isAllowableHeight(h,dock_status));
	}
	
	this.isAllowableDeltaWidth = function(dw,dock_status) {
		return(this.isAllowableWidth(this.getWidth(dock_status)+dw));
	}
	
	this.isAllowableDeltaHeight = function(dh,dock_status) {
		return(this.isAllowableHeight(this.getHeight(dock_status)+dh));
	}
	
	this.isAllowableDeltaSize = function(dw,dh,dock_status) {
		return(this.isAllowableDeltaWidth(dw,dock_status) && this.isAllowableDeltaHeight(dh,dock_status));
	}
	
	this.getAllowableMinWidth = function(dock_status) {
		var index = getIndex(dock_status);
		var w = 2*m_border[index];
		var mw1 = this.isResizableH(dock_status) ? m_resize_w[index]+m_resize_border[index] : 0;
		var mw2 = this.isTitlebarVisible(dock_status) ? this.getMinTitlebarWidth() : 0;
		w += Math.max(mw1,mw2);
		return(w); 
	}
	
	this.getAllowableMinHeight = function(dock_status) {
		var index = getIndex(dock_status);
		var h = 2*m_border[index];
		if (this.isTitlebarVisible(dock_status)) h += m_titlebar_h[index]+m_titlebar_border[index];
		if (this.isStatusbarVisible(dock_status)) h += m_statusbar_h[index]+m_statusbar_border[index];
		if (this.isResizableV(dock_status)) h += m_resize_w[index]+m_resize_border[index];
		return(h);
	}
	
	this.getAllowableMinSize = function(dock_status) {
		var size = {};
		size.w = this.getAllowableMinWidth(dock_status);
		size.h = this.getAllowableMinHeight(dock_status);
		return(size);
	}

	this.getPreferredMinWidth = function(dock_status) {
		var w = this.getMinTitlebarWidth(dock_status);
		var title = m_eTitle.innerHTML;
		m_eTitle.innerHTML = m_title;
		w += m_eTitle.offsetWidth+10;
		m_eTitle.innerHTML = title;
		return(w);
	}
		
	/*
	 * Resize Functions
	 */
	this.isResizableV = function(dock_status) {
		return(isActive(m_resizable_v,dock_status));
	}
	
	this.isResizableH = function(dock_status) {
		return(isActive(m_resizable_h,dock_status));
	}

	this.getResizableH = function() {
		return(m_resizable_h);
	}
	
	this.getResizableV = function() {
		return(m_resizable_v);
	}
	
	this.showResizeV = function(bool,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.isResizableV(dock_status) == bool) return(true);
		var index = getIndex(dock_status);
		var dh = (m_resize_w[index]+m_resize_border[index])*(bool ? 1 : -1);
		if (this.isPreservingBodySize(dock_status) || dh > this.getBodyHeight(dock_status)) {
			if (!this.isAllowableDeltaHeight(dh,dock_status)) return(false);
			m_h[index] += dh;
			if (this.isDocked()) updateAnchor();
		}
		m_resizable_v = calculateStatus(bool,m_resizable_v,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
		
	this.showResizeH = function(bool,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.isResizableH(dock_status) == bool) return(true);
		var index = getIndex(dock_status);
		var dw = (m_resize_w[index]+m_resize_border[index])*(bool ? 1 : -1);
		if (this.isPreservingBodySize(dock_status) || dw > this.getBodyWidth(dock_status)) {
			if (!this.isAllowableDeltaWidth(dw,dock_status)) return(false);
			m_w[index] += dw;
			if (this.isDocked()) updateAnchor();
		}
		m_resizable_h = calculateStatus(bool,m_resizable_h,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.getResizeWidth = function(dock_status) {
		return(m_resize_w[getIndex(dock_status)]);
	}
	
	this.getResizeBorder = function(dock_status) {
		return(m_resize_border[getIndex(dock_status)]);
	}

	this.setResizeWidth = function(w,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_resize_w[index] == w) return(true);
		var d = w-m_resize_w[index];
		if (!resizeWindowForDeltaSize(d,d,dock_status)) return(false);
		m_resize_w[index] = w;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.setResizeBorder = function(border,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_resize_border[index] == border) return(true);
		var d = border-m_resize_border[index];
		if (!resizeWindowForDeltaSize(d,d,dock_status)) return(false);
		m_resize_border[index] = border;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
		
	this.getPreserveBodySize = function() {
		return(m_preserve_body_size);
	}
	
	this.isPreservingBodySize = function(dock_status) {
		return(isActive(m_preserve_body_size,dock_status));
	}
	
	this.preserveBodySize = function(bool,dock_status) {
		m_preserve_body_size = calculateStatus(bool,m_preserve_body_size,dock_status);
	}
	
	this.setMaxWidth = function(w,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.getMaxWidth(dock_status) == w) return(true);
		if (w < Math.max(this.getMinWidth(dock_status),this.getAllowableMinWidth(dock_status))) return(false);
		if (dock_status == undefined) dock_status = m_dock_status;
		var index = getIndex(dock_status);
		if (dock_status == GWindow.DOCKED && m_w[index] > w && !this.isResizableH(dock_status)) return(false);
		m_maxw[index] = w;
		if (m_w[index] > w) {
			m_w[index] = w;
			if (dock_status == m_dock_status) updateWindow();
		}		
		return(true);
	}
	
	this.setMaxHeight = function(h,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.getMaxHeight(dock_status) == h) return(true);
		if (h < Math.max(this.getMinHeight(dock_status),this.getAllowableMinHeight(dock_status))) return(false);
		if (dock_status == undefined) dock_status = m_dock_status;
		var index = getIndex(dock_status);
		if (dock_status == GWindow.DOCKED && m_h[index] > h && !this.isResizableV(dock_status)) return(false);
		m_maxh[index] = h;
		if (m_h[index] > h) {
			m_h[index] = h;
			if (dock_status == m_dock_status) updateWindow();
		}		
		return(true);	
	}
	
	this.setMaxSize = function(w,h,dock_status) {
		return(this.setMaxWidth(w,dock_status) && this.setMaxHeight(h,dock_status));
	}
	
	this.setMinWidth = function(w,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.getMinWidth(dock_status) == w) return(true);
		if (dock_status == undefined) dock_status = m_dock_status;
		var index = getIndex(dock_status);
		if (dock_status == GWindow.DOCKED && m_w[index] < w && !this.isResizableH(dock_status)) return(false);
		m_minw[index] = w;
		if (m_w[index] < w) {
			m_w[index] = w;
			if (dock_status == m_dock_status) updateWindow();
		} 
		return(true);
	}

	this.setMinHeight = function(h,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.getMinHeight(dock_status) == h) return(true);
		if (dock_status == undefined) dock_status = m_dock_status;
		var index = getIndex(dock_status);
		if (dock_status == GWindow.DOCKED && m_h[index] < h && !this.isResizableV(dock_status)) return(false);
		m_minh[index] = h;
		if (m_h[index] < h) {
			m_h[index] = h;
			if (dock_status == m_dock_status) updateWindow();
		} 
		return(true);
	}
		
	this.setMinSize = function(w,h,dock_status) {
		return(this.setMinWidth(w,dock_status) && this.setMinHeight(h,dock_status));
	}
	
	this.setWidth = function(w,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (this.getWidth(dock_status) == w) return(true);
		if (!this.isResizableH(dock_status) || !this.isAllowableWidth(w,dock_status)) return(false);
		m_w[getIndex(dock_status)] = w;		
		if (this.isDocked()) updateAnchor();
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);		
	}
	
	this.setHeight = function(h,dock_status) {
		if (!this.isEnabled()) return(false);
		if (this.getHeight(dock_status) == h) return(true);
		if (!this.isResizableV(dock_status) || !this.isAllowableHeight(h,dock_status)) return(false);
		m_h[getIndex(dock_status)] = h;
		if (this.isDocked()) updateAnchor();
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.setSize = function(w,h,dock_status) {
		return(this.setWidth(w,dock_status) && this.setHeight(h,dock_status));
	}
	
	this.setBodyWidth = function(w,dock_status) {
		var dw = this.getWidth()-this.getBodyWidth();
		return(this.setWidth(w+dw,dock_status));
	}
	
	this.setBodyHeight = function(h,dock_status) {
		var dh = this.getHeight()-this.getBodyHeight();
		return(this.setHeight(h+dh,dock_status));
	}
	
	this.setBodySize = function(w,h,dock_status) {
		return(this.setBodyWidth(w,dock_status) && this.setBodyHeight(h,dock_status));
	}
	
	this.setBodyOverflow = function(overflow,dock_status) {
		if (!this.isEnabled()) return(false);
		m_body_overflow[getIndex(dock_status)] = overflow;
		m_eBody.style.overflow = overflow;
	}
	
	this.getBodyOverflow = function(dock_status) {
		return(m_body_overflow[getIndex(dock_status)]);
	}
	/*
	 * Border Functions
	 */
	this.getBorder = function(dock_status) { 
		return(m_border[getIndex(dock_status)]); 
	}
	
	this.setBorder = function(border,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_border[index] == border) return(true);
		var d = (border-m_border[index])*2;
		if (!resizeWindowForDeltaSize(d,d,dock_status)) return(false);
		m_border[index ] = border;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
		
	/*
	 * Titlebar Functions
	 */
	this.isTitlebarVisible = function(dock_status) { 
		return(isActive(m_show_titlebar,dock_status));
	}
	
	this.showTitlebar = function(bool,dock_status) {
		if (!this.isEnabled() || this.isMinimized(dock_status)) return(false);
		if (this.isTitlebarVisible(dock_status) == bool) return(true);
		var dh = (this.getTitlebarHeight(dock_status)+this.getTitlebarBorder(dock_status))*(bool ? 1 : -1);
		if (!resizeWindowForDeltaSize(0,dh,dock_status)) return(false);
		m_show_titlebar = calculateStatus(bool,m_show_titlebar,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}

	this.getTitlebarHeight = function(dock_status) { 
		return(m_titlebar_h[getIndex(dock_status)]); 
	}

	this.setTitlebarHeight = function(h,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_titlebar_h[index] == h) return(true);
		if (h < this.getMinTitlebarHeight(dock_status)) return(false);
		if (!resizeWindowForDeltaSize(0,h-m_titlebar_h[index],dock_status)) return(false);
		m_titlebar_h[index] = h;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.getTitlebarBorder = function(dock_status) {
		return(m_titlebar_border[getIndex(dock_status)]);
	}
	
	this.setTitlebarBorder = function(border,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_titlebar_border[index] == border) return(true);
		if (!resizeWindowForDeltaSize(0,border-m_titlebar_border[index],dock_status)) return(false);
		m_titlebar_border[index] = border;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.setTitle = function(title) {
		if (!this.isEnabled()) return(false);
		m_title = title;
		updateTitlebar();
		return(true);
	}

	this.getTitle = function() { 
		return(m_title); 
	}
	
	this.getMinTitlebarWidth = function(dock_status) {
		var w = 2;
		if (this.isIconVisible(dock_status)) w += m_eIcon.offsetWidth;
		if (this.isMinimizable(dock_status)) w += m_eMinimize.offsetWidth;
		if (this.isClosable(dock_status)) w += m_eClose.offsetWidth;
		if (this.isDockable()) w += m_eDock.offsetWidth;
		return(w);
	}
	
	this.getMinTitlebarHeight = function(dock_status) {
		var h = m_icon_size[getIndex(dock_status)];
		h += 2; // Add 2px padding
		h += 2; // Add a minimum of 1px margin for top and bottom
		return(h);
	}
	
	/*
	 * Statusbar Functions
	 */
	this.isStatusbarVisible = function(dock_status) { 
		return(isActive(m_show_statusbar,dock_status));
	}

	this.showStatusbar = function(bool,dock_status) {
		if (!this.isEnabled() || this.isMinimized(dock_status)) return(false);
		if (this.isStatusbarVisible(dock_status) == bool) return(true);
		if (!resizeWindowForDeltaSize(0,(this.getStatusbarHeight(dock_status)+this.getStatusbarBorder(dock_status))*(bool ? 1 : -1),dock_status)) return(false);
		m_show_statusbar = calculateStatus(bool,m_show_statusbar,dock_status);
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}

	this.getStatusbarHeight = function(dock_status) { 
		return(m_statusbar_h[getIndex(dock_status)]); 
	}
		
	this.setStatusbarHeight = function(h,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_statusbar_h[index] == h) return(true);
		if (!resizeWindowForDeltaSize(0,h-m_statusbar_h[index],dock_status)) return(false);
		m_statusbar_h[index] = h;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}	
		
	this.getStatusbarBorder = function(dock_status) {
		return(m_statusbar_border[getIndex(dock_status)]);
	}
	
	this.setStatusbarBorder = function(border,dock_status) {
		if (!this.isEnabled()) return(false);
		var index = getIndex(dock_status);
		if (m_statusbar_border[index] == border) return(true);
		if (!resizeWindowForDeltaSize(0,border-m_statusbar_border[index],dock_status)) return(false);
		m_statusbar_border[index] = border;
		if (dock_status == undefined || dock_status == m_dock_status) updateWindow();
		return(true);
	}
	
	this.setStatusText = function(text) {
		if (!this.isEnabled()) return(false);
		m_status_text = text;
		updateStatusbar();
		return(true);
	}
	
	this.getStatusText = function() {
		return(m_status_text);
	}	
	
	/*
	 * Callback Functions
	 */	
	this.onMove = function(x,y,is_moving) { 
		return(true); 
	}
	this.onResize	= function(w,h,is_resizing) {}
	this.onBodyResize = function(w,h,is_resizing) {}
	this.onDock = function() {}
	this.onUndock = function() {} 
	this.onMinimize = function() {}
	this.onRestore = function() {}
	this.onShow = function() {}
	this.onHide = function() {}
	this.onEnable = function() {}
	this.onDisable = function() {}
	this.onClose = function() {}

	/*
	 * Initialize GWindow
	 */
	if (!m_title) m_title = "";
	if (!m_eContainer) m_eContainer = document.body;
	if (m_user_constants) for (var i in m_user_constants) m_constants[i] = m_user_constants[i];
			
	// Main window
	var m_eWindow = document.createElement("div");
	m_eWindow.className = "gwindow";
	m_eWindow.gwindow = this;
	with (m_eWindow.style) {
		position = "absolute";
		zIndex = getMaximumZIndex()+1;
		overflow = "hidden";
	}
	m_eContainer.appendChild(m_eWindow);

	// Titlebar
	var m_eTitlebar = document.createElement("div");
	m_eTitlebar.className = "gwindow_titlebar";
	with (m_eTitlebar.style) {
		position = "absolute";
		left = "0px";
		top = "0px";
		paddingLeft = "1px";
		paddingRight = "1px";
		overflow = "hidden";
		borderWidth = "0px";
	}
	m_eWindow.appendChild(m_eTitlebar);

	// Buttons
	var m_eIcon = createTitlebarIcon("icon_window.png","left");

	var m_eDock = createTitlebarIcon("icon_dock.png","right",getConstant("dock"));
	m_eDock.onclick = function () { 
		m_self.dock(!m_self.isDocked()); 
	};

	var m_eClose = createTitlebarIcon("icon_close.png","right",getConstant("close"));
	m_eClose.onclick = function () { 
		m_self.close();
	};

	var m_eMinimize = createTitlebarIcon("icon_minimize.png","right",getConstant("minimize"));
	m_eMinimize.onclick = function () { 
		m_self.minimize(!m_self.isMinimized()); 
	};
	
	var m_eTitle = document.createElement("div");
	m_eTitle.style.whiteSpace = "nowrap";
	m_eTitle.style.cssFloat = m_eTitle.style.styleFloat = "left";
	m_eTitlebar.appendChild(m_eTitle);

	// Body
	var m_eBody = document.createElement("div");
	with (m_eBody.style) {
		position = "absolute";
		left = "0px";
		//overflow = "auto";
		border = "none";
	}
	m_eWindow.appendChild(m_eBody);

	// Statusbar
	var m_eStatusbar = document.createElement("div");
	m_eStatusbar.className = "gwindow_statusbar";
	with (m_eStatusbar.style) {
		position = "absolute";
		left = "0px";
		overflow = "hidden";
		borderWidth = "0px";
	}
	m_eWindow.appendChild(m_eStatusbar);

	var m_eStatusText = document.createElement("div");
	m_eStatusText.style.whiteSpace = "nowrap";
	m_eStatusbar.appendChild(m_eStatusText);
			
	// Vertical Resize
	var m_eResizeV = document.createElement("img");
	m_eResizeV.src = m_baseURL+"images/resizev.png";
	m_eResizeV.title = getConstant("resize_vertical");
	m_eResizeV.className = "gwindow_resize";
	with (m_eResizeV.style) {
		position = "absolute";
		left = "0px";
		cursor = "n-resize";
		borderWidth = "0px";
	}
	m_eWindow.appendChild(m_eResizeV);

	// Horizontal Resize
	var m_eResizeH = document.createElement("img");
	m_eResizeH.src = m_baseURL+"images/resizeh.png";
	m_eResizeH.title = getConstant("resize_horizontal");
	m_eResizeH.className = "gwindow_resize";
	with (m_eResizeH.style) {
		position = "absolute";
		cursor = "e-resize";
		borderWidth = "0px";
	}
	m_eWindow.appendChild(m_eResizeH);
	
	// Diagonal Resize
	var m_eResize = document.createElement("img");
	m_eResize.src = m_baseURL+"images/resize.png";
	m_eResize.title = getConstant("resize");
	with (m_eResize.style) {
		position = "absolute";
		cursor = "se-resize";
	}
	m_eWindow.appendChild(m_eResize);
	
	var m_eCurtain = document.createElement("div");
	with (m_eCurtain.style) {
		position = "absolute";
		top = "0px"
		left = "0px";
		width = "100%";
		height = "100%";
		background = "#000";
		filter = "alpha(opacity=30)";
		opacity = ".30";
		display = "none";
	}
	m_eWindow.appendChild(m_eCurtain);
		
	var list = {1:GWindow.UNDOCKED,2:GWindow.DOCKED};
	for (var i in list) {
		var index = getIndex(list[i]);
		m_titlebar_h[index] = Math.max(this.getMinTitlebarHeight(list[i]),m_titlebar_h[index]);	
		m_w[index] = this.getPreferredMinWidth(list[i]);
		m_h[index] = this.getAllowableMinHeight(list[i]);
	}
	updateWindow();	
	
	// Prevent dragging in IE (needed for proper window resizing)
	document.ondragstart = function() {return(false);};

	updateMoveListeners(m_move_type);
	m_ml.addListener(m_eResize,"mousedown",mouseListener);
	m_ml.addListener(m_eResizeH,"mousedown",mouseListener);
	m_ml.addListener(m_eResizeV,"mousedown",mouseListener);
	m_ml.addListener(m_eWindow,"mousedown",function () { 
		m_self.moveToTop(); 
	});
}
