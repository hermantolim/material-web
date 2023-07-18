/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, nothing} from 'lit';

import {Chip} from './chip.js';

interface RemoveButtonProperties {
  ariaLabel: string;
  disabled: boolean;
  tabbable?: boolean;
}

/** @protected */
export function renderRemoveButton(
    {ariaLabel, disabled, tabbable = false}: RemoveButtonProperties) {
  return html`
    <button class="trailing action"
      aria-label=${ariaLabel}
      ?disabled=${disabled}
      tabindex=${!tabbable ? -1 : nothing}
      @click=${handleRemoveClick}
    >
      <md-focus-ring></md-focus-ring>
      <md-ripple></md-ripple>
      <svg class="trailing icon" viewBox="0 96 960 960">
        <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
      </svg>
      <span class="touch"></span>
    </button>
  `;
}

function handleRemoveClick(this: Chip, event: Event) {
  if (this.disabled) {
    return;
  }

  event.stopPropagation();
  const preventDefault =
      !this.dispatchEvent(new Event('remove', {cancelable: true}));
  if (preventDefault) {
    return;
  }

  this.remove();
}
