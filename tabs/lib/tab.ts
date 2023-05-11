/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * An element that can select items.
 */
export interface SelectionGroupElement extends HTMLElement {
  selected?: number;
  selectedItem?: Tab;
  previousSelectedItem?: Tab;
}

type Style = ''|'primary'|'secondary';
type Orientation = ''|'vertical';

/**
 * Tab variant can be `primary` or `secondary and can include a space
 * separated `vertical`.
 */
export type Variant = Style|`${Style} ${Orientation}`|`${Orientation} ${Style}`;

/**
 * Tab component.
 */
export class Tab extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * Styling variant to display, 'primary' or 'secondary' and can also
   * include `vertical`.
   * Defaults to `primary`.
   */
  @property({reflect: true}) variant: Variant = 'primary';

  /**
   * Whether or not the item is `disabled`.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether or not the item is `selected`.
   **/
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * Whether or not the icon renders inline with label or stacked vertically.
   */
  @property({type: Boolean}) inlineIcon = false;

  @query('.button') private readonly button!: HTMLElement|null;

  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  // note, this is public so it can participate in selection animation.
  /**
   * Selection indicator element.
   */
  @query('.indicator') readonly indicator!: HTMLElement;

  @state() private showRipple = false;

  // whether or not selection state can be animated; used to avoid initial
  // animation and becomes true one task after first update.
  private canAnimate = false;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', this.handleActivationClick);
    }
  }

  override focus() {
    this.button?.focus();
  }

  override blur() {
    this.button?.blur();
  }

  protected override render() {
    const contentClasses = {
      'inline-icon': this.inlineIcon,
    };
    return html`
      <button
        class="button md3-button"
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        ${ripple(this.getRipple)}
      >
        <md-focus-ring></md-focus-ring>
        <md-elevation></md-elevation>
        ${when(this.showRipple, this.renderRipple)}
        <span class="touch"></span>
        <div class="content ${classMap(contentClasses)}">
          <slot name="icon"></slot>
          <span class="label">
            <slot></slot>
          </span>
          <div class="indicator"></div>
        </div>
      </button>`;
  }

  protected override async firstUpdated() {
    await new Promise(requestAnimationFrame);
    this.canAnimate = true;
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has('selected') && this.shouldAnimate()) {
      this.animateSelected();
    }
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick((event)) || !this.button) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.button);
  };

  private shouldAnimate() {
    return this.canAnimate && !this.disabled &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {
    return html`<md-ripple ?disabled="${this.disabled}"></md-ripple>`;
  };

  private get selectionGroup() {
    return this.parentElement as SelectionGroupElement;
  }

  private animateSelected() {
    this.indicator.getAnimations().forEach(a => {
      a.cancel();
    });
    const frames = this.getKeyframes();
    if (frames !== null) {
      this.indicator.animate(frames, {duration: 400, easing: 'ease-out'});
    }
  }

  private getKeyframes() {
    if (!this.selected) {
      return null;
    }
    const from: Keyframe = {};
    const isVertical = this.variant.includes('vertical');
    const fromRect =
        (this.selectionGroup?.previousSelectedItem?.indicator
             .getBoundingClientRect() ??
         ({} as DOMRect));
    const fromPos = isVertical ? fromRect.top : fromRect.left;
    const fromExtent = isVertical ? fromRect.height : fromRect.width;
    const toRect = this.indicator.getBoundingClientRect();
    const toPos = isVertical ? toRect.top : toRect.left;
    const toExtent = isVertical ? toRect.height : toRect.width;
    const axis = isVertical ? 'Y' : 'X';
    const scale = fromExtent / toExtent;
    if (fromPos !== undefined && toPos !== undefined && !isNaN(scale)) {
      from['transform'] = `translate${axis}(${
          (fromPos - toPos).toFixed(4)}px) scale${axis}(${scale.toFixed(4)})`;
    } else {
      from['opacity'] = 0;
    }
    // note, including `transform: none` avoids quirky Safari behavior
    // that can hide the animation.
    return [from, {'transform': 'none'}];
  }
}
