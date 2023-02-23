/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';

import {Field} from './field.js';

/**
 * An outlined field component.
 */
export class OutlinedField extends Field {
  protected override renderOutline(floatingLabel: TemplateResult) {
    return html`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          ${floatingLabel}
        </div>
        <div class="outline-end"></div>
      </div>
    `;
  }
}
