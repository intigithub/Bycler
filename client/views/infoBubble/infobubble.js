var InfoBubble = function (opt_options) {
    this.extend(InfoBubble, google.maps.OverlayView);
    this.baseZIndex_ = 100;
    this.isOpen_ = false;

    var options = opt_options || {};

    if (options['backgroundColor'] == undefined) {
        options['backgroundColor'] = this.BACKGROUND_COLOR_;
    }

    if (options['borderColor'] == undefined) {
        options['borderColor'] = this.BORDER_COLOR_;
    }

    if (options['borderRadius'] == undefined) {
        options['borderRadius'] = this.BORDER_RADIUS_;
    }

    if (options['borderWidth'] == undefined) {
        options['borderWidth'] = this.BORDER_WIDTH_;
    }

    if (options['padding'] == undefined) {
        options['padding'] = this.PADDING_;
    }

    if (options['arrowPosition'] == undefined) {
        options['arrowPosition'] = this.ARROW_POSITION_;
    }

    if (options['disableAutoPan'] == undefined) {
        options['disableAutoPan'] = false;
    }

    if (options['disableAnimation'] == undefined) {
        options['disableAnimation'] = false;
    }

    if (options['minWidth'] == undefined) {
        options['minWidth'] = this.MIN_WIDTH_;
    }

    if (options['shadowStyle'] == undefined) {
        options['shadowStyle'] = this.SHADOW_STYLE_;
    }

    if (options['arrowSize'] == undefined) {
        options['arrowSize'] = this.ARROW_SIZE_;
    }

    if (options['arrowStyle'] == undefined) {
        options['arrowStyle'] = this.ARROW_STYLE_;
    }

    this.buildDom_();

    this.setValues(options);
}
window['InfoBubble'] = InfoBubble;


/**
 * Default arrow size
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_SIZE_ = 15;


/**
 * Default arrow style
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_STYLE_ = 0;


/**
 * Default shadow style
 * @const
 * @private
 */
InfoBubble.prototype.SHADOW_STYLE_ = 0;


/**
 * Default min width
 * @const
 * @private
 */
InfoBubble.prototype.MIN_WIDTH_ = 50;


/**
 * Default arrow position
 * @const
 * @private
 */
InfoBubble.prototype.ARROW_POSITION_ = 50;


/**
 * Default padding
 * @const
 * @private
 */
InfoBubble.prototype.PADDING_ = 4;


/**
 * Default border width
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_WIDTH_ = 1;


/**
 * Default border color
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_COLOR_ = '#ccc';


/**
 * Default border radius
 * @const
 * @private
 */
InfoBubble.prototype.BORDER_RADIUS_ = 10;


/**
 * Default background color
 * @const
 * @private
 */
InfoBubble.prototype.BACKGROUND_COLOR_ = '#fff';


/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
InfoBubble.prototype.extend = function (obj1, obj2) {
    return (function (object) {
        for (var property in object.prototype) {
            this.prototype[property] = object.prototype[property];
        }
        return this;
    }).apply(obj1, [obj2]);
};


/**
 * Builds the InfoBubble dom
 * @private
 */
InfoBubble.prototype.buildDom_ = function () {
    var marker = Session.get('SelectedMarker');

    var bubble = this.bubble_ = document.createElement('DIV');
    bubble.className = 'bubble-container';
    bubble.style['position'] = 'absolute';
    bubble.style['zIndex'] = this.baseZIndex_;

    // Close button
    var close = this.close_ = document.createElement('span');
    close.style['position'] = 'absolute';
    close.style['border'] = 0;
    close.style['zIndex'] = this.baseZIndex_ + 1;
    close.style['cursor'] = 'pointer';
    close.className = 'glyphicon glyphicon-remove';

    var that = this;
    google.maps.event.addDomListener(close, 'click', function () {
        Session.set('SelectedMarker', false);
        that.close();
        google.maps.event.trigger(that, 'closeclick');
    });

    // Content area
    var contentContainer = this.contentContainer_ = document.createElement('DIV');
    contentContainer.style['overflow'] = 'visible';
    contentContainer.style['cursor'] = 'default';
    contentContainer.style['clear'] = 'both';
    contentContainer.style['position'] = 'relative';
    contentContainer.style['height'] = 'auto';

    var content = this.content_ = document.createElement('DIV');
    contentContainer.appendChild(content);

    // Arrow
    var arrow = this.arrow_ = document.createElement('DIV');
    arrow.style['position'] = 'relative';

    var arrowOuter = this.arrowOuter_ = document.createElement('DIV');
    var arrowInner = this.arrowInner_ = document.createElement('DIV');

    arrowOuter.style['position'] = arrowInner.style['position'] = 'absolute';
    arrowOuter.style['left'] = arrowInner.style['left'] = '50%';
    arrowOuter.style['height'] = arrowInner.style['height'] = '10';
    arrowOuter.style['width'] = arrowInner.style['width'] = '10';

    arrowOuter.style['borderWidth'] = 0;
    arrowOuter.style['borderBottomWidth'] = 0;

    // Shadow
    var bubbleShadow = this.bubbleShadow_ = document.createElement('DIV');
    bubbleShadow.style['position'] = 'absolute';

    // Hide the InfoBubble by default
    bubble.style['display'] = bubbleShadow.style['display'] = 'none';

    bubble.appendChild(close);
    bubble.appendChild(contentContainer);
    arrow.appendChild(arrowOuter);
    arrow.appendChild(arrowInner);
    bubble.appendChild(arrow);

    var stylesheet = document.createElement('style');
    stylesheet.setAttribute('type', 'text/css');

    /**
     * The animation for the infobubble
     * @type {string}
     */
    this.animationName_ = '_ibani_' + Math.round(Math.random() * 10000);

    var css = '.' + this.animationName_ + '{-webkit-animation-name:' +
        this.animationName_ + ';-webkit-animation-duration:0.5s;' +
        '-webkit-animation-iteration-count:1;}' +
        '@-webkit-keyframes ' + this.animationName_ + ' {from {' +
        '-webkit-transform: scale(0)}50% {-webkit-transform: scale(1.2)}90% ' +
        '{-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}';

    stylesheet.textContent = css;
    document.getElementsByTagName('head')[0].appendChild(stylesheet);
};


