/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   slider.js
*
*   Desc:   Slider widget that implements ARIA Authoring Practices
*/

'use strict';

// Create Slider that contains value, valuemin, valuemax, and valuenow
var MultithumbSlider = function (domNode)  {

  this.domNode = domNode;
  this.railDomNode = domNode.querySelector('.rail');

  this.minLabelNode = domNode.querySelector('.rail-label.min');
  this.maxLabelNode = domNode.querySelector('.rail-label.max');
  this.minSliderNode = domNode.querySelector('.thumb.min');
  this.maxSliderNode = domNode.querySelector('.thumb.max');

  this.valueNow = 50;

  this.railMin = 0;
  this.railMax = 100;
  this.railWidth = 0;
  this.railBorderWidth = 1;

  this.thumbWidth  = 20;
  this.thumbHeight = 24;

  
};

// Initialize slider
MultithumbSlider.prototype.init = function () {

    this.railMin = parseInt((this.minSliderNode.getAttribute('aria-valuemin')));
    this.railMax = parseInt((this.maxSliderNode.getAttribute('aria-valuemax')));
    this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));
    this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.addEventListener('keydown',   this.handleKeyDown.bind(this));
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('focus',     this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',      this.handleBlur.bind(this));

  this.moveSliderTo(this.valueNow);

};

MultithumbSlider.prototype.moveSliderTo = function (value) {
  var valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  var valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  this.valueNow = value;
  this.dolValueNow = '$' + value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  this.domNode.setAttribute('aria-valuetext', this.dolValueNow);

  if (this.minSliderNode) {
    this.minSliderNode.setAttribute('aria-valuemax', this.valueNow);
  }

  if (this.maxSliderNode) {
    this.maxSliderNode.setAttribute('aria-valuemin', this.valueNow);
  }

  var pos = Math.round(((this.valueNow - this.railMin) * (this.railWidth - 2 * (this.thumbWidth - this.railBorderWidth))) / (this.railMax - this.railMin));

  if (this.minSliderNode) {
    this.domNode.style.left = (pos + this.thumbWidth - this.railBorderWidth) + 'px';
  }
  else {
    this.domNode.style.left = (pos - this.railBorderWidth) + 'px';
  }

  if (this.labelDomNode) {
    this.labelDomNode.innerHTML = this.dolValueNow.toString();
  }
};

MultithumbSlider.prototype.handleKeyDown = function (event) {

  var flag = false;

  switch (event.key) {
    case 'Left':
    case 'Down':
      this.moveSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case 'Right':
    case 'Up':
      this.moveSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case 'PageDown':
      this.moveSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case 'PageUp':
      this.moveSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case 'Home':
      this.moveSliderTo(this.railMin);
      flag = true;
      break;

    case 'End':
      this.moveSliderTo(this.railMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }

};

MultithumbSlider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

MultithumbSlider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

MultithumbSlider.prototype.handleMouseDown = function (event) {

  var self = this;

  var handleMouseMove = function (event) {

    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = self.railMin + parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);
    self.moveSliderTo(self.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  var handleMouseUp = function (event) {

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

  };

  // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', handleMouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', handleMouseUp);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  this.domNode.focus();

};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
// Slider.prototype.handleClick = function (event) {

//  var diffX = event.pageX - this.railDomNode.offsetLeft;
//  this.valueNow = parseInt(((this.railMax - this.railMin) * diffX) / this.railWidth);
//  this.moveSliderTo(this.valueNow);

//  event.preventDefault();
//  event.stopPropagation();

// };

// Initialise Sliders on the page
window.addEventListener('load', function () {

  var multithumb-sliders = document.querySelectorAll('.multithumb-slider');

  for (var i = 0; i < multithumb-sliders.length; i++) {
    var ms = new MultithumbSlider(multithumb-sliders[i]);
    ms.init();
  }

});
