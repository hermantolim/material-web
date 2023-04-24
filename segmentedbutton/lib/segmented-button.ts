/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * SegmentedButton is a web component implementation of the Material Design
 * segmented button component. It is intended **only** for use as a child of a
 * `SementedButtonSet` component. It is **not** intended for use in any other
 * context.
 * @soyCompatible
 */
export class SegmentedButton extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) selected = false;
  @property() label = '';
  @property({type: Boolean}) noCheckmark = false;
  @property({type: Boolean}) hasIcon = false;

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({attribute: 'aria-label'})
  override ariaLabel!: string;

  @state() protected animState: string = '';
  @state() protected showFocusRing = false;
  @state() protected showRipple = false;
  @queryAssignedElements({slot: 'icon', flatten: true})
  protected iconElement!: HTMLElement[];
  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;

  protected override update(props: PropertyValues<SegmentedButton>) {
    this.animState = this.nextAnimationState(props);
    super.update(props);
    // NOTE: This needs to be set *after* calling super.update() to ensure the
    // appropriate CSS classes are applied.
    this.hasIcon = this.iconElement.length > 0;
  }

  private nextAnimationState(changedProps: PropertyValues<SegmentedButton>):
      string {
    const prevSelected = changedProps.get('selected');
    // Early exit for first update.
    if (prevSelected === undefined) return '';

    const nextSelected = this.selected;
    const nextHasCheckmark = !this.noCheckmark;
    if (!prevSelected && nextSelected && nextHasCheckmark) {
      return 'selecting';
    }
    if (prevSelected && !nextSelected && nextHasCheckmark) {
      return 'deselecting';
    }
    return '';
  }

  handleClick(e: MouseEvent) {
    const event = new Event(
        'segmented-button-interaction', {bubbles: true, composed: true});
    this.dispatchEvent(event);
  }

  handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <button
        tabindex="${this.disabled ? '-1' : '0'}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @click="${this.handleClick}"
        class="md3-segmented-button ${classMap(this.getRenderClasses())}"
        ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderOutline()}
        ${this.renderLeading()}
        ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-segmented-button--selected': this.selected,
      'md3-segmented-button--unselected': !this.selected,
      'md3-segmented-button--with-label': this.label !== '',
      'md3-segmented-button--without-label': this.label === '',
      'md3-segmented-button--with-icon': this.hasIcon,
      'md3-segmented-button--with-checkmark': !this.noCheckmark,
      'md3-segmented-button--without-checkmark': this.noCheckmark,
      'md3-segmented-button--selecting': this.animState === 'selecting',
      'md3-segmented-button--deselecting': this.animState === 'deselecting',
    };
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}" class="md3-segmented-button__focus-ring"></md-focus-ring>`;
  }

  protected readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected renderRipple = () => {
    return html`<md-ripple ?disabled="${
        this.disabled}" class="md3-segmented-button__ripple"> </md-ripple>`;
  };

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderLeading(): TemplateResult {
    return this.label === '' ? this.renderLeadingWithoutLabel() :
                               this.renderLeadingWithLabel();
  }

  /** @soyTemplate */
  protected renderLeadingWithoutLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path class="md3-segmented-button__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderLeadingWithLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path class="md3-segmented-button__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `;
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-segmented-button__touch"></span>`;
  }
}