/**
 * Sets the background class name
 *
 * @param {string} className The class name to set.
 */
InfoBubble.prototype.setBackgroundClassName = function (className) {
    this.set('backgroundClassName', className);
};
InfoBubble.prototype['setBackgroundClassName'] =
    InfoBubble.prototype.setBackgroundClassName;


/**
 * changed MVC callback
 */
InfoBubble.prototype.backgroundClassName_changed = function () {
    this.content_.className = this.get('backgroundClassName');
};
InfoBubble.prototype['backgroundClassName_changed'] =
    InfoBubble.prototype.backgroundClassName_changed;


/**
 * Gets the style of the arrow
 *
 * @private
 * @return {number} The style of the arrow.
 */
InfoBubble.prototype.getArrowStyle_ = function () {
    return parseInt(this.get('arrowStyle'), 10) || 0;
};


/**
 * Sets the style of the arrow
 *
 * @param {number} style The style of the arrow.
 */
InfoBubble.prototype.setArrowStyle = function (style) {
    this.set('arrowStyle', style);
};
InfoBubble.prototype['setArrowStyle'] =
    InfoBubble.prototype.setArrowStyle;


/**
 * Arrow style changed MVC callback
 */
InfoBubble.prototype.arrowStyle_changed = function () {
    this.arrowSize_changed();
};
InfoBubble.prototype['arrowStyle_changed'] =
    InfoBubble.prototype.arrowStyle_changed;


/**
 * Gets the size of the arrow
 *
 * @private
 * @return {number} The size of the arrow.
 */
InfoBubble.prototype.getArrowSize_ = function () {
    return parseInt(this.get('arrowSize'), 10) || 0;
};


/**
 * Sets the size of the arrow
 *
 * @param {number} size The size of the arrow.
 */
InfoBubble.prototype.setArrowSize = function (size) {
    this.set('arrowSize', size);
};
InfoBubble.prototype['setArrowSize'] =
    InfoBubble.prototype.setArrowSize;


/**
 * Arrow size changed MVC callback
 */
InfoBubble.prototype.arrowSize_changed = function () {
    this.borderWidth_changed();
};
InfoBubble.prototype['arrowSize_changed'] =
    InfoBubble.prototype.arrowSize_changed;


/**
 * Set the position of the InfoBubble arrow
 *
 * @param {number} pos The position to set.
 */
InfoBubble.prototype.setArrowPosition = function (pos) {
    this.set('arrowPosition', pos);
};
InfoBubble.prototype['setArrowPosition'] =
    InfoBubble.prototype.setArrowPosition;


/**
 * Get the position of the InfoBubble arrow
 *
 * @private
 * @return {number} The position..
 */
InfoBubble.prototype.getArrowPosition_ = function () {
    return parseInt(this.get('arrowPosition'), 10) || 0;
};


/**
 * arrowPosition changed MVC callback
 */
InfoBubble.prototype.arrowPosition_changed = function () {
    var pos = this.getArrowPosition_();
    this.arrowOuter_.style['left'] = this.arrowInner_.style['left'] = pos + '%';

    this.redraw_();
};
InfoBubble.prototype['arrowPosition_changed'] =
    InfoBubble.prototype.arrowPosition_changed;


/**
 * Set the zIndex of the InfoBubble
 *
 * @param {number} zIndex The zIndex to set.
 */
InfoBubble.prototype.setZIndex = function (zIndex) {
    this.set('zIndex', zIndex);
};
InfoBubble.prototype['setZIndex'] = InfoBubble.prototype.setZIndex;


/**
 * Get the zIndex of the InfoBubble
 *
 * @return {number} The zIndex to set.
 */
InfoBubble.prototype.getZIndex = function () {
    return parseInt(this.get('zIndex'), 10) || this.baseZIndex_;
};


/**
 * zIndex changed MVC callback
 */
