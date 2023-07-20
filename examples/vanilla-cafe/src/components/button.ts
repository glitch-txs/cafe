import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import { store } from '../store';

@customElement('increment-button')
export class IncrementButton extends LitElement {

  increment(){
    store.set.count(p => p + 1)
  }

  render() {
    return html`<button @click=${this.increment} >Increment</button>`;
  }
}