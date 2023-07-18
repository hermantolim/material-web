/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as elevatedStyles} from './lib/elevated-styles.css.js';
import {FilterChip} from './lib/filter-chip.js';
import {styles as forcedColorsStyles} from './lib/filter-forced-colors-styles.css.js';
import {styles} from './lib/filter-styles.css.js';
import {styles as selectableStyles} from './lib/selectable-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {styles as trailingIconStyles} from './lib/trailing-icon-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filter-chip': MdFilterChip;
  }
}

/**
 * TODO(b/243982145): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-filter-chip')
export class MdFilterChip extends FilterChip {
  static override styles = [
    sharedStyles, elevatedStyles, trailingIconStyles, selectableStyles, styles,
    forcedColorsStyles
  ];
}