InfoBubble.prototype.zIndex_changed = function () {
    var zIndex = this.getZIndex();

    this.bubble_.style['zIndex'] = this.baseZIndex_ = zIndex;
    this.close_.style['zIndex'] = zIndex + 1;
};
InfoBubble.prototype['zIndex_changed'] = InfoBubble.prototype.zIndex_changed;


/**
 * Set the style of the shadow
 *
 * @param {number} shadowStyle The style of the shadow.
 */
InfoBubble.prototype.setShadowStyle = function (shadowStyle) {
    this.set('shadowStyle', shadowStyle);
};
InfoBubble.prototype['setShadowStyle'] = InfoBubble.prototype.setShadowStyle;


/**
 * Get the style of the shadow
 *
 * @private
 * @return {number} The style of the shadow.
 */
InfoBubble.prototype.getShadowStyle_ = function () {
    return parseInt(this.get('shadowStyle'), 10) || 0;
};


/**
 * shadowStyle changed MVC callback
 */
InfoBubble.prototype.shadowStyle_changed = function () {
    var shadowStyle = this.getShadowStyle_();

    var display = '';
    var shadow = '';
    var backgroundColor = '';
    switch (shadowStyle) {
        case 0:
            display = 'none';
            break;
        case 1:
            shadow = '40px 15px 10px rgba(33,33,33,0.3)';
            backgroundColor = 'transparent';
            break;
        case 2:
            shadow = '0 0 2px rgba(33,33,33,0.3)';
            backgroundColor = 'rgba(33,33,33,0.35)';
            break;
    }
    this.bubbleShadow_.style['boxShadow'] =
        this.bubbleShadow_.style['webkitBoxShadow'] =
            this.bubbleShadow_.style['MozBoxShadow'] = shadow;
    this.bubbleShadow_.style['backgroundColor'] = backgroundColor;
    if (this.isOpen_) {
        this.bubbleShadow_.style['display'] = display;
        this.draw();
    }
};
InfoBubble.prototype['shadowStyle_changed'] =
    InfoBubble.prototype.shadowStyle_changed;


/**
 * Show the close button
 */
InfoBubble.prototype.showCloseButton = function () {
    this.set('hideCloseButton', false);
};
InfoBubble.prototype['showCloseButton'] = InfoBubble.prototype.showCloseButton;


/**
 * Hide the close button
 */
InfoBubble.prototype.hideCloseButton = function () {
    this.set('hideCloseButton', true);
};
InfoBubble.prototype['hideCloseButton'] = InfoBubble.prototype.hideCloseButton;


/**
 * hideCloseButton changed MVC callback
 */
InfoBubble.prototype.hideCloseButton_changed = function () {
    this.close_.style['display'] = this.get('hideCloseButton') ? 'none' : '';
};
InfoBubble.prototype['hideCloseButton_changed'] =
    InfoBubble.prototype.hideCloseButton_changed;


/**
 * Set the background color
 *
 * @param {string} color The color to set.
 */
InfoBubble.prototype.setBackgroundColor = function (color) {
    if (color) {
        this.set('backgroundColor', color);
    }
};
InfoBubble.prototype['setBackgroundColor'] =
    InfoBubble.prototype.setBackgroundColor;


/**
 * backgroundColor changed MVC callback
 */
InfoBubble.prototype.backgroundColor_changed = function () {
    var backgroundColor = this.get('backgroundColor');
    this.contentContainer_.style['backgroundColor'] = backgroundColor;

    this.arrowInner_.style['borderColor'] = backgroundColor +
    ' transparent transparent';
};
InfoBubble.prototype['backgroundColor_changed'] =
    InfoBubble.prototype.backgroundColor_changed;


/**
 * Set the border color
 *
 * @param {string} color The border color.
 */
InfoBubble.prototype.setBorderColor = function (color) {
    if (color) {
        this.set('borderColor', color);
    }
};
InfoBubble.prototype['setBorderColor'] = InfoBubble.prototype.setBorderColor;


/**
 * borderColor changed MVC callback
 */
InfoBubble.prototype.borderColor_changed = function () {
    var borderColor = this.get('borderColor');

    var contentContainer = this.contentContainer_;
    var arrowOuter = this.arrowOuter_;
    contentContainer.style['borderColor'] = borderColor;

    arrowOuter.style['borderColor'] = borderColor +
    ' transparent transparent';

    contentContainer.style['borderStyle'] =
        arrowOuter.style['borderStyle'] =
            this.arrowInner_.style['borderStyle'] = 'solid';
};
InfoBubble.prototype['borderColor_changed'] =
    InfoBubble.prototype.borderColor_changed;


/**
 * Set the radius of the border
 *
 * @param {number} radius The radius of the border.
 */
InfoBubble.prototype.setBorderRadius = function (radius) {
    this.set('borderRadius', radius);
};
InfoBubble.prototype['setBorderRadius'] = InfoBubble.prototype.setBorderRadius;


/**
 * Get the radius of the border
 *
 * @private
 * @return {number} The radius of the border.
 */
InfoBubble.prototype.getBorderRadius_ = function () {
    return parseInt(this.get('borderRadius'), 10) || 0;
};


/**
 * borderRadius changed MVC callback
 */
InfoBubble.prototype.borderRadius_changed = function () {
    var borderRadius = this.getBorderRadius_();
    var borderWidth = this.getBorderWidth_();

    this.contentContainer_.style['borderRadius'] =
        this.contentContainer_.style['MozBorderRadius'] =
            this.contentContainer_.style['webkitBorderRadius'] =
                this.bubbleShadow_.style['borderRadius'] =
                    this.bubbleShadow_.style['MozBorderRadius'] =
                        this.bubbleShadow_.style['webkitBorderRadius'] = this.px(borderRadius);

    this.redraw_();
};
InfoBubble.prototype['borderRadius_changed'] =
    InfoBubble.prototype.borderRadius_changed;


/**
 * Get the width of the border
 *
 * @private
 * @return {number} width The width of the border.
 */
InfoBubble.prototype.getBorderWidth_ = function () {
    return parseInt(this.get('borderWidth'), 10) || 0;
};


/**
 * Set the width of the border
 *
 * @param {number} width The width of the border.
 */
InfoBubble.prototype.setBorderWidth = function (width) {
    this.set('borderWidth', width);
};
InfoBubble.prototype['setBorderWidth'] = InfoBubble.prototype.setBorderWidth;


/**
 * borderWidth change MVC callback
 */
InfoBubble.prototype.borderWidth_changed = function () {
    var borderWidth = this.getBorderWidth_();

    this.contentContainer_.style['borderWidth'] = this.px(borderWidth);

    this.updateArrowStyle_();
    this.borderRadius_changed();
    this.redraw_();
};
InfoBubble.prototype['borderWidth_changed'] =
    InfoBubble.prototype.borderWidth_changed;


/**
 * Update the arrow style
 * @private
 */
InfoBubble.prototype.updateArrowStyle_ = function () {
    var borderWidth = this.getBorderWidth_();
    var arrowSize = this.getArrowSize_();
    var arrowStyle = this.getArrowStyle_();
    var arrowOuterSizePx = this.px(arrowSize);
    var arrowInnerSizePx = this.px(Math.max(0, arrowSize - borderWidth));

    var outer = this.arrowOuter_;
    var inner = this.arrowInner_;

    this.arrow_.style['marginTop'] = this.px(-borderWidth);
    outer.style['borderTopWidth'] = arrowOuterSizePx;
    inner.style['borderTopWidth'] = arrowInnerSizePx;

    // Full arrow or arrow pointing to the left
    if (arrowStyle == 0 || arrowStyle == 1) {
        outer.style['borderLeftWidth'] = arrowOuterSizePx;
        inner.style['borderLeftWidth'] = arrowInnerSizePx;
    } else {
        outer.style['borderLeftWidth'] = inner.style['borderLeftWidth'] = 0;
    }

    // Full arrow or arrow pointing to the right
    if (arrowStyle == 0 || arrowStyle == 2) {
        outer.style['borderRightWidth'] = arrowOuterSizePx;
        inner.style['borderRightWidth'] = arrowInnerSizePx;
    } else {
        outer.style['borderRightWidth'] = inner.style['borderRightWidth'] = 0;
    }

    if (arrowStyle < 2) {
        outer.style['marginLeft'] = this.px(-(arrowSize));
        inner.style['marginLeft'] = this.px(-(arrowSize - borderWidth));
    } else {
        outer.style['marginLeft'] = inner.style['marginLeft'] = 0;
    }

    // If there is no border then don't show thw outer arrow
    if (borderWidth == 0) {
        outer.style['display'] = 'none';
    } else {
        outer.style['display'] = '';
    }
};


/**
 * Set the padding of the InfoBubble
 *
 * @param {number} padding The padding to apply.
 */
InfoBubble.prototype.setPadding = function (padding) {
    this.set('padding', padding);
};
InfoBubble.prototype['setPadding'] = InfoBubble.prototype.setPadding;


/**
 * Set the padding of the InfoBubble
 *
 * @private
 * @return {number} padding The padding to apply.
 */
InfoBubble.prototype.getPadding_ = function () {
    return parseInt(this.get('padding'), 10) || 0;
};


/**
 * padding changed MVC callback
 */
InfoBubble.prototype.padding_changed = function () {
    var padding = this.getPadding_();
    this.contentContainer_.style['padding'] = this.px(padding);

    this.redraw_();
};
InfoBubble.prototype['padding_changed'] = InfoBubble.prototype.padding_changed;


/**
 * Add px extention to the number
 *
 * @param {number} num The number to wrap.
 * @return {string|number} A wrapped number.
 */
InfoBubble.prototype.px = function (num) {
    if (num) {
        // 0 doesn't need to be wrapped
        return num + 'px';
    }
    return num;
};


/**
 * Add events to stop propagation
 * @private
 */
InfoBubble.prototype.addEvents_ = function () {
    // We want to cancel all the events so they do not go to the map
    var events = ['mousedown', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
        'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 'touchmove',
        'dblclick', 'contextmenu', 'click'];

    var bubble = this.bubble_;
    this.listeners_ = [];
    for (var i = 0, event; event = events[i]; i++) {
        this.listeners_.push(
            google.maps.event.addDomListener(bubble, event, function (e) {
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            })
        );
    }
};


/**
 * On Adding the InfoBubble to a map
 * Implementing the OverlayView interface
 */
InfoBubble.prototype.onAdd = function () {
    if (!this.bubble_) {
        this.buildDom_();
    }

    this.addEvents_();

    var panes = this.getPanes();
    if (panes) {
        panes.floatPane.appendChild(this.bubble_);
        panes.floatShadow.appendChild(this.bubbleShadow_);
    }
};
InfoBubble.prototype['onAdd'] = InfoBubble.prototype.onAdd;


/**
 * Draw the InfoBubble
 * Implementing the OverlayView interface
 */
InfoBubble.prototype.draw = function () {
    var projection = this.getProjection();

    if (!projection) {
        // The map projection is not ready yet so do nothing
        return;
    }

    var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));

    if (!latLng) {
        this.close();
        return;
    }

    var anchorHeight = this.getAnchorHeight_();
    var arrowSize = this.getArrowSize_();
    var arrowPosition = this.getArrowPosition_();

    arrowPosition = arrowPosition / 100;

    var pos = projection.fromLatLngToDivPixel(latLng);
    var width = this.contentContainer_.offsetWidth;
    var height = this.bubble_.offsetHeight;

    if (!width) {
        return;
    }

    // Adjust for the height of the info bubble
    var top = pos.y - (height + arrowSize);

    if (anchorHeight) {
        // If there is an anchor then include the height
        top -= anchorHeight;
    }

    var left = pos.x - (width * arrowPosition);

    this.bubble_.style['top'] = this.px(top);
    this.bubble_.style['left'] = this.px(left);

    var shadowStyle = parseInt(this.get('shadowStyle'), 10);

    switch (shadowStyle) {
        case 1:
            // Shadow is behind
            this.bubbleShadow_.style['top'] = this.px(top - 1);
            this.bubbleShadow_.style['left'] = this.px(left);
            this.bubbleShadow_.style['width'] = this.px(width);
            this.bubbleShadow_.style['height'] =
                this.px(this.contentContainer_.offsetHeight - arrowSize);
            break;
        case 2:
            // Shadow is below
            width = width * 0.8;
            if (anchorHeight) {
                this.bubbleShadow_.style['top'] = this.px(pos.y);
            } else {
                this.bubbleShadow_.style['top'] = this.px(pos.y + arrowSize);
            }
            this.bubbleShadow_.style['left'] = this.px(pos.x - width * arrowPosition);

            this.bubbleShadow_.style['width'] = this.px(width);
            this.bubbleShadow_.style['height'] = this.px(2);
            break;
    }
};
InfoBubble.prototype['draw'] = InfoBubble.prototype.draw;


/**
 * Removing the InfoBubble from a map
 */
InfoBubble.prototype.onRemove = function () {
    if (this.bubble_ && this.bubble_.parentNode) {
        this.bubble_.parentNode.removeChild(this.bubble_);
    }
    if (this.bubbleShadow_ && this.bubbleShadow_.parentNode) {
        this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);
    }

    for (var i = 0, listener; listener = this.listeners_[i]; i++) {
        google.maps.event.removeListener(listener);
    }
};
InfoBubble.prototype['onRemove'] = InfoBubble.prototype.onRemove;


/**
 * Is the InfoBubble open
 *
 * @return {boolean} If the InfoBubble is open.
 */
InfoBubble.prototype.isOpen = function () {
    return this.isOpen_;
};
InfoBubble.prototype['isOpen'] = InfoBubble.prototype.isOpen;


/**
 * Close the InfoBubble
 */
InfoBubble.prototype.close = function () {
    if (this.bubble_) {
        this.bubble_.style['display'] = 'none';
        // Remove the animation so we next time it opens it will animate again
        this.bubble_.className =
            this.bubble_.className.replace(this.animationName_, '');
    }

    if (this.bubbleShadow_) {
        this.bubbleShadow_.style['display'] = 'none';
        this.bubbleShadow_.className =
            this.bubbleShadow_.className.replace(this.animationName_, '');
    }
    this.isOpen_ = false;
};
InfoBubble.prototype['close'] = InfoBubble.prototype.close;


/**
 * Open the InfoBubble (asynchronous).
 *
 * @param {google.maps.Map=} opt_map Optional map to open on.
 * @param {google.maps.MVCObject=} opt_anchor Optional anchor to position at.
 */
InfoBubble.prototype.open = function (opt_map, opt_anchor) {
    var that = this;
    window.setTimeout(function () {
        that.open_(opt_map, opt_anchor);
    }, 0);
};

/**
 * Open the InfoBubble
 * @private
 * @param {google.maps.Map=} opt_map Optional map to open on.
 * @param {google.maps.MVCObject=} opt_anchor Optional anchor to position at.
 */
InfoBubble.prototype.open_ = function (opt_map, opt_anchor) {
    this.updateContent_();

    if (opt_map) {
        this.setMap(opt_map);
    }

    if (opt_anchor) {
        this.set('anchor', opt_anchor);
        this.bindTo('anchorPoint', opt_anchor);
        this.bindTo('position', opt_anchor);
    }

    // Show the bubble and the show
    this.bubble_.style['display'] = this.bubbleShadow_.style['display'] = '';
    var animation = !this.get('disableAnimation');

    if (animation) {
        // Add the animation
        this.bubble_.className += ' ' + this.animationName_;
        this.bubbleShadow_.className += ' ' + this.animationName_;
    }

    this.redraw_();
    
    this.isOpen_ = true;

    var pan = !this.get('disableAutoPan');
    if (pan) {
        var that = this;
        window.setTimeout(function () {
            // Pan into view, done in a time out to make it feel nicer :)
            $('.rateit-marker').rateit();
            that.panToView();
        }, 0);
    }
};
InfoBubble.prototype['open'] = InfoBubble.prototype.open;


/**
 * Set the position of the InfoBubble
 *
 * @param {google.maps.LatLng} position The position to set.
 */
InfoBubble.prototype.setPosition = function (position) {
    if (position) {
        this.set('position', position);
    }
};
InfoBubble.prototype['setPosition'] = InfoBubble.prototype.setPosition;


/**
 * Returns the position of the InfoBubble
 *
 * @return {google.maps.LatLng} the position.
 */
InfoBubble.prototype.getPosition = function () {
    return /** @type {google.maps.LatLng} */ (this.get('position'));
};
InfoBubble.prototype['getPosition'] = InfoBubble.prototype.getPosition;


/**
 * position changed MVC callback
 */
InfoBubble.prototype.position_changed = function () {
    this.draw();
};
InfoBubble.prototype['position_changed'] =
    InfoBubble.prototype.position_changed;

InfoBubble.prototype.setMarker = function (marker) {
    self.marker = marker;
    this.updateContent_;
};

/**
 * Pan the InfoBubble into view
 */
InfoBubble.prototype.panToView = function () {
    var projection = this.getProjection();

    if (!projection) {
        // The map projection is not ready yet so do nothing
        return;
    }

    if (!this.bubble_) {
        // No Bubble yet so do nothing
        return;
    }

    var anchorHeight = this.getAnchorHeight_();
    var height = this.bubble_.offsetHeight + anchorHeight;
    var map = this.get('map');
    var mapDiv = map.getDiv();
    var mapHeight = mapDiv.offsetHeight;

    var latLng = this.getPosition();
    var centerPos = projection.fromLatLngToContainerPixel(map.getCenter());
    var pos = projection.fromLatLngToContainerPixel(latLng);

    // Find out how much space at the top is free
    var spaceTop = centerPos.y - height;

    // Fine out how much space at the bottom is free
    var spaceBottom = mapHeight - centerPos.y;

    var needsTop = spaceTop < 0;
    var deltaY = 0;

    if (needsTop) {
        spaceTop *= -1;
        deltaY = (spaceTop + spaceBottom) / 2;
    }

    pos.y -= deltaY;
    latLng = projection.fromContainerPixelToLatLng(pos);
    
    if (map.getCenter() != latLng) {
        map.panTo(latLng);
    }
};
InfoBubble.prototype['panToView'] = InfoBubble.prototype.panToView;


/**
 * Converts a HTML string to a document fragment.
 *
 * @param {string} htmlString The HTML string to convert.
 * @return {Node} A HTML document fragment.
 * @private
 */
InfoBubble.prototype.htmlToDocumentFragment_ = function (htmlString) {
    htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
    var tempDiv = document.createElement('DIV');
    tempDiv.innerHTML = htmlString;
    if (tempDiv.childNodes.length == 1) {
        return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
    } else {
        var fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }
        return fragment;
    }
};


/**
 * Removes all children from the node.
 *
 * @param {Node} node The node to remove all children from.
 * @private
 */
InfoBubble.prototype.removeChildren_ = function (node) {
    if (!node) {
        return;
    }

    var child;
    while (child = node.firstChild) {
        node.removeChild(child);
    }
};


/**
 * Sets the content of the infobubble.
 *
 * @param {string|Node} content The content to set.
 */
InfoBubble.prototype.setContent = function (content) {
    this.set('content', content);
};
InfoBubble.prototype['setContent'] = InfoBubble.prototype.setContent;

InfoBubble.prototype.getContent = function () {
    return /** @type {Node|string} */ (this.get('content'));
};
InfoBubble.prototype['getContent'] = InfoBubble.prototype.getContent;


/**
 * Sets the marker content and adds loading events to images
 */
InfoBubble.prototype.updateContent_ = function () {
    if (!this.content_) {
        // The Content area doesnt exist.
        return;
    }

    this.removeChildren_(this.content_);
    var content = this.getContent();
    if (content) {
        if (typeof content == 'string') {
            content = this.htmlToDocumentFragment_(content);
        }
        this.content_.appendChild(content);
        var marker = Session.get('SelectedMarker');

        var that = this;
        var buttons = this.content_.getElementsByTagName('BUTTON');
        if (marker.type == 1) {
            buttons[0].addEventListener('click', function () {
                that.close();
                if (marker) {
                    $('#eventMarker-asistentes').tagsinput('removeAll');
                    $('#eventMarker-asistentes').tagsinput('add', marker.data.asistentes);
                    $('#eventMarker-asistentes').tagsinput('refresh');
                }
                $('#basicModal').modal('show');
            });
        } else {
            // Eventos asociados al rating
            var buttons = this.content_.getElementsByClassName('rateit-marker');
            buttons[0].addEventListener('click', function () {
                var val = $('.rateit-marker').rateit('value');

                var markerRating = MarkerRatings.findOne({ markerId: marker._id, userId: Meteor.userId() });
                if(val==0) {
                    if(!markerRating) return; // Sin voto, sale
                    if(!markerRating.rating) return; // Sin valorización en el voto (inconsistencia validada), sale
                    
                    var lastRating = markerRating.rating;
                    var recalculatedAverage = marker.ratingsCount==1?0:(marker.ratingAverage - lastRating) / (marker.ratingsCount - 1);
                    
                    Markers.update({ _id: marker._id }, { 
                        $set: { ratingAverage : recalculatedAverage, ratingsCount: marker.ratingsCount - 1 }
                    });
                    
                    MarkerRatings.delete(markerRating._id);                    
                    return;
                }
                
                if (!markerRating) {//add
                    var markerRatingId = MarkerRatings.insert({
                        markerId: marker._id,
                        userId: Meteor.userId(),
                        created: new Date(),
                        modified: new Date(),
                        rating: 0
                    });
                    markerRating = MarkerRatings.findOne(markerRatingId);
                }
                
                var ratingsCount = marker.markersCount?marker.markersCount:0;
                var actualRating = markerRating.rating?markerRating.rating:0;
                var ratingAverage = ( ratingsCount * actualRating + val ) / (ratingsCount + 1);

                Markers.update({_id: marker._id}, {
                    $set: {
                        ratingAverage: ratingAverage,
                        ratingsCount: ratingsCount + 1
                    }
                });
                
                MarkerRatings.update({ _id: markerRating._id }, {
                    $set: { rating: val }
                });
                
                $('#markerRatingCount').text(ratingsCount + 1);
                $('#valoracionPromedio').text(ratingAverage);
                $('#valoracionPersonal').text(val);
            });
            
            // Eventos asociados la edición del título
            var labels = this.content_.getElementsByClassName('label-marker-title');
            labels[0].addEventListener('click', function () {
                var marker = Session.get('SelectedMarker');
                if(marker.userId!=Meteor.userId()) return;
                $('.label-marker-title').hide();
                $('.input-marker-title').show();
            });

            // Eventos asociados la edición del título
            var inputs = this.content_.getElementsByClassName('input-marker-title');
            inputs[0].addEventListener('change', function () {
                var marker = Session.get('SelectedMarker');
                var nuevoTitulo = $(this).val();
                Markers.update({ _id: marker._id }, { $set: { titulo: nuevoTitulo } });
                $('.label-marker-title').text(nuevoTitulo);
                $('.label-marker-title').show();
                $('.input-marker-title').hide();
            });

            this.redraw_();
        }
    }
};

/**
 * Image loaded
 * @private
 */
InfoBubble.prototype.imageLoaded_ = function () {
    var pan = !this.get('disableAutoPan');
    this.redraw_();
};


/**
 * Set the max width of the InfoBubble
 *
 * @param {number} width The max width.
 */
InfoBubble.prototype.setMaxWidth = function (width) {
    this.set('maxWidth', width);
};
InfoBubble.prototype['setMaxWidth'] = InfoBubble.prototype.setMaxWidth;


/**
 * maxWidth changed MVC callback
 */
InfoBubble.prototype.maxWidth_changed = function () {
    this.redraw_();
};
InfoBubble.prototype['maxWidth_changed'] =
    InfoBubble.prototype.maxWidth_changed;


/**
 * Set the max height of the InfoBubble
 *
 * @param {number} height The max height.
 */
InfoBubble.prototype.setMaxHeight = function (height) {
    this.set('maxHeight', height);
};
InfoBubble.prototype['setMaxHeight'] = InfoBubble.prototype.setMaxHeight;


/**
 * maxHeight changed MVC callback
 */
InfoBubble.prototype.maxHeight_changed = function () {
    this.redraw_();
};
InfoBubble.prototype['maxHeight_changed'] =
    InfoBubble.prototype.maxHeight_changed;


/**
 * Set the min width of the InfoBubble
 *
 * @param {number} width The min width.
 */
InfoBubble.prototype.setMinWidth = function (width) {
    this.set('minWidth', width);
};
InfoBubble.prototype['setMinWidth'] = InfoBubble.prototype.setMinWidth;


/**
 * minWidth changed MVC callback
 */
InfoBubble.prototype.minWidth_changed = function () {
    this.redraw_();
};
InfoBubble.prototype['minWidth_changed'] =
    InfoBubble.prototype.minWidth_changed;


/**
 * Set the min height of the InfoBubble
 *
 * @param {number} height The min height.
 */
InfoBubble.prototype.setMinHeight = function (height) {
    this.set('minHeight', height);
};
InfoBubble.prototype['setMinHeight'] = InfoBubble.prototype.setMinHeight;


/**
 * minHeight changed MVC callback
 */
InfoBubble.prototype.minHeight_changed = function () {
    this.redraw_();
};
InfoBubble.prototype['minHeight_changed'] =
    InfoBubble.prototype.minHeight_changed;


/**
 * Get the size of an element
 * @private
 * @param {Node|string} element The element to size.
 * @param {number=} opt_maxWidth Optional max width of the element.
 * @param {number=} opt_maxHeight Optional max height of the element.
 * @return {google.maps.Size} The size of the element.
 */
InfoBubble.prototype.getElementSize_ = function (element, opt_maxWidth,
                                                 opt_maxHeight) {
    var sizer = document.createElement('DIV');
    sizer.style['display'] = 'inline';
    sizer.style['position'] = 'absolute';
    sizer.style['visibility'] = 'hidden';

    if (typeof element == 'string') {
        sizer.innerHTML = element;
    } else {
        sizer.appendChild(element.cloneNode(true));
    }

    document.body.appendChild(sizer);
    var size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);

    // If the width is bigger than the max width then set the width and size again
    if (opt_maxWidth && size.width > opt_maxWidth) {
        sizer.style['width'] = this.px(opt_maxWidth);
        size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
    }

    // If the height is bigger than the max height then set the height and size
    // again
    if (opt_maxHeight && size.height > opt_maxHeight) {
        sizer.style['height'] = this.px(opt_maxHeight);
        size = new google.maps.Size(sizer.offsetWidth, sizer.offsetHeight);
    }

    document.body.removeChild(sizer);
    delete sizer;
    return size;
};


/**
 * Redraw the InfoBubble
 * @private
 */
InfoBubble.prototype.redraw_ = function () {
    this.figureOutSize_();
    this.positionCloseButton_();
    this.draw();
};


/**
 * Figure out the optimum size of the InfoBubble
 * @private
 */
InfoBubble.prototype.figureOutSize_ = function () {
    var map = this.get('map');

    if (!map) {
        return;
    }

    var padding = this.getPadding_();
    var borderWidth = this.getBorderWidth_();
    var borderRadius = this.getBorderRadius_();
    var arrowSize = this.getArrowSize_();

    var mapDiv = map.getDiv();
    var gutter = arrowSize * 2;
    var mapWidth = mapDiv.offsetWidth - gutter;
    var mapHeight = mapDiv.offsetHeight - gutter - this.getAnchorHeight_();
    var width = /** @type {number} */ (this.get('minWidth') || 0);
    var height = /** @type {number} */ (this.get('minHeight') || 0);
    var maxWidth = /** @type {number} */ (this.get('maxWidth') || 0);
    var maxHeight = /** @type {number} */ (this.get('maxHeight') || 0);

    maxWidth = Math.min(mapWidth, maxWidth);
    maxHeight = Math.min(mapHeight, maxHeight);

    var content = /** @type {string|Node} */ (this.get('content'));
    if (typeof content == 'string') {
        content = this.htmlToDocumentFragment_(content);
    }
    if (content) {
        var contentSize = this.getElementSize_(content, maxWidth, maxHeight);

        if (width < contentSize.width) {
            width = contentSize.width;
        }

        if (height < contentSize.height) {
            height = contentSize.height;
        }
    }

    if (maxWidth) {
        width = Math.min(width, maxWidth);
    }

    if (maxHeight) {
        height = Math.min(height, maxHeight);
    }

    width = width + 2 * padding;

    arrowSize = arrowSize * 2;
    width = Math.max(width, arrowSize);

    // Maybe add this as a option so they can go bigger than the map if the user
    // wants
    if (width > mapWidth) {
        width = mapWidth;
    }

    if (height > mapHeight) {
        height = mapHeight;
    }
};


/**
 *  Get the height of the anchor
 *
 *  This function is a hack for now and doesn't really work that good, need to
 *  wait for pixelBounds to be correctly exposed.
 *  @private
 *  @return {number} The height of the anchor.
 */
InfoBubble.prototype.getAnchorHeight_ = function () {
    var anchor = this.get('anchor');
    if (anchor) {
        var anchorPoint = /** @type google.maps.Point */(this.get('anchorPoint'));

        if (anchorPoint) {
            return -1 * anchorPoint.y;
        }
    }
    return 0;
};

InfoBubble.prototype.anchorPoint_changed = function () {
    this.draw();
};
InfoBubble.prototype['anchorPoint_changed'] = InfoBubble.prototype.anchorPoint_changed;


/**
 * Position the close button in the right spot.
 * @private
 */
InfoBubble.prototype.positionCloseButton_ = function () {
    var br = this.getBorderRadius_();
    var bw = this.getBorderWidth_();

    var right = 4;
    var top = 4;

    top += bw;
    right += bw;

    var c = this.contentContainer_;
    if (c && c.clientHeight < c.scrollHeight) {
        // If there are scrollbars then move the cross in so it is not over
        // scrollbar
        right += 15;
    }

    this.close_.style['right'] = this.px(right);
    this.close_.style['top'] = this.px(top);
};

Template.infobubble.rendered = function () {

}

Template.infobubble.events({});